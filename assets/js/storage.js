// LocalStorage wrapper with namespacing and JSON.
const PREFIX = 'aiou-nihongo/';

export const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed', e);
    }
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },
  keys() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
    }
    return out;
  },
  clearAll() {
    this.keys().forEach((k) => this.remove(k));
  }
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultProfile = () => ({
  name: 'Student',
  cohort: 'PK-2026-07',
  language: 'jp',  // jp | en | ur
  startedAt: todayKey(),
  level: 1,
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  studyDays: [],          // ISO date strings
  studyMinutes: {},       // { 'YYYY-MM-DD': minutes }
  todayTasksDone: {},     // { 'YYYY-MM-DD': ['vocab', 'drill', ...] }
  passPredict: 38,
  audio: true,
  audioAutoPlay: true,
  audioSpeed: 0.9,
});

export const Profile = {
  load() {
    const p = Storage.get('profile', null);
    if (!p) {
      const fresh = defaultProfile();
      Storage.set('profile', fresh);
      return fresh;
    }
    return { ...defaultProfile(), ...p };
  },
  save(profile) {
    Storage.set('profile', profile);
  },
  reset() {
    Storage.clearAll();
    return this.load();
  },
  // Add XP and recompute level + streak.
  addXp(amount) {
    const p = this.load();
    p.xp += amount;
    p.level = computeLevel(p.xp);
    const today = todayKey();
    if (!p.studyDays.includes(today)) {
      p.studyDays.push(today);
      if (p.lastStudyDate) {
        const last = new Date(p.lastStudyDate);
        const diff = (new Date(today) - last) / (1000 * 60 * 60 * 24);
        p.streak = diff <= 1.5 ? (p.streak || 0) + 1 : 1;
      } else {
        p.streak = 1;
      }
      p.lastStudyDate = today;
    }
    this.save(p);
    return p;
  },
  markTaskDone(taskKey) {
    const p = this.load();
    const today = todayKey();
    if (!p.todayTasksDone[today]) p.todayTasksDone[today] = [];
    if (!p.todayTasksDone[today].includes(taskKey)) {
      p.todayTasksDone[today].push(taskKey);
      this.save(p);
    }
  },
  isTaskDone(taskKey) {
    const p = this.load();
    const today = todayKey();
    return (p.todayTasksDone[today] || []).includes(taskKey);
  },
  recordMinutes(minutes) {
    const p = this.load();
    const today = todayKey();
    p.studyMinutes[today] = (p.studyMinutes[today] || 0) + minutes;
    this.save(p);
  },
  updatePassPredict() {
    const p = this.load();
    // Heuristic: combines XP volume, streak, and accuracy stats.
    const xpScore = Math.min(p.xp / 4000, 1) * 50;        // up to 50
    const streakScore = Math.min(p.streak / 30, 1) * 20;  // up to 20
    const acc = Storage.get('test-accuracy', 0.5);
    const accScore = acc * 30;                            // up to 30
    p.passPredict = Math.round(38 + xpScore * 0.55 + streakScore + accScore);
    if (p.passPredict > 95) p.passPredict = 95;
    this.save(p);
    return p.passPredict;
  }
};

const LEVEL_THRESHOLDS = [0, 200, 700, 1700, 3500, 6000, 9500, 14000];
function computeLevel(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function levelInfo(xp) {
  const lvl = computeLevel(xp);
  const lo = LEVEL_THRESHOLDS[lvl - 1] || 0;
  const hi = LEVEL_THRESHOLDS[lvl] || lo + 1000;
  return { level: lvl, lo, hi, pct: Math.round(((xp - lo) / (hi - lo)) * 100) };
}

export const TODAY = todayKey;
