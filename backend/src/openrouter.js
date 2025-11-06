import axios from 'axios';

export async function generateCaption(transcript) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: "You're a helpful, intelligent social media assistant. You make captions for Instagram, TikTok, YouTube Shorts, and Facebook.",
          },
          {
            role: 'user',
            content: `Your task is to generate high-quality, engaging captions for Instagram, TikTok, YouTube Shorts, and Facebook.

You'll be fed a transcript.

Return your captions in JSON using this format:

{"caption":""}

Rules:
- Keep captions to ~100 words.
- Use a spartan tone of voice, favoring the classic Western style (though still a fit for Instagram and TikTok).
- Write conversationally, i.e as if I were doing the writing myself (in first person).
- Use emojis, but sparingly.
- Ensure each sentence is over 5 words long. Write for a University reading level.

Transcript: ${transcript}`,
          },
        ],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.WEBHOOK_URL || 'http://localhost:3001',
          'X-Title': 'Social Media Caption Generator',
          'Content-Type': 'application/json',
        },
      }
    );
    
    const content = response.data.choices[0].message.content;
    
    // Parse JSON response
    try {
      return JSON.parse(content);
    } catch {
      // If not JSON, wrap in object
      return { caption: content };
    }
  } catch (error) {
    console.error('Error generating caption:', error.response?.data || error.message);
    throw new Error('Failed to generate caption');
  }
}

/**
 * Generate title, timestamps, and hashtags for trending video
 * @param {object} videoDetails - Video details (title, views, etc.)
 * @param {Array} transcript - Transcript array with start, duration, text
 * @returns {Promise<object>} Analysis with title, timestamps, hashtags, reason
 */
/**
 * OpusAI-style AI analysis with emotion and trend scoring
 * @param {object} videoDetails - Video metadata
 * @param {Array} transcript - Transcript segments
 * @returns {Promise<object>} Analysis with clips, scores, and reasons
 */
export async function generateVideoAnalysis(videoDetails, transcript) {
  try {
    const transcriptText = transcript.map(t => 
      `[${Math.floor(t.start)}s] ${t.text}`
    ).join('\n');
    
    const prompt = `You are an AI video editor like OpusAI. Analyze this transcript to detect emotional intensity, trending potential, and engagement cues.

Video Metadata:
- Title: ${videoDetails.title || 'Unknown'}
- Views: ${parseInt(videoDetails.viewCount || 0).toLocaleString()}
- Likes: ${parseInt(videoDetails.likeCount || 0).toLocaleString()}
- Channel: ${videoDetails.channelTitle || 'Unknown'}
- Duration: ${videoDetails.duration || 'Unknown'} seconds

Full Transcript (with timestamps):
${transcriptText.substring(0, 8000)}${transcriptText.length > 8000 ? '\n[... truncated for length]' : ''}

Your Task (OpusAI-style):
1. Analyze emotional intensity, humor, surprise, and engagement cues
2. Score each interesting segment (0-10) for trend potential
3. Select the best 1-5 timestamp ranges (15-30 seconds each) with highest engagement
4. Explain WHY each moment is viral-worthy (emotion, humor, shock value)
5. Generate a catchy, ALL-CAPS title (80-120 chars) with emojis
6. Create a subtitle that adds context/hooks
7. Suggest 3-5 relevant hashtags

Return ONLY valid JSON in this exact format:
{
  "reason": "Why this video is trending (1-2 sentences)",
  "clips": [
    {
      "start": "00:02",
      "end": "00:22",
      "startSeconds": 2,
      "endSeconds": 22,
      "reason": "Emotional peak - shocking revelation moment",
      "trend_score": 8.7,
      "emotion": "shock",
      "engagement_cues": ["surprise", "controversy", "emotional"]
    }
  ],
  "title": "CAMILLA ARAUJO REVEALS HER $50M WILL GOES TO HER BROTHER 😢💖💰",
  "subtitle": "No way Camilla Araujo just EXPOSED N3on after CAUGHT him 'DIPPING'",
  "hashtags": ["#viral", "#shorts", "#trending", "#exposed", "#reaction"]
}

Critical Rules:
- trend_score: 0-10 (10 = most viral potential)
- emotion: "shock" | "humor" | "surprise" | "emotional" | "controversy" | "reaction"
- engagement_cues: Array of keywords describing why it's engaging
- Clips MUST be 15-30 seconds each
- Include startSeconds/endSeconds as numbers (not just MM:SS)
- Choose moments with the highest emotional peaks and engagement
- Title should be ALL-CAPS with strong hook and emojis`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are OpusAI - an expert AI video editor that understands viral content patterns. You detect emotional intensity, engagement cues, and trending potential. You analyze transcripts to find the most engaging moments with emotion/trend scoring.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.WEBHOOK_URL || 'http://localhost:3001',
          'X-Title': 'Video Analysis Generator',
          'Content-Type': 'application/json',
        },
      }
    );
    
    const content = response.data.choices[0].message.content;
    
    // Parse JSON response
    try {
      const analysis = JSON.parse(content);
      
      // Validate and ensure clips have proper format (OpusAI-style)
      if (analysis.clips && Array.isArray(analysis.clips)) {
        analysis.clips = analysis.clips.map(clip => {
          // Convert MM:SS to seconds if needed
          if (clip.start && !clip.startSeconds) {
            const [min, sec] = clip.start.split(':').map(Number);
            clip.startSeconds = (min || 0) * 60 + (sec || 0);
          }
          if (clip.end && !clip.endSeconds) {
            const [min, sec] = clip.end.split(':').map(Number);
            clip.endSeconds = (min || 0) * 60 + (sec || 0);
          }
          
          // Ensure OpusAI-style fields exist
          if (!clip.trend_score) clip.trend_score = 7.0; // Default score
          if (!clip.emotion) clip.emotion = 'engagement';
          if (!clip.engagement_cues) clip.engagement_cues = ['viral', 'trending'];
          
          return clip;
        });
        
        // Sort by trend_score (highest first) - OpusAI-style
        analysis.clips.sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0));
      }
      
      return analysis;
    } catch (parseError) {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error generating video analysis:', error.response?.data || error.message);
    throw new Error('Failed to generate video analysis');
  }
}

