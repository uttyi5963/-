// Web Speech API wrapper for Japanese TTS.
// Falls back silently when speech synthesis isn't available.

let cached = { japanese: null, ready: false };

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;
  // Prefer Google/Apple Japanese voices when available.
  const japanese = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ja'));
  cached.japanese = japanese || null;
  cached.ready = true;
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function canSpeak() {
  return 'speechSynthesis' in window;
}

export function speakJa(text, opts = {}) {
  if (!canSpeak() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    if (cached.japanese) u.voice = cached.japanese;
    u.rate = opts.rate ?? 0.92;
    u.pitch = opts.pitch ?? 1;
    u.volume = opts.volume ?? 1;
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.warn('TTS failed', e);
  }
}

export function stopSpeak() {
  if (canSpeak()) window.speechSynthesis.cancel();
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
