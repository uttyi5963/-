// ============================================================
// クリスタルナイツ - ゲームデータ定義
// マップ / モンスター / アイテム / まほう / イベント
// ============================================================

const DATA = {};

// ---------------- じゅもん ----------------
// type: 'dmg'(こうげき) 'heal'(かいふく) 'revive' 'cure'(じょうたい) 'buff'
// cast: えいしょう時間(びょう)。0または省略で即時発動
DATA.spells = {
  cure1:   { name: "ケアル",     mp: 4,  type: "heal",   pow: 30,  cast: 0.8, target: "ally",  field: true },
  cure2:   { name: "ケアルラ",   mp: 9,  type: "heal",   pow: 95,  cast: 1.4, target: "ally",  field: true },
  poisona: { name: "ポイゾナ",   mp: 3,  type: "cure",   cast: 0.6, target: "ally",  field: true },
  esuna:   { name: "エスナ",     mp: 10, type: "cure",   cureAll: true, cast: 1.0, target: "ally", field: true },
  protect: { name: "プロテス",   mp: 5,  type: "buff",   cast: 1.0, target: "ally" },
  raise:   { name: "レイズ",     mp: 15, type: "revive", pow: 0.5, cast: 2.4, target: "ally",  field: true },
  fire1:   { name: "ファイア",   mp: 5,  type: "dmg", pow: 28, cast: 1.0, elem: "fire",    target: "enemy" },
  ice1:    { name: "ブリザド",   mp: 5,  type: "dmg", pow: 32, cast: 1.0, elem: "ice",     target: "enemy" },
  bolt1:   { name: "サンダー",   mp: 6,  type: "dmg", pow: 38, cast: 1.2, elem: "thunder", target: "enemy" },
  fire2:   { name: "ファイラ",   mp: 12, type: "dmg", pow: 75, cast: 2.0, elem: "fire",    target: "enemy" },
  ice2:    { name: "ブリザラ",   mp: 14, type: "dmg", pow: 88, cast: 2.2, elem: "ice",     target: "enemy" },
  // じょういまほう (レベル15いこうで しゅうとく)
  fire3:   { name: "ファイガ",   mp: 22, type: "dmg", pow: 140, cast: 2.6, elem: "fire",    target: "enemy" },
  ice3:    { name: "ブリザガ",   mp: 26, type: "dmg", pow: 165, cast: 2.8, elem: "ice",     target: "enemy" },
  bolt3:   { name: "サンダガ",   mp: 30, type: "dmg", pow: 190, cast: 3.0, elem: "thunder", target: "enemy" },
  flare:   { name: "フレア",     mp: 48, type: "dmg", pow: 320, cast: 4.0, elem: "none",    target: "enemy" },
  cure3:   { name: "ケアルガ",   mp: 20, type: "heal", pow: 220, cast: 1.8, target: "ally",  field: true },
  rain:    { name: "いやしのあめ", mp: 32, type: "heal", pow: 110, cast: 2.2, target: "ally", all: true, field: true },
  saint:   { name: "セイントレイ", mp: 40, type: "dmg", pow: 260, cast: 3.4, elem: "holy",  target: "enemy" },
  drain:   { name: "ドレイン",   mp: 12, type: "dmg", pow: 60,  cast: 1.4, elem: "none",  target: "enemy", drain: true },
  quake:   { name: "クエイク",   mp: 34, type: "dmg", pow: 120, cast: 3.0, elem: "none",  target: "enemy", all: true },
  protect2: { name: "プロテガ",  mp: 24, type: "buff", cast: 2.0, target: "ally", all: true },
  // てきせんよう
  e_fire:  { name: "ファイア",   mp: 0, type: "dmg", pow: 16, cast: 1.2, elem: "fire",    target: "enemy" },
  e_ice_all:{ name: "つめたいいき", mp: 0, type: "dmg", pow: 15, elem: "ice",  target: "enemy", all: true },
  e_fire2: { name: "ファイラ",   mp: 0, type: "dmg", pow: 40, cast: 2.2, elem: "fire",    target: "enemy" },
  e_meteo: { name: "ダークメテオ", mp: 0, type: "dmg", pow: 48, cast: 3.2, elem: "none",  target: "enemy", all: true },
  e_toad:  { name: "カエルのうた", mp: 0, type: "status", status: "toad",    cast: 1.5, target: "enemy" },
  e_silence:{ name: "ちんもくのかぜ", mp: 0, type: "status", status: "silence", cast: 1.2, target: "enemy" },
  e_ice:   { name: "ブリザド",     mp: 0, type: "dmg", pow: 20, cast: 1.2, elem: "ice", target: "enemy" },
  e_breath:{ name: "こおりのブレス", mp: 0, type: "dmg", pow: 30, cast: 2.5, elem: "ice", target: "enemy", all: true },
  e_wave:  { name: "おおつなみ",   mp: 0, type: "dmg", pow: 35, cast: 2.8, elem: "ice", target: "enemy", all: true },
  e_ink:   { name: "すみはき",     mp: 0, type: "status", status: "blind", cast: 1.0, target: "enemy" },
  e_eruption: { name: "ふんか",    mp: 0, type: "dmg", pow: 40, cast: 3.0, elem: "fire", target: "enemy", all: true },
  e_bolt:  { name: "サンダー",     mp: 0, type: "dmg", pow: 22, cast: 1.2, elem: "thunder", target: "enemy" },
  e_quake: { name: "じしん",       mp: 0, type: "dmg", pow: 45, cast: 3.0, elem: "none", target: "enemy", all: true },
  e_gale:  { name: "かまいたち",   mp: 0, type: "dmg", pow: 30, cast: 1.5, elem: "none", target: "enemy" },
  e_tornado: { name: "たつまき",   mp: 0, type: "dmg", pow: 50, cast: 3.4, elem: "none", target: "enemy", all: true },
  e_bolt2: { name: "いなずま",     mp: 0, type: "dmg", pow: 45, cast: 2.0, elem: "thunder", target: "enemy" },
  e_bigwave: { name: "だいかいしょう", mp: 0, type: "dmg", pow: 55, cast: 3.5, elem: "ice", target: "enemy", all: true },
  e_starfall: { name: "ほしくずのあめ", mp: 0, type: "dmg", pow: 60, cast: 3.8, elem: "none", target: "enemy", all: true },
};

// じょうたいいじょう
DATA.statuses = {
  poison:  { name: "どく",     mark: "ど" },
  blind:   { name: "くらやみ", mark: "や" },
  silence: { name: "ちんもく", mark: "ち" },
  toad:    { name: "カエル",   mark: "カ" },
};

// ---------------- アイテム ----------------
// kind: 'use'(つかう) 'weapon' 'armor' 'key'
DATA.items = {
  potion:   { name: "ポーション",     kind: "use", price: 30,  heal: 60,  desc: "HPを 60 かいふく" },
  hipotion: { name: "ハイポーション", kind: "use", price: 150, heal: 250, desc: "HPを 250 かいふく" },
  ether:    { name: "エーテル",       kind: "use", price: 100, mp: 40,    desc: "MPを 40 かいふく" },
  phoenix:  { name: "フェニックスのお", kind: "use", price: 400, revive: 0.5, desc: "せんとうふのうから ふっかつ" },
  antidote: { name: "どくけし",       kind: "use", price: 20,  cure: "poison", desc: "どくを なおす" },
  eyedrops: { name: "めぐすり",       kind: "use", price: 20,  cure: "blind", desc: "くらやみを なおす" },
  echoherb: { name: "やまびこそう",   kind: "use", price: 30,  cure: "silence", desc: "ちんもくを なおす" },
  kiss:     { name: "おとめのキッス", kind: "use", price: 60,  cure: "toad", desc: "カエルを もとにもどす" },
  elixir:   { name: "エリクサー",     kind: "use", price: 2000, elixir: true, desc: "HPとMPが かんぜんかいふく" },
  megapotion: { name: "メガポーション", kind: "use", price: 500, heal: 600, desc: "HPを 600 かいふく" },
  worldtear: { name: "せかいのしずく", kind: "use", price: 0, partyheal: true, desc: "なかまぜんいんが かんぜんかいふく" },
  xpotion:  { name: "エクスポーション", kind: "use", price: 1500, heal: 2000, desc: "HPを 2000 かいふく" },
  hiether:  { name: "ハイエーテル",   kind: "use", price: 800, mp: 150, desc: "MPを 150 かいふく" },
  remedy:   { name: "ばんのうやく",   kind: "use", price: 500, cureall: true, desc: "すべての じょうたいいじょうを なおす" },

  w_dark:    { name: "ダークソード",   kind: "weapon", price: 300, atk: 8,  who: ["leon"], dark: true },
  w_steel:   { name: "こうてつのつるぎ", kind: "weapon", price: 450, atk: 12, who: ["leon"] },
  w_mythril: { name: "ミスリルソード", kind: "weapon", price: 900, atk: 16, who: ["leon"] },
  w_light:   { name: "ひかりのつるぎ", kind: "weapon", price: 0,   atk: 24, who: ["leon"], elem: "holy", slay: ["undead"] },
  w_staff:   { name: "ロッド",         kind: "weapon", price: 60,  atk: 3,  who: ["rod", "celia"] },
  w_wizstaff:{ name: "まどうのつえ",   kind: "weapon", price: 500, atk: 7, int: 3, who: ["rod"] },
  w_mace:    { name: "いやしのつえ",   kind: "weapon", price: 450, atk: 6, int: 2, who: ["celia"] },
  w_crystalrod: { name: "すいしょうロッド", kind: "weapon", price: 1300, atk: 8, int: 4, who: ["celia"] },
  w_flame:   { name: "フレイムソード", kind: "weapon", price: 1200, atk: 19, who: ["leon"], elem: "fire" },
  w_iceblade:{ name: "こおりのつるぎ", kind: "weapon", price: 1800, atk: 22, who: ["leon"], elem: "ice" },
  w_star:    { name: "ほしくずのつるぎ", kind: "weapon", price: 0, atk: 30, who: ["leon"], elem: "holy", slay: ["undead", "demon"] },
  w_halberd: { name: "ハルバード",     kind: "weapon", price: 2400, atk: 21, who: ["glen"] },
  w_battleclaw: { name: "ばくれつのつめ", kind: "weapon", price: 2200, atk: 20, who: ["gou"], elem: "fire" },
  w_sagestaff: { name: "けんじゃのつえ", kind: "weapon", price: 2600, atk: 12, int: 6, who: ["rod"] },
  w_spiritrod: { name: "せいれいロッド", kind: "weapon", price: 2400, atk: 10, int: 5, who: ["celia"] },
  w_spear:   { name: "やり",           kind: "weapon", price: 250, atk: 8,  who: ["glen"] },
  w_lance:   { name: "ミスリルのやり", kind: "weapon", price: 850, atk: 15, who: ["glen"] },
  w_dragonlance: { name: "りゅうのやり", kind: "weapon", price: 1500, atk: 17, who: ["glen"], slay: ["dragon"] },
  w_windspear: { name: "かぜのやり",   kind: "weapon", price: 3000, atk: 26, who: ["glen"] },
  w_trident: { name: "トライデント",   kind: "weapon", price: 3600, atk: 28, who: ["glen"], elem: "thunder" },
  w_gigalance: { name: "ぎんがのやり", kind: "weapon", price: 0, atk: 32, who: ["glen"], elem: "holy" },
  w_claw:    { name: "てつのつめ",     kind: "weapon", price: 200, atk: 6,  who: ["gou"] },
  w_ironclaw:{ name: "タイガークロー", kind: "weapon", price: 700, atk: 13, who: ["gou"] },
  w_thunderclaw: { name: "かみなりのつめ", kind: "weapon", price: 1400, atk: 16, who: ["gou"], elem: "thunder" },
  w_kingclaw: { name: "りゅうおうのつめ", kind: "weapon", price: 0, atk: 34, who: ["gou"], slay: ["dragon"] },
  w_garon:   { name: "ごうけつのつめ",   kind: "weapon", price: 0, atk: 28, who: ["gou"] },
  a_hachimaki2: { name: "けんおうのはちまき", kind: "armor", price: 0, def: 22, who: ["gou"] },
  w_dverg:   { name: "ドヴェルグアクス", kind: "weapon", price: 0, atk: 38, who: ["leon", "glen"] },
  a_dverg2:  { name: "ドヴェルグのたて", kind: "armor", price: 0, def: 27, who: ["leon", "glen"] },
  // げんじゅうの ほうしゅう
  a_sylphid: { name: "かぜのマント",     kind: "armor", price: 0, def: 29, int: 6, who: ["rod", "celia"] },
  a_gnomos:  { name: "だいちのおおたて", kind: "armor", price: 0, def: 31, who: ["leon", "glen"] },
  w_undina:  { name: "うみなりのつえ",   kind: "weapon", price: 0, atk: 16, int: 10, who: ["celia"] },
  // こじんイベントほうしゅう
  w_kizuna:  { name: "きずなのやり",   kind: "weapon", price: 0, atk: 27, who: ["glen"], slay: ["demon"] },
  w_truthbook: { name: "しんりのしょ", kind: "weapon", price: 0, atk: 13, int: 7, who: ["rod"] },
  w_prayrod: { name: "いのりのロッド", kind: "weapon", price: 0, atk: 11, int: 6, who: ["celia"] },
  a_hachimaki: { name: "せんしのはちまき", kind: "armor", price: 0, def: 18, who: ["gou"] },
  a_fairy:   { name: "フェアリーローブ", kind: "armor", price: 0, def: 14, int: 4, who: ["rod", "celia"] },
  a_royalmail: { name: "おうこくのよろい", kind: "armor", price: 5000, def: 24, who: ["leon", "glen"] },
  a_royal:   { name: "おうけのローブ",   kind: "armor", price: 4200, def: 19, int: 5, who: ["rod", "celia"] },
  w_boltstaff: { name: "いかずちのつえ", kind: "weapon", price: 1600, atk: 10, int: 4, who: ["rod"] },
  // ほしのせかい ティア (セレーネで はんばい)
  w_comet:   { name: "コメットブレード", kind: "weapon", price: 9000, atk: 44, who: ["leon"] },
  w_starlance: { name: "ほしのやり",     kind: "weapon", price: 8500, atk: 42, who: ["glen"] },
  w_cosmoclaw: { name: "コスモクロー",   kind: "weapon", price: 8000, atk: 40, who: ["gou"] },
  w_nebularod: { name: "せいうんのつえ", kind: "weapon", price: 9000, atk: 16, int: 9, who: ["rod"] },
  w_moonwand: { name: "つきのつえ",      kind: "weapon", price: 8500, atk: 14, int: 8, who: ["celia"] },
  // きゅうきょくそうび (ほしのせかいの たからばこ)
  w_nova:    { name: "ちょうしんせいのつるぎ", kind: "weapon", price: 0, atk: 60, who: ["leon"], elem: "holy", slay: ["demon", "undead"] },
  w_ryuoh:   { name: "りゅうしんのやり", kind: "weapon", price: 0, atk: 58, who: ["glen"], slay: ["dragon"] },
  w_supernova: { name: "ぎんがのつめ",   kind: "weapon", price: 0, atk: 56, who: ["gou"], elem: "holy" },
  w_astral:  { name: "アストラルロッド", kind: "weapon", price: 0, atk: 20, int: 12, who: ["rod"] },
  w_stella:  { name: "ステラロッド",     kind: "weapon", price: 0, atk: 18, int: 11, who: ["celia"] },

  a_dark:    { name: "あんこくのよろい", kind: "armor", price: 350, def: 6,  who: ["leon"], dark: true },
  a_steel:   { name: "こうてつのよろい", kind: "armor", price: 400, def: 10, who: ["leon", "glen"] },
  a_mythril: { name: "ミスリルメイル", kind: "armor", price: 950, def: 13, who: ["leon", "glen"] },
  a_light:   { name: "ひかりのよろい", kind: "armor", price: 0,   def: 16, who: ["leon"] },
  a_cloth:   { name: "ぬののローブ",   kind: "armor", price: 50,  def: 2,  who: ["rod", "celia", "gou"] },
  a_leather: { name: "かわのよろい",   kind: "armor", price: 200, def: 5,  who: ["leon", "glen", "gou", "rod", "celia"] },
  a_silk:    { name: "シルクのローブ", kind: "armor", price: 400, def: 7, int: 2, who: ["rod", "celia"] },
  a_ice:     { name: "こおりのローブ", kind: "armor", price: 900, def: 9, int: 2, who: ["rod", "celia"] },
  a_aqua:    { name: "アクアメイル",   kind: "armor", price: 1600, def: 15, who: ["leon", "glen"] },
  a_flame:   { name: "ほのおのローブ", kind: "armor", price: 1400, def: 11, int: 2, who: ["rod", "celia"] },
  a_dwarf:   { name: "ドヴェルグメイル", kind: "armor", price: 2400, def: 19, who: ["leon", "glen"] },
  a_gaia:    { name: "だいちのよろい",   kind: "armor", price: 3200, def: 22, who: ["leon", "glen"] },
  a_sylph:   { name: "シルフのローブ",   kind: "armor", price: 3000, def: 16, int: 4, who: ["rod", "celia"] },
  a_abyss:   { name: "しんかいのローブ", kind: "armor", price: 3400, def: 18, int: 5, who: ["rod", "celia"] },
  a_star:    { name: "ほしのよろい",     kind: "armor", price: 0, def: 26, who: ["leon", "glen"] },
  a_cosmos:  { name: "コスモスのローブ", kind: "armor", price: 0, def: 20, int: 6, who: ["rod", "celia"] },
  // ゴウせんよう どうぎ けいとう
  a_gi:      { name: "みきりのどうぎ",   kind: "armor", price: 800, def: 9, who: ["gou"] },
  a_master:  { name: "たつじんのどうぎ", kind: "armor", price: 2000, def: 15, who: ["gou"] },
  a_champ:   { name: "チャンピオンベルト", kind: "armor", price: 0, def: 24, who: ["gou"] },
  a_sage:    { name: "けんじゃのローブ", kind: "armor", price: 2200, def: 13, int: 3, who: ["rod", "celia"] },
  // ほしのせかい ティア
  a_comet:   { name: "コメットメイル",   kind: "armor", price: 9500, def: 30, who: ["leon", "glen"] },
  a_moonrobe: { name: "つきのローブ",    kind: "armor", price: 8800, def: 24, int: 7, who: ["rod", "celia"] },
  a_stargi:  { name: "ほしのどうぎ",     kind: "armor", price: 8200, def: 28, who: ["gou"] },
  // きゅうきょくそうび
  a_nova:    { name: "ちょうしんせいのよろい", kind: "armor", price: 0, def: 36, who: ["leon", "glen"] },
  a_astral:  { name: "アストラルローブ", kind: "armor", price: 0, def: 30, int: 9, who: ["rod", "celia"] },
  a_cosmogi: { name: "ぎんがのどうぎ",   kind: "armor", price: 0, def: 34, who: ["gou"] },
  a_stellar: { name: "ほしのまもり",     kind: "armor", price: 0, def: 28, int: 8, who: ["rod", "celia"] },

  crystal:   { name: "クリスタル",     kind: "key", price: 0, desc: "せいなる ひかりを やどす" },
  glowstone: { name: "かがやくいし",   kind: "key", price: 0, desc: "おおあなのそこで ひろった いし" },
  earthcrystal: { name: "ちのクリスタル", kind: "key", price: 0, desc: "だいちのちからを やどす けっしょう" },
  windcrystal: { name: "かぜのクリスタル", kind: "key", price: 0, desc: "あらしのちからを やどす けっしょう" },
  watercrystal: { name: "みずのクリスタル", kind: "key", price: 0, desc: "うみのちからを やどす けっしょう" },
};

