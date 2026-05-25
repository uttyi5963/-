// Student dashboard — metrics, curriculum, today's tasks, streak grid.
import { el, escape, toast } from '../ui.js';
import { Profile, Storage, levelInfo, TODAY } from '../storage.js';
import { DAILY_TASKS } from '../data/tasks.js';
import { startTodayVocabSession, startKanaSession } from './foundation.js';
import { runTest } from './tests.js';
import { QUESTIONS } from '../data/tests.js';
import { KANA_DECKS } from '../data/kana.js';

export function renderStudent(root) {
  const profile = Profile.load();
  const monthIndex = computeMonthIndex(profile);
  const targetHours = 420;
  const minutesTotal = Object.values(profile.studyMinutes).reduce((a, b) => a + b, 0);
  const hoursTotal = (minutesTotal / 60).toFixed(1);
  const nextTestDays = computeDaysToNextTest(profile);

  root.innerHTML = '';
  root.appendChild(el('div', { class: 'metrics' }, [
    metric('N4合格予測', `${profile.passPredict}%`, predictDelta()),
    metric('累計学習', `${hoursTotal}h`, `6か月目標 ${targetHours}h`),
    metric('連続学習', `${profile.streak}日`, profile.streak >= 5 ? '合格圏ペース' : '週5日以上で合格圏'),
    metric('次回模試', `${nextTestDays}日`, 'N5/N4完成チェック'),
  ]));

  const grid = el('div', { class: 'grid-2' });

  // Left: 6-month curriculum
  grid.appendChild(el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, '6か月カリキュラム'),
      el('span', { class: 'tag' }, `現在：${monthIndex + 1}か月目`),
    ]),
    el('div', { class: 'section-body' }, [courseMap(monthIndex)]),
  ]));

  // Right: today's tasks
  const tasksMins = DAILY_TASKS.reduce((a, t) => a + t.minutes, 0);
  grid.appendChild(el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, '今日の課題'),
      el('span', { class: 'tag' }, `${tasksMins}分`),
    ]),
    el('div', { class: 'section-body today' }, todayTaskList()),
  ]));

  root.appendChild(grid);

  // Streak + activity
  const grid2 = el('div', { class: 'grid-2', style: 'margin-top:16px;' });
  grid2.appendChild(streakSection(profile));
  grid2.appendChild(recentSection(profile));
  root.appendChild(grid2);
}

function metric(label, value, delta) {
  return el('div', { class: 'metric' }, [
    el('div', { class: 'label' }, label),
    el('div', { class: 'value' }, value),
    el('div', { class: 'delta' }, delta),
  ]);
}

function predictDelta() {
  const past = Storage.get('predict-history', []);
  if (past.length < 2) return '初期推定';
  const diff = past[past.length - 1] - past[past.length - 2];
  return diff === 0 ? '横ばい' : (diff > 0 ? `先週比 +${diff}%` : `先週比 ${diff}%`);
}

function computeMonthIndex(profile) {
  const start = new Date(profile.startedAt);
  const today = new Date();
  const months = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
  return Math.max(0, Math.min(5, months));
}

function computeDaysToNextTest(profile) {
  // First-of-next-month as a stand-in for "monthly mock".
  const today = new Date();
  const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return Math.ceil((next - today) / (1000 * 60 * 60 * 24));
}

const MONTHS = [
  { title: 'Month 1 文字・基礎', items: ['ひらがな・カタカナ', '数字・時間・自己紹介', 'です/ます'] },
  { title: 'Month 2 N5完成', items: ['て形・ない形', '助詞の基礎', '日常会話'] },
  { title: 'Month 3 N4前半', items: ['可能形・意向形', 'たら・ても', '生活聴解'] },
  { title: 'Month 4 N4後半', items: ['そうです・ようです', 'ために・ように', '読解強化'] },
  { title: 'Month 5 試験集中', items: ['N4模試', 'JFT形式演習', '弱点別補習'] },
  { title: 'Month 6 仕上げ', items: ['本番模試', '面接練習', '職場日本語'] },
];

