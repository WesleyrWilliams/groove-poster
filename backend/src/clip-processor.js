/**
 * Process 5 Clips from a Specific Video
 * Extracts and processes 5 clips from a YouTube video URL
 */

import dotenv from 'dotenv';
dotenv.config();

import { processVideoToShort } from './video-processor-enhanced.js';
import { getVideoDetails } from './youtube-fetcher.js';
import { getTranscript } from './transcript-api.js';
import { generateVideoAnalysis } from './openrouter.js';
import { uploadToYouTubeShorts } from './trending-workflow.js';
import { addLog } from './workflow-logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGO_PATH = path.join(__dirname, '../logo.png');

/**
 * Process 5 clips from a specific YouTube video
 * @param {string} videoUrl - YouTube video URL
 * @param {object} options - Processing options
 * @returns {Promise<object>} Processing results
 */
export async function process5ClipsFromVideo(videoUrl, options = {}) {
  const { uploadToYouTube = false, watermarkPath = LOGO_PATH, workflowId = null } = options;
  
  try {
    // Extract video ID
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : videoUrl.split('v=')[1]?.split('&')[0] || videoUrl;
    
    // Step 1: Get video details
    addLog('📊 Fetching video details...', 'search', workflowId);
    const details = await getVideoDetails(videoId);
    addLog(`✅ Found: "${details.title}"`, 'success', workflowId);
    
    // Step 2: Get transcript (OpusAI-style: YouTube → Whisper fallback)
    addLog('📝 Getting transcript (OpusAI-style)...', 'transcribe', workflowId);
    let transcript = [];
    try {
      transcript = await getTranscript(videoId, videoUrl);
      if (transcript.length > 0) {
        addLog(`✅ Got ${transcript.length} transcript segments`, 'success', workflowId);
      } else {
        addLog('⚠️ No transcript available, will use timeline-based clips', 'processing', workflowId);
      }
    } catch (error) {
      addLog(`⚠️ Transcript fetch failed: ${error.message}`, 'processing', workflowId);
    }
    
    let clipsToProcess = [];
    let analysis = {};
    
    if (transcript.length === 0) {
      addLog('⚠️ No transcript available, using fallback: create 5 clips from timeline', 'processing', workflowId);
      
      // Fallback: Create 5 clips evenly distributed across the video
      const videoDuration = details.duration || 600;
      const clipDuration = 30; // 30 seconds per clip
      const totalClips = 5;
      const startInterval = Math.floor((videoDuration - (clipDuration * totalClips)) / totalClips);
      
      console.log(`📊 Creating ${totalClips} clips from ${videoDuration}s video...`);
      console.log(`   Clip duration: ${clipDuration}s`);
      console.log(`   Start interval: ${startInterval}s\n`);
      
      clipsToProcess = [];
      for (let i = 0; i < totalClips; i++) {
        const startTime = i * startInterval;
        const endTime = startTime + clipDuration;
        
        if (endTime <= videoDuration) {
          clipsToProcess.push({
            startSeconds: startTime,
            endSeconds: endTime,
            reason: `Clip ${i + 1} from timeline (${startTime}s - ${endTime}s)`
          });
        }
      }
      
      analysis = {
        title: details.title || 'Viral Moment 🔥',
        subtitle: 'Highlights from this video',
        reason: 'Top moments extracted from video timeline',
        hashtags: ['#viral', '#shorts', '#trending']
      };
    } else {
      console.log(`✅ Got ${transcript.length} transcript segments\n`);
      
      // Step 3: AI Analysis to find best clips
      addLog('🤖 Analyzing video with AI for best clips...', 'processing', workflowId);
      analysis = await generateVideoAnalysis(details, transcript);
      addLog(`✅ AI analysis complete: Found ${analysis.clips?.length || 0} clips`, 'success', workflowId);
      
      // Get top 5 clips
      clipsToProcess = (analysis.clips || []).slice(0, 5);
      
      if (clipsToProcess.length === 0) {
        // Fallback to timeline if no clips found
        const videoDuration = details.duration || 600;
        const clipDuration = 30;
        const startInterval = Math.floor((videoDuration - (clipDuration * 5)) / 5);
        
        for (let i = 0; i < 5; i++) {
          clipsToProcess.push({
            startSeconds: i * startInterval,
            endSeconds: i * startInterval + clipDuration,
            reason: `Clip ${i + 1} from timeline`
          });
        }
      }
    }
    
    addLog(`✂️ Processing ${clipsToProcess.length} clips...`, 'clip', workflowId);
    
    const processedClips = [];
    
    // Process each clip
    for (let i = 0; i < clipsToProcess.length; i++) {
      const clip = clipsToProcess[i];
      const clipNumber = i + 1;
      
      const startTime = clip.startSeconds || clip.start || 0;
      const endTime = clip.endSeconds || clip.end || 30;
      const duration = Math.min(Math.max(endTime - startTime, 15), 60);
      
      addLog(`✂️ Clipping video ${clipNumber}/${clipsToProcess.length} (${startTime}s-${endTime}s)...`, 'clip', workflowId);
      
      try {
        const result = await processVideoToShort(
          details.url,
          startTime,
          duration,
          {
            title: analysis.title || `Clip ${clipNumber}: ${clip.reason || 'Viral Moment'}`,
            subtitle: analysis.subtitle || '',
            watermarkPath: watermarkPath,
            titleFontSize: 56,
            subtitleFontSize: 34
          }
        );
        
        console.log(`   ✅ Clip ${clipNumber} processed successfully!`);
        console.log(`   📁 Output: ${result.videoPath}\n`);
        
        processedClips.push({
          clipNumber,
          startTime,
          endTime,
          duration,
          videoPath: result.videoPath,
          title: analysis.title || `Clip ${clipNumber}`,
          subtitle: analysis.subtitle || '',
          reason: clip.reason,
          hashtags: analysis.hashtags || ['#viral', '#shorts', '#trending'],
          cleanup: result.cleanup
        });
        
      } catch (error) {
        console.error(`   ❌ Error processing clip ${clipNumber}:`, error.message);
        console.error(`   ⏭️  Skipping clip ${clipNumber}...\n`);
      }
    }
    
    // Upload to YouTube if enabled
    let uploadedCount = 0;
    if (uploadToYouTube && processedClips.length > 0) {
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('📤 STEP 5: UPLOADING CLIPS TO YOUTUBE SHORTS');
      console.log('═══════════════════════════════════════════════════════════\n');
      
      for (let i = 0; i < processedClips.length; i++) {
        const clip = processedClips[i];
        addLog(`📤 Uploading clip ${clip.clipNumber}/${processedClips.length} to YouTube...`, 'upload', workflowId);
        console.log(`   Title: ${clip.title}`);
        console.log(`   Path: ${clip.videoPath}\n`);
        
        try {
          const uploadResult = await uploadToYouTubeShorts({
            videoPath: clip.videoPath,
            title: clip.title,
            subtitle: clip.subtitle,
            reason: clip.reason,
            hashtags: clip.hashtags
          });
          
          console.log(`   ✅ Clip ${clip.clipNumber} uploaded successfully!`);
          console.log(`   Video ID: ${uploadResult.videoId}`);
          console.log(`   URL: ${uploadResult.videoUrl}\n`);
          
          processedClips[i].uploaded = true;
          processedClips[i].youtubeVideoId = uploadResult.videoId;
          processedClips[i].youtubeVideoUrl = uploadResult.videoUrl;
          uploadedCount++;
          
          // Cleanup after successful upload
          if (clip.cleanup) {
            clip.cleanup();
          }
        } catch (uploadError) {
          console.error(`   ❌ Error uploading clip ${clip.clipNumber}:`, uploadError.message);
          processedClips[i].uploaded = false;
          processedClips[i].uploadError = uploadError.message;
        }
      }
      
      console.log(`\n✅ Upload Summary: ${uploadedCount}/${processedClips.length} clips uploaded successfully\n`);
    }
    
    // Summary
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   ✅ PROCESSING COMPLETE                                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log(`📊 Summary:`);
    console.log(`   ✅ Successfully processed: ${processedClips.length}/${clipsToProcess.length} clips`);
    if (uploadToYouTube) {
      console.log(`   ✅ Successfully uploaded: ${uploadedCount}/${processedClips.length} clips\n`);
    }
    
    return {
      success: true,
      totalClips: clipsToProcess.length,
      processedClips: processedClips.length,
      uploadedClips: uploadedCount,
      clips: processedClips
    };
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    throw error;
  }
}

