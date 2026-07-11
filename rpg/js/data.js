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
  w_claw:    { name: "てつのつめ",     kind: "weapon", price: 200, atk: 6,  who: ["gou"] },
  w_ironclaw:{ name: "タイガークロー", kind: "weapon", price: 700, atk: 13, who: ["gou"] },
  w_thunderclaw: { name: "かみなりのつめ", kind: "weapon", price: 1400, atk: 16, who: ["gou"], elem: "thunder" },
  w_boltstaff: { name: "いかずちのつえ", kind: "weapon", price: 1600, atk: 10, int: 4, who: ["rod"] },

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
  a_sage:    { name: "けんじゃのローブ", kind: "armor", price: 2200, def: 13, int: 3, who: ["rod", "celia"] },

  crystal:   { name: "クリスタル",     kind: "key", price: 0, desc: "せいなる ひかりを やどす" },
  glowstone: { name: "かがやくいし",   kind: "key", price: 0, desc: "おおあなのそこで ひろった いし" },
  earthcrystal: { name: "ちのクリスタル", kind: "key", price: 0, desc: "だいちのちからを やどす けっしょう" },
  windcrystal: { name: "かぜのクリスタル", kind: "key", price: 0, desc: "あらしのちからを やどす けっしょう" },
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
    learn: { 4: "poisona", 6: "protect", 9: "cure2", 10: "esuna", 12: "raise" },
  },
  rod: {
    name: "ロッド", cls: "くろまどうし", spr: "rod", row: "back",
    base:   { hp: 27, mp: 22, str: 5, agi: 7, vit: 5, int: 13 },
    growth: { hp: 6, mp: 6, str: 1, agi: 1, vit: 1, int: 3 },
    weapon: "w_staff", armor: "a_cloth",
    spells: ["fire1"],
    learn: { 4: "ice1", 6: "bolt1", 9: "fire2", 12: "ice2" },
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
    hp: 340, atk: 28, def: 12, agi: 10, exp: 300, gold: 500,
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
    hp: 450, atk: 30, def: 12, agi: 11, exp: 450, gold: 800,
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
    hp: 1100, atk: 42, def: 18, agi: 16, exp: 1800, gold: 2200,
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
    hp: 700, atk: 38, def: 20, agi: 6, exp: 900, gold: 1200,
    resist: ["fire", "ice"],
    acts: [{ spell: "e_quake", rate: 0.3 }] },
  glad: { name: "ちていのまじん グラード", spr: "demon", pal: "light", boss: true, scale: 4,
    hp: 900, atk: 38, def: 16, agi: 12, exp: 1200, gold: 1500,
    race: "demon", resist: ["fire"],
    acts: [{ spell: "e_quake", rate: 0.25 }, { spell: "e_silence", rate: 0.2 }, { spell: "e_fire2", rate: 0.2 }] },
  magmaworm: { name: "マグマウォーム", spr: "worm", boss: true, scale: 4,
    hp: 600, atk: 34, def: 14, agi: 10, exp: 700, gold: 1000,
    absorb: ["fire"],
    acts: [{ spell: "e_eruption", rate: 0.3 }, { spell: "e_fire2", rate: 0.2 }] },

  // ボスは 8ばい弱点で とけないよう たいせい/きゅうしゅう ちゅうしん。
  // れいがい: ザルバ しんのすがた だけ せい属性が じゃくてん (せいけんが きめて)
  demonguard: { name: "デーモンガード", spr: "demon", boss: true, scale: 3,
    hp: 170, atk: 15, def: 5, agi: 6, exp: 90, gold: 150,
    race: "demon", absorb: ["ice"],
    acts: [{ spell: "e_ice_all", rate: 0.35 }] },
  shadow: { name: "あんこくのかげ", spr: "hero_d", pal: "dark", boss: true, scale: 3, trial: true,
    hp: 999, atk: 17, def: 99, agi: 7, exp: 0, gold: 0 },
  zarba: { name: "まおうザルバ", spr: "zarba", boss: true, scale: 3,
    hp: 400, atk: 24, def: 8, agi: 9, exp: 0, gold: 0,
    race: "demon", resist: ["fire", "ice"],
    acts: [{ spell: "e_fire2", rate: 0.3 }], phase2: "zarba2" },
  zarba2: { name: "ザルバ しんのすがた", spr: "zarba", pal: "dark", boss: true, scale: 4,
    hp: 1200, atk: 30, def: 10, agi: 12, exp: 0, gold: 0,
    race: "demon", weak: ["holy"], absorb: ["fire"],
    acts: [{ spell: "e_meteo", rate: 0.3 }, { spell: "e_ice_all", rate: 0.2 }] },
};

