// data.js — クリニック人事評価システムの初期データ・マスタ定義
// すべてブラウザ内 (localStorage) で完結するデモ用マスタです。

// 職種マスタ
export const ROLES = [
  { key: 'doctor', label: '医師' },
  { key: 'nurse', label: '看護師' },
  { key: 'assistant_nurse', label: '准看護師' },
  { key: 'clerk', label: '医療事務' },
  { key: 'reception', label: '受付' },
  { key: 'lab', label: '臨床検査技師' },
  { key: 'radiology', label: '診療放射線技師' },
  { key: 'pt', label: '理学療法士' },
];

export const ROLE_LABEL = Object.fromEntries(ROLES.map((r) => [r.key, r.label]));

// 評価カテゴリ（3軸）と既定の軸ウェイト
export const CATEGORIES = [
  { key: 'performance', label: '業績', desc: '目標達成・成果' },
  { key: 'competency', label: '能力', desc: '専門スキル・知識' },
  { key: 'attitude', label: '情意', desc: '勤務態度・協調性' },
];

// 評価者ロールと合成ウェイト（自己/1次/2次）
export const RATER_WEIGHTS = { self: 0.2, primary: 0.5, secondary: 0.3 };
export const RATER_LABEL = { self: '自己評価', primary: '1次評価', secondary: '2次評価' };

// 評点スケール（1〜5）
export const SCALE = [
  { v: 5, label: '5 期待を大きく上回る' },
  { v: 4, label: '4 期待を上回る' },
  { v: 3, label: '3 期待どおり' },
  { v: 2, label: '2 やや不足' },
  { v: 1, label: '1 著しく不足' },
];

// ランク閾値（総合スコア%）
export const DEFAULT_RANK_THRESHOLDS = [
  { rank: 'S', min: 90 },
  { rank: 'A', min: 80 },
  { rank: 'B', min: 70 },
  { rank: 'C', min: 60 },
  { rank: 'D', min: 0 },
];

// 共通の情意・能力（全職種共通の土台）
const COMMON_ATTITUDE = [
  { name: '規律性（就業ルール遵守）', category: 'attitude', weight: 1 },
  { name: '責任性（職務完遂）', category: 'attitude', weight: 1 },
  { name: '協調性（チーム連携）', category: 'attitude', weight: 1 },
  { name: '積極性（改善・自己研鑽）', category: 'attitude', weight: 1 },
];

const COMMON_COMPETENCY = [
  { name: '接遇・患者対応マナー', category: 'competency', weight: 2 },
  { name: '報連相・情報共有', category: 'competency', weight: 1 },
  { name: '医療安全・インシデント対応', category: 'competency', weight: 2 },
  { name: '個人情報・守秘義務の遵守', category: 'competency', weight: 1 },
];

const COMMON_PERFORMANCE = [
  { name: '目標達成度（MBO連動）', category: 'performance', weight: 3 },
  { name: '業務効率・正確性', category: 'performance', weight: 2 },
];

// 職種別の追加項目
const ROLE_SPECIFIC = {
  doctor: [
    { name: '診療の質・診断適切性', category: 'competency', weight: 3 },
    { name: '患者説明・インフォームドコンセント', category: 'competency', weight: 2 },
    { name: '後進指導・症例共有', category: 'performance', weight: 1 },
  ],
  nurse: [
    { name: '看護技術・処置の正確性', category: 'competency', weight: 3 },
    { name: '感染対策の実践', category: 'competency', weight: 2 },
    { name: '患者観察・アセスメント', category: 'competency', weight: 2 },
  ],
  assistant_nurse: [
    { name: '基本看護技術', category: 'competency', weight: 3 },
    { name: '感染対策の実践', category: 'competency', weight: 2 },
  ],
  clerk: [
    { name: 'レセプト・算定の正確性', category: 'competency', weight: 3 },
    { name: '会計・請求処理', category: 'performance', weight: 2 },
    { name: '電子カルテ運用', category: 'competency', weight: 1 },
  ],
  reception: [
    { name: '受付・予約対応のスピード', category: 'performance', weight: 2 },
    { name: '電話応対品質', category: 'competency', weight: 2 },
    { name: '待合の案内・クレーム一次対応', category: 'competency', weight: 2 },
  ],
  lab: [
    { name: '検査精度・精度管理', category: 'competency', weight: 3 },
    { name: '検体取り扱い・安全管理', category: 'competency', weight: 2 },
  ],
  radiology: [
    { name: '撮影技術・画質', category: 'competency', weight: 3 },
    { name: '被ばく管理・安全', category: 'competency', weight: 2 },
  ],
  pt: [
    { name: '評価・プログラム立案', category: 'competency', weight: 3 },
    { name: 'リハビリ実施・記録', category: 'performance', weight: 2 },
  ],
};

// 職種ごとの既定評価項目を生成
export function defaultCriteriaForRole(roleKey) {
  const base = [
    ...COMMON_PERFORMANCE,
    ...COMMON_COMPETENCY,
    ...COMMON_ATTITUDE,
  ];
  const extra = ROLE_SPECIFIC[roleKey] || [];
  return [...base, ...extra].map((c, i) => ({
    id: `${roleKey}-c${i + 1}`,
    ...c,
  }));
}

export function buildDefaultCriteria() {
  const out = {};
  for (const r of ROLES) out[r.key] = defaultCriteriaForRole(r.key);
  return out;
}

// 期（評価期間）の初期値
export function defaultPeriods() {
  return [
    { id: 'p-2026h1', name: '2026年度 上期', start: '2026-04-01', end: '2026-09-30', status: 'open' },
    { id: 'p-2025h2', name: '2025年度 下期', start: '2025-10-01', end: '2026-03-31', status: 'closed' },
  ];
}

// 初期職員データ（デモ）
export function seedStaff() {
  return [
    { id: 's1', name: '佐藤 健一', role: 'doctor', dept: '内科', joinedAt: '2015-04-01', active: true },
    { id: 's2', name: '鈴木 美咲', role: 'nurse', dept: '外来', joinedAt: '2018-09-01', active: true },
    { id: 's3', name: '高橋 由紀', role: 'nurse', dept: '外来', joinedAt: '2021-04-01', active: true },
    { id: 's4', name: '田中 翔太', role: 'clerk', dept: '医事課', joinedAt: '2019-04-01', active: true },
    { id: 's5', name: '伊藤 さやか', role: 'reception', dept: '受付', joinedAt: '2022-10-01', active: true },
    { id: 's6', name: '渡辺 大輔', role: 'lab', dept: '検査科', joinedAt: '2017-04-01', active: true },
    { id: 's7', name: '山本 彩', role: 'pt', dept: 'リハビリ科', joinedAt: '2020-04-01', active: true },
    { id: 's8', name: '中村 拓海', role: 'assistant_nurse', dept: '外来', joinedAt: '2023-04-01', active: true },
  ];
}

// 初期目標データ（デモ）
export function seedGoals() {
  return [
    { id: 'g1', staffId: 's2', periodId: 'p-2026h1', title: '採血手技の標準化マニュアル作成', weight: 40, progress: 60, result: '' },
    { id: 'g2', staffId: 's2', periodId: 'p-2026h1', title: '患者満足度アンケート平均4.3以上', weight: 60, progress: 80, result: '' },
    { id: 'g3', staffId: 's4', periodId: 'p-2026h1', title: 'レセプト返戻率を1.0%未満に', weight: 50, progress: 70, result: '' },
    { id: 'g4', staffId: 's4', periodId: 'p-2026h1', title: '新人事務の教育プログラム整備', weight: 50, progress: 40, result: '' },
  ];
}
