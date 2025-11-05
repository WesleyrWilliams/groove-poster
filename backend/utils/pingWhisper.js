// utils/pingWhisper.js
// Keeps Hugging Face Whisper Space awake by pinging every 5 minutes

import axios from 'axios';

const WHISPER_URL = "https://wes22-linely-whisper-api.hf.space";

async function pingWhisper() {
  const random = Math.floor(Math.random() * 10000);
  // Try multiple endpoints - some HF Spaces respond to root, some to /api/predict
  const urls = [
    `${WHISPER_URL}?ping=${random}`,
    `${WHISPER_URL}/api/predict`,
    `${WHISPER_URL}/`
  ];

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        timeout: 15000, // Increased to 15 seconds - HF Spaces can take time to wake up
        validateStatus: (status) => status < 500, // Don't throw on 404, etc.
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GrooveSzn/1.0)'
        }
      });

      // Any response (even 404) means the Space is awake
      if (response.status < 500) {
        console.log("✅ Whisper Space pinged successfully:", new Date().toLocaleTimeString());
        return; // Success, no need to try other URLs
      }
    } catch (err) {
      // Continue to next URL if this one fails
      if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
        // Timeout - Space might be sleeping, try next URL
        continue;
      } else if (err.response?.status === 405 || err.response?.status === 404) {
        // Method not allowed or not found - Space is awake but endpoint doesn't exist
        console.log("✅ Whisper Space is awake (endpoint not found, but Space is responding):", new Date().toLocaleTimeString());
        return; // Space is responding, that's good enough
      }
      // Other errors - try next URL
      continue;
    }
  }
  
  // If all URLs failed, log a warning but don't treat as critical
  console.log("⚠️ Whisper Space ping timeout (Space may be sleeping, will retry in 5 min):", new Date().toLocaleTimeString());
}

export default function startWhisperPinger() {
  // Run immediately
  pingWhisper();

  // Repeat every 3 minutes (more frequent to prevent sleeping)
  // HF Spaces sleep after ~5 minutes of inactivity, so 3 minutes keeps them awake
  setInterval(pingWhisper, 3 * 60 * 1000);
  
  console.log("🔄 Whisper Space pinger started (pinging every 3 minutes to prevent sleeping)");
}