// ---------------- エンカウントテーブル ----------------
DATA.encounters = {
  plains_w: { rate: 1 / 15, groups: [["goblin"], ["goblin", "goblin"], ["bat", "bat"], ["toad", "goblin"]] },
  plains_e: { rate: 1 / 14, groups: [["goblin", "goblin", "bat"], ["toad", "toad"], ["skeleton"], ["wizard", "bat"]] },
  north:    { rate: 1 / 13, groups: [["skeleton", "skeleton"], ["wizard", "wizard"], ["gargoyle"], ["skeleton", "wizard"]] },
  cave:     { rate: 1 / 13, groups: [["bat", "bat"], ["skeleton"], ["toad", "toad", "bat"], ["skeleton", "bat", "bat"]] },
  shrine:   { rate: 1 / 13, groups: [["skeleton", "skeleton"], ["gargoyle", "wizard"], ["gargoyle", "gargoyle"]] },
  tower:    { rate: 1 / 12, groups: [["ddemon"], ["golem"], ["gargoyle", "gargoyle", "wizard"], ["ddemon", "wizard"]] },
  icecave:  { rate: 1 / 13, groups: [["icegoblin", "icegoblin"], ["icebat", "icebat", "icegoblin"], ["frostwiz", "icebat"], ["frostgar"], ["babydragon"], ["frostwiz", "frostwiz"]] },
  waterway: { rate: 1 / 13, groups: [["mudtoad", "mudtoad"], ["sewerbat", "sewerbat", "sewerbat"], ["waterelem", "sewerbat"], ["sludge"], ["waterelem", "waterelem"], ["sludge", "mudtoad"]] },
  magma:    { rate: 1 / 13, groups: [["flamegoblin", "flamegoblin"], ["firelizard"], ["flamewiz", "flamegoblin"], ["magmagolem"], ["flamedemon"], ["firelizard", "flamewiz"]] },
  underworld: { rate: 1 / 14, groups: [["darkknight"], ["darksoldier", "darksoldier"], ["flamedemon", "darksoldier"], ["firelizard", "firelizard"], ["magmagolem", "flamewiz"], ["darkknight", "darksoldier"]] },
  temple:   { rate: 1 / 13, groups: [["darkpriest", "darkpriest"], ["guardian"], ["deathknight"], ["shadowbeast", "darkpriest"], ["deathknight", "shadowbeast"], ["guardian", "darkpriest"]] },
  sky:      { rate: 1 / 14, groups: [["stormbird"], ["harpy", "harpy"], ["stormbird", "harpy"], ["skydragon"], ["winddemon"], ["winddemon", "harpy"]] },
};

