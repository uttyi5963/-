// ============================================================
// クリスタルナイツ - ゲームデータ定義
// マップ / モンスター / アイテム / 魔法 / イベント
// ============================================================

const DATA = {};

// ---------------- 呪文 ----------------
// type: 'dmg'(攻撃) 'heal'(回復) 'revive' 'cure'(状態) 'buff'
// cast: 詠唱時間(びょう)。0または省略で即時発動
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
  // じょうい魔法 (レベル15いこうで しゅうとく)
  fire3:   { name: "ファイガ",   mp: 22, type: "dmg", pow: 140, cast: 2.6, elem: "fire",    target: "enemy" },
  ice3:    { name: "ブリザガ",   mp: 26, type: "dmg", pow: 165, cast: 2.8, elem: "ice",     target: "enemy" },
  bolt3:   { name: "サンダガ",   mp: 30, type: "dmg", pow: 190, cast: 3.0, elem: "thunder", target: "enemy" },
  flare:   { name: "フレア", fx: "flare",     mp: 48, type: "dmg", pow: 320, cast: 4.0, elem: "none",    target: "enemy" },
  cure3:   { name: "ケアルガ",   mp: 20, type: "heal", pow: 220, cast: 1.8, target: "ally",  field: true },
  rain:    { name: "癒しのあめ", mp: 32, type: "heal", pow: 110, cast: 2.2, target: "ally", all: true, field: true },
  saint:   { name: "セイントレイ", mp: 40, type: "dmg", pow: 260, cast: 3.4, elem: "holy",  target: "enemy" },
  drain:   { name: "ドレイン",   mp: 12, type: "dmg", pow: 60,  cast: 1.4, elem: "none",  target: "enemy", drain: true },
  quake:   { name: "クエイク", fx: "quake",   mp: 34, type: "dmg", pow: 120, cast: 3.0, elem: "none",  target: "enemy", all: true },
  protect2: { name: "プロテガ",  mp: 24, type: "buff", cast: 2.0, target: "ally", all: true },
  haste:    { name: "ヘイスト",  mp: 18, type: "buff", buff: "haste", cast: 1.2, target: "ally" },
  // てきせんよう
  e_fire:  { name: "ファイア",   mp: 0, type: "dmg", pow: 16, cast: 1.2, elem: "fire",    target: "enemy" },
  e_ice_all:{ name: "つめたいいき", mp: 0, type: "dmg", pow: 15, elem: "ice",  target: "enemy", all: true },
  e_fire2: { name: "ファイラ",   mp: 0, type: "dmg", pow: 40, cast: 2.2, elem: "fire",    target: "enemy" },
  e_meteo: { name: "ダークメテオ", fx: "flare", mp: 0, type: "dmg", pow: 48, cast: 3.2, elem: "none",  target: "enemy", all: true },
  e_toad:  { name: "カエルのうた", mp: 0, type: "status", status: "toad",    cast: 1.5, target: "enemy" },
  e_silence:{ name: "沈黙のかぜ", mp: 0, type: "status", status: "silence", cast: 1.2, target: "enemy" },
  e_ice:   { name: "ブリザド",     mp: 0, type: "dmg", pow: 20, cast: 1.2, elem: "ice", target: "enemy" },
  e_breath:{ name: "氷のブレス", mp: 0, type: "dmg", pow: 30, cast: 2.5, elem: "ice", target: "enemy", all: true },
  e_wave:  { name: "おおつなみ",   mp: 0, type: "dmg", pow: 35, cast: 2.8, elem: "ice", target: "enemy", all: true },
  e_ink:   { name: "すみはき",     mp: 0, type: "status", status: "blind", cast: 1.0, target: "enemy" },
  e_eruption: { name: "ふんか",    mp: 0, type: "dmg", pow: 40, cast: 3.0, elem: "fire", target: "enemy", all: true },
  e_bolt:  { name: "サンダー",     mp: 0, type: "dmg", pow: 22, cast: 1.2, elem: "thunder", target: "enemy" },
  e_quake: { name: "じしん", fx: "quake",       mp: 0, type: "dmg", pow: 45, cast: 3.0, elem: "none", target: "enemy", all: true },
  e_gale:  { name: "かまいたち",   mp: 0, type: "dmg", pow: 30, cast: 1.5, elem: "none", target: "enemy" },
  e_tornado: { name: "たつまき",   mp: 0, type: "dmg", pow: 50, cast: 3.4, elem: "none", target: "enemy", all: true },
  e_bolt2: { name: "稲妻",     mp: 0, type: "dmg", pow: 45, cast: 2.0, elem: "thunder", target: "enemy" },
  e_bigwave: { name: "だいかいしょう", mp: 0, type: "dmg", pow: 55, cast: 3.5, elem: "ice", target: "enemy", all: true },
  e_starfall: { name: "星くずのあめ", fx: "flare", mp: 0, type: "dmg", pow: 60, cast: 3.8, elem: "none", target: "enemy", all: true },
};

// 状態異常
// 必殺技 (リミットゲージ100%で はつどう。レベルで しゅうとく)
DATA.limits = {
  leon: [
    { lv: 10, id: "l_cross",  name: "クロスブレイク",     kind: "phys",      mult: 2.5, target: "one" },
    { lv: 30, id: "l_shine",  name: "シャインウェーブ",   kind: "phys",      mult: 2.0, target: "all", elem: "holy" },
    { lv: 55, id: "l_sacred", name: "セイクリッドエッジ", kind: "phys",      mult: 4.0, target: "one", selfheal: 0.25 },
  ],
  glen: [
    { lv: 10, id: "l_spiral", name: "スパイラルランス",   kind: "phys",      mult: 2.5, target: "one" },
    { lv: 30, id: "l_ryusei", name: "りゅうせいらんぶ",   kind: "physMulti", mult: 1.2, hits: 4 },
    { lv: 55, id: "l_dive",   name: "ドラゴンダイブ",     kind: "phys",      mult: 5.0, target: "one" },
  ],
  gou: [
    { lv: 10, id: "l_vacuum", name: "しんくうは",         kind: "phys",      mult: 2.5, target: "one" },
    { lv: 30, id: "l_hyakki", name: "ひゃっきれんだ",     kind: "physMulti", mult: 0.8, hits: 6 },
    { lv: 55, id: "l_kiai",   name: "きあいかいほう",     kind: "phys",      mult: 4.0, target: "one", chargeUp: true },
  ],
  celia: [
    { lv: 10, id: "l_breeze", name: "癒しのかぜ",       kind: "healAll",   ratio: 0.5 },
    { lv: 30, id: "l_seinaru", name: "せいなるいのり",    kind: "healAll",   ratio: 1.0, cure: true },
    { lv: 55, id: "l_tenshi", name: "てんしの奇跡",     kind: "miracle" },
  ],
  rod: [
    { lv: 12, id: "l_mana",   name: "マナバースト",       kind: "magic",     pow: 200, target: "all" },
    { lv: 32, id: "l_storm",  name: "エレメントストーム", kind: "magicMulti", pow: 150, hits: 3 },
    { lv: 55, id: "l_genshi", name: "げんしのひかり",     kind: "magic",     pow: 400, target: "one" },
  ],
};

DATA.statuses = {
  poison:  { name: "どく",     mark: "ど" },
  blind:   { name: "暗闇", mark: "や" },
  silence: { name: "沈黙", mark: "ち" },
  toad:    { name: "カエル",   mark: "カ" },
};

// ---------------- アイテム ----------------
// kind: 'use'(つかう) 'weapon' 'armor' 'key'
DATA.items = {
  potion:   { name: "ポーション",     kind: "use", price: 30,  heal: 60,  desc: "HPを 60 回復" },
  hipotion: { name: "ハイポーション", kind: "use", price: 150, heal: 250, desc: "HPを 250 回復" },
  ether:    { name: "エーテル",       kind: "use", price: 100, mp: 40,    desc: "MPを 40 回復" },
  phoenix:  { name: "フェニックスの尾", kind: "use", price: 400, revive: 0.5, desc: "戦闘ふのうから 復活" },
  antidote: { name: "毒消し",       kind: "use", price: 20,  cure: "poison", desc: "毒を なおす" },
  eyedrops: { name: "目薬",       kind: "use", price: 20,  cure: "blind", desc: "暗闇を なおす" },
  echoherb: { name: "やまびこ草",   kind: "use", price: 30,  cure: "silence", desc: "沈黙を なおす" },
  kiss:     { name: "乙女のキッス", kind: "use", price: 60,  cure: "toad", desc: "カエルを もとにもどす" },
  elixir:   { name: "エリクサー",     kind: "use", price: 2000, elixir: true, desc: "HPとMPが 完全回復" },
  megapotion: { name: "メガポーション", kind: "use", price: 500, heal: 600, desc: "HPを 600 回復" },
  worldtear: { name: "世界のしずく", kind: "use", price: 0, partyheal: true, desc: "仲間ぜんいんが 完全回復" },
  xpotion:  { name: "エクスポーション", kind: "use", price: 1500, heal: 2000, desc: "HPを 2000 回復" },
  hiether:  { name: "ハイエーテル",   kind: "use", price: 800, mp: 150, desc: "MPを 150 回復" },
  remedy:   { name: "万能薬",   kind: "use", price: 500, cureall: true, desc: "すべての 状態異常を なおす" },

  w_dark:    { name: "ダークソード",   kind: "weapon", price: 300, atk: 8,  who: ["leon"], dark: true },
  w_steel:   { name: "鋼鉄の剣", kind: "weapon", price: 450, atk: 12, who: ["leon"] },
  w_mythril: { name: "ミスリルソード", kind: "weapon", price: 900, atk: 16, who: ["leon"] },
  w_light:   { name: "光の剣", kind: "weapon", price: 0,   atk: 24, who: ["leon"], elem: "holy", slay: ["undead"] },
  w_staff:   { name: "ロッド",         kind: "weapon", price: 60,  atk: 3,  who: ["rod", "celia"] },
  w_wizstaff:{ name: "魔道の杖",   kind: "weapon", price: 500, atk: 7, int: 3, who: ["rod"] },
  w_mace:    { name: "癒しの杖",   kind: "weapon", price: 450, atk: 6, int: 2, who: ["celia"] },
  w_crystalrod: { name: "水晶ロッド", kind: "weapon", price: 1300, atk: 8, int: 4, who: ["celia"] },
  w_flame:   { name: "フレイムソード", kind: "weapon", price: 1200, atk: 19, who: ["leon"], elem: "fire" },
  w_iceblade:{ name: "氷の剣", kind: "weapon", price: 1800, atk: 22, who: ["leon"], elem: "ice" },
  w_star:    { name: "星くずの剣", kind: "weapon", price: 0, atk: 30, who: ["leon"], elem: "holy", slay: ["undead", "demon"] },
  w_halberd: { name: "ハルバード",     kind: "weapon", price: 2400, atk: 21, who: ["glen"] },
  w_battleclaw: { name: "爆裂の爪", kind: "weapon", price: 2200, atk: 20, who: ["gou"], elem: "fire" },
  w_sagestaff: { name: "賢者の杖", kind: "weapon", price: 2600, atk: 12, int: 6, who: ["rod"] },
  w_spiritrod: { name: "精霊ロッド", kind: "weapon", price: 2400, atk: 10, int: 5, who: ["celia"] },
  w_spear:   { name: "やり",           kind: "weapon", price: 250, atk: 8,  who: ["glen"] },
  w_lance:   { name: "ミスリルの槍", kind: "weapon", price: 850, atk: 15, who: ["glen"] },
  w_dragonlance: { name: "りゅうの槍", kind: "weapon", price: 1500, atk: 17, who: ["glen"], slay: ["dragon"] },
  w_windspear: { name: "風の槍",   kind: "weapon", price: 3000, atk: 26, who: ["glen"] },
  w_trident: { name: "トライデント",   kind: "weapon", price: 3600, atk: 28, who: ["glen"], elem: "thunder" },
  w_gigalance: { name: "銀河の槍", kind: "weapon", price: 0, atk: 32, who: ["glen"], elem: "holy" },
  w_claw:    { name: "鉄の爪",     kind: "weapon", price: 200, atk: 6,  who: ["gou"] },
  w_ironclaw:{ name: "タイガークロー", kind: "weapon", price: 700, atk: 13, who: ["gou"] },
  w_thunderclaw: { name: "雷の爪", kind: "weapon", price: 1400, atk: 16, who: ["gou"], elem: "thunder" },
  w_kingclaw: { name: "竜王の爪", kind: "weapon", price: 0, atk: 34, who: ["gou"], slay: ["dragon"] },
  w_garon:   { name: "豪傑の爪",   kind: "weapon", price: 0, atk: 28, who: ["gou"] },
  a_hachimaki2: { name: "拳王の鉢巻", kind: "armor", price: 0, def: 22, who: ["gou"] },
  w_dverg:   { name: "ドヴェルグアクス", kind: "weapon", price: 0, atk: 38, who: ["leon", "glen"] },
  a_dverg2:  { name: "ドヴェルグの盾", kind: "armor", price: 0, def: 27, who: ["leon", "glen"] },
  // 幻獣の 報酬
  a_sylphid: { name: "風のマント",     kind: "armor", price: 0, def: 29, int: 6, who: ["rod", "celia"] },
  a_gnomos:  { name: "大地のおおたて", kind: "armor", price: 0, def: 31, who: ["leon", "glen"] },
  w_undina:  { name: "海鳴りの杖",   kind: "weapon", price: 0, atk: 16, int: 10, who: ["celia"] },
  // こじんイベント報酬
  w_kizuna:  { name: "絆の槍",   kind: "weapon", price: 0, atk: 27, who: ["glen"], slay: ["demon"] },
  w_truthbook: { name: "真理の書", kind: "weapon", price: 0, atk: 13, int: 7, who: ["rod"] },
  w_prayrod: { name: "祈りのロッド", kind: "weapon", price: 0, atk: 11, int: 6, who: ["celia"] },
  a_hachimaki: { name: "戦士の鉢巻", kind: "armor", price: 0, def: 18, who: ["gou"] },
  a_fairy:   { name: "フェアリーローブ", kind: "armor", price: 0, def: 14, int: 4, who: ["rod", "celia"] },
  a_royalmail: { name: "王国の鎧", kind: "armor", price: 5000, def: 24, who: ["leon", "glen"] },
  a_royal:   { name: "王家のローブ",   kind: "armor", price: 4200, def: 19, int: 5, who: ["rod", "celia"] },
  // 星の世界 ティア (セレーネで はんばい)
  w_comet:   { name: "コメットブレード", kind: "weapon", price: 9000, atk: 44, who: ["leon"] },
  w_starlance: { name: "星の槍",     kind: "weapon", price: 8500, atk: 42, who: ["glen"] },
  w_cosmoclaw: { name: "コスモクロー",   kind: "weapon", price: 8000, atk: 40, who: ["gou"] },
  w_nebularod: { name: "星雲の杖", kind: "weapon", price: 9000, atk: 16, int: 9, who: ["rod"] },
  w_moonwand: { name: "月の杖",      kind: "weapon", price: 8500, atk: 14, int: 8, who: ["celia"] },
  // きゅうきょくそうび (星の世界の 宝箱)
  w_nova:    { name: "超新星の剣", kind: "weapon", price: 0, atk: 60, who: ["leon"], elem: "holy", slay: ["demon", "undead"] },
  w_ryuoh:   { name: "竜神の槍", kind: "weapon", price: 0, atk: 58, who: ["glen"], slay: ["dragon"] },
  w_supernova: { name: "銀河の爪",   kind: "weapon", price: 0, atk: 56, who: ["gou"], elem: "holy" },
  w_astral:  { name: "アストラルロッド", kind: "weapon", price: 0, atk: 20, int: 12, who: ["rod"] },
  w_stella:  { name: "ステラロッド",     kind: "weapon", price: 0, atk: 18, int: 11, who: ["celia"] },

  a_dark:    { name: "暗黒の鎧", kind: "armor", price: 350, def: 6,  who: ["leon"], dark: true },
  a_steel:   { name: "鋼鉄の鎧", kind: "armor", price: 400, def: 10, who: ["leon", "glen"] },
  a_mythril: { name: "ミスリルメイル", kind: "armor", price: 950, def: 13, who: ["leon", "glen"] },
  a_light:   { name: "光の鎧", kind: "armor", price: 0,   def: 16, who: ["leon"] },
  a_cloth:   { name: "布のローブ",   kind: "armor", price: 50,  def: 2,  who: ["rod", "celia", "gou"] },
  a_leather: { name: "川の鎧",   kind: "armor", price: 200, def: 5,  who: ["leon", "glen", "gou", "rod", "celia"] },
  a_silk:    { name: "シルクのローブ", kind: "armor", price: 400, def: 7, int: 2, who: ["rod", "celia"] },
  a_ice:     { name: "氷のローブ", kind: "armor", price: 900, def: 9, int: 2, who: ["rod", "celia"] },
  a_aqua:    { name: "アクアメイル",   kind: "armor", price: 1600, def: 15, who: ["leon", "glen"] },
  a_flame:   { name: "炎のローブ", kind: "armor", price: 1400, def: 11, int: 2, who: ["rod", "celia"] },
  a_dwarf:   { name: "ドヴェルグメイル", kind: "armor", price: 2400, def: 19, who: ["leon", "glen"] },
  a_gaia:    { name: "大地の鎧",   kind: "armor", price: 3200, def: 22, who: ["leon", "glen"] },
  a_sylph:   { name: "シルフのローブ",   kind: "armor", price: 3000, def: 16, int: 4, who: ["rod", "celia"] },
  a_abyss:   { name: "深海のローブ", kind: "armor", price: 3400, def: 18, int: 5, who: ["rod", "celia"] },
  a_star:    { name: "星の鎧",     kind: "armor", price: 0, def: 26, who: ["leon", "glen"] },
  a_cosmos:  { name: "コスモスのローブ", kind: "armor", price: 0, def: 20, int: 6, who: ["rod", "celia"] },
  // ゴウせんよう どうぎ けいとう
  a_gi:      { name: "見切りのどうぎ",   kind: "armor", price: 800, def: 9, who: ["gou"] },
  a_master:  { name: "達人のどうぎ", kind: "armor", price: 2000, def: 15, who: ["gou"] },
  a_champ:   { name: "チャンピオンベルト", kind: "armor", price: 0, def: 24, who: ["gou"] },
  a_sage:    { name: "賢者のローブ", kind: "armor", price: 2200, def: 13, int: 3, who: ["rod", "celia"] },
  // 星の世界 ティア
  a_comet:   { name: "コメットメイル",   kind: "armor", price: 9500, def: 30, who: ["leon", "glen"] },
  a_moonrobe: { name: "月のローブ",    kind: "armor", price: 8800, def: 24, int: 7, who: ["rod", "celia"] },
  a_stargi:  { name: "星のどうぎ",     kind: "armor", price: 8200, def: 28, who: ["gou"] },
  // きゅうきょくそうび
  a_nova:    { name: "超新星の鎧", kind: "armor", price: 0, def: 36, who: ["leon", "glen"] },
  a_astral:  { name: "アストラルローブ", kind: "armor", price: 0, def: 30, int: 9, who: ["rod", "celia"] },
  a_cosmogi: { name: "銀河のどうぎ",   kind: "armor", price: 0, def: 34, who: ["gou"] },
  a_stellar: { name: "星の守り",     kind: "armor", price: 0, def: 28, int: 8, who: ["rod", "celia"] },
  a_crown:   { name: "星の王冠",   kind: "armor", price: 0, def: 33, int: 10, who: ["rod", "celia"] },
  a_bell:    { name: "ねこの鈴",       kind: "armor", price: 0, def: 15, int: 5, who: ["leon", "glen", "gou", "rod", "celia"] },
  // 東の大陸 ティア
  w_twin:    { name: "ふたごの槍",     kind: "weapon", price: 12000, atk: 46, who: ["glen"] },
  a_lake:    { name: "湖のローブ", kind: "armor", price: 9800, def: 26, int: 7, who: ["rod", "celia"] },
  w_mirror:  { name: "ミラーブレード",   kind: "weapon", price: 0, atk: 50, who: ["leon"], elem: "ice" },
  a_chrono:  { name: "時の鎧",     kind: "armor", price: 0, def: 34, who: ["leon", "glen"] },
  // 氷の列島 ティア
  w_icefang: { name: "氷のキバ",     kind: "weapon", price: 12500, atk: 48, who: ["gou"], elem: "ice" },
  a_frostmail: { name: "フロストメイル", kind: "armor", price: 11000, def: 32, who: ["leon", "glen"] },
  w_blizzard: { name: "吹雪の槍",    kind: "weapon", price: 0, atk: 49, who: ["glen"], elem: "ice" },
  a_aurora:  { name: "オーロラのマント", kind: "armor", price: 0, def: 31, int: 8, who: ["rod", "celia"] },
  // 砂の王国 ティア
  w_scimitar: { name: "円月刀",    kind: "weapon", price: 13000, atk: 46, who: ["leon"], elem: "fire" },
  a_desert:  { name: "砂漠のころも",   kind: "armor", price: 10500, def: 28, int: 7, who: ["rod", "celia"] },
  a_sandgi:  { name: "すなのどうぎ",     kind: "armor", price: 9500, def: 30, who: ["gou"] },
  w_sandlance: { name: "すな嵐の槍", kind: "weapon", price: 0, atk: 52, who: ["glen"] },
  oasiswater: { name: "オアシスの水",  kind: "use", price: 300, heal: 400, desc: "HPを 400 回復" },
  a_unity:   { name: "絆のマント",   kind: "armor", price: 0, def: 30, int: 6, who: ["leon", "glen", "gou", "rod", "celia"] },
  // 幻のしろの かくしそうび
  w_regalia: { name: "王の剣 レガリア", kind: "weapon", price: 0, atk: 65, who: ["leon"],
    elem: "holy", slay: ["demon", "undead", "dragon"] },
  a_phantom: { name: "幻のマント",  kind: "armor", price: 0, def: 34, int: 9, who: ["rod", "celia"] },
  // 隠し武器コレクション (とくしゅな にゅうしゅじょうけん)
  w_skypierce: { name: "空の槍",      kind: "weapon", price: 0, atk: 60, who: ["glen"], elem: "thunder" },
  w_haou:    { name: "覇王の爪",      kind: "weapon", price: 0, atk: 62, who: ["gou"] },
  w_seijo:   { name: "聖女の杖",    kind: "weapon", price: 0, atk: 20, int: 13, who: ["celia"] },
  w_genja:   { name: "げんじゃの杖",    kind: "weapon", price: 0, atk: 22, int: 14, who: ["rod"] },
  a_heroband: { name: "英雄のおび",   kind: "armor", price: 0, def: 36, int: 6, who: ["leon", "glen", "gou", "rod", "celia"] },
  // 夜の国 ティア
  w_nightclaw: { name: "夜の爪",      kind: "weapon", price: 16000, atk: 58, who: ["gou"] },
  a_dusk:    { name: "黄昏の鎧",  kind: "armor", price: 14000, def: 37, who: ["leon", "glen"] },
  nightdrop: { name: "夜のしずく",      kind: "use", price: 1200, heal: 800, desc: "HPを 800 回復" },
  w_dawn:    { name: "夜明けの槍",      kind: "weapon", price: 0, atk: 63, who: ["glen"], elem: "fire" },
  a_nocturne: { name: "夜のローブ",     kind: "armor", price: 0, def: 36, int: 10, who: ["rod", "celia"] },
  // こじんイベントだい2しょうの きねんそうび
  a_oath:    { name: "誓いのマント",    kind: "armor", price: 0, def: 38, who: ["leon"] },
  a_dragonheart: { name: "りゅうの心", kind: "armor", price: 0, def: 38, who: ["glen"] },
  a_master2: { name: "真意のおび",      kind: "armor", price: 0, def: 38, who: ["gou"] },
  a_prayer:  { name: "祈りのベール",    kind: "armor", price: 0, def: 37, int: 11, who: ["celia"] },
  a_wisdom:  { name: "英知のぼうし",    kind: "armor", price: 0, def: 37, int: 12, who: ["rod"] },
  // 緑の群島 ティア
  w_leafblade: { name: "木陰の剣", kind: "weapon", price: 13500, atk: 48, who: ["leon"] },
  w_junglerod: { name: "みどりの杖",   kind: "weapon", price: 11500, atk: 18, int: 10, who: ["rod"] },
  a_vinemail: { name: "つたの鎧",    kind: "armor", price: 11500, def: 33, who: ["leon", "glen"] },
  a_leafrobe: { name: "木の葉のローブ",  kind: "armor", price: 0, def: 29, int: 8, who: ["rod", "celia"] },
  w_guardfist: { name: "守りの拳", kind: "weapon", price: 0, atk: 54, who: ["gou"] },
  // 雷鳴の島 ティア
  w_boltblade: { name: "らいめいの剣", kind: "weapon", price: 15000, atk: 52, who: ["leon"], elem: "thunder" },
  w_stormrod: { name: "嵐の杖",     kind: "weapon", price: 12500, atk: 19, int: 11, who: ["celia"] },
  a_stormmail: { name: "雷雲の鎧", kind: "armor", price: 12500, def: 35, who: ["leon", "glen"] },
  a_boltgi:  { name: "稲妻のどうぎ",  kind: "armor", price: 11000, def: 32, who: ["gou"] },
  w_raijin:  { name: "らいじんの槍",    kind: "weapon", price: 0, atk: 56, who: ["glen"], elem: "thunder" },

  crystal:   { name: "クリスタル",     kind: "key", price: 0, desc: "せいなる 光を やどす" },
  heroproof: { name: "英雄のあかし", kind: "key", price: 0, desc: "すべてを なしとげた しょうこ" },
  expcharm:  { name: "経験のしるし", kind: "key", price: 0, desc: "もっているだけで 経験値 2ばい" },
  glowstone: { name: "輝く石",   kind: "key", price: 0, desc: "おおあなのそこで ひろった いし" },
  earthcrystal: { name: "ちのクリスタル", kind: "key", price: 0, desc: "大地の力を やどす けっしょう" },
  windcrystal: { name: "風のクリスタル", kind: "key", price: 0, desc: "嵐の力を やどす けっしょう" },
  watercrystal: { name: "水のクリスタル", kind: "key", price: 0, desc: "海の力を やどす けっしょう" },
};

// ---------------- 仲間 ----------------
// row: たいれつ。後列は 物理ダメージが 与/被 ともに はんぶん
DATA.heroes = {
  leon: {
    name: "レオン", cls: "暗黒騎士", spr: "hero", row: "front",
    base:   { hp: 48, mp: 6, str: 10, agi: 7, vit: 9, int: 4 },
    growth: { hp: 11, mp: 2, str: 2, agi: 1, vit: 2, int: 1 },
    weapon: "w_dark", armor: "a_dark",
    special: "dark", // あんこく
    spells: [],
    learn: {},
  },
  glen: {
    name: "グレン", cls: "竜騎士", spr: "glen", row: "front",
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
    command: "charge", // ためる: さいだい3かい。つぎの攻撃が 2/4/8ばい
    spells: [],
    learn: {},
  },
  celia: {
    name: "セリア", cls: "白魔道士", spr: "celia", row: "back",
    base:   { hp: 30, mp: 24, str: 5, agi: 8, vit: 6, int: 11 },
    growth: { hp: 7, mp: 5, str: 1, agi: 1, vit: 1, int: 2 },
    weapon: "w_staff", armor: "a_cloth",
    command: "pray", // いのる: MP0。50%で ぜんいん さいだいHPの30%回復
    spells: ["cure1"],
    learn: { 4: "poisona", 6: "protect", 9: "cure2", 10: "esuna", 12: "raise", 16: "cure3", 18: "haste", 20: "rain", 22: "protect2", 26: "saint" },
  },
  rod: {
    name: "ロッド", cls: "黒魔道士", spr: "rod", row: "back",
    base:   { hp: 27, mp: 22, str: 5, agi: 7, vit: 5, int: 13 },
    growth: { hp: 6, mp: 6, str: 1, agi: 1, vit: 1, int: 3 },
    weapon: "w_staff", armor: "a_cloth",
    command: "focus", // 覚醒: さいだい3かい。つぎの攻撃魔法が 2/4/8ばい
    spells: ["fire1"],
    learn: { 4: "ice1", 6: "bolt1", 9: "fire2", 12: "ice2", 15: "fire3", 19: "ice3", 21: "drain", 24: "bolt3", 28: "quake", 32: "flare" },
  },
};

// パラディンへのクラスチェンジで置きかわる内容
DATA.paladin = {
  cls: "パラディン", spr: "pal",
  special: "holy",   // 聖剣
  command: "cover",  // かばう: みがわり時は ダメージ1けた + 50%カウンター
  bonus: { hp: 30, mp: 12, str: 4, vit: 3 },
};

// レベルl から l+1 に あがるのに ひつような 経験値
DATA.expNext = (l) => 6 * l * l + 4 * l;

