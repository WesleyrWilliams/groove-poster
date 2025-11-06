import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSRTWithWhisperAPI } from './whisper-api.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use /tmp on Vercel (serverless), or relative temp directory locally
let TEMP_DIR = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME 
  ? '/tmp'  // Vercel/Lambda writable directory
  : path.join(__dirname, '../../temp');  // Local development

// Ensure temp directory exists (only if not /tmp - /tmp always exists on Vercel)
if (TEMP_DIR !== '/tmp' && !fs.existsSync(TEMP_DIR)) {
  try {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  } catch (error) {
    // If mkdir fails, fallback to /tmp
    console.warn(`⚠️ Could not create ${TEMP_DIR}, using /tmp instead`);
    TEMP_DIR = '/tmp';
  }
}

/**
 * Find yt-dlp binary
 */
async function findYtDlp() {
  try {
    await execAsync('which yt-dlp');
    return 'yt-dlp';
  } catch {
    // Try common paths
    if (fs.existsSync('/Users/mac/Library/Python/3.9/bin/yt-dlp')) {
      return '/Users/mac/Library/Python/3.9/bin/yt-dlp';
    }
    throw new Error('yt-dlp not found. Install via: brew install yt-dlp or pip install yt-dlp');
  }
}

/**
 * Extract audio from YouTube video using yt-dlp
 * @param {string} videoUrl - YouTube video URL
 * @param {string} outputPath - Output audio file path
 * @returns {Promise<string>} Path to audio file
 */
async function extractAudio(videoUrl, outputPath) {
  try {
    console.log(`🎵 Extracting audio from: ${videoUrl}`);
    
    const ytDlp = await findYtDlp();
    const command = `${ytDlp} -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${videoUrl}"`;
    
    await execAsync(command);
    console.log(`✅ Audio extracted: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('❌ Error extracting audio:', error.message);
    throw error;
  }
}

export async function getTranscript(videoId, videoUrl = null) {
  try {
    // Step 1: Try YouTube transcript API first (fastest, free)
    const languages = ['en', 'en-US', 'en-GB', 'auto'];
    
    for (const lang of languages) {
      try {
        const response = await axios.get(
          `https://www.youtube.com/api/timedtext`,
          {
            params: {
              v: videoId,
              lang: lang,
              fmt: 'json3',
            },
            timeout: 10000,
          }
        );
        
        if (response.data && response.data.events) {
          const transcript = response.data.events
            .filter(event => event.segs)
            .map(event => ({
              text: event.segs.map(seg => seg.utf8).join(''),
              start: event.tStartMs / 1000,
              duration: event.dDurationMs / 1000,
            }))
            .filter(item => item.text.trim().length > 0);
          
          if (transcript.length > 0) {
            console.log(`✅ Got YouTube transcript in ${lang} (${transcript.length} segments)`);
            return transcript;
          }
        }
      } catch (langError) {
        // Try next language
        continue;
      }
    }
    
    // Step 2: Fallback to Whisper API (works on any video)
    if (videoUrl) {
      console.log('⚠️ No YouTube captions, using Whisper transcription...');
      return await getTranscriptWithWhisper(videoUrl, videoId);
    }
    
    // No video URL provided, can't use Whisper
    throw new Error('No transcript available and no video URL for Whisper fallback');
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    console.warn('⚠️ Note: Transcript fetch failed. System will use timeline-based clips.');
    
    // Final fallback: Return empty transcript (will use timeline-based clips)
    return [];
  }
}

/**
 * Get transcript using Whisper API (OpusAI-style)
 * @param {string} videoUrl - YouTube video URL
 * @param {string} videoId - Video ID for temp file naming
 * @returns {Promise<Array>} Transcript array
 */
async function getTranscriptWithWhisper(videoUrl, videoId) {
  const audioPath = path.join(TEMP_DIR, `${videoId}_audio.mp3`);
  const srtPath = path.join(TEMP_DIR, `${videoId}_transcript.srt`);
  
  try {
    // Step 1: Extract audio
    await extractAudio(videoUrl, audioPath);
    
    // Step 2: Transcribe with Whisper API
    await generateSRTWithWhisperAPI(audioPath, srtPath);
    
    // Step 3: Parse SRT to transcript format
    const srtContent = fs.readFileSync(srtPath, 'utf8');
    const transcript = parseSRTToTranscript(srtContent);
    
    // Cleanup audio file (keep SRT for potential reuse)
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
    
    console.log(`✅ Whisper transcription complete (${transcript.length} segments)`);
    return transcript;
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    throw error;
  }
}

/**
 * Parse SRT content to transcript format
 * @param {string} srtContent - SRT file content
 * @returns {Array} Transcript array with {text, start, duration}
 */
function parseSRTToTranscript(srtContent) {
  const transcript = [];
  const blocks = srtContent.split('\n\n').filter(block => block.trim());
  
  for (const block of blocks) {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length < 2) continue;
    
    // Skip index line, parse timestamp line
    const timeLine = lines[1];
    const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!timeMatch) continue;
    
    const startHours = parseInt(timeMatch[1]);
    const startMinutes = parseInt(timeMatch[2]);
    const startSeconds = parseInt(timeMatch[3]);
    const startMs = parseInt(timeMatch[4]);
    const start = startHours * 3600 + startMinutes * 60 + startSeconds + startMs / 1000;
    
    const endHours = parseInt(timeMatch[5]);
    const endMinutes = parseInt(timeMatch[6]);
    const endSeconds = parseInt(timeMatch[7]);
    const endMs = parseInt(timeMatch[8]);
    const end = endHours * 3600 + endMinutes * 60 + endSeconds + endMs / 1000;
    
    const text = lines.slice(2).join(' ').trim();
    if (text) {
      transcript.push({
        text,
        start,
        duration: end - start
      });
    }
  }
  
  return transcript;
}

export async function getBestMoments(transcript, numClips = 3) {
  // Simple heuristic: Find segments with most engaging words
  const engagingWords = [
    'incredible', 'amazing', 'unbelievable', 'shocking', 'wow', 'wow',
    'finally', 'actually', 'really', 'absolutely', 'perfect', 'best',
    'never', 'always', 'everything', 'nothing', 'mind', 'blown',
    'surprising', 'secret', 'truth', 'important', 'key', 'crucial'
  ];
  
  // Score each segment
  const scoredSegments = transcript.map(segment => {
    const text = segment.text.toLowerCase();
    const score = engagingWords.reduce((count, word) => {
      return count + (text.includes(word) ? 1 : 0);
    }, 0);
    
    return {
      ...segment,
      score: score + Math.random() * 2, // Add some randomness
    };
  });
  
  // Sort by score and get top N
  const bestMoments = scoredSegments
    .sort((a, b) => b.score - a.score)
    .slice(0, numClips)
    .map(segment => ({
      start: segment.start,
      end: segment.start + segment.duration,
      text: segment.text,
      score: segment.score,
    }));
  
  return bestMoments;
}

