// Admin / Japan-side quality view — mostly presentational.
import { el, toast } from '../ui.js';
import { Profile } from '../storage.js';
import { canSpeak, japaneseVoices, speakJa } from '../audio.js';

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

  // Audio settings
  root.appendChild(audioSettingsPanel());

  // Settings panel for the demo user
  root.appendChild(el('div', { class: 'section', style: 'margin-top:16px;' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, 'プロトタイプ設定'), el('span', { class: 'tag' }, 'デモ用')]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'sub', style: 'margin-bottom:10px;' }, 'このプロトタイプはブラウザのみで動作します。データはLocalStorageに保存されています。'),
      el('button', { class: 'danger', onclick: resetData }, '全データをリセット'),
    ]),
  ]));
}

function audioSettingsPanel() {
  const p = Profile.load();
  const voices = japaneseVoices();
  const supportedStr = canSpeak()
    ? (voices.length > 0 ? `利用可能：日本語音声 ${voices.length}種` : 'ブラウザ対応（日本語ボイス未確認）')
    : 'このブラウザでは音声合成が利用できません';

  const body = el('div', {});
  body.appendChild(el('div', { class: 'sub', style: 'margin-bottom:14px;' }, supportedStr));

  // Auto-play toggle
  const autoRow = el('div', { class: 'setting-row' }, [
    el('div', {}, [
      el('strong', {}, '自動再生'),
      el('div', { class: 'sub' }, 'フラッシュカードをめくった瞬間や、聴解問題の表示時に自動で発音を再生します。'),
    ]),
    el('label', { class: 'switch' }, [
      (() => {
        const input = el('input', { type: 'checkbox' });
        if (p.audioAutoPlay !== false) input.checked = true;
        input.addEventListener('change', () => {
          const prof = Profile.load();
          prof.audioAutoPlay = input.checked;
          Profile.save(prof);
          toast(input.checked ? '自動再生をオンにしました' : '自動再生をオフにしました');
        });
        return input;
      })(),
      el('span', { class: 'slider' }, ''),
    ]),
  ]);
  body.appendChild(autoRow);

  // Speed selector
  const speedRow = el('div', { class: 'setting-row' }, [
    el('div', {}, [
      el('strong', {}, '読み上げ速度'),
      el('div', { class: 'sub' }, '初心者は遅め、慣れてきたら標準〜速めで。'),
    ]),
    (() => {
      const opts = [
        { label: '遅い', val: 0.7 },
        { label: '普通', val: 0.9 },
        { label: '速い', val: 1.1 },
      ];
      const wrap = el('div', { class: 'tabs', style: 'margin:0;' });
      opts.forEach((o) => {
        const btn = el('button', {
          class: Math.abs(p.audioSpeed - o.val) < 0.05 ? 'active' : '',
          onclick: () => {
            const prof = Profile.load();
            prof.audioSpeed = o.val;
            Profile.save(prof);
            wrap.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            speakJa('日本語の発音テストです。', { rate: o.val });
          },
        }, o.label);
        wrap.appendChild(btn);
      });
      return wrap;
    })(),
  ]);
  body.appendChild(speedRow);

  // Test button
  body.appendChild(el('button', {
    class: 'primary',
    style: 'margin-top:16px;',
    onclick: () => speakJa('こんにちは、日本語学校です。発音をテストしています。'),
    disabled: !canSpeak(),
  }, canSpeak() ? '🔊 発音をテスト' : '音声未対応'));

  return el('div', { class: 'section', style: 'margin-top:16px;' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, '音声・発音 設定'), el('span', { class: 'tag' }, 'Web Speech API')]),
    el('div', { class: 'section-body' }, [body]),
  ]);
}

function resetData() {
  if (!confirm('全ての学習データ（進捗・XP・テスト履歴など）を削除します。よろしいですか？')) return;
  import('../storage.js').then(({ Storage, Profile }) => {
    Storage.clearAll();
    Profile.load();
    location.reload();
  });
}
