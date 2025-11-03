import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processVideoWithFreeTools, processChannelAutomatically } from './src/new-workflow.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🎉 GrooveSzn Shorts Generator API is live! 🎉',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      processVideo: '/api/process-video',
      processChannel: '/api/process-channel',
      privacy: '/privacy',
      terms: '/terms',
      oauth2: '/oauth2',
      oauth2Callback: '/oauth2callback'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'GrooveSzn API is running - FREE VERSION',
    timestamp: new Date().toISOString()
  });
});

// Privacy Policy (required by TikTok/YouTube)
app.get('/privacy', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Privacy Policy - GrooveSzn Shorts Generator</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #333; }
        p { line-height: 1.6; color: #666; }
      </style>
    </head>
    <body>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
      <h2>Overview</h2>
      <p>Your privacy is important to us. GrooveSzn Shorts Generator respects your data and privacy.</p>
      <h2>What We Collect</h2>
      <ul>
        <li>YouTube video URLs you provide for processing</li>
        <li>Usage statistics to improve our service</li>
      </ul>
      <h2>What We Don't Collect</h2>
      <ul>
        <li>We do NOT store personal information</li>
        <li>We do NOT share your data with third parties</li>
        <li>We do NOT track your activity outside our service</li>
      </ul>
      <h2>Security</h2>
      <p>All API communication is encrypted. Your data is processed securely and not stored permanently.</p>
      <h2>Contact</h2>
      <p>If you have questions about this privacy policy, please contact us through GitHub.</p>
    </body>
    </html>
  `);
});

// Terms of Service (required by TikTok/YouTube)
app.get('/terms', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Terms of Service - GrooveSzn Shorts Generator</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #333; }
        p { line-height: 1.6; color: #666; }
      </style>
    </head>
    <body>
      <h1>Terms of Service</h1>
      <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
      <h2>Acceptance of Terms</h2>
      <p>By using GrooveSzn Shorts Generator, you agree to these terms of service.</p>
      <h2>Service Description</h2>
      <p>GrooveSzn is an AI-powered tool that automatically creates and uploads short-form videos to multiple social media platforms.</p>
      <h2>User Responsibilities</h2>
      <ul>
        <li>You must own or have rights to the content you process</li>
        <li>You must comply with TikTok, YouTube, Instagram, and Facebook's terms of service</li>
        <li>You are responsible for all content uploaded through our service</li>
      </ul>
      <h2>Limitation of Liability</h2>
      <p>GrooveSzn is provided "as is" without warranties. We are not responsible for content uploaded to social media platforms.</p>
      <h2>Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of new terms.</p>
    </body>
    </html>
  `);
});

// Process single video
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

// Process YouTube channel
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

// Google OAuth Routes
app.get('/oauth2', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://groove-poster-backend.vercel.app/oauth2callback';
  const scope = encodeURIComponent('https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/spreadsheets');
  const responseType = 'code';
  const accessType = 'offline';
  const prompt = 'consent';
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&prompt=${prompt}`;
  
  res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://groove-poster-backend.vercel.app/oauth2callback';
    const tokenUrl = process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token';

    // Exchange code for tokens
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code.toString(),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json({ 
        error: 'Failed to exchange code for tokens',
        details: tokens 
      });
    }

    // Success - return tokens (in production, store these securely)
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Success - GrooveSzn</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; text-align: center; }
          h1 { color: #10b981; }
          .success { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .token { background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px; margin: 10px 0; }
          .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; color: #92400e; }
        </style>
      </head>
      <body>
        <h1>✅ OAuth Authorization Successful!</h1>
        <div class="success">
          <p>Your Google account has been successfully authorized.</p>
        </div>
        <div class="warning">
          <strong>⚠️ Important:</strong> Store these tokens securely. In production, these should be saved to a database or secure storage.
        </div>
        <h3>Access Token:</h3>
        <div class="token">${tokens.access_token || 'N/A'}</div>
        ${tokens.refresh_token ? `
          <h3>Refresh Token:</h3>
          <div class="token">${tokens.refresh_token}</div>
        ` : ''}
        <p><strong>Expires in:</strong> ${tokens.expires_in || 'N/A'} seconds</p>
        <p><strong>Token type:</strong> ${tokens.token_type || 'Bearer'}</p>
        <p style="margin-top: 30px;">
          <a href="/" style="color: #2563eb; text-decoration: none;">← Back to API</a>
        </p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ 
      error: 'OAuth callback failed', 
      message: error.message 
    });
  }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 GrooveSzn Shorts Generator running on http://localhost:${PORT}`);
    console.log(`📝 Health: http://localhost:${PORT}/health`);
    console.log(`🔒 Privacy: http://localhost:${PORT}/privacy`);
    console.log(`📋 Terms: http://localhost:${PORT}/terms`);
    console.log(`🔐 OAuth: http://localhost:${PORT}/oauth2`);
    console.log(`↪️  OAuth Callback: http://localhost:${PORT}/oauth2callback`);
  });
}

// Export for Vercel
export default app;

