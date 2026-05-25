// Main bootstrap: router, header, sidebar.
import { Profile, levelInfo, Storage } from './storage.js';
import { el, escape, initModal, toast } from './ui.js';
import { renderStudent } from './views/student.js';
import { renderFoundation } from './views/foundation.js';
import { renderLanguage } from './views/language.js';
import { renderTeacher } from './views/teacher.js';
import { renderTests } from './views/tests.js';
import { renderCommunity } from './views/community.js';
import { renderJobs } from './views/jobs.js';
import { renderAdmin } from './views/admin.js';

const VIEWS = [
  { id: 'student',    label: '学習者画面',         renderer: renderStudent,    subtitle: 'スマホ中心、毎日30〜90分、AI復習と教師介入を組み合わせる設計' },
  { id: 'foundation', label: '読み方・単語帳',     renderer: renderFoundation, subtitle: 'かな・N5/N4語彙をSRSで反復、苦手は自動再出題' },
  { id: 'language',   label: '英語・ウルドゥー設計', renderer: renderLanguage,   subtitle: '段階的に日本語へ寄せる多言語UI戦略' },
  { id: 'teacher',    label: '教師ダッシュボード',   renderer: renderTeacher,    subtitle: '受講者モニタリングとAI介入提案' },
  { id: 'tests',      label: '模試・試験対策',     renderer: renderTests,      subtitle: 'JLPT N4/JFT-Basic形式の問題演習と弱点フィードバック' },
  { id: 'community',  label: 'レベル・友達機能',   renderer: renderCommunity,  subtitle: 'ゲーム型レベル・XP・ランキング' },
  { id: 'jobs',       label: '職種別日本語',       renderer: renderJobs,       subtitle: '7業界の必須フレーズとAI会話シミュレーション' },
  { id: 'admin',      label: '日本側管理',         renderer: renderAdmin,      subtitle: '品質管理ロードマップとプロトタイプ設定' },
];

let currentView = 'student';
let lastViewOpts = {};

function navigate(viewId, opts = {}) {
  const view = VIEWS.find((v) => v.id === viewId);
  if (!view) return;
  currentView = viewId;
  lastViewOpts = opts;
  document.querySelectorAll('.nav button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === viewId);
  });
  document.querySelectorAll('.view').forEach((v) => {
    v.classList.toggle('active', v.id === viewId);
  });
  document.getElementById('pageTitle').textContent = view.label;
  document.getElementById('pageSubtitle').textContent = view.subtitle;
  const root = document.getElementById(viewId);
  view.renderer(root, opts);
  // Update URL hash without triggering scroll-to-anchor.
  if (location.hash.slice(1) !== viewId) {
    history.replaceState(null, '', `${location.pathname}#${viewId}`);
  }
  window.scrollTo(0, 0);
}

function renderSidebar() {
  const nav = document.getElementById('navList');
  nav.innerHTML = '';
  VIEWS.forEach((v) => {
    const btn = el('button', { dataset: { view: v.id }, onclick: () => navigate(v.id) }, v.label);
    nav.appendChild(btn);
  });
  refreshUserCard();
}

function refreshUserCard() {
  const p = Profile.load();
  const info = levelInfo(p.xp);
  const card = document.getElementById('userCard');
  if (!card) return;
  card.innerHTML = '';
  card.appendChild(el('strong', {}, `Lv. ${info.level} · ${p.xp} XP`));
  card.appendChild(el('div', {}, `🔥 ${p.streak}日連続`));
  card.appendChild(el('div', { class: 'xp-bar' }, [el('span', { style: `width:${info.pct}%` })]));
  card.appendChild(el('div', {}, `予測 N4合格率 ${p.passPredict}%`));
}

function refreshHeader() {
  const p = Profile.load();
  document.getElementById('cohortPill').textContent = `Cohort: ${p.cohort}`;
}

function bindHeaderActions() {
  const advance = document.getElementById('demoAdvance');
  advance.addEventListener('click', () => {
    // Records a quick "this week's check-in" — bumps XP, runs daily mini test.
    Profile.addXp(20);
    Profile.recordMinutes(5);
    Profile.updatePassPredict();
    // Save weekly predict snapshot
    const past = Storage.get('predict-history', []);
    past.push(Profile.load().passPredict);
    Storage.set('predict-history', past.slice(-12));
    refreshAll();
    toast('週次チェックイン完了！ +20 XP');
  });
}

function bindGlobalEvents() {
  window.addEventListener('profile-changed', refreshAll);
  window.addEventListener('navigate', (e) => navigate(e.detail.view, e.detail));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id && VIEWS.find((v) => v.id === id)) navigate(id);
  });
}

function refreshAll() {
  refreshUserCard();
  refreshHeader();
  const view = VIEWS.find((v) => v.id === currentView);
  if (view) view.renderer(document.getElementById(currentView), lastViewOpts);
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function boot() {
  Profile.load();
  renderSidebar();
  initModal();
  bindHeaderActions();
  bindGlobalEvents();
  const initial = (location.hash.slice(1) && VIEWS.find((v) => v.id === location.hash.slice(1))) ? location.hash.slice(1) : 'student';
  navigate(initial);
  refreshHeader();
  registerSW();

  // First-run welcome.
  if ((Profile.load().studyDays || []).length === 0) {
    setTimeout(() => toast('プロトタイプへようこそ！「今日の課題」から始めましょう。', 3500), 600);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