// ---------------- モンスター ----------------
// weak: 弱点(8ばい) / resist: たいせい(0.5ばい) / absorb: きゅうしゅう(回復)
// race: しゅぞく(とっこうぶきは 8ばい) / inflict: ぶつり攻撃の ついかこうか
DATA.monsters = {
  goblin:   { name: "ゴブリン",     spr: "goblin",   hp: 16, atk: 7,  def: 2,  agi: 4, exp: 5,  gold: 6 },
  bat:      { name: "大コウモリ", spr: "bat",      hp: 12, atk: 6,  def: 1,  agi: 9, exp: 4,  gold: 4,
    weak: ["thunder"], inflict: { status: "blind", rate: 0.25 } },
  toad:     { name: "毒ガエル",   spr: "toad",     hp: 22, atk: 8,  def: 2,  agi: 5, exp: 7,  gold: 8,
    weak: ["ice"], inflict: { status: "poison", rate: 0.3 },
    acts: [{ spell: "e_toad", rate: 0.2 }] },
  skeleton: { name: "スケルトン",   spr: "skeleton", hp: 34, atk: 13, def: 4,  agi: 6, exp: 14, gold: 14,
    race: "undead", weak: ["fire", "holy"] },
  wizard:   { name: "魔道士",     spr: "wizard",   hp: 28, atk: 8,  def: 3,  agi: 7, exp: 18, gold: 22,
    resist: ["fire"], acts: [{ spell: "e_fire", rate: 0.35 }, { spell: "e_silence", rate: 0.25 }] },
  gargoyle: { name: "ガーゴイル",   spr: "gargoyle", hp: 46, atk: 16, def: 6,  agi: 9, exp: 26, gold: 28,
    weak: ["thunder"] },
  golem:    { name: "ゴーレム",     spr: "golem",    hp: 85, atk: 21, def: 13, agi: 3, exp: 55, gold: 60,
    weak: ["thunder"] },
  ddemon:   { name: "ダークデーモン", spr: "demon",  hp: 66, atk: 22, def: 8,  agi: 10, exp: 62, gold: 55,
    race: "demon", weak: ["holy"], acts: [{ spell: "e_fire2", rate: 0.3 }] },

  // ---- 氷の洞窟 ----
  icegoblin: { name: "アイスゴブリン", spr: "goblin", pal: "light", hp: 30, atk: 14, def: 4, agi: 7, exp: 22, gold: 20,
    weak: ["fire"] },
  icebat:    { name: "ブリザドバット", spr: "bat", pal: "light", hp: 24, atk: 13, def: 2, agi: 12, exp: 18, gold: 15,
    weak: ["fire"], inflict: { status: "blind", rate: 0.25 } },
  frostwiz:  { name: "氷の魔道士", spr: "wizard", pal: "light", hp: 40, atk: 12, def: 5, agi: 9, exp: 34, gold: 40,
    weak: ["fire"], resist: ["ice"], acts: [{ spell: "e_ice", rate: 0.4 }, { spell: "e_silence", rate: 0.2 }] },
  frostgar:  { name: "フロストガーゴイル", spr: "gargoyle", pal: "light", hp: 70, atk: 24, def: 9, agi: 11, exp: 55, gold: 50,
    weak: ["fire"] },
  babydragon:{ name: "ベビードラゴン", spr: "dragon", hp: 90, atk: 26, def: 10, agi: 8, exp: 85, gold: 80,
    race: "dragon", resist: ["ice"], acts: [{ spell: "e_ice", rate: 0.25 }] },
  frostdragon: { name: "フロストドラゴン", spr: "dragon", pal: "light", boss: true, scale: 3,
    hp: 700, atk: 28, def: 12, agi: 10, exp: 300, gold: 500,
    race: "dragon", absorb: ["ice"],
    acts: [{ spell: "e_breath", rate: 0.3 }, { spell: "e_ice", rate: 0.2 }] },

  // ---- 地下水路 ----
  mudtoad:  { name: "マッドトード", spr: "toad", pal: "dark", hp: 45, atk: 20, def: 6, agi: 7, exp: 40, gold: 35,
    weak: ["ice"], inflict: { status: "poison", rate: 0.3 }, acts: [{ spell: "e_toad", rate: 0.2 }] },
  sewerbat: { name: "下水コウモリ", spr: "bat", pal: "dark", hp: 30, atk: 18, def: 4, agi: 14, exp: 30, gold: 25,
    weak: ["thunder"], inflict: { status: "blind", rate: 0.3 } },
  waterelem:{ name: "ウォーターエレメント", spr: "wizard", pal: "dark", hp: 55, atk: 16, def: 7, agi: 10, exp: 60, gold: 60,
    weak: ["thunder"], absorb: ["ice"], acts: [{ spell: "e_ice", rate: 0.4 }] },
  sludge:   { name: "ヘドロゴーレム", spr: "golem", pal: "dark", hp: 110, atk: 28, def: 15, agi: 4, exp: 95, gold: 90,
    weak: ["fire"], inflict: { status: "poison", rate: 0.4 } },
  kraken:   { name: "クラーケン", spr: "kraken", boss: true, scale: 3,
    hp: 900, atk: 30, def: 12, agi: 11, exp: 450, gold: 800,
    resist: ["fire", "ice"],
    acts: [{ spell: "e_wave", rate: 0.3 }, { spell: "e_ink", rate: 0.25 }] },

  // ---- おおあなのそこ (地底への いりぐち) ----
  flamegoblin: { name: "フレイムゴブリン", spr: "goblin", pal: "dark", hp: 55, atk: 26, def: 8, agi: 9, exp: 70, gold: 60,
    weak: ["ice"] },
  flamewiz: { name: "炎の魔術師", spr: "wizard", hp: 70, atk: 20, def: 8, agi: 11, exp: 90, gold: 95,
    weak: ["ice"], absorb: ["fire"], acts: [{ spell: "e_fire2", rate: 0.35 }] },
  magmagolem: { name: "マグマゴーレム", spr: "golem", pal: "dark", hp: 160, atk: 34, def: 18, agi: 5, exp: 160, gold: 150,
    weak: ["ice"], absorb: ["fire"] },
  flamedemon: { name: "フレイムデーモン", spr: "demon", hp: 110, atk: 32, def: 12, agi: 13, exp: 150, gold: 130,
    race: "demon", weak: ["ice"], acts: [{ spell: "e_fire2", rate: 0.3 }] },
  firelizard: { name: "ファイアリザード", spr: "dragon", pal: "dark", hp: 120, atk: 30, def: 12, agi: 9, exp: 140, gold: 120,
    race: "dragon", weak: ["ice"], acts: [{ spell: "e_fire", rate: 0.3 }] },
  darkknight: { name: "暗黒兵", spr: "hero_d", pal: "dark", hp: 130, atk: 36, def: 16, agi: 12, exp: 180, gold: 160,
    weak: ["holy"] },
  darksoldier: { name: "闇の兵士", spr: "soldier", pal: "dark", hp: 100, atk: 32, def: 14, agi: 14, exp: 150, gold: 140,
    weak: ["holy"] },
  // ---- まよいのもり ----
  woodgoblin: { name: "森ゴブリン", spr: "goblin", hp: 40, atk: 18, def: 5, agi: 8, exp: 30, gold: 28,
    weak: ["fire"] },
  vampbat: { name: "バンパイアバット", spr: "bat", pal: "dark", hp: 35, atk: 16, def: 3, agi: 13, exp: 26, gold: 22,
    weak: ["fire"], inflict: { status: "blind", rate: 0.25 } },
  madflower: { name: "マッドフラワー", spr: "toad", pal: "light", hp: 50, atk: 20, def: 6, agi: 6, exp: 38, gold: 34,
    weak: ["fire"], inflict: { status: "poison", rate: 0.35 }, acts: [{ spell: "e_toad", rate: 0.15 }] },
  treant: { name: "森のぬし トレント", spr: "treant", boss: true, scale: 4,
    hp: 2600, atk: 36, def: 14, agi: 8, exp: 1000, gold: 1200,
    weak: ["fire"], resist: ["ice", "thunder"],
    acts: [{ spell: "e_gale", rate: 0.3 }, { spell: "e_toad", rate: 0.2 }] },

  // ---- ミスリルけい (レアな かせぎてき。かたくて すぐ逃げる) ----
  mithrilbaby: { name: "ミスリルベビー", spr: "dragon", pal: "light",
    hp: 6, atk: 10, def: 250, agi: 30, exp: 2500, gold: 500,
    race: "dragon", absorb: ["fire", "ice", "thunder"], flees: 0.35 },
  mithrildragon: { name: "ミスリルドラゴン", spr: "dragon", pal: "light",
    hp: 12, atk: 20, def: 400, agi: 40, exp: 8000, gold: 2000,
    race: "dragon", absorb: ["fire", "ice", "thunder"], flees: 0.35 },

  // ---- かくしボス ----
  vaha: { name: "深淵竜 ヴァハ", spr: "dragon", pal: "dark", boss: true, scale: 4,
    hp: 9000, atk: 60, def: 26, agi: 20, exp: 5000, gold: 10000,
    race: "dragon", absorb: ["fire", "ice", "thunder"],
    acts: [{ spell: "e_starfall", rate: 0.25 }, { spell: "e_bigwave", rate: 0.2 }, { spell: "e_eruption", rate: 0.2 }] },

  // ---- 星のとう (さいしゅうしょう) ----
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
  dunestalker: { name: "すなカマキリ", spr: "mantis", pal: "dark", hp: 90, atk: 22, def: 10, agi: 16, exp: 60, gold: 50 },
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
  crystalmantis: { name: "水晶カマ", spr: "mantis", pal: "light", hp: 520, atk: 64, def: 30, agi: 24, exp: 1000, gold: 800,
    weak: ["fire"] },
  stareater: { name: "スターイーター", spr: "eye", pal: "light", hp: 640, atk: 70, def: 28, agi: 22, exp: 1600, gold: 1300,
    weak: ["holy"], inflict: { status: "toad", rate: 0.15 } },
  // 幻獣 (そら/地底/うみに ひそむ 精霊がたの レアボス)
  sylphid: { name: "風の幻獣 シルフィド", spr: "bird", pal: "light", boss: true, scale: 3,
    hp: 3000, atk: 68, def: 26, agi: 34, exp: 8000, gold: 4000,
    resist: ["thunder"], weak: ["ice"],
    acts: [{ spell: "e_tornado", rate: 0.25 }, { spell: "e_gale", rate: 0.3 }] },
  gnomos: { name: "つちの幻獣 ノーモス", spr: "golem", boss: true, scale: 3,
    hp: 3600, atk: 76, def: 44, agi: 10, exp: 9000, gold: 4500,
    resist: ["fire"], weak: ["thunder"],
    acts: [{ spell: "e_quake", rate: 0.3 }] },
  undina: { name: "水の幻獣 ウンディナ", spr: "kraken", pal: "light", boss: true, scale: 3,
    hp: 3300, atk: 72, def: 30, agi: 22, exp: 8500, gold: 4200,
    absorb: ["ice"], weak: ["thunder"],
    acts: [{ spell: "e_bigwave", rate: 0.25 }, { spell: "e_wave", rate: 0.3 }] },
  // 雷鳴の島 (Lv65〜85たい)
  stormimp: { name: "雷雲インプ", spr: "goblin", pal: "light", hp: 780, atk: 82, def: 32, agi: 34, exp: 1550, gold: 1150,
    absorb: ["thunder"], weak: ["ice"] },
  thunderhawk: { name: "らいめいタカ", spr: "bird", pal: "light", hp: 720, atk: 84, def: 28, agi: 42, exp: 1500, gold: 1100,
    absorb: ["thunder"], weak: ["ice"], acts: [{ spell: "e_bolt2", rate: 0.3 }] },
  boltjelly: { name: "雷電ゼリー", spr: "slime", pal: "light", hp: 840, atk: 78, def: 40, agi: 20, exp: 1600, gold: 1250,
    absorb: ["thunder", "ice"], weak: ["fire"] },
  stormcaller: { name: "嵐よび", spr: "wizard", pal: "light", hp: 760, atk: 76, def: 30, agi: 30, exp: 1550, gold: 1200,
    absorb: ["thunder"], weak: ["holy"], acts: [{ spell: "e_bolt2", rate: 0.25 }, { spell: "e_tornado", rate: 0.15 }] },
  galeserpent: { name: "風ヘビ", spr: "worm", pal: "light", hp: 880, atk: 86, def: 36, agi: 26, exp: 1650, gold: 1300,
    weak: ["ice"], acts: [{ spell: "e_gale", rate: 0.3 }] },
  cloudknight: { name: "雷雲きし", spr: "hero_d", pal: "light", hp: 900, atk: 90, def: 42, agi: 28, exp: 1700, gold: 1400,
    absorb: ["thunder"], weak: ["holy"] },
  tonitrus: { name: "雷神の化身 トニトルス", spr: "demon", pal: "light", boss: true, scale: 4,
    hp: 10000, atk: 104, def: 46, agi: 32, exp: 60000, gold: 20000,
    absorb: ["thunder"], resist: ["fire"], weak: ["ice"],
    acts: [{ spell: "e_bolt2", rate: 0.3 }, { spell: "e_tornado", rate: 0.2 }, { spell: "e_starfall", rate: 0.12 }] },
  // 緑の群島 (Lv60〜80たい)
  junglecat: { name: "緑のヒョウ", spr: "cat", pal: "dark", hp: 740, atk: 78, def: 30, agi: 38, exp: 1450, gold: 1050,
    weak: ["fire"] },
  vineflower: { name: "つるはなつかい", spr: "treant", pal: "dark", hp: 800, atk: 74, def: 36, agi: 14, exp: 1500, gold: 1100,
    weak: ["fire"], inflict: { status: "poison", rate: 0.3 } },
  rubyhornet: { name: "紅バチ", spr: "bat", pal: "dark", hp: 680, atk: 76, def: 26, agi: 40, exp: 1400, gold: 980,
    weak: ["ice"], inflict: { status: "poison", rate: 0.25 } },
  ruinsguard: { name: "遺跡の番兵", spr: "soldier", pal: "dark", hp: 820, atk: 80, def: 44, agi: 16, exp: 1550, gold: 1200,
    resist: ["fire", "ice"], weak: ["thunder"] },
  mossgolem: { name: "こけむしゴーレム", spr: "golem", pal: "light", hp: 900, atk: 82, def: 46, agi: 8, exp: 1600, gold: 1250,
    absorb: ["ice"], weak: ["fire"], acts: [{ spell: "e_quake", rate: 0.2 }] },
  shadowmonkey: { name: "影ザル", spr: "goblin", pal: "dark", hp: 700, atk: 74, def: 28, agi: 36, exp: 1400, gold: 1000,
    inflict: { status: "blind", rate: 0.3 } },
  guardios: { name: "守り神 ガーディオス", spr: "golem", boss: true, scale: 4,
    hp: 9000, atk: 100, def: 48, agi: 20, exp: 55000, gold: 18000,
    resist: ["fire", "ice"], weak: ["thunder"],
    acts: [{ spell: "e_quake", rate: 0.25 }, { spell: "e_bolt2", rate: 0.2 }, { spell: "e_meteo", rate: 0.15 }] },
  // 砂の王国 (Lv55〜75たい)
  sandworm2: { name: "砂ワーム", spr: "worm", pal: "dark", hp: 820, atk: 76, def: 34, agi: 16, exp: 1350, gold: 1000,
    weak: ["ice"] },
  scarab: { name: "黄金スカラベ", spr: "slime", pal: "dark", hp: 700, atk: 70, def: 44, agi: 22, exp: 1300, gold: 1400,
    resist: ["fire", "thunder"], weak: ["ice"] },
  mummy: { name: "ミイラ兵", spr: "skeleton", pal: "dark", hp: 780, atk: 74, def: 32, agi: 18, exp: 1400, gold: 1050,
    race: "undead", weak: ["fire", "holy"], inflict: { status: "poison", rate: 0.25 } },
  desertghost: { name: "砂漠の亡霊", spr: "wizard", pal: "dark", hp: 680, atk: 68, def: 28, agi: 26, exp: 1300, gold: 950,
    race: "undead", weak: ["holy"], acts: [{ spell: "e_fire2", rate: 0.3 }] },
  vulture: { name: "大ハゲタカ", spr: "bird", pal: "dark", hp: 660, atk: 72, def: 26, agi: 36, exp: 1250, gold: 900,
    acts: [{ spell: "e_gale", rate: 0.3 }] },
  sandgolem: { name: "サンドゴーレム", spr: "golem", pal: "dark", hp: 880, atk: 80, def: 42, agi: 8, exp: 1500, gold: 1150,
    absorb: ["thunder"], weak: ["ice"], acts: [{ spell: "e_quake", rate: 0.2 }] },
  kham: { name: "砂の王 カーム", spr: "king", pal: "dark", boss: true, scale: 3,
    hp: 8200, atk: 96, def: 42, agi: 24, exp: 45000, gold: 16000,
    race: "undead", resist: ["ice", "thunder"], weak: ["fire", "holy"],
    acts: [{ spell: "e_quake", rate: 0.25 }, { spell: "e_meteo", rate: 0.18 }, { spell: "e_toad", rate: 0.15 }] },
  // 氷の列島 (Lv50〜70たい)
  snowwolf: { name: "雪オオカミ", spr: "gargoyle", pal: "light", hp: 680, atk: 70, def: 30, agi: 28, exp: 1200, gold: 880,
    weak: ["fire"] },
  icemaiden: { name: "氷の舞姫", spr: "celia", pal: "light", hp: 640, atk: 64, def: 28, agi: 24, exp: 1150, gold: 840,
    weak: ["fire"], acts: [{ spell: "e_breath", rate: 0.25 }] },
  glacierworm: { name: "氷河ワーム", spr: "worm", pal: "light", hp: 760, atk: 72, def: 36, agi: 14, exp: 1300, gold: 950,
    absorb: ["ice"], weak: ["fire"] },
  frostogre: { name: "フロストオーガ", spr: "golem", pal: "light", hp: 800, atk: 78, def: 38, agi: 10, exp: 1400, gold: 1050,
    weak: ["fire"] },
  aurorawisp: { name: "オーロラウィスプ", spr: "wizard", pal: "light", hp: 600, atk: 62, def: 26, agi: 26, exp: 1100, gold: 800,
    absorb: ["ice"], weak: ["fire"], acts: [{ spell: "e_breath", rate: 0.3 }] },
  blizzardhawk: { name: "ふぶきタカ", spr: "bird", pal: "light", hp: 620, atk: 68, def: 24, agi: 34, exp: 1150, gold: 820,
    weak: ["fire"], acts: [{ spell: "e_gale", rate: 0.3 }] },
  glaciella: { name: "氷結の女神 グラシエラ", spr: "celia", pal: "light", boss: true, scale: 3,
    hp: 7500, atk: 92, def: 40, agi: 26, exp: 40000, gold: 14000,
    absorb: ["ice"], resist: ["thunder"], weak: ["fire"],
    acts: [{ spell: "e_bigwave", rate: 0.22 }, { spell: "e_breath", rate: 0.25 }, { spell: "e_starfall", rate: 0.15 }] },
  // 東の大陸 (Lv40〜60たい)
  mirrorling: { name: "ミラーリング", spr: "eye", pal: "light", hp: 500, atk: 60, def: 28, agi: 22, exp: 850, gold: 640,
    weak: ["thunder"] },
  twinfang: { name: "ツインファング", spr: "mantis", pal: "dark", hp: 560, atk: 66, def: 26, agi: 26, exp: 950, gold: 700 },
  lakeserpent: { name: "湖のおろち", spr: "kraken", hp: 700, atk: 64, def: 30, agi: 16, exp: 1100, gold: 850,
    absorb: ["ice"], weak: ["thunder"], acts: [{ spell: "e_wave", rate: 0.25 }] },
  chronomite: { name: "クロノマイト", spr: "slime", pal: "dark", hp: 620, atk: 62, def: 34, agi: 20, exp: 1000, gold: 760,
    resist: ["fire", "ice"] },
  echowisp: { name: "こだまのウィスプ", spr: "wizard", pal: "dark", hp: 540, atk: 58, def: 24, agi: 24, exp: 900, gold: 680,
    weak: ["holy"], acts: [{ spell: "e_bolt2", rate: 0.3 }] },
  dunebird: { name: "砂嵐ドリ", spr: "bird", hp: 520, atk: 60, def: 22, agi: 30, exp: 880, gold: 660,
    acts: [{ spell: "e_gale", rate: 0.3 }] },
  mirrorfiend: { name: "かがみのぬし ミラーフィエンド", spr: "eye", pal: "dark", boss: true, scale: 3,
    hp: 5200, atk: 84, def: 36, agi: 24, exp: 28000, gold: 9000,
    resist: ["ice", "thunder"], weak: ["fire"],
    acts: [{ spell: "e_bolt2", rate: 0.25 }, { spell: "e_tornado", rate: 0.2 }] },
  chronova: { name: "時の番人 クロノヴァ", spr: "wizard", pal: "light", boss: true, scale: 3,
    hp: 6400, atk: 90, def: 38, agi: 28, exp: 35000, gold: 12000,
    absorb: ["thunder"], weak: ["holy"],
    acts: [{ spell: "e_starfall", rate: 0.22 }, { spell: "e_quake", rate: 0.22 }] },
  // ひのたま/カニけいの バリエーション (図鑑150しゅか)
  firewisp: { name: "ヒノタマ", spr: "wisp", hp: 40, atk: 12, def: 6, agi: 10, exp: 12, gold: 14,
    absorb: ["fire"], weak: ["ice"] },
  sandcrab: { name: "砂ガニ", spr: "crab", hp: 70, atk: 18, def: 14, agi: 8, exp: 35, gold: 30 },
  bluewisp: { name: "あおヒノタマ", spr: "wisp", pal: "light", hp: 130, atk: 26, def: 10, agi: 14, exp: 100, gold: 85,
    absorb: ["ice"], weak: ["fire"] },
  rockcrab: { name: "岩ガニ", spr: "crab", pal: "dark", hp: 200, atk: 36, def: 30, agi: 8, exp: 180, gold: 160,
    weak: ["thunder"] },
  boltwisp: { name: "雷電ダマ", spr: "wisp", pal: "dark", hp: 260, atk: 44, def: 16, agi: 20, exp: 320, gold: 280,
    absorb: ["thunder"], weak: ["ice"], acts: [{ spell: "e_bolt", rate: 0.3 }] },
  seacrab: { name: "潮ガニ", spr: "crab", pal: "light", hp: 300, atk: 46, def: 26, agi: 12, exp: 340, gold: 300,
    absorb: ["ice"], weak: ["thunder"] },
  ghostwisp: { name: "魂び", spr: "wisp", pal: "light", hp: 340, atk: 50, def: 18, agi: 24, exp: 420, gold: 360,
    race: "undead", weak: ["holy"] },
  mirrorwisp: { name: "かがみビ", spr: "wisp", pal: "light", hp: 520, atk: 60, def: 24, agi: 26, exp: 900, gold: 700,
    resist: ["ice", "thunder"], weak: ["fire"] },
  junglecrab: { name: "森ガニ", spr: "crab", hp: 560, atk: 68, def: 40, agi: 14, exp: 1050, gold: 800,
    weak: ["fire"] },
  glacierhermit: { name: "氷河ヤドカリ", spr: "crab", pal: "light", hp: 700, atk: 74, def: 44, agi: 10, exp: 1250, gold: 950,
    absorb: ["ice"], weak: ["fire"] },
  tombcrab: { name: "墓ガニ", spr: "crab", pal: "dark", hp: 760, atk: 78, def: 46, agi: 12, exp: 1400, gold: 1100,
    race: "undead", weak: ["fire", "holy"] },
  stormwisp: { name: "あらしビ", spr: "wisp", pal: "light", hp: 740, atk: 80, def: 26, agi: 32, exp: 1500, gold: 1150,
    absorb: ["thunder"], weak: ["ice"], acts: [{ spell: "e_bolt2", rate: 0.25 }] },
  willowisp: { name: "迷い火", spr: "wisp", hp: 900, atk: 88, def: 28, agi: 30, exp: 1800, gold: 1350,
    weak: ["holy"], inflict: { status: "blind", rate: 0.3 } },
  voidflame: { name: "ヴォイドビ", spr: "wisp", pal: "dark", hp: 950, atk: 92, def: 30, agi: 34, exp: 1900, gold: 1450,
    weak: ["holy"], acts: [{ spell: "e_fire2", rate: 0.25 }] },
  crystalcrab: { name: "水晶ガニ", spr: "crab", pal: "light", hp: 980, atk: 90, def: 56, agi: 14, exp: 1950, gold: 1550,
    resist: ["fire", "ice"], weak: ["thunder"] },
  abysscrab: { name: "しんかいガニ", spr: "crab", pal: "dark", hp: 820, atk: 88, def: 50, agi: 12, exp: 1600, gold: 1250,
    absorb: ["ice"], weak: ["thunder"] },
  dreamwisp: { name: "ゆめび", spr: "wisp", pal: "light", hp: 850, atk: 84, def: 26, agi: 30, exp: 1700, gold: 1300,
    inflict: { status: "toad", rate: 0.2 }, weak: ["fire"] },
  nightwisp: { name: "よるビ", spr: "wisp", pal: "dark", hp: 880, atk: 86, def: 28, agi: 36, exp: 1750, gold: 1350,
    weak: ["fire"], inflict: { status: "silence", rate: 0.2 } },
  kingcrab: { name: "カニの王", spr: "crab", pal: "light", scale: 3, hp: 1800, atk: 95, def: 60, agi: 14, exp: 4000, gold: 3000,
    absorb: ["ice"], weak: ["thunder"] },
  goldcrab: { name: "黄金ガニ", spr: "crab", pal: "light", hp: 600, atk: 40, def: 120, agi: 30, exp: 500, gold: 8000,
    resist: ["fire", "ice", "thunder"], flees: 0.4 },
  mithrilwisp: { name: "ミスリルビ", spr: "wisp", pal: "light", hp: 12, atk: 50, def: 300, agi: 40, exp: 8000, gold: 100,
    absorb: ["fire", "ice", "thunder", "holy"], flees: 0.35 },
  // 夜の国 (Lv70〜90たい さいこうきゅうの かりば)
  nightbat: { name: "夜コウモリ", spr: "bat", pal: "dark", hp: 900, atk: 88, def: 34, agi: 44, exp: 1750, gold: 1300,
    weak: ["fire"], inflict: { status: "blind", rate: 0.25 } },
  duskwolf: { name: "たそがれオオカミ", spr: "gargoyle", pal: "dark", hp: 950, atk: 92, def: 38, agi: 40, exp: 1850, gold: 1400,
    weak: ["fire"] },
  shadeknight: { name: "シェイドナイト", spr: "pal_d", pal: "dark", hp: 1000, atk: 96, def: 48, agi: 30, exp: 1950, gold: 1550,
    race: "undead", weak: ["fire", "holy"] },
  nighteye: { name: "夜のひとみ", spr: "eye", pal: "dark", hp: 880, atk: 86, def: 36, agi: 34, exp: 1700, gold: 1250,
    weak: ["holy"], inflict: { status: "silence", rate: 0.25 } },
  dreamslime: { name: "夢くいゼリー", spr: "slime", pal: "dark", hp: 920, atk: 84, def: 42, agi: 26, exp: 1800, gold: 1350,
    resist: ["ice", "thunder"], weak: ["fire"], inflict: { status: "toad", rate: 0.18 } },
  starmoth: { name: "ほしガ", spr: "mantis", pal: "light", hp: 860, atk: 90, def: 32, agi: 46, exp: 1750, gold: 1300,
    weak: ["fire"], acts: [{ spell: "e_gale", rate: 0.3 }] },
  noctia: { name: "夜の女王 ノクティア", spr: "celia", pal: "dark", boss: true, scale: 4,
    hp: 16000, atk: 110, def: 52, agi: 34, exp: 80000, gold: 35000,
    absorb: ["ice", "thunder"], resist: ["holy"], weak: ["fire"],
    acts: [{ spell: "e_starfall", rate: 0.25 }, { spell: "e_meteo", rate: 0.2 }, { spell: "e_silence", rate: 0.15 }] },
  // 幻のしろの うらボス
  regalia: { name: "幻の王 レガリア", spr: "king", pal: "light", boss: true, scale: 4,
    hp: 14000, atk: 105, def: 50, agi: 30, exp: 70000, gold: 30000,
    absorb: ["fire", "ice", "thunder"], weak: ["holy"],
    acts: [{ spell: "e_meteo", rate: 0.22 }, { spell: "e_starfall", rate: 0.2 }, { spell: "e_toad", rate: 0.12 }] },
  // 星のはかの ぬし (最強の かくしボス)
  granstella: { name: "星々の王 グランステラ", spr: "voidos", pal: "light", boss: true, scale: 4,
    hp: 12000, atk: 95, def: 40, agi: 26, exp: 50000, gold: 20000,
    absorb: ["ice", "thunder"], resist: ["fire"], weak: ["holy"],
    acts: [{ spell: "e_starfall", rate: 0.25 }, { spell: "e_meteo", rate: 0.2 }, { spell: "e_bigwave", rate: 0.2 }] },
  // 試練の山の ぬし (かくとうかの ライバル)
  garon: { name: "拳王 ガロン", spr: "gou", pal: "dark", boss: true, scale: 2,
    hp: 1400, atk: 46, def: 20, agi: 22, exp: 3000, gold: 0,
    resist: ["fire", "ice", "thunder"] },
  // 星の世界 (Lv30〜のレベリングエリア)
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
  voidos: { name: "星くらい ヴォイドス", spr: "voidos", boss: true, scale: 4,
    hp: 3200, atk: 48, def: 20, agi: 16, exp: 0, gold: 0,
    absorb: ["fire", "ice", "thunder"],
    acts: [{ spell: "e_starfall", rate: 0.25 }, { spell: "e_bigwave", rate: 0.2 }], phase2: "voidos2" },
  voidos2: { name: "ヴォイドス 真の姿", spr: "voidos", pal: "dark", boss: true, scale: 4,
    hp: 2600, atk: 54, def: 22, agi: 20, exp: 0, gold: 0,
    race: "demon", weak: ["holy"], absorb: ["fire", "ice", "thunder"],
    acts: [{ spell: "e_starfall", rate: 0.3 }, { spell: "e_tornado", rate: 0.2 }] },

  // ---- 海の底 / かいてい神殿 ----
  octopus: { name: "オクトパス", spr: "kraken", pal: "light", hp: 180, atk: 40, def: 14, agi: 15, exp: 340, gold: 300,
    weak: ["thunder"], acts: [{ spell: "e_ink", rate: 0.3 }] },
  deepworm: { name: "ディープワーム", spr: "worm", pal: "dark", hp: 220, atk: 44, def: 18, agi: 8, exp: 360, gold: 320,
    weak: ["thunder"] },
  merman: { name: "マーマンナイト", spr: "soldier", pal: "light", hp: 190, atk: 44, def: 18, agi: 16, exp: 350, gold: 330,
    weak: ["thunder"] },
  abyssdemon: { name: "アビスデーモン", spr: "demon", pal: "dark", hp: 200, atk: 42, def: 16, agi: 17, exp: 380, gold: 350,
    race: "demon", weak: ["holy"], acts: [{ spell: "e_ice", rate: 0.3 }] },
  levia: { name: "深海のぬし リヴァイア", spr: "kraken", pal: "dark", boss: true, scale: 4,
    hp: 2800, atk: 44, def: 20, agi: 15, exp: 2400, gold: 3000,
    absorb: ["ice"], resist: ["fire"],
    acts: [{ spell: "e_bigwave", rate: 0.3 }, { spell: "e_ink", rate: 0.25 }] },

  // ---- 空の島 / 風の神殿 ----
  stormbird: { name: "ストームバード", spr: "bird", hp: 150, atk: 40, def: 14, agi: 18, exp: 280, gold: 250,
    weak: ["thunder"] },
  harpy: { name: "スカイハーピー", spr: "bird", pal: "light", hp: 130, atk: 36, def: 12, agi: 20, exp: 260, gold: 240,
    weak: ["thunder"], acts: [{ spell: "e_silence", rate: 0.3 }] },
  skydragon: { name: "スカイドラゴン", spr: "dragon", pal: "light", hp: 200, atk: 42, def: 16, agi: 14, exp: 320, gold: 300,
    race: "dragon", acts: [{ spell: "e_bolt", rate: 0.3 }] },
  winddemon: { name: "ウィンドデーモン", spr: "demon", hp: 170, atk: 40, def: 15, agi: 17, exp: 300, gold: 280,
    race: "demon", weak: ["holy"], acts: [{ spell: "e_gale", rate: 0.35 }] },
  tempest: { name: "嵐の王 テンペスト", spr: "bird", boss: true, scale: 4,
    hp: 2400, atk: 42, def: 18, agi: 16, exp: 1800, gold: 2200,
    absorb: ["thunder"], resist: ["ice"],
    acts: [{ spell: "e_tornado", rate: 0.3 }, { spell: "e_bolt2", rate: 0.25 }] },

  // ---- 地底神殿 ----
  darkpriest: { name: "ダークプリースト", spr: "wizard", pal: "light", hp: 90, atk: 24, def: 10, agi: 12, exp: 200, gold: 180,
    weak: ["holy"], acts: [{ spell: "e_bolt", rate: 0.35 }, { spell: "e_silence", rate: 0.2 }] },
  guardian: { name: "ガーディアン", spr: "golem", pal: "light", hp: 180, atk: 36, def: 20, agi: 6, exp: 240, gold: 220,
    weak: ["thunder"] },
  deathknight: { name: "デスナイト", spr: "hero_d", pal: "dark", hp: 160, atk: 40, def: 18, agi: 13, exp: 260, gold: 240,
    race: "undead", weak: ["fire", "holy"] },
  shadowbeast: { name: "シャドウビースト", spr: "gargoyle", pal: "dark", hp: 140, atk: 38, def: 14, agi: 16, exp: 230, gold: 200,
    weak: ["holy"] },
  meteogolem: { name: "隕石の番人", spr: "golem", pal: "light", boss: true, scale: 3,
    hp: 1500, atk: 38, def: 20, agi: 6, exp: 900, gold: 1200,
    resist: ["fire", "ice"],
    acts: [{ spell: "e_quake", rate: 0.3 }] },
  glad: { name: "地底の魔人 グラード", spr: "demon", pal: "light", boss: true, scale: 4,
    hp: 2000, atk: 38, def: 16, agi: 12, exp: 1200, gold: 1500,
    race: "demon", resist: ["fire"],
    acts: [{ spell: "e_quake", rate: 0.25 }, { spell: "e_silence", rate: 0.2 }, { spell: "e_fire2", rate: 0.2 }] },
  magmaworm: { name: "マグマウォーム", spr: "worm", boss: true, scale: 4,
    hp: 1300, atk: 34, def: 14, agi: 10, exp: 700, gold: 1000,
    absorb: ["fire"],
    acts: [{ spell: "e_eruption", rate: 0.3 }, { spell: "e_fire2", rate: 0.2 }] },

  // ボスは 8ばい弱点で とけないよう たいせい/きゅうしゅう ちゅうしん。
  // れいがい: ザルバ 真の姿 だけ せい属性が じゃくてん (聖剣が きめて)
  demonguard: { name: "デーモンガード", spr: "demon", boss: true, scale: 3,
    hp: 260, atk: 15, def: 5, agi: 6, exp: 90, gold: 150,
    race: "demon", absorb: ["ice"],
    acts: [{ spell: "e_ice_all", rate: 0.35 }] },
  shadow: { name: "暗黒のかげ", spr: "hero_d", pal: "dark", boss: true, scale: 3, trial: true,
    hp: 999, atk: 17, def: 99, agi: 7, exp: 0, gold: 0 },
  zarba: { name: "魔王ザルバ", spr: "zarba", boss: true, scale: 3,
    hp: 600, atk: 24, def: 8, agi: 9, exp: 0, gold: 0,
    race: "demon", resist: ["fire", "ice"],
    acts: [{ spell: "e_fire2", rate: 0.3 }], phase2: "zarba2" },
  zarba2: { name: "ザルバ 真の姿", spr: "zarba", pal: "dark", boss: true, scale: 4,
    hp: 1600, atk: 30, def: 10, agi: 12, exp: 0, gold: 0,
    race: "demon", weak: ["holy"], absorb: ["fire"],
    acts: [{ spell: "e_meteo", rate: 0.3 }, { spell: "e_ice_all", rate: 0.2 }] },
};

