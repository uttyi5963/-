// N5–N4 grammar points used in the foundation view and test bank.
// Covers ~50 patterns. For full JLPT prep, additional patterns should be added.
export const GRAMMAR = [
  // ========== N5 BASICS ==========
  {
    id: 'g001', pattern: '〜は〜です', level: 'N5', en: 'A is B (statement)',
    note: 'は marks the topic; です makes the sentence polite.',
    examples: [
      { jp: '私は学生です。', en: 'I am a student.' },
      { jp: 'これは本です。', en: 'This is a book.' },
    ],
  },
  {
    id: 'g002', pattern: '〜が〜', level: 'N5', en: 'subject marker',
    note: 'が highlights new information or the actor of the verb.',
    examples: [
      { jp: '雨が降っています。', en: 'It is raining.' },
      { jp: '私が行きます。', en: 'I (specifically) will go.' },
    ],
  },
  {
    id: 'g003', pattern: '〜を〜', level: 'N5', en: 'direct object marker',
    note: 'を marks the object of a transitive verb.',
    examples: [
      { jp: 'ご飯を食べます。', en: 'I eat rice.' },
      { jp: '本を読みます。', en: 'I read a book.' },
    ],
  },
  {
    id: 'g004', pattern: '〜へ / 〜に行きます', level: 'N5', en: 'go to ~',
    note: 'へ shows direction; に shows destination. Both work with 行く/来る/帰る.',
    examples: [
      { jp: '日本へ行きます。', en: 'I will go to Japan.' },
      { jp: '友達に会いに行きます。', en: 'I am going to meet a friend.' },
    ],
  },
  {
    id: 'g005', pattern: '〜で〜', level: 'N5', en: 'at/by/with',
    note: 'で marks location of action, means of doing something, or instrument.',
    examples: [
      { jp: '図書館で勉強します。', en: 'I study at the library.' },
      { jp: 'バスで行きます。', en: 'I go by bus.' },
    ],
  },
  {
    id: 'g006', pattern: '〜と〜', level: 'N5', en: 'with / and',
    note: 'と connects nouns ("A and B") and shows "with someone".',
    examples: [
      { jp: '友達と映画を見ます。', en: 'I watch a movie with my friend.' },
    ],
  },
  {
    id: 'g007', pattern: '〜から〜まで', level: 'N5', en: 'from ~ to ~',
    note: 'Used for time and place ranges.',
    examples: [
      { jp: '九時から五時まで働きます。', en: 'I work from 9 to 5.' },
    ],
  },
  {
    id: 'g008', pattern: '〜も〜', level: 'N5', en: 'also / too',
    note: 'も replaces は/が/を to mean "also" or "too".',
    examples: [
      { jp: '私も学生です。', en: 'I am also a student.' },
    ],
  },
  {
    id: 'g009', pattern: 'これ・それ・あれ', level: 'N5', en: 'this / that / that over there',
    note: 'これ = near speaker, それ = near listener, あれ = far from both.',
    examples: [
      { jp: 'これは私の本です。', en: 'This is my book.' },
    ],
  },
  {
    id: 'g010', pattern: '〜ません', level: 'N5', en: 'polite negative',
    note: 'Replace ます with ません to make the polite negative form.',
    examples: [
      { jp: 'お酒を飲みません。', en: "I don't drink alcohol." },
    ],
  },
  {
    id: 'g011', pattern: '〜ました / 〜ませんでした', level: 'N5', en: 'polite past',
    note: '〜ました = polite past affirmative. 〜ませんでした = polite past negative.',
    examples: [
      { jp: '昨日、映画を見ました。', en: 'I watched a movie yesterday.' },
      { jp: '昨日、行きませんでした。', en: "I didn't go yesterday." },
    ],
  },

  // ========== N5 ADJECTIVES ==========
  {
    id: 'g012', pattern: 'い形容詞', level: 'N5', en: 'i-adjectives',
    note: 'Adjectives ending in い conjugate: 大きい→大きく/大きかった/大きくない.',
    examples: [
      { jp: 'この本は面白いです。', en: 'This book is interesting.' },
      { jp: '昨日は寒くなかったです。', en: "Yesterday wasn't cold." },
    ],
  },
  {
    id: 'g013', pattern: 'な形容詞', level: 'N5', en: 'na-adjectives',
    note: 'Modify nouns with な (静かな部屋); used with です like nouns.',
    examples: [
      { jp: 'この町は静かです。', en: 'This town is quiet.' },
      { jp: '便利な道具です。', en: 'It is a convenient tool.' },
    ],
  },
  {
    id: 'g014', pattern: '〜が好きです', level: 'N5', en: 'I like ~',
    note: 'Use が (not を) before 好き/嫌い/上手/下手.',
    examples: [
      { jp: '寿司が好きです。', en: 'I like sushi.' },
    ],
  },

  // ========== N5 VERB FORMS ==========
  {
    id: 'g020', pattern: '〜て形', level: 'N5', en: 'te-form (connector)',
    note: 'Connects sentences, makes requests, forms progressive tense.',
    examples: [
      { jp: '本を読んで、寝ます。', en: 'I read a book and then sleep.' },
    ],
  },
  {
    id: 'g021', pattern: '〜てください', level: 'N5', en: 'Please do ~',
    note: 'Polite request using te-form + ください.',
    examples: [
      { jp: 'ここに名前を書いてください。', en: 'Please write your name here.' },
    ],
  },
  {
    id: 'g022', pattern: '〜ています', level: 'N5', en: 'is ~ing / state',
    note: 'te-form + います shows ongoing action or a current state.',
    examples: [
      { jp: '今、勉強しています。', en: 'I am studying now.' },
      { jp: '東京に住んでいます。', en: 'I live in Tokyo.' },
    ],
  },
  {
    id: 'g023', pattern: '〜ない形', level: 'N5', en: 'plain negative',
    note: 'Use when negating or with grammar like なくてもいい / なければならない.',
    examples: [
      { jp: 'お酒を飲まない。', en: "I don't drink alcohol." },
    ],
  },
  {
    id: 'g024', pattern: '〜た形', level: 'N5', en: 'plain past',
    note: 'Plain past form. Used with grammar points like 〜たことがある, 〜たら.',
    examples: [
      { jp: '昨日、京都に行った。', en: 'I went to Kyoto yesterday.' },
    ],
  },
  {
    id: 'g025', pattern: '〜たい', level: 'N5', en: 'want to ~',
    note: 'Verb stem + たい to express your own desire.',
    examples: [
      { jp: '日本に行きたいです。', en: 'I want to go to Japan.' },
      { jp: '寿司を食べたいです。', en: 'I want to eat sushi.' },
    ],
  },
  {
    id: 'g026', pattern: '〜ましょう / 〜ませんか', level: 'N5', en: "let's / shall we",
    note: '〜ましょう = let\'s do it. 〜ませんか = won\'t you do it with me? (invitation)',
    examples: [
      { jp: '一緒に行きましょう。', en: "Let's go together." },
      { jp: 'コーヒーを飲みませんか。', en: 'Would you like to have coffee?' },
    ],
  },

  // ========== N5 OTHER ==========
  {
    id: 'g030', pattern: '〜より〜の方が', level: 'N5', en: 'A is more ~ than B',
    note: 'Comparison structure. The comparison target uses より.',
    examples: [
      { jp: '日本語は英語より難しいです。', en: 'Japanese is more difficult than English.' },
    ],
  },
  {
    id: 'g031', pattern: '〜の中で〜が一番〜', level: 'N5', en: 'most ~ in/among ~',
    note: 'Superlative: "of all X, Y is the most Z".',
    examples: [
      { jp: '果物の中でりんごが一番好きです。', en: 'Among fruits, I like apples the most.' },
    ],
  },
  {
    id: 'g032', pattern: '〜ながら', level: 'N4', en: 'while doing ~',
    note: 'Verb-stem + ながら shows two simultaneous actions by the same person.',
    examples: [
      { jp: '音楽を聞きながら走ります。', en: 'I run while listening to music.' },
    ],
  },

  // ========== N4 ==========
  {
    id: 'g040', pattern: '〜たことがあります', level: 'N4', en: 'Have done ~ before',
    note: 'Past plain verb + ことがある expresses experience.',
    examples: [
      { jp: '日本に行ったことがあります。', en: 'I have been to Japan before.' },
    ],
  },
  {
    id: 'g041', pattern: '〜たら', level: 'N4', en: 'if / when ~',
    note: 'Past plain + ら — conditional or sequence.',
    examples: [
      { jp: '雨が降ったら、休みます。', en: 'If it rains, I will rest.' },
      { jp: '家に帰ったら、電話してください。', en: 'Please call me when you get home.' },
    ],
  },
  {
    id: 'g042', pattern: '〜ても', level: 'N4', en: 'even if ~',
    note: 'te-form + も shows concession.',
    examples: [
      { jp: '高くても買います。', en: 'I will buy it even if it is expensive.' },
    ],
  },
  {
    id: 'g043', pattern: '〜なければなりません', level: 'N4', en: 'must do ~',
    note: 'Strong obligation; casual form is 〜なきゃ.',
    examples: [
      { jp: '明日早く起きなければなりません。', en: 'I have to get up early tomorrow.' },
    ],
  },
  {
    id: 'g044', pattern: '〜なくてもいいです', level: 'N4', en: "don't have to ~",
    note: 'No need to do something.',
    examples: [
      { jp: '宿題はしなくてもいいです。', en: "You don't have to do the homework." },
    ],
  },
  {
    id: 'g045', pattern: '〜てもいいです', level: 'N4', en: 'may / it is OK to ~',
    note: 'Permission with te-form + もいい.',
    examples: [
      { jp: 'ここに座ってもいいですか。', en: 'May I sit here?' },
    ],
  },
  {
    id: 'g046', pattern: '〜てはいけません', level: 'N4', en: 'must not ~',
    note: 'Prohibition.',
    examples: [
      { jp: 'ここでタバコを吸ってはいけません。', en: 'You must not smoke here.' },
    ],
  },
  {
    id: 'g047', pattern: '可能形', level: 'N4', en: 'potential form (can ~)',
    note: '食べる→食べられる, 書く→書ける. Object usually marked with が.',
    examples: [
      { jp: '日本語が話せます。', en: 'I can speak Japanese.' },
      { jp: '辛い物が食べられません。', en: "I can't eat spicy food." },
    ],
  },
  {
    id: 'g048', pattern: '意向形 (〜よう / 〜おう)', level: 'N4', en: "let's ~ (plain)",
    note: '行く→行こう, 食べる→食べよう. Casual version of 〜ましょう.',
    examples: [
      { jp: '一緒に食べよう。', en: "Let's eat together." },
    ],
  },
  {
    id: 'g049', pattern: '〜と思います', level: 'N4', en: 'I think ~',
    note: 'Plain form + と思います to soften opinions.',
    examples: [
      { jp: '雨が降ると思います。', en: 'I think it will rain.' },
    ],
  },
  {
    id: 'g050', pattern: '〜つもりです', level: 'N4', en: 'plan to ~',
    note: 'Plain non-past + つもり for intention.',
    examples: [
      { jp: '日本で働くつもりです。', en: 'I plan to work in Japan.' },
    ],
  },
  {
    id: 'g051', pattern: '〜予定です', level: 'N4', en: 'be scheduled to ~',
    note: 'More formal than つもり; based on a fixed plan.',
    examples: [
      { jp: '来月、日本へ行く予定です。', en: 'I am scheduled to go to Japan next month.' },
    ],
  },
  {
    id: 'g052', pattern: '〜ようです', level: 'N4', en: 'seems / appears',
    note: 'Based on direct observation or evidence.',
    examples: [
      { jp: '彼は疲れているようです。', en: 'He seems tired.' },
    ],
  },
  {
    id: 'g053', pattern: '〜そうです (見た目)', level: 'N4', en: 'looks ~ (appearance)',
    note: 'Verb stem / adj. stem + そう. Based on appearance.',
    examples: [
      { jp: 'この料理は美味しそうです。', en: 'This dish looks tasty.' },
    ],
  },
  {
    id: 'g054', pattern: '〜そうです (伝聞)', level: 'N4', en: 'I heard that ~',
    note: 'Plain form + そうです. Reporting what you heard from someone.',
    examples: [
      { jp: '明日は雨が降るそうです。', en: 'I heard it will rain tomorrow.' },
    ],
  },
  {
    id: 'g055', pattern: '〜ために', level: 'N4', en: 'in order to ~',
    note: 'Purpose. Verb plain + ために. Noun + のために.',
    examples: [
      { jp: '日本で働くために、日本語を勉強しています。', en: 'I am studying Japanese in order to work in Japan.' },
    ],
  },
  {
    id: 'g056', pattern: '〜ように', level: 'N4', en: 'so that ~',
    note: 'Verb plain + ように. Used with potential / non-volitional verbs.',
    examples: [
      { jp: '聞こえるように大きい声で話してください。', en: 'Please speak loudly so you can be heard.' },
    ],
  },
  {
    id: 'g057', pattern: '〜あげる / くれる / もらう', level: 'N4', en: 'giving and receiving',
    note: 'あげる = give (away from me). くれる = give (to me). もらう = receive.',
    examples: [
      { jp: '友達に本をあげました。', en: 'I gave a book to my friend.' },
      { jp: '父が時計をくれました。', en: 'My father gave me a watch.' },
    ],
  },
  {
    id: 'g058', pattern: '〜てあげる / 〜てくれる / 〜てもらう', level: 'N4', en: 'doing favors',
    note: 'Combine te-form with あげる/くれる/もらう to express doing actions for someone.',
    examples: [
      { jp: '友達が宿題を手伝ってくれました。', en: 'My friend helped me with my homework.' },
    ],
  },
  {
    id: 'g059', pattern: '〜ば', level: 'N4', en: 'if ~ (conditional)',
    note: 'Verb conditional. 行く→行けば, 食べる→食べれば. Often used for general/hypothetical conditions.',
    examples: [
      { jp: '時間があれば、行きます。', en: 'If I have time, I will go.' },
    ],
  },
  {
    id: 'g060', pattern: '〜なら', level: 'N4', en: 'if it\'s the case that ~',
    note: 'Conditional based on a topic raised by the other person.',
    examples: [
      { jp: '日本へ行くなら、新幹線がいいです。', en: 'If you are going to Japan, the bullet train is good.' },
    ],
  },
  {
    id: 'g061', pattern: '〜まで / 〜までに', level: 'N4', en: 'until / by ~',
    note: 'まで = continuing until. までに = deadline by which.',
    examples: [
      { jp: '五時まで働きます。', en: 'I work until 5.' },
      { jp: '五時までに終わります。', en: 'I will finish by 5.' },
    ],
  },
  {
    id: 'g062', pattern: '受身形 (passive)', level: 'N4', en: 'passive form',
    note: '飲む→飲まれる, 食べる→食べられる. Often used to express "was ~ed" or annoyance.',
    examples: [
      { jp: '雨に降られました。', en: 'I was rained on (and inconvenienced).' },
    ],
  },
  {
    id: 'g063', pattern: '使役形 (causative)', level: 'N4', en: 'causative form',
    note: '飲む→飲ませる, 食べる→食べさせる. Means "make / let someone do".',
    examples: [
      { jp: '子供に野菜を食べさせます。', en: 'I make my child eat vegetables.' },
    ],
  },
  {
    id: 'g064', pattern: '〜やすい / 〜にくい', level: 'N4', en: 'easy/hard to do ~',
    note: 'Verb stem + やすい (easy) / にくい (difficult).',
    examples: [
      { jp: 'このペンは書きやすいです。', en: 'This pen is easy to write with.' },
    ],
  },
  {
    id: 'g065', pattern: '〜すぎる', level: 'N4', en: 'too much / overly ~',
    note: 'Verb stem / adjective stem + すぎる.',
    examples: [
      { jp: '昨日、食べすぎました。', en: 'I ate too much yesterday.' },
    ],
  },
];

export function findGrammar(id) {
  return GRAMMAR.find((g) => g.id === id);
}
