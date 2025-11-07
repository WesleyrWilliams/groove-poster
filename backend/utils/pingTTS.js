// utils/pingTTS.js
// Keeps Hugging Face TTS Space awake by pinging every 3 minutes

import axios from 'axios';

const TTS_URL = "https://wes22-linely-tts.hf.space";

async function pingTts() {
  const random = Math.floor(Math.random() * 10000);
  const urls = [
    `${TTS_URL}?ping=${random}`,
    `${TTS_URL}/api/predict`,
    `${TTS_URL}/`
  ];

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        validateStatus: (status) => status < 500,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GrooveSzn/1.0)'
        }
      });

      if (response.status < 500) {
        console.log("✅ TTS Space pinged successfully:", new Date().toLocaleTimeString());
        return;
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
        continue;
      } else if (err.response?.status === 405 || err.response?.status === 404) {
        console.log("✅ TTS Space is awake (endpoint not found, but Space is responding):", new Date().toLocaleTimeString());
        return;
      }
      continue;
    }
  }

  console.log("⚠️ TTS Space ping timeout (Space may be sleeping, will retry in 3 min):", new Date().toLocaleTimeString());
}

export default function startTtsPinger() {
  pingTts();
  setInterval(pingTts, 3 * 60 * 1000);
  console.log("🔄 TTS Space pinger started (pinging every 3 minutes to prevent sleeping)");
}