// ---------------- なかま ----------------
// row: たいれつ。後列は 物理ダメージが 与/被 ともに はんぶん
DATA.heroes = {
  leon: {
    name: "レオン", cls: "あんこくきし", spr: "hero", row: "front",
    base:   { hp: 48, mp: 6, str: 10, agi: 7, vit: 9, int: 4 },
    growth: { hp: 11, mp: 2, str: 2, agi: 1, vit: 2, int: 1 },
    weapon: "w_dark", armor: "a_dark",
    special: "dark", // あんこく
    spells: [],
    learn: {},
  },
  glen: {
    name: "グレン", cls: "りゅうきし", spr: "glen", row: "front",
    base:   { hp: 42, mp: 4, str: 11, agi: 8, vit: 8, int: 3 },
    growth: { hp: 10, mp: 1, str: 2, agi: 1, vit: 2, int: 1 },
    weapon: "w_spear", armor: "a_leather",
    command: "jump", // ジャンプ: 2回目からは ダブルジャンプに しんか
    spells: [],
    learn: {},
  },
  gou: {
    name: "ゴウ", cls: "モンク", spr: "gou", row: "front",
    base:   { hp: 58, mp: 0, str: 12, agi: 9, vit: 11, int: 2 },
    growth: { hp: 13, mp: 0, str: 2, agi: 1, vit: 3, int: 0 },
    weapon: "w_claw", armor: "a_leather",
    command: "charge", // ためる: さいだい3かい。つぎのこうげきが 2/4/8ばい
    spells: [],
    learn: {},
  },
  celia: {
    name: "セリア", cls: "しろまどうし", spr: "celia", row: "back",
    base:   { hp: 30, mp: 24, str: 5, agi: 8, vit: 6, int: 11 },
    growth: { hp: 7, mp: 5, str: 1, agi: 1, vit: 1, int: 2 },
    weapon: "w_staff", armor: "a_cloth",
    command: "pray", // いのる: MP0。50%で ぜんいん さいだいHPの30%かいふく
    spells: ["cure1"],
    learn: { 4: "poisona", 6: "protect", 9: "cure2", 10: "esuna", 12: "raise", 16: "cure3", 20: "rain", 22: "protect2", 26: "saint" },
  },
  rod: {
    name: "ロッド", cls: "くろまどうし", spr: "rod", row: "back",
    base:   { hp: 27, mp: 22, str: 5, agi: 7, vit: 5, int: 13 },
    growth: { hp: 6, mp: 6, str: 1, agi: 1, vit: 1, int: 3 },
    weapon: "w_staff", armor: "a_cloth",
    spells: ["fire1"],
    learn: { 4: "ice1", 6: "bolt1", 9: "fire2", 12: "ice2", 15: "fire3", 19: "ice3", 21: "drain", 24: "bolt3", 28: "quake", 32: "flare" },
  },
};

// パラディンへのクラスチェンジで置きかわる内容
DATA.paladin = {
  cls: "パラディン", spr: "pal",
  special: "holy",   // せいけん
  command: "cover",  // かばう: みがわり時は ダメージ1けた + 50%カウンター
  bonus: { hp: 30, mp: 12, str: 4, vit: 3 },
};

// レベルl から l+1 に あがるのに ひつような けいけんち
DATA.expNext = (l) => 6 * l * l + 4 * l;

// ---------------- モンスター ----------------
// weak: 弱点(8ばい) / resist: たいせい(0.5ばい) / absorb: きゅうしゅう(かいふく)
// race: しゅぞく(とっこうぶきは 8ばい) / inflict: ぶつりこうげきの ついかこうか
DATA.monsters = {
  goblin:   { name: "ゴブリン",     spr: "goblin",   hp: 16, atk: 7,  def: 2,  agi: 4, exp: 5,  gold: 6 },
  bat:      { name: "おおコウモリ", spr: "bat",      hp: 12, atk: 6,  def: 1,  agi: 9, exp: 4,  gold: 4,
    weak: ["thunder"], inflict: { status: "blind", rate: 0.25 } },
  toad:     { name: "どくガエル",   spr: "toad",     hp: 22, atk: 8,  def: 2,  agi: 5, exp: 7,  gold: 8,
    weak: ["ice"], inflict: { status: "poison", rate: 0.3 },
    acts: [{ spell: "e_toad", rate: 0.2 }] },
  skeleton: { name: "スケルトン",   spr: "skeleton", hp: 34, atk: 13, def: 4,  agi: 6, exp: 14, gold: 14,
    race: "undead", weak: ["fire", "holy"] },
  wizard:   { name: "まどうし",     spr: "wizard",   hp: 28, atk: 8,  def: 3,  agi: 7, exp: 18, gold: 22,
    resist: ["fire"], acts: [{ spell: "e_fire", rate: 0.35 }, { spell: "e_silence", rate: 0.25 }] },
  gargoyle: { name: "ガーゴイル",   spr: "gargoyle", hp: 46, atk: 16, def: 6,  agi: 9, exp: 26, gold: 28,
    weak: ["thunder"] },
  golem:    { name: "ゴーレム",     spr: "golem",    hp: 85, atk: 21, def: 13, agi: 3, exp: 55, gold: 60,
    weak: ["thunder"] },
  ddemon:   { name: "ダークデーモン", spr: "demon",  hp: 66, atk: 22, def: 8,  agi: 10, exp: 62, gold: 55,
    race: "demon", weak: ["holy"], acts: [{ spell: "e_fire2", rate: 0.3 }] },

  // ---- こおりのどうくつ ----
  icegoblin: { name: "アイスゴブリン", spr: "goblin", pal: "light", hp: 30, atk: 14, def: 4, agi: 7, exp: 22, gold: 20,
    weak: ["fire"] },
  icebat:    { name: "ブリザドバット", spr: "bat", pal: "light", hp: 24, atk: 13, def: 2, agi: 12, exp: 18, gold: 15,
    weak: ["fire"], inflict: { status: "blind", rate: 0.25 } },
  frostwiz:  { name: "こおりのまどうし", spr: "wizard", pal: "light", hp: 40, atk: 12, def: 5, agi: 9, exp: 34, gold: 40,
    weak: ["fire"], resist: ["ice"], acts: [{ spell: "e_ice", rate: 0.4 }, { spell: "e_silence", rate: 0.2 }] },
  frostgar:  { name: "フロストガーゴイル", spr: "gargoyle", pal: "light", hp: 70, atk: 24, def: 9, agi: 11, exp: 55, gold: 50,
    weak: ["fire"] },
  babydragon:{ name: "ベビードラゴン", spr: "dragon", hp: 90, atk: 26, def: 10, agi: 8, exp: 85, gold: 80,
    race: "dragon", resist: ["ice"], acts: [{ spell: "e_ice", rate: 0.25 }] },
  frostdragon: { name: "フロストドラゴン", spr: "dragon", pal: "light", boss: true, scale: 3,
    hp: 700, atk: 28, def: 12, agi: 10, exp: 300, gold: 500,
    race: "dragon", absorb: ["ice"],
    acts: [{ spell: "e_breath", rate: 0.3 }, { spell: "e_ice", rate: 0.2 }] },

  // ---- ちかすいろ ----
  mudtoad:  { name: "マッドトード", spr: "toad", pal: "dark", hp: 45, atk: 20, def: 6, agi: 7, exp: 40, gold: 35,
    weak: ["ice"], inflict: { status: "poison", rate: 0.3 }, acts: [{ spell: "e_toad", rate: 0.2 }] },
  sewerbat: { name: "げすいコウモリ", spr: "bat", pal: "dark", hp: 30, atk: 18, def: 4, agi: 14, exp: 30, gold: 25,
    weak: ["thunder"], inflict: { status: "blind", rate: 0.3 } },
  waterelem:{ name: "ウォーターエレメント", spr: "wizard", pal: "dark", hp: 55, atk: 16, def: 7, agi: 10, exp: 60, gold: 60,
    weak: ["thunder"], absorb: ["ice"], acts: [{ spell: "e_ice", rate: 0.4 }] },
  sludge:   { name: "ヘドロゴーレム", spr: "golem", pal: "dark", hp: 110, atk: 28, def: 15, agi: 4, exp: 95, gold: 90,
    weak: ["fire"], inflict: { status: "poison", rate: 0.4 } },
  kraken:   { name: "クラーケン", spr: "kraken", boss: true, scale: 3,
    hp: 900, atk: 30, def: 12, agi: 11, exp: 450, gold: 800,
    resist: ["fire", "ice"],
    acts: [{ spell: "e_wave", rate: 0.3 }, { spell: "e_ink", rate: 0.25 }] },

  // ---- おおあなのそこ (ちていへの いりぐち) ----
  flamegoblin: { name: "フレイムゴブリン", spr: "goblin", pal: "dark", hp: 55, atk: 26, def: 8, agi: 9, exp: 70, gold: 60,
    weak: ["ice"] },
  flamewiz: { name: "ほのおのまじゅつし", spr: "wizard", hp: 70, atk: 20, def: 8, agi: 11, exp: 90, gold: 95,
    weak: ["ice"], absorb: ["fire"], acts: [{ spell: "e_fire2", rate: 0.35 }] },
  magmagolem: { name: "マグマゴーレム", spr: "golem", pal: "dark", hp: 160, atk: 34, def: 18, agi: 5, exp: 160, gold: 150,
    weak: ["ice"], absorb: ["fire"] },
  flamedemon: { name: "フレイムデーモン", spr: "demon", hp: 110, atk: 32, def: 12, agi: 13, exp: 150, gold: 130,
    race: "demon", weak: ["ice"], acts: [{ spell: "e_fire2", rate: 0.3 }] },
  firelizard: { name: "ファイアリザード", spr: "dragon", pal: "dark", hp: 120, atk: 30, def: 12, agi: 9, exp: 140, gold: 120,
    race: "dragon", weak: ["ice"], acts: [{ spell: "e_fire", rate: 0.3 }] },
  darkknight: { name: "あんこくへい", spr: "hero_d", pal: "dark", hp: 130, atk: 36, def: 16, agi: 12, exp: 180, gold: 160,
    weak: ["holy"] },
  darksoldier: { name: "やみのへいし", spr: "soldier", pal: "dark", hp: 100, atk: 32, def: 14, agi: 14, exp: 150, gold: 140,
    weak: ["holy"] },
  // ---- まよいのもり ----
  woodgoblin: { name: "もりゴブリン", spr: "goblin", hp: 40, atk: 18, def: 5, agi: 8, exp: 30, gold: 28,
    weak: ["fire"] },
  vampbat: { name: "バンパイアバット", spr: "bat", pal: "dark", hp: 35, atk: 16, def: 3, agi: 13, exp: 26, gold: 22,
    weak: ["fire"], inflict: { status: "blind", rate: 0.25 } },
  madflower: { name: "マッドフラワー", spr: "toad", pal: "light", hp: 50, atk: 20, def: 6, agi: 6, exp: 38, gold: 34,
    weak: ["fire"], inflict: { status: "poison", rate: 0.35 }, acts: [{ spell: "e_toad", rate: 0.15 }] },
  treant: { name: "もりのぬし トレント", spr: "treant", boss: true, scale: 4,
    hp: 2600, atk: 36, def: 14, agi: 8, exp: 1000, gold: 1200,
    weak: ["fire"], resist: ["ice", "thunder"],
    acts: [{ spell: "e_gale", rate: 0.3 }, { spell: "e_toad", rate: 0.2 }] },

  // ---- ミスリルけい (レアな かせぎてき。かたくて すぐにげる) ----
  mithrilbaby: { name: "ミスリルベビー", spr: "dragon", pal: "light",
    hp: 6, atk: 10, def: 250, agi: 30, exp: 2500, gold: 500,
    race: "dragon", absorb: ["fire", "ice", "thunder"], flees: 0.35 },
  mithrildragon: { name: "ミスリルドラゴン", spr: "dragon", pal: "light",
    hp: 12, atk: 20, def: 400, agi: 40, exp: 8000, gold: 2000,
    race: "dragon", absorb: ["fire", "ice", "thunder"], flees: 0.35 },

  // ---- かくしボス ----
  vaha: { name: "しんえんりゅう ヴァハ", spr: "dragon", pal: "dark", boss: true, scale: 4,
    hp: 9000, atk: 60, def: 26, agi: 20, exp: 5000, gold: 10000,
    race: "dragon", absorb: ["fire", "ice", "thunder"],
    acts: [{ spell: "e_starfall", rate: 0.25 }, { spell: "e_bigwave", rate: 0.2 }, { spell: "e_eruption", rate: 0.2 }] },

  // ---- ほしのとう (さいしゅうしょう) ----
  arcdemon: { name: "アークデーモン", spr: "demon", pal: "dark", hp: 260, atk: 48, def: 18, agi: 18, exp: 450, gold: 400,
    race: "demon", weak: ["holy"], acts: [{ spell: "e_fire2", rate: 0.3 }] },
  chaosknight: { name: "カオスナイト", spr: "hero_d", pal: "dark", hp: 280, atk: 52, def: 22, agi: 16, exp: 480, gold: 430,
    race: "undead", weak: ["fire", "holy"] },
  nebulabird: { name: "ネビュラバード", spr: "bird", pal: "dark", hp: 240, atk: 46, def: 16, agi: 22, exp: 440, gold: 380,
    weak: ["thunder"], acts: [{ spell: "e_gale", rate: 0.3 }] },
  voidgolem: { name: "ヴォイドゴーレム", spr: "golem", pal: "dark", hp: 320, atk: 50, def: 28, agi: 8, exp: 520, gold: 480,
    weak: ["thunder"], absorb: ["fire", "ice"] },
  // ゼリー / ひとつめ / かまきりがた の バリエーション
  greenslime: { name: "グリーンゼリー", spr: "slime", hp: 26, atk: 9, def: 6, agi: 5, exp: 8, gold: 10,
    weak: ["fire"] },
  bladehopper: { name: "カマとび",     spr: "mantis", hp: 60, atk: 16, def: 8, agi: 14, exp: 30, gold: 25 },
  dunestalker: { name: "すなかまきり", spr: "mantis", pal: "dark", hp: 90, atk: 22, def: 10, agi: 16, exp: 60, gold: 50 },
  gazer: { name: "ゲイザー", spr: "eye", hp: 150, atk: 30, def: 14, agi: 12, exp: 130, gold: 120,
    inflict: { status: "blind", rate: 0.3 } },
  iceslime: { name: "アイスゼリー", spr: "slime", pal: "light", hp: 120, atk: 24, def: 12, agi: 8, exp: 95, gold: 80,
    absorb: ["ice"], weak: ["fire"] },
  frostmantis: { name: "フロストカマ", spr: "mantis", pal: "light", hp: 140, atk: 28, def: 12, agi: 18, exp: 120, gold: 100,
    weak: ["fire"] },
  flamejelly: { name: "フレイムゼリー", spr: "slime", pal: "dark", hp: 180, atk: 34, def: 14, agi: 10, exp: 170, gold: 150,
    absorb: ["fire"], weak: ["ice"] },
  marinejelly: { name: "マリンゼリー", spr: "slime", pal: "light", hp: 220, atk: 40, def: 16, agi: 12, exp: 260, gold: 220,
    absorb: ["ice"], weak: ["thunder"] },
  abyssgazer: { name: "アビスゲイザー", spr: "eye", pal: "dark", hp: 240, atk: 42, def: 18, agi: 14, exp: 300, gold: 260,
    weak: ["holy"], inflict: { status: "silence", rate: 0.25 } },
  voideye: { name: "ヴォイドアイ", spr: "eye", pal: "dark", hp: 300, atk: 50, def: 20, agi: 20, exp: 500, gold: 420,
    weak: ["holy"], inflict: { status: "blind", rate: 0.3 } },
  kingslime: { name: "キングゼリー", spr: "slime", scale: 3, hp: 900, atk: 40, def: 30, agi: 8, exp: 1500, gold: 1200,
    weak: ["fire"] },
  starjelly: { name: "スターゼリー", spr: "slime", pal: "light", hp: 400, atk: 56, def: 26, agi: 14, exp: 780, gold: 560,
    absorb: ["thunder"], weak: ["fire"] },
  crystalmantis: { name: "すいしょうカマ", spr: "mantis", pal: "light", hp: 520, atk: 64, def: 30, agi: 24, exp: 1000, gold: 800,
    weak: ["fire"] },
  stareater: { name: "スターイーター", spr: "eye", pal: "light", hp: 640, atk: 70, def: 28, agi: 22, exp: 1600, gold: 1300,
    weak: ["holy"], inflict: { status: "toad", rate: 0.15 } },
  // げんじゅう (そら/ちてい/うみに ひそむ せいれいがたの レアボス)
  sylphid: { name: "かぜのげんじゅう シルフィド", spr: "bird", pal: "light", boss: true, scale: 3,
    hp: 3000, atk: 68, def: 26, agi: 34, exp: 8000, gold: 4000,
    resist: ["thunder"], weak: ["ice"],
    acts: [{ spell: "e_tornado", rate: 0.25 }, { spell: "e_gale", rate: 0.3 }] },
  gnomos: { name: "つちのげんじゅう ノーモス", spr: "golem", boss: true, scale: 3,
    hp: 3600, atk: 76, def: 44, agi: 10, exp: 9000, gold: 4500,
    resist: ["fire"], weak: ["thunder"],
    acts: [{ spell: "e_quake", rate: 0.3 }] },
  undina: { name: "みずのげんじゅう ウンディナ", spr: "kraken", pal: "light", boss: true, scale: 3,
    hp: 3300, atk: 72, def: 30, agi: 22, exp: 8500, gold: 4200,
    absorb: ["ice"], weak: ["thunder"],
    acts: [{ spell: "e_bigwave", rate: 0.25 }, { spell: "e_wave", rate: 0.3 }] },
  // しれんのやまの ぬし (かくとうかの ライバル)
  garon: { name: "けんおう ガロン", spr: "gou", pal: "dark", boss: true, scale: 2,
    hp: 1400, atk: 46, def: 20, agi: 22, exp: 3000, gold: 0,
    resist: ["fire", "ice", "thunder"] },
  // ほしのせかい (Lv30〜のレベリングエリア)
  starimp: { name: "スターインプ", spr: "goblin", pal: "light", hp: 380, atk: 58, def: 24, agi: 20, exp: 700, gold: 520,
    race: "demon", weak: ["fire"] },
  lunabat: { name: "ルナバット", spr: "bat", pal: "light", hp: 340, atk: 54, def: 18, agi: 26, exp: 650, gold: 450,
    weak: ["thunder"], inflict: { status: "blind", rate: 0.2 } },
  cometwisp: { name: "コメットウィスプ", spr: "wizard", pal: "light", hp: 420, atk: 50, def: 22, agi: 24, exp: 820, gold: 600,
    weak: ["ice"], acts: [{ spell: "e_bolt2", rate: 0.3 }] },
  stargolem: { name: "スターゴーレム", spr: "golem", pal: "light", hp: 620, atk: 66, def: 40, agi: 6, exp: 1150, gold: 900,
    weak: ["ice"], absorb: ["thunder"] },
  moondragon: { name: "ムーンドラゴン", spr: "dragon", pal: "light", hp: 750, atk: 72, def: 30, agi: 18, exp: 1400, gold: 1100,
    race: "dragon", weak: ["holy"], acts: [{ spell: "e_breath", rate: 0.25 }] },
  lunavora: { name: "クレーターのぬし ルナヴォラ", spr: "worm", pal: "light", boss: true, scale: 3,
    hp: 4200, atk: 82, def: 34, agi: 20, exp: 25000, gold: 8000,
    weak: ["holy"], resist: ["fire", "ice"],
    acts: [{ spell: "e_quake", rate: 0.25 }, { spell: "e_starfall", rate: 0.2 }] },
  voidos: { name: "ほしくらい ヴォイドス", spr: "voidos", boss: true, scale: 4,
    hp: 3200, atk: 48, def: 20, agi: 16, exp: 0, gold: 0,
    absorb: ["fire", "ice", "thunder"],
    acts: [{ spell: "e_starfall", rate: 0.25 }, { spell: "e_bigwave", rate: 0.2 }], phase2: "voidos2" },
  voidos2: { name: "ヴォイドス しんのすがた", spr: "voidos", pal: "dark", boss: true, scale: 4,
    hp: 2600, atk: 54, def: 22, agi: 20, exp: 0, gold: 0,
    race: "demon", weak: ["holy"], absorb: ["fire", "ice", "thunder"],
    acts: [{ spell: "e_starfall", rate: 0.3 }, { spell: "e_tornado", rate: 0.2 }] },

  // ---- うみのそこ / かいていしんでん ----
  octopus: { name: "オクトパス", spr: "kraken", pal: "light", hp: 180, atk: 40, def: 14, agi: 15, exp: 340, gold: 300,
    weak: ["thunder"], acts: [{ spell: "e_ink", rate: 0.3 }] },
  deepworm: { name: "ディープワーム", spr: "worm", pal: "dark", hp: 220, atk: 44, def: 18, agi: 8, exp: 360, gold: 320,
    weak: ["thunder"] },
  merman: { name: "マーマンナイト", spr: "soldier", pal: "light", hp: 190, atk: 44, def: 18, agi: 16, exp: 350, gold: 330,
    weak: ["thunder"] },
  abyssdemon: { name: "アビスデーモン", spr: "demon", pal: "dark", hp: 200, atk: 42, def: 16, agi: 17, exp: 380, gold: 350,
    race: "demon", weak: ["holy"], acts: [{ spell: "e_ice", rate: 0.3 }] },
  levia: { name: "しんかいのぬし リヴァイア", spr: "kraken", pal: "dark", boss: true, scale: 4,
    hp: 2800, atk: 44, def: 20, agi: 15, exp: 2400, gold: 3000,
    absorb: ["ice"], resist: ["fire"],
    acts: [{ spell: "e_bigwave", rate: 0.3 }, { spell: "e_ink", rate: 0.25 }] },

  // ---- そらのしま / かぜのしんでん ----
  stormbird: { name: "ストームバード", spr: "bird", hp: 150, atk: 40, def: 14, agi: 18, exp: 280, gold: 250,
    weak: ["thunder"] },
  harpy: { name: "スカイハーピー", spr: "bird", pal: "light", hp: 130, atk: 36, def: 12, agi: 20, exp: 260, gold: 240,
    weak: ["thunder"], acts: [{ spell: "e_silence", rate: 0.3 }] },
  skydragon: { name: "スカイドラゴン", spr: "dragon", pal: "light", hp: 200, atk: 42, def: 16, agi: 14, exp: 320, gold: 300,
    race: "dragon", acts: [{ spell: "e_bolt", rate: 0.3 }] },
  winddemon: { name: "ウィンドデーモン", spr: "demon", hp: 170, atk: 40, def: 15, agi: 17, exp: 300, gold: 280,
    race: "demon", weak: ["holy"], acts: [{ spell: "e_gale", rate: 0.35 }] },
  tempest: { name: "あらしのおう テンペスト", spr: "bird", boss: true, scale: 4,
    hp: 2400, atk: 42, def: 18, agi: 16, exp: 1800, gold: 2200,
    absorb: ["thunder"], resist: ["ice"],
    acts: [{ spell: "e_tornado", rate: 0.3 }, { spell: "e_bolt2", rate: 0.25 }] },

  // ---- ちていしんでん ----
  darkpriest: { name: "ダークプリースト", spr: "wizard", pal: "light", hp: 90, atk: 24, def: 10, agi: 12, exp: 200, gold: 180,
    weak: ["holy"], acts: [{ spell: "e_bolt", rate: 0.35 }, { spell: "e_silence", rate: 0.2 }] },
  guardian: { name: "ガーディアン", spr: "golem", pal: "light", hp: 180, atk: 36, def: 20, agi: 6, exp: 240, gold: 220,
    weak: ["thunder"] },
  deathknight: { name: "デスナイト", spr: "hero_d", pal: "dark", hp: 160, atk: 40, def: 18, agi: 13, exp: 260, gold: 240,
    race: "undead", weak: ["fire", "holy"] },
  shadowbeast: { name: "シャドウビースト", spr: "gargoyle", pal: "dark", hp: 140, atk: 38, def: 14, agi: 16, exp: 230, gold: 200,
    weak: ["holy"] },
  meteogolem: { name: "いんせきのばんにん", spr: "golem", pal: "light", boss: true, scale: 3,
    hp: 1500, atk: 38, def: 20, agi: 6, exp: 900, gold: 1200,
    resist: ["fire", "ice"],
    acts: [{ spell: "e_quake", rate: 0.3 }] },
  glad: { name: "ちていのまじん グラード", spr: "demon", pal: "light", boss: true, scale: 4,
    hp: 2000, atk: 38, def: 16, agi: 12, exp: 1200, gold: 1500,
    race: "demon", resist: ["fire"],
    acts: [{ spell: "e_quake", rate: 0.25 }, { spell: "e_silence", rate: 0.2 }, { spell: "e_fire2", rate: 0.2 }] },
  magmaworm: { name: "マグマウォーム", spr: "worm", boss: true, scale: 4,
    hp: 1300, atk: 34, def: 14, agi: 10, exp: 700, gold: 1000,
    absorb: ["fire"],
    acts: [{ spell: "e_eruption", rate: 0.3 }, { spell: "e_fire2", rate: 0.2 }] },

  // ボスは 8ばい弱点で とけないよう たいせい/きゅうしゅう ちゅうしん。
  // れいがい: ザルバ しんのすがた だけ せい属性が じゃくてん (せいけんが きめて)
  demonguard: { name: "デーモンガード", spr: "demon", boss: true, scale: 3,
    hp: 260, atk: 15, def: 5, agi: 6, exp: 90, gold: 150,
    race: "demon", absorb: ["ice"],
    acts: [{ spell: "e_ice_all", rate: 0.35 }] },
  shadow: { name: "あんこくのかげ", spr: "hero_d", pal: "dark", boss: true, scale: 3, trial: true,
    hp: 999, atk: 17, def: 99, agi: 7, exp: 0, gold: 0 },
  zarba: { name: "まおうザルバ", spr: "zarba", boss: true, scale: 3,
    hp: 600, atk: 24, def: 8, agi: 9, exp: 0, gold: 0,
    race: "demon", resist: ["fire", "ice"],
    acts: [{ spell: "e_fire2", rate: 0.3 }], phase2: "zarba2" },
  zarba2: { name: "ザルバ しんのすがた", spr: "zarba", pal: "dark", boss: true, scale: 4,
    hp: 1600, atk: 30, def: 10, agi: 12, exp: 0, gold: 0,
    race: "demon", weak: ["holy"], absorb: ["fire"],
    acts: [{ spell: "e_meteo", rate: 0.3 }, { spell: "e_ice_all", rate: 0.2 }] },
};

