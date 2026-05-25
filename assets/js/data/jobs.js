// Job-specific vocabulary and conversation phrases.
export const JOB_CATEGORIES = [
  {
    id: 'kaigo', label: '介護',
    fit: 'Empathy, physical stamina, respect for elders.',
    tasks: '声かけ、体調確認、移乗、食事、排泄補助。',
    salary: 'Mid', stability: 'High', extra: '介護試験あり',
    vocab: [
      { jp: 'お変わりありませんか', en: 'How have you been?' },
      { jp: '車椅子', en: 'wheelchair (kuruma-isu)' },
      { jp: '食事介助', en: 'meal assistance (shokuji-kaijo)' },
      { jp: '転倒', en: 'falling over (tentou)' },
      { jp: '体温', en: 'body temperature (taion)' },
      { jp: '排泄', en: 'toileting (haisetsu)' },
    ],
  },
  {
    id: 'gaisyoku', label: '外食',
    fit: 'Bright energy, speed, customer-service tolerance.',
    tasks: '注文、会計、アレルギー確認、一次クレーム対応。',
    salary: 'Mid-Low', stability: 'Mid', extra: '接客語必須',
    vocab: [
      { jp: 'いらっしゃいませ', en: 'Welcome!' },
      { jp: 'ご注文', en: 'order (go-chuumon)' },
      { jp: 'お会計', en: 'bill (o-kaikei)' },
      { jp: 'アレルギー', en: 'allergy' },
      { jp: '少々お待ちください', en: 'Please wait a moment' },
      { jp: 'かしこまりました', en: 'Certainly (formal yes)' },
    ],
  },
  {
    id: 'syukuhaku', label: '宿泊',
    fit: 'Polite service, cleanliness, shift-work tolerance.',
    tasks: '案内、清掃指示、忘れ物対応、緊急時対応。',
    salary: 'Mid', stability: 'Mid', extra: '丁寧語',
    vocab: [
      { jp: 'チェックイン', en: 'check-in' },
      { jp: 'チェックアウト', en: 'check-out' },
      { jp: 'お部屋', en: 'room (o-heya)' },
      { jp: '鍵', en: 'key (kagi)' },
      { jp: '忘れ物', en: 'lost item (wasure-mono)' },
      { jp: '朝食', en: 'breakfast (choushoku)' },
    ],
  },
  {
    id: 'kensetsu', label: '建設',
    fit: 'Physical strength, safety awareness, teamwork.',
    tasks: '安全標識、工具名、危険指示、朝礼、復唱。',
    salary: 'Mid-High', stability: 'Mid', extra: '安全語彙',
    vocab: [
      { jp: 'ヘルメット', en: 'helmet' },
      { jp: '危険', en: 'danger (kiken)' },
      { jp: '立入禁止', en: 'no entry (tachiiri-kinshi)' },
      { jp: '工事中', en: 'under construction' },
      { jp: '足場', en: 'scaffold (ashiba)' },
      { jp: '安全第一', en: 'safety first' },
    ],
  },
  {
    id: 'unsou', label: '運送',
    fit: 'Punctuality, rule-following, driving interest.',
    tasks: '点呼、配送、事故報告、ルート確認。',
    salary: 'Mid-High', stability: 'Mid', extra: '免許・安全',
    vocab: [
      { jp: '配達', en: 'delivery (haitatsu)' },
      { jp: '集荷', en: 'pickup (shuuka)' },
      { jp: '伝票', en: 'shipping slip (denpyou)' },
      { jp: '時間指定', en: 'timed delivery' },
      { jp: '点呼', en: 'roll-call (tenko)' },
      { jp: '事故報告', en: 'accident report' },
    ],
  },
  {
    id: 'nougyou', label: '農業',
    fit: 'Rural life, outdoor work, seasonal change resilience.',
    tasks: '天候、収穫、選別、出荷、機械注意。',
    salary: 'Mid-Low', stability: 'Mid', extra: '地方適応',
    vocab: [
      { jp: '収穫', en: 'harvest (shuukaku)' },
      { jp: '選別', en: 'sorting (senbetsu)' },
      { jp: '苗', en: 'seedling (nae)' },
      { jp: '肥料', en: 'fertilizer (hiryou)' },
      { jp: 'ビニールハウス', en: 'greenhouse' },
      { jp: '出荷', en: 'shipment (shukka)' },
    ],
  },
  {
    id: 'seizou', label: '製造',
    fit: 'Procedure adherence, focus, quality awareness.',
    tasks: '検品、不良、数量、納期、安全確認、改善報告。',
    salary: 'Mid', stability: 'High', extra: '工程語彙',
    vocab: [
      { jp: '検品', en: 'inspection (kenpin)' },
      { jp: '不良品', en: 'defective product' },
      { jp: '納期', en: 'deadline (nouki)' },
      { jp: '工程', en: 'process (koutei)' },
      { jp: '改善', en: 'improvement (kaizen)' },
      { jp: '指差確認', en: 'point-and-call check' },
    ],
  },
];

// Simple conversation scenarios for the AI conversation panel.
export const CHAT_SCENARIOS = [
  {
    id: 'late',
    title: '遅刻の連絡',
    description: 'You woke up late and need to inform your boss.',
    seed: [
      { from: 'bot', jp: 'もしもし、上司です。どうしましたか？', romaji: 'Moshimoshi, joushi desu. Doushimashita ka?' },
    ],
    hints: [
      'すみません、電車が遅れています。',
      '十五分ぐらい遅れます。',
      '本当に申し訳ありません。',
    ],
  },
  {
    id: 'sick',
    title: '体調不良の連絡',
    description: "You're sick and need to take the day off.",
    seed: [
      { from: 'bot', jp: 'おはようございます。どうしましたか？', romaji: 'Ohayou gozaimasu. Doushimashita ka?' },
    ],
    hints: [
      '熱があります。',
      '今日は休ませてください。',
      '明日には出勤します。',
    ],
  },
  {
    id: 'order',
    title: 'レストランで注文',
    description: 'Order food and ask about allergies.',
    seed: [
      { from: 'bot', jp: 'いらっしゃいませ。ご注文はお決まりですか？', romaji: 'Irasshaimase. Go-chuumon wa o-kimari desu ka?' },
    ],
    hints: [
      'すみません、メニューを見せてください。',
      'これをお願いします。',
      '卵のアレルギーがあります。',
    ],
  },
  {
    id: 'hospital',
    title: '病院で受付',
    description: 'Tell the receptionist what is wrong.',
    seed: [
      { from: 'bot', jp: 'こんにちは。今日はどうしましたか？', romaji: 'Konnichiwa. Kyou wa doushimashita ka?' },
    ],
    hints: [
      '頭が痛いです。',
      '熱が三十八度あります。',
      '保険証はこれです。',
    ],
  },
];
