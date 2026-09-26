// Tokyo-standard pitch accent data for high-frequency vocabulary.
//
// Accent number convention (NHK / Akinaga):
//   0 = 平板型 (heiban) — no drop; pitch rises after 1st mora and stays
//   1 = 頭高型 (atamadaka) — high on 1st mora, drops after
//   2 = 中高型 — drop after 2nd mora
//   3, 4, ... = drop after that mora
//   N (= mora count) = 尾高型 (odaka) — drop on the particle after the word
//
// Disclaimer: covers ~80 common N5 vocab words. Tokyo standard only. Regional
// pronunciation varies widely. For full coverage, integrate verified data
// (e.g., NHK 日本語発音アクセント辞典).

import { splitMora } from '../phonetics.js';

// Map vocab id (e.g., 'v001') → accent number.
export const ACCENT_DATA = {
  // pronouns / people
  'v001': 0, // 私 わたし — heiban
  'v005': 0, // 学生 がくせい
  'v006': 3, // 先生 せんせい — LHHL
  'v007': 0, // 友達 ともだち
  'v008': 0, // 家族 かぞく
  'v018': 0, // 名前 なまえ
  'v019': 2, // 人 ひと → ひと (LH-L on particle)
  'v022': 2, // 日本 にほん — LHL
  'v023': 0, // 国 くに

  // numbers / time
  'v030': 2, // 一 いち
  'v031': 1, // 二 に — single mora atamadaka
  'v032': 0, // 三 さん
  'v039': 1, // 十 じゅう
  'v050': 1, // 今 いま — HL
  'v051': 1, // 今日 きょう — HL
  'v052': 3, // 明日 あした — LHL  (note: あした has 3 mora; commonly 3)
  'v053': 2, // 昨日 きのう — LHL
  'v054': 0, // 時間 じかん
  'v057': 1, // 朝 あさ — HL
  'v058': 2, // 昼 ひる — LH (odaka)
  'v059': 1, // 夜 よる — HL
  'v062': 1, // 週 しゅう
  'v063': 2, // 月 つき — LH (odaka)
  'v064': 1, // 年 とし — HL
  'v065': 3, // 月曜日 げつようび
  'v066': 2, // 火曜日 かようび
  'v067': 3, // 水曜日 すいようび
  'v068': 3, // 木曜日 もくようび
  'v069': 3, // 金曜日 きんようび
  'v070': 2, // 土曜日 どようび
  'v071': 3, // 日曜日 にちようび

  // verbs
  'v080': 0, // 行く いく — heiban
  'v081': 1, // 来る くる — HL
  'v082': 1, // 帰る かえる — HLL
  'v083': 2, // 食べる たべる — LHL
  'v084': 1, // 飲む のむ — HL
  'v085': 1, // 見る みる — HL
  'v086': 0, // 聞く きく — heiban (kiku)
  'v087': 2, // 話す はなす — LHL
  'v088': 1, // 読む よむ — HL
  'v089': 1, // 書く かく — HL
  'v090': 0, // する — heiban
  'v091': 0, // 買う かう
  'v097': 2, // 起きる おきる — LHL
  'v098': 0, // 寝る ねる
  'v105': 0, // 勉強する べんきょうする
  'v106': 0, // 働く はたらく

  // adjectives
  'v130': 3, // 大きい おおきい — LHHL
  'v131': 3, // 小さい ちいさい — LHHL
  'v132': 4, // 新しい あたらしい — LHHHL
  'v133': 2, // 古い ふるい — LHL
  'v134': 2, // 高い たかい — LHL
  'v135': 2, // 安い やすい — LHL
  'v139': 0, // 美味しい おいしい — heiban (commonly)
  'v143': 1, // 良い いい — HL
  'v144': 2, // 悪い わるい — LHL
  'v145': 4, // 面白い おもしろい — LHHHL
  'v147': 3, // 楽しい たのしい — LHHL
  'v148': 1, // 元気 げんき — HLL
  'v150': 1, // 静か しずか — HLL
  'v152': 1, // 便利 べんり — HL
  'v154': 2, // 好き すき — LH (odaka)
  'v155': 0, // 嫌い きらい

  // food
  'v170': 0, // 水 みず
  'v171': 0, // お茶 おちゃ
  'v172': 3, // コーヒー
  'v174': 1, // ご飯 ごはん — HLL
  'v176': 0, // 魚 さかな
  'v177': 2, // 肉 にく — LH (odaka)
  'v178': 0, // 野菜 やさい

  // places / transport
  'v210': 2, // 家 いえ — LH (odaka)
  'v211': 0, // 学校 がっこう
  'v212': 0, // 会社 かいしゃ
  'v213': 0, // 車 くるま
  'v214': 0, // 電車 でんしゃ
  'v215': 1, // 駅 えき — HL
  'v220': 0, // 空港 くうこう

  // weather / season
  'v280': 1, // 天気 てんき
  'v281': 1, // 雨 あめ — HL
  'v282': 2, // 雪 ゆき — LH (odaka)
  'v288': 1, // 春 はる — HL
  'v289': 2, // 夏 なつ — LH (odaka)
  'v290': 1, // 秋 あき — HL
  'v291': 2, // 冬 ふゆ — LH (odaka)

  // common N4
  'v311': 1, // 会議 かいぎ — HL? actually 0 in some sources; using 1 here as common
  'v312': 0, // 社長 しゃちょう
  'v320': 3, // 遅れる おくれる — LHHL
  'v322': 0, // 連絡 れんらく
  'v329': 0, // 面接 めんせつ
  'v350': 0, // 病院 びょういん
  'v353': 0, // 薬 くすり
  'v355': 2, // 熱 ねつ — LH (odaka)
  'v359': 3, // 頭 あたま — LHL
  'v360': 0, // お腹 おなか
  'v361': 1, // 目 め
  'v362': 2, // 耳 みみ — LH (odaka)
  'v363': 0, // 口 くち
  'v364': 1, // 手 て
  'v365': 2, // 足 あし — LH (odaka)

  'v557': 1, // 辞書 じしょ — HL
  'v558': 0, // 宿題 しゅくだい
  'v566': 0, // 漢字 かんじ
  'v567': 0, // 文法 ぶんぽう
};

// Compute mora-by-mora pitch (H/L) from accent number + mora count.
// Returns array of 'H' / 'L'.
export function pitchPattern(accent, moraCount) {
  if (moraCount <= 0) return [];
  if (accent === 0) {
    // 平板: 1st mora low, rest high
    return Array.from({ length: moraCount }, (_, i) => i === 0 ? 'L' : 'H');
  }
  if (accent === 1) {
    // 頭高: 1st high, rest low
    return Array.from({ length: moraCount }, (_, i) => i === 0 ? 'H' : 'L');
  }
  // 中高 / 尾高
  return Array.from({ length: moraCount }, (_, i) => {
    if (i === 0) return 'L';
    return i < accent ? 'H' : 'L';
  });
}

export function getAccent(vocabId, kana) {
  if (vocabId == null) return null;
  if (!(vocabId in ACCENT_DATA)) return null;
  const accent = ACCENT_DATA[vocabId];
  const mora = splitMora(kana);
  return {
    accent,
    pattern: pitchPattern(accent, mora.length),
    label: accentLabel(accent, mora.length),
  };
}

function accentLabel(accent, moraCount) {
  if (accent === 0) return '平板型 (heiban)';
  if (accent === 1) return '頭高型 (atamadaka)';
  if (accent === moraCount) return '尾高型 (odaka)';
  return `中高型 ${accent} (nakadaka)`;
}