// ---------------- エンカウントテーブル ----------------
DATA.encounters = {
  plains_w: { rate: 1 / 15, groups: [["goblin"], ["goblin", "goblin"], ["bat", "bat"], ["toad", "goblin"], ["greenslime", "greenslime"], ["greenslime", "goblin"]] },
  plains_e: { rate: 1 / 14, groups: [["goblin", "goblin", "bat"], ["toad", "toad"], ["skeleton"], ["wizard", "bat"], ["bladehopper"], ["bladehopper", "goblin"]],
    rare: ["mithrilbaby"], rareRate: 0.06 },
  north:    { rate: 1 / 13, groups: [["skeleton", "skeleton"], ["wizard", "wizard"], ["gargoyle"], ["skeleton", "wizard"], ["dunestalker", "dunestalker"]] },
  cave:     { rate: 1 / 13, groups: [["bat", "bat"], ["skeleton"], ["toad", "toad", "bat"], ["skeleton", "bat", "bat"], ["greenslime", "bat"]] },
  shrine:   { rate: 1 / 13, groups: [["skeleton", "skeleton"], ["gargoyle", "wizard"], ["gargoyle", "gargoyle"], ["dunestalker", "skeleton"]] },
  tower:    { rate: 1 / 12, groups: [["ddemon"], ["golem"], ["gargoyle", "gargoyle", "wizard"], ["ddemon", "wizard"], ["gazer"], ["gazer", "gargoyle"]] },
  icecave:  { rate: 1 / 13, groups: [["icegoblin", "icegoblin"], ["icebat", "icebat", "icegoblin"], ["frostwiz", "icebat"], ["frostgar"], ["babydragon"], ["frostwiz", "frostwiz"], ["iceslime", "iceslime"], ["frostmantis"]] },
  waterway: { rate: 1 / 13, groups: [["mudtoad", "mudtoad"], ["sewerbat", "sewerbat", "sewerbat"], ["waterelem", "sewerbat"], ["sludge"], ["waterelem", "waterelem"], ["sludge", "mudtoad"], ["greenslime", "greenslime", "greenslime"]] },
  magma:    { rate: 1 / 13, groups: [["flamegoblin", "flamegoblin"], ["firelizard"], ["flamewiz", "flamegoblin"], ["magmagolem"], ["flamedemon"], ["firelizard", "flamewiz"], ["flamejelly", "flamejelly"]] },
  underworld: { rate: 1 / 14, groups: [["darkknight"], ["darksoldier", "darksoldier"], ["flamedemon", "darksoldier"], ["firelizard", "firelizard"], ["magmagolem", "flamewiz"], ["darkknight", "darksoldier"]],
    rare: ["mithrilbaby", "mithrilbaby"], rareRate: 0.06 },
  temple:   { rate: 1 / 13, groups: [["darkpriest", "darkpriest"], ["guardian"], ["deathknight"], ["shadowbeast", "darkpriest"], ["deathknight", "shadowbeast"], ["guardian", "darkpriest"], ["abyssgazer"]] },
  sky:      { rate: 1 / 14, groups: [["stormbird"], ["harpy", "harpy"], ["stormbird", "harpy"], ["skydragon"], ["winddemon"], ["winddemon", "harpy"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  sea:      { rate: 1 / 14, groups: [["octopus"], ["merman", "merman"], ["deepworm"], ["abyssdemon", "merman"], ["octopus", "merman"], ["abyssdemon"], ["marinejelly", "merman"]] },
  lostwoods: { rate: 1 / 12, groups: [["woodgoblin", "woodgoblin"], ["vampbat", "vampbat"], ["madflower"], ["woodgoblin", "vampbat"], ["madflower", "woodgoblin"], ["bladehopper", "bladehopper"]],
    rare: ["kingslime"], rareRate: 0.07 },
  startower: { rate: 1 / 14, groups: [["arcdemon"], ["chaosknight"], ["nebulabird", "nebulabird"], ["voidgolem"], ["arcdemon", "nebulabird"], ["chaosknight", "arcdemon"], ["voideye", "voideye"]],
    rare: ["mithrildragon"], rareRate: 0.06 },
  trialmt: { rate: 1 / 13, groups: [["gargoyle", "gargoyle"], ["dunestalker", "dunestalker"], ["gazer"], ["golem"], ["gazer", "dunestalker"], ["golem", "gargoyle"]] },
  starworld: { rate: 1 / 14, groups: [["starimp", "starimp"], ["lunabat", "lunabat"], ["cometwisp"], ["starimp", "lunabat"], ["stargolem"], ["cometwisp", "lunabat"], ["starjelly", "starjelly"]],
    rare: ["mithrildragon"], rareRate: 0.07 },
  crater: { rate: 1 / 12, groups: [["stargolem", "starimp"], ["moondragon"], ["cometwisp", "cometwisp"], ["stargolem", "stargolem"], ["moondragon", "lunabat"], ["starimp", "starimp", "lunabat"], ["crystalmantis"], ["stareater"]],
    rare: ["mithrildragon", "mithrilbaby"], rareRate: 0.07 },
};

// ---------------- ショップ ----------------
DATA.shops = {
  selene: {
    name: "つきのみやこの みせ",
    stock: ["xpotion", "megapotion", "elixir", "hiether", "phoenix", "remedy",
            "w_comet", "w_starlance", "w_cosmoclaw", "w_nebularod", "w_moonwand",
            "a_comet", "a_moonrobe", "a_stargi"],
  },
  royal: {
    name: "おうきゅうごようたし",
    stock: ["megapotion", "elixir", "ether", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "a_royalmail", "a_royal"],
  },
  muspel: {
    name: "ムスペルのかじば",
    stock: ["hipotion", "megapotion", "ether", "elixir", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "w_iceblade", "w_halberd", "w_battleclaw", "w_sagestaff", "w_spiritrod",
            "a_dwarf", "a_sage", "a_master"],
  },
  port: {
    name: "ソレイユのみせ",
    stock: ["potion", "hipotion", "megapotion", "ether", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "w_flame", "w_lance", "w_thunderclaw", "w_crystalrod",
            "a_aqua", "a_ice", "a_gi"],
  },
  town: {
    name: "ミストのみせ",
    stock: ["potion", "hipotion", "ether", "antidote", "eyedrops", "echoherb", "kiss", "phoenix",
            "w_steel", "w_mythril", "w_lance", "w_ironclaw", "w_wizstaff", "w_mace",
            "a_steel", "a_leather", "a_silk"],
  },
};

// ============================================================
// マップ
// ============================================================
// legend: 1文字 -> { tile: 描画タイル, solid: 通行不可 }
// npcs / events / chests は それぞれ座標で配置

DATA.maps = {};

// ---------------- ワールドマップ ----------------
DATA.maps.world = {
  name: "フィールド",
  outdoor: true,
  bgm: "field",
  legend: {
    "w": { tile: "water", solid: true },
    ".": { tile: "grass" },
    "f": { tile: "forest" },
    "m": { tile: "mountain", solid: true },
    "b": { tile: "bridge" },
    "C": { tile: "icon_castle" },
    "T": { tile: "icon_town" },
    "P": { tile: "icon_town" },
    "c": { tile: "icon_cave" },
    "I": { tile: "icon_cave" },
    "U": { tile: "icon_cave" },
    "H": { tile: "icon_cave" },
    "F": { tile: "icon_shrine" },
    "M": { tile: "icon_shrine" },
    "X": { tile: "icon_tower" },
    "A": { tile: "icon_cave" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwmmmmmmmmmmmmmmwwwwwwwwwwwwwwwwwwwwwwww",
    "wwm...........mwwwwwwwwwww.....wwwwwwwww",
    "wwm.....M.....mwwwwwwwwwww..X..wwwwwwwww",
    "wwmmmmmm.mmmmmmwwwwwwwwwww.....wwwwwwwww",
    "wwffffff.ffffffmmmmffffffwwwwbwwwwwwwwww",
    "wwffffff.ffffffmmmmffIfffwwwwbwwwwwwwwww",
    "wwffffff.ffffffmmmmffffffwwwwbwwwwwwwwww",
    "ww..............mmmm..........wwwwwwwwww",
    "ww.....f........Ammm....ff........wwwwww",
    "ww....fff.......mmmm...ffff.......wwwwww",
    "ww.....f........mmmm....ff........wwwwww",
    "ww..............mmmm..............wwwwww",
    "ww..f...........mmmm..............wwwwww",
    "ww.ff...........mmmm......ff......wwwwww",
    "ww..............mmmm.....ffff.P...wwwwww",
    "ww..............mmmm......ff......wwwwww",
    "ww..............mmmm..............wwwwww",
    "ww..............mmmm..............wwwwww",
    "ww..............cmmc..............wwwwww",
    "ww..............mmmm..............wwwwww",
    "ww..............mmmm.......T......wwwwww",
    "ww...f..........mmmm..............wwwwww",
    "ww..fFf.........mmmm..f...........wwwwww",
    "ww...f..........mmmm.ff...........wwwwww",
    "ww.....C........mmmm..f...........wwwwww",
    "ww..............mmmm..............wwwwww",
    "ww..............mmmm......f..H....wwwwww",
    "ww...ff.........mmmm.....ff.......wwwwww",
    "ww....f..U......mmmm..............wwwwww",
    "ww..............mmmm..............wwwwww",
    "www.............mmmm............wwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  zones: [
    { x: 2, y: 6, w: 14, h: 3, table: "north" },
    { x: 19, y: 6, w: 7, h: 3, table: "north" },
    { x: 2, y: 9, w: 14, h: 24, table: "plains_w" },
    { x: 20, y: 9, w: 14, h: 24, table: "plains_e" },
  ],
  events: [
    { x: 7, y: 26, type: "enter", warp: { map: "castle", x: 9, y: 10, dir: "u" } },
    { x: 27, y: 22, type: "enter", warp: { map: "town", x: 9, y: 14, dir: "u" } },
    { x: 16, y: 20, type: "enter", warp: { map: "cave", x: 1, y: 10, dir: "r" } },
    { x: 19, y: 20, type: "enter", warp: { map: "cave", x: 22, y: 10, dir: "l" } },
    { x: 16, y: 10, type: "enter", warp: { map: "trialmt1", x: 7, y: 10, dir: "u" } },
    { x: 8, y: 4, type: "enter",
      cond: { flag: "crystal" },
      failScript: [{ msg: "ほこらのとびらは かたく とざされている。\n(せいなる クリスタルが ひつようだ)" }],
      warp: { map: "shrine", x: 7, y: 14, dir: "u" } },
    { x: 28, y: 4, type: "enter",
      cond: { flag: "paladin" },
      failScript: [{ msg: "とうは くろい けっかいに\nつつまれている……!" }],
      warp: { map: "tower1", x: 6, y: 10, dir: "u" } },
    { x: 21, y: 7, type: "enter", warp: { map: "icecave", x: 1, y: 12, dir: "u" } },
    { x: 9, y: 30, type: "enter", warp: { map: "waterway", x: 1, y: 8, dir: "u" } },
    { x: 30, y: 16, type: "enter", warp: { map: "port", x: 10, y: 1, dir: "d" } },
    { x: 29, y: 28, type: "enter",
      cond: { flag: "paladin" },
      failScript: [{ msg: "じめんに おおきな あなが あいている。\nそこから ねっぷうが ふきあげてくる…\n(いまは おりるべきでは なさそうだ)" }],
      warp: { map: "magma", x: 1, y: 1, dir: "d" } },
    { x: 5, y: 24, type: "enter", warp: { map: "lostwoods", x: 5, y: 8, dir: "u" } },
  ],
  npcs: [],
  chests: [],
};

// ---------------- バロンじょう ----------------
DATA.maps.castle = {
  name: "バロンじょう",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "c": { tile: "carpet" },
    "P": { tile: "pillar", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "####################",
    "#........cc........#",
    "#..P.....cc.....P..#",
    "#........cc........#",
    "#........cc........#",
    "#..P.....cc.....P..#",
    "#........cc........#",
    "#........cc........#",
    "#..P.....cc.....P..#",
    "#........cc........#",
    "#........cc........#",
    "#########dd#########",
  ],
  events: [
    { x: 9, y: 11, type: "enter", warp: { map: "world", x: 7, y: 27, dir: "d" } },
    { x: 10, y: 11, type: "enter", warp: { map: "world", x: 7, y: 27, dir: "d" } },
  ],
  npcs: [
    { id: "king", x: 9, y: 1, spr: "king",
      script: [
        { cond: { flag: "clear" },
          then: [{ msg: "バロンおう「レオンよ……\nこのくには おまえたちに すくわれた。\nこころから れいを いう」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "バロンおう「……ちからが…… みなぎる……\nくくく…… こい レオン……\nまてんろうで まっているぞ……」" }],
              else: [{ msg: "バロンおう「クリスタルは まだか!\nはやく うばってくるのだ!\nこれは めいれいだ!!」" }] },
          ] },
      ] },
    { id: "guard1", x: 8, y: 9, spr: "soldier",
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "へいし「せかいの きゅうせいしゅ\nばんざーい!! おうさまも たいへん\nおよろこびです!」" }],
          else: [
            { cond: { flag: "clear" },
              then: [{ msg: "へいし「レオンさま ばんざい!\nパラディン ばんざい!」" }],
              else: [{ msg: "へいし「にしのどうくつを ぬければ\nミストのむらへ いけます」" }] },
          ] },
      ] },
    { id: "guard2", x: 11, y: 9, spr: "soldier",
      script: [
        { cond: { flag: "clear" },
          then: [{ msg: "へいし「おうさまが もとに\nもどられた! ぶかんちょうも\nうれしなきして おりました」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "へいし「おうさまの ようすが\nあきらかに おかしい……。\nきたのとうに なにかあるのでは……」" }],
              else: [{ msg: "へいし「さいきん おうさまは\nひとが かわってしまわれた……」" }] },
          ] },
      ] },
    // じょうの ふっこうイベント (ザルバとうばつご)
    { id: "bukan", x: 14, y: 9, spr: "soldier", showFlag: "clear",
      script: [
        { cond: { flag: "castleReward" },
          then: [{ msg: "ぶかんちょう「じょうかまちも にぎわいを\nとりもどした。すべて きみたちの\nおかげだ」" }],
          else: [
            { cond: { flag: "castleFund" },
              then: [
                { cond: { flag: "trueClear" },
                  then: [
                    { msg: "ぶかんちょう「おうさまから きみたちへ\nほうしょうを あずかっている。\nふっこうしえんの れいも こめてだ」" },
                    { give: { gold: 10000 } },
                    { msg: "10000ギルを てにいれた!!" },
                    { flag: ["castleReward", 1] },
                  ],
                  else: [{ msg: "ぶかんちょう「しきんの おかげで\nふっこうは じゅんちょうだ。\nおうきゅうに みせも ひらいたぞ」" }] },
              ],
              else: [
                { msg: "ぶかんちょう「ザルバの いっけんで\nじょうかは あれてしまった。\nふっこうの しきんが たりんのだ…」" },
                { msg: "ぶかんちょう「2000ギル えんじょして\nもらえないだろうか?」" },
                { menu: { options: [
                  { label: "えんじょする", ops: [
                    { payGold: { amount: 2000,
                      ok: [
                        { msg: "ぶかんちょう「かたじけない!!\nこの ごおんは わすれんぞ。\nかならず じょうを たてなおす!」" },
                        { flag: ["castleFund", 1] },
                        { msg: "(おうきゅうに みせが ひらいたようだ)" },
                      ],
                      ng: [{ msg: "ぶかんちょう「むりを いってすまん。\nまた こんど たのむ」" }] } },
                  ] },
                  { label: "やめておく", ops: [
                    { msg: "ぶかんちょう「そうか……。\nきが むいたら たのむ」" },
                  ] },
                ] } },
              ] },
          ] },
      ] },
    // おうきゅうごようたし (ふっこうしえんご)
    { id: "royalshop", x: 5, y: 4, spr: "villager", showFlag: "castleFund",
      script: [
        { msg: "ごようたし「ふっこうしえんの おかたと\nおみうけします。とくべつな しなを\nごらんください」" },
        { shop: "royal" },
      ] },
    // グレンのこじんイベント (パラディンご)
    { id: "mia", x: 5, y: 10, spr: "celia", showFlag: "paladin",
      script: [
        { cond: { flag: "glenEvent" },
          then: [{ msg: "ミア「にいさんを よろしくおねがいします。\nいってらっしゃい!」" }],
          else: [
            { msg: "ミア「あっ、にいさん!!\nぶじだったのね……!」" },
            { msg: "グレン「ミア!? むらから でてきたのか。\n……しんぱいかけたな」" },
            { msg: "ミア「これ、とうさんの やり。\nにいさんが もつべきだと おもって\nもってきたの」" },
            { msg: "グレン「おやじの……。 ああ、\nたしかに うけとった。 みてろよ、\nおれは りゅうきしを つらぬく」" },
            { give: { item: "w_kizuna" } },
            { msg: "きずなのやりを てにいれた!\n(あくましゅぞくに 8ばいの ちからを はっき)" },
            { flag: ["glenEvent", 1] },
          ] },
      ] },
  ],
  chests: [
    { id: "castle1", x: 17, y: 1, gold: 500, hidden: true },
  ],
};