// ---------------- エンカウントテーブル ----------------
DATA.encounters = {
  plains_w: { rate: 1 / 15, groups: [["goblin"], ["goblin", "goblin"], ["bat", "bat"], ["toad", "goblin"], ["greenslime", "greenslime"], ["greenslime", "goblin"], ["firewisp", "firewisp"]] },
  plains_e: { rate: 1 / 14, groups: [["goblin", "goblin", "bat"], ["toad", "toad"], ["skeleton"], ["wizard", "bat"], ["bladehopper"], ["bladehopper", "goblin"], ["sandcrab", "firewisp"]],
    rare: ["mithrilbaby"], rareRate: 0.06 },
  north:    { rate: 1 / 13, groups: [["skeleton", "skeleton"], ["wizard", "wizard"], ["gargoyle"], ["skeleton", "wizard"], ["dunestalker", "dunestalker"]],
    rare: ["goldcrab"], rareRate: 0.05 },
  cave:     { rate: 1 / 13, groups: [["bat", "bat"], ["skeleton"], ["toad", "toad", "bat"], ["skeleton", "bat", "bat"], ["greenslime", "bat"]] },
  shrine:   { rate: 1 / 13, groups: [["skeleton", "skeleton"], ["gargoyle", "wizard"], ["gargoyle", "gargoyle"], ["dunestalker", "skeleton"]] },
  tower:    { rate: 1 / 12, groups: [["ddemon"], ["golem"], ["gargoyle", "gargoyle", "wizard"], ["ddemon", "wizard"], ["gazer"], ["gazer", "gargoyle"], ["rockcrab", "rockcrab"]] },
  icecave:  { rate: 1 / 13, groups: [["icegoblin", "icegoblin"], ["icebat", "icebat", "icegoblin"], ["frostwiz", "icebat"], ["frostgar"], ["babydragon"], ["frostwiz", "frostwiz"], ["iceslime", "iceslime"], ["frostmantis"], ["bluewisp", "bluewisp"]] },
  waterway: { rate: 1 / 13, groups: [["mudtoad", "mudtoad"], ["sewerbat", "sewerbat", "sewerbat"], ["waterelem", "sewerbat"], ["sludge"], ["waterelem", "waterelem"], ["sludge", "mudtoad"], ["greenslime", "greenslime", "greenslime"]] },
  magma:    { rate: 1 / 13, groups: [["flamegoblin", "flamegoblin"], ["firelizard"], ["flamewiz", "flamegoblin"], ["magmagolem"], ["flamedemon"], ["firelizard", "flamewiz"], ["flamejelly", "flamejelly"]] },
  underworld: { rate: 1 / 14, groups: [["darkknight"], ["darksoldier", "darksoldier"], ["flamedemon", "darksoldier"], ["firelizard", "firelizard"], ["magmagolem", "flamewiz"], ["darkknight", "darksoldier"]],
    rare: ["mithrilbaby", "mithrilbaby"], rareRate: 0.06 },
  temple:   { rate: 1 / 13, groups: [["darkpriest", "darkpriest"], ["guardian"], ["deathknight"], ["shadowbeast", "darkpriest"], ["deathknight", "shadowbeast"], ["guardian", "darkpriest"], ["abyssgazer"], ["boltwisp", "boltwisp"]] },
  sky:      { rate: 1 / 14, groups: [["stormbird"], ["harpy", "harpy"], ["stormbird", "harpy"], ["skydragon"], ["winddemon"], ["winddemon", "harpy"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  sea:      { rate: 1 / 14, groups: [["octopus"], ["merman", "merman"], ["deepworm"], ["abyssdemon", "merman"], ["octopus", "merman"], ["abyssdemon"], ["marinejelly", "merman"], ["seacrab", "seacrab"], ["abysscrab"]],
    rare: ["kingcrab"], rareRate: 0.05 },
  lostwoods: { rate: 1 / 12, groups: [["woodgoblin", "woodgoblin"], ["vampbat", "vampbat"], ["madflower"], ["woodgoblin", "vampbat"], ["madflower", "woodgoblin"], ["bladehopper", "bladehopper"], ["willowisp"]],
    rare: ["kingslime"], rareRate: 0.07 },
  startower: { rate: 1 / 14, groups: [["arcdemon"], ["chaosknight"], ["nebulabird", "nebulabird"], ["voidgolem"], ["arcdemon", "nebulabird"], ["chaosknight", "arcdemon"], ["voideye", "voideye"], ["ghostwisp", "voidflame"]],
    rare: ["mithrildragon"], rareRate: 0.06 },
  world7: { rate: 1 / 14, groups: [["nightbat", "nightbat"], ["duskwolf"], ["starmoth", "nightbat"], ["nighteye", "duskwolf"], ["dreamslime"], ["starmoth", "starmoth"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  cathedral: { rate: 1 / 12, groups: [["shadeknight"], ["nighteye", "nighteye"], ["shadeknight", "nightbat"], ["dreamslime", "nighteye"], ["shadeknight", "shadeknight"], ["duskwolf", "starmoth"], ["nightwisp", "dreamwisp"]],
    rare: ["mithrildragon"], rareRate: 0.07 },
  world6: { rate: 1 / 14, groups: [["stormimp", "stormimp"], ["thunderhawk"], ["boltjelly", "stormimp"], ["stormcaller", "thunderhawk"], ["galeserpent"], ["boltjelly", "boltjelly"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  stormshrine: { rate: 1 / 12, groups: [["cloudknight"], ["stormcaller", "stormcaller"], ["galeserpent", "boltjelly"], ["cloudknight", "stormimp"], ["stormcaller", "galeserpent"], ["cloudknight", "cloudknight"], ["stormwisp", "stormwisp"]],
    rare: ["mithrilwisp"], rareRate: 0.07 },
  world5: { rate: 1 / 14, groups: [["junglecat", "junglecat"], ["rubyhornet", "rubyhornet"], ["vineflower"], ["shadowmonkey", "junglecat"], ["mossgolem"], ["vineflower", "rubyhornet"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  ruins: { rate: 1 / 12, groups: [["ruinsguard", "ruinsguard"], ["mossgolem", "ruinsguard"], ["shadowmonkey", "shadowmonkey"], ["vineflower", "mossgolem"], ["ruinsguard", "ruinsguard", "shadowmonkey"], ["mossgolem", "mossgolem"], ["junglecrab", "junglecrab"]],
    rare: ["mithrildragon"], rareRate: 0.07 },
  world4: { rate: 1 / 14, groups: [["sandworm2", "sandworm2"], ["vulture"], ["scarab", "sandworm2"], ["desertghost", "vulture"], ["sandgolem"], ["scarab", "scarab"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  sandtomb: { rate: 1 / 12, groups: [["mummy", "mummy"], ["desertghost", "desertghost"], ["sandgolem", "mummy"], ["scarab", "desertghost"], ["mummy", "mummy", "desertghost"], ["sandgolem", "sandgolem"], ["tombcrab", "tombcrab"]],
    rare: ["mithrildragon"], rareRate: 0.07 },
  world3: { rate: 1 / 14, groups: [["snowwolf", "snowwolf"], ["blizzardhawk"], ["icemaiden", "snowwolf"], ["aurorawisp", "aurorawisp"], ["frostogre"], ["blizzardhawk", "icemaiden"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  glaciercave: { rate: 1 / 12, groups: [["glacierworm"], ["frostogre", "aurorawisp"], ["icemaiden", "icemaiden"], ["glacierworm", "aurorawisp"], ["frostogre", "frostogre"], ["snowwolf", "snowwolf", "blizzardhawk"], ["glacierhermit"]],
    rare: ["mithrildragon"], rareRate: 0.07 },
  world2: { rate: 1 / 14, groups: [["mirrorling", "mirrorling"], ["twinfang"], ["dunebird", "dunebird"], ["echowisp", "mirrorling"], ["twinfang", "dunebird"], ["lakeserpent"]],
    rare: ["mithrildragon"], rareRate: 0.05 },
  mirrorcave: { rate: 1 / 13, groups: [["mirrorling", "mirrorling"], ["echowisp", "echowisp"], ["chronomite"], ["lakeserpent", "mirrorling"], ["chronomite", "echowisp"], ["mirrorwisp", "mirrorwisp"]],
    rare: ["mithrilbaby", "mithrilbaby"], rareRate: 0.06 },
  eternaltower: { rate: 1 / 12, groups: [["chronomite", "chronomite"], ["echowisp", "twinfang"], ["mirrorling", "mirrorling", "echowisp"], ["chronomite", "twinfang"], ["lakeserpent", "chronomite"]],
    rare: ["mithrildragon"], rareRate: 0.06 },
  stargrave: { rate: 1 / 12, groups: [["deathknight", "deathknight"], ["chaosknight", "voideye"], ["stareater"], ["abyssgazer", "abyssgazer"], ["stareater", "voideye"], ["chaosknight", "chaosknight"]],
    rare: ["mithrildragon"], rareRate: 0.08 },
  trialmt: { rate: 1 / 13, groups: [["gargoyle", "gargoyle"], ["dunestalker", "dunestalker"], ["gazer"], ["golem"], ["gazer", "dunestalker"], ["golem", "gargoyle"]] },
  starworld: { rate: 1 / 14, groups: [["starimp", "starimp"], ["lunabat", "lunabat"], ["cometwisp"], ["starimp", "lunabat"], ["stargolem"], ["cometwisp", "lunabat"], ["starjelly", "starjelly"]],
    rare: ["mithrildragon"], rareRate: 0.07 },
  crater: { rate: 1 / 12, groups: [["stargolem", "starimp"], ["moondragon"], ["cometwisp", "cometwisp"], ["stargolem", "stargolem"], ["moondragon", "lunabat"], ["starimp", "starimp", "lunabat"], ["crystalmantis"], ["stareater"], ["crystalcrab"]],
    rare: ["mithrildragon", "mithrilbaby"], rareRate: 0.07 },
};

// ---------------- アクセサリ (だい3のそうびわく・だれでも装備可) ----------------
Object.assign(DATA.items, (() => {
  const ALL = ["leon", "glen", "gou", "celia", "rod"];
  return {
    // 売店ティア
    acc_gauntlet: { name: "力の籠手",     kind: "acc", price: 900,  str: 5, tag: "ちから+5",    who: ALL, desc: "力が 5 あがる" },
    acc_boots:    { name: "疾風のくつ",     kind: "acc", price: 1000, agi: 5, tag: "素早さ+5",  who: ALL, desc: "素早さが 5 あがる" },
    acc_belt:     { name: "体力ベルト", kind: "acc", price: 900,  vit: 8, tag: "体力+8", who: ALL, desc: "体力が 8 あがる" },
    acc_circlet:  { name: "賢者のわ",     kind: "acc", price: 1000, int: 5, tag: "知性+5",    who: ALL, desc: "知性が 5 あがる" },
    acc_firecape: { name: "日よけのマント",   kind: "acc", price: 1400, resist: { fire: 0.5 }, tag: "ほのお半減", who: ALL, desc: "ほのおダメージ半減" },
    acc_icecape:  { name: "雪よけのマント", kind: "acc", price: 1400, resist: { ice: 0.5 },  tag: "こおり半減", who: ALL, desc: "こおりダメージ半減" },
    // イベントティア
    acc_boltcharm: { name: "雷よけのお守り", kind: "acc", price: 0, resist: { thunder: 0 }, tag: "雷無効", who: ALL, desc: "雷ダメージ無効" },
    acc_venomband: { name: "毒よけのバングル", kind: "acc", price: 0, guard: ["poison"], tag: "どく防止", who: ALL, desc: "毒に かからない" },
    acc_bellcharm: { name: "銀の鈴",         kind: "acc", price: 0, guard: ["silence", "toad"], tag: "沈黙/カエル防止", who: ALL, desc: "沈黙と カエルを ふせぐ" },
    acc_owlcharm:  { name: "ふくろうのお守り", kind: "acc", price: 0, guard: ["blind"], agi: 3, tag: "暗闇防止", who: ALL, desc: "暗闇を ふせぐ" },
    acc_warcharm:  { name: "闘魂のお守り", kind: "acc", price: 0, abil: "limitx2", tag: "必殺2倍速", who: ALL, desc: "必殺ゲージが 2ばい たまる" },
    acc_moonveil:  { name: "月のベール",       kind: "acc", price: 0, resist: { holy: 0.5 }, int: 3, tag: "せい半減", who: ALL, desc: "せいなるダメージ半減" },
    // レアティア (かくし宝箱)
    acc_manaring: { name: "マナの指輪",     kind: "acc", price: 0, abil: "mphalf", int: 4, tag: "MP半減",       who: ALL, desc: "MPしょうひ半減" },
    acc_lifeorb:  { name: "命の珠",     kind: "acc", price: 0, abil: "regen",  tag: "HPじどう回復",  who: ALL, desc: "ターンごとに HP回復" },
    acc_hawkring: { name: "鷹の目の指輪", kind: "acc", price: 0, abil: "critx2", str: 3, tag: "かいしん2倍", who: ALL, desc: "会心の一撃 2ばい" },
    acc_aegis:    { name: "イージスのかけら", kind: "acc", price: 0, abil: "autoprotect", def: 5, tag: "オートプロテス", who: ALL, desc: "戦闘開始時から プロテス" },
    acc_windpin:  { name: "風のかんざし",   kind: "acc", price: 0, agi: 10, tag: "素早さ+10", who: ALL, desc: "素早さが 10 あがる" },
    // 伝説級
    acc_dragonheart: { name: "りゅうの心",   kind: "acc", price: 0, str: 8, vit: 8, resist: { fire: 0.5, ice: 0.5, thunder: 0.5 }, tag: "三属性半減", who: ALL, desc: "炎氷雷半減+ちから体力+8" },
    acc_stargem:     { name: "星の紋章", kind: "acc", price: 0, str: 6, agi: 6, vit: 6, int: 6, tag: "全ステ+6", who: ALL, desc: "ぜんステータスが 6 あがる" },
    acc_voidseal:    { name: "虚空の封印", kind: "acc", price: 0, def: 8, guard: ["poison", "blind", "silence", "toad"], tag: "全異常防止", who: ALL, desc: "すべての 状態異常を ふせぐ" },
    // 汎用アクセサリ第2弾
    acc_galecloak: { name: "疾風のマント",   kind: "acc", price: 6000,  agi: 6, def: 4, tag: "素早さ+6 守+4", who: ALL, desc: "素早さ6と 防御4が あがる" },
    acc_guardring: { name: "守りの指輪",     kind: "acc", price: 6500,  def: 8, tag: "防御+8", who: ALL, desc: "防御が 8 あがる" },
    acc_giantbelt: { name: "巨人の帯",       kind: "acc", price: 8000,  vit: 12, str: 4, tag: "体力+12 力+4", who: ALL, desc: "体力12と 力4が あがる" },
    acc_magepend:  { name: "魔導のペンダント", kind: "acc", price: 8000, int: 8, tag: "知性+8", who: ALL, desc: "知性が 8 あがる" },
    acc_luckcoin:  { name: "幸運のコイン",   kind: "acc", price: 15000, abil: "gilup", tag: "ギル1.5倍", who: ALL, desc: "戦闘のギルが 1.5倍になる" },
    // キャラ最強アクセサリ (個人イベント第2章の報酬)
    acc_kingcrest: { name: "王聖の紋章",   kind: "acc", price: 0, str: 10, vit: 10, abil: "counterup", tag: "カウンター率75%", who: ["leon"], desc: "力体力+10。かばうのカウンター率75%" },
    acc_dragonsoul: { name: "竜の魂",      kind: "acc", price: 0, str: 12, agi: 8, abil: "jumpup", tag: "ジャンプ1.25倍", who: ["glen"], desc: "力+12素早+8。ジャンプ威力1.25倍" },
    acc_warband:   { name: "闘神の腕輪",   kind: "acc", price: 0, str: 14, vit: 6, abil: "critx2", tag: "会心2倍", who: ["gou"], desc: "力+14体力+6。会心が 2倍でやすい" },
    acc_stprayer:  { name: "大聖女の祈り", kind: "acc", price: 0, int: 12, vit: 8, abil: "prayup", tag: "祈り100%", who: ["celia"], desc: "知性+12体力+8。祈りが必ず成功" },
    acc_sageeye:   { name: "賢王の眼",     kind: "acc", price: 0, int: 14, agi: 6, abil: "castfast", tag: "詠唱4割短縮", who: ["rod"], desc: "知性+14素早+6。詠唱時間が4割縮む" },
    // 能力アップアイテム (高価だが店で買える恒久強化)
    fruit_life: { name: "生命の果実", kind: "use", price: 25000, statHp: 20, desc: "最大HPが 20 あがる (永続)" },
    fruit_mana: { name: "魔力の果実", kind: "use", price: 30000, statMp: 10, desc: "最大MPが 10 あがる (永続)" },
    // 超高額・超高性能アクセサリ
    acc_herobangle: { name: "英雄の腕輪",     kind: "acc", price: 350000, str: 15, agi: 15, vit: 15, int: 15, tag: "全ステ+15", who: ALL, desc: "全ステータスが 15 あがる" },
    acc_phoenixpin: { name: "不死鳥の羽飾り", kind: "acc", price: 500000, abil: "autolife", vit: 8, tag: "戦闘不能から自動復活", who: ALL, desc: "倒れても一度だけ HP半分で自動復活 (1戦闘1回)" },
    // フィールドアイテム
    wing_return: { name: "帰還の翼", kind: "use", price: 120, escape: true, desc: "まちや ダンジョンから そとへ ひとっとび" },
  };
})());

// ---------------- ショップ ----------------
DATA.shops = {
  nox: {
    name: "ノクスの みせ",
    stock: ["nightdrop", "xpotion", "megapotion", "hiether", "elixir", "phoenix", "remedy",
            "w_nightclaw", "a_dusk"],
  },
  volte: {
    name: "ボルテの みせ",
    stock: ["oasiswater", "hipotion", "megapotion", "xpotion", "hiether", "phoenix", "remedy",
            "w_boltblade", "w_stormrod", "a_stormmail", "a_boltgi"],
  },
  liefe: {
    name: "リーフェの みせ",
    stock: ["oasiswater", "hipotion", "megapotion", "xpotion", "hiether", "phoenix", "remedy",
            "w_leafblade", "w_junglerod", "a_vinemail"],
  },
  zahra: {
    name: "ザハラの みせ",
    stock: ["oasiswater", "hipotion", "megapotion", "xpotion", "hiether", "phoenix", "remedy",
            "w_scimitar", "a_desert", "a_sandgi"],
  },
  frim: {
    name: "フリムの みせ",
    stock: ["hipotion", "megapotion", "xpotion", "ether", "hiether", "phoenix", "remedy",
            "w_icefang", "a_frostmail", "wing_return", "acc_icecape"],
  },
  twine: {
    name: "トワインの みせ",
    stock: ["hipotion", "megapotion", "ether", "phoenix", "remedy", "xpotion",
            "w_twin", "a_lake"],
  },
  selene: {
    name: "月のみやこの みせ",
    stock: ["xpotion", "megapotion", "elixir", "hiether", "phoenix", "remedy",
            "w_comet", "w_starlance", "w_cosmoclaw", "w_nebularod", "w_moonwand",
            "a_comet", "a_moonrobe", "a_stargi",
            "acc_galecloak", "acc_guardring", "acc_giantbelt", "acc_magepend", "acc_luckcoin",
            "fruit_life", "fruit_mana", "acc_herobangle", "acc_phoenixpin"],
  },
  royal: {
    name: "王宮ごようたし",
    stock: ["megapotion", "elixir", "ether", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "a_royalmail", "a_royal"],
  },
  muspel: {
    name: "ムスペルのかじば",
    stock: ["hipotion", "megapotion", "ether", "elixir", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "w_iceblade", "w_halberd", "w_battleclaw", "w_sagestaff", "w_spiritrod",
            "a_dwarf", "a_sage", "a_master", "wing_return", "acc_firecape"],
  },
  port: {
    name: "ソレイユの店",
    stock: ["potion", "hipotion", "megapotion", "ether", "phoenix", "antidote", "eyedrops", "echoherb", "kiss",
            "w_flame", "w_lance", "w_thunderclaw", "w_crystalrod",
            "a_aqua", "a_ice", "a_gi",
            "wing_return", "acc_gauntlet", "acc_boots", "acc_belt", "acc_circlet"],
  },
  town: {
    name: "ミストの店",
    stock: ["potion", "hipotion", "ether", "antidote", "eyedrops", "echoherb", "kiss", "phoenix",
            "w_steel", "w_mythril", "w_lance", "w_ironclaw", "w_wizstaff", "w_mace",
            "a_steel", "a_leather", "a_silk", "wing_return"],
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
    "Q": { tile: "icon_castle" },
    "D": { tile: "icon_town" },
    "V": { tile: "icon_tower" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwmmmmmmmmmmmmmmwwwwwwwwwwwwwwwwwwwwwwww",
    "wwm..........Qmwwwwwwwwwww.....wwwwwwwww",
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
    "ww..f..........Vmmmm..............wwwwww",
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
    "ww........D.....mmmm......f..H....wwwwww",
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
    { x: 10, y: 28, type: "enter", warp: { map: "airdock", x: 9, y: 8, dir: "u" } },
    { x: 15, y: 14, type: "enter", warp: { map: "watchtower1", x: 5, y: 7, dir: "u" } },
    { x: 27, y: 22, type: "enter", warp: { map: "town", x: 9, y: 14, dir: "u" } },
    { x: 16, y: 20, type: "enter", warp: { map: "cave", x: 1, y: 10, dir: "r" } },
    { x: 19, y: 20, type: "enter", warp: { map: "cave", x: 22, y: 10, dir: "l" } },
    { x: 16, y: 10, type: "enter", warp: { map: "trialmt1", x: 7, y: 10, dir: "u" } },
    { x: 13, y: 3, type: "enter",
      cond: { all: ["craterBoss", "mirrorBoss", "glacierBoss", "tombBoss", "ruinsBoss", "stormBoss"] },
      failScript: [{ msg: "きたの そらに しろのような しんきろうが\nゆらめいている……。すべての ちいきの ぬしが\nしずまるとき 扉は ひらくという。" }],
      warp: { map: "phantomhall", x: 7, y: 10, dir: "u" } },
    { x: 8, y: 4, type: "enter",
      cond: { flag: "crystal" },
      failScript: [{ msg: "ほこらの扉は かたく とざされている。\n(せいなる クリスタルが ひつようだ)" }],
      warp: { map: "shrine", x: 7, y: 14, dir: "u" } },
    { x: 28, y: 4, type: "enter",
      cond: { flag: "paladin" },
      failScript: [{ msg: "とうは くろい 結界に\nつつまれている……!" }],
      warp: { map: "tower1", x: 6, y: 10, dir: "u" } },
    { x: 21, y: 7, type: "enter", warp: { map: "icecave", x: 1, y: 12, dir: "u" } },
    { x: 9, y: 30, type: "enter", warp: { map: "waterway", x: 1, y: 8, dir: "u" } },
    { x: 30, y: 16, type: "enter", warp: { map: "port", x: 10, y: 1, dir: "d" } },
    { x: 29, y: 28, type: "enter",
      cond: { flag: "paladin" },
      failScript: [{ msg: "じめんに おおきな あなが あいている。\nそこから ねっぷうが ふきあげてくる…\n(今は おりるべきでは なさそうだ)" }],
      scriptId: "bigholeDescend" },
    { x: 5, y: 24, type: "enter", warp: { map: "lostwoods", x: 5, y: 8, dir: "u" } },
  ],
  npcs: [],
  chests: [],
};

// ---------------- バロン城 ----------------
DATA.maps.castle = {
  name: "バロン城",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    "B": { tile: "banner", solid: true },
    "T": { tile: "torch", solid: true },
    ".": { tile: "floor" },
    "c": { tile: "carpet" },
    "P": { tile: "pillar", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##B#T##B#cc#B##T#B##",
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
    { id: "minister", x: 5, y: 1, spr: "villager", showFlag: "clear",
      script: [
        { cond: { flag: "summitDone" },
          then: [{ msg: "大臣「世界会議の ごえんは 今も\nつづいております。すべて あなたがたの\nおかげですぞ」" }],
          else: [
            { cond: { all: ["inviteTwine", "inviteFrim", "inviteZahra", "inviteDverg"] },
              then: [
                { msg: "大臣「かくちの おさが そろいましたぞ!\nでは、だいいっかい 世界会議を\n開催 いたします!」" },
                { msg: "トワインのおさ「湖の さちを わかちあおう」\nフリムのむらおさ「氷の みちを ひらこう」" },
                { msg: "ザハラのぞくちょう「砂漠の キャラバンが\nみなを つなごう」\nバルドおう「地底の てつを とどけるぞ! ガハハ」" },
                { msg: "こうして 世界は ひとつの わになった。\nはしわたしを した 英雄たちに\n感謝の おくりものが おくられた。" },
                { give: { item: "a_unity" } },
                { give: { gold: 10000 } },
                { msg: "絆のマントと 10000ギルを 手に入れた!" },
                { flag: ["summitDone", 1] },
              ],
              else: [
                { cond: { flag: "summitQuest" },
                  then: [{ msg: "大臣「トワイン・フリム・ザハラ・地底の\n王宮。4にんの おさに 招待を\nつたえて くだされ」" }],
                  else: [
                    { cond: { all: ["mirrorBoss", "glacierBoss", "tombBoss"] },
                      then: [
                        { msg: "大臣「かくちの わざわいを しずめた\nあなたがたに お願いが ござる。おうは\n『世界会議』を ひらきたいと おおせだ」" },
                        { msg: "「トワイン・フリム・ザハラの おさと\n地底の バルドおうに 招待を\nとどけては くださらんか」" },
                        { flag: ["summitQuest", 1] },
                      ],
                      else: [{ msg: "大臣「世界には まだ わざわいの けはいが\nのこっております。かがみ・ひょうが・だいびょう……\nおさたちの な闇を といてくだされ」" }] },
                  ] },
              ] },
          ] },
      ] },
    { id: "hall_guide", x: 14, y: 1, spr: "soldier", showFlag: "clear",
      script: [
        { msg: "番人「ここは 英雄の きろくを\nまつる『殿堂の間』への いりぐち。\nはいられますか?」" },
        { menu: { options: [
          { label: "はいる", ops: [{ warp: { map: "halloffame", x: 6, y: 7, dir: "u" } }] },
          { label: "やめる", ops: [] },
        ] } },
      ] },
    { id: "old_knight", x: 16, y: 9, spr: "soldier", showFlag: "nightBoss",
      script: [
        { cond: { flag: "leonEp2" },
          then: [{ msg: "ろうきし「そなたの ちちうえも きっと\nほこりに おもっておられる。\nよい かおに なったな、レオンどの」" }],
          else: [
            { msg: "ろうきし「レオンどの。 わしは そなたの\nちちうえに つかえた ふるい きしじゃ。\nすこし はなしても よいかな」" },
            { msg: "「やみに おちても なお たちあがり、\n光を とりもどした そなたの あゆみ、\nすべて みせてもろうた」" },
            { msg: "「ちちうえが のこした この マントを\nそなたに。 『守るべきものの ために けんをとれ』\n……くちぐせで あられたよ」" },
            { msg: "レオン「……ちちうえの。 ありがたく。\nこの ちかい、けっして わすれません」" },
            { give: { item: "a_oath" } },
            { give: { item: "acc_kingcrest" } },
            { msg: "誓いのマントと 王聖の紋章を 手に入れた!" },
            { flag: ["leonEp2", 1] },
          ] },
      ] },
    { id: "castle_maid", x: 4, y: 9, spr: "villager", wander: true,
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "じじょ「おしろにも ほんとうの 平和が\nもどりました。王様は まいあさ\nはたけを たがやして おいでです」" }],
          else: [
            { cond: { flag: "clear" },
              then: [{ msg: "じじょ「王様が もとに もどられて\nしろじゅうが おおよろこびです。\nありがとうございます……!」" }],
              else: [{ msg: "じじょ「さいきんの 王様は\nどこか ようすが へんなのです。\nめ月が するどいというか……」" }] },
          ] },
      ] },
    { id: "king", x: 9, y: 1, spr: "king",
      script: [
        { cond: { flag: "clear" },
          then: [{ msg: "バロンおう「レオンよ……\nこのくには おまえたちに すくわれた。\n心から れいを いう」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "バロンおう「……力が…… みなぎる……\nくくく…… こい レオン……\nまてんろうで まっているぞ……」" }],
              else: [{ msg: "バロンおう「クリスタルは まだか!\nはやく うばってくるのだ!\nこれは めいれいだ!!」" }] },
          ] },
      ] },
    { id: "guard1", x: 8, y: 9, spr: "soldier",
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "兵士「世界の きゅうせいしゅ\nばんざーい!! 王様も たいへん\nおよろこびです!」" }],
          else: [
            { cond: { flag: "clear" },
              then: [{ msg: "兵士「レオンさま ばんざい!\nパラディン ばんざい!」" }],
              else: [{ msg: "兵士「にしの洞窟を ぬければ\nミストのむらへ いけます」" }] },
          ] },
      ] },
    { id: "guard2", x: 11, y: 9, spr: "soldier",
      script: [
        { cond: { flag: "clear" },
          then: [{ msg: "兵士「王様が もとに\nもどられた! ぶかんちょうも\nうれしなきして おりました」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "兵士「王様の ようすが\nあきらかに おかしい……。\nきたのとうに なにかあるのでは……」" }],
              else: [{ msg: "兵士「さいきん 王様は\nひとが かわってしまわれた……」" }] },
          ] },
      ] },
    // じょうの ふっこうイベント (ザルバ討伐ご)
    { id: "bukan", x: 14, y: 9, spr: "soldier", showFlag: "clear",
      script: [
        { cond: { flag: "castleReward" },
          then: [{ msg: "ぶかんちょう「じょうかまちも にぎわいを\nとりもどした。すべて きみたちの\nおかげだ」" }],
          else: [
            { cond: { flag: "castleFund" },
              then: [
                { cond: { flag: "trueClear" },
                  then: [
                    { msg: "ぶかんちょう「王様から きみたちへ\nほうしょうを あずかっている。\nふっこうしえんの れいも こめてだ」" },
                    { give: { gold: 10000 } },
                    { msg: "10000ギルを 手に入れた!!" },
                    { flag: ["castleReward", 1] },
                  ],
                  else: [{ msg: "ぶかんちょう「しきんの おかげで\nふっこうは じゅんちょうだ。\n王宮に みせも ひらいたぞ」" }] },
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
                        { msg: "(王宮に みせが ひらいたようだ)" },
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
    // 王宮ごようたし (ふっこうしえんご)
    { id: "royalshop", x: 5, y: 4, spr: "villager", showFlag: "castleFund",
      script: [
        { msg: "ごようたし「ふっこうしえんの おかたと\nおみうけします。とくべつな しなを\nごらんください」" },
        { shop: "royal" },
      ] },
    // グレンのこじんイベント (パラディンご)
    { id: "mia", x: 5, y: 10, spr: "celia", showFlag: "paladin",
      script: [
        { cond: { flag: "glenEvent" },
          then: [{ msg: "ミア「にいさんを よろしくお願いします。\nいってらっしゃい!」" }],
          else: [
            { msg: "ミア「あっ、にいさん!!\nぶじだったのね……!」" },
            { msg: "グレン「ミア!? むらから でてきたのか。\n……しんぱいかけたな」" },
            { msg: "ミア「これ、とうさんの やり。\nにいさんが もつべきだと おもって\nもってきたの」" },
            { msg: "グレン「おやじの……。 ああ、\nたしかに うけとった。 みてろよ、\nおれは 竜騎士を つらぬく」" },
            { give: { item: "w_kizuna" } },
            { msg: "絆の槍を 手に入れた!\n(あくましゅぞくに 8ばいの 力を はっき)" },
            { flag: ["glenEvent", 1] },
          ] },
      ] },
  ],
  chests: [
    { id: "castle1", x: 17, y: 1, gold: 500, hidden: true },
    // 序盤の裏技: 玉座のうらの へそくり (お金MAX) と 経験のしるし
    { id: "castle_g", x: 2, y: 1, gold: 999999, hidden: true },
    { id: "castle_e", x: 1, y: 10, item: "expcharm", hidden: true },
  ],
};

// ---------------- ミストのむら ----------------
DATA.maps.town = {
  name: "ミストのむら",
  bgm: "town",
  exit: { map: "world", x: 27, y: 23, dir: "d" },
  legend: {
    "f": { tile: "forest", solid: true },
    "F": { tile: "fountain", solid: true },
    ".": { tile: "grass" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "E": { tile: "door" },
    "h": { tile: "door" },
    "j": { tile: "door" },
  },
  rows: [
    "ffffffffffffffffffff",
    "f..................f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f....F.............f",
    "f.......WWWWW......f",
    "f.......WWWWW......f",
    "f.......WWEWW......f",
    "f..................f",
    "f.WWW..........WWW.f",
    "f.WWW..........WWW.f",
    "f.WhW..........WjW.f",
    "f..................f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "inn", x: 4, y: 6, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "shop", x: 4, y: 6, dir: "u" } },
    { x: 10, y: 9, type: "enter", warp: { map: "elder", x: 5, y: 7, dir: "u" } },
    { x: 3, y: 13, type: "enter", warp: { map: "house1", x: 4, y: 5, dir: "u" } },
    { x: 16, y: 13, type: "enter", warp: { map: "house2", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "vil1", x: 5, y: 11, spr: "villager", wander: true,
      script: [
        { cond: { flag: "allCrystals" },
          then: [{ msg: "むらびと「よぞらに ひかる とうが\nみえるじゃろ? あれが うわさの\n星のとう じゃよ……」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "むらびと「おお 光のきしさま!\nどうか ザルバを たおしてくだされ!」" }],
              else: [{ msg: "むらびと「さいきん モンスターが\nふえたのう。おちおち はたけにも\nいけんわい」" }] },
          ] },
      ] },
    { id: "vil2", x: 14, y: 12, spr: "villager", wander: true,
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "むらびと「星のとうの かがやきが\nきえたのう。あんたたちの おかげじゃと\nみんな いうておるよ」" }],
          else: [
            { cond: { flag: "earthCrystal" },
              then: [{ msg: "むらびと「地底に くにが あったとは\nおどろきじゃ。ドワーフの さけは\nうまいと きくがのう」" }],
              else: [
                { cond: { flag: "clear" },
                  then: [{ msg: "むらびと「まてんろうの くろいくもが\nはれたのう! これで はたけしごとも\nはかどるわい」" }],
                  else: [{ msg: "むらびと「きたのほこらには\n『心のかがみ』が あるそうじゃ。\nみたものの 心を うつすとか」" }] },
              ] },
          ] },
      ] },
    { id: "kid", x: 8, y: 6, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "子供「伝説の 勇者だー!!\nぼく、おおきくなったら\nクリスタルナイツに はいるんだ!」" }],
          else: [
            { cond: { flag: "paladin" },
              then: [{ msg: "子供「光の きしさまだー!\nかっこいい! やりの おにいちゃんも\n拳の おじちゃんも すごーい!」" }],
              else: [{ msg: "子供「冒険者だ!\nねえねえ、魔物と たたかったこと\nある? こわくないの?」" }] },
          ] },
      ] },
    { id: "kid_seek", x: 12, y: 5, spr: "villager", pal: "light",
      script: [
        { cond: { flag: "hideSeekDone" },
          then: [{ msg: "子供「また かくれんぼ しようね!\nこんどは ぼくが かくれる ばん!」" }],
          else: [
            { cond: { flag: "hideSeek" },
              then: [{ msg: "子供「モコちゃんは むらの どこかに\nかくれてるんだ。きのちかくが\nあやしいと おもうんだけどなー」" }],
              else: [
                { msg: "子供「かくれんぼの とちゅうなんだけど\nモコちゃんが ぜんぜん みつからないの。\nいっしょに さがしてくれる?」" },
                { flag: ["hideSeek", 1] },
              ] },
          ] },
      ] },
    { id: "kid_hide", x: 2, y: 14, spr: "villager", pal: "light",
      showFlag: "hideSeek", hideFlag: "hideSeekDone",
      script: [
        { msg: "モコ「わっ みつかっちゃった!\nおにいちゃんたち かくれんぼ じょうずだね。\nこれ あげる!」" },
        { give: { item: "potion" } },
        { give: { item: "potion" } },
        { give: { item: "potion" } },
        { msg: "ポーションを 3つ 手に入れた!" },
        { flag: ["hideSeekDone", 1] },
      ] },
    // セリアのこじんイベント (風のクリスタルご)
    { id: "sister", x: 10, y: 12, spr: "celia", showFlag: "windCrystal",
      script: [
        { cond: { flag: "celiaEvent" },
          then: [
            { cond: { all: ["nightBoss"] },
              then: [
                { cond: { flag: "celiaEp2" },
                  then: [{ msg: "シスター「あなたの いのりは もう\nわたしの てを はなれて、世界中を\nてらしているのね」" }],
                  else: [
                    { msg: "シスター「おかえりなさい、セリア。\n夜の国の じょ王様の はなし、\nきかせて もらえる?」" },
                    { msg: "セリア「はい。 かなしみは、けすものじゃなくて\nてらすものだって……。 じょ王様が\nおしえてくれた きがします」" },
                    { msg: "シスター「……りっぱに なったのね。\nこのベールは だいだいの シスターのもの。\n今は あなたが つけるべきだわ」" },
                    { give: { item: "a_prayer" } },
                    { give: { item: "acc_stprayer" } },
                    { msg: "祈りのベールと 大聖女の祈りを 手に入れた!" },
                    { flag: ["celiaEp2", 1] },
                  ] },
              ],
              else: [{ msg: "シスター「セリアの いのりは\nむらの ほこりです」" }] },
          ],
          else: [
            { msg: "シスター「セリア! おおきくなって……。\nちいさいころ ないてばかりだった\nあなたが りっぱに なったのね」" },
            { msg: "セリア「シスター・マーレ!\nわたし、みんなを まもれるように\nなりたくて……」" },
            { msg: "シスター「その 心が あれば\nだいじょうぶ。 これは あなたの\nおかあさんの かたみの ロッドよ」" },
            { msg: "セリア「おかあさんの……。\nありがとう。 たいせつに つかうわ」" },
            { give: { item: "w_prayrod" } },
            { msg: "祈りのロッドを 手に入れた!" },
            { flag: ["celiaEvent", 1] },
          ] },
      ] },
    { id: "board", x: 3, y: 7, spr: "soldier",
      script: [
        { msg: "ぼしゅうがかり「むらの 魔物たいじに\nほうびを だしているよ。\nどの たいじを ほうこくするんだい?」" },
        { menu: { options: [
          { label: "ガーゴイル5", ops: [
            { cond: { flag: "qGar" },
              then: [{ msg: "ぼしゅうがかり「それは もう\nほうびを わたしたよ」" }],
              else: [
                { cond: { kills: { id: "gargoyle", n: 5 } },
                  then: [
                    { msg: "ぼしゅうがかり「ガーゴイル 5たい かくにん!\nほうびを うけとりな!」" },
                    { give: { gold: 800 } },
                    { msg: "800ギルを 手に入れた!" },
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
                    { msg: "1500ギルを 手に入れた!" },
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
                    { msg: "ぼしゅうがかり「スカイドラゴン 3たい!?\n伝説の りゅうがりだ!!」" },
                    { give: { gold: 3000 } },
                    { msg: "3000ギルを 手に入れた!" },
                    { flag: ["qSkyD", 1] },
                  ],
                  else: [{ msg: "ぼしゅうがかり「空の島の\nスカイドラゴンを 3たい。\nむちゃは しなさんなよ」" }] },
              ] },
          ] },
          { label: "やめる", ops: [] },
        ] } },
      ] },
    { id: "hunter", x: 13, y: 11, spr: "villager",
      script: [
        { cond: { flag: "iceReward" },
          then: [{ msg: "ハンター「そういや みなみの 地下水路で\nみずおとの おかしい ばしょが あるって\nうわさだぜ。なにか あるのかもな」" }],
          else: [
            { cond: { flag: "iceBoss" },
              then: [
                { msg: "ハンター「な なんと! ほんとうに\nりゅうを たおしちまったのか!!\nやくそくの ほうびだ、うけとりな!」" },
                { give: { gold: 1000 } },
                { msg: "1000ギルを 手に入れた!" },
                { flag: ["iceReward", 1] },
              ],
              else: [
                { msg: "ハンター「きたの森の 洞窟に\nりゅうが すみついちまった。\nたおせば 1000ギル はらうぜ」" },
                { flag: ["iceQuest", 1] },
              ] },
          ] },
      ] },
  ],
  chests: [],
};

// ---------------- 宿屋 ----------------
DATA.maps.inn = {
  name: "宿屋",
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

// ---------------- 道具や ----------------
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

// ---------------- 長老のいえ ----------------
DATA.maps.elder = {
  name: "長老のいえ",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    "s": { tile: "shelf", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "#ss##ss##ss#",
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
    { id: "cat4", x: 9, y: 6, spr: "cat",
      script: [
        { cond: { flag: "cat4" },
          then: [{ msg: "ネコ「ニャーオ」\n(もう すっかり なかよしだ)" }],
          else: [
            { msg: "ネコ「ニャッ!?」\nネコと なかよく なった!" },
            { flag: ["cat4", 1] },
          ] },
      ] },
    { id: "elderman", x: 5, y: 2, spr: "elder",
      script: [
        { cond: { flag: "worldtearGiven" },
          then: [{ msg: "長老「世界のしずくは\nつかったかの? おぬしらの たびに\nかごが あらんことを」" }],
          else: [
            { cond: { flag: "allCrystals" },
              then: [
                { msg: "長老「おお…… 4つのクリスタルの\n光を かんじる。よくぞ ここまで」" },
                { give: { item: "worldtear" } },
                { flag: ["worldtearGiven", 1] },
                { msg: "世界のしずくを さずかった!\n(仲間ぜんいんが 完全回復する\nいちどきりの ひほう)" },
              ],
              else: [] },
          ] },
        { cond: { flag: "worldtearGiven" },
          then: [],
          else: [
            { cond: { flag: "crystal" },
          then: [
            { cond: { flag: "paladin" },
              then: [{ msg: "長老「せいなる光を えたのじゃな。\nきたのとうへ ゆけ。\nザルバを 倒すのじゃ!」" }],
              else: [{ msg: "長老「きたのほこらで\n心のやみと むきあうのじゃ。\nクリスタルが みちびいてくれよう」" }] },
          ],
          else: [
            { msg: "長老「おお…… バロンの 暗黒騎士。\nクリスタルを うばいに きたのか」" },
            { msg: "レオン「………すまぬ。\nこれは おうの めいれいなのだ」" },
            { msg: "長老「クリスタルは わたそう。\nだが しるがよい。バロンおうは\n魔人 ザルバに あやつられておる」" },
            { msg: "長老「ザルバを たおせるのは\nせいなる力を えた きしのみ。\nだが 今の おぬしの心は\nやみに とざされておる」" },
            { msg: "長老「きたのほこらで 心のやみと\nむきあうのじゃ。クリスタルを さずけよう。\nそれが おぬしを みちびく」" },
            { give: { item: "crystal" } },
            { msg: "クリスタルを 手に入れた!" },
            { flag: ["crystal", 1] },
            { msg: "セリア「おじいさま わたしも いきます!\nしろ魔法で このひとを ささえるわ」" },
            { msg: "長老「セリア……。 たのんだぞ。\nレオンどの、まごを よろしくたのむ」" },
            { join: "celia" },
            { msg: "セリアが 仲間に くわわった!" },
          ] },
          ] },
      ] },
  ],
  chests: [],
};

// ---------------- にしの洞窟 ----------------
DATA.maps.cave = {
  name: "にしの洞窟",
  bgm: "dungeon",
  encounter: "cave",
  legend: {
    "D": { tile: "stairs" },
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
    "#D....................D#",
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
        { msg: "レオン「おうの なも しらぬ 魔物……。\nやはり なにかが おかしい」" },
      ] },
  ],
  npcs: [
    { id: "rodnpc", x: 11, y: 12, spr: "rod", hideFlag: "rodJoined",
      script: [
        { msg: "ロッド「おっと! ひとかい?\nオレは ロッド。魔道士だ。\nモンスターが ふえたわけを\nしらべてたのさ」" },
        { msg: "ロッド「ミストのむらへ いくのか?\nちょうど いい。オレも つれてけ!\nくろ魔法なら まかせろ」" },
        { join: "rod" },
        { flag: ["rodJoined", 1] },
        { msg: "ロッドが 仲間に くわわった!" },
      ] },
  ],
  chests: [
    { id: "cave1", x: 1, y: 1, gold: 150 },
    { id: "cave2", x: 22, y: 18, item: "ether" },
  ],
};

// ---------------- 心のほこら ----------------
DATA.maps.shrine = {
  name: "心のほこら",
  bgm: "dungeon",
  encounter: "shrine",
  legend: {
    "#": { tile: "wall", solid: true },
    "S": { tile: "statue", solid: true },
    "T": { tile: "torch", solid: true },
    ".": { tile: "floor" },
    "d": { tile: "door" },
  },
  rows: [
    "##S#T####T#S##",
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
        { msg: "心のかがみが レオンのすがたを\nうつしている……。" },
        { msg: "『……おまえの闇が おまえをためす。\n闇を 力で ねじふせることは\nできぬ……』" },
        { msg: "かがみのなかから\nもうひとりの レオンが 現れた!!" },
        { battle: { group: ["shadow"], boss: true, music: "boss" } },
        { msg: "かがみが くだけちり……\nクリスタルが まばゆく かがやいた!" },
        { classchange: true },
        { msg: "レオンは パラディンに クラスチェンジした!\n光の剣と 光の鎧を\nみにつけた!" },
        { msg: "セリア「レオン…… すてきよ。\nこれで ザルバと たたかえるわ!」" },
        { flag: ["paladin", 1] },
      ] },
  ],
  npcs: [
    { id: "master_ghost", x: 3, y: 13, spr: "gou", pal: "light", showFlag: "nightBoss",
      script: [
        { cond: { flag: "gouEp2" },
          then: [{ msg: "しのまぼろし「拳は 心。\nもう おしえることは なにもない。\nいけ、ゴウ」" }],
          else: [
            { msg: "ほのかな 光が ひとのかたちに……。\nゴウ「……ししょう!? まさか……」" },
            { msg: "しのまぼろし「ゴウよ。 かがみが うつした\nわしは まぼろし。 じゃが おまえの 心が\nよんだ まぼろしじゃ」" },
            { msg: "「おまえの 拳は もはや 山を こえ、\nほしに とどいた。 最後の おしえじゃ。\n……強さとは、守りぬくこと」" },
            { msg: "ゴウ「……ししょう!! おれ、やります!\nぜったい だれも しなせません!!」" },
            { give: { item: "a_master2" } },
            { give: { item: "acc_warband" } },
            { msg: "真意のおびと 闘神の腕輪を 手に入れた!" },
            { flag: ["gouEp2", 1] },
          ] },
      ] },
    { id: "gounpc", x: 7, y: 12, spr: "gou", hideFlag: "gouJoined",
      script: [
        { msg: "ゴウ「おれは ながれの モンク、ゴウ。\nこの ほこらの 闇は\nただものじゃねえ ぜ」" },
        { msg: "ゴウ「いどむ かおだな……。 きにいった!\nおれの 拳も かしてやる!」" },
        { join: "gou" },
        { flag: ["gouJoined", 1] },
        { msg: "モンクのゴウが 仲間に くわわった!" },
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

// ---------------- 氷の洞窟 ----------------
DATA.maps.icecave = {
  name: "氷の洞窟",
  bgm: "dungeon",
  encounter: "icecave",
  legend: {
    "D": { tile: "stairs" },
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
    "#D.................#",
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
    // しんエンドごに 現れる かくしボス
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
    "F": { tile: "fountain", solid: true },
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
    "f.......F............f",
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
    { id: "port_merchant", x: 2, y: 6, spr: "villager",
      script: [
        { cond: { flag: "submarine" },
          then: [{ msg: "商人「海の底に 神殿が\nあるらしいね。しんじゅの そうばが\nきになる きになる」" }],
          else: [
            { cond: { flag: "airship" },
              then: [{ msg: "商人「ひこうせんで ひとっとび とは\nうらやましい。うちの にもつも\nはこんでほしいくらいだよ」" }],
              else: [{ msg: "商人「ふねの こうろが 魔物だらけで\nしょうばいあがったりさ。はやく\n平和に なってほしいもんだ」" }] },
          ] },
      ] },
    { id: "port_angler", x: 12, y: 7, spr: "villager",
      script: [
        { cond: { flag: "fishKing" },
          then: [
            { cond: { flag: "anglerGift" },
              then: [{ msg: "つりずき「伝説の つりびとどの!\nあの やり、つかいこなしてるかい?」" }],
              else: [
                { msg: "つりずき「つりぼりの ぬしを つりあげたって!?\nあんた 伝説の つりびとだよ!」" },
                { msg: "「じつは ぬしの ぬまの そこから\nふるい やりを ひきあげたんだ。\nあんたが もつべきだ、うけとってくれ!」" },
                { give: { item: "w_skypierce" } },
                { msg: "空の槍を 手に入れた!\n(攻撃60・雷ぞくせい)" },
                { flag: ["anglerGift", 1] },
              ] },
          ],
          else: [{ msg: "つりずき「つりぼりには ぬしが いるらしい。\nおれは 3ねん かよってるが\nまだ あたりも ないね……」" }] },
      ] },
    { id: "sailor", x: 9, y: 7, spr: "villager",
      script: [
        { cond: { flag: "seaBoss" },
          then: [
            { cond: { flag: "seaReward" },
              then: [
                { cond: { flag: "trueClear" },
                  then: [{ msg: "せんいん「氷の洞窟の おくで\nくろい りゅうを みたって うわさだ。\nうでに おぼえが あるなら……」" }],
                  else: [{ msg: "せんいん「うみが しずかに なった。\nあんたたちの おかげだな!」" }] },
              ],
              else: [
                { msg: "せんいん「海の底の ぬしを\nたおしてくれたのか!! これで あんしんして\nりょうが できる。れいだ、うけとってくれ!」" },
                { give: { gold: 2500 } },
                { msg: "2500ギルを 手に入れた!" },
                { flag: ["seaReward", 1] },
              ] },
          ],
          else: [
            { msg: "せんいん「よう! ここは みなとまち\nソレイユ。海の むこうで よなよな\nあかい 光が みえるんだ」" },
            { msg: "せんいん「地底に つづく おおあなが\nひらいたって うわさも ある。\nいやな よかんが するぜ……」" },
          ] },
      ] },
    { id: "obaba", x: 5, y: 6, spr: "villager", wander: true,
      script: [
        { cond: { flag: "chest_pier1" },
          then: [{ msg: "おばあさん「桟橋の ひかりもの、\nみつけたんだってね。 めが いいねえ。\nわかいって いいことだよ」" }],
          else: [{ msg: "おばあさん「桟橋の さきっぽで\nなにかが ひかったのを みたんだよ。\nしらべてみたら どうだい?」" }] },
      ] },
    { id: "merchant", x: 14, y: 6, spr: "villager", wander: true,
      script: [
        { cond: { flag: "arenaGold" },
          then: [{ msg: "商人「闘技場の チャンピオン!\nうちの 店の しなも つかってくれて\nこうえいだよ!」" }],
          else: [
            { cond: { flag: "submarine" },
              then: [{ msg: "商人「海の底へ いける\nおきゃくは はじめてだよ。\n深海の おみやげ まってるよ!」" }],
              else: [{ msg: "商人「ソレイユの店は\nミストより いいものぞろいだよ!\nぜひ みていっとくれ」" }] },
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
          then: [{ msg: "ロウシ「拳は 心。\nわすれるでないぞ ゴウよ」" }],
          else: [
            { msg: "ロウシ「……そのあしおと、ゴウか」" },
            { msg: "ゴウ「し、ししょう!? なんで\nこんなところに いるんすか!」" },
            { msg: "ロウシ「たびの 風の うわさでな。\nおまえの 拳が まよいを すてたと\nきいた。 これを さずけよう」" },
            { msg: "ゴウ「ししょうの 鉢巻……!\nおれ、もっと つよくなります!!」" },
            { give: { item: "a_hachimaki" } },
            { msg: "戦士の鉢巻を 手に入れた!" },
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
          then: [{ msg: "がくしゃ「輝く石の けんきゅうは\nじゅんちょうじゃ。地底には きっと\nすごい 秘密が ねむっておる…」" }],
          else: [
            { cond: { item: "glowstone" },
              then: [
                { msg: "がくしゃ「おお! それは まさしく\n地底の 『輝く石』!!\nけんきゅうのため ゆずってくれんか」" },
                { take: { item: "glowstone" } },
                { give: { gold: 1500 } },
                { msg: "輝く石を わたして\n1500ギルを 手に入れた!" },
                { flag: ["glowReward", 1] },
              ],
              else: [
                { msg: "がくしゃ「みなみの おおあなのそこに\n『輝く石』が あるらしい。\nゆずってくれたら 1500ギル はらおう」" },
              ] },
          ] },
      ] },
  ],
  chests: [
    { id: "pier1", x: 10, y: 11, item: "elixir", hidden: true },
  ],
};

DATA.maps.portinn = {
  name: "ソレイユの宿屋",
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
  name: "ソレイユの店",
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

// ---------------- 地下水路 ----------------
DATA.maps.waterway = {
  name: "地下水路",
  bgm: "dungeon",
  encounter: "waterway",
  legend: {
    "D": { tile: "stairs" },
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
    "#D...................#",
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
    { id: "ww3", x: 17, y: 1, item: "w_sagestaff" },
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
    "D": { tile: "stairs" },
    "#": { tile: "mountain", solid: true },
    ".": { tile: "path" },
  },
  rows: [
    "####################",
    "#D.................#",
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

// ---------------- 地底世界 ----------------
DATA.maps.underworld = {
  name: "地底世界",
  outdoor: true,
  bgm: "under",
  encounter: "underworld",
  legend: {
    "Z": { tile: "stairs" },
    "m": { tile: "mountain", solid: true },
    "w": { tile: "water", solid: true },
    ".": { tile: "path" },
    "T": { tile: "icon_town" },
    "D": { tile: "icon_shrine" },
    "C": { tile: "icon_castle" },
  },
  rows: [
    "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    "m..Z.........................m",
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
    // 神殿の まわりは 隕石の番人が 守っている
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
        { msg: "大地が もりあがり きょだいな かげが\nたちはだかる……! つちの幻獣 ノーモス!!" },
        { battle: { group: ["gnomos"], boss: true, music: "spirit" } },
        { flag: ["gnomosDown", 1] },
        { msg: "ノーモスは 大地に かえっていった。\nあとに おおきな たてが のこされた。" },
        { give: { item: "a_gnomos" } },
        { msg: "大地のおおたてを 手に入れた!" },
      ] },
  ],
  chests: [
    { id: "uw1", x: 28, y: 1, gold: 1500, hidden: true },
  ],
};

// ---------------- ドヴェルグ王宮 ----------------
DATA.maps.dwarfhall = {
  name: "ドヴェルグ王宮",
  bgm: "hall",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    "B": { tile: "banner", solid: true },
    ".": { tile: "floor" },
    "p": { tile: "pillar", solid: true },
    "r": { tile: "carpet" },
  },
  rows: [
    "##B###B##B###B##",
    "#..............#",
    "#.p..........p.#",
    "#..............#",
    "#.....rrrr.....#",
    "#.....rrrr.....#",
    "#.p..........p.#",
    "#..............#",
    "#..##......##..#",
    "#..#........#..#",
    "#......DD......#",
    "################",
  ],
  events: [
    { x: 7, y: 10, type: "enter", warp: { map: "underworld", x: 26, y: 6, dir: "d" } },
    { x: 8, y: 10, type: "enter", warp: { map: "underworld", x: 26, y: 6, dir: "d" } },
  ],
  npcs: [
    { id: "dverg_king", x: 7, y: 4, spr: "king",
      script: [
        { cond: { flag: "summitQuest" },
          then: [
            { cond: { flag: "inviteDverg" },
              then: [],
              else: [
                { msg: "バルドおう「ちじょうの かいぎに 地底の おうを\nよぶとはのう! ガハハハ! てつの さかずきを\nもって さんか するぞ!」" },
                { flag: ["inviteDverg", 1] },
              ] },
          ], else: [] },
        { cond: { flag: "dvergReward" },
          then: [{ msg: "ドヴェルグおう バルド「そなたらは 地底の\nおんじんじゃ。 ゆっくり していくがよい。\nガハハハ!」" }],
          else: [
            { cond: { flag: "dvergQuest" },
              then: [
                { cond: { kills: { id: "firelizard", n: 5 } },
                  then: [
                    { msg: "バルド「おお! マグマトカゲを 5たいも\nうちはらってくれたか! これで たみも\nあんしんして くらせるわい」" },
                    { give: { item: "w_dverg" } },
                    { give: { gold: 4000 } },
                    { msg: "ドヴェルグアクスと 4000ギルを 手に入れた!" },
                    { flag: ["dvergReward", 1] },
                  ],
                  else: [{ msg: "バルド「マグマトカゲは まだ あばれておる。\n5たい 倒したら もどってまいれ。\n図鑑で かずを かくにんできるぞ」" }] },
              ],
              else: [
                { msg: "ドヴェルグおう バルド「ようこそ 地底の\n王宮へ! ちじょうの ものが くるとは\nめずらしい。ガハハハ!」" },
                { msg: "「じつは マグマトカゲどもが ふえて\nたみが こまっておる。5たい たいじして\nくれたら ほうびを とらせよう」" },
                { flag: ["dvergQuest", 1] },
              ] },
          ] },
      ] },
    { id: "dverg_guard1", x: 5, y: 6, spr: "soldier",
      script: [{ msg: "えいへい「おうは ああみえて くにいちばんの\nおのの つかいてなのだ」" }] },
    { id: "dverg_guard2", x: 10, y: 6, spr: "soldier",
      script: [{ msg: "えいへい「たからのまは 王宮の ちか。\nかべの すきまを しらべてみるといい……\nおっと、ひとりごとだ」" }] },
    { id: "cat5", x: 12, y: 3, spr: "cat",
      script: [
        { cond: { flag: "cat5" },
          then: [{ msg: "ネコ「ニャーオ」\n(もう すっかり なかよしだ)" }],
          else: [
            { msg: "ネコ「ニャッ!?」\nネコと なかよく なった!" },
            { flag: ["cat5", 1] },
          ] },
      ] },
    { id: "dverg_maid", x: 3, y: 3, spr: "villager", wander: true,
      script: [{ msg: "じじゅう「ムスペルの かじばには 王宮の\nしょくにんも かよっているんですよ」" }] },
  ],
  chests: [
    { id: "dh1", x: 4, y: 9, gold: 5000 },
    { id: "dh2", x: 11, y: 9, item: "elixir" },
    { id: "dh3", x: 1, y: 10, item: "a_dverg2", hidden: true },
  ],
};

// ---------------- 地底神殿 ----------------
DATA.maps.temple = {
  name: "地底神殿",
  bgm: "shrine",
  encounter: "temple",
  legend: {
    "D": { tile: "stairs" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "carpet" },
    "T": { tile: "torch", solid: true },
  },
  rows: [
    "##T#####TT#####T##",
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
    "#.D..............#",
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

// ---------------- 鍛冶屋のさと ムスペル ----------------
DATA.maps.muspel = {
  name: "鍛冶屋のさと ムスペル",
  bgm: "town",
  exit: { map: "underworld", x: 12, y: 10, dir: "d" },
  legend: {
    "m": { tile: "mountain", solid: true },
    ".": { tile: "grass" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "F": { tile: "door" },
    "l": { tile: "door" },
    "n": { tile: "door" },
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
    "m.WWW..........WWW.m",
    "m.WWW..........WWW.m",
    "m.WlW..........WnW.m",
    "m..................m",
    "mmmmmmmm....mmmmmmmm",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "muspelinn", x: 4, y: 6, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "muspelshop", x: 4, y: 6, dir: "u" } },
    { x: 10, y: 8, type: "enter", warp: { map: "forge", x: 5, y: 7, dir: "u" } },
    { x: 3, y: 11, type: "enter", warp: { map: "house3", x: 4, y: 5, dir: "u" } },
    { x: 16, y: 11, type: "enter", warp: { map: "house4", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "smith_apprentice", x: 13, y: 10, spr: "villager", pal: "dark",
      script: [
        { cond: { flag: "forged" },
          then: [{ msg: "鍛冶屋のでし「輝く石の つるぎは\nおやかたの さいこうけっさくだべ。\nだいじに つかってくれよな」" }],
          else: [
            { cond: { flag: "magmaBoss" },
              then: [{ msg: "鍛冶屋のでし「輝く石を もってるなら\nおやかたに みせてみるだ。\nすごいもんが できるかもだよ」" }],
              else: [{ msg: "鍛冶屋のでし「おらは まだ くぎしか\nうたせてもらえねえだ。いつか\n伝説の剣を うつのが ゆめだべ」" }] },
          ] },
      ] },
    { id: "dwarf1", x: 5, y: 10, spr: "villager", pal: "dark", wander: true,
      script: [
        { cond: { flag: "submarine" },
          then: [{ msg: "ドワーフ「せんすいそうちの ちょうしは\nどうだべ? 海の底も\nひこうせんから いけるだよ」" }],
          else: [
            { cond: { flag: "windCrystal" },
              then: [
                { msg: "ドワーフ「風のクリスタルだべか!!\nそれが あれば ひこうせんに\nせんすいそうちを つけられるだ!」" },
                { msg: "ドワーフ「よし、くみこんでおいただ!\nおおうずしおの したの 海の底へ\nもぐれるように なっただよ」" },
                { flag: ["submarine", 1] },
                { msg: "ひこうせんが せんすいできるように なった!\n(いきさきに 海の底 が ふえました)" },
                { chapter: "第四章  深海編" },
              ],
              else: [{ msg: "ドワーフ「ようこそ ムスペルへ!\nちじょうの ひとが くるのは\nひさしぶりだべ」" }] },
          ] },
      ] },
    { id: "dwarf2", x: 14, y: 11, spr: "villager", pal: "dark", wander: true,
      script: [
        { cond: { flag: "airship" },
          then: [{ msg: "ドワーフ「空のたびは どうだ?\nソレイユの 桟橋から のれるだよ」" }],
          else: [
            { cond: { flag: "earthCrystal" },
              then: [
                { msg: "ドワーフ「ちのクリスタルを\n手に入れただか!! それが あれば\nきゅうひこうせんが うごくだ!」" },
                { msg: "ドワーフ「ソレイユの おきに ういてた\nふるい ひこうせんを なおして\nどうりょくを くみこんでおいただ!」" },
                { flag: ["airship", 1] },
                { msg: "ひこうせんが つかえるように なった!\n(ソレイユの 桟橋から とべます)" },
                { chapter: "第三章  天空編" },
              ],
              else: [{ msg: "ドワーフ「みなみの 神殿に\n『ちのクリスタル』が ねむってるだ。\nだども 結界で はいれねえだ」" }] },
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
  name: "ムスペルの宿屋",
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
    // ロッドのこじんイベント (地底かいほうご)
    { id: "mentor", x: 7, y: 5, spr: "rod", showFlag: "underOpen",
      script: [
        { cond: { flag: "rodEvent" },
          then: [
            { cond: { all: ["nightBoss"] },
              then: [
                { cond: { flag: "rodEp2" },
                  then: [{ msg: "ガレフ「『こえてみせる』と いった でしに\nこえられる ひが くるとはな。\n……わるくない きぶんだ」" }],
                  else: [
                    { msg: "ガレフ「ロッド、しょもつは よみおえたか」\nロッド「とっくに。 ついでに 星のはかの\n魔術師きも かいどくしましたよ」" },
                    { msg: "ガレフ「……なんと。 わしが 30ねん かけても\nとけなかった しきを か。\n……まけたよ。 これを かぶっていけ」" },
                    { msg: "ロッド「せんせいの ぼうし……。\n……ちょっとだけ、おもいですね。\nいろんな いみで」" },
                    { give: { item: "a_wisdom" } },
                    { give: { item: "acc_sageeye" } },
                    { msg: "英知のぼうしと 賢王の眼を 手に入れた!" },
                    { flag: ["rodEp2", 1] },
                  ] },
              ],
              else: [{ msg: "ガレフ「けんきゅうは あしで かせぐ。\nおまえの くちぐせに なったか?」" }] },
          ],
          else: [
            { msg: "ガレフ「……ロッドじゃないか。\nはもんされた でしが ずいぶん\nりっぱに なったもんだ」" },
            { msg: "ロッド「ガレフせんせい!\nはもんって、オレは じぶんから\nでていったんすけど!?」" },
            { msg: "ガレフ「はっはっは。 くちも たつように\nなった。 ならば これを よみこなせるな。\nわしの けんきゅうの すべてだ」" },
            { msg: "ロッド「せんせいの しょもつ……。\n……うけとります。 ぜんぶ おぼえて\nこえてみせますよ」" },
            { give: { item: "w_truthbook" } },
            { msg: "真理の書を 手に入れた!" },
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
  name: "ドヴェルグの鍛冶屋",
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
          then: [{ msg: "ドヴェルグ「どうだ 星くずの剣は。\nわしの さいこうけっさくだべ」" }],
          else: [
            { cond: { item: "glowstone" },
              then: [
                { msg: "ドヴェルグ「そ、それは 輝く石!!\nわしに あずけてみろ。\nすごいもんを うってやるだ」" },
                { msg: "カン カン カン……\nカン カン カン……!!" },
                { take: { item: "glowstone" } },
                { give: { item: "w_star" } },
                { flag: ["forged", 1] },
                { msg: "星くずの剣を 手に入れた!" },
              ],
              else: [
                { msg: "ドヴェルグ「おおあなのそこの\n『輝く石』を もってくれば\n伝説のぶきを うってやるだ」" },
              ] },
          ] },
      ] },
  ],
  chests: [],
};

// ---------------- 空の島 ----------------
DATA.maps.skyisland = {
  name: "空の島",
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
      cond: { flag: "towerOpen" },
      failScript: [{ msg: "星のとうの とびらは かたく とざされている。\n世界各地の 災いを しずめれば\n封印が とけそうだ……。" }],
      warp: { map: "startower1", x: 6, y: 10, dir: "u" } },
    { x: 13, y: 2, type: "enter",
      cond: { flag: "starGate" },
      failScript: [{ msg: "そらに ちいさな 光のわが\nうかんでいる。 今は とおれない。" }],
      warp: { map: "starworld", x: 11, y: 12, dir: "u" } },
  ],
  npcs: [
    { id: "sylphidnpc", x: 15, y: 4, spr: "bird", pal: "light",
      showFlag: "allCrystals", hideFlag: "sylphidDown",
      script: [
        { msg: "風が うずを まいて けもののかたちに……!\n風の幻獣 シルフィドだ!!" },
        { battle: { group: ["sylphid"], boss: true, music: "spirit" } },
        { flag: ["sylphidDown", 1] },
        { msg: "シルフィドは かぜにとけて きえた。\nあとに マントが ひらりと まいおちた。" },
        { give: { item: "a_sylphid" } },
        { msg: "風のマントを 手に入れた!" },
      ] },
  ],
  chests: [
    { id: "sky1", x: 17, y: 7, gold: 2500, hidden: true },
  ],
};

// ---------------- 星の世界 (第2ワールド) ----------------
DATA.maps.starworld = {
  name: "星の世界",
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
    "P": { tile: "icon_shrine" },
    "V": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwww",
    "ww......mmm.........wwww",
    "w...mm..m.m....mm.....ww",
    "w...m.....m....m.m....ww",
    "w..........T...mm......w",
    "w...ff.................w",
    "w...ff.......mmm.....C.w",
    "ww......mm...m.mP.....ww",
    "ww......mm...mmm......ww",
    "w.V...................ww",
    "w....mm.......ff......ww",
    "w....m.m......ff.....www",
    "ww...mm....G........wwww",
    "wwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 11, y: 12, type: "enter", warp: { map: "skyisland", x: 13, y: 3, dir: "d" } },
    { x: 11, y: 4, type: "enter", warp: { map: "moonpalace", x: 7, y: 10, dir: "u" } },
    { x: 21, y: 6, type: "enter", warp: { map: "crater1", x: 2, y: 10, dir: "u" } },
    { x: 16, y: 7, type: "enter", warp: { map: "powertemple", x: 6, y: 7, dir: "u" } },
    { x: 2, y: 9, type: "enter",
      cond: { flag: "craterBoss" },
      failScript: [{ msg: "ふるい はかの 扉は かたく とざされている。\nクレーターの ぬしの けはいが きえれば\nひらきそうだ……。" }],
      warp: { map: "stargrave1", x: 8, y: 11, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "sw1", x: 9, y: 2, gold: 5000, hidden: true },
    { id: "sw2", x: 12, y: 10, item: "elixir", hidden: true },
    { id: "sw3", x: 1, y: 9, item: "w_ryuoh", hidden: true },
    { id: "sw4", x: 18, y: 4, item: "a_nova", hidden: true },
  ],
};

// ---------------- 月のみやこ セレーネ ----------------
DATA.maps.moonpalace = {
  name: "月のみやこ セレーネ",
  bgm: "star",
  legend: {
    "D": { tile: "door" },
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
    "#......DD......#",
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
              then: [{ msg: "つきびとの 長老「ステラも すっかり\nげんきじゃ。星の たみは あなたがたを\nけっして わすれぬ」" }],
              else: [
                { cond: { flag: "stellaFound" },
                  then: [
                    { msg: "長老「おお ステラが もどってきた!\nほんとうに ありがとう……。\nこれは 星のたみに つたわる たからじゃ」" },
                    { give: { item: "a_stellar" } },
                    { msg: "星の守りを 手に入れた!" },
                    { flag: ["stellaDone", 1] },
                  ],
                  else: [
                    { cond: { flag: "stellaQuest" },
                      then: [{ msg: "長老「ステラは クレーターの おくで\n星のかけらを ひろうのが すきでな……。\nどうか さがしだしてくれ」" }],
                      else: [
                        { msg: "長老「ぬしを しずめてくれて れいをいう。\nじゃが こまったことが おきた。むらの 子供\nステラの すがたが みえんのじゃ」" },
                        { msg: "「ぬしが きえたのを みて クレーターの おくへ\nほしひろいに いったのやもしれぬ……。\nどうか つれもどしてくれぬか」" },
                        { flag: ["stellaQuest", 1] },
                      ] },
                  ] },
              ] },
          ],
          else: [
            { msg: "つきびとの 長老「ようこそ 星の世界へ。\nわしらは ふるい 星の たみ。\nしずかに くらしてきた」" },
            { msg: "「じゃが きょだいな クレーターに ぬしが\nすみつき、大地が あれはじめた。\nちからある ものよ、助けてくれぬか」" },
          ] },
      ] },
    { id: "selene_bard", x: 4, y: 8, spr: "villager", showFlag: "trueClear",
      script: [
        { cond: { flag: "bardGift" },
          then: [{ msg: "たびのうたひと「闇を こえた きしたちの うた、\n星の すみずみまで ひびかせますよ」" }],
          else: [
            { msg: "たびのうたひと「おお、うわさに きく\n光のきし ごいっこう!\nあなたがたの たびを うたに しました」" },
            { msg: "♪ 闇を まといて ひかりへ あゆみ\n♪ よっつの 光が 星を つなぐ……\n心に しみる うただ。" },
            { give: { item: "elixir" } },
            { msg: "うたの おれいにと エリクサーを くれた!" },
            { flag: ["bardGift", 1] },
          ] },
      ] },
    { id: "selene_girl", x: 10, y: 6, spr: "villager", wander: true,
      script: [{ msg: "つきびとの 子供「ここの 魔物は\nとーっても つよいの。でも けいけんに\nなるって 大人が いってた!」" }] },
    { id: "selene_watcher", x: 13, y: 8, spr: "soldier",
      script: [{ msg: "星の番人「クレーターの おくは\nぬしの すみか。かくごの ないものは\nちかづかぬことだ」" }] },
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
    "#.s............#",
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
        { msg: "ステラ「ほしひろいに きたら 魔物が\nいっぱいで うごけなく なっちゃったの……。\nおにいちゃんたち つよいんだね!」" },
        { msg: "ステラは ひろった 星のかけらを\nぎゅっと にぎりしめて うなずいた。" },
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

// ---------------- 夜の国 (だい8のちいき) ----------------
DATA.maps.world7 = {
  name: "夜の国",
  crisis: "nightBoss",
  outdoor: true,
  bgm: "star",
  encounter: "world7",
  legend: {
    "w": { tile: "water", solid: true },
    "m": { tile: "mountain", solid: true },
    ".": { tile: "path" },
    "f": { tile: "forest" },
    "T": { tile: "icon_town" },
    "C": { tile: "icon_shrine" },
    "G": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "ww......................wwww",
    "w...ff........mm.........www",
    "w...ff...T....mm..........ww",
    "w..........................w",
    "ww...................G....ww",
    "ww......mm................ww",
    "w.......mm.................w",
    "w..............C...........w",
    "w..........................w",
    "w.....ff...................w",
    "ww....ff...........mm.....ww",
    "ww.................mm.....ww",
    "w..........................w",
    "ww........................ww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 21, y: 5, type: "enter", scriptId: "airshipBoard" },
    { x: 9, y: 3, type: "enter", warp: { map: "nox", x: 9, y: 9, dir: "u" } },
    { x: 15, y: 8, type: "enter", warp: { map: "cathedral1", x: 2, y: 10, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "w7a", x: 1, y: 13, gold: 12000, hidden: true },
    { id: "w7b", x: 24, y: 2, item: "worldtear", hidden: true },
  ],
};

// ---------------- 夜のまち ノクス ----------------
DATA.maps.nox = {
  name: "夜のまち ノクス",
  bgm: "star",
  exit: { map: "world7", x: 9, y: 4, dir: "d" },
  legend: {
    "f": { tile: "deadtree", solid: true },
    ".": { tile: "nightgrass" },
    "t": { tile: "deadtree", solid: true },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
  },
  rows: [
    "ffffffffffffffffffff",
    "f..................f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f...t..........t...f",
    "f..................f",
    "f..................f",
    "f......t........t..f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "noxinn", x: 4, y: 5, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "noxshop", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "nox_chief", x: 10, y: 6, spr: "elder",
      script: [
        { cond: { flag: "nightBoss" },
          then: [
            { cond: { flag: "nightReward" },
              then: [{ msg: "まちのおさ「じょ王様が しずまり、\n夜は やさしい しじまに もどった。\n星が きれいじゃろう?」" }],
              else: [
                { msg: "まちのおさ「じょ王様を といてくれたか!\nこの まちの 心ばかりの れいじゃ。\nうけとって くだされ」" },
                { give: { gold: 8000 } },
                { msg: "8000ギルを 手に入れた!" },
                { flag: ["nightReward", 1] },
              ] },
          ],
          else: [
            { msg: "まちのおさ「この くにの 夜は やさしかった。\nじゃが 大聖堂の じょ王様が\nかなしみに のまれてしもうての……」" },
            { msg: "「朝が こない くにに なってしもうた。\nどうか じょ王様の かなしみを\nといて くだされ。炎の 光が 鍵じゃ」" },
            { flag: ["nightQuest", 1] },
          ] },
      ] },
    { id: "nox_hunter", x: 5, y: 8, spr: "soldier",
      script: [
        { cond: { flag: "duskReward" },
          then: [{ msg: "よまわり「たそがれオオカミが へって\nよみちも あんしんだ。感謝するよ」" }],
          else: [
            { cond: { flag: "duskQuest" },
              then: [
                { cond: { kills: { id: "duskwolf", n: 4 } },
                  then: [
                    { msg: "よまわり「4とうも しとめたか!\nやくそくの ほうびだ、うけとってくれ」" },
                    { give: { gold: 6000 } },
                    { give: { item: "nightdrop" } },
                    { msg: "6000ギルと 夜のしずくを 手に入れた!" },
                    { flag: ["duskReward", 1] },
                  ],
                  else: [{ msg: "よまわり「たそがれオオカミは くにの あちこちに\nいる。4とう たのむぞ。図鑑で\nかずを かぞえられる」" }] },
              ],
              else: [
                { msg: "よまわり「たそがれオオカミが ふえて\nよみちが あぶない。4とう たいじして\nくれたら ほうびを だそう」" },
                { flag: ["duskQuest", 1] },
              ] },
          ] },
      ] },
    { id: "nox_kid", x: 14, y: 8, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "nightBoss" },
          then: [{ msg: "子供「じょ王様の かなしみが とけたんだね。\n星が まえより やさしく\nひかってる きがするの!」" }],
          else: [{ msg: "子供「ここの よぞらは 星が いっぱいで\nだいすき! でも たまには おひさまも\nみてみたいなあ」" }] },
      ] },
    { id: "nox_granny", x: 3, y: 9, spr: "villager", wander: true,
      script: [
        { cond: { flag: "nightBoss" },
          then: [{ msg: "おばあさん「じょ王様に えがおが\nもどったそうじゃ。ありがとうねえ、\nほんとうに ありがとうねえ……」" }],
          else: [{ msg: "おばあさん「じょ王様は むかし、たみの\nねむりを 守る やさしい おかたじゃった。\nかなしみが あのかたを かえてしもうた……」" }] },
      ] },
    { id: "nox_guard", x: 16, y: 6, spr: "soldier",
      script: [
        { cond: { flag: "towerOpen" },
          then: [{ msg: "番人「よぞらの 星の塔が ひらいたと\n聞いた。あの 光の さきへ いけるのは\nあんたたちだけだ」" }],
          else: [{ msg: "番人「大聖堂の 魔物は 夜の\nけはいを まとう。炎の 魔法と ぶきを\nわすれるな」" }] },
      ] },
  ],
  chests: [
    { id: "nx1", x: 17, y: 9, item: "elixir", hidden: true },
  ],
};

DATA.maps.noxinn = {
  name: "ノクスの宿屋",
  bgm: "star",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb..c..#",
    "#.bb.....#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "nox", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "nox", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "nox_inn", x: 7, y: 2, spr: "innkeep", script: [{ inn: 550 }] },
  ],
  chests: [],
};

DATA.maps.noxshop = {
  name: "ノクスの店",
  bgm: "star",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.t...c..#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "nox", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "nox", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "nox_shop", x: 7, y: 2, spr: "shopkeep", script: [{ shop: "nox" }] },
  ],
  chests: [],
};

// ---------------- 闇の大聖堂 ----------------
DATA.maps.cathedral1 = {
  name: "闇の大聖堂",
  bgm: "under",
  encounter: "cathedral",
  legend: {
    "S": { tile: "statue", solid: true },
    "T": { tile: "torch", solid: true },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "s": { tile: "stairs" },
  },
  rows: [
    "##S##T####T##S##",
    "#...........s..#",
    "#..######..##..#",
    "#.......#......#",
    "######..#..#####",
    "#.......#......#",
    "#..######..##..#",
    "#..#...........#",
    "#..#..######..##",
    "#..............#",
    "#.s............#",
    "################",
  ],
  events: [
    { x: 2, y: 10, type: "enter", warp: { map: "world7", x: 15, y: 9, dir: "d" } },
    { x: 12, y: 1, type: "enter", warp: { map: "cathedral2", x: 3, y: 1, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "ca1", x: 14, y: 3, gold: 11000 },
    { id: "ca2", x: 1, y: 7, item: "nightdrop" },
    { id: "ca3", x: 6, y: 10, item: "a_nocturne", hidden: true },
  ],
};

DATA.maps.cathedral2 = {
  name: "女王の聖堂",
  bgm: "under",
  encounter: "cathedral",
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
    { x: 3, y: 1, type: "enter", warp: { map: "cathedral1", x: 12, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "noctianpc", x: 6, y: 6, spr: "celia", pal: "dark", hideFlag: "nightBoss",
      script: [
        { msg: "聖堂の おくで ほしあかりが ゆらぎ\nくろい ドレスの かげが ふりむいた……。" },
        { msg: "『……ねむりなさい。 夜は やさしい。\nあさなど こなければ だれも\nかなしまずに すむのだから……』" },
        { battle: { group: ["noctia"], boss: true, music: "spirit" } },
        { flag: ["nightBoss", 1] },
        { msg: "『……あ戦い ほのお。 そう、朝は\nかなしみごと ひとを てらすのね。\nありがとう……』" },
        { give: { item: "w_dawn" } },
        { give: { item: "acc_moonveil" } },
        { msg: "夜明けの槍と 月のベールを 手に入れた!\n(攻撃63・炎属性 / 聖半減)" },
        { msg: "夜の国の そらに、ほんのり\nあかつきの 光が さしこんだ……。" },
        { msg: "その とき ―― はるか 空の島の ほうで\nまばゆい 光が はしり、星のとうの 封印が\nとけていく のが みえた!!" },
        { flag: ["towerOpen", 1] },
        { chapter: "第七章  星の塔編" },
        { msg: "レオン「すべての 災いは しずまった。\nいよいよ 星のとうだ。\nほんとうの 敵が まっている」" },
      ] },
  ],
  chests: [
    { id: "ca4", x: 8, y: 5, item: "worldtear" },
    { id: "ca5", x: 4, y: 5, gold: 18000, hidden: true },
    { id: "ca6", x: 14, y: 10, item: "acc_lifeorb", hidden: true },
  ],
};

// ---------------- 雷鳴の島 (だい7のちいき) ----------------
DATA.maps.world6 = {
  name: "雷鳴の島",
  crisis: "stormBoss",
  weather: "rain",
  outdoor: true,
  bgm: "field",
  encounter: "world6",
  legend: {
    "w": { tile: "water", solid: true },
    "m": { tile: "mountain", solid: true },
    ".": { tile: "path" },
    "f": { tile: "forest" },
    "T": { tile: "icon_town" },
    "C": { tile: "icon_shrine" },
    "G": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "ww......................wwww",
    "w...mm........mm.........www",
    "w...mm...T....mm..........ww",
    "w..........................w",
    "ww...................G....ww",
    "ww......mm................ww",
    "w.......mm.................w",
    "w..............C...........w",
    "w..........................w",
    "w.....ff...................w",
    "ww....ff...........mm.....ww",
    "ww.................mm.....ww",
    "w..........................w",
    "ww........................ww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 21, y: 5, type: "enter", scriptId: "airshipBoard" },
    { x: 9, y: 3, type: "enter", warp: { map: "volte", x: 9, y: 9, dir: "u" } },
    { x: 15, y: 8, type: "enter", warp: { map: "stormshrine1", x: 2, y: 10, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "w6a", x: 1, y: 13, gold: 10000, hidden: true },
    { id: "w6b", x: 24, y: 2, item: "elixir", hidden: true },
  ],
};

// ---------------- 嵐のむら ボルテ ----------------
DATA.maps.volte = {
  name: "嵐のむら ボルテ",
  weather: "rain",
  bgm: "town",
  exit: { map: "world6", x: 9, y: 4, dir: "d" },
  legend: {
    "f": { tile: "mountain", solid: true },
    ".": { tile: "grass" },
    "r": { tile: "scree" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
  },
  rows: [
    "ffffffffffffffffffff",
    "f..................f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f...r.........r....f",
    "f..................f",
    "f..................f",
    "f.r......r.........f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "volteinn", x: 4, y: 5, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "volteshop", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "volte_chief", x: 10, y: 6, spr: "elder",
      script: [
        { cond: { flag: "stormBoss" },
          then: [
            { cond: { flag: "stormReward" },
              then: [{ msg: "むらおさ「雷が しずまり ほしぞらが\nもどった。この しまは あなたがたの\nだいにの ふるさとじゃ」" }],
              else: [
                { msg: "むらおさ「らいじんの けしんを しずめるとは……!\nむらの ほこりじゃ。れいを うけとって\nくだされ」" },
                { give: { gold: 6000 } },
                { msg: "6000ギルを 手に入れた!" },
                { flag: ["stormReward", 1] },
              ] },
          ],
          else: [
            { msg: "むらおさ「ほこらの らいじんが いかりだし、\nひるも よるも 雷が やまぬ。\nはたけも ふねも だいそんがいじゃ」" },
            { msg: "「らいじんは 氷の 力を にがてと\nしておる。どうか いかりを\nしずめて くだされ」" },
            { flag: ["stormQuest", 1] },
          ] },
      ] },
    { id: "volte_hunter", x: 5, y: 8, spr: "soldier",
      script: [
        { cond: { flag: "hawkReward" },
          then: [{ msg: "とりおい「らいめいタカが へって 空が\nしずかに なった。ふねも あんしんだ」" }],
          else: [
            { cond: { flag: "hawkQuest" },
              then: [
                { cond: { kills: { id: "thunderhawk", n: 4 } },
                  then: [
                    { msg: "とりおい「4わも おとしたのか! たいした\nうでだ。ほうびを うけとってくれ」" },
                    { give: { gold: 5000 } },
                    { give: { item: "hiether" } },
                    { msg: "5000ギルと ハイエーテルを 手に入れた!" },
                    { flag: ["hawkReward", 1] },
                  ],
                  else: [{ msg: "とりおい「らいめいタカは しまの 空を\nとんでいる。4わ たのむ。図鑑で\nかずを かくにんできるぞ」" }] },
              ],
              else: [
                { msg: "とりおい「らいめいタカが ふねの ほばしらに\nいたずらして こまっている。4わ おとして\nくれたら ほうびを だそう」" },
                { flag: ["hawkQuest", 1] },
              ] },
          ] },
      ] },
    { id: "volte_kid", x: 14, y: 8, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "stormBoss" },
          then: [{ msg: "子供「雷が やんだから そとで\nあそべるんだ! でも ちょっとだけ\nざんねんかも……かっこよかったし」" }],
          else: [{ msg: "子供「雷の 夜は おふとんに\nもぐるんだ! でも ちょっとだけ\nかっこいいとも おもうんだ」" }] },
      ] },
    { id: "volte_granny", x: 3, y: 9, spr: "villager", wander: true,
      script: [
        { cond: { flag: "stormBoss" },
          then: [{ msg: "おばあさん「らいじんさまが めぐみの\n神様に もどったよ。こんやは\nきれいな ほしぞらだねえ」" }],
          else: [{ msg: "おばあさん「らいじんさまは ほんらい\nめぐみの あめを くれる やさしい 神様\nなんだよ。なにかが いかりに ふれたのさ」" }] },
      ] },
    { id: "volte_guard", x: 16, y: 6, spr: "soldier",
      script: [
        { cond: { flag: "stormBoss" },
          then: [{ msg: "番人「ふねも はたけも もう あんしんだ。\nこの しまに へいわが もどった。\nあんたたちの おかげだ」" }],
          else: [{ msg: "番人「ほこらへは きたの みちを いけ。\nブリザガや 氷のぶきが あれば\nらいじんにも たちうちできるはずだ」" }] },
      ] },
  ],
  chests: [
    { id: "vo1", x: 17, y: 9, item: "xpotion", hidden: true },
  ],
};

DATA.maps.volteinn = {
  name: "ボルテの宿屋",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb..c..#",
    "#.bb.....#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "volte", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "volte", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "volte_inn", x: 7, y: 2, spr: "innkeep", script: [{ inn: 500 }] },
  ],
  chests: [],
};

DATA.maps.volteshop = {
  name: "ボルテの店",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.t...c..#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "volte", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "volte", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "volte_shop", x: 7, y: 2, spr: "shopkeep", script: [{ shop: "volte" }] },
  ],
  chests: [],
};

// ---------------- 雷電のほこら ----------------
DATA.maps.stormshrine1 = {
  name: "雷電のほこら",
  bgm: "shrine",
  encounter: "stormshrine",
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
    "#.s............#",
    "################",
  ],
  events: [
    { x: 2, y: 10, type: "enter", warp: { map: "world6", x: 15, y: 9, dir: "d" } },
    { x: 12, y: 1, type: "enter", warp: { map: "stormshrine2", x: 3, y: 1, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "ss1", x: 14, y: 3, gold: 9000 },
    { id: "ss2", x: 1, y: 7, item: "xpotion" },
    { id: "ss3", x: 6, y: 10, item: "w_raijin", hidden: true },
  ],
};

DATA.maps.stormshrine2 = {
  name: "らいじんのまえにわ",
  bgm: "shrine",
  encounter: "stormshrine",
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
    { x: 3, y: 1, type: "enter", warp: { map: "stormshrine1", x: 12, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "tonitrusnpc", x: 6, y: 6, spr: "demon", pal: "light", hideFlag: "stormBoss",
      script: [
        { msg: "空が さけ、稲妻が ほこらに\nふりそそぐ……!" },
        { msg: "『ちいさきものよ……。 わが いかづちを\nうけながら なお たとうと するか。\nよかろう、その いさみ ためしてくれる』" },
        { battle: { group: ["tonitrus"], boss: true, music: "spirit" } },
        { flag: ["stormBoss", 1] },
        { msg: "『……よき 魂 なり。 いかりは\nしずまった。めぐみの あめを しまに\nかえそう』 らいじんは 空へ のぼった。" },
        { give: { item: "acc_boltcharm" } },
        { msg: "雷よけのお守りを 手に入れた!\n(雷ダメージ無効)" },
        { msg: "しまの 空が はれわたっていく……。" },
      ] },
  ],
  chests: [
    { id: "ss4", x: 8, y: 5, item: "worldtear" },
    { id: "ss5", x: 4, y: 5, gold: 16000, hidden: true },
  ],
};

// ---------------- 緑の群島 (だい6のちいき) ----------------
DATA.maps.world5 = {
  name: "緑の群島",
  crisis: "ruinsBoss",
  outdoor: true,
  bgm: "field",
  encounter: "world5",
  legend: {
    "w": { tile: "water", solid: true },
    "m": { tile: "mountain", solid: true },
    ".": { tile: "grass" },
    "f": { tile: "forest" },
    "T": { tile: "icon_town" },
    "C": { tile: "icon_cave" },
    "G": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "ww......................wwww",
    "w..ffff.......ff.........www",
    "w..ff....T....ff..........ww",
    "w...f......................w",
    "ww...................G....ww",
    "ww..........ff............ww",
    "w...........ff.............w",
    "w...mm.........C...........w",
    "w...mm.....................w",
    "w.....................ff...w",
    "ww.....ff..........ffff...ww",
    "ww.....ff...........ff....ww",
    "w..........................w",
    "ww........................ww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 21, y: 5, type: "enter", scriptId: "airshipBoard" },
    { x: 9, y: 3, type: "enter", warp: { map: "liefe", x: 9, y: 9, dir: "u" } },
    { x: 15, y: 8, type: "enter", warp: { map: "ruins1", x: 2, y: 10, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "w5a", x: 1, y: 13, gold: 9000, hidden: true },
    { id: "w5b", x: 24, y: 2, item: "elixir", hidden: true },
  ],
};

// ---------------- 木陰のむら リーフェ ----------------
DATA.maps.liefe = {
  name: "木陰のむら リーフェ",
  bgm: "town",
  exit: { map: "world5", x: 9, y: 4, dir: "d" },
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "x": { tile: "flower" },
  },
  rows: [
    "ffffffffffffffffffff",
    "f........x.........f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f...ff.......ff....f",
    "f...ff...x...ff....f",
    "f.x.....x......x...f",
    "f......x......x....f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "liefeinn", x: 4, y: 5, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "liefeshop", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "liefe_chief", x: 10, y: 6, spr: "elder",
      script: [
        { cond: { flag: "ruinsBoss" },
          then: [
            { cond: { flag: "ruinsReward" },
              then: [{ msg: "むらおさ「いせきの 守り神が しずまり\nもりに しずけさが もどった。こかげは\nいつでも あなたがたの やすみばじゃ」" }],
              else: [
                { msg: "むらおさ「守り神を しずめてくれたか!\nこれは むらに つたわる おれいのしなじゃ。\nうけとって くだされ」" },
                { give: { gold: 5000 } },
                { msg: "5000ギルを 手に入れた!" },
                { flag: ["ruinsReward", 1] },
              ] },
          ],
          else: [
            { msg: "むらおさ「森の おくの こだいいせきで\n守り神が あばれだしてのう。よるごとに\nじひびきが むらまで とどくのじゃ」" },
            { msg: "「いにしえの 番人は 雷を\nおそれると いいつたえに ある。どうか\nしずめて くだされ」" },
            { flag: ["ruinsQuest", 1] },
          ] },
      ] },
    { id: "liefe_hunter", x: 5, y: 8, spr: "soldier",
      script: [
        { cond: { flag: "catReward2" },
          then: [{ msg: "もりびと「緑のヒョウが へって\n子供たちも もりで あそべる。\nありがとうな」" }],
          else: [
            { cond: { flag: "catQuest2" },
              then: [
                { cond: { kills: { id: "junglecat", n: 4 } },
                  then: [
                    { msg: "もりびと「4とうも しとめたのか!\nさすがだ。やくそくの ほうびを\nうけとってくれ」" },
                    { give: { gold: 4500 } },
                    { give: { item: "xpotion" } },
                    { msg: "4500ギルと エクスポーションを 手に入れた!" },
                    { flag: ["catReward2", 1] },
                  ],
                  else: [{ msg: "もりびと「緑のヒョウは しまの あちこちだ。\n4とう たのむぞ。図鑑で かずを\nかくにんできるからな」" }] },
              ],
              else: [
                { msg: "もりびと「緑のヒョウが ふえすぎて\nりょうに でられない。4とう たいじして\nくれたら ほうびを だそう」" },
                { flag: ["catQuest2", 1] },
              ] },
          ] },
      ] },
    { id: "liefe_kid", x: 14, y: 8, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "ruinsBoss" },
          then: [{ msg: "子供「じひびきが とまったよ!\nもりの どうぶつたちも\nもどってきたんだ!」" }],
          else: [{ msg: "子供「いせきの おくには ぴかぴかの\n拳が かざってあるんだって!\nみてみたいなー!」" }] },
      ] },
    { id: "liefe_granny", x: 3, y: 9, spr: "villager", wander: true,
      script: [
        { cond: { flag: "ruinsBoss" },
          then: [{ msg: "おばあさん「もりの もやが 晴れて\nきのみずも いっそう おいしくなった。\nいっぱい のんでいくかい?」" }],
          else: [{ msg: "おばあさん「この むらの きのみずは\nからだに いいんだよ。昔から\nびょうきしらずの むらでねえ」" }] },
      ] },
    { id: "liefe_guard", x: 16, y: 6, spr: "soldier",
      script: [
        { cond: { flag: "ruinsBoss" },
          then: [{ msg: "番人「守り神は しずまった。いせきは\nいまや しずかな ものだ。むらの みんなも\nよく ねむれると よろこんでいる」" }],
          else: [{ msg: "番人「いせきの ばんへいは てごわいぞ。\n雷の 魔法が あれば\nみちは ひらけるはずだ」" }] },
      ] },
  ],
  chests: [
    { id: "lf1", x: 17, y: 9, item: "hiether", hidden: true },
  ],
};

DATA.maps.liefeinn = {
  name: "リーフェの宿屋",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb..c..#",
    "#.bb.....#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "liefe", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "liefe", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "liefe_inn", x: 7, y: 2, spr: "innkeep", script: [{ inn: 450 }] },
  ],
  chests: [],
};

DATA.maps.liefeshop = {
  name: "リーフェの店",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.t...c..#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "liefe", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "liefe", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "liefe_shop", x: 7, y: 2, spr: "shopkeep", script: [{ shop: "liefe" }] },
  ],
  chests: [],
};

// ---------------- こだいのいせき ----------------
DATA.maps.ruins1 = {
  name: "こだいのいせき",
  bgm: "under",
  encounter: "ruins",
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
    "#.s............#",
    "################",
  ],
  events: [
    { x: 2, y: 10, type: "enter", warp: { map: "world5", x: 15, y: 9, dir: "d" } },
    { x: 12, y: 1, type: "enter", warp: { map: "ruins2", x: 3, y: 1, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "ru1", x: 14, y: 3, gold: 8000 },
    { id: "ru2", x: 1, y: 7, item: "xpotion" },
    { id: "ru3", x: 6, y: 10, item: "a_leafrobe", hidden: true },
  ],
};

DATA.maps.ruins2 = {
  name: "守り神のま",
  bgm: "under",
  encounter: "ruins",
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
    { x: 3, y: 1, type: "enter", warp: { map: "ruins1", x: 12, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "guardiosnpc", x: 6, y: 6, spr: "golem", hideFlag: "ruinsBoss",
      script: [
        { msg: "いせきの おくで きょだいな いしの\nからだが きしみながら うごきだす……。" },
        { msg: "『シンニュウシャ ヲ カクニン……。\nコダイ ノ チカイ ニ ヨリ\nハイジョ スル』" },
        { battle: { group: ["guardios"], boss: true, music: "boss" } },
        { flag: ["ruinsBoss", 1] },
        { msg: "『キロク ヲ コウシン……。 アタラシキ\nマモリテ ト ミトメル……』\n守り神は しずかに ひざを ついた。" },
        { give: { item: "w_guardfist" } },
        { give: { item: "acc_owlcharm" } },
        { msg: "守りの拳と ふくろうのお守りを\n手に入れた!" },
      ] },
  ],
  chests: [
    { id: "ru4", x: 8, y: 5, item: "worldtear" },
    { id: "ru5", x: 4, y: 5, gold: 14000, hidden: true },
  ],
};

// ---------------- 砂の王国 (だい5のちいき) ----------------
DATA.maps.world4 = {
  name: "砂の王国",
  crisis: "tombBoss",
  weather: "sand",
  outdoor: true,
  bgm: "field",
  encounter: "world4",
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
    "mmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    "m..........................m",
    "m....mm.......ww.........mmm",
    "m....mm..T....ww..........mm",
    "m..........................m",
    "mm...................G....mm",
    "mm..........mm............mm",
    "m...........mm.............m",
    "m...ww.........C...........m",
    "m...ww.....................m",
    "m..........................m",
    "mm.....mm..........ff.....mm",
    "mm.....mm..........ff.....mm",
    "m..........................m",
    "mm........................mm",
    "mmmmmmmmmmmmmmmmmmmmmmmmmmmm",
  ],
  events: [
    { x: 21, y: 5, type: "enter", scriptId: "airshipBoard" },
    { x: 9, y: 3, type: "enter", warp: { map: "zahra", x: 9, y: 9, dir: "u" } },
    { x: 15, y: 8, type: "enter", warp: { map: "sandtomb1", x: 2, y: 10, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "w4a", x: 1, y: 13, gold: 8000, hidden: true },
    { id: "w4b", x: 25, y: 1, item: "elixir", hidden: true },
  ],
};

// ---------------- 砂漠のみやこ ザハラ ----------------
DATA.maps.zahra = {
  name: "砂漠のみやこ ザハラ",
  weather: "sand",
  bgm: "town",
  exit: { map: "world4", x: 9, y: 4, dir: "d" },
  legend: {
    "f": { tile: "palm", solid: true },
    ".": { tile: "sand" },
    "p": { tile: "palm", solid: true },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "w": { tile: "water", solid: true },
  },
  rows: [
    "ffffffffffffffffffff",
    "f..................f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f.......pww........f",
    "f........wwp.......f",
    "f..................f",
    "f.p................f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "zahrainn", x: 4, y: 5, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "zahrashop", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "zahra_chief", x: 12, y: 6, spr: "elder",
      script: [
        { cond: { flag: "summitQuest" },
          then: [
            { cond: { flag: "inviteZahra" },
              then: [],
              else: [
                { msg: "ぞくちょう「砂漠の たみを かいぎに まねくとは\nバロンおうも ふところが ふかい。\nキャラバンを つれて うかがおう」" },
                { flag: ["inviteZahra", 1] },
              ] },
          ], else: [] },
        { cond: { flag: "tombBoss" },
          then: [
            { cond: { flag: "tombReward" },
              then: [{ msg: "ぞくちょう「だいびょうの おうが しずまり\nすなあらしも おさまった。オアシスは\nいつでも あなたがたを むかえよう」" }],
              else: [
                { msg: "ぞくちょう「よみがえった おうを もういちど\nねむりに つかせて くれたのだな。\nこれは いちぞくからの れいだ」" },
                { give: { gold: 4000 } },
                { msg: "4000ギルを 手に入れた!" },
                { flag: ["tombReward", 1] },
              ] },
          ],
          else: [
            { msg: "ぞくちょう「だいびょうに ねむる いにしえの\nおうが よみがえってしもうた。よるごとに\nすな嵐が まちを おそうのだ」" },
            { msg: "「おうは ほのおと せいなる 力を\nおそれている。どうか ふたたび\nねむらせて やってくれ」" },
            { flag: ["tombQuest", 1] },
          ] },
      ] },
    { id: "zahra_hunter", x: 5, y: 8, spr: "soldier",
      script: [
        { cond: { flag: "wormReward" },
          then: [{ msg: "すなかりびと「砂ワームが へって\nキャラバンも あんしんして とおれる。\nあんたの おかげだ」" }],
          else: [
            { cond: { flag: "wormQuest" },
              then: [
                { cond: { kills: { id: "sandworm2", n: 4 } },
                  then: [
                    { msg: "すなかりびと「4ひきも しとめたか!\nたいした うでまえだ。 やくそくの\nほうびを うけとってくれ」" },
                    { give: { gold: 4000 } },
                    { give: { item: "remedy" } },
                    { msg: "4000ギルと 万能薬を 手に入れた!" },
                    { flag: ["wormReward", 1] },
                  ],
                  else: [{ msg: "すなかりびと「砂ワームは 砂漠の\nあちこちに いる。4ひき たのんだぞ。\n図鑑で かずを かくにんできる」" }] },
              ],
              else: [
                { msg: "すなかりびと「砂ワームどもが キャラバンを\nおそって こまっている。4ひき たいじして\nくれたら ほうびを だそう」" },
                { flag: ["wormQuest", 1] },
              ] },
          ] },
      ] },
    { id: "zahra_dancer", x: 14, y: 8, spr: "celia", wander: true,
      script: [
        { cond: { flag: "tombBoss" },
          then: [{ msg: "おどりこ「すな嵐が やんで 星が\nみえるわ。こよいの おどりは\nとくべつ、みていって!」" }],
          else: [{ msg: "おどりこ「オアシスの 夜は おどりと\nうたで あける。あなたも いちど\nみていくと いいわ」" }] },
      ] },
    { id: "zahra_kid", x: 3, y: 9, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "tombBoss" },
          then: [{ msg: "子供「おばけ いなくなったんでしょ?\nこんど だいびょうに たんけんに\nいくんだ! ないしょだよ!」" }],
          else: [{ msg: "子供「だいびょうには 王様の たからが\nねむってるんだって! でも おばけが\nでるから だれも ちかづかないの」" }] },
      ] },
    { id: "zahra_merchant", x: 16, y: 6, spr: "villager",
      script: [
        { cond: { flag: "tombBoss" },
          then: [{ msg: "商人「キャラバンが もどって\n商売はんじょうだ! あんたには\nれいに まけておきたい くらいさ」" }],
          else: [{ msg: "商人「円月刀は 砂漠の ほこり。\n炎を やどす きっさきは\n氷の 魔物に よくきくぞ」" }] },
      ] },
  ],
  chests: [
    { id: "za1", x: 17, y: 9, item: "xpotion", hidden: true },
  ],
};

