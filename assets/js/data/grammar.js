// N5–N4 grammar points used in the foundation view and test bank.
export const GRAMMAR = [
  {
    id: 'g001',
    pattern: '〜は〜です',
    level: 'N5',
    en: 'A is B (statement)',
    note: 'は marks the topic; です makes the sentence polite.',
    examples: [
      { jp: '私は学生です。', en: 'I am a student.' },
      { jp: 'これは本です。', en: 'This is a book.' },
    ],
  },
  {
    id: 'g002',
    pattern: '〜が〜',
    level: 'N5',
    en: 'subject marker',
    note: 'が highlights new information or the actor of the verb.',
    examples: [
      { jp: '雨が降っています。', en: 'It is raining.' },
    ],
  },
  {
    id: 'g003',
    pattern: '〜を〜',
    level: 'N5',
    en: 'direct object marker',
    note: 'を marks the object of a transitive verb.',
    examples: [
      { jp: 'ご飯を食べます。', en: 'I eat rice.' },
    ],
  },
  {
    id: 'g004',
    pattern: '〜へ / 〜に行きます',
    level: 'N5',
    en: 'go to ~',
    note: 'へ shows direction; に shows destination — both work with 行きます.',
    examples: [
      { jp: '日本へ行きます。', en: 'I will go to Japan.' },
    ],
  },
  {
    id: 'g005',
    pattern: '〜て形',
    level: 'N5',
    en: 'te-form (connector)',
    note: 'Connects sentences, makes requests, forms progressive tense.',
    examples: [
      { jp: '本を読んで、寝ます。', en: 'I read a book and then sleep.' },
    ],
  },
  {
    id: 'g006',
    pattern: '〜てください',
    level: 'N5',
    en: 'Please do ~',
    note: 'Polite request using te-form + ください.',
    examples: [
      { jp: 'ここに名前を書いてください。', en: 'Please write your name here.' },
    ],
  },
  {
    id: 'g007',
    pattern: '〜ています',
    level: 'N5',
    en: 'is ~ing / state',
    note: 'te-form + います shows ongoing action or a current state.',
    examples: [
      { jp: '今、勉強しています。', en: 'I am studying now.' },
    ],
  },
  {
    id: 'g008',
    pattern: '〜ない形',
    level: 'N5',
    en: 'plain negative',
    note: 'Use when negating or with grammar like なくてもいい / なければならない.',
    examples: [
      { jp: 'お酒を飲まない。', en: "I don't drink alcohol." },
    ],
  },
  {
    id: 'g009',
    pattern: '〜たことがあります',
    level: 'N4',
    en: 'Have done ~ before',
    note: 'Past plain verb + ことがある expresses experience.',
    examples: [
      { jp: '日本に行ったことがあります。', en: 'I have been to Japan before.' },
    ],
  },
  {
    id: 'g010',
    pattern: '〜ながら',
    level: 'N4',
    en: 'while doing ~',
    note: 'verb-stem + ながら shows two simultaneous actions by the same person.',
    examples: [
      { jp: '音楽を聞きながら走ります。', en: 'I run while listening to music.' },
    ],
  },
  {
    id: 'g011',
    pattern: '〜たら',
    level: 'N4',
    en: 'if / when ~',
    note: 'Past plain + ら — conditional or sequence.',
    examples: [
      { jp: '雨が降ったら、休みます。', en: 'If it rains, I will rest.' },
    ],
  },
  {
    id: 'g012',
    pattern: '〜ても',
    level: 'N4',
    en: 'even if ~',
    note: 'te-form + も shows concession.',
    examples: [
      { jp: '高くても買います。', en: 'I will buy it even if it is expensive.' },
    ],
  },
  {
    id: 'g013',
    pattern: '〜なければなりません',
    level: 'N4',
    en: 'must do ~',
    note: 'Strong obligation; casual form is 〜なきゃ.',
    examples: [
      { jp: '明日早く起きなければなりません。', en: 'I have to get up early tomorrow.' },
    ],
  },
  {
    id: 'g014',
    pattern: '〜てもいいです',
    level: 'N4',
    en: 'may / it is OK to ~',
    note: 'Permission with te-form + もいい.',
    examples: [
      { jp: 'ここに座ってもいいですか。', en: 'May I sit here?' },
    ],
  },
  {
    id: 'g015',
    pattern: '可能形',
    level: 'N4',
    en: 'potential form (can ~)',
    note: '食べる→食べられる, 書く→書ける. Use を→が usually.',
    examples: [
      { jp: '日本語が話せます。', en: 'I can speak Japanese.' },
    ],
  },
  {
    id: 'g016',
    pattern: '〜と思います',
    level: 'N4',
    en: 'I think ~',
    note: 'Plain form + と思います to soften opinions.',
    examples: [
      { jp: '雨が降ると思います。', en: 'I think it will rain.' },
    ],
  },
  {
    id: 'g017',
    pattern: '〜つもりです',
    level: 'N4',
    en: 'plan to ~',
    note: 'Plain non-past + つもり for intention.',
    examples: [
      { jp: '日本で働くつもりです。', en: 'I plan to work in Japan.' },
    ],
  },
  {
    id: 'g018',
    pattern: '〜ようです',
    level: 'N4',
    en: 'seems / appears',
    note: 'Based on direct observation or evidence.',
    examples: [
      { jp: '彼は疲れているようです。', en: 'He seems tired.' },
    ],
  },
];

export function findGrammar(id) {
  return GRAMMAR.find((g) => g.id === id);
}