// ---------------- ミストのむら ----------------
DATA.maps.town = {
  name: "ミストのむら",
  bgm: "town",
  exit: { map: "world", x: 27, y: 23, dir: "d" },
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "E": { tile: "door" },
  },
  rows: [
    "ffffffffffffffffffff",
    "f..................f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f..................f",
    "f.......WWWWW......f",
    "f.......WWWWW......f",
    "f.......WWEWW......f",
    "f..................f",
    "f..................f",
    "f..................f",
    "f..................f",
    "f..................f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "inn", x: 4, y: 6, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "shop", x: 4, y: 6, dir: "u" } },
    { x: 10, y: 9, type: "enter", warp: { map: "elder", x: 5, y: 7, dir: "u" } },
  ],
  npcs: [
    { id: "vil1", x: 5, y: 11, spr: "villager", wander: true,
      script: [
        { cond: { flag: "allCrystals" },
          then: [{ msg: "むらびと「よぞらに ひかる とうが\nみえるじゃろ? あれが うわさの\nほしのとう じゃよ……」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "むらびと「おお ひかりのきしさま!\nどうか ザルバを たおしてくだされ!」" }],
              else: [{ msg: "むらびと「さいきん モンスターが\nふえたのう。おちおち はたけにも\nいけんわい」" }] },
          ] },
      ] },
    { id: "vil2", x: 14, y: 12, spr: "villager", wander: true,
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "むらびと「ほしのとうの かがやきが\nきえたのう。あんたたちの おかげじゃと\nみんな いうておるよ」" }],
          else: [
            { cond: { flag: "earthCrystal" },
              then: [{ msg: "むらびと「ちていに くにが あったとは\nおどろきじゃ。ドワーフの さけは\nうまいと きくがのう」" }],
              else: [
                { cond: { flag: "clear" },
                  then: [{ msg: "むらびと「まてんろうの くろいくもが\nはれたのう! これで はたけしごとも\nはかどるわい」" }],
                  else: [{ msg: "むらびと「きたのほこらには\n『こころのかがみ』が あるそうじゃ。\nみたものの こころを うつすとか」" }] },
              ] },
          ] },
      ] },
    { id: "kid", x: 8, y: 6, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "こども「でんせつの ゆうしゃだー!!\nぼく、おおきくなったら\nクリスタルナイツに はいるんだ!」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "こども「ひかりの きしさまだー!\nかっこいい! やりの おにいちゃんも\nこぶしの おじちゃんも すごーい!」" }],
              else: [{ msg: "こども「ぼうけんしゃだ!\nねえねえ、まものと たたかったこと\nある? こわくないの?」" }] },
          ] },
      ] },
    // セリアのこじんイベント (かぜのクリスタルご)
    { id: "sister", x: 10, y: 12, spr: "celia", showFlag: "windCrystal",
      script: [
        { cond: { flag: "celiaEvent" },
          then: [{ msg: "シスター「セリアの いのりは\nむらの ほこりです」" }],
          else: [
            { msg: "シスター「セリア! おおきくなって……。\nちいさいころ ないてばかりだった\nあなたが りっぱに なったのね」" },
            { msg: "セリア「シスター・マーレ!\nわたし、みんなを まもれるように\nなりたくて……」" },
            { msg: "シスター「その こころが あれば\nだいじょうぶ。 これは あなたの\nおかあさんの かたみの ロッドよ」" },
            { msg: "セリア「おかあさんの……。\nありがとう。 たいせつに つかうわ」" },
            { give: { item: "w_prayrod" } },
            { msg: "いのりのロッドを てにいれた!" },
            { flag: ["celiaEvent", 1] },
          ] },
      ] },
    { id: "board", x: 3, y: 7, spr: "soldier",
      script: [
        { msg: "ぼしゅうがかり「むらの まものたいじに\nほうびを だしているよ。\nどの たいじを ほうこくするんだい?」" },
        { menu: { options: [
          { label: "ガーゴイル5", ops: [
            { cond: { flag: "qGar" },
              then: [{ msg: "ぼしゅうがかり「それは もう\nほうびを わたしたよ」" }],
              else: [
                { cond: { kills: { id: "gargoyle", n: 5 } },
                  then: [
                    { msg: "ぼしゅうがかり「ガーゴイル 5たい かくにん!\nほうびを うけとりな!」" },
                    { give: { gold: 800 } },
                    { msg: "800ギルを てにいれた!" },
                    { flag: ["qGar", 1] },
                  ],
                  else: [{ msg: "ぼしゅうがかり「ガーゴイルを 5たい\nたおしてきておくれ。きたのもりや\nほこらに でるやつだ」" }] },
              ] },
          ] },
          { label: "ゴーレム5", ops: [
            { cond: { flag: "qGolem" },
              then: [{ msg: "ぼしゅうがかり「それは もう\nほうびを わたしたよ」" }],
              else: [
                { cond: { kills: { id: "golem", n: 5 } },
                  then: [
                    { msg: "ぼしゅうがかり「ゴーレム 5たい かくにん!\nたいしたもんだ!」" },
                    { give: { gold: 1500 } },
                    { msg: "1500ギルを てにいれた!" },
                    { flag: ["qGolem", 1] },
                  ],
                  else: [{ msg: "ぼしゅうがかり「ゴーレムを 5たい\nたのむよ。まてんろうの あたりに\nでる いわの きょじんだ」" }] },
              ] },
          ] },
          { label: "スカイドラゴン3", ops: [
            { cond: { flag: "qSkyD" },
              then: [{ msg: "ぼしゅうがかり「それは もう\nほうびを わたしたよ」" }],
              else: [
                { cond: { kills: { id: "skydragon", n: 3 } },
                  then: [
                    { msg: "ぼしゅうがかり「スカイドラゴン 3たい!?\nでんせつの りゅうがりだ!!」" },
                    { give: { gold: 3000 } },
                    { msg: "3000ギルを てにいれた!" },
                    { flag: ["qSkyD", 1] },
                  ],
                  else: [{ msg: "ぼしゅうがかり「そらのしまの\nスカイドラゴンを 3たい。\nむちゃは しなさんなよ」" }] },
              ] },
          ] },
          { label: "やめる", ops: [] },
        ] } },
      ] },
    { id: "hunter", x: 16, y: 11, spr: "villager",
      script: [
        { cond: { flag: "iceReward" },
          then: [{ msg: "ハンター「そういや みなみの ちかすいろで\nみずおとの おかしい ばしょが あるって\nうわさだぜ。なにか あるのかもな」" }],
          else: [
            { cond: { flag: "iceBoss" },
              then: [
                { msg: "ハンター「な なんと! ほんとうに\nりゅうを たおしちまったのか!!\nやくそくの ほうびだ、うけとりな!」" },
                { give: { gold: 1000 } },
                { msg: "1000ギルを てにいれた!" },
                { flag: ["iceReward", 1] },
              ],
              else: [
                { msg: "ハンター「きたのもりの どうくつに\nりゅうが すみついちまった。\nたおせば 1000ギル はらうぜ」" },
                { flag: ["iceQuest", 1] },
              ] },
          ] },
      ] },
  ],
  chests: [],
};