DATA.maps.zahrainn = {
  name: "ザハラの宿屋",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb..c..#",
    "#.bb.....#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "zahra", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "zahra", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "zahra_inn", x: 7, y: 2, spr: "innkeep", script: [{ inn: 400 }] },
  ],
  chests: [],
};

DATA.maps.zahrashop = {
  name: "ザハラの店",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.t...c..#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "zahra", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "zahra", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "zahra_shop", x: 7, y: 2, spr: "shopkeep", script: [{ shop: "zahra" }] },
  ],
  chests: [],
};

// ---------------- すなのだいびょう ----------------
DATA.maps.sandtomb1 = {
  name: "すなのだいびょう",
  bgm: "under",
  encounter: "sandtomb",
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
    "#.s............#",
    "################",
  ],
  events: [
    { x: 2, y: 10, type: "enter", warp: { map: "world4", x: 15, y: 9, dir: "d" } },
    { x: 12, y: 1, type: "enter", warp: { map: "sandtomb2", x: 3, y: 1, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "st1", x: 14, y: 3, gold: 7000 },
    { id: "st2", x: 1, y: 7, item: "hiether" },
    { id: "st3", x: 6, y: 10, item: "elixir", hidden: true },
  ],
};

DATA.maps.sandtomb2 = {
  name: "おうのげんしつ",
  bgm: "under",
  encounter: "sandtomb",
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
    { x: 3, y: 1, type: "enter", warp: { map: "sandtomb1", x: 12, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "khamnpc", x: 6, y: 6, spr: "king", pal: "dark", hideFlag: "tombBoss",
      script: [
        { msg: "ひつぎの ふたが おちる おとが\nげんしつに ひびきわたる……。" },
        { msg: "『……わが ねむりを さまたげ、わが たからを\nねらう ふとどきもの。 すなの おきてに より\nさばきを くだす』" },
        { battle: { group: ["kham"], boss: true, music: "boss" } },
        { flag: ["tombBoss", 1] },
        { cond: { all: ["mirrorBoss", "glacierBoss", "tombBoss"] },
          then: [
            { cond: { flag: "ch6" },
              then: [],
              else: [
                { msg: "みっつの 災いが しずまり、\n世界の もやが うすらいでいく。\nのこる けはいは みなみの 島々……。" },
                { chapter: "第六章  常夜編" },
                { flag: ["ch6", 1] },
              ] },
          ],
          else: [] },
        { msg: "『……ながき ゆめで あった。 とわの やすらぎを\nくれた なんじらに、わが やりを たくす』\nおうは しずかに ねむりに ついた。" },
        { give: { item: "w_sandlance" } },
        { give: { item: "acc_venomband" } },
        { msg: "すな嵐の槍と 毒よけのバングルを\n手に入れた!" },
      ] },
  ],
  chests: [
    { id: "st4", x: 8, y: 5, item: "worldtear" },
    { id: "st5", x: 4, y: 5, gold: 12000, hidden: true },
    { id: "st6", x: 14, y: 10, item: "acc_aegis", hidden: true },
  ],
};

