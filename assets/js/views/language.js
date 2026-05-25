// Language design / strategy view — mostly presentational.
import { el } from '../ui.js';
import { Profile } from '../storage.js';

export function renderLanguage(root) {
  const p = Profile.load();
  root.innerHTML = '';
  root.appendChild(el('div', { class: 'metrics' }, [
    metric('推奨UI', 'JP+', '日本語主軸、英語/ウルドゥー補助'),
    metric('初期説明', '2言語', '英語 + Urduを併記'),
    metric('翻訳依存', '減少', '3か月目からタップ表示へ'),
    metric('音声教材', '必須', '文字より先に音で固定'),
  ]));

  const cards = [
    { title: '英語だけでは取りこぼす', body: 'AIOUの学生や都市部・高学歴層は英語UIでも進めやすい。一方で、日本就労を狙う層全体では英語説明だけだと理解差が出やすい。', phase: '用途：管理画面、上位者、企業説明' },
    { title: 'ウルドゥー併記で離脱を下げる', body: 'ウルドゥー語は共通語として使いやすく、文法説明・注意事項・生活文化の説明に向く。初期の安心感を作る。', phase: '用途：初期教材、弱点補習、保護者/家族説明' },
    { title: '最後は日本語へ寄せる', body: '試験と職場は日本語なので、翻訳は常時表示ではなく段階的に隠す。ローマ字も2〜3か月目から減らす。', phase: '用途：N4/JFT本番、面接、職場会話' },
  ];

  const section = el('div', { class: 'section' });
  section.appendChild(el('div', { class: 'section-head' }, [el('h2', {}, '言語設計の結論'), el('span', { class: 'tag' }, 'AIOU + online')]));
  const body = el('div', { class: 'section-body' });

  const langGrid = el('div', { class: 'language-grid' });
  cards.forEach((c) => {
    langGrid.appendChild(el('div', { class: 'language-card' }, [
      el('strong', {}, c.title),
      el('p', {}, c.body),
      el('div', { class: 'phase' }, c.phase),
    ]));
  });
  body.appendChild(langGrid);

  body.appendChild(progressRow('Month 1-2：日本語 + ローマ字 + 英語 + Urdu', '理解優先', 100, ''));
  body.appendChild(progressRow('Month 3-4：日本語主表示、英語/Urduはタップで確認', '試験移行', 70, 'blue'));
  body.appendChild(progressRow('Month 5-6：日本語中心、解説だけ補助言語', '本番仕様', 38, 'yellow'));

  // Language preference picker
  body.appendChild(el('h3', { style: 'margin-top:24px; font-size:15px;' }, 'あなたの表示設定'));
  body.appendChild(el('div', { class: 'sub', style: 'margin-bottom:10px;' }, 'カードや問題画面で表示する補助言語を選びます。'));
  const choices = [
    { id: 'jp', label: '日本語のみ' },
    { id: 'en', label: '日本語 + 英語' },
    { id: 'ur', label: '日本語 + 英語 + Urdu' },
  ];
  const row = el('div', { class: 'tabs' });
  choices.forEach((c) => {
    const btn = el('button', { class: p.language === c.id ? 'active' : '', onclick: () => {
      const profile = Profile.load();
      profile.language = c.id;
      Profile.save(profile);
      renderLanguage(root);
    } }, c.label);
    row.appendChild(btn);
  });
  body.appendChild(row);

  section.appendChild(body);
  root.appendChild(section);
}

function metric(label, value, delta) {
  return el('div', { class: 'metric' }, [
    el('div', { class: 'label' }, label),
    el('div', { class: 'value' }, value),
    el('div', { class: 'delta' }, delta),
  ]);
}

function progressRow(label, badge, pct, color) {
  return el('div', { class: 'progress-row' }, [
    el('div', { class: 'progress-label' }, [el('span', {}, label), el('span', {}, badge)]),
    el('div', { class: `bar ${color}` }, [el('span', { style: `width:${pct}%` })]),
  ]);
}