// ---------------- やどや ----------------
DATA.maps.inn = {
  name: "やどや",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "B": { tile: "bed" },
    "n": { tile: "counter", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##########",
    "#B......B#",
    "#........#",
    "#..nnnn..#",
    "#........#",
    "#........#",
    "#........#",
    "####dd####",
  ],
  events: [
    { x: 4, y: 7, type: "enter", warp: { map: "town", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 7, type: "enter", warp: { map: "town", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "innkeep", x: 4, y: 2, spr: "villager",
      script: [{ inn: 20 }] },
  ],
  chests: [],
};

// ---------------- どうぐや ----------------
DATA.maps.shop = {
  name: "みせ",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "n": { tile: "counter", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##########",
    "#........#",
    "#........#",
    "#..nnnn..#",
    "#........#",
    "#........#",
    "#........#",
    "####dd####",
  ],
  events: [
    { x: 4, y: 7, type: "enter", warp: { map: "town", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 7, type: "enter", warp: { map: "town", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "shopkeep", x: 4, y: 2, spr: "villager",
      script: [{ shop: "town" }] },
  ],
  chests: [],
};

// ---------------- ちょうろうのいえ ----------------
DATA.maps.elder = {
  name: "ちょうろうのいえ",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "############",
    "#..........#",
    "#.t......t.#",
    "#..........#",
    "#..........#",
    "#..........#",
    "#..........#",
    "#..........#",
    "#####dd#####",
  ],
  events: [
    { x: 5, y: 8, type: "enter", warp: { map: "town", x: 10, y: 10, dir: "d" } },
    { x: 6, y: 8, type: "enter", warp: { map: "town", x: 10, y: 10, dir: "d" } },
  ],
  npcs: [
    { id: "elderman", x: 5, y: 2, spr: "elder",
      script: [
        { cond: { flag: "worldtearGiven" },
          then: [{ msg: "ちょうろう「せかいのしずくは\nつかったかの? おぬしらの たびに\nかごが あらんことを」" }],
          else: [
            { cond: { flag: "allCrystals" },
              then: [
                { msg: "ちょうろう「おお…… 4つのクリスタルの\nひかりを かんじる。よくぞ ここまで」" },
                { give: { item: "worldtear" } },
                { flag: ["worldtearGiven", 1] },
                { msg: "せかいのしずくを さずかった!\n(なかまぜんいんが かんぜんかいふくする\nいちどきりの ひほう)" },
              ],
              else: [] },
          ] },
        { cond: { flag: "worldtearGiven" },
          then: [],
          else: [
            { cond: { flag: "crystal" },
          then: [
            { cond: { flag: "paladin" },
              then: [{ msg: "ちょうろう「せいなるひかりを えたのじゃな。\nきたのとうへ ゆけ。\nザルバを たおすのじゃ!」" }],
              else: [{ msg: "ちょうろう「きたのほこらで\nこころのやみと むきあうのじゃ。\nクリスタルが みちびいてくれよう」" }] },
          ],
          else: [
            { msg: "ちょうろう「おお…… バロンの あんこくきし。\nクリスタルを うばいに きたのか」" },
            { msg: "レオン「………すまぬ。\nこれは おうの めいれいなのだ」" },
            { msg: "ちょうろう「クリスタルは わたそう。\nだが しるがよい。バロンおうは\nまじん ザルバに あやつられておる」" },
            { msg: "ちょうろう「ザルバを たおせるのは\nせいなるちからを えた きしのみ。\nだが いまの おぬしのこころは\nやみに とざされておる」" },
            { msg: "ちょうろう「きたのほこらで こころのやみと\nむきあうのじゃ。クリスタルを さずけよう。\nそれが おぬしを みちびく」" },
            { give: { item: "crystal" } },
            { msg: "クリスタルを てにいれた!" },
            { flag: ["crystal", 1] },
            { msg: "セリア「おじいさま わたしも いきます!\nしろまほうで このひとを ささえるわ」" },
            { msg: "ちょうろう「セリア……。 たのんだぞ。\nレオンどの、まごを よろしくたのむ」" },
            { join: "celia" },
            { msg: "セリアが なかまに くわわった!" },
          ] },
          ] },
      ] },
  ],
  chests: [],
};

// ---------------- にしのどうくつ ----------------
DATA.maps.cave = {
  name: "にしのどうくつ",
  bgm: "dungeon",
  encounter: "cave",
  legend: {
    "#": { tile: "mountain", solid: true },
    ".": { tile: "path" },
  },
  rows: [
    "########################",
    "#......................#",
    "#..##......##.....##...#",
    "#..##......##.....##...#",
    "#......................#",
    "#....##...........##...#",
    "#....##...####.....##..#",
    "#.........####.........#",
    "#......................#",
    "#####.....####....######",
    "#......................#",
    "#####.....####....######",
    "#......................#",
    "#..##......##.....##...#",
    "#..##......##.....##...#",
    "#......................#",
    "#....##...####....##...#",
    "#......................#",
    "#......................#",
    "########################",
  ],
  events: [
    { x: 1, y: 10, type: "enter", warp: { map: "world", x: 15, y: 20, dir: "l" } },
    { x: 22, y: 10, type: "enter", warp: { map: "world", x: 20, y: 20, dir: "r" } },
    { x: 20, y: 10, type: "enter",
      cond: { flag: "caveBoss" },
      failScript: [
        { msg: "デーモンガード\n「ここから さきへは いかせん!\nおうの めいれいなど しったことか!」" },
        { battle: { group: ["demonguard"], boss: true } },
        { flag: ["caveBoss", 1] },
        { msg: "レオン「おうの なも しらぬ まもの……。\nやはり なにかが おかしい」" },
      ] },
  ],
  npcs: [
    { id: "rodnpc", x: 11, y: 12, spr: "rod", hideFlag: "rodJoined",
      script: [
        { msg: "ロッド「おっと! ひとかい?\nオレは ロッド。まどうしだ。\nモンスターが ふえたわけを\nしらべてたのさ」" },
        { msg: "ロッド「ミストのむらへ いくのか?\nちょうど いい。オレも つれてけ!\nくろまほうなら まかせろ」" },
        { join: "rod" },
        { flag: ["rodJoined", 1] },
        { msg: "ロッドが なかまに くわわった!" },
      ] },
  ],
  chests: [
    { id: "cave1", x: 1, y: 1, gold: 150 },
    { id: "cave2", x: 22, y: 18, item: "ether" },
  ],
};

// ---------------- こころのほこら ----------------
DATA.maps.shrine = {
  name: "こころのほこら",
  bgm: "dungeon",
  encounter: "shrine",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "d": { tile: "door" },
  },
  rows: [
    "##############",
    "#............#",
    "#............#",
    "#########....#",
    "#............#",
    "#....#########",
    "#............#",
    "#########....#",
    "#............#",
    "#....#########",
    "#............#",
    "#########....#",
    "#............#",
    "#............#",
    "#............#",
    "######dd######",
  ],
  events: [
    { x: 6, y: 15, type: "enter", warp: { map: "world", x: 8, y: 5, dir: "d" } },
    { x: 7, y: 15, type: "enter", warp: { map: "world", x: 8, y: 5, dir: "d" } },
    { x: 7, y: 1, type: "enter",
      cond: { flag: "paladin" },
      failScript: [
        { msg: "こころのかがみが レオンのすがたを\nうつしている……。" },
        { msg: "『……おまえのやみが おまえをためす。\nやみを ちからで ねじふせることは\nできぬ……』" },
        { msg: "かがみのなかから\nもうひとりの レオンが あらわれた!!" },
        { battle: { group: ["shadow"], boss: true, music: "boss" } },
        { msg: "かがみが くだけちり……\nクリスタルが まばゆく かがやいた!" },
        { classchange: true },
        { msg: "レオンは パラディンに クラスチェンジした!\nひかりのつるぎと ひかりのよろいを\nみにつけた!" },
        { msg: "セリア「レオン…… すてきよ。\nこれで ザルバと たたかえるわ!」" },
        { flag: ["paladin", 1] },
      ] },
  ],
  npcs: [
    { id: "gounpc", x: 7, y: 12, spr: "gou", hideFlag: "gouJoined",
      script: [
        { msg: "ゴウ「おれは ながれの モンク、ゴウ。\nこの ほこらの やみは\nただものじゃねえ ぜ」" },
        { msg: "ゴウ「いどむ かおだな……。 きにいった!\nおれの こぶしも かしてやる!」" },
        { join: "gou" },
        { flag: ["gouJoined", 1] },
        { msg: "モンクのゴウが なかまに くわわった!" },
      ] },
  ],
  chests: [
    { id: "shrine1", x: 1, y: 4, item: "hipotion" },
    { id: "shrine2", x: 12, y: 8, gold: 300 },
  ],
};

// ---------------- まてんろう 1F ----------------
DATA.maps.tower1 = {
  name: "まてんろう 1F",
  bgm: "dungeon",
  encounter: "tower",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "S": { tile: "stairs" },
    "d": { tile: "door" },
  },
  rows: [
    "################",
    "#............S.#",
    "#..............#",
    "###########....#",
    "#..............#",
    "#....###########",
    "#..............#",
    "###########....#",
    "#..............#",
    "#..............#",
    "#..............#",
    "######dd########",
  ],
  events: [
    { x: 6, y: 11, type: "enter", warp: { map: "world", x: 28, y: 5, dir: "d" } },
    { x: 7, y: 11, type: "enter", warp: { map: "world", x: 28, y: 5, dir: "d" } },
    { x: 13, y: 1, type: "enter", warp: { map: "tower2", x: 12, y: 10, dir: "l" } },
  ],
  npcs: [],
  chests: [
    { id: "tw1a", x: 1, y: 1, item: "a_mythril" },
    { id: "tw1b", x: 14, y: 8, item: "hipotion" },
  ],
};

// ---------------- まてんろう 2F ----------------
DATA.maps.tower2 = {
  name: "まてんろう 2F",
  bgm: "dungeon",
  encounter: "tower",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "S": { tile: "stairs" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#.S............#",
    "#..............#",
    "#....###########",
    "#..............#",
    "###########....#",
    "#..............#",
    "#....###########",
    "#..............#",
    "#..............#",
    "#............s.#",
    "################",
  ],
  events: [
    { x: 13, y: 10, type: "enter", warp: { map: "tower1", x: 12, y: 1, dir: "l" } },
    { x: 2, y: 1, type: "enter", warp: { map: "towertop", x: 7, y: 7, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "tw2a", x: 14, y: 4, item: "phoenix" },
    { id: "tw2b", x: 1, y: 8, gold: 800 },
  ],
};

// ---------------- まてんろう さいじょうかい ----------------
DATA.maps.towertop = {
  name: "まてんろう さいじょうかい",
  bgm: "boss",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "carpet" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#......s.......#",
    "################",
  ],
  events: [
    { x: 7, y: 7, type: "enter", warp: { map: "tower2", x: 2, y: 2, dir: "d" } },
  ],
  npcs: [
    { id: "zarbanpc", x: 7, y: 2, spr: "zarba", hideFlag: "clear",
      script: [{ runScript: "zarbaFight" }] },
  ],
  chests: [],
};

// ---------------- こおりのどうくつ ----------------
DATA.maps.icecave = {
  name: "こおりのどうくつ",
  bgm: "dungeon",
  encounter: "icecave",
  legend: {
    "#": { tile: "mountain", solid: true },
    ".": { tile: "floor" },
  },
  rows: [
    "####################",
    "#..................#",
    "#..##############..#",
    "#..................#",
    "#..#################",
    "#..................#",
    "#################..#",
    "#..................#",
    "#..#################",
    "#..................#",
    "#################..#",
    "#..................#",
    "#..................#",
    "####################",
  ],
  events: [
    { x: 1, y: 12, type: "enter", warp: { map: "world", x: 21, y: 8, dir: "d" } },
    { x: 1, y: 2, type: "enter", scriptId: "iceDragon" },
    { x: 2, y: 2, type: "enter", scriptId: "iceDragon" },
    { x: 17, y: 2, type: "enter", scriptId: "iceDragon" },
    { x: 18, y: 2, type: "enter", scriptId: "iceDragon" },
  ],
  npcs: [
    { id: "icedragonnpc", x: 14, y: 1, spr: "dragon", hideFlag: "iceBoss",
      script: [{ runScript: "iceDragon" }] },
    // しんエンドごに あらわれる かくしボス
    { id: "vahanpc", x: 7, y: 1, spr: "dragon", pal: "dark",
      showFlag: "trueClear", hideFlag: "superBoss",
      script: [{ runScript: "vahaFight" }] },
  ],
  chests: [
    { id: "ice1", x: 18, y: 5, item: "a_ice" },
    { id: "ice2", x: 1, y: 9, gold: 800 },
    { id: "ice3", x: 1, y: 1, item: "w_flame" },
    { id: "ice4", x: 2, y: 1, item: "w_dragonlance" },
  ],
};

// ---------------- みなとまち ソレイユ ----------------
DATA.maps.port = {
  name: "みなとまち ソレイユ",
  bgm: "town",
  exit: { map: "world", x: 30, y: 17, dir: "d" },
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "w": { tile: "water", solid: true },
    "b": { tile: "bridge" },
  },
  rows: [
    "ffffffffff..ffffffffff",
    "f....................f",
    "f.WWWWW.......WWWWW..f",
    "f.WWWWW.......WWWWW..f",
    "f.WWdWW.......WWDWW..f",
    "f....................f",
    "f....................f",
    "f....................f",
    "wwwwwwwwwwbwwwwwwwwwww",
    "wwwwwwwwwwbwwwwwwwwwww",
    "wwwwwwwwwwbwwwwwwwwwww",
    "wwwwwwwwwwbwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "portinn", x: 4, y: 6, dir: "u" } },
    { x: 16, y: 4, type: "enter", warp: { map: "portshop", x: 4, y: 6, dir: "u" } },
    { x: 10, y: 10, type: "enter", scriptId: "airshipBoard" },
  ],
  npcs: [
    { id: "sailor", x: 9, y: 7, spr: "villager",
      script: [
        { cond: { flag: "seaBoss" },
          then: [
            { cond: { flag: "seaReward" },
              then: [
                { cond: { flag: "trueClear" },
                  then: [{ msg: "せんいん「こおりのどうくつの おくで\nくろい りゅうを みたって うわさだ。\nうでに おぼえが あるなら……」" }],
                  else: [{ msg: "せんいん「うみが しずかに なった。\nあんたたちの おかげだな!」" }] },
              ],
              else: [
                { msg: "せんいん「うみのそこの ぬしを\nたおしてくれたのか!! これで あんしんして\nりょうが できる。れいだ、うけとってくれ!」" },
                { give: { gold: 2500 } },
                { msg: "2500ギルを てにいれた!" },
                { flag: ["seaReward", 1] },
              ] },
          ],
          else: [
            { msg: "せんいん「よう! ここは みなとまち\nソレイユ。うみの むこうで よなよな\nあかい ひかりが みえるんだ」" },
            { msg: "せんいん「ちていに つづく おおあなが\nひらいたって うわさも ある。\nいやな よかんが するぜ……」" },
          ] },
      ] },
    { id: "obaba", x: 5, y: 6, spr: "villager", wander: true,
      script: [
        { cond: { flag: "chest_pier1" },
          then: [{ msg: "おばあさん「さんばしの ひかりもの、\nみつけたんだってね。 めが いいねえ。\nわかいって いいことだよ」" }],
          else: [{ msg: "おばあさん「さんばしの さきっぽで\nなにかが ひかったのを みたんだよ。\nしらべてみたら どうだい?」" }] },
      ] },
    { id: "merchant", x: 14, y: 6, spr: "villager", wander: true,
      script: [
        { cond: { flag: "arenaGold" },
          then: [{ msg: "しょうにん「とうぎじょうの チャンピオン!\nうちの みせの しなも つかってくれて\nこうえいだよ!」" }],
          else: [
            { cond: { flag: "submarine" },
              then: [{ msg: "しょうにん「うみのそこへ いける\nおきゃくは はじめてだよ。\nしんかいの おみやげ まってるよ!」" }],
              else: [{ msg: "しょうにん「ソレイユのみせは\nミストより いいものぞろいだよ!\nぜひ みていっとくれ」" }] },
          ] },
      ] },
    // つりぼり
    { id: "fisher", x: 11, y: 7, spr: "villager",
      script: [
        { cond: { flag: "fishKing" },
          then: [{ msg: "つりし「ぬしを つりあげた うでまえ、\nほんもんだね。 きょうも つるかい?」" }],
          else: [{ msg: "つりし「ここの うみには『ぬし』が\nいるんだ。 つってみるかい?」" }] },
        { fishing: { price: 50 } },
      ] },
    // ゴウのこじんイベント (ちのクリスタルご)
    { id: "roushi", x: 6, y: 5, spr: "elder", showFlag: "earthCrystal",
      script: [
        { cond: { flag: "gouEvent" },
          then: [{ msg: "ロウシ「こぶしは こころ。\nわすれるでないぞ ゴウよ」" }],
          else: [
            { msg: "ロウシ「……そのあしおと、ゴウか」" },
            { msg: "ゴウ「し、ししょう!? なんで\nこんなところに いるんすか!」" },
            { msg: "ロウシ「たびの かぜの うわさでな。\nおまえの こぶしが まよいを すてたと\nきいた。 これを さずけよう」" },
            { msg: "ゴウ「ししょうの はちまき……!\nおれ、もっと つよくなります!!」" },
            { give: { item: "a_hachimaki" } },
            { msg: "せんしのはちまきを てにいれた!" },
            { flag: ["gouEvent", 1] },
          ] },
      ] },
    { id: "arena", x: 13, y: 7, spr: "soldier",
      script: [
        { cond: { flag: "arenaGold" },
          then: [
            { msg: "うけつけ「チャンピオン! また\nうでだめしに きたのかい?」" },
            { runScript: "arenaEntry" },
          ],
          else: [{ runScript: "arenaEntry" }] },
      ] },
    { id: "scholar", x: 18, y: 6, spr: "elder",
      script: [
        { cond: { flag: "glowReward" },
          then: [{ msg: "がくしゃ「かがやくいしの けんきゅうは\nじゅんちょうじゃ。ちていには きっと\nすごい ひみつが ねむっておる…」" }],
          else: [
            { cond: { item: "glowstone" },
              then: [
                { msg: "がくしゃ「おお! それは まさしく\nちていの 『かがやくいし』!!\nけんきゅうのため ゆずってくれんか」" },
                { take: { item: "glowstone" } },
                { give: { gold: 1500 } },
                { msg: "かがやくいしを わたして\n1500ギルを てにいれた!" },
                { flag: ["glowReward", 1] },
              ],
              else: [
                { msg: "がくしゃ「みなみの おおあなのそこに\n『かがやくいし』が あるらしい。\nゆずってくれたら 1500ギル はらおう」" },
              ] },
          ] },
      ] },
  ],
  chests: [
    { id: "pier1", x: 10, y: 11, item: "elixir", hidden: true },
  ],
};

