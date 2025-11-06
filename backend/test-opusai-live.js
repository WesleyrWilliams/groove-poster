/**
 * Live OpusAI-style Pipeline Test
 * Tests the full flow: YouTube → Transcription → AI Analysis → Clipping → Upload
 */

import dotenv from 'dotenv';
import { process5ClipsFromVideo } from './src/clip-processor.js';
import { addLog } from './src/workflow-logger.js';

dotenv.config();

const TEST_VIDEO_URL = "https://youtu.be/oBXSvS2QKxU?si=NnVhjK76wW9C68UJ";

async function runLiveTest() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   🧪 LIVE OPUSAI-STYLE PIPELINE TEST                     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log(`📹 Video URL: ${TEST_VIDEO_URL}\n`);
  
  const workflowId = `live-test-${Date.now()}`;
  
  try {
    addLog('🚀 Starting live OpusAI-style pipeline test...', 'trigger', workflowId);
    
    // Process 5 clips with upload enabled
    const result = await process5ClipsFromVideo(TEST_VIDEO_URL, {
      uploadToYouTube: true,
      workflowId: workflowId
    });
    
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   ✅ TEST COMPLETE                                        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log(`📊 Results Summary:`);
    console.log(`   - Total clips processed: ${result.processedClips?.length || 0}`);
    console.log(`   - Clips uploaded: ${result.uploadedClips?.length || 0}`);
    console.log(`   - AI Analysis clips found: ${result.analysis?.clips?.length || 0}`);
    
    if (result.analysis?.clips) {
      console.log(`\n🎯 Top Clips (by trend_score):`);
      result.analysis.clips.slice(0, 5).forEach((clip, i) => {
        console.log(`   ${i + 1}. ${clip.start || clip.startSeconds}s - ${clip.end || clip.endSeconds}s`);
        console.log(`      Score: ${clip.trend_score || 'N/A'}`);
        console.log(`      Emotion: ${clip.emotion || 'N/A'}`);
        console.log(`      Reason: ${clip.reason || 'N/A'}`);
      });
    }
    
    if (result.uploadedClips && result.uploadedClips.length > 0) {
      console.log(`\n📤 Uploaded Videos:`);
      result.uploadedClips.forEach((upload, i) => {
        console.log(`   ${i + 1}. ${upload.title || 'Untitled'}`);
        console.log(`      Video ID: ${upload.videoId || 'N/A'}`);
        console.log(`      URL: https://youtube.com/watch?v=${upload.videoId || 'N/A'}`);
      });
    }
    
    addLog('✅ Live test completed successfully', 'success', workflowId);
    return result;
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    addLog(`❌ Live test failed: ${error.message}`, 'error', workflowId);
    throw error;
  }
}

// Run the test
runLiveTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

