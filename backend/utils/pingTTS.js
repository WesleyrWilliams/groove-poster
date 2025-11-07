// utils/pingTTS.js
// Keeps Hugging Face TTS Space awake by pinging every 3 minutes

import axios from 'axios';

const TTS_URL = "https://wes22-linely-tts.hf.space";
const INTERVAL_MS = 3 * 60 * 1000;

export async function pingTts({ source = 'interval', log = true } = {}) {
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
        validateStatus: () => true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GrooveSzn/1.0)'
        }
      });

      if (response.status < 600) {
        if (log) {
          console.log(`✅ TTS Space pinged successfully [${source}] (status ${response.status}):`, new Date().toLocaleTimeString());
        }
        return { ok: true, status: response.status, url };
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404) {
        if (log) {
          console.log(`✅ TTS Space is awake (endpoint ${status}) [${source}]:`, new Date().toLocaleTimeString());
        }
        return { ok: true, status, url };
      }

      const reason = err.code || err.message || 'unknown-error';
      if (log) {
        console.warn(`⚠️ TTS Space ping error [${source}] (${reason}) for ${url}`);
      }
    }
  }

  if (log) {
    console.warn(`⚠️ TTS Space ping timeout [${source}] - will retry in ${INTERVAL_MS / 60000} min:`, new Date().toLocaleTimeString());
  }
  return { ok: false, error: 'timeout' };
}

export default function startTtsPinger() {
  if (globalThis.__ttsPinger) {
    return;
  }

  const tick = () => pingTts().catch((err) => {
    console.error('❌ Unhandled TTS ping error:', err);
  });

  tick();
  const interval = setInterval(tick, INTERVAL_MS);
  globalThis.__ttsPinger = interval;

  console.log("🔄 TTS Space pinger started (pinging every 3 minutes to prevent sleeping)");
}