DATA.maps.portinn = {
  name: "ソレイユのやどや",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "B": { tile: "bed" },
    "n": { tile: "counter", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##########",
    "#B......B#",
    "#........#",
    "#..nnnn..#",
    "#........#",
    "#........#",
    "#........#",
    "####dd####",
  ],
  events: [
    { x: 4, y: 7, type: "enter", warp: { map: "port", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 7, type: "enter", warp: { map: "port", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "portinnkeep", x: 4, y: 2, spr: "villager",
      script: [{ inn: 40 }] },
  ],
  chests: [],
};

DATA.maps.portshop = {
  name: "ソレイユのみせ",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "n": { tile: "counter", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##########",
    "#........#",
    "#........#",
    "#..nnnn..#",
    "#........#",
    "#........#",
    "#........#",
    "####dd####",
  ],
  events: [
    { x: 4, y: 7, type: "enter", warp: { map: "port", x: 16, y: 5, dir: "d" } },
    { x: 5, y: 7, type: "enter", warp: { map: "port", x: 16, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "portshopkeep", x: 4, y: 2, spr: "villager",
      script: [{ shop: "port" }] },
  ],
  chests: [],
};

// ---------------- ちかすいろ ----------------
DATA.maps.waterway = {
  name: "ちかすいろ",
  bgm: "dungeon",
  encounter: "waterway",
  legend: {
    "#": { tile: "wall", solid: true },
    "~": { tile: "water", solid: true },
    ".": { tile: "floor" },
  },
  rows: [
    "######################",
    "#....................#",
    "#....................#",
    "#.~~~~~~~~~~~~~~~~~~.#",
    "#.~~~~~~~~~~~~~~~~~~.#",
    "#....................#",
    "#.~~~~~~~~~~~~~~~~~~.#",
    "#.~~~~~~~~~~~~~~~~~~.#",
    "#....................#",
    "######################",
  ],
  events: [
    { x: 1, y: 8, type: "enter", warp: { map: "world", x: 9, y: 31, dir: "d" } },
    { x: 3, y: 8, type: "enter", scriptId: "wwWarn" },
    { x: 6, y: 1, type: "enter", scriptId: "krakenFight" },
    { x: 6, y: 2, type: "enter", scriptId: "krakenFight" },
    { x: 15, y: 1, type: "enter", scriptId: "krakenFight" },
    { x: 15, y: 2, type: "enter", scriptId: "krakenFight" },
  ],
  npcs: [
    { id: "krakennpc", x: 11, y: 1, spr: "kraken", hideFlag: "waterBoss",
      script: [{ runScript: "krakenFight" }] },
  ],
  chests: [
    { id: "ww1", x: 9, y: 1, item: "w_thunderclaw" },
    { id: "ww2", x: 13, y: 1, item: "a_aqua" },
    { id: "ww3", x: 17, y: 1, item: "w_boltstaff" },
    { id: "ww4", x: 2, y: 5, gold: 900 },
    { id: "ww5", x: 12, y: 5, item: "elixir", hidden: true },
  ],
};

// ---------------- おおあなのそこ ----------------
DATA.maps.magma = {
  name: "おおあなのそこ",
  bgm: "dungeon",
  encounter: "magma",
  legend: {
    "#": { tile: "mountain", solid: true },
    ".": { tile: "path" },
  },
  rows: [
    "####################",
    "#..................#",
    "#################..#",
    "#..................#",
    "#..#################",
    "#..................#",
    "#################..#",
    "#..................#",
    "#..#################",
    "#..................#",
    "#..##############..#",
    "#..................#",
    "#..................#",
    "####################",
  ],
  events: [
    { x: 1, y: 1, type: "enter", warp: { map: "world", x: 29, y: 29, dir: "d" } },
    { x: 1, y: 11, type: "enter", scriptId: "magmaFight" },
    { x: 2, y: 11, type: "enter", scriptId: "magmaFight" },
    { x: 17, y: 11, type: "enter", scriptId: "magmaFight" },
    { x: 18, y: 11, type: "enter", scriptId: "magmaFight" },
    { x: 18, y: 12, type: "enter", scriptId: "sealedDoor" },
  ],
  npcs: [
    { id: "magmawormnpc", x: 10, y: 12, spr: "worm", hideFlag: "magmaBoss",
      script: [{ runScript: "magmaFight" }] },
  ],
  chests: [
    { id: "magma1", x: 5, y: 12, item: "w_iceblade" },
    { id: "magma2", x: 14, y: 12, item: "a_flame" },
    { id: "magma3", x: 10, y: 11, item: "glowstone" },
    { id: "magma4", x: 1, y: 12, gold: 1200, hidden: true },
  ],
};

// ---------------- ちていせかい ----------------
DATA.maps.underworld = {
  name: "ちていせかい",
  outdoor: true,
  bgm: "under",
  encounter: "underworld",
  legend: {
    "m": { tile: "mountain", solid: true },
    "w": { tile: "water", solid: true },
    ".": { tile: "path" },
    "T": { tile: "icon_town" },
    "D": { tile: "icon_shrine" },
    "C": { tile: "icon_castle" },
  },
  rows: [
    "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    "m............................m",
    "m..mm....wwwww......mmm......m",
    "m..mm....wwwww......mmm......m",
    "m............................m",
    "m.....mm...........www....C..m",
    "m.....mm.....................m",
    "m............................m",
    "m...www......................m",
    "m...www.....T................m",
    "m............................m",
    "m.........mmmm...............m",
    "m.........mmmm.....www.......m",
    "m............................m",
    "m....www.....................m",
    "m....www................D....m",
    "m............................m",
    "m.......mmm..................m",
    "m............................m",
    "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
  ],
  events: [
    { x: 3, y: 1, type: "enter", warp: { map: "magma", x: 17, y: 12, dir: "u" } },
    { x: 12, y: 9, type: "enter", warp: { map: "muspel", x: 10, y: 12, dir: "u" } },
    { x: 26, y: 5, type: "enter", warp: { map: "dwarfhall", x: 7, y: 10, dir: "u" } },
    { x: 24, y: 15, type: "enter", scriptId: "templeEnter" },
    // しんでんの まわりは いんせきのばんにんが まもっている
    { x: 24, y: 14, type: "enter", scriptId: "meteoFight" },
    { x: 24, y: 16, type: "enter", scriptId: "meteoFight" },
    { x: 23, y: 15, type: "enter", scriptId: "meteoFight" },
    { x: 25, y: 15, type: "enter", scriptId: "meteoFight" },
  ],
  npcs: [
    { id: "meteonpc", x: 23, y: 14, spr: "golem", pal: "light", hideFlag: "meteorDown",
      script: [{ runScript: "meteoFight" }] },
    { id: "gnomosnpc", x: 5, y: 17, spr: "golem",
      showFlag: "allCrystals", hideFlag: "gnomosDown",
      script: [
        { msg: "だいちが もりあがり きょだいな かげが\nたちはだかる……! つちのげんじゅう ノーモス!!" },
        { battle: { group: ["gnomos"], boss: true, music: "spirit" } },
        { flag: ["gnomosDown", 1] },
        { msg: "ノーモスは だいちに かえっていった。\nあとに おおきな たてが のこされた。" },
        { give: { item: "a_gnomos" } },
        { msg: "だいちのおおたてを てにいれた!" },
      ] },
  ],
  chests: [
    { id: "uw1", x: 28, y: 1, gold: 1500, hidden: true },
  ],
};

// ---------------- ドヴェルグおうきゅう ----------------
DATA.maps.dwarfhall = {
  name: "ドヴェルグおうきゅう",
  bgm: "hall",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "p": { tile: "pillar", solid: true },
    "r": { tile: "carpet" },
  },
  rows: [
    "################",
    "#..............#",
    "#.p..........p.#",
    "#..............#",
    "#.....rrrr.....#",
    "#.....rrrr.....#",
    "#.p..........p.#",
    "#..............#",
    "#..##......##..#",
    "#..#........#..#",
    "#..............#",
    "################",
  ],
  events: [
    { x: 7, y: 10, type: "enter", warp: { map: "underworld", x: 26, y: 6, dir: "d" } },
    { x: 8, y: 10, type: "enter", warp: { map: "underworld", x: 26, y: 6, dir: "d" } },
  ],
  npcs: [
    { id: "dverg_king", x: 7, y: 4, spr: "king",
      script: [
        { cond: { flag: "dvergReward" },
          then: [{ msg: "ドヴェルグおう バルド「そなたらは ちていの\nおんじんじゃ。 ゆっくり していくがよい。\nガハハハ!」" }],
          else: [
            { cond: { flag: "dvergQuest" },
              then: [
                { cond: { kills: { id: "firelizard", n: 5 } },
                  then: [
                    { msg: "バルド「おお! マグマトカゲを 5たいも\nうちはらってくれたか! これで たみも\nあんしんして くらせるわい」" },
                    { give: { item: "w_dverg" } },
                    { give: { gold: 4000 } },
                    { msg: "ドヴェルグアクスと 4000ギルを てにいれた!" },
                    { flag: ["dvergReward", 1] },
                  ],
                  else: [{ msg: "バルド「マグマトカゲは まだ あばれておる。\n5たい たおしたら もどってまいれ。\nずかんで かずを かくにんできるぞ」" }] },
              ],
              else: [
                { msg: "ドヴェルグおう バルド「ようこそ ちていの\nおうきゅうへ! ちじょうの ものが くるとは\nめずらしい。ガハハハ!」" },
                { msg: "「じつは マグマトカゲどもが ふえて\nたみが こまっておる。5たい たいじして\nくれたら ほうびを とらせよう」" },
                { flag: ["dvergQuest", 1] },
              ] },
          ] },
      ] },
    { id: "dverg_guard1", x: 5, y: 6, spr: "soldier",
      script: [{ msg: "えいへい「おうは ああみえて くにいちばんの\nおのの つかいてなのだ」" }] },
    { id: "dverg_guard2", x: 10, y: 6, spr: "soldier",
      script: [{ msg: "えいへい「たからのまは おうきゅうの ちか。\nかべの すきまを しらべてみるといい……\nおっと、ひとりごとだ」" }] },
    { id: "dverg_maid", x: 3, y: 3, spr: "villager", wander: true,
      script: [{ msg: "じじゅう「ムスペルの かじばには おうきゅうの\nしょくにんも かよっているんですよ」" }] },
  ],
  chests: [
    { id: "dh1", x: 4, y: 9, gold: 5000 },
    { id: "dh2", x: 11, y: 9, item: "elixir" },
    { id: "dh3", x: 1, y: 10, item: "a_dverg2", hidden: true },
  ],
};

// ---------------- ちていしんでん ----------------
DATA.maps.temple = {
  name: "ちていしんでん",
  bgm: "shrine",
  encounter: "temple",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "carpet" },
  },
  rows: [
    "##################",
    "#................#",
    "#..############..#",
    "#................#",
    "#..###############",
    "#................#",
    "###############..#",
    "#................#",
    "#..###############",
    "#................#",
    "###############..#",
    "#................#",
    "#................#",
    "##################",
  ],
  events: [
    { x: 2, y: 12, type: "enter", warp: { map: "underworld", x: 24, y: 16, dir: "d" } },
    { x: 1, y: 2, type: "enter", scriptId: "gladFight" },
    { x: 2, y: 2, type: "enter", scriptId: "gladFight" },
    { x: 15, y: 2, type: "enter", scriptId: "gladFight" },
    { x: 16, y: 2, type: "enter", scriptId: "gladFight" },
  ],
  npcs: [
    { id: "gladnpc", x: 8, y: 1, spr: "demon", pal: "light", hideFlag: "templeBoss",
      script: [{ runScript: "gladFight" }] },
  ],
  chests: [
    { id: "tp1", x: 12, y: 1, item: "a_gaia" },
    { id: "tp2", x: 5, y: 1, item: "elixir", hidden: true },
    { id: "tp3", x: 16, y: 7, gold: 2000 },
  ],
};

// ---------------- かじやのさと ムスペル ----------------
DATA.maps.muspel = {
  name: "かじやのさと ムスペル",
  bgm: "town",
  exit: { map: "underworld", x: 12, y: 10, dir: "d" },
  legend: {
    "m": { tile: "mountain", solid: true },
    ".": { tile: "grass" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "F": { tile: "door" },
  },
  rows: [
    "mmmmmmmmmmmmmmmmmmmm",
    "m..................m",
    "m.WWWWW......WWWWW.m",
    "m.WWWWW......WWWWW.m",
    "m.WWdWW......WWDWW.m",
    "m..................m",
    "m.......WWWWW......m",
    "m.......WWWWW......m",
    "m.......WWFWW......m",
    "m..................m",
    "m..................m",
    "m..................m",
    "m..................m",
    "mmmmmmmm....mmmmmmmm",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "muspelinn", x: 4, y: 6, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "muspelshop", x: 4, y: 6, dir: "u" } },
    { x: 10, y: 8, type: "enter", warp: { map: "forge", x: 5, y: 7, dir: "u" } },
  ],
  npcs: [
    { id: "dwarf1", x: 5, y: 10, spr: "villager", pal: "dark", wander: true,
      script: [
        { cond: { flag: "submarine" },
          then: [{ msg: "ドワーフ「せんすいそうちの ちょうしは\nどうだべ? うみのそこも\nひこうせんから いけるだよ」" }],
          else: [
            { cond: { flag: "windCrystal" },
              then: [
                { msg: "ドワーフ「かぜのクリスタルだべか!!\nそれが あれば ひこうせんに\nせんすいそうちを つけられるだ!」" },
                { msg: "ドワーフ「よし、くみこんでおいただ!\nおおうずしおの したの うみのそこへ\nもぐれるように なっただよ」" },
                { flag: ["submarine", 1] },
                { msg: "ひこうせんが せんすいできるように なった!\n(いきさきに うみのそこ が ふえました)" },
              ],
              else: [{ msg: "ドワーフ「ようこそ ムスペルへ!\nちじょうの ひとが くるのは\nひさしぶりだべ」" }] },
          ] },
      ] },
    { id: "dwarf2", x: 14, y: 11, spr: "villager", pal: "dark", wander: true,
      script: [
        { cond: { flag: "airship" },
          then: [{ msg: "ドワーフ「そらのたびは どうだ?\nソレイユの さんばしから のれるだよ」" }],
          else: [
            { cond: { flag: "earthCrystal" },
              then: [
                { msg: "ドワーフ「ちのクリスタルを\nてにいれただか!! それが あれば\nきゅうひこうせんが うごくだ!」" },
                { msg: "ドワーフ「ソレイユの おきに ういてた\nふるい ひこうせんを なおして\nどうりょくを くみこんでおいただ!」" },
                { flag: ["airship", 1] },
                { msg: "ひこうせんが つかえるように なった!\n(ソレイユの さんばしから とべます)" },
              ],
              else: [{ msg: "ドワーフ「みなみの しんでんに\n『ちのクリスタル』が ねむってるだ。\nだども けっかいで はいれねえだ」" }] },
          ] },
      ] },
  ],
  chests: [],
};
DATA.maps.muspel.npcs.push(
  { id: "dwarfkid", x: 9, y: 10, spr: "villager", pal: "light", wander: true,
    script: [
      { cond: { flag: "waterCrystal" },
        then: [{ msg: "ドワーフのこ「クリスタルを 4つも!?\nすげえだ! おら、ちじょうの そらって\nいつか みてみたいだよ」" }],
        else: [{ msg: "ドワーフのこ「ちじょうの ひと\nはじめて みただ! せが たかいだなあ」" }] },
    ] });