// ---------------- 氷の列島 (だい4のちいき) ----------------
DATA.maps.world3 = {
  name: "氷の列島",
  crisis: "glacierBoss",
  weather: "snow",
  outdoor: true,
  bgm: "field",
  encounter: "world3",
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
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "ww......................wwww",
    "w....mm.......ff.........www",
    "w....mm..T...............www",
    "w..........................w",
    "ww...www.......mm.....G...ww",
    "ww...www.......mm.........ww",
    "w..........................w",
    "w...ff.........C...........w",
    "w...ff.....................w",
    "w..........................w",
    "ww.....mm..........ff.....ww",
    "ww.....mm..........ff.....ww",
    "w..........................w",
    "ww........................ww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 22, y: 5, type: "enter", scriptId: "airshipBoard" },
    { x: 9, y: 3, type: "enter", warp: { map: "frim", x: 9, y: 9, dir: "u" } },
    { x: 15, y: 8, type: "enter", warp: { map: "glaciercave1", x: 2, y: 10, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "w3a", x: 1, y: 13, gold: 7000, hidden: true },
    { id: "w3b", x: 26, y: 4, item: "elixir", hidden: true },
  ],
};

// ---------------- ゆきのむら フリム ----------------
DATA.maps.frim = {
  name: "ゆきのむら フリム",
  weather: "snow",
  bgm: "town",
  exit: { map: "world3", x: 9, y: 4, dir: "d" },
  legend: {
    "f": { tile: "pine", solid: true },
    ".": { tile: "snow" },
    "p": { tile: "pine", solid: true },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
  },
  rows: [
    "ffffffffffffffffffff",
    "f..................f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f..p..........p....f",
    "f..................f",
    "f..................f",
    "f.....p.......p....f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "friminn", x: 4, y: 5, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "frimshop", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "frim_elder", x: 10, y: 6, spr: "elder",
      script: [
        { cond: { flag: "summitQuest" },
          then: [
            { cond: { flag: "inviteFrim" },
              then: [],
              else: [
                { msg: "むらおさ「世界会議……! ゆきに とざされた\nむらにも はるが くるようじゃ。\nぜひ さんか させてもらう」" },
                { flag: ["inviteFrim", 1] },
              ] },
          ], else: [] },
        { cond: { flag: "glacierBoss" },
          then: [
            { cond: { flag: "glacierReward" },
              then: [{ msg: "むらおさ「ひょうがの めがみが しずまり\nふぶきも やわらいだ。むらの おんじんよ、\nいつでも たずねてきなされ」" }],
              else: [
                { msg: "むらおさ「めがみを しずめてくれたか!\nこれは むらからの 心ばかりの れいじゃ」" },
                { give: { gold: 3000 } },
                { msg: "3000ギルを 手に入れた!" },
                { flag: ["glacierReward", 1] },
              ] },
          ],
          else: [
            { msg: "むらおさ「ひょうがの おくに ねむる めがみが\nめざめてしもうた。ふぶきが やまず\nりょうにも でられん……」" },
            { msg: "「どうか めがみを しずめて くだされ。\n炎の 力が あれば\nみちは ひらけるはずじゃ」" },
            { flag: ["glacierQuest", 1] },
          ] },
      ] },
    { id: "frim_hunter", x: 5, y: 7, spr: "soldier",
      script: [
        { cond: { flag: "wolfReward" },
          then: [{ msg: "かりゅうど「雪オオカミの むれが へって\nむらの 子供も そとで あそべるように\nなった。おかげさまだ」" }],
          else: [
            { cond: { flag: "wolfQuest" },
              then: [
                { cond: { kills: { id: "snowwolf", n: 3 } },
                  then: [
                    { msg: "かりゅうど「雪オオカミを 3とうも!?\nあんた ほんものの かりゅうどだ。\nやくそくの ほうびだ、うけとってくれ」" },
                    { give: { gold: 3500 } },
                    { give: { item: "xpotion" } },
                    { msg: "3500ギルと エクスポーションを 手に入れた!" },
                    { flag: ["wolfReward", 1] },
                  ],
                  else: [{ msg: "かりゅうど「雪オオカミは しまの あちこちに\nいる。3とう 倒したら もどってきてくれ。\n図鑑で かずを かぞえられるぞ」" }] },
              ],
              else: [
                { msg: "かりゅうど「雪オオカミが ふえすぎて\nこまっている。3とう たいじして\nくれないか? ほうびは はずむぞ」" },
                { flag: ["wolfQuest", 1] },
              ] },
          ] },
      ] },
    { id: "frim_kid", x: 14, y: 8, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "glacierBoss" },
          then: [{ msg: "子供「ふぶきが やんだから\nゆきだるま 3だんに できたの!\nむらで いちばん おおきいんだよ!」" }],
          else: [{ msg: "子供「ゆきだるま つくったら\nいちばん うえの たまが ころがって\nいっちゃったの! さがしてるの!」" }] },
      ] },
    { id: "frim_granny", x: 3, y: 8, spr: "villager", wander: true,
      script: [
        { cond: { flag: "glacierBoss" },
          then: [{ msg: "おばあさん「めがみさまが しずまって\n空の もやも 晴れたねえ。ひなたが\nこんなに あったかいとは……」" }],
          else: [{ msg: "おばあさん「ひょうがの おくには むかし、\nうつくしい めがみさまが すんでいたと\nいいつたえに あるんだよ」" }] },
      ] },
    { id: "frim_guard", x: 16, y: 6, spr: "soldier",
      script: [
        { cond: { flag: "glacierBoss" },
          then: [{ msg: "番人「ひょうがの 魔物も めっきり\nおとなしくなった。あんたたちの おかげだ。\nゆっくりして いってくれ」" }],
          else: [{ msg: "番人「ひょうがの洞窟は このさきだ。\n氷の 魔物は ほのおに よわい。\nじゅんびは いいか?」" }] },
      ] },
  ],
  chests: [
    { id: "fr1", x: 17, y: 9, item: "hiether", hidden: true },
  ],
};

