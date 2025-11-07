// utils/pingWhisper.js
// Keeps Hugging Face Whisper Space awake by pinging every 5 minutes

import axios from 'axios';

const WHISPER_URL = "https://wes22-linely-whisper-api.hf.space";
const INTERVAL_MS = 3 * 60 * 1000;

export async function pingWhisper({ source = 'interval', log = true } = {}) {
  const random = Math.floor(Math.random() * 10000);
  const urls = [
    `${WHISPER_URL}?ping=${random}`,
    `${WHISPER_URL}/api/predict`,
    `${WHISPER_URL}/`
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
          console.log(`✅ Whisper Space pinged successfully [${source}] (status ${response.status}):`, new Date().toLocaleTimeString());
        }
        return { ok: true, status: response.status, url };
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404) {
        if (log) {
          console.log(`✅ Whisper Space is awake (endpoint ${status}) [${source}]:`, new Date().toLocaleTimeString());
        }
        return { ok: true, status, url };
      }

      const reason = err.code || err.message || 'unknown-error';
      if (log) {
        console.warn(`⚠️ Whisper Space ping error [${source}] (${reason}) for ${url}`);
      }
    }
  }

  if (log) {
    console.warn(`⚠️ Whisper Space ping timeout [${source}] - will retry in ${INTERVAL_MS / 60000} min:`, new Date().toLocaleTimeString());
  }
  return { ok: false, error: 'timeout' };
}

export default function startWhisperPinger() {
  if (globalThis.__whisperPinger) {
    return;
  }

  const tick = () => pingWhisper().catch((err) => {
    console.error('❌ Unhandled Whisper ping error:', err);
  });

  tick();
  const interval = setInterval(tick, INTERVAL_MS);
  globalThis.__whisperPinger = interval;

  console.log("🔄 Whisper Space pinger started (pinging every 3 minutes to prevent sleeping)");
}