function courseMap(currentIdx) {
  const wrap = el('div', { class: 'course-map' });
  MONTHS.forEach((m, i) => {
    const cls = i < currentIdx ? 'month done' : i === currentIdx ? 'month now' : 'month';
    wrap.appendChild(el('div', { class: cls }, [
      el('strong', {}, m.title),
      el('ul', { html: m.items.map((x) => `<li>${escape(x)}</li>`).join('') }),
    ]));
  });
  return wrap;
}

function todayTaskList() {
  return DAILY_TASKS.map((t) => taskCard(t));
}

function taskCard(t) {
  const done = Profile.isTaskDone(t.key);
  const cls = done ? 'task done' : t.key === 'listening' ? 'task due' : t.key === 'chat' ? 'task action' : 'task';
  const tagText = done ? '完了' : `${t.minutes}分 / +${t.xp}XP`;
  const tagCls = done ? 'tag green' : 'tag';
  return el('button', { class: cls, onclick: () => runTaskAction(t) }, [
    el('span', { class: 'check' }, done ? '✓' : t.key === 'listening' ? '!' : '▶'),
    el('div', {}, [el('strong', {}, t.title), el('small', {}, t.note)]),
    el('span', { class: tagCls }, tagText),
  ]);
}

function runTaskAction(t) {
  switch (t.action) {
    case 'review-vocab':
      startTodayVocabSession(10);
      break;
    case 'review-kana':
      startKanaSession(KANA_DECKS[0]);
      break;
    case 'grammar-drill':
      runTest(QUESTIONS.filter((q) => q.type === 'grammar').slice(0, 6), 'drill-grammar');
      break;
    case 'listening-drill':
      runTest(QUESTIONS.filter((q) => q.type === 'listening'), 'drill-listening');
      break;
    case 'reading-drill':
      runTest(QUESTIONS.filter((q) => q.type === 'reading'), 'drill-reading');
      break;
    case 'chat-late':
      window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'jobs', chat: 'late' } }));
      break;
    default:
      toast('準備中の機能です');
  }
}

function streakSection(profile) {
  // 7-day rolling streak grid + monthly heatmap-lite.
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ iso, label: d.toLocaleDateString('ja-JP', { weekday: 'short' }), done: profile.studyDays.includes(iso), today: iso === TODAY() });
  }
  const grid = el('div', { class: 'streak-grid' });
  days.forEach((d) => {
    const cls = `streak-cell ${d.done ? 'done' : ''} ${d.today ? 'today' : ''}`;
    grid.appendChild(el('div', { class: cls, title: d.iso }, d.label));
  });
  const info = levelInfo(profile.xp);
  return el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, '学習ストリーク'),
      el('span', { class: 'tag green' }, `Lv. ${info.level} / ${profile.xp} XP`),
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'sub' }, `直近7日：${profile.studyDays.filter((d) => days.some((x) => x.iso === d)).length}/7日 学習`),
      grid,
      el('div', { style: 'margin-top:16px;' }, [
        el('div', { class: 'progress-label' }, [
          el('span', {}, `次のレベルまで`),
          el('span', {}, `${profile.xp - info.lo} / ${info.hi - info.lo} XP`),
        ]),
        el('div', { class: 'bar green' }, [el('span', { style: `width:${info.pct}%` })]),
      ]),
    ]),
  ]);
}

function recentSection(profile) {
  const history = Storage.get('test-history', []).slice(-3).reverse();
  const items = history.length === 0
    ? [el('div', { class: 'empty' }, 'まだ受験記録がありません。「模試・試験対策」から始めましょう。')]
    : history.map((h) => el('div', { class: `ai-item ${h.acc >= 60 ? '' : h.acc >= 40 ? 'warn' : 'risk'}` }, [
        el('strong', {}, `${h.setLabel || h.set} — ${h.score}/${h.total} (${h.acc}%)`),
        el('span', {}, `${h.date} ／ ${h.acc >= 60 ? '合格圏' : h.acc >= 40 ? '要強化' : '基礎へ戻る'}`),
      ]));
  return el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, '最近の活動'),
      el('span', { class: 'tag' }, '直近の受験'),
    ]),
    el('div', { class: 'section-body ai-list' }, items),
  ]);
}