DATA.maps.friminn = {
  name: "フリムの宿屋",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb..c..#",
    "#.bb.....#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "frim", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "frim", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "frim_inn", x: 7, y: 2, spr: "innkeep", script: [{ inn: 350 }] },
  ],
  chests: [],
};

DATA.maps.frimshop = {
  name: "フリムの店",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.t...c..#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "frim", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "frim", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "frim_shop", x: 7, y: 2, spr: "shopkeep", script: [{ shop: "frim" }] },
  ],
  chests: [],
};

// ---------------- ひょうがの洞窟 ----------------
DATA.maps.glaciercave1 = {
  name: "ひょうがの洞窟",
  bgm: "dungeon",
  encounter: "glaciercave",
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
    "#.s............#",
    "################",
  ],
  events: [
    { x: 2, y: 10, type: "enter", warp: { map: "world3", x: 15, y: 9, dir: "d" } },
    { x: 12, y: 1, type: "enter", warp: { map: "glaciercave2", x: 3, y: 1, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "gc1", x: 14, y: 3, gold: 6000 },
    { id: "gc2", x: 1, y: 7, item: "xpotion" },
    { id: "gc3", x: 6, y: 10, item: "w_blizzard", hidden: true },
  ],
};

DATA.maps.glaciercave2 = {
  name: "めがみのさいだん",
  bgm: "dungeon",
  encounter: "glaciercave",
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
    { x: 3, y: 1, type: "enter", warp: { map: "glaciercave1", x: 12, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "glaciellanpc", x: 6, y: 6, spr: "celia", pal: "light", hideFlag: "glacierBoss",
      script: [
        { msg: "さいだんの 氷が ひかり、\nうつくしい かげが たちあがる……。" },
        { msg: "『……吹雪の こもりうたを みだすのは\nだれ。 わたくしの ねむりを さまたげるもの、\nこおりに とけて きえなさい』" },
        { battle: { group: ["glaciella"], boss: true, music: "spirit" } },
        { flag: ["glacierBoss", 1] },
        { cond: { all: ["mirrorBoss", "glacierBoss", "tombBoss"] },
          then: [
            { cond: { flag: "ch6" },
              then: [],
              else: [
                { msg: "みっつの 災いが しずまり、\n世界の もやが うすらいでいく。\nのこる けはいは みなみの 島々……。" },
                { chapter: "第六章  常夜編" },
                { flag: ["ch6", 1] },
              ] },
          ],
          else: [] },
        { msg: "『……あ戦い ちから。 ながい ゆめは\nおわったのね。 ふぶきは やみ、\nはるが おとずれるでしょう』" },
        { give: { item: "a_aurora" } },
        { msg: "オーロラのマントを 手に入れた!" },
      ] },
  ],
  chests: [
    { id: "gc4", x: 8, y: 5, item: "elixir" },
    { id: "gc5", x: 4, y: 5, gold: 9000, hidden: true },
    { id: "gc6", x: 14, y: 3, item: "w_seijo", hidden: true },
  ],
};

// ---------------- 東の大陸 (だい3のちいき) ----------------
DATA.maps.world2 = {
  name: "東の大陸",
  crisis: "mirrorBoss",
  outdoor: true,
  bgm: "field",
  encounter: "world2",
  legend: {
    "w": { tile: "water", solid: true },
    "m": { tile: "mountain", solid: true },
    ".": { tile: "grass" },
    "f": { tile: "forest" },
    "T": { tile: "icon_town" },
    "P": { tile: "icon_town" },
    "C": { tile: "icon_cave" },
    "X": { tile: "icon_tower" },
    "G": { tile: "icon_shrine" },
  },
  rows: [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "ww.........P............wwww",
    "w...mmm.........ff.......www",
    "w...m.m....T....ff........ww",
    "w...mmm..................www",
    "w.........................ww",
    "ww....ff.........mmmm.....ww",
    "ww....ff....G....m..m.....ww",
    "w................m.Xm......w",
    "w................mmmm......w",
    "w....m.m...................w",
    "w....m.m..........ff.......w",
    "w....mCm..........ff.......w",
    "w....m.m...................w",
    "w....mmm...........mm......w",
    "w..................mm......w",
    "ww........................ww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  events: [
    { x: 12, y: 7, type: "enter", scriptId: "airshipBoard" },
    { x: 11, y: 3, type: "enter", warp: { map: "twine", x: 9, y: 9, dir: "u" } },
    { x: 11, y: 1, type: "enter", warp: { map: "lakepier", x: 6, y: 7, dir: "u" } },
    { x: 6, y: 12, type: "enter", warp: { map: "mirrorcave1", x: 2, y: 10, dir: "u" } },
    { x: 19, y: 8, type: "enter",
      cond: { flag: "mirrorBoss" },
      failScript: [{ msg: "とうの 扉には かがみの紋章。\nかがみの洞窟の ぬしの けはいが\nきえれば ひらきそうだ。" }],
      warp: { map: "eternaltower1", x: 8, y: 11, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "w2a", x: 2, y: 16, gold: 6000, hidden: true },
    { id: "w2b", x: 24, y: 2, item: "elixir", hidden: true },
  ],
};

// ---------------- 湖のまち トワイン ----------------
DATA.maps.twine = {
  name: "湖のまち トワイン",
  bgm: "town",
  exit: { map: "world2", x: 11, y: 4, dir: "d" },
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "D": { tile: "door" },
    "w": { tile: "water", solid: true },
    "x": { tile: "flower" },
  },
  rows: [
    "ffffffffffffffffffff",
    "f..................f",
    "f.WWWWW......WWWWW.f",
    "f.WWWWW......WWWWW.f",
    "f.WWdWW......WWDWW.f",
    "f..................f",
    "f....wwww.....x....f",
    "f....wwww..........f",
    "f.....ww.....x.....f",
    "f.x................f",
    "ffffffff....ffffffff",
  ],
  events: [
    { x: 4, y: 4, type: "enter", warp: { map: "twineinn", x: 4, y: 5, dir: "u" } },
    { x: 15, y: 4, type: "enter", warp: { map: "twineshop", x: 4, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "twine_elder", x: 10, y: 6, spr: "elder",
      script: [
        { cond: { flag: "summitQuest" },
          then: [
            { cond: { flag: "inviteTwine" },
              then: [],
              else: [
                { msg: "まちのおさ「バロンおうから 世界会議の\n招待とは こうえいだ。\nよろこんで さんか しよう」" },
                { flag: ["inviteTwine", 1] },
              ] },
          ], else: [] },
        { cond: { flag: "mirrorBoss" },
          then: [
            { cond: { flag: "twinReward" },
              then: [{ msg: "まちのおさ「かがみのぬしは もう いない。\n湖に うつる 空が\nこんなに あおいとはのう……」" }],
              else: [
                { msg: "まちのおさ「かがみのぬしを たおして\nくれたのか! まちの みんなに かわって\nれいを いわせてくれ」" },
                { give: { gold: 2000 } },
                { msg: "2000ギルを 手に入れた!" },
                { flag: ["twinReward", 1] },
              ] },
          ],
          else: [
            { msg: "まちのおさ「にしの 洞窟には かがみの\n魔物が すみついておる。湖に\nうつる かげまで ぬすまれる ありさまじゃ」" },
            { msg: "「たびのかた、どうか ぬしを\nたいじして くださらんか」" },
            { flag: ["twinQuest", 1] },
          ] },
      ] },
    { id: "twine_fisher", x: 5, y: 8, spr: "villager",
      script: [
        { cond: { flag: "mirrorBoss" },
          then: [{ msg: "つりびと「もやが 晴れて 湖が\nかがみみたいだろ? きょうは\nぜっこうの つりびよりさ」" }],
          else: [{ msg: "つりびと「この 湖には おろちが\nすんでいてね。ちいさい ふねじゃ\nこわくて こげないんだ」" }] },
      ] },
    { id: "twine_kid", x: 14, y: 8, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "towerOpen" },
          then: [{ msg: "子供「よぞらの 星の塔、とびらが\nひらいたんだって! だれが のぼるのか\nみんなで うわさしてるんだ!」" }],
          else: [{ msg: "子供「とうの てっぺんには『ときの 番人』が\nいるんだって! じかんを とめられるって\nほんとかなー?」" }] },
      ] },
    { id: "twine_merchant", x: 3, y: 9, spr: "villager", wander: true,
      script: [
        { cond: { flag: "mirrorBoss" },
          then: [{ msg: "商人「ぬしが きえてから 客あしが\nもどってきてね。ふたごの槍も\nとぶように うれてるよ!」" }],
          else: [{ msg: "商人「ふたごの槍は この まちの\nめいぶつさ。湖に うつる かげと\nふたりで たたかえるって わけ」" }] },
      ] },
    { id: "twine_guard", x: 16, y: 6, spr: "soldier",
      script: [
        { cond: { flag: "chronoBoss" },
          then: [{ msg: "けいびへい「とうの 光が しずまった……。\nあんたたちが やったのか。 たいしたもんだ」" }],
          else: [{ msg: "けいびへい「ひがしの とうには ちかづくな。\nよるな よるな、じかんが くるうぞ」" }] },
      ] },
  ],
  chests: [
    { id: "tw1", x: 17, y: 9, item: "xpotion", hidden: true },
  ],
};

