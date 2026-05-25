// Mock test question bank.
// Question types:
//   - kanji: choose correct reading for highlighted kanji
//   - vocab: choose meaning / word that fits
//   - grammar: choose particle / conjugation that fits blank
//   - listening: TTS plays a sentence — user picks meaning
//   - reading: short passage + question

export const QUESTIONS = [
  // ----- kanji readings -----
  {
    id: 'q001', type: 'kanji', level: 'N5',
    stem: '会議は三時からです。',
    target: '会議',
    options: ['かいぎ', 'かいご', 'かいき', 'かいけい'],
    answer: 0,
    explain: '「会議 (かいぎ)」 = meeting. 「会 (かい)」 + 「議 (ぎ)」.',
  },
  {
    id: 'q002', type: 'kanji', level: 'N5',
    stem: '病院へ行きます。',
    target: '病院',
    options: ['びょういん', 'びよういん', 'びょうにん', 'ひょういん'],
    answer: 0,
    explain: '「病院 (びょういん)」 = hospital. Take care with the small 「ょ」.',
  },
  {
    id: 'q003', type: 'kanji', level: 'N4',
    stem: '上司に連絡してください。',
    target: '連絡',
    options: ['れんらく', 'れんかく', 'れんろう', 'えんらく'],
    answer: 0,
    explain: '「連絡 (れんらく)」 = contact / get in touch with.',
  },
  {
    id: 'q004', type: 'kanji', level: 'N4',
    stem: '安全に注意してください。',
    target: '注意',
    options: ['ちゅい', 'ちゅうい', 'じゅうい', 'ちょうい'],
    answer: 1,
    explain: '「注意 (ちゅうい)」 = caution. Long vowel — 「ちゅう」.',
  },
  {
    id: 'q005', type: 'kanji', level: 'N4',
    stem: '電車が遅れています。',
    target: '遅れて',
    options: ['おくれて', 'おそれて', 'はずれて', 'すたれて'],
    answer: 0,
    explain: '「遅れる (おくれる)」 = to be late / delayed.',
  },

  // ----- vocab meaning -----
  {
    id: 'q006', type: 'vocab', level: 'N5',
    stem: '「明日」の意味はどれですか。',
    options: ['yesterday', 'tomorrow', 'today', 'every day'],
    answer: 1,
    explain: '「明日 (あした)」 = tomorrow.',
  },
  {
    id: 'q007', type: 'vocab', level: 'N5',
    stem: '「便利」 means ___?',
    options: ['inconvenient', 'convenient', 'broken', 'expensive'],
    answer: 1,
    explain: '「便利 (べんり)」 = convenient.',
  },
  {
    id: 'q008', type: 'vocab', level: 'N4',
    stem: 'コンビニで _____ を買いました。 (Bought ___ at the convenience store.)',
    options: ['ホテル', 'ジュース', 'タクシー', 'シャワー'],
    answer: 1,
    explain: 'You buy items, not hotels, taxis, or showers. ジュース = juice fits.',
  },
  {
    id: 'q009', type: 'vocab', level: 'N4',
    stem: '熱がありますから、_____ を飲みます。',
    options: ['お茶', '薬', 'パン', '本'],
    answer: 1,
    explain: 'With a fever, you take 薬 (medicine).',
  },
  {
    id: 'q010', type: 'vocab', level: 'N4',
    stem: '電車に _____。 The train was delayed and I missed work.',
    options: ['乗りました', '遅れました', '休みました', '入りました'],
    answer: 1,
    explain: '遅れました = was late. Train delays use 遅れる.',
  },

  // ----- grammar -----
  {
    id: 'q011', type: 'grammar', level: 'N5',
    stem: '私___学生です。',
    options: ['を', 'は', 'で', 'に'],
    answer: 1,
    explain: 'は marks the topic.「私は学生です」= I am a student.',
  },
  {
    id: 'q012', type: 'grammar', level: 'N5',
    stem: 'ご飯___食べます。',
    options: ['は', 'が', 'を', 'に'],
    answer: 2,
    explain: 'を marks the direct object of 食べる.',
  },
  {
    id: 'q013', type: 'grammar', level: 'N5',
    stem: '会社___行きます。',
    options: ['へ', 'を', 'が', 'と'],
    answer: 0,
    explain: 'へ shows direction with motion verbs like 行く.',
  },
  {
    id: 'q014', type: 'grammar', level: 'N4',
    stem: 'ここに名前を_____ ください。',
    options: ['書く', '書きます', '書いて', '書こう'],
    answer: 2,
    explain: 'Use te-form (書いて) + ください for a polite request.',
  },
  {
    id: 'q015', type: 'grammar', level: 'N4',
    stem: '日本に_____ ことがあります。',
    options: ['行く', '行って', '行った', '行きます'],
    answer: 2,
    explain: 'Plain past + ことがある = "have done before". 行った is the plain past form.',
  },
  {
    id: 'q016', type: 'grammar', level: 'N4',
    stem: '雨が_____ も、行きます。',
    options: ['降る', '降って', '降ります', '降った'],
    answer: 1,
    explain: 'te-form + も = "even if". 降って + も.',
  },
  {
    id: 'q017', type: 'grammar', level: 'N4',
    stem: '明日早く_____ なければなりません。',
    options: ['起き', '起きる', '起きて', '起きない'],
    answer: 0,
    explain: 'Use the ない-form stem before なければなりません: 起きない → 起き + なければなりません.',
  },
  {
    id: 'q018', type: 'grammar', level: 'N4',
    stem: '日本語が_____ ます。',
    options: ['話す', '話せ', '話さない', '話そう'],
    answer: 1,
    explain: 'Potential form: 話す → 話せる → 話せます (can speak).',
  },

  // ----- listening (audio of stem; user picks meaning) -----
  {
    id: 'q019', type: 'listening', level: 'N5',
    stem: '会議は三時からです。',
    options: [
      'The meeting starts at 3 o\'clock.',
      'The meeting ends at 3 o\'clock.',
      'There is no meeting today.',
      'The meeting is on the 3rd.',
    ],
    answer: 0,
    explain: '「〜は三時からです」= "starts from 3". からです marks the start time.',
    audio: true,
  },
  {
    id: 'q020', type: 'listening', level: 'N4',
    stem: 'すみません、電車が遅れていますから、十分ぐらい遅刻します。',
    options: [
      'I will be early today.',
      'I will be about 10 minutes late because the train is delayed.',
      'The train will arrive on time.',
      'I cannot come today.',
    ],
    answer: 1,
    explain: '電車が遅れている = train is delayed. 十分ぐらい遅刻します = will be about 10 min late.',
    audio: true,
  },
  {
    id: 'q021', type: 'listening', level: 'N4',
    stem: 'お会計はカードで払えますか。',
    options: [
      'Can I pay the bill by card?',
      'Is there a discount?',
      'Where is the cashier?',
      'Can I get a receipt?',
    ],
    answer: 0,
    explain: 'お会計 = bill, カードで払う = pay by card, ますか = polite question.',
    audio: true,
  },

  // ----- reading comprehension -----
  {
    id: 'q022', type: 'reading', level: 'N4',
    passage: '田中さんへ\n\n来週の月曜日の会議は、午後三時からに変わりました。場所は二階の会議室Bです。資料は私が用意します。質問があれば、メールで連絡してください。\n\n山本',
    stem: '会議の場所はどこですか。',
    options: ['一階の会議室A', '二階の会議室B', '三階の会議室C', '一階のロビー'],
    answer: 1,
    explain: '本文に「場所は二階の会議室Bです」とあります。',
  },
  {
    id: 'q023', type: 'reading', level: 'N4',
    passage: '田中さんへ\n\n来週の月曜日の会議は、午後三時からに変わりました。場所は二階の会議室Bです。資料は私が用意します。質問があれば、メールで連絡してください。\n\n山本',
    stem: '田中さんは何をしなければなりませんか。',
    options: ['資料を用意する', '会議室を予約する', '何もしなくてもいい (質問があればメールする)', '山本さんに電話する'],
    answer: 2,
    explain: '資料は山本さんが用意するので、田中さんは特に何もしなくてOK。質問だけメールで送る。',
  },
  {
    id: 'q024', type: 'reading', level: 'N4',
    passage: '日本のコンビニでは、お弁当を温められます。レジで「温めてください」と店員さんに言うと、電子レンジで温めてくれます。冬は温かいお茶も人気です。',
    stem: 'お弁当を温めたい時、どうしますか。',
    options: ['自分で電子レンジを使う', '店員さんに「温めてください」と言う', '家で温める', 'お茶を頼む'],
    answer: 1,
    explain: '「店員さんに『温めてください』と言うと」と書いてあります。',
  },
];

// Build a balanced mock test of n questions across types.
export function buildMockTest(n = 12) {
  const byType = {
    kanji: shuffle(QUESTIONS.filter((q) => q.type === 'kanji')),
    vocab: shuffle(QUESTIONS.filter((q) => q.type === 'vocab')),
    grammar: shuffle(QUESTIONS.filter((q) => q.type === 'grammar')),
    listening: shuffle(QUESTIONS.filter((q) => q.type === 'listening')),
    reading: shuffle(QUESTIONS.filter((q) => q.type === 'reading')),
  };
  // Aim for roughly balanced distribution.
  const order = ['kanji', 'vocab', 'grammar', 'listening', 'reading'];
  const picked = [];
  while (picked.length < n) {
    let added = false;
    for (const t of order) {
      if (picked.length >= n) break;
      if (byType[t].length > 0) {
        picked.push(byType[t].shift());
        added = true;
      }
    }
    if (!added) break;
  }
  return picked;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const QTYPE_LABEL = {
  kanji: '漢字読み',
  vocab: '語彙',
  grammar: '文法',
  listening: '聴解',
  reading: '読解',
};