DATA.maps.muspelinn = {
  name: "ムスペルのやどや",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "B": { tile: "bed" },
    "n": { tile: "counter", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##########",
    "#B......B#",
    "#........#",
    "#..nnnn..#",
    "#........#",
    "#........#",
    "#........#",
    "####dd####",
  ],
  events: [
    { x: 4, y: 7, type: "enter", warp: { map: "muspel", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 7, type: "enter", warp: { map: "muspel", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "muspelinnkeep", x: 4, y: 2, spr: "villager", pal: "dark",
      script: [{ inn: 60 }] },
    // ロッドのこじんイベント (ちていかいほうご)
    { id: "mentor", x: 7, y: 5, spr: "rod", showFlag: "underOpen",
      script: [
        { cond: { flag: "rodEvent" },
          then: [{ msg: "ガレフ「けんきゅうは あしで かせぐ。\nおまえの くちぐせに なったか?」" }],
          else: [
            { msg: "ガレフ「……ロッドじゃないか。\nはもんされた でしが ずいぶん\nりっぱに なったもんだ」" },
            { msg: "ロッド「ガレフせんせい!\nはもんって、オレは じぶんから\nでていったんすけど!?」" },
            { msg: "ガレフ「はっはっは。 くちも たつように\nなった。 ならば これを よみこなせるな。\nわしの けんきゅうの すべてだ」" },
            { msg: "ロッド「せんせいの しょもつ……。\n……うけとります。 ぜんぶ おぼえて\nこえてみせますよ」" },
            { give: { item: "w_truthbook" } },
            { msg: "しんりのしょを てにいれた!" },
            { flag: ["rodEvent", 1] },
          ] },
      ] },
  ],
  chests: [],
};

DATA.maps.muspelshop = {
  name: "ムスペルのかじば",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "n": { tile: "counter", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##########",
    "#........#",
    "#........#",
    "#..nnnn..#",
    "#........#",
    "#........#",
    "#........#",
    "####dd####",
  ],
  events: [
    { x: 4, y: 7, type: "enter", warp: { map: "muspel", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 7, type: "enter", warp: { map: "muspel", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "muspelshopkeep", x: 4, y: 2, spr: "villager", pal: "dark",
      script: [{ shop: "muspel" }] },
  ],
  chests: [],
};

DATA.maps.forge = {
  name: "ドヴェルグのかじや",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "############",
    "#..........#",
    "#.t......t.#",
    "#..........#",
    "#..........#",
    "#..........#",
    "#..........#",
    "#..........#",
    "#####dd#####",
  ],
  events: [
    { x: 5, y: 8, type: "enter", warp: { map: "muspel", x: 10, y: 9, dir: "d" } },
    { x: 6, y: 8, type: "enter", warp: { map: "muspel", x: 10, y: 9, dir: "d" } },
  ],
  npcs: [
    { id: "dverg", x: 5, y: 2, spr: "elder",
      script: [
        { cond: { flag: "forged" },
          then: [{ msg: "ドヴェルグ「どうだ ほしくずのつるぎは。\nわしの さいこうけっさくだべ」" }],
          else: [
            { cond: { item: "glowstone" },
              then: [
                { msg: "ドヴェルグ「そ、それは かがやくいし!!\nわしに あずけてみろ。\nすごいもんを うってやるだ」" },
                { msg: "カン カン カン……\nカン カン カン……!!" },
                { take: { item: "glowstone" } },
                { give: { item: "w_star" } },
                { flag: ["forged", 1] },
                { msg: "ほしくずのつるぎを てにいれた!" },
              ],
              else: [
                { msg: "ドヴェルグ「おおあなのそこの\n『かがやくいし』を もってくれば\nでんせつのぶきを うってやるだ」" },
              ] },
          ] },
      ] },
  ],
  chests: [],
};

// ---------------- そらのしま ----------------
DATA.maps.skyisland = {
  name: "そらのしま",
  outdoor: true,
  bgm: "sky",
  encounter: "sky",
  legend: {
    "w": { tile: "water", solid: true },
    "m": { tile: "mountain", solid: true },
    ".": { tile: "grass" },
    "D": { tile: "icon_shrine" },
    "X": { tile: "icon_tower" },
    "G": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwww",
    "wwww........wwwwwwwwwwww",
    "ww......X....G..wwwwwwww",
    "ww..mm..........wwwwwwww",
    "ww..mm...........wwwwwww",
    "www........mm....wwwwwww",
    "wwww.......mm.....wwwwww",
    "wwww...............wwwww",
    "www......D.........wwwww",
    "www................wwwww",
    "wwww......mm......wwwwww",
    "wwwww.....mm.....wwwwwww",
    "wwwwww..........wwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 3, y: 9, type: "enter", scriptId: "airshipBoard" },
    { x: 9, y: 8, type: "enter", warp: { map: "windtemple", x: 2, y: 12, dir: "u" } },
    { x: 8, y: 2, type: "enter",
      cond: { flag: "allCrystals" },
      failScript: [{ msg: "そらが かすかに ゆらいでいる……。\nなにかが あらわれる よかんがする。" }],
      warp: { map: "startower1", x: 6, y: 10, dir: "u" } },
    { x: 13, y: 2, type: "enter",
      cond: { flag: "starGate" },
      failScript: [{ msg: "そらに ちいさな ひかりのわが\nうかんでいる。 いまは とおれない。" }],
      warp: { map: "starworld", x: 11, y: 12, dir: "u" } },
  ],
  npcs: [
    { id: "sylphidnpc", x: 15, y: 4, spr: "bird", pal: "light",
      showFlag: "allCrystals", hideFlag: "sylphidDown",
      script: [
        { msg: "かぜが うずを まいて けもののかたちに……!\nかぜのげんじゅう シルフィドだ!!" },
        { battle: { group: ["sylphid"], boss: true, music: "spirit" } },
        { flag: ["sylphidDown", 1] },
        { msg: "シルフィドは かぜにとけて きえた。\nあとに マントが ひらりと まいおちた。" },
        { give: { item: "a_sylphid" } },
        { msg: "かぜのマントを てにいれた!" },
      ] },
  ],
  chests: [
    { id: "sky1", x: 17, y: 7, gold: 2500, hidden: true },
  ],
};

// ---------------- ほしのせかい (第2ワールド) ----------------
DATA.maps.starworld = {
  name: "ほしのせかい",
  outdoor: true,
  bgm: "star",
  encounter: "starworld",
  legend: {
    "w": { tile: "water", solid: true },
    "m": { tile: "mountain", solid: true },
    ".": { tile: "path" },
    "f": { tile: "forest" },
    "T": { tile: "icon_town" },
    "C": { tile: "icon_cave" },
    "G": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwww",
    "ww......mmm.........wwww",
    "w...mm..m.m....mm.....ww",
    "w...m.....m....m.m....ww",
    "w..........T...mm......w",
    "w...ff.................w",
    "w...ff.......mmm.....C.w",
    "ww......mm...m.m......ww",
    "ww......mm...mmm......ww",
    "w.....................ww",
    "w....mm.......ff......ww",
    "w....m.m......ff.....www",
    "ww...mm....G........wwww",
    "wwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 11, y: 12, type: "enter", warp: { map: "skyisland", x: 13, y: 3, dir: "d" } },
    { x: 11, y: 4, type: "enter", warp: { map: "moonpalace", x: 7, y: 10, dir: "u" } },
    { x: 21, y: 6, type: "enter", warp: { map: "crater1", x: 2, y: 10, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "sw1", x: 9, y: 2, gold: 5000, hidden: true },
    { id: "sw2", x: 12, y: 10, item: "elixir", hidden: true },
    { id: "sw3", x: 1, y: 9, item: "w_ryuoh", hidden: true },
    { id: "sw4", x: 18, y: 4, item: "a_nova", hidden: true },
  ],
};

// ---------------- つきのみやこ セレーネ ----------------
DATA.maps.moonpalace = {
  name: "つきのみやこ セレーネ",
  bgm: "star",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "p": { tile: "pillar", solid: true },
    "c": { tile: "counter", solid: true },
    "b": { tile: "bed" },
    "t": { tile: "table", solid: true },
    "r": { tile: "carpet" },
  },
  rows: [
    "################",
    "#....p....p....#",
    "#.bb.........c.#",
    "#.bb...rr......#",
    "#......rr....t.#",
    "#....p....p....#",
    "#..............#",
    "#.c.........t..#",
    "#..............#",
    "#....p....p....#",
    "#..............#",
    "################",
  ],
  events: [
    { x: 7, y: 10, type: "enter", warp: { map: "starworld", x: 12, y: 5, dir: "d" } },
    { x: 8, y: 10, type: "enter", warp: { map: "starworld", x: 12, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "selene_inn", x: 14, y: 2, spr: "innkeep",
      script: [{ inn: 400 }] },
    { id: "selene_shop", x: 1, y: 7, spr: "shopkeep",
      script: [{ shop: "selene" }] },
    { id: "selene_elder", x: 7, y: 3, spr: "elder",
      script: [
        { cond: { flag: "craterBoss" },
          then: [
            { cond: { flag: "stellaDone" },
              then: [{ msg: "つきびとの ちょうろう「ステラも すっかり\nげんきじゃ。ほしの たみは あなたがたを\nけっして わすれぬ」" }],
              else: [
                { cond: { flag: "stellaFound" },
                  then: [
                    { msg: "ちょうろう「おお ステラが もどってきた!\nほんとうに ありがとう……。\nこれは ほしのたみに つたわる たからじゃ」" },
                    { give: { item: "a_stellar" } },
                    { msg: "ほしのまもりを てにいれた!" },
                    { flag: ["stellaDone", 1] },
                  ],
                  else: [
                    { cond: { flag: "stellaQuest" },
                      then: [{ msg: "ちょうろう「ステラは クレーターの おくで\nほしのかけらを ひろうのが すきでな……。\nどうか さがしだしてくれ」" }],
                      else: [
                        { msg: "ちょうろう「ぬしを しずめてくれて れいをいう。\nじゃが こまったことが おきた。むらの こども\nステラの すがたが みえんのじゃ」" },
                        { msg: "「ぬしが きえたのを みて クレーターの おくへ\nほしひろいに いったのやもしれぬ……。\nどうか つれもどしてくれぬか」" },
                        { flag: ["stellaQuest", 1] },
                      ] },
                  ] },
              ] },
          ],
          else: [
            { msg: "つきびとの ちょうろう「ようこそ ほしのせかいへ。\nわしらは ふるい ほしの たみ。\nしずかに くらしてきた」" },
            { msg: "「じゃが きょだいな クレーターに ぬしが\nすみつき、だいちが あれはじめた。\nちからある ものよ、たすけてくれぬか」" },
          ] },
      ] },
    { id: "selene_bard", x: 4, y: 8, spr: "villager", showFlag: "trueClear",
      script: [
        { cond: { flag: "bardGift" },
          then: [{ msg: "たびのうたひと「やみを こえた きしたちの うた、\nほしの すみずみまで ひびかせますよ」" }],
          else: [
            { msg: "たびのうたひと「おお、うわさに きく\nひかりのきし ごいっこう!\nあなたがたの たびを うたに しました」" },
            { msg: "♪ やみを まといて ひかりへ あゆみ\n♪ よっつの ひかりが ほしを つなぐ……\nこころに しみる うただ。" },
            { give: { item: "elixir" } },
            { msg: "うたの おれいにと エリクサーを くれた!" },
            { flag: ["bardGift", 1] },
          ] },
      ] },
    { id: "selene_girl", x: 10, y: 6, spr: "villager", wander: true,
      script: [{ msg: "つきびとの こども「ここの まものは\nとーっても つよいの。でも けいけんに\nなるって おとなが いってた!」" }] },
    { id: "selene_watcher", x: 13, y: 8, spr: "soldier",
      script: [{ msg: "ほしのばんにん「クレーターの おくは\nぬしの すみか。かくごの ないものは\nちかづかぬことだ」" }] },
  ],
  chests: [
    { id: "mp1", x: 14, y: 1, item: "megapotion" },
    { id: "mp2", x: 1, y: 10, item: "w_supernova", hidden: true },
    { id: "mp3", x: 14, y: 8, item: "a_astral", hidden: true },
  ],
};

// ---------------- だいクレーター ----------------
DATA.maps.crater1 = {
  name: "だいクレーター",
  bgm: "dungeon",
  encounter: "crater",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#...........s..#",
    "#..######..##..#",
    "#.......#......#",
    "######..#..#####",
    "#.......#......#",
    "#..######..##..#",
    "#..#...........#",
    "#..#..######..##",
    "#..............#",
    "#..............#",
    "################",
  ],
  events: [
    { x: 2, y: 10, type: "enter", warp: { map: "starworld", x: 20, y: 6, dir: "d" } },
    { x: 12, y: 1, type: "enter", warp: { map: "crater2", x: 3, y: 1, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "cr1", x: 14, y: 3, gold: 4000 },
    { id: "cr2", x: 1, y: 7, item: "elixir" },
    { id: "cr6", x: 14, y: 7, item: "w_nova" },
    { id: "cr7", x: 6, y: 10, item: "w_astral", hidden: true },
  ],
};

DATA.maps.crater2 = {
  name: "クレーターさいしんぶ",
  bgm: "dungeon",
  encounter: "crater",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#..s...........#",
    "#..#########...#",
    "#...........#..#",
    "#..#######..#..#",
    "#..#.....#..#..#",
    "#..#.....#..#..#",
    "#..#.....#..#..#",
    "#..##.####..#..#",
    "#...........#..#",
    "#..............#",
    "################",
  ],
  events: [
    { x: 3, y: 1, type: "enter", warp: { map: "crater1", x: 12, y: 1, dir: "d" } },
    { x: 5, y: 8, type: "enter", scriptId: "lunavoraFight" },
  ],
  npcs: [
    { id: "stella", x: 6, y: 6, spr: "villager", showFlag: "stellaQuest", hideFlag: "stellaFound",
      script: [
        { msg: "ステラ「ほしひろいに きたら まものが\nいっぱいで うごけなく なっちゃったの……。\nおにいちゃんたち つよいんだね!」" },
        { msg: "ステラは ひろった ほしのかけらを\nぎゅっと にぎりしめて うなずいた。" },
        { flag: ["stellaFound", 1] },
        { msg: "ステラは ひとあし さきに\nセレーネへ かけていった。" },
      ] },
  ],
  chests: [
    { id: "cr3", x: 8, y: 5, item: "worldtear" },
    { id: "cr4", x: 4, y: 5, gold: 8000, hidden: true },
    { id: "cr5", x: 14, y: 5, item: "elixir" },
    { id: "cr8", x: 8, y: 7, item: "a_cosmogi" },
    { id: "cr9", x: 1, y: 3, item: "w_stella" },
  ],
};

// ---------------- しれんのやま (つづらおりの さんどう) ----------------
DATA.maps.trialmt1 = {
  name: "しれんのやま さんどう",
  outdoor: true,
  bgm: "dungeon",
  encounter: "trialmt",
  legend: {
    "m": { tile: "mountain", solid: true },
    ".": { tile: "path" },
    "s": { tile: "stairs" },
  },
  rows: [
    "mmmmmmmmmmmmmmmm",
    "m....s.........m",
    "m.mmmmmmmmmmm..m",
    "m..............m",
    "m..mmmmmmmmmmmmm",
    "m..............m",
    "mmmmmmmmmmmmm..m",
    "m..............m",
    "m..mmmmmmmmmmmmm",
    "m..............m",
    "m..............m",
    "mmmmmmmmmmmmmmmm",
  ],
  events: [
    { x: 7, y: 10, type: "enter", warp: { map: "world", x: 15, y: 10, dir: "l" } },
    { x: 5, y: 1, type: "enter", warp: { map: "trialmt2", x: 7, y: 8, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "tm1", x: 1, y: 3, item: "xpotion" },
    { id: "tm2", x: 14, y: 9, gold: 3000 },
    { id: "tm3", x: 14, y: 1, item: "elixir", hidden: true },
  ],
};

DATA.maps.trialmt2 = {
  name: "しれんのやま さんちょう",
  outdoor: true,
  bgm: "dungeon",
  encounter: "trialmt",
  legend: {
    "m": { tile: "mountain", solid: true },
    ".": { tile: "path" },
    "s": { tile: "stairs" },
  },
  rows: [
    "mmmmmmmmmmmmmmmm",
    "m..............m",
    "m..mm......mm..m",
    "m..............m",
    "m..............m",
    "m..............m",
    "m..mm......mm..m",
    "m..............m",
    "m......s.......m",
    "mmmmmmmmmmmmmmmm",
  ],
  events: [
    { x: 7, y: 8, type: "enter", warp: { map: "trialmt1", x: 6, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "garon", x: 7, y: 4, spr: "gou", pal: "dark",
      script: [
        { cond: { flag: "garonBeat" },
          then: [{ msg: "けんおうガロン「よい こぶしだった……。\nおまえたちなら ほしの やみさえ\nうちはらえるだろう」" }],
          else: [
            { msg: "けんおうガロン「この やまの ちょうじょうで\nおれは さいきょうの あいてを\nまちつづけてきた」" },
            { msg: "「おまえたちから ただならぬ きはくを\nかんじる…… いざ、しょうぶ!!」" },
            { flag: ["garonSeen", 1] },
            { battle: { group: ["garon"], boss: true, music: "boss" } },
            { flag: ["garonBeat", 1] },
            { msg: "ガロン「……みごとだ。 おれの まけだ。\nこの つめを もっていけ。\nおまえたちの こぶしに たくそう」" },
            { give: { item: "w_garon" } },
            { give: { gold: 3000 } },
            { msg: "ごうけつのつめと 3000ギルを てにいれた!" },
          ] },
      ] },
  ],
  chests: [
    { id: "tm4", x: 1, y: 7, item: "a_hachimaki2", hidden: true },
  ],
};

// ---------------- かぜのしんでん ----------------
DATA.maps.windtemple = {
  name: "かぜのしんでん",
  bgm: "sky",
  encounter: "sky",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
  },
  rows: [
    "##################",
    "#................#",
    "#..############..#",
    "#................#",
    "#..###############",
    "#................#",
    "###############..#",
    "#................#",
    "#..###############",
    "#................#",
    "###############..#",
    "#................#",
    "#................#",
    "##################",
  ],
  events: [
    { x: 2, y: 12, type: "enter", warp: { map: "skyisland", x: 9, y: 9, dir: "d" } },
    { x: 1, y: 2, type: "enter", scriptId: "tempestFight" },
    { x: 2, y: 2, type: "enter", scriptId: "tempestFight" },
    { x: 15, y: 2, type: "enter", scriptId: "tempestFight" },
    { x: 16, y: 2, type: "enter", scriptId: "tempestFight" },
  ],
  npcs: [
    { id: "tempestnpc", x: 8, y: 1, spr: "bird", hideFlag: "skyBoss",
      script: [{ runScript: "tempestFight" }] },
    { id: "stargazer", x: 15, y: 12, spr: "elder",
      script: [
        { cond: { flag: "starGate" },
          then: [{ msg: "ほしよみの けんじゃ「ほしのわは ひらいた。\nそらのしまの ひがしの ひかりから\nほしのせかいへ わたるがよい」" }],
          else: [
            { cond: { flag: "allCrystals" },
              then: [
                { msg: "ほしよみの けんじゃ「4つの クリスタルの\nひかり…… ときは きたようじゃ」" },
                { msg: "けんじゃが ふるい ことばを となえると\nとおくの そらで ひかりのわが\nひらく おとが した……!" },
                { flag: ["starGate", 1] },
                { msg: "そらのしまの ひがしに ほしのわが\nあらわれた! (ほしのせかいへ いける)" },
              ],
              else: [{ msg: "ほしよみの けんじゃ「わしは ほしを よむもの。\n4つの クリスタルが そろうとき\nほしへの みちが ひらくじゃろう」" }] },
          ] },
      ] },
  ],
  chests: [
    { id: "wt1", x: 12, y: 1, item: "w_windspear" },
    { id: "wt2", x: 5, y: 1, item: "elixir", hidden: true },
    { id: "wt3", x: 1, y: 7, item: "a_sylph" },
    { id: "wt4", x: 16, y: 7, gold: 2500 },
  ],
};

// ---------------- うみのそこ ----------------
DATA.maps.seafloor = {
  name: "うみのそこ",
  outdoor: true,
  bgm: "sea",
  encounter: "sea",
  legend: {
    "m": { tile: "mountain", solid: true },
    "w": { tile: "water", solid: true },
    ".": { tile: "path" },
    "D": { tile: "icon_shrine" },
  },
  rows: [
    "mmmmmmmmmmmmmmmmmmmmmmmm",
    "m......................m",
    "m..ww.........ww.......m",
    "m..ww..........ww......m",
    "m......................m",
    "m.....ww......ww.......m",
    "m......................m",
    "m........D.............m",
    "m......................m",
    "m...ww.........ww......m",
    "m......................m",
    "m......................m",
    "m......................m",
    "mmmmmmmmmmmmmmmmmmmmmmmm",
  ],
  events: [
    { x: 3, y: 11, type: "enter", scriptId: "airshipBoard" },
    { x: 9, y: 7, type: "enter", warp: { map: "seatemple", x: 2, y: 12, dir: "u" } },
  ],
  npcs: [
    { id: "undinanpc", x: 18, y: 3, spr: "kraken", pal: "light",
      showFlag: "allCrystals", hideFlag: "undinaDown",
      script: [
        { msg: "うずしおが たかまき ひかりのけものが\nすがたを あらわす……! みずのげんじゅう ウンディナ!!" },
        { battle: { group: ["undina"], boss: true, music: "spirit" } },
        { flag: ["undinaDown", 1] },
        { msg: "ウンディナは しぶきとなって きえた。\nうずの なかから つえが うかびあがる。" },
        { give: { item: "w_undina" } },
        { msg: "うみなりのつえを てにいれた!" },
      ] },
  ],
  chests: [
    { id: "sea1", x: 22, y: 1, gold: 3000, hidden: true },
  ],
};

// ---------------- かいていしんでん ----------------
DATA.maps.seatemple = {
  name: "かいていしんでん",
  bgm: "sea",
  encounter: "sea",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
  },
  rows: [
    "##################",
    "#................#",
    "#..############..#",
    "#................#",
    "#..###############",
    "#................#",
    "###############..#",
    "#................#",
    "#..###############",
    "#................#",
    "###############..#",
    "#................#",
    "#................#",
    "##################",
  ],
  events: [
    { x: 2, y: 12, type: "enter", warp: { map: "seafloor", x: 9, y: 8, dir: "d" } },
    { x: 1, y: 2, type: "enter", scriptId: "leviaFight" },
    { x: 2, y: 2, type: "enter", scriptId: "leviaFight" },
    { x: 15, y: 2, type: "enter", scriptId: "leviaFight" },
    { x: 16, y: 2, type: "enter", scriptId: "leviaFight" },
  ],
  npcs: [
    { id: "levianpc", x: 8, y: 1, spr: "kraken", pal: "dark", hideFlag: "seaBoss",
      script: [{ runScript: "leviaFight" }] },
  ],
  chests: [
    { id: "st1", x: 12, y: 1, item: "w_trident" },
    { id: "st2", x: 5, y: 1, item: "elixir", hidden: true },
    { id: "st3", x: 1, y: 7, item: "a_abyss" },
    { id: "st4", x: 16, y: 7, gold: 3000 },
  ],
};

// ---------------- ほしのとう (さいしゅうしょう) ----------------
DATA.maps.startower1 = {
  name: "ほしのとう 1F",
  bgm: "last",
  encounter: "startower",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "S": { tile: "stairs" },
    "d": { tile: "door" },
  },
  rows: [
    "################",
    "#............S.#",
    "#..............#",
    "###########....#",
    "#..............#",
    "#....###########",
    "#..............#",
    "###########....#",
    "#..............#",
    "#..............#",
    "#..............#",
    "######dd########",
  ],
  events: [
    { x: 6, y: 11, type: "enter", warp: { map: "skyisland", x: 8, y: 3, dir: "d" } },
    { x: 7, y: 11, type: "enter", warp: { map: "skyisland", x: 8, y: 3, dir: "d" } },
    { x: 13, y: 1, type: "enter", warp: { map: "startower2", x: 12, y: 10, dir: "l" } },
  ],
  npcs: [],
  chests: [
    { id: "sw1a", x: 1, y: 1, item: "w_gigalance" },
    { id: "sw1b", x: 14, y: 8, item: "a_cosmos" },
    { id: "sw1c", x: 8, y: 4, item: "elixir", hidden: true },
  ],
};

DATA.maps.startower2 = {
  name: "ほしのとう 2F",
  bgm: "last",
  encounter: "startower",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "S": { tile: "stairs" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#.S............#",
    "#..............#",
    "#....###########",
    "#..............#",
    "###########....#",
    "#..............#",
    "#....###########",
    "#..............#",
    "#..............#",
    "#............s.#",
    "################",
  ],
  events: [
    { x: 13, y: 10, type: "enter", warp: { map: "startower1", x: 12, y: 1, dir: "l" } },
    { x: 2, y: 1, type: "enter", warp: { map: "startowertop", x: 7, y: 7, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "sw2a", x: 14, y: 4, item: "a_star" },
    { id: "sw2b", x: 1, y: 8, gold: 5000 },
  ],
};

DATA.maps.startowertop = {
  name: "ほしのとう さいじょうかい",
  bgm: "last",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "carpet" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#......s.......#",
    "################",
  ],
  events: [
    { x: 7, y: 7, type: "enter", warp: { map: "startower2", x: 2, y: 2, dir: "d" } },
  ],
  npcs: [
    { id: "voidosnpc", x: 7, y: 2, spr: "voidos", hideFlag: "trueClear",
      script: [{ runScript: "starFight" }] },
  ],
  chests: [],
};
for (let x = 1; x <= 14; x++) {
  DATA.maps.startowertop.events.push({ x, y: 4, type: "enter", scriptId: "starFight" });
}

// ---------------- まよいのもり ----------------
DATA.maps.lostwoods = {
  name: "まよいのもり",
  bgm: "dungeon",
  encounter: "lostwoods",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
  },
  rows: [
    "fffffffffff",
    "f.........f",
    "f.........f",
    "f.........f",
    "f.........f",
    "f.........f",
    "f.........f",
    "f.........f",
    "f.........f",
    "f.........f",
    "fffffffffff",
  ],
  events: [
    { x: 5, y: 1, type: "enter", scriptId: "lwNorth" },
    { x: 1, y: 5, type: "enter", scriptId: "lwWest" },
    { x: 9, y: 5, type: "enter", scriptId: "lwWrong" },
    { x: 5, y: 9, type: "enter", warp: { map: "world", x: 5, y: 25, dir: "d" } },
  ],
  npcs: [
    { id: "lwstone", x: 3, y: 7, spr: "crystal",
      script: [
        { msg: "いしぶみ「とりのこえを おえ……。\nきた、にし、きた と\nふるいうたは うたう」" },
      ] },
  ],
  chests: [],
};

DATA.maps.lostwoods2 = {
  name: "もりのおくち",
  bgm: "shrine",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
  },
  rows: [
    "fffffffffffff",
    "f...........f",
    "f...........f",
    "f...........f",
    "f...........f",
    "f...........f",
    "f...........f",
    "f...........f",
    "f...........f",
    "fffffffffffff",
  ],
  events: [
    { x: 6, y: 8, type: "enter", warp: { map: "world", x: 5, y: 25, dir: "d" } },
    { x: 5, y: 3, type: "enter", scriptId: "treantFight" },
    { x: 6, y: 3, type: "enter", scriptId: "treantFight" },
    { x: 7, y: 3, type: "enter", scriptId: "treantFight" },
  ],
  npcs: [
    { id: "treantnpc", x: 6, y: 2, spr: "treant", hideFlag: "forestBoss",
      script: [{ runScript: "treantFight" }] },
  ],
  chests: [
    { id: "lw1", x: 2, y: 1, item: "a_fairy" },
    { id: "lw2", x: 10, y: 1, gold: 2000 },
    { id: "lw3", x: 6, y: 1, item: "elixir", hidden: true },
  ],
};