DATA.maps.twineinn = {
  name: "トワインの宿屋",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb..c..#",
    "#.bb.....#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "twine", x: 4, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "twine", x: 4, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "twine_inn", x: 7, y: 2, spr: "innkeep", script: [{ inn: 300 }] },
  ],
  chests: [],
};

DATA.maps.twineshop = {
  name: "トワインの店",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "t": { tile: "table", solid: true },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.t...c..#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "twine", x: 15, y: 5, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "twine", x: 15, y: 5, dir: "d" } },
  ],
  npcs: [
    { id: "twine_shop", x: 7, y: 2, spr: "shopkeep", script: [{ shop: "twine" }] },
  ],
  chests: [],
};

// ---------------- かがみの洞窟 ----------------
DATA.maps.mirrorcave1 = {
  name: "かがみの洞窟",
  bgm: "dungeon",
  encounter: "mirrorcave",
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
    "#.s............#",
    "################",
  ],
  events: [
    { x: 2, y: 10, type: "enter", warp: { map: "world2", x: 6, y: 11, dir: "d" } },
    { x: 12, y: 1, type: "enter", warp: { map: "mirrorcave2", x: 3, y: 1, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "mc1", x: 14, y: 3, gold: 5000 },
    { id: "mc2", x: 1, y: 7, item: "xpotion" },
    { id: "mc3", x: 6, y: 10, item: "elixir", hidden: true },
  ],
};

DATA.maps.mirrorcave2 = {
  name: "かがみのま",
  bgm: "dungeon",
  encounter: "mirrorcave",
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
    { x: 3, y: 1, type: "enter", warp: { map: "mirrorcave1", x: 12, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "mirrorfiendnpc", x: 6, y: 6, spr: "eye", pal: "dark", hideFlag: "mirrorBoss",
      script: [
        { msg: "かがみの おくで ひとみが ひらく……。\nかがみのぬし ミラーフィエンド!!" },
        { battle: { group: ["mirrorfiend"], boss: true, music: "boss" } },
        { flag: ["mirrorBoss", 1] },
        { cond: { all: ["mirrorBoss", "glacierBoss", "tombBoss"] },
          then: [
            { cond: { flag: "ch6" },
              then: [],
              else: [
                { msg: "みっつの 災いが しずまり、\n世界の もやが うすらいでいく。\nのこる けはいは みなみの 島々……。" },
                { chapter: "第六章  常夜編" },
                { flag: ["ch6", 1] },
              ] },
          ],
          else: [] },
        { msg: "かがみは くだけ、とらわれていた\nまちの かげたちが かえっていった。" },
        { give: { item: "w_mirror" } },
        { give: { item: "acc_bellcharm" } },
        { msg: "ミラーブレードと 銀の鈴を 手に入れた!\n(ひがしの とうの 封印も とけたようだ)" },
      ] },
  ],
  chests: [
    { id: "mc4", x: 8, y: 5, item: "worldtear" },
    { id: "mc5", x: 4, y: 5, gold: 7000, hidden: true },
  ],
};

// ---------------- とこしえのとう ----------------
DATA.maps.eternaltower1 = {
  name: "とこしえのとう",
  bgm: "dungeon",
  encounter: "eternaltower",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#s....#........#",
    "#.##.##.#####..#",
    "#.#...........##",
    "#.#.#########..#",
    "#.#.#.......#..#",
    "#.#.#.#####.#..#",
    "#.#...#...#.#..#",
    "#.#####.#.#.#..#",
    "#.......#...#..#",
    "#.#######.###..#",
    "#.......s......#",
    "################",
  ],
  events: [
    { x: 8, y: 11, type: "enter", warp: { map: "world2", x: 18, y: 8, dir: "d" } },
    { x: 1, y: 1, type: "enter", warp: { map: "eternaltower2", x: 7, y: 2, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "et1", x: 8, y: 7, item: "elixir" },
    { id: "et2", x: 14, y: 5, gold: 9000, hidden: true },
    { id: "et3", x: 13, y: 3, item: "hiether" },
  ],
};

DATA.maps.eternaltower2 = {
  name: "ときの頂上",
  bgm: "dungeon",
  encounter: "eternaltower",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#......s.......#",
    "#..............#",
    "#..##......##..#",
    "#..............#",
    "#..............#",
    "#..##......##..#",
    "#..............#",
    "#..............#",
    "################",
  ],
  events: [
    { x: 7, y: 1, type: "enter", warp: { map: "eternaltower1", x: 1, y: 2, dir: "d" } },
  ],
  npcs: [
    { id: "chronovanpc", x: 7, y: 5, spr: "wizard", pal: "light", hideFlag: "chronoBoss",
      script: [
        { msg: "とうの 頂上で すなどけいが\nひっくりかえる おとが した……。" },
        { msg: "『ときを みだす ものども……。\nわれは 時の番人 クロノヴァ。\nこの ときを こえてみせよ』" },
        { battle: { group: ["chronova"], boss: true, music: "spirit" } },
        { flag: ["chronoBoss", 1] },
        { msg: "『……ときは ふたたび ながれはじめた。\nなんじらの あゆみに しゅくふくを』\n番人は すなに かえっていった。" },
        { give: { item: "a_chrono" } },
        { msg: "時の鎧を 手に入れた!" },
      ] },
  ],
  chests: [
    { id: "et4", x: 2, y: 8, item: "xpotion" },
    { id: "et5", x: 13, y: 8, item: "elixir", hidden: true },
    { id: "et6", x: 2, y: 2, item: "w_genja", hidden: true },
    { id: "et7", x: 14, y: 8, item: "acc_manaring", hidden: true },
  ],
};

// ---------------- まちの みんか ----------------
DATA.maps.house1 = {
  name: "みならいきしのいえ",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "t": { tile: "table", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb...t.#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "town", x: 3, y: 14, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "town", x: 3, y: 14, dir: "d" } },
  ],
  npcs: [
    { id: "h1_trainee", x: 3, y: 4, spr: "soldier",
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "みならいきし「ぼくも いつか あなたのような\nきしに なります! まいにち すぶり\n100かい してるんです!」" }],
          else: [{ msg: "みならいきし「おしろの きしだんに\nはいるのが ゆめなんです。でも まだ\nすぶりで せいいっぱいで……」" }] },
      ] },
    { id: "h1_mother", x: 7, y: 4, spr: "villager", wander: true,
      script: [{ msg: "ははおや「うちのこは あさから ばんまで\nすぶり ばかり。ごはんの ときくらい\nけんを おいてほしいわ」" }] },
    { id: "cat1", x: 6, y: 2, spr: "cat",
      script: [
        { cond: { flag: "cat1" },
          then: [{ msg: "ネコ「ニャーオ」\n(もう すっかり なかよしだ)" }],
          else: [
            { msg: "ネコ「ニャッ!?」\nネコと なかよく なった!" },
            { flag: ["cat1", 1] },
          ] },
      ] },
  ],
  chests: [
    { id: "h1c", x: 1, y: 5, item: "potion", hidden: true },
  ],
};

DATA.maps.house2 = {
  name: "ねこずきのいえ",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "t": { tile: "table", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb...t.#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "town", x: 16, y: 14, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "town", x: 16, y: 14, dir: "d" } },
  ],
  npcs: [
    { id: "catlady", x: 4, y: 3, spr: "villager",
      script: [
        { cond: { flag: "catDone" },
          then: [{ msg: "ねこずきの おばあさん「うちのこたちが\nあなたの うわさを しているよ。\nニャーって ね。ほほほ」" }],
          else: [
            { cond: { all: ["cat1", "cat2", "cat3", "cat4", "cat5"] },
              then: [
                { msg: "おばあさん「まあまあ! むらじゅうの ねこと\nなかよく なったんだって?\nあんた ねこの 心が わかるひとだね」" },
                { give: { item: "a_bell" } },
                { give: { gold: 3000 } },
                { msg: "ねこの鈴と 3000ギルを 手に入れた!" },
                { flag: ["catDone", 1] },
              ],
              else: [
                { msg: "ねこずきの おばあさん「世界には 5ひき、\nとくべつな ねこが いるんだよ。\nなでて なかよく なってごらん」" },
                { msg: "「きしの たまごの いえ、山のさとの 2けん、\n長老の いえ、それに 地底の 王宮。\nみんな きまぐれだから やさしくね」" },
                { flag: ["catQuest", 1] },
              ] },
          ] },
      ] },
    { id: "ladycat", x: 6, y: 3, spr: "cat",
      script: [{ msg: "ネコ「ニャ〜ン」\n(おばあさんの ねこだ。まんぞくそう)" }] },
  ],
  chests: [
    { id: "h2c", x: 8, y: 5, gold: 500, hidden: true },
  ],
};

DATA.maps.house3 = {
  name: "こうざんふうふのいえ",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "t": { tile: "table", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.bb...t.#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "muspel", x: 3, y: 12, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "muspel", x: 3, y: 12, dir: "d" } },
  ],
  npcs: [
    { id: "h3_miner", x: 3, y: 4, spr: "villager", pal: "dark",
      script: [
        { cond: { flag: "earthCrystal" },
          then: [{ msg: "こうふ「ちのクリスタルの ばしょが\nしずまったおかげで、こうざんも\nあんぜんに なっただよ」" }],
          else: [{ msg: "こうふ「さいきん こうざんの おくで\nへんな ゆれを かんじるだ。\nいやな よかんが するだよ」" }] },
      ] },
    { id: "h3_wife", x: 6, y: 4, spr: "villager", pal: "dark", wander: true,
      script: [{ msg: "おかみさん「うちのひとったら やすみのひも\nつるはしの ていれ ばっかり。\nこまったもんだべ」" }] },
    { id: "cat2", x: 2, y: 2, spr: "cat",
      script: [
        { cond: { flag: "cat2" },
          then: [{ msg: "ネコ「ニャーオ」\n(もう すっかり なかよしだ)" }],
          else: [
            { msg: "ネコ「ニャッ!?」\nネコと なかよく なった!" },
            { flag: ["cat2", 1] },
          ] },
      ] },
  ],
  chests: [
    { id: "h3c", x: 8, y: 1, item: "hipotion", hidden: true },
  ],
};

DATA.maps.house4 = {
  name: "しゅうしゅうかのいえ",
  bgm: "town",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed" },
    "t": { tile: "table", solid: true },
  },
  rows: [
    "##########",
    "#........#",
    "#.t..t.b.#",
    "#........#",
    "#........#",
    "#........#",
    "####DD####",
  ],
  events: [
    { x: 4, y: 6, type: "enter", warp: { map: "muspel", x: 16, y: 12, dir: "d" } },
    { x: 5, y: 6, type: "enter", warp: { map: "muspel", x: 16, y: 12, dir: "d" } },
  ],
  npcs: [
    { id: "h4_collector", x: 3, y: 4, spr: "villager", pal: "dark",
      script: [
        { cond: { item: "heroproof" },
          then: [{ msg: "しゅうしゅうか「え!? 英雄のあかしを\nもってるだか!? いちど さわらせて……\nああ、なんて かがやきだべ……」" }],
          else: [{ msg: "しゅうしゅうか「おらの コレクションは\n地底いちだべ。伝説の『英雄のあかし』を\nいつか この めで みてみたいもんだ」" }] },
      ] },
    { id: "cat3", x: 7, y: 3, spr: "cat",
      script: [
        { cond: { flag: "cat3" },
          then: [{ msg: "ネコ「ニャーオ」\n(もう すっかり なかよしだ)" }],
          else: [
            { msg: "ネコ「ニャッ!?」\nネコと なかよく なった!" },
            { flag: ["cat3", 1] },
          ] },
      ] },
  ],
  chests: [
    { id: "h4c", x: 8, y: 5, item: "ether", hidden: true },
  ],
};

// ---------------- 幻のしろ (うらダンジョン) ----------------
DATA.maps.phantomhall = {
  name: "幻のしろ",
  bgm: "shrine",
  encounter: "stargrave",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "p": { tile: "pillar", solid: true },
    "r": { tile: "carpet" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#......s.......#",
    "#.p...rr....p..#",
    "#.....rr.......#",
    "#..............#",
    "#.p.........p..#",
    "#..............#",
    "#.p.........p..#",
    "#..............#",
    "#..............#",
    "#......D.......#",
    "################",
  ],
  events: [
    { x: 7, y: 10, type: "enter", warp: { map: "world", x: 13, y: 4, dir: "d" } },
    { x: 7, y: 1, type: "enter", warp: { map: "phantomthrone", x: 7, y: 9, dir: "u" } },
  ],
  npcs: [
    { id: "ph_ghost1", x: 3, y: 4, spr: "villager", pal: "light",
      script: [{ msg: "ぼんやりした ひとかげ「ここは 幻の\nおうこく……。おうは えいえんに\nたみを まちつづけて おられる……」" }] },
    { id: "ph_ghost2", x: 12, y: 8, spr: "soldier", pal: "light",
      script: [{ msg: "ぼんやりした えいへい「おうの けんは\nすべてを つらぬく 光の けん……。\nかてる ものにのみ ゆずられる……」" }] },
  ],
  chests: [
    { id: "ph1", x: 14, y: 10, gold: 20000, hidden: true },
    { id: "ph2", x: 1, y: 10, item: "a_phantom", hidden: true },
  ],
};

DATA.maps.phantomthrone = {
  name: "幻の玉座",
  bgm: "shrine",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "r": { tile: "carpet" },
  },
  rows: [
    "################",
    "#..............#",
    "#..##.rr...##..#",
    "#.....rr.......#",
    "#.....rr.......#",
    "#..............#",
    "#..##......##..#",
    "#..............#",
    "#..............#",
    "#......D.......#",
    "################",
  ],
  events: [
    { x: 7, y: 9, type: "enter", warp: { map: "phantomhall", x: 7, y: 2, dir: "d" } },
  ],
  npcs: [
    { id: "regalianpc", x: 7, y: 3, spr: "king", pal: "light", hideFlag: "phantomBoss",
      script: [
        { msg: "玉座の おうが しずかに たちあがる。\nその すがたは ひかりに すけていた……。" },
        { msg: "『よくぞ まいった、わかき 英雄たちよ。\nわしは 幻の おう レガリア。\nわが けんに いどむ しかくを しめせ』" },
        { battle: { group: ["regalia"], boss: true, music: "spirit" } },
        { flag: ["phantomBoss", 1] },
        { msg: "『……みごとじゃ。 この けんは もはや\nまぼろしに あらず。 なんじの てで\nげんじつの 光と なるがよい』" },
        { give: { item: "w_regalia" } },
        { msg: "王の剣 レガリアを 手に入れた!!\n(攻撃65・せい・3しゅぞくとっこう)" },
        { msg: "おうと しろは ほのかな ひかりに つつまれ\nしずかに きえていった……。" },
      ] },
  ],
  chests: [
    { id: "pt1", x: 14, y: 9, item: "acc_windpin", hidden: true },
  ],
};

// ---------------- 力の神殿 (じょういジョブの せいち) ----------------
DATA.maps.powertemple = {
  name: "力の神殿",
  bgm: "shrine",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "carpet" },
    "S": { tile: "statue", solid: true },
    "T": { tile: "torch", solid: true },
    "d": { tile: "door" },
  },
  rows: [
    "##S##T##T##S##",
    "#............#",
    "#..S......S..#",
    "#............#",
    "#............#",
    "#..S......S..#",
    "#............#",
    "######d#######",
  ],
  events: [
    { x: 6, y: 7, type: "enter", warp: { map: "starworld", x: 16, y: 8, dir: "d" } },
  ],
  npcs: [
    { id: "power_sage", x: 6, y: 2, spr: "elder",
      script: [
        { cond: { flag: "ascended" },
          then: [
            { msg: "神殿の賢者「めざめし 力は\nもう なんじらのもの。 その かがやき、\n星々にも まけておらぬ」" },
          ],
          else: [
            { cond: { flag: "trueClear" },
              then: [
                { msg: "神殿の賢者「ここは 力の神殿。\n星を すくいし 英雄にのみ、その 扉は\nひらかれる」" },
                { msg: "「世界のしずくを 3つ ささげよ。\nさすれば 魂の きゅうきょくの すがたへ\nみちびこう」" },
                { cond: { itemCount: { id: "worldtear", n: 3 } },
                  then: [
                    { menu: { x: 130, y: 150, options: [
                      { label: "ささげる", ops: [
                        { take: { item: "worldtear" } },
                        { take: { item: "worldtear" } },
                        { take: { item: "worldtear" } },
                        { msg: "3つの しずくが うかびあがり、\nまばゆい 光が 5にんを つつむ……!!" },
                        { ascend: 1 },
                        { msg: "賢者「これぞ きゅうきょくの ジョブ。\n力は みなぎり、あらたな わざも\nじきに めざめよう……」" },
                      ] },
                      { label: "やめておく", ops: [
                        { msg: "賢者「心の じゅんびが できたら\nまた くるがよい」" },
                      ] },
                    ] } },
                  ],
                  else: [
                    { msg: "「……まだ しずくが たりぬようだな。\n世界のしずくは かくちの ぬしの もとや\nふかき ダンジョンに ねむっておる」" },
                  ] },
              ],
              else: [
                { msg: "神殿の賢者「星の 闇を はらいし もの\nのみが この 神殿の こえを きける。\n今は まだ そのときに あらず」" },
              ] },
          ] },
      ] },
  ],
  chests: [
    { id: "pw1", x: 1, y: 6, item: "elixir", hidden: true },
  ],
};

// ---------------- 湖の桟橋 (トワインきたの つりば) ----------------
DATA.maps.lakepier = {
  name: "湖の桟橋",
  bgm: "town",
  legend: {
    "w": { tile: "water", solid: true },
    "b": { tile: "bridge" },
    ".": { tile: "grass" },
    "f": { tile: "forest", solid: true },
  },
  rows: [
    "wwwwwwwwwwwwww",
    "wwwwwwwwwwwwww",
    "wwwwwbbwwwwwww",
    "wwwwwbbwwwwwww",
    "wwwwwbbwwwwwww",
    "f....bb......f",
    "f............f",
    "f............f",
    "ffffff..ffffff",
  ],
  events: [
    { x: 6, y: 8, type: "enter", warp: { map: "world2", x: 11, y: 2, dir: "d" } },
    { x: 7, y: 8, type: "enter", warp: { map: "world2", x: 11, y: 2, dir: "d" } },
    { x: 5, y: 2, type: "enter", scriptId: "lakeFishing" },
    { x: 6, y: 2, type: "enter", scriptId: "lakeFishing" },
  ],
  npcs: [
    { id: "angler_lolo", x: 9, y: 5, spr: "villager",
      script: [
        { cond: { all: ["fishKing", "lakeKing"] },
          then: [
            { cond: { flag: "anglerKing" },
              then: [{ msg: "つりびとロロ「そらと 湖、ふたりのぬしを\nつりあげた 伝説の つりし……。\nいっしょに つれて こうえいだよ」" }],
              else: [
                { msg: "つりびとロロ「空のぬしも 湖のぬしも\nつりあげたのかい!? たまげた!!\nこいつは わたしの きもちだ、うけとってくれ」" },
                { give: { gold: 5000 } },
                { msg: "5000ギルを 手に入れた!" },
                { flag: ["anglerKing", 1] },
              ] },
          ],
          else: [
            { msg: "つりびとロロ「この 湖には でっかい\nぬしが すんでいてね。桟橋の さきで\nさおを たらして ごらんよ」" },
            { msg: "「そういえば 空の島にも つりばが\nあるらしいね。りょうほうの ぬしを つったら\nたいしたもんだ」" },
          ] },
      ] },
  ],
  chests: [
    { id: "lp1", x: 1, y: 7, gold: 600, hidden: true },
  ],
};

// ---------------- 見張りの塔 (ちゅうおう山脈の 見張り塔) ----------------
DATA.maps.watchtower1 = {
  name: "見張りの塔",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "d": { tile: "door" },
    "S": { tile: "stairs" },
    "T": { tile: "torch", solid: true },
    "t": { tile: "table", solid: true },
  },
  rows: [
    "############",
    "#T........T#",
    "#..........#",
    "#......t...#",
    "#..........#",
    "#....S.....#",
    "#..........#",
    "#T........T#",
    "#####dd#####",
  ],
  events: [
    { x: 5, y: 8, type: "enter", warp: { map: "world", x: 15, y: 15, dir: "d" } },
    { x: 6, y: 8, type: "enter", warp: { map: "world", x: 15, y: 15, dir: "d" } },
    { x: 5, y: 5, type: "enter", warp: { map: "watchtower2", x: 5, y: 5, dir: "u" } },
  ],
  npcs: [
    { id: "tower_guard", x: 8, y: 3, spr: "villager", pal: "dark",
      script: [
        { msg: "とうもり「ここは ちゅうおう山脈の\n見張りの塔。うえの かいから\n世界中が みわたせるぞ」" },
      ] },
  ],
  chests: [
    { id: "wt1", x: 2, y: 2, item: "hipotion" },
  ],
};

DATA.maps.watchtower2 = {
  name: "見張りの塔 頂上",
  bgm: "town",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "S": { tile: "stairs" },
    "T": { tile: "torch", solid: true },
    "t": { tile: "table", solid: true },
  },
  rows: [
    "############",
    "#..t.......#",
    "#..........#",
    "#..........#",
    "#....S.....#",
    "#..........#",
    "#T........T#",
    "############",
  ],
  events: [
    { x: 5, y: 4, type: "enter", warp: { map: "watchtower1", x: 5, y: 5, dir: "d" } },
    { x: 3, y: 2, type: "enter", scriptId: "towerView" },
  ],
  npcs: [
    { id: "watchman", x: 8, y: 2, spr: "soldier",
      script: [
        { cond: { flag: "trueClear" },
          then: [{ msg: "ものみのワッツ「世界は しずかだ。\nこの けしきを まもったのは\nあんたたちだよ」" }],
          else: [
            { cond: { flag: "airship" },
              then: [{ msg: "ものみのワッツ「きのう 空飛ぶ ふねが\nくもを きって とんでいくのを みたぞ!\nありゃあ たまげた!」" }],
              else: [{ msg: "ものみのワッツ「きたの 空が なんだか\nさわがしい。バロンの ほうかくも\nちかごろ ようすが おかしい……」" }] },
          ] },
        { msg: "「そうそう、風の つよい ひは たいまつの\nかげも ゆれる…… とうの かげは\nよくよく しらべてみる もんだ」" },
      ] },
  ],
  chests: [
    { id: "wt2", x: 10, y: 5, gold: 1500, hidden: true },
  ],
};

// ---------------- 空の船着き場 (ひこうせいび場) ----------------
DATA.maps.airdock = {
  name: "空の船着き場",
  bgm: "town",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "p": { tile: "path" },
    "b": { tile: "bridge" },
    "P": { tile: "pillar", solid: true },
    "B": { tile: "banner", solid: true },
    "t": { tile: "table", solid: true },
  },
  rows: [
    "ffffffffffffffffff",
    "f................f",
    "f..t...PbbP......f",
    "f......bbbb...t..f",
    "f..B...bbbb..t...f",
    "f......bbbb......f",
    "f..ppppppppppp...f",
    "f......ppp.......f",
    "f......ppp.......f",
    "ffffffffppffffffff",
  ],
  events: [
    { x: 8, y: 9, type: "enter", warp: { map: "world", x: 10, y: 29, dir: "d" } },
    { x: 9, y: 9, type: "enter", warp: { map: "world", x: 10, y: 29, dir: "d" } },
  ],
  npcs: [
    { id: "dock_chief", x: 8, y: 4, spr: "villager",
      script: [
        { cond: { flag: "dockDone" },
          then: [
            { cond: { flag: "airship" },
              then: [{ msg: "技師長ガレット「シリウスごうは きょうも\nばっちり せいびずみだ! 空の たびは\nわしらに まかせておけ!」" }],
              else: [{ msg: "技師長ガレット「そうこも きれいに なったし\nさぎょうが はかどる はかどる!\nかんせいしたら いちばんに のせてやろう」" }] },
          ],
          else: [
            { cond: { flag: "dockQuest" },
              then: [
                { cond: { kills: { id: "bat", n: 5 } },
                  then: [
                    { msg: "技師長ガレット「おお! そうこの コウモリを\nたいじして くれたのか! これで あんしんして\nぶひんを しまえるわい」" },
                    { give: { gold: 2500 } },
                    { give: { item: "xpotion" } },
                    { msg: "2500ギルと エクスポーションを 手に入れた!" },
                    { flag: ["dockDone", 1] },
                  ],
                  else: [{ msg: "技師長ガレット「コウモリは 洞窟に\nむれて おるぞ。5ひきも へらせば\nしばらく よりつくまい」" }] },
              ],
              else: [
                { msg: "技師長ガレット「ここは 空飛ぶ ふねの\n船着き場。わしが 技師長の ガレットだ」" },
                { msg: "「じつは こまっておってな…… ぶひんそうこに\nコウモリが すみついて さぎょうに ならん。\n5ひき たいじして くれんか?」" },
                { flag: ["dockQuest", 1] },
              ] },
          ] },
      ] },
    { id: "dock_boy", x: 4, y: 7, spr: "villager", pal: "light", wander: true,
      script: [
        { cond: { flag: "airship" },
          then: [{ msg: "みならいぎしピコ「シリウスごうが 空を とぶすがた\nぼく なんども みたんだ! いつか ぼくも\nそうじゅうしを やるんだ!」" }],
          else: [{ msg: "みならいぎしピコ「ここに でっかい けいりゅうとうを\nたてるんだって! 空飛ぶ ふねが とまるんだよ!\nはやく みたいなあ」" }] },
      ] },
    { id: "dock_master", x: 13, y: 3, spr: "villager", pal: "dark",
      script: [
        { msg: "おやかたドッド「この きばこには プロペラの\nよびぶひんが つまってる。 らんぼうに\nあつかうなよ!」" },
      ] },
  ],
  chests: [
    { id: "ad1", x: 14, y: 7, item: "wing_return" },
    { id: "ad2", x: 2, y: 8, gold: 800, hidden: true },
  ],
};

