// Admin / Japan-side quality view — mostly presentational.
import { el } from '../ui.js';

const MILESTONES = [
  { strong: '教材監修',         desc: '日本語教育責任者がN4/JFT範囲、著作権、表現を確認。' },
  { strong: '月1日本人ライブ',  desc: '日本人講師・企業担当者との会話会で学習意欲を維持。' },
  { strong: '有料会話オプション', desc: '試験前・面接前だけ日本人教師との個別会話を販売。通常学習とは分ける。' },
  { strong: '成績優秀者特典',   desc: '将来的に日本見学、企業訪問、オンライン表彰を設計。まずは学習継続の報酬にする。' },
  { strong: '候補者レポート',   desc: '学習時間、模試点、会話評価、職種適性を企業へ提示。' },
  { strong: '修了証発行',       desc: 'AIOU日本語学校名義。合格保証ではなく、到達度証明として運用。' },
];

const ROADMAP = [
  { cls: '',     phase: '0〜3か月', desc: '教材表示、ドリル、小テスト、月例模試、教師ダッシュボード。' },
  { cls: 'warn', phase: '4〜5か月', desc: 'AI弱点診断、復習プラン、合格予測、リマインド。' },
  { cls: '',     phase: '6〜8か月', desc: 'AI会話、発音チェック、職種別日本語、企業向けレポート。' },
];

export function renderAdmin(root) {
  root.innerHTML = '';
  const grid = el('div', { class: 'grid-2' });
  grid.appendChild(el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, '日本側品質管理'), el('span', { class: 'tag' }, '差別化ポイント')]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'timeline' }, MILESTONES.map((m) => el('div', { class: 'milestone' }, [
        el('strong', {}, m.strong),
        el('span', {}, m.desc),
      ]))),
    ]),
  ]));
  grid.appendChild(el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, '開発ロードマップ'), el('span', { class: 'tag' }, 'MVP')]),
    el('div', { class: 'section-body ai-list' }, ROADMAP.map((r) => el('div', { class: `ai-item ${r.cls}` }, [
      el('strong', {}, r.phase),
      el('span', {}, r.desc),
    ]))),
  ]));
  root.appendChild(grid);

  // Settings panel for the demo user
  root.appendChild(el('div', { class: 'section', style: 'margin-top:16px;' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, 'プロトタイプ設定'), el('span', { class: 'tag' }, 'デモ用')]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'sub', style: 'margin-bottom:10px;' }, 'このプロトタイプはブラウザのみで動作します。データはLocalStorageに保存されています。'),
      el('button', { class: 'danger', onclick: resetData }, '全データをリセット'),
    ]),
  ]));
}

function resetData() {
  if (!confirm('全ての学習データ（進捗・XP・テスト履歴など）を削除します。よろしいですか？')) return;
  import('../storage.js').then(({ Storage, Profile }) => {
    Storage.clearAll();
    Profile.load();
    location.reload();
  });
}