// ---------------- ショップ ----------------
DATA.shops = {
  muspel: {
    name: "ムスペルのかじば",
    stock: ["hipotion", "ether", "elixir", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "w_iceblade", "w_halberd", "w_battleclaw", "w_sagestaff", "w_spiritrod",
            "a_dwarf", "a_sage"],
  },
  port: {
    name: "ソレイユのみせ",
    stock: ["potion", "hipotion", "ether", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "w_flame", "w_lance", "w_thunderclaw", "w_crystalrod",
            "a_aqua", "a_ice"],
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
    "M": { tile: "icon_shrine" },
    "X": { tile: "icon_tower" },
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
    "ww.....f........mmmm....ff........wwwwww",
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
    "ww..fff.........mmmm..f...........wwwwww",
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
        { cond: { flag: "clear" },
          then: [{ msg: "へいし「レオンさま ばんざい!\nパラディン ばんざい!」" }],
          else: [{ msg: "へいし「にしのどうくつを ぬければ\nミストのむらへ いけます」" }] },
      ] },
    { id: "guard2", x: 11, y: 9, spr: "soldier",
      script: [
        { cond: { flag: "paladin" },
          then: [{ msg: "へいし「おうさまの ようすが\nあきらかに おかしい……。\nきたのとうに なにかあるのでは……」" }],
          else: [{ msg: "へいし「さいきん おうさまは\nひとが かわってしまわれた……」" }] },
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
        { cond: { flag: "paladin" },
          then: [{ msg: "むらびと「おお ひかりのきしさま!\nどうか ザルバを たおしてくだされ!」" }],
          else: [{ msg: "むらびと「さいきん モンスターが\nふえたのう。おちおち はたけにも\nいけんわい」" }] },
      ] },
    { id: "vil2", x: 14, y: 12, spr: "villager", wander: true,
      script: [
        { msg: "むらびと「きたのほこらには\n『こころのかがみ』が あるそうじゃ。\nみたものの こころを うつすとか」" },
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
        { msg: "せんいん「よう! ここは みなとまち\nソレイユ。うみの むこうで よなよな\nあかい ひかりが みえるんだ」" },
        { msg: "せんいん「ちていに つづく おおあなが\nひらいたって うわさも ある。\nいやな よかんが するぜ……」" },
      ] },
    { id: "obaba", x: 5, y: 6, spr: "villager", wander: true,
      script: [
        { msg: "おばあさん「さんばしの さきっぽで\nなにかが ひかったのを みたんだよ。\nしらべてみたら どうだい?」" },
      ] },
    { id: "merchant", x: 14, y: 6, spr: "villager", wander: true,
      script: [
        { msg: "しょうにん「ソレイユのみせは\nミストより いいものぞろいだよ!\nぜひ みていっとくれ」" },
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
  },
  rows: [
    "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    "m............................m",
    "m..mm....wwwww......mmm......m",
    "m..mm....wwwww......mmm......m",
    "m............................m",
    "m.....mm...........www.......m",
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
  ],
  chests: [
    { id: "uw1", x: 28, y: 1, gold: 1500, hidden: true },
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
        { msg: "ドワーフ「ようこそ ムスペルへ!\nちじょうの ひとが くるのは\nひさしぶりだべ」" },
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
  bgm: "shrine",
  encounter: "sky",
  legend: {
    "w": { tile: "water", solid: true },
    "m": { tile: "mountain", solid: true },
    ".": { tile: "grass" },
    "D": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwww",
    "wwww........wwwwwwwwwwww",
    "ww............wwwwwwwwww",
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
  ],
  npcs: [],
  chests: [
    { id: "sky1", x: 17, y: 7, gold: 2500, hidden: true },
  ],
};

// ---------------- かぜのしんでん ----------------
DATA.maps.windtemple = {
  name: "かぜのしんでん",
  bgm: "shrine",
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
  ],
  chests: [
    { id: "wt1", x: 12, y: 1, item: "w_windspear" },
    { id: "wt2", x: 5, y: 1, item: "elixir", hidden: true },
    { id: "wt3", x: 1, y: 7, item: "a_sylph" },
    { id: "wt4", x: 16, y: 7, gold: 2500 },
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
  airshipBoard: [
    { cond: { flag: "airship" },
      then: [
        { msg: "ひこうせんに のりこんだ!\nどこへ とぶ?" },
        { menu: { options: [
          { label: "バロンじょう", ops: [{ warp: { map: "world", x: 7, y: 27, dir: "d" } }] },
          { label: "ミストのむら", ops: [{ warp: { map: "world", x: 27, y: 23, dir: "d" } }] },
          { label: "ソレイユ",     ops: [{ warp: { map: "port", x: 10, y: 7, dir: "u" } }] },
          { label: "そらのしま",   ops: [{ warp: { map: "skyisland", x: 3, y: 9, dir: "d" } }] },
        ] } },
      ],
      else: [{ msg: "おきに ふるびた ひこうせんが\nういている。うごきそうにない。" }] },
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