// ---------------- 殿堂の間 (実績の ホール) ----------------
DATA.maps.halloffame = {
  name: "殿堂の間",
  bgm: "shrine",
  legend: {
    "D": { tile: "door" },
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "p": { tile: "pillar", solid: true },
    "r": { tile: "carpet" },
  },
  rows: [
    "##############",
    "#............#",
    "#.p........p.#",
    "#.....rr.....#",
    "#.....rr.....#",
    "#.p........p.#",
    "#............#",
    "#............#",
    "#.....DD.....#",
    "##############",
  ],
  events: [
    { x: 6, y: 8, type: "enter", warp: { map: "castle", x: 14, y: 2, dir: "d" } },
    { x: 7, y: 8, type: "enter", warp: { map: "castle", x: 14, y: 2, dir: "d" } },
  ],
  npcs: [
    { id: "hall_cry1", x: 5, y: 2, spr: "crystal",
      script: [{ msg: "クリスタルの 光が\nしずかに ゆれている……。" }] },
    { id: "hall_cry2", x: 8, y: 2, spr: "crystal",
      script: [{ msg: "クリスタルの 光が\nあたたかく つつんでくれる。" }] },
    { id: "rush_keeper", x: 10, y: 6, spr: "soldier",
      script: [
        { cond: { flag: "trueClear" },
          then: [
            { msg: "けいしょうの番人「ここは 戦いの きおくを\nよみがえらせる ま。れんせんの あいだ、\n回復は かくせんごの いやし だけだ」" },
            { menu: { options: [
              { label: "物語のみち", ops: [
                { msg: "番人「物語の 5せん!\nいざ、きおくの 扉へ!!」" },
                { battle: { group: ["demonguard"], boss: true, music: "boss" } },
                { healParty: 0.4 },
                { battle: { group: ["kraken"], boss: true, music: "boss" } },
                { healParty: 0.4 },
                { battle: { group: ["tempest"], boss: true, music: "boss" } },
                { healParty: 0.4 },
                { battle: { group: ["zarba"], boss: true, music: "boss" } },
                { healParty: 0.4 },
                { battle: { group: ["voidos"], boss: true, music: "last" } },
                { cond: { flag: "rush1" },
                  then: [{ msg: "番人「なんども こえていくとは……\nあっぱれと しか いいようがない!」" }],
                  else: [
                    { msg: "番人「物語のみち 完破!!\nほうびを うけとってくれ!」" },
                    { give: { gold: 20000 } },
                    { give: { item: "elixir" } },
                    { msg: "20000ギルと エリクサーを 手に入れた!" },
                    { flag: ["rush1", 1] },
                  ] },
              ] },
              { label: "ぬしのみち", ops: [
                { cond: { flag: "rush1" },
                  then: [
                    { msg: "番人「かくちの ぬし 6れんせん!\n心して いけ!!」" },
                    { battle: { group: ["lunavora"], boss: true, music: "spirit" } },
                    { healParty: 0.4 },
                    { battle: { group: ["mirrorfiend"], boss: true, music: "boss" } },
                    { healParty: 0.4 },
                    { battle: { group: ["glaciella"], boss: true, music: "spirit" } },
                    { healParty: 0.4 },
                    { battle: { group: ["kham"], boss: true, music: "boss" } },
                    { healParty: 0.4 },
                    { battle: { group: ["guardios"], boss: true, music: "boss" } },
                    { healParty: 0.4 },
                    { battle: { group: ["tonitrus"], boss: true, music: "spirit" } },
                    { cond: { flag: "rush2" },
                      then: [{ msg: "番人「ぬしたちも よろこんで いるだろう」" }],
                      else: [
                        { msg: "番人「ぬしのみち 完破!!\nすさまじい つわものだ!」" },
                        { give: { gold: 40000 } },
                        { give: { item: "worldtear" } },
                        { give: { item: "acc_dragonheart" } },
                        { msg: "40000ギル、世界のしずく、\nりゅうの心を 手に入れた!" },
                        { flag: ["rush2", 1] },
                      ] },
                  ],
                  else: [{ msg: "番人「まずは 物語のみちを\nこえてからだ」" }] },
              ] },
              { label: "しんえんのみち", ops: [
                { cond: { flag: "rush2" },
                  then: [
                    { msg: "番人「しんえんの 4れんせん……。\nいきて かえれる ほしょうは ない。\nそれでも いくか!!」" },
                    { battle: { group: ["vaha"], boss: true, music: "boss" } },
                    { healParty: 0.4 },
                    { battle: { group: ["granstella"], boss: true, music: "spirit" } },
                    { healParty: 0.4 },
                    { battle: { group: ["regalia"], boss: true, music: "spirit" } },
                    { healParty: 0.4 },
                    { battle: { group: ["noctia"], boss: true, music: "spirit" } },
                    { cond: { flag: "rush3" },
                      then: [{ msg: "番人「しんえんすら あそびばに するか……。\nおそれいった」" }],
                      else: [
                        { msg: "番人「し、しんえんのみち 完破!!!\n伝説の なかの 伝説だ!!」" },
                        { give: { gold: 100000 } },
                        { give: { item: "acc_stargem" } },
                        { msg: "100000ギルと 星の紋章を 手に入れた!\nでんどうに 『継承者』の なが きざまれた。" },
                        { flag: ["rush3", 1] },
                      ] },
                  ],
                  else: [{ msg: "番人「ぬしのみちを こえたものだけが\nいどめる みちだ」" }] },
              ] },
              { label: "やめる", ops: [] },
            ] } },
          ],
          else: [{ msg: "けいしょうの番人「物語を 最後まで\nみとどけた ものだけが、この まに\nいどむことが できる」" }] },
      ] },
    { id: "hall_bard", x: 3, y: 6, spr: "villager",
      script: [
        { cond: { flag: "haouGiven" },
          then: [{ msg: "かたりべ「隠し武器の うわさは まだある。\nぬまのそこの やり、めがみのさいだんの つえ、\nときの頂上の つえ……」" }],
          else: [
            { cond: { flag: "arenaPlatinum" },
              then: [
                { msg: "かたりべ「闘技場の プラチナを せいはした\n伝説の 拳に、この つめを\nささげましょう」" },
                { give: { item: "w_haou" } },
                { msg: "覇王の爪を 手に入れた!\n(攻撃62・拳王も おそれる つめ)" },
                { flag: ["haouGiven", 1] },
              ],
              else: [
                { msg: "かたりべ「世界には かくされた ぶきが\nねむっています。ぬしの ぬま、めがみの さいだん、\nときの 頂上、闘技場の ちょうてん……」" },
              ] },
          ] },
      ] },
    { id: "hall_keeper", x: 6, y: 3, spr: "elder",
      script: [
        { msg: "きろくがかり「ようこそ 殿堂の間へ。\nあなたがたの あゆみを ごらんに\nいれましょう」" },
        { achievements: true },
        { cond: { all: ["trueClear", "superBoss", "graveBoss", "sylphidDown", "gnomosDown", "undinaDown"] },
          then: [
            { cond: { flag: "hallHero" },
              then: [
                { cond: { flag: "herobandGiven" },
                  then: [{ msg: "きろくがかり「あなたがたこそ しんの 英雄。\nその なは えいえんに かたりつがれます」" }],
                  else: [
                    { msg: "きろくがかり「英雄のあかしを もつ おかたへ\nでんどうから もうひとつ おくりものが\nございます」" },
                    { give: { item: "a_heroband" } },
                    { msg: "英雄のおびを 手に入れた!\n(だれでも そうびできる さいこうきゅうの おび)" },
                    { flag: ["herobandGiven", 1] },
                  ] },
              ],
              else: [
                { msg: "きろくがかり「すべての 試練を こえた もの……。\n伝説は ここに かんせいしました。\nこれを うけとってください」" },
                { give: { item: "heroproof" } },
                { msg: "英雄のあかしを 手に入れた!!" },
                { flag: ["hallHero", 1] },
              ] },
          ],
          else: [{ msg: "きろくがかり「まだ きろくには つづきが\nありそうですね。すべての ☆が そろうひを\nたのしみに しています」" }] },
      ] },
  ],
  chests: [],
};

// ---------------- 星のはか (かくしダンジョン) ----------------
DATA.maps.stargrave1 = {
  name: "星のはか",
  bgm: "under",
  encounter: "stargrave",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#s....#........#",
    "#.##.##.#####..#",
    "#.#...........##",
    "#.#.#########..#",
    "#.#.#.......#..#",
    "#.#.#.#####.#..#",
    "#.#...#...#.#..#",
    "#.#####.#.#.#..#",
    "#.......#...#..#",
    "#.#######.###..#",
    "#.......s......#",
    "################",
  ],
  events: [
    { x: 8, y: 11, type: "enter", warp: { map: "starworld", x: 3, y: 9, dir: "d" } },
    { x: 1, y: 1, type: "enter", warp: { map: "stargrave2", x: 7, y: 2, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "sg1", x: 8, y: 7, item: "worldtear" },
    { id: "sg2", x: 14, y: 5, gold: 10000, hidden: true },
    { id: "sg3", x: 11, y: 5, item: "elixir" },
    { id: "sg4", x: 13, y: 3, item: "xpotion" },
  ],
};

DATA.maps.stargrave2 = {
  name: "星のはか さいしんぶ",
  bgm: "under",
  encounter: "stargrave",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "s": { tile: "stairs" },
  },
  rows: [
    "################",
    "#......s.......#",
    "#..............#",
    "#..##......##..#",
    "#..............#",
    "#..............#",
    "#..##......##..#",
    "#..............#",
    "#..............#",
    "################",
  ],
  events: [
    { x: 7, y: 1, type: "enter", warp: { map: "stargrave1", x: 1, y: 2, dir: "d" } },
  ],
  npcs: [
    { id: "granstellanpc", x: 7, y: 5, spr: "voidos", pal: "light", hideFlag: "graveBoss",
      script: [
        { msg: "はかの おくで 星の 光が\nうずを まいている……。" },
        { msg: "『……ねむりを やぶるものよ。\nわれは 星々の おう グランステラ。\n力を しめしてみせよ』" },
        { battle: { group: ["granstella"], boss: true, music: "spirit" } },
        { flag: ["graveBoss", 1] },
        { msg: "『みごとなり……。 星の 守りを\nなんじらに たくそう』\n光は しずかに ねむりに ついた。" },
        { give: { item: "a_crown" } },
        { give: { item: "acc_voidseal" } },
        { msg: "星の王冠と 虚空の封印を\n手に入れた!" },
      ] },
  ],
  chests: [
    { id: "sg5", x: 2, y: 8, item: "xpotion" },
    { id: "sg6", x: 13, y: 8, item: "elixir", hidden: true },
    { id: "sg7", x: 14, y: 8, item: "acc_hawkring", hidden: true },
  ],
};

// ---------------- 試練のやま (つづらおりの さんどう) ----------------
DATA.maps.trialmt1 = {
  name: "試練のやま さんどう",
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
    "m......s.......m",
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
  name: "試練のやま さんちょう",
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
          then: [
            { cond: { all: ["nightBoss"] },
              then: [
                { cond: { flag: "glenEp2" },
                  then: [{ msg: "ガロン「やりの 風が かわったな。\n守る ものが ある やつの かぜだ。\nいつでも うちに こい」" }],
                  else: [
                    { msg: "ガロン「もどってきたか、竜騎士。\n夜の国の はなしは やまに まで\nとどいているぞ。ひとつ けいこと いくか」" },
                    { msg: "グレン「のぞむところだ!\n……ふうっ。 あいかわらず おそろしい\n拳だな、あんた」" },
                    { msg: "ガロン「おまえの やりも な。 ……これを もて。\nりゅうの 心は 守るもののために もえる。\nおまえに こそ ふさわしい」" },
                    { give: { item: "a_dragonheart" } },
                    { give: { item: "acc_dragonsoul" } },
                    { msg: "りゅうの心と 竜の魂を 手に入れた!" },
                    { flag: ["glenEp2", 1] },
                  ] },
              ],
              else: [{ msg: "拳王ガロン「よい 拳だった……。\nおまえたちなら 星の やみさえ\nうちはらえるだろう」" }] },
          ],
          else: [
            { msg: "拳王ガロン「この 山の 頂上で\nおれは 最強の あいてを\nまちつづけてきた」" },
            { msg: "「おまえたちから ただならぬ きはくを\nかんじる…… いざ、勝負!!」" },
            { flag: ["garonSeen", 1] },
            { battle: { group: ["garon"], boss: true, music: "boss" } },
            { flag: ["garonBeat", 1] },
            { msg: "ガロン「……みごとだ。 おれの まけだ。\nこの つめを もっていけ。\nおまえたちの 拳に たくそう」" },
            { give: { item: "w_garon" } },
            { give: { item: "acc_warcharm" } },
            { give: { gold: 3000 } },
            { msg: "豪傑の爪、闘魂のお守り、\n3000ギルを 手に入れた!" },
          ] },
      ] },
  ],
  chests: [
    { id: "tm4", x: 1, y: 7, item: "a_hachimaki2", hidden: true },
  ],
};

// ---------------- 風の神殿 ----------------
DATA.maps.windtemple = {
  name: "風の神殿",
  bgm: "sky",
  encounter: "sky",
  legend: {
    "D": { tile: "stairs" },
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
    "#.D..............#",
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
          then: [{ msg: "ほしよみの 賢者「星のわは ひらいた。\n空の島の ひがしの ひかりから\n星の世界へ わたるがよい」" }],
          else: [
            { cond: { flag: "allCrystals" },
              then: [
                { msg: "ほしよみの 賢者「4つの クリスタルの\nひかり…… ときは きたようじゃ」" },
                { msg: "賢者が ふるい ことばを となえると\nとおくの そらで 光のわが\nひらく おとが した……!" },
                { flag: ["starGate", 1] },
                { msg: "空の島の ひがしに 星のわが\n現れた! (星の世界へ いける)" },
              ],
              else: [{ msg: "ほしよみの 賢者「わしは 星を よむもの。\n4つの クリスタルが そろうとき\nほしへの みちが ひらくじゃろう」" }] },
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

// ---------------- 海の底 ----------------
DATA.maps.seafloor = {
  name: "海の底",
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
        { msg: "うずしおが たかまき 光のけものが\nすがたを あらわす……! 水の幻獣 ウンディナ!!" },
        { battle: { group: ["undina"], boss: true, music: "spirit" } },
        { flag: ["undinaDown", 1] },
        { msg: "ウンディナは しぶきとなって きえた。\nうずの なかから つえが うかびあがる。" },
        { give: { item: "w_undina" } },
        { msg: "海鳴りの杖を 手に入れた!" },
      ] },
  ],
  chests: [
    { id: "sea1", x: 22, y: 1, gold: 3000, hidden: true },
  ],
};

// ---------------- かいてい神殿 ----------------
DATA.maps.seatemple = {
  name: "かいてい神殿",
  bgm: "sea",
  encounter: "sea",
  legend: {
    "D": { tile: "stairs" },
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
    "#.D..............#",
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

// ---------------- 星のとう (さいしゅうしょう) ----------------
DATA.maps.startower1 = {
  name: "星のとう 1F",
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
  name: "星のとう 2F",
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
    { x: 2, y: 1, type: "enter", warp: { map: "startower3", x: 13, y: 9, dir: "u" } },
  ],
  npcs: [],
  chests: [
    { id: "sw2a", x: 14, y: 4, item: "a_star" },
    { id: "sw2b", x: 1, y: 8, gold: 5000 },
  ],
};

DATA.maps.startower3 = {
  name: "星のとう 天層",
  bgm: "last",
  encounter: "startower",
  legend: {
    "#": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "S": { tile: "stairs" },
    "s": { tile: "stairs" },
    "T": { tile: "torch", solid: true },
  },
  rows: [
    "################",
    "#S.............#",
    "#..######......#",
    "#..#....#..T...#",
    "#..#....#......#",
    "#..#....#####..#",
    "#..#........#..#",
    "#..##########..#",
    "#..............#",
    "#....T....T....#",
    "#............s.#",
    "################",
  ],
  events: [
    { x: 1, y: 1, type: "enter", warp: { map: "startowertop", x: 7, y: 6, dir: "u" } },
    { x: 13, y: 10, type: "enter", warp: { map: "startower2", x: 2, y: 2, dir: "d" } },
  ],
  npcs: [
    { id: "resting_crystal", x: 5, y: 4, spr: "crystal",
      script: [
        { msg: "天層の静けさの中、小さなクリスタルが\nやわらかな星あかりを放っている……。" },
        { menu: { x: 150, y: 150, options: [
          { label: "祈る", ops: [
            { healParty: 1 },
            { msg: "星の光が体を包み、\n仲間全員の傷が癒えた!\n(HPが全回復した)" },
          ] },
          { label: "立ち去る", ops: [] },
        ] } },
      ] },
  ],
  chests: [
    { id: "sw3a", x: 4, y: 6, item: "elixir" },
    { id: "sw3b", x: 14, y: 3, gold: 20000, hidden: true },
  ],
};

DATA.maps.startowertop = {
  name: "星のとう さいじょうかい",
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
    { x: 7, y: 7, type: "enter", warp: { map: "startower3", x: 1, y: 2, dir: "d" } },
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
  name: "森のおくち",
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
// ---------------- 上位ジョブ (力の神殿) ----------------
DATA.ascendJobs = {
  leon:  { cls: "ゴッドパラディン" },
  glen:  { cls: "竜帝騎士" },
  gou:   { cls: "拳聖" },
  celia: { cls: "聖女" },
  rod:   { cls: "陰陽師" },
};

DATA.scripts = {
  lakeFishing: [
    { msg: "しずかな みなも。 さかなの かげが みえる。" },
    { fishing: { price: 80, table: "lake" } },
  ],
  towerView: [
    { msg: "とおめがねを のぞいてみた……。" },
    { cond: { flag: "trueClear" },
      then: [
        { msg: "湖は かがみのように しずまり、\nむらむらから ゆうげの けむりが のぼる。\nおだやかな 世界が ひろがっていた。" },
      ],
      else: [
        { cond: { flag: "airship" },
          then: [{ msg: "とおくの そらに ひこうせんの かげ。\n海の むこうには みたことのない\nたいりくが かすんで みえる……。" }],
          else: [{ msg: "きたに バロン城の ほうかく。\nみなみの 森の おくに、ちいさな むらの\nやねが ちらりと みえる。" }] },
      ] },
    { cond: { flag: "towerView" },
      then: [],
      else: [
        { msg: "とおめがねの だいざの すきまに\nだれかの わすれものが はさまっている。" },
        { give: { item: "elixir" } },
        { msg: "エリクサーを 手に入れた!" },
        { flag: ["towerView", 1] },
      ] },
  ],
  magmaFight: [
    { cond: { flag: "magmaBoss" },
      then: [],
      else: [
        { msg: "ようがんが うずをまき……\nじひびきとともに マグマウォームが\nはいあがってきた!!" },
        { battle: { group: ["magmaworm"], boss: true, music: "boss" } },
        { flag: ["magmaBoss", 1] },
        { msg: "おおあなの そこに しずけさが もどった。\nおくには かたく とざされた\nおお扉が みえる……。" },
      ] },
  ],
  sealedDoor: [
    { cond: { flag: "magmaBoss" },
      then: [
        { cond: { flag: "underOpen" },
          then: [{ warp: { map: "underworld", x: 3, y: 1, dir: "d" } }],
          else: [
            { msg: "クリスタルが まばゆく かがやき……\nおお扉が ゆっくりと ひらいた!!" },
            { flag: ["underOpen", 1] },
            { msg: "扉のむこうに、あかく ひかる\nひろがりが みえる。\n―― だい2しょう 地底へん ――" },
            { warp: { map: "underworld", x: 3, y: 1, dir: "d" } },
          ] },
      ],
      else: [{ msg: "地底へ つづく おお扉……\nふしぎな 力で とざされている。" }] },
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
            { msg: "きりが はれていく……!\n森の おくちに たどりついた!" },
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
        { msg: "こだいじゅが めをさました……!\n森のぬし トレントが\nえだを ふりあげる!!" },
        { battle: { group: ["treant"], boss: true, music: "boss" } },
        { flag: ["forestBoss", 1] },
        { msg: "もりが しずかに ざわめいた。\nどこかで とりが ないている。" },
      ] },
  ],
  arenaEntry: [
    { msg: "うけつけ「ソレイユ闘技場へ ようこそ!\n3れんせんを かちぬけば しょうきんだ。\nランクを えらびな!」" },
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
            { msg: "800ギルと ハイポーションを 手に入れた!" },
            { flag: ["arenaBronze", 1] },
          ],
          ng: [{ msg: "うけつけ「お金が たりないよ!」" }] } },
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
            { msg: "2500ギルと エリクサーを 手に入れた!" },
            { flag: ["arenaSilver", 1] },
          ],
          ng: [{ msg: "うけつけ「お金が たりないよ!」" }] } },
      ] },
      { label: "ゴールド3000G", ops: [
        { payGold: { amount: 3000,
          ok: [
            { msg: "うけつけ「ゴールドランク……\n命の ほしょうは しないよ!!」" },
            { battle: { group: ["darkknight", "darksoldier", "darksoldier"], boss: true } },
            { battle: { group: ["deathknight", "shadowbeast"], boss: true } },
            { battle: { group: ["arcdemon", "voidgolem"], boss: true } },
            { msg: "うけつけ「しんじられない……\nあんたたちが チャンピオンだ!!」" },
            { give: { gold: 8000 } },
            { give: { item: "elixir" } },
            { give: { item: "a_champ" } },
            { msg: "8000ギルと エリクサー、そして\nチャンピオンベルトを 手に入れた!!" },
            { flag: ["arenaGold", 1] },
          ],
          ng: [{ msg: "うけつけ「お金が たりないよ!」" }] } },
      ] },
      { label: "プラチナ8000G", ops: [
        { cond: { all: ["mirrorBoss", "glacierBoss", "tombBoss"] },
          then: [
            { payGold: { amount: 8000,
              ok: [
                { msg: "うけつけ「プラチナランク……!\nかくちの ぬしたちの まぼろしと たたかう\n伝説の 4れんせんだよ!!」" },
                { battle: { group: ["mirrorfiend"], boss: true, music: "boss" } },
                { battle: { group: ["glaciella"], boss: true, music: "boss" } },
                { battle: { group: ["kham"], boss: true, music: "boss" } },
                { battle: { group: ["lunavora"], boss: true, music: "spirit" } },
                { msg: "うけつけ「4にんの ぬしを れんぱ……!?\nあんたたちは 闘技場の 伝説だ!!」" },
                { give: { gold: 30000 } },
                { give: { item: "elixir" } },
                { give: { item: "worldtear" } },
                { msg: "30000ギルと エリクサーと 世界のしずくを\n手に入れた!" },
                { flag: ["arenaPlatinum", 1] },
              ],
              ng: [{ msg: "うけつけ「お金が たりないよ!」" }] } },
          ],
          else: [{ msg: "うけつけ「プラチナは かくちの ぬしを\n倒した ものだけが 挑戦できる。\nかがみ・ひょうが・だいびょうの ぬしをな」" }] },
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
              { label: "バロン城", ops: [{ warp: { map: "world", x: 7, y: 27, dir: "d" } }] },
              { label: "ミストのむら", ops: [{ warp: { map: "world", x: 27, y: 23, dir: "d" } }] },
              { label: "ソレイユ",     ops: [{ warp: { map: "port", x: 10, y: 7, dir: "u" } }] },
              { label: "空の島",   ops: [{ warp: { map: "skyisland", x: 3, y: 9, dir: "d" } }] },
              { label: "海の底",   ops: [{ warp: { map: "seafloor", x: 3, y: 11, dir: "d" } }] },
              { label: "東の大陸", ops: [{ warp: { map: "world2", x: 12, y: 7, dir: "d" } }] },
              { label: "氷の列島", ops: [{ warp: { map: "world3", x: 22, y: 5, dir: "d" } }] },
              { label: "砂の王国", ops: [{ warp: { map: "world4", x: 21, y: 5, dir: "d" } }] },
              { label: "緑の群島", ops: [{ warp: { map: "world5", x: 21, y: 5, dir: "d" } }] },
              { label: "雷鳴の島", ops: [{ warp: { map: "world6", x: 21, y: 5, dir: "d" } }] },
              { label: "夜の国", ops: [{ warp: { map: "world7", x: 21, y: 5, dir: "d" } }] },
            ] } },
          ],
          else: [
            { menu: { options: [
              { label: "バロン城", ops: [{ warp: { map: "world", x: 7, y: 27, dir: "d" } }] },
              { label: "ミストのむら", ops: [{ warp: { map: "world", x: 27, y: 23, dir: "d" } }] },
              { label: "ソレイユ",     ops: [{ warp: { map: "port", x: 10, y: 7, dir: "u" } }] },
              { label: "空の島",   ops: [{ warp: { map: "skyisland", x: 3, y: 9, dir: "d" } }] },
              { label: "東の大陸", ops: [{ warp: { map: "world2", x: 12, y: 7, dir: "d" } }] },
              { label: "氷の列島", ops: [{ warp: { map: "world3", x: 22, y: 5, dir: "d" } }] },
              { label: "砂の王国", ops: [{ warp: { map: "world4", x: 21, y: 5, dir: "d" } }] },
              { label: "緑の群島", ops: [{ warp: { map: "world5", x: 21, y: 5, dir: "d" } }] },
              { label: "雷鳴の島", ops: [{ warp: { map: "world6", x: 21, y: 5, dir: "d" } }] },
              { label: "夜の国", ops: [{ warp: { map: "world7", x: 21, y: 5, dir: "d" } }] },
            ] } },
          ] },
      ],
      else: [{ msg: "おきに ふるびた ひこうせんが\nういている。うごきそうにない。" }] },
  ],
  lunavoraFight: [
    { cond: { flag: "craterBoss" },
      then: [],
      else: [
        { msg: "大地が ゆれている……。\nクレーターの ぬしが めをさました!!" },
        { battle: { group: ["lunavora"], boss: true, music: "boss" } },
        { flag: ["craterBoss", 1] },
        { msg: "ぬしは 星のちりとなって きえた。\n大地に しずけさが もどっていく。" },
        { give: { gold: 5000 } },
        { msg: "ぬしの すみかから 5000ギルを みつけた!\nセレーネの 長老に ほうこくしよう。" },
      ] },
  ],
  starFight: [
    { cond: { flag: "trueClear" },
      then: [],
      else: [
        { msg: "ヴォイドス「ようこそ 星のとうへ……。\nザルバも おうも わしの ゆびさきに\nすぎなかったと しれ」" },
        { msg: "レオン「すべての 元凶は おまえか!\nみんな、クリスタルに いのりを!」" },
        { msg: "4つのクリスタルが きょうめいし\nパーティを 光が つつんだ!!" },
        { battle: { group: ["voidos"], boss: true, music: "last" } },
        { flag: ["trueClear", 1] },
        { msg: "ヴォイドスは ほしくずとなって\nよぞらに きえていった……。" },
        { warp: { map: "castle", x: 9, y: 3, dir: "u" } },
        { msg: "バロンおう「すべて おわったのだな……。\nレオン、そなたらは このくにの\nいや、世界の きゅうせいしゅだ」" },
        { msg: "セリア「ながい たびだったわね」\nロッド「けんきゅうざいりょうは\nたっぷり あつまったぜ」" },
        { msg: "ゴウ「うでが なっちまうな!」\nグレン「なあ レオン、つぎは どこへ\nとぶ?」" },
        { msg: "レオン「……そうだな。クリスタルの\n光が とどく かぎり、どこへでも」" },
        { ending: true },
      ] },
  ],
  leviaFight: [
    { cond: { flag: "seaBoss" },
      then: [],
      else: [
        { msg: "うみが うねり 暗闇の そこから\n深海のぬし リヴァイアが\nうかびあがってきた!!" },
        { battle: { group: ["levia"], boss: true, music: "boss" } },
        { flag: ["seaBoss", 1] },
        { msg: "しずかになった さいだんに\nあおい けっしょうが ゆらめいている。" },
        { give: { item: "watercrystal" } },
        { flag: ["waterCrystal", 1] },
        { msg: "水のクリスタルを 手に入れた!!" },
        { msg: "4つのクリスタルが きょうめいし……\nそらたかく こだいのとう\n『星のとう』が すがたをあらわした!!" },
        { flag: ["allCrystals", 1] },
        { msg: "だが 塔の とびらは かたく とざされ、\nどす黒い かなしみの もやが\n世界の あちこちから たちのぼっている……。" },
        { chapter: "第五章  新大陸編" },
        { msg: "レオン「塔を ひらくには、まず 世界の\n災いを しずめる ひつようが あるようだ。\n飛行船で 東の大陸へ わたろう」" },
      ] },
  ],
  tempestFight: [
    { cond: { flag: "skyBoss" },
      then: [],
      else: [
        { msg: "テンペスト「クエーッ!!\nわが 空を みだすものよ……\n嵐の えじきと なれい!!」" },
        { battle: { group: ["tempest"], boss: true, music: "boss" } },
        { flag: ["skyBoss", 1] },
        { msg: "嵐が やみ、さいだんに\nみどりいろの けっしょうが 現れた。" },
        { give: { item: "windcrystal" } },
        { flag: ["windCrystal", 1] },
        { msg: "風のクリスタルを 手に入れた!!" },
        { msg: "のこるは 水のクリスタル……。\nふかき 海の底が よんでいる。\n―― だい4しょうへ つづく ――" },
      ] },
  ],
  meteoFight: [
    { cond: { flag: "meteorDown" },
      then: [],
      else: [
        { msg: "いわが うごきだした……!?\n隕石の番人が 神殿への\nみちを ふさいでいる!!" },
        { battle: { group: ["meteogolem"], boss: true, music: "boss" } },
        { flag: ["meteorDown", 1] },
        { msg: "番人が くだけると ともに\n隕石の 結界が きえていく……!" },
      ] },
  ],
  templeEnter: [
    { cond: { flag: "meteorDown" },
      then: [{ warp: { map: "temple", x: 2, y: 12, dir: "u" } }],
      else: [{ msg: "地底神殿……。\n隕石の 結界に つつまれていて\nはいれない。" }] },
  ],
  gladFight: [
    { cond: { flag: "templeBoss" },
      then: [],
      else: [
        { msg: "グラード「よくぞ ここまできた\nちじょうの ものども……。\nちのクリスタルは わたさぬ!!」" },
        { battle: { group: ["glad"], boss: true, music: "boss" } },
        { flag: ["templeBoss", 1] },
        { msg: "さいだんの おくで 大地いろの\nけっしょうが かがやいている……。" },
        { give: { item: "earthcrystal" } },
        { flag: ["earthCrystal", 1] },
        { msg: "ちのクリスタルを 手に入れた!!" },
        { msg: "のこる クリスタルは あと2つ……。\n物語は だい3しょうへ つづく。" },
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
        { msg: "氷の おくで くろい りゅうが\nめを ひらいた……。" },
        { msg: "ヴァハ「ヴォイドスを ほろぼした\n力を もつもの……。\nわが しんえんに いどむか?」" },
        { battle: { group: ["vaha"], boss: true, music: "boss" } },
        { flag: ["superBoss", 1] },
        { msg: "ヴァハ「……みごとだ。\nおまえたちこそ しんの\nクリスタルナイツ で ある」" },
        { give: { item: "w_kingclaw" } },
        { msg: "竜王の爪を 手に入れた!!\nすべてを やりとげた あなたは\nまさしく 伝説の 勇者だ!" },
      ] },
  ],
  iceDragon: [
    { cond: { flag: "iceBoss" },
      then: [],
      else: [
        { msg: "フロストドラゴン\n「グルルル…… ここは わしの ねぐら。\n氷の はかに うまりたいものから\nかかってくるがいい」" },
        { battle: { group: ["frostdragon"], boss: true, music: "boss" } },
        { flag: ["iceBoss", 1] },
        { msg: "洞窟の おくで なにかが\nひかっている……!" },
      ] },
  ],
  bigholeDescend: [
    { cond: { flag: "ch2" },
      then: [{ warp: { map: "magma", x: 1, y: 1, dir: "d" } }],
      else: [
        { msg: "大穴の ふちに たつと、はるか そこから\nあつい 風と かすかな つちおとが\nきこえてくる……。" },
        { chapter: "第二章  地底編" },
        { flag: ["ch2", 1] },
        { warp: { map: "magma", x: 1, y: 1, dir: "d" } },
      ] },
  ],
  intro: [
    { chapter: "第一章  地上編" },
    { msg: "バロンおう「暗黒騎士 レオンよ。\nミストのむらの 長老がもつ\nクリスタルを うばってくるのだ」" },
    { msg: "レオン「……なぜ クリスタルを?\nミストのむらは 平和な むらです」" },
    { msg: "バロンおう「たみを 守るためだ。\nゆけ! これは めいれいだ!!」" },
    { msg: "レオン(……おうは かわられた。\nだが きしである わたしに\nめいれいに そむくことは できぬ……)" },
    { msg: "グレン「まて レオン! オレも いくぜ。\n親友を ひとりで\nいかせられるかよ」" },
    { join: "glen" },
    { msg: "竜騎士グレンが 仲間に くわわった!" },
    { flag: ["intro", 1] },
  ],
  zarbaFight: [
    { cond: { flag: "clear" },
      then: [],
      else: [
        { msg: "ザルバ「よくぞきた パラディンよ……。\nバロンのおうは よくできた\nあやつりにんぎょうだったぞ?」" },
        { msg: "レオン「ザルバ!! おうの心を\nもてあそんだ つみ……\nこの 聖剣で つぐなわせる!」" },
        { battle: { group: ["zarba"], boss: true, music: "boss" } },
        { flag: ["clear", 1] },
        { msg: "ザルバは ちりとなって きえた……。\nクリスタルが やさしく かがやく。" },
        { warp: { map: "castle", x: 9, y: 3, dir: "u" } },
        { msg: "バロンおう「……レオン…… わしは\nなんということを……。 ゆるしてくれ」" },
        { msg: "レオン「おうよ、かおを あげてください。\nすべては ザルバの しわざ。\nミストのむらとの わかいを」" },
        { msg: "セリア「これで みんな もとどおりね」" },
        { msg: "ロッド「オレの けんきゅうも\nこれにて かんりょう、っとね」" },
        { msg: "こうして クリスタルの光は\n世界に もどった。\n伝説は かたりつがれていく……。" },
        { msg: "……だが そのよる、みなみの 大地に\nあかい 光が はしったという。\n冒険は まだ おわらない――" },
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
