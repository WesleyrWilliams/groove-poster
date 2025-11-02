import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processVideoWithFreeTools, processChannelAutomatically } from './new-workflow.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shorts Generator API is running - FREE VERSION' });
});

// Process single video (NEW - FREE VERSION)
app.post('/api/process-video', async (req, res) => {
  try {
    const { videoUrl, language = 'en' } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ error: 'videoUrl is required' });
    }

    console.log(`\n🚀 New request: Process video ${videoUrl}`);
    
    // Process asynchronously
    processVideoWithFreeTools(videoUrl).then(result => {
      console.log('✅ Video processed successfully');
    }).catch(err => {
      console.error('❌ Video processing failed:', err.message);
    });
    
    res.json({
      success: true,
      message: 'Video processing started (FREE AI-powered)',
      note: 'Processing in background',
    });
  } catch (error) {
    console.error('Error starting video processing:', error);
    res.status(500).json({
      error: error.message || 'Failed to start video processing',
    });
  }
});

// Process YouTube channel (NEW - FREE VERSION)
app.post('/api/process-channel', async (req, res) => {
  try {
    const { channelId, language = 'en' } = req.body;
    
    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }

    console.log(`\n🚀 New request: Process channel ${channelId}`);
    
    // Process asynchronously
    processChannelAutomatically(channelId).then(result => {
      console.log('✅ Channel processed successfully');
    }).catch(err => {
      console.error('❌ Channel processing failed:', err.message);
    });
    
    res.json({
      success: true,
      message: 'Channel processing started (FREE AI-powered)',
      note: 'Processing in background',
    });
  } catch (error) {
    console.error('Error starting channel processing:', error);
    res.status(500).json({
      error: error.message || 'Failed to start channel processing',
    });
  }
});

// Webhook endpoint for Vizard callback
app.post('/webhook/vizard', async (req, res) => {
  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    // Process Vizard project
    console.log(`Received Vizard webhook for project: ${projectId}`);
    
    // Start processing asynchronously (don't await to respond quickly)
    processVizardProject(projectId).catch(console.error);
    
    res.json({ success: true, message: 'Webhook received, processing started' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Shorts Generator API running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