// ---------------- きょうつうスクリプト ----------------
DATA.scripts = {
  magmaFight: [
    { cond: { flag: "magmaBoss" },
      then: [],
      else: [
        { msg: "ようがんが うずをまき……\nじひびきとともに マグマウォームが\nはいあがってきた!!" },
        { battle: { group: ["magmaworm"], boss: true, music: "boss" } },
        { flag: ["magmaBoss", 1] },
        { msg: "おおあなの そこに しずけさが もどった。\nおくには かたく とざされた\nおおとびらが みえる……。" },
      ] },
  ],
  sealedDoor: [
    { cond: { flag: "magmaBoss" },
      then: [
        { cond: { flag: "underOpen" },
          then: [{ warp: { map: "underworld", x: 3, y: 1, dir: "d" } }],
          else: [
            { msg: "クリスタルが まばゆく かがやき……\nおおとびらが ゆっくりと ひらいた!!" },
            { flag: ["underOpen", 1] },
            { msg: "とびらのむこうに、あかく ひかる\nひろがりが みえる。\n―― だい2しょう ちていへん ――" },
            { warp: { map: "underworld", x: 3, y: 1, dir: "d" } },
          ] },
      ],
      else: [{ msg: "ちていへ つづく おおとびら……\nふしぎな ちからで とざされている。" }] },
  ],
  // まよいのもり: ただしいじゅんろは きた→にし→きた
  lwNorth: [
    { cond: { flag: "lwA" },
      then: [
        { cond: { flag: "lwB" },
          then: [
            // 3ばんめ: きた → ゴール
            { flag: ["lwA", 0] },
            { flag: ["lwB", 0] },
            { msg: "きりが はれていく……!\nもりの おくちに たどりついた!" },
            { warp: { map: "lostwoods2", x: 6, y: 7, dir: "u" } },
          ],
          else: [
            // 2ばんめに きた は まちがい
            { flag: ["lwA", 0] },
            { msg: "とりのこえが とおざかる……。\nきりに まかれて もどされた!" },
            { warp: { map: "lostwoods", x: 5, y: 8, dir: "u" } },
          ] },
      ],
      else: [
        // 1ばんめ: きた ✓
        { flag: ["lwA", 1] },
        { msg: "どこかで とりのこえが きこえる……" },
        { warp: { map: "lostwoods", x: 5, y: 5, dir: "u" } },
      ] },
  ],
  lwWest: [
    { cond: { flag: "lwA" },
      then: [
        { cond: { flag: "lwB" },
          then: [
            { flag: ["lwA", 0] },
            { flag: ["lwB", 0] },
            { msg: "とりのこえが とおざかる……。\nきりに まかれて もどされた!" },
            { warp: { map: "lostwoods", x: 5, y: 8, dir: "u" } },
          ],
          else: [
            // 2ばんめ: にし ✓
            { flag: ["lwB", 1] },
            { msg: "とりのこえが ちかづいてきた……!" },
            { warp: { map: "lostwoods", x: 5, y: 5, dir: "u" } },
          ] },
      ],
      else: [
        { msg: "とりのこえが とおざかる……。\nきりに まかれて もどされた!" },
        { warp: { map: "lostwoods", x: 5, y: 8, dir: "u" } },
      ] },
  ],
  lwWrong: [
    { flag: ["lwA", 0] },
    { flag: ["lwB", 0] },
    { msg: "とりのこえが とおざかる……。\nきりに まかれて もどされた!" },
    { warp: { map: "lostwoods", x: 5, y: 8, dir: "u" } },
  ],
  treantFight: [
    { cond: { flag: "forestBoss" },
      then: [],
      else: [
        { msg: "こだいじゅが めをさました……!\nもりのぬし トレントが\nえだを ふりあげる!!" },
        { battle: { group: ["treant"], boss: true, music: "boss" } },
        { flag: ["forestBoss", 1] },
        { msg: "もりが しずかに ざわめいた。\nどこかで とりが ないている。" },
      ] },
  ],
  arenaEntry: [
    { msg: "うけつけ「ソレイユとうぎじょうへ ようこそ!\n3れんせんを かちぬけば しょうきんだ。\nランクを えらびな!」" },
    { menu: { options: [
      { label: "ブロンズ300G", ops: [
        { payGold: { amount: 300,
          ok: [
            { msg: "うけつけ「ブロンズランク かいし!!」" },
            { battle: { group: ["skeleton", "skeleton"], boss: true } },
            { battle: { group: ["wizard", "gargoyle"], boss: true } },
            { battle: { group: ["golem"], boss: true } },
            { msg: "うけつけ「みごとな かちっぷりだ!\nしょうきんと しょうひんを うけとりな!」" },
            { give: { gold: 800 } },
            { give: { item: "hipotion" } },
            { msg: "800ギルと ハイポーションを てにいれた!" },
            { flag: ["arenaBronze", 1] },
          ],
          ng: [{ msg: "うけつけ「おかねが たりないよ!」" }] } },
      ] },
      { label: "シルバー1000G", ops: [
        { payGold: { amount: 1000,
          ok: [
            { msg: "うけつけ「シルバーランク かいし!!」" },
            { battle: { group: ["frostgar", "icebat", "icebat"], boss: true } },
            { battle: { group: ["sludge", "waterelem"], boss: true } },
            { battle: { group: ["flamedemon", "firelizard"], boss: true } },
            { msg: "うけつけ「つよい! しょうきんだ!」" },
            { give: { gold: 2500 } },
            { give: { item: "elixir" } },
            { msg: "2500ギルと エリクサーを てにいれた!" },
            { flag: ["arenaSilver", 1] },
          ],
          ng: [{ msg: "うけつけ「おかねが たりないよ!」" }] } },
      ] },
      { label: "ゴールド3000G", ops: [
        { payGold: { amount: 3000,
          ok: [
            { msg: "うけつけ「ゴールドランク……\nいのちの ほしょうは しないよ!!」" },
            { battle: { group: ["darkknight", "darksoldier", "darksoldier"], boss: true } },
            { battle: { group: ["deathknight", "shadowbeast"], boss: true } },
            { battle: { group: ["arcdemon", "voidgolem"], boss: true } },
            { msg: "うけつけ「しんじられない……\nあんたたちが チャンピオンだ!!」" },
            { give: { gold: 8000 } },
            { give: { item: "elixir" } },
            { give: { item: "a_champ" } },
            { msg: "8000ギルと エリクサー、そして\nチャンピオンベルトを てにいれた!!" },
            { flag: ["arenaGold", 1] },
          ],
          ng: [{ msg: "うけつけ「おかねが たりないよ!」" }] } },
      ] },
      { label: "やめる", ops: [] },
    ] } },
  ],
  airshipBoard: [
    { cond: { flag: "airship" },
      then: [
        { msg: "ひこうせんに のりこんだ!\nどこへ とぶ?" },
        { cond: { flag: "submarine" },
          then: [
            { menu: { options: [
              { label: "バロンじょう", ops: [{ warp: { map: "world", x: 7, y: 27, dir: "d" } }] },
              { label: "ミストのむら", ops: [{ warp: { map: "world", x: 27, y: 23, dir: "d" } }] },
              { label: "ソレイユ",     ops: [{ warp: { map: "port", x: 10, y: 7, dir: "u" } }] },
              { label: "そらのしま",   ops: [{ warp: { map: "skyisland", x: 3, y: 9, dir: "d" } }] },
              { label: "うみのそこ",   ops: [{ warp: { map: "seafloor", x: 3, y: 11, dir: "d" } }] },
            ] } },
          ],
          else: [
            { menu: { options: [
              { label: "バロンじょう", ops: [{ warp: { map: "world", x: 7, y: 27, dir: "d" } }] },
              { label: "ミストのむら", ops: [{ warp: { map: "world", x: 27, y: 23, dir: "d" } }] },
              { label: "ソレイユ",     ops: [{ warp: { map: "port", x: 10, y: 7, dir: "u" } }] },
              { label: "そらのしま",   ops: [{ warp: { map: "skyisland", x: 3, y: 9, dir: "d" } }] },
            ] } },
          ] },
      ],
      else: [{ msg: "おきに ふるびた ひこうせんが\nういている。うごきそうにない。" }] },
  ],
  lunavoraFight: [
    { cond: { flag: "craterBoss" },
      then: [],
      else: [
        { msg: "だいちが ゆれている……。\nクレーターの ぬしが めをさました!!" },
        { battle: { group: ["lunavora"], boss: true, music: "boss" } },
        { flag: ["craterBoss", 1] },
        { msg: "ぬしは ほしのちりとなって きえた。\nだいちに しずけさが もどっていく。" },
        { give: { gold: 5000 } },
        { msg: "ぬしの すみかから 5000ギルを みつけた!\nセレーネの ちょうろうに ほうこくしよう。" },
      ] },
  ],
  starFight: [
    { cond: { flag: "trueClear" },
      then: [],
      else: [
        { msg: "ヴォイドス「ようこそ ほしのとうへ……。\nザルバも おうも わしの ゆびさきに\nすぎなかったと しれ」" },
        { msg: "レオン「すべての げんきょうは おまえか!\nみんな、クリスタルに いのりを!」" },
        { msg: "4つのクリスタルが きょうめいし\nパーティを ひかりが つつんだ!!" },
        { battle: { group: ["voidos"], boss: true, music: "last" } },
        { flag: ["trueClear", 1] },
        { msg: "ヴォイドスは ほしくずとなって\nよぞらに きえていった……。" },
        { warp: { map: "castle", x: 9, y: 3, dir: "u" } },
        { msg: "バロンおう「すべて おわったのだな……。\nレオン、そなたらは このくにの\nいや、せかいの きゅうせいしゅだ」" },
        { msg: "セリア「ながい たびだったわね」\nロッド「けんきゅうざいりょうは\nたっぷり あつまったぜ」" },
        { msg: "ゴウ「うでが なっちまうな!」\nグレン「なあ レオン、つぎは どこへ\nとぶ?」" },
        { msg: "レオン「……そうだな。クリスタルの\nひかりが とどく かぎり、どこへでも」" },
        { ending: true },
      ] },
  ],
  leviaFight: [
    { cond: { flag: "seaBoss" },
      then: [],
      else: [
        { msg: "うみが うねり くらやみの そこから\nしんかいのぬし リヴァイアが\nうかびあがってきた!!" },
        { battle: { group: ["levia"], boss: true, music: "boss" } },
        { flag: ["seaBoss", 1] },
        { msg: "しずかになった さいだんに\nあおい けっしょうが ゆらめいている。" },
        { give: { item: "watercrystal" } },
        { flag: ["waterCrystal", 1] },
        { msg: "みずのクリスタルを てにいれた!!" },
        { msg: "4つのクリスタルが きょうめいし……\nそらたかく こだいのとう\n『ほしのとう』が すがたをあらわした!!" },
        { flag: ["allCrystals", 1] },
        { msg: "―― さいしゅうしょう ――\nほしのとうが そらのしまの きたに\nあらわれた。すべての けつまつへ……" },
      ] },
  ],
  tempestFight: [
    { cond: { flag: "skyBoss" },
      then: [],
      else: [
        { msg: "テンペスト「クエーッ!!\nわが そらを みだすものよ……\nあらしの えじきと なれい!!」" },
        { battle: { group: ["tempest"], boss: true, music: "boss" } },
        { flag: ["skyBoss", 1] },
        { msg: "あらしが やみ、さいだんに\nみどりいろの けっしょうが あらわれた。" },
        { give: { item: "windcrystal" } },
        { flag: ["windCrystal", 1] },
        { msg: "かぜのクリスタルを てにいれた!!" },
        { msg: "のこるは みずのクリスタル……。\nふかき うみのそこが よんでいる。\n―― だい4しょうへ つづく ――" },
      ] },
  ],
  meteoFight: [
    { cond: { flag: "meteorDown" },
      then: [],
      else: [
        { msg: "いわが うごきだした……!?\nいんせきのばんにんが しんでんへの\nみちを ふさいでいる!!" },
        { battle: { group: ["meteogolem"], boss: true, music: "boss" } },
        { flag: ["meteorDown", 1] },
        { msg: "ばんにんが くだけると ともに\nいんせきの けっかいが きえていく……!" },
      ] },
  ],
  templeEnter: [
    { cond: { flag: "meteorDown" },
      then: [{ warp: { map: "temple", x: 2, y: 12, dir: "u" } }],
      else: [{ msg: "ちていしんでん……。\nいんせきの けっかいに つつまれていて\nはいれない。" }] },
  ],
  gladFight: [
    { cond: { flag: "templeBoss" },
      then: [],
      else: [
        { msg: "グラード「よくぞ ここまできた\nちじょうの ものども……。\nちのクリスタルは わたさぬ!!」" },
        { battle: { group: ["glad"], boss: true, music: "boss" } },
        { flag: ["templeBoss", 1] },
        { msg: "さいだんの おくで だいちいろの\nけっしょうが かがやいている……。" },
        { give: { item: "earthcrystal" } },
        { flag: ["earthCrystal", 1] },
        { msg: "ちのクリスタルを てにいれた!!" },
        { msg: "のこる クリスタルは あと2つ……。\nものがたりは だい3しょうへ つづく。" },
      ] },
  ],
  wwWarn: [
    { cond: { flag: "wwWarned" },
      then: [],
      else: [
        { msg: "いしぶみ「このさき すいろの ぬし あり。\nそなえ なきものは ひきかえすべし」" },
        { flag: ["wwWarned", 1] },
      ] },
  ],
  krakenFight: [
    { cond: { flag: "waterBoss" },
      then: [],
      else: [
        { msg: "すいめんが さかまき……\nすいろの ぬし クラーケンが\nすがたを あらわした!!" },
        { battle: { group: ["kraken"], boss: true, music: "boss" } },
        { flag: ["waterBoss", 1] },
        { msg: "すいろに しずけさが もどった。" },
      ] },
  ],
  vahaFight: [
    { cond: { flag: "superBoss" },
      then: [],
      else: [
        { msg: "こおりの おくで くろい りゅうが\nめを ひらいた……。" },
        { msg: "ヴァハ「ヴォイドスを ほろぼした\nちからを もつもの……。\nわが しんえんに いどむか?」" },
        { battle: { group: ["vaha"], boss: true, music: "boss" } },
        { flag: ["superBoss", 1] },
        { msg: "ヴァハ「……みごとだ。\nおまえたちこそ しんの\nクリスタルナイツ で ある」" },
        { give: { item: "w_kingclaw" } },
        { msg: "りゅうおうのつめを てにいれた!!\nすべてを やりとげた あなたは\nまさしく でんせつの ゆうしゃだ!" },
      ] },
  ],
  iceDragon: [
    { cond: { flag: "iceBoss" },
      then: [],
      else: [
        { msg: "フロストドラゴン\n「グルルル…… ここは わしの ねぐら。\nこおりの はかに うまりたいものから\nかかってくるがいい」" },
        { battle: { group: ["frostdragon"], boss: true, music: "boss" } },
        { flag: ["iceBoss", 1] },
        { msg: "どうくつの おくで なにかが\nひかっている……!" },
      ] },
  ],
  intro: [
    { msg: "バロンおう「あんこくきし レオンよ。\nミストのむらの ちょうろうがもつ\nクリスタルを うばってくるのだ」" },
    { msg: "レオン「……なぜ クリスタルを?\nミストのむらは へいわな むらです」" },
    { msg: "バロンおう「たみを まもるためだ。\nゆけ! これは めいれいだ!!」" },
    { msg: "レオン(……おうは かわられた。\nだが きしである わたしに\nめいれいに そむくことは できぬ……)" },
    { msg: "グレン「まて レオン! オレも いくぜ。\nしんゆうを ひとりで\nいかせられるかよ」" },
    { join: "glen" },
    { msg: "りゅうきしグレンが なかまに くわわった!" },
    { flag: ["intro", 1] },
  ],
  zarbaFight: [
    { cond: { flag: "clear" },
      then: [],
      else: [
        { msg: "ザルバ「よくぞきた パラディンよ……。\nバロンのおうは よくできた\nあやつりにんぎょうだったぞ?」" },
        { msg: "レオン「ザルバ!! おうのこころを\nもてあそんだ つみ……\nこの せいけんで つぐなわせる!」" },
        { battle: { group: ["zarba"], boss: true, music: "boss" } },
        { flag: ["clear", 1] },
        { msg: "ザルバは ちりとなって きえた……。\nクリスタルが やさしく かがやく。" },
        { warp: { map: "castle", x: 9, y: 3, dir: "u" } },
        { msg: "バロンおう「……レオン…… わしは\nなんということを……。 ゆるしてくれ」" },
        { msg: "レオン「おうよ、かおを あげてください。\nすべては ザルバの しわざ。\nミストのむらとの わかいを」" },
        { msg: "セリア「これで みんな もとどおりね」" },
        { msg: "ロッド「オレの けんきゅうも\nこれにて かんりょう、っとね」" },
        { msg: "こうして クリスタルのひかりは\nせかいに もどった。\nでんせつは かたりつがれていく……。" },
        { msg: "……だが そのよる、みなみの だいちに\nあかい ひかりが はしったという。\nぼうけんは まだ おわらない――" },
        { ending: true },
      ] },
  ],
};

// まてんろう さいじょうかい: ボスのまえに 1れつ ぜんぶ トリガーを しく
for (let x = 1; x <= 14; x++) {
  DATA.maps.towertop.events.push({ x, y: 4, type: "enter", scriptId: "zarbaFight" });
}

// はじめてゲームをはじめたときの状態
DATA.newGame = {
  map: "castle", x: 9, y: 4, dir: "u",
  gold: 100,
  items: { potion: 3 },
  party: ["leon"],
  runScript: "intro",
};
