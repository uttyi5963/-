// Web Speech API wrapper for Japanese TTS + optional cloud TTS + recording.

let cached = { japanese: null, ready: false };

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;
  const japanese = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ja'));
  cached.japanese = japanese || null;
  cached.ready = true;
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function canSpeak() {
  return 'speechSynthesis' in window || hasCloudKey();
}

// ----- Profile lookups -----
function profile() {
  try { return JSON.parse(localStorage.getItem('aiou-nihongo/profile') || '{}'); }
  catch (_) { return {}; }
}
function audioCfg() {
  try { return JSON.parse(localStorage.getItem('aiou-nihongo/audio-cloud') || '{}'); }
  catch (_) { return {}; }
}
export function getCloudConfig() { return audioCfg(); }
export function setCloudConfig(cfg) {
  localStorage.setItem('aiou-nihongo/audio-cloud', JSON.stringify(cfg || {}));
}
export function hasCloudKey() {
  const c = audioCfg();
  return Boolean(c.provider && c.apiKey);
}

// ----- Web Speech fallback -----
function speakWeb(text, opts) {
  if (!('speechSynthesis' in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    if (cached.japanese) u.voice = cached.japanese;
    let rate = opts.rate;
    if (rate == null) rate = profile().audioSpeed ?? 0.9;
    u.rate = rate;
    u.pitch = opts.pitch ?? 1;
    u.volume = opts.volume ?? 1;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) {
    console.warn('Web TTS failed', e);
    return false;
  }
}

// ----- Cloud TTS (OpenAI) -----
let lastAudio = null;
async function speakCloud(text, opts) {
  const cfg = audioCfg();
  if (!cfg.provider || !cfg.apiKey) return false;
  const rate = opts.rate ?? profile().audioSpeed ?? 0.9;
  try {
    if (cfg.provider === 'openai') {
      const resp = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cfg.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: cfg.model || 'gpt-4o-mini-tts',
          voice: cfg.voice || 'nova',
          input: text,
          speed: rate,
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        console.warn('Cloud TTS failed', resp.status, errText);
        return false;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      if (lastAudio) { try { lastAudio.pause(); } catch (_) {} }
      lastAudio = new Audio(url);
      lastAudio.play();
      lastAudio.addEventListener('ended', () => URL.revokeObjectURL(url));
      return true;
    }
  } catch (e) {
    console.warn('Cloud TTS error', e);
  }
  return false;
}

// ----- Public speak -----
export function speakJa(text, opts = {}) {
  if (!text) return;
  if (hasCloudKey()) {
    speakCloud(text, opts).then((ok) => { if (!ok) speakWeb(text, opts); });
  } else {
    speakWeb(text, opts);
  }
}

export function stopSpeak() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (lastAudio) { try { lastAudio.pause(); } catch (_) {} lastAudio = null; }
}

// Returns whether auto-play is currently enabled in profile.
export function isAutoPlayEnabled() {
  return profile().audioAutoPlay !== false;
}

// List of available Japanese voices (if any) for picker UIs.
export function japaneseVoices() {
  if (!('speechSynthesis' in window)) return [];
  return (window.speechSynthesis.getVoices() || []).filter((v) => v.lang && v.lang.toLowerCase().startsWith('ja'));
}

// ----- Recording (MediaRecorder) -----
export function canRecord() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

// Records up to `ms` milliseconds of audio.
// Returns { blob, url, play(), cleanup() }.
export async function recordAudio(ms = 2500) {
  if (!canRecord()) throw new Error('Recording not supported');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mr = new MediaRecorder(stream);
  const chunks = [];
  return await new Promise((resolve, reject) => {
    mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      resolve({
        blob,
        url,
        play() { audio.currentTime = 0; audio.play(); },
        cleanup() { URL.revokeObjectURL(url); },
      });
    };
    mr.onerror = (e) => reject(e.error || e);
    mr.start();
    setTimeout(() => { try { mr.stop(); } catch (_) {} }, ms);
  });
}

// Optional STT support (used by AI conversation view if available).
export function createRecognizer(lang = 'ja-JP') {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  return rec;
}
