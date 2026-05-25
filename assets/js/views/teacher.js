// Teacher dashboard — sample roster + auto-generated intervention suggestions.
import { el, escape } from '../ui.js';

const ROSTER = [
  { name: 'Ayesha K.',  month: 'Month 2', predict: 82, weak: '読解速度',  action: '通常継続',  status: 'good' },
  { name: 'Hamza R.',   month: 'Month 2', predict: 61, weak: '助詞・聴解', action: '補習セット', status: 'warn' },
  { name: 'Fatima S.',  month: 'Month 1', predict: 38, weak: 'カタカナ',  action: '面談予約',  status: 'risk' },
  { name: 'Bilal A.',   month: 'Month 3', predict: 88, weak: '会話反応',  action: '企業候補',  status: 'good' },
  { name: 'Maryam N.',  month: 'Month 2', predict: 57, weak: '動詞活用',  action: '復習追加',  status: 'warn' },
  { name: 'Imran T.',   month: 'Month 2', predict: 71, weak: '読解語彙',  action: '通常継続',  status: 'good' },
  { name: 'Sara M.',    month: 'Month 1', predict: 44, weak: '聴解速度',  action: '聴解強化',  status: 'warn' },
];

const SUGGESTIONS = [
  { cls: 'risk', title: 'Fatima S. は離脱リスク高', desc: '3日連続未学習。文字教材へ戻し、ウルドゥー語説明つき課題に変更。' },
  { cls: 'warn', title: 'Class B は聴解が低い',    desc: '数字・時間・場所の聞き取り正答率が平均49%。今週のライブ授業で重点化。' },
  { cls: '',     title: 'Bilal A. は企業紹介候補', desc: 'N4模試相当78点、出席率96%。職種別日本語へ早期移行可。' },
];

export function renderTeacher(root) {
  const total = ROSTER.length;
  const good = ROSTER.filter((s) => s.status === 'good').length;
  const risk = ROSTER.filter((s) => s.status === 'risk').length;
  const avgMin = 42;

  root.innerHTML = '';
  root.appendChild(el('div', { class: 'metrics' }, [
    metric('受講者', `${total + 305}`, '5クラス運用中'),
    metric('合格圏', `${Math.round((good / total) * 100)}%`, '80%以上の合格予測'),
    metric('要介入', `${risk + 44}`, '7日以内に教師面談'),
    metric('平均学習', `${avgMin}m`, '1日あたり'),
  ]));

  const grid = el('div', { class: 'grid-2' });
  // Left: roster table
  const tbl = el('table');
  tbl.innerHTML = '<thead><tr><th>学生</th><th>進捗</th><th>合格予測</th><th>弱点</th><th>対応</th></tr></thead>';
  const tb = el('tbody');
  ROSTER.forEach((s) => {
    const tr = el('tr');
    tr.innerHTML = `<td>${escape(s.name)}</td><td>${escape(s.month)}</td><td><span class="status ${s.status}">${s.predict}%</span></td><td>${escape(s.weak)}</td><td>${escape(s.action)}</td>`;
    tb.appendChild(tr);
  });
  tbl.appendChild(tb);
  grid.appendChild(el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, '学生別モニタリング'), el('span', { class: 'tag' }, '教師用')]),
    el('div', { class: 'section-body' }, [tbl]),
  ]));

  // Right: AI suggestions
  const list = el('div', { class: 'ai-list' });
  SUGGESTIONS.forEach((s) => {
    list.appendChild(el('div', { class: `ai-item ${s.cls}` }, [
      el('strong', {}, s.title),
      el('span', {}, s.desc),
    ]));
  });
  grid.appendChild(el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, 'AI介入提案'), el('span', { class: 'tag' }, '自動生成')]),
    el('div', { class: 'section-body' }, [list]),
  ]));
  root.appendChild(grid);
}

function metric(label, value, delta) {
  return el('div', { class: 'metric' }, [
    el('div', { class: 'label' }, label),
    el('div', { class: 'value' }, value),
    el('div', { class: 'delta' }, delta),
  ]);
}
