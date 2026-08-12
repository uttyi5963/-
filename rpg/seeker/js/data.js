// ============================================================
// モンスターシーカー - ゲームデータ
// 魔物を「たおす」のではなく「なかまにして そだてる」RPG。
// 種族・技・タイプ相性・マップ・ものがたり を すべてここに定義。
// ============================================================

const DATA = {};

// ---------------- タイプと相性 ----------------
// chart[こうげき側][ぼうぎょ側] = 倍率 (かいてなければ 1.0)
DATA.types = {
  normal: { name: "ノーマル" },
  fire:   { name: "ほのお" },
  water:  { name: "みず" },
  grass:  { name: "くさ" },
  elec:   { name: "でんき" },
  earth:  { name: "つち" },
  dark:   { name: "やみ" },
};
DATA.chart = {
  fire:  { grass: 2, fire: 0.5, water: 0.5, earth: 0.5 },
  water: { fire: 2, earth: 2, water: 0.5, grass: 0.5 },
  grass: { water: 2, earth: 2, grass: 0.5, fire: 0.5 },
  elec:  { water: 2, elec: 0.5, earth: 0.5 },
  earth: { fire: 2, elec: 2, grass: 0.5 },
  dark:  { dark: 2, normal: 0.5 },
  normal: {},
};
DATA.typeMod = (atkType, defType) =>
  (DATA.chart[atkType] && DATA.chart[atkType][defType]) ?? 1;

// ---------------- 技 ----------------
// pow: いりょく / pri: せんせい (おおきいほど先) / acc: めいちゅう
DATA.moves = {
  // ノーマル
  tackle:   { name: "たいあたり",     type: "normal", pow: 35, acc: 0.98 },
  quick:    { name: "でんこうがえし", type: "normal", pow: 25, acc: 1.0, pri: 1 },
  bodyslam: { name: "のしかかり",     type: "normal", pow: 60, acc: 0.95 },
  gigaslam: { name: "ギガプレス",     type: "normal", pow: 85, acc: 0.85 },
  // ほのお
  ember:    { name: "ひのこ",         type: "fire", pow: 35, acc: 0.98 },
  fireball: { name: "かえんだん",     type: "fire", pow: 60, acc: 0.95 },
  heatwave: { name: "だいねっぷう",   type: "fire", pow: 85, acc: 0.85 },
  // みず
  squirt:   { name: "みずでっぽう",   type: "water", pow: 35, acc: 0.98 },
  aquashot: { name: "アクアバレット", type: "water", pow: 60, acc: 0.95 },
  maelstrom:{ name: "うずしお",       type: "water", pow: 85, acc: 0.85 },
  // くさ
  leaf:     { name: "このは",         type: "grass", pow: 35, acc: 0.98 },
  leafedge: { name: "リーフエッジ",   type: "grass", pow: 60, acc: 0.95 },
  wildroar: { name: "ジャングルロア", type: "grass", pow: 85, acc: 0.85 },
  // でんき
  spark:    { name: "パチパチ",       type: "elec", pow: 35, acc: 0.98 },
  boltarrow:{ name: "サンダーアロー", type: "elec", pow: 60, acc: 0.95 },
  thunder:  { name: "らいめい",       type: "elec", pow: 85, acc: 0.8 },
  // つち
  pebble:   { name: "いしつぶて",     type: "earth", pow: 35, acc: 0.98 },
  rockdrop: { name: "がんせきおとし", type: "earth", pow: 60, acc: 0.95 },
  quakeroar:{ name: "だいちのいかり", type: "earth", pow: 85, acc: 0.85 },
  // やみ
  shadowjab:{ name: "かげうち",       type: "dark", pow: 30, acc: 1.0, pri: 1 },
  darkfang: { name: "やみのキバ",     type: "dark", pow: 60, acc: 0.95 },
  nebula:   { name: "ダークネビュラ", type: "dark", pow: 85, acc: 0.85 },
};

// ---------------- 種族 ----------------
// base+growth でステータス、learn でレベル習得技、evolve で進化。
// catch: つかまえやすさ (たかいほど かんたん) / exp: たおしたときの経験値係数
DATA.species = {
  // === スターター3種 ===
  hibachi: { name: "ヒバチ", type: "fire", spr: "wisp", dex: "しっぽの ひが きもちの バロメーター。おこると あおくなる",
    base: { hp: 22, atk: 11, def: 8, spd: 11 }, growth: { hp: 2.4, atk: 1.5, def: 1.0, spd: 1.4 },
    catch: 0.5, exp: 14, learn: { 1: "ember", 5: "quick", 9: "fireball", 15: "bodyslam", 22: "heatwave" },
    evolve: { to: "hibashira", lv: 16 } },
  hibashira: { name: "ヒバシラ", type: "fire", spr: "demon", scale: 2, dex: "はしらのような ほのおを まとう。ちかづくだけで あたたかい",
    base: { hp: 30, atk: 16, def: 11, spd: 14 }, growth: { hp: 3.0, atk: 2.0, def: 1.3, spd: 1.6 },
    catch: 0.15, exp: 30, learn: { 1: "ember", 9: "fireball", 18: "darkfang", 26: "heatwave", 34: "gigaslam" } },
  mokurin: { name: "モクリン", type: "grass", spr: "treant", dex: "あたまの わかばは 1にちに 1ミリ のびる。ひなたぼっこが すき",
    base: { hp: 25, atk: 10, def: 10, spd: 8 }, growth: { hp: 2.8, atk: 1.3, def: 1.4, spd: 1.0 },
    catch: 0.5, exp: 14, learn: { 1: "leaf", 5: "tackle", 9: "leafedge", 15: "pebble", 22: "wildroar" },
    evolve: { to: "morigami", lv: 16 } },
  morigami: { name: "モリガミ", type: "grass", spr: "treant", scale: 3, dex: "もりの こころを やどした すがた。あめの ひは うたを うたう",
    base: { hp: 36, atk: 14, def: 15, spd: 9 }, growth: { hp: 3.6, atk: 1.7, def: 1.9, spd: 1.1 },
    catch: 0.15, exp: 32, learn: { 1: "leaf", 9: "leafedge", 18: "rockdrop", 26: "wildroar", 34: "quakeroar" } },
  shizukun: { name: "シズクン", type: "water", spr: "slime", dex: "からだの 90%が みず。うれしいと ぷるぷる ふるえる",
    base: { hp: 24, atk: 10, def: 9, spd: 10 }, growth: { hp: 2.6, atk: 1.4, def: 1.2, spd: 1.2 },
    catch: 0.5, exp: 14, learn: { 1: "squirt", 5: "tackle", 9: "aquashot", 15: "quick", 22: "maelstrom" },
    evolve: { to: "uminon", lv: 16 } },
  uminon: { name: "ウミノン", type: "water", spr: "kraken", scale: 2, dex: "8ほんの うでで なんでも きように こなす。りょうりが とくい らしい",
    base: { hp: 33, atk: 15, def: 12, spd: 12 }, growth: { hp: 3.2, atk: 1.9, def: 1.5, spd: 1.4 },
    catch: 0.15, exp: 31, learn: { 1: "squirt", 9: "aquashot", 18: "darkfang", 26: "maelstrom", 34: "gigaslam" } },

  // === 草原・森の魔物 ===
  nezumaru: { name: "ネズマル", type: "normal", spr: "goblin", dex: "どこにでもいる ちいさな魔物。ほっぺに どんぐりを ためる",
    base: { hp: 20, atk: 9, def: 7, spd: 12 }, growth: { hp: 2.0, atk: 1.2, def: 0.9, spd: 1.5 },
    catch: 0.7, exp: 8, learn: { 1: "tackle", 6: "quick", 12: "bodyslam" } },
  torippi: { name: "トリッピ", type: "normal", spr: "bird", dex: "かぜにのって 1にちで 山を 3つ こえる。うたごえが きれい",
    base: { hp: 21, atk: 10, def: 6, spd: 14 }, growth: { hp: 2.1, atk: 1.4, def: 0.8, spd: 1.8 },
    catch: 0.6, exp: 10, learn: { 1: "tackle", 5: "quick", 11: "bodyslam", 18: "gigaslam" },
    evolve: { to: "kazeppo", lv: 18 } },
  kazeppo: { name: "カゼッポ", type: "normal", spr: "bird", scale: 2, dex: "つばさの ひとふりで かまいたちを おこす そらの ハンター",
    base: { hp: 29, atk: 15, def: 9, spd: 19 }, growth: { hp: 2.6, atk: 1.9, def: 1.1, spd: 2.2 },
    catch: 0.2, exp: 26, learn: { 1: "tackle", 5: "quick", 11: "bodyslam", 22: "gigaslam" } },
  togemaru: { name: "トゲマル", type: "grass", spr: "mantis", dex: "うでの カマは くさかりに べんり。のうかの にんきもの",
    base: { hp: 22, atk: 12, def: 8, spd: 11 }, growth: { hp: 2.2, atk: 1.6, def: 1.0, spd: 1.3 },
    catch: 0.55, exp: 12, learn: { 1: "leaf", 7: "quick", 13: "leafedge", 20: "wildroar" } },
  dokugama: { name: "ドクガマ", type: "water", spr: "toad", dex: "みための われに はんして きれいずき。まいあさ みずあびをする",
    base: { hp: 26, atk: 10, def: 10, spd: 7 }, growth: { hp: 2.8, atk: 1.3, def: 1.3, spd: 0.9 },
    catch: 0.55, exp: 12, learn: { 1: "squirt", 7: "tackle", 13: "aquashot", 20: "bodyslam" },
    evolve: { to: "oogama", lv: 15 } },
  oogama: { name: "オオガマ", type: "water", spr: "toad", scale: 3, dex: "ぬまの ぬし。したの いちげきは いわを もくだく",
    base: { hp: 38, atk: 14, def: 14, spd: 8 }, growth: { hp: 3.6, atk: 1.7, def: 1.7, spd: 1.0 },
    catch: 0.15, exp: 28, learn: { 1: "squirt", 7: "tackle", 13: "aquashot", 18: "maelstrom", 26: "gigaslam" } },
  mimizun: { name: "ミミズン", type: "earth", spr: "worm", dex: "つちの なかを じゆうに およぐ。はたけを たがやす てつだいも",
    base: { hp: 23, atk: 11, def: 9, spd: 6 }, growth: { hp: 2.5, atk: 1.5, def: 1.2, spd: 0.8 },
    catch: 0.6, exp: 11, learn: { 1: "pebble", 7: "tackle", 13: "rockdrop", 21: "quakeroar" } },
  tsuchigoro: { name: "ツチゴロ", type: "earth", spr: "golem", dex: "ねているときは ただの いわに みえる。せなかに コケが はえる",
    base: { hp: 27, atk: 12, def: 13, spd: 5 }, growth: { hp: 2.9, atk: 1.5, def: 1.7, spd: 0.6 },
    catch: 0.45, exp: 15, learn: { 1: "pebble", 8: "tackle", 14: "rockdrop", 22: "quakeroar" },
    evolve: { to: "iwagoron", lv: 18 } },
  iwagoron: { name: "イワゴロン", type: "earth", spr: "golem", scale: 3, dex: "やまの ばんにん。100ねん うごかないことも ある",
    base: { hp: 40, atk: 17, def: 19, spd: 6 }, growth: { hp: 3.8, atk: 2.0, def: 2.2, spd: 0.7 },
    catch: 0.1, exp: 34, learn: { 1: "pebble", 8: "tackle", 14: "rockdrop", 24: "quakeroar", 30: "gigaslam" } },
  pikarin: { name: "ピカリン", type: "elec", spr: "eye", dex: "おどろくと ひとみが ひかる。よみちの あかりがわりに なる",
    base: { hp: 21, atk: 12, def: 7, spd: 13 }, growth: { hp: 2.1, atk: 1.6, def: 0.9, spd: 1.6 },
    catch: 0.5, exp: 13, learn: { 1: "spark", 7: "quick", 13: "boltarrow", 21: "thunder" } },
  mahobi: { name: "マホービ", type: "elec", spr: "wizard", dex: "ぼうしの なかに かみなりぐもを かっている。れいぎただしい",
    base: { hp: 24, atk: 13, def: 9, spd: 11 }, growth: { hp: 2.4, atk: 1.7, def: 1.1, spd: 1.3 },
    catch: 0.35, exp: 18, learn: { 1: "spark", 9: "boltarrow", 16: "darkfang", 24: "thunder" } },
  komorin: { name: "コモリン", type: "dark", spr: "bat", dex: "ひるは ほらあなで さかさまに ねている。くだものが だいこうぶつ",
    base: { hp: 20, atk: 10, def: 7, spd: 13 }, growth: { hp: 2.0, atk: 1.4, def: 0.9, spd: 1.7 },
    catch: 0.6, exp: 10, learn: { 1: "shadowjab", 6: "tackle", 12: "darkfang" },
    evolve: { to: "yorubane", lv: 14 } },
  yorubane: { name: "ヨルバネ", type: "dark", spr: "gargoyle", scale: 2, dex: "よるの みはりやく。つきのひかりを あびると つよくなる",
    base: { hp: 28, atk: 14, def: 10, spd: 16 }, growth: { hp: 2.7, atk: 1.8, def: 1.2, spd: 1.9 },
    catch: 0.18, exp: 26, learn: { 1: "shadowjab", 6: "tackle", 12: "darkfang", 24: "nebula" } },
  honekage: { name: "ホネカゲ", type: "dark", spr: "skeleton", dex: "ふるい いせきに すみつく。ほんとうは さみしがりや",
    base: { hp: 23, atk: 13, def: 9, spd: 9 }, growth: { hp: 2.3, atk: 1.7, def: 1.1, spd: 1.1 },
    catch: 0.4, exp: 16, learn: { 1: "shadowjab", 8: "pebble", 15: "darkfang", 23: "nebula" } },
  kanimaru: { name: "カニマル", type: "water", spr: "crab", dex: "じまんの ハサミで どんな かたい きのみも わってしまう",
    base: { hp: 24, atk: 12, def: 12, spd: 7 }, growth: { hp: 2.4, atk: 1.6, def: 1.5, spd: 0.9 },
    catch: 0.5, exp: 14, learn: { 1: "squirt", 7: "tackle", 14: "aquashot", 21: "maelstrom" } },
  nekomata: { name: "ネコマタ", type: "normal", spr: "cat", dex: "きまぐれで じゆうな 魔物。なつくと かたのりを してくる",
    base: { hp: 22, atk: 11, def: 8, spd: 15 }, growth: { hp: 2.2, atk: 1.5, def: 1.0, spd: 1.8 },
    catch: 0.45, exp: 13, learn: { 1: "tackle", 6: "quick", 12: "shadowjab", 19: "bodyslam" } },
  ryuko: { name: "リュウコ", type: "fire", spr: "dragon", dex: "でんせつの りゅうの こども。であえたら とても ラッキー",
    base: { hp: 28, atk: 15, def: 12, spd: 12 }, growth: { hp: 3.0, atk: 2.0, def: 1.5, spd: 1.5 },
    catch: 0.1, exp: 30, learn: { 1: "ember", 10: "darkfang", 18: "fireball", 26: "heatwave", 34: "gigaslam" } },
};

// けいけんち: つぎのレベルまでに ひつような量
DATA.expNext = (lv) => 6 + lv * lv * 2;

// ---------------- アイテム ----------------
DATA.items = {
  hoshidama:  { name: "ホシダマ",       kind: "ball", price: 100, rate: 1.0, desc: "野生の魔物を つかまえる ほしの たま" },
  gindama:    { name: "ギンのホシダマ", kind: "ball", price: 400, rate: 1.6, desc: "つかまえやすさ 1.6倍の ぎんの たま" },
  kizugusuri: { name: "キズぐすり",     kind: "use", price: 80,  heal: 30, desc: "魔物のHPを 30 回復" },
  iikusuri:   { name: "いいキズぐすり", kind: "use", price: 300, heal: 80, desc: "魔物のHPを 80 回復" },
  genkidama:  { name: "げんきのこな",   kind: "use", price: 500, revive: 0.5, desc: "たおれた魔物を HP半分で 復活" },
  omusubi:    { name: "もりのおむすび", kind: "use", price: 150, heal: 50, desc: "てづくりの おむすび。HPを 50 回復" },
};

DATA.shops = {
  akatsuki: {
    name: "アカツキどうぐてん",
    stock: ["hoshidama", "gindama", "kizugusuri", "iikusuri", "genkidama"],
  },
};

// ---------------- トレーナー ----------------
DATA.trainers = {
  rival: {
    name: "ライバルのテッタ",
    mons: [["nezumaru", 4], ["RIVAL_STARTER", 6]],
    gold: 300,
    winMsg: "テッタ「うわー まけた!\nでも つぎは かたないからな!」",
  },
  examiner: {
    name: "しけんかん ジオさん",
    mons: [["togemaru", 8], ["pikarin", 9], ["oogama", 11]],
    gold: 1200,
    winMsg: "ジオ「みごとだ……!\nきみを 認定シーカーと みとめよう」",
  },
};

// ---------------- エンカウント ----------------
// mons: [種族ID, 最小Lv, 最大Lv, おもみ]
DATA.encounters = {
  route1: { rate: 1 / 9, mons: [
    ["nezumaru", 2, 4, 10], ["torippi", 2, 4, 8], ["togemaru", 3, 5, 6],
    ["mimizun", 3, 5, 6], ["nekomata", 3, 5, 3],
  ] },
  forest: { rate: 1 / 8, mons: [
    ["togemaru", 5, 7, 8], ["komorin", 5, 8, 8], ["dokugama", 5, 8, 6],
    ["pikarin", 6, 8, 5], ["tsuchigoro", 6, 9, 4], ["honekage", 7, 9, 3],
    ["ryuko", 7, 9, 1],
  ] },
  route2: { rate: 1 / 9, mons: [
    ["kanimaru", 7, 10, 8], ["mahobi", 7, 10, 6], ["torippi", 8, 10, 6],
    ["mimizun", 8, 11, 5], ["nekomata", 8, 11, 4],
  ] },
};

// ---------------- ニューゲーム ----------------
DATA.newGame = {
  gold: 500,
  items: { hoshidama: 5, kizugusuri: 3 },
  map: "home", x: 5, y: 6, dir: "d",
  runScript: "intro",
};

// ---------------- マップ ----------------
DATA.maps = {};

// はじまりのむら
DATA.maps.home = {
  name: "はじまりのむら",
  bgm: "town",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "p": { tile: "path" },
    "w": { tile: "water", solid: true, anim: "water2" },
    "F": { tile: "flower" },
    "d": { tile: "door" },
    "W": { tile: "wall", solid: true },
    "R": { tile: "shelf", solid: true },
  },
  rows: [
    "ffffffffffffffffff",
    "f...WWWW...WWWW..f",
    "f...WddW...WddW..f",
    "f.F..pp.....pp...f",
    "f....pp.....pp.F.f",
    "f.pppppppppppppp.f",
    "f....pp....F.....f",
    "fwww.pp..........f",
    "fwww.pp....F.....f",
    "ffffffppffffffffff",
  ],
  events: [
    { x: 5, y: 2, type: "enter", warp: { map: "lab", x: 4, y: 6, dir: "u" } },
    { x: 6, y: 2, type: "enter", warp: { map: "lab", x: 4, y: 6, dir: "u" } },
    { x: 12, y: 2, type: "enter", warp: { map: "myhouse", x: 4, y: 5, dir: "u" } },
    { x: 13, y: 2, type: "enter", warp: { map: "myhouse", x: 4, y: 5, dir: "u" } },
    { x: 6, y: 9, type: "enter", scriptId: "leaveVillage" },
    { x: 7, y: 9, type: "enter", scriptId: "leaveVillage" },
  ],
  npcs: [
    { id: "mom", x: 10, y: 5, spr: "villager", pal: "light",
      script: [
        { cond: { flag: "starter" },
          then: [
            { msg: "かあさん「いってらっしゃい!\nつかれたら いつでも かえって\nきなさいね」" },
            { healMons: 1 },
            { msg: "てもちの魔物が 元気に なった!" },
          ],
          else: [{ msg: "かあさん「ハカセが けんきゅうじょで\nまってるわよ。はやく いってあげて」" }] },
      ] },
    { id: "boy", x: 3, y: 7, spr: "villager", wander: true,
      script: [{ msg: "男の子「シーカーって いいなあ。\n魔物と ともだちに なれる\nしかくなんだって!」" }] },
  ],
  chests: [],
};

// けんきゅうじょ
DATA.maps.lab = {
  name: "けんきゅうじょ",
  bgm: "town",
  legend: {
    "W": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "R": { tile: "shelf", solid: true },
    "t": { tile: "table", solid: true },
    "c": { tile: "counter", solid: true },
  },
  rows: [
    "WWWWWWWWW",
    "WRRR.RRRW",
    "W.......W",
    "W.t.t.t.W",
    "W.......W",
    "W..ccc..W",
    "W.......W",
    "WWWW.WWWW",
  ],
  events: [
    { x: 4, y: 7, type: "enter", warp: { map: "home", x: 5, y: 3, dir: "d" } },
  ],
  npcs: [
    { id: "hakase", x: 4, y: 4, spr: "elder",
      script: [
        { cond: { flag: "badge1" },
          then: [{ msg: "モリノ博士「認定シーカーに なったのじゃな!\nずかんの かんせいも たのんだぞ。\n世界には まだまだ 魔物が おる」" }],
          else: [
            { cond: { flag: "starter" },
              then: [{ msg: "モリノ博士「アカツキのまちの 協会で\nシーカー試験を うけるのじゃ。\nまずは 草むらで 魔物を あつめてな」" }],
              else: [{ scriptId: "starterChoice" }] },
          ] },
      ] },
  ],
  chests: [],
};

// じぶんの いえ
DATA.maps.myhouse = {
  name: "じぶんのいえ",
  bgm: "town",
  legend: {
    "W": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "b": { tile: "bed", solid: true },
    "t": { tile: "table", solid: true },
    "R": { tile: "shelf", solid: true },
  },
  rows: [
    "WWWWWWWWW",
    "Wb..RR..W",
    "W.......W",
    "W..tt...W",
    "W.......W",
    "WWWW.WWWW",
  ],
  events: [
    { x: 4, y: 5, type: "enter", warp: { map: "home", x: 12, y: 3, dir: "d" } },
  ],
  npcs: [],
  chests: [
    { id: "myh1", x: 6, y: 1, item: "kizugusuri" },
  ],
};

// みちくさロード (ルート1)
DATA.maps.route1 = {
  name: "みちくさロード",
  bgm: "field",
  encounter: "route1",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "p": { tile: "path" },
    "F": { tile: "flower" },
    "m": { tile: "mountain", solid: true },
  },
  rows: [
    "ffffffppffffffffff",
    "f.....pp.......F.f",
    "f.F...pp.........f",
    "f...pppp....mm...f",
    "f...pp......mm...f",
    "f...pp...........f",
    "f...pppppp.....F.f",
    "f.......pp.......f",
    "f.F.....pp.......f",
    "ffffffffppffffffff",
  ],
  events: [
    { x: 6, y: 0, type: "enter", warp: { map: "home", x: 6, y: 8, dir: "u" } },
    { x: 7, y: 0, type: "enter", warp: { map: "home", x: 6, y: 8, dir: "u" } },
    { x: 8, y: 9, type: "enter", warp: { map: "forest", x: 8, y: 1, dir: "d" } },
    { x: 9, y: 9, type: "enter", warp: { map: "forest", x: 8, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "rival_spot", x: 8, y: 6, spr: "gou", hideFlag: "rivalDone",
      script: [{ scriptId: "rivalFight" }] },
    { id: "walker", x: 3, y: 2, spr: "villager", wander: true,
      script: [{ msg: "たびびと「草むらを あるくと 野生の魔物が\nとびだしてくるよ。よわらせてから\nホシダマを なげるんだ」" }] },
  ],
  chests: [
    { id: "r1a", x: 13, y: 8, item: "hoshidama" },
  ],
};

// こもれびの森 (ダンジョン)
DATA.maps.forest = {
  name: "こもれびの森",
  bgm: "dungeon",
  encounter: "forest",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "p": { tile: "path" },
    "F": { tile: "flower" },
    "w": { tile: "water", solid: true, anim: "water2" },
  },
  rows: [
    "ffffffffpfffffffff",
    "f....f..p....f...f",
    "f.ff.f.pp.ff.f.f.f",
    "f.f..f.p..f..f.f.f",
    "f.f.ff.p.ff.ff.f.f",
    "f.f....p.f...f.f.f",
    "f.ffffpp.f.f.f.f.f",
    "f....fp..f.f...f.f",
    "fwww.fp.ff.fffff.f",
    "fwww.fpp.........f",
    "fffffffpffffffffff",
  ],
  events: [
    { x: 8, y: 0, type: "enter", warp: { map: "route1", x: 8, y: 8, dir: "u" } },
    { x: 7, y: 10, type: "enter", warp: { map: "route2", x: 8, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "forest_girl", x: 2, y: 7, spr: "villager", pal: "light",
      script: [
        { cond: { flag: "forestGift" },
          then: [{ msg: "むすめ「もりの おくには めずらしい\n魔物が いるんだって。\nあかい りゅうの こどもとか……」" }],
          else: [
            { msg: "むすめ「まいごに なっちゃった……\nでも 魔物たちが まもってくれたの。\nこれ おれいに どうぞ」" },
            { give: { item: "gindama" } },
            { msg: "ギンのホシダマを 手に入れた!" },
            { flag: ["forestGift", 1] },
          ] },
      ] },
  ],
  chests: [
    { id: "fo1", x: 16, y: 1, item: "iikusuri" },
    { id: "fo2", x: 1, y: 9, item: "gindama" },
  ],
};

// ひなたのみち (ルート2)
DATA.maps.route2 = {
  name: "ひなたのみち",
  bgm: "field",
  encounter: "route2",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "p": { tile: "path" },
    "F": { tile: "flower" },
    "w": { tile: "water", solid: true, anim: "water2" },
  },
  rows: [
    "ffffffffpfffffffff",
    "f.......p......F.f",
    "f..www..p........f",
    "f..www..ppp......f",
    "f.........p..F...f",
    "f.F.......p......f",
    "f......pppp......f",
    "f......p.........f",
    "fffffffpffffffffff",
  ],
  events: [
    { x: 8, y: 0, type: "enter", warp: { map: "forest", x: 7, y: 9, dir: "u" } },
    { x: 7, y: 8, type: "enter", warp: { map: "akatsuki", x: 8, y: 1, dir: "d" } },
  ],
  npcs: [
    { id: "camper", x: 12, y: 5, spr: "villager", wander: true,
      script: [{ msg: "キャンパー「アカツキのまちは もうすぐだ。\n協会で シーカー試験を うけられるぞ。\nいずみで 回復も わすれずにな」" }] },
  ],
  chests: [
    { id: "r2a", x: 15, y: 6, item: "genkidama" },
  ],
};

// アカツキのまち
DATA.maps.akatsuki = {
  name: "アカツキのまち",
  bgm: "town",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "p": { tile: "path" },
    "F": { tile: "flower" },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "o": { tile: "fountain", solid: true },
  },
  rows: [
    "ffffffffpfffffffff",
    "f.......p........f",
    "f.WWWW..p..WWWW..f",
    "f.WddW..p..WddW..f",
    "f..pp...p...pp...f",
    "f..pppppppppp....f",
    "f.......o........f",
    "f.F.....p......F.f",
    "ffffffffpfffffffff",
  ],
  events: [
    { x: 8, y: 0, type: "enter", warp: { map: "route2", x: 7, y: 7, dir: "u" } },
    { x: 3, y: 3, type: "enter", scriptId: "shopDoor" },
    { x: 4, y: 3, type: "enter", scriptId: "shopDoor" },
    { x: 12, y: 3, type: "enter", warp: { map: "guild", x: 4, y: 6, dir: "u" } },
    { x: 13, y: 3, type: "enter", warp: { map: "guild", x: 4, y: 6, dir: "u" } },
  ],
  npcs: [
    { id: "fountain_keeper", x: 7, y: 6, spr: "villager", pal: "light",
      script: [
        { msg: "いずみのばん「アカツキの いずみは\n魔物たちを いやしてくれる。\nさあ どうぞ」" },
        { healMons: 1 },
        { msg: "てもちの魔物が 元気に なった!" },
      ] },
    { id: "townfolk", x: 14, y: 6, spr: "villager", wander: true,
      script: [{ msg: "まちのひと「協会の しけんかんは\nつよいぞ。みずタイプに つよい\n魔物が いると らくらしい」" }] },
  ],
  chests: [],
};

// シーカー協会
DATA.maps.guild = {
  name: "シーカーきょうかい",
  bgm: "shrine",
  legend: {
    "W": { tile: "wall", solid: true },
    ".": { tile: "floor" },
    "c": { tile: "carpet" },
    "B": { tile: "banner", solid: true },
    "t": { tile: "torch", solid: true },
  },
  rows: [
    "WWWBWWWBWWWW",
    "Wt...cc...tW",
    "W....cc....W",
    "W....cc....W",
    "W....cc....W",
    "W....cc....W",
    "WWWWW..WWWWW",
  ],
  events: [
    { x: 5, y: 6, type: "enter", warp: { map: "akatsuki", x: 12, y: 4, dir: "d" } },
    { x: 6, y: 6, type: "enter", warp: { map: "akatsuki", x: 12, y: 4, dir: "d" } },
  ],
  npcs: [
    { id: "examiner", x: 5, y: 1, spr: "soldier",
      script: [{ scriptId: "examFight" }] },
    { id: "guild_clerk", x: 2, y: 3, spr: "villager",
      script: [{ msg: "うけつけ「シーカー試験は 3連戦。\nてもちの魔物を そだてて いどんでね。\nいずみで 回復してから どうぞ!」" }] },
  ],
  chests: [],
};

// ---------------- スクリプト ----------------
DATA.scripts = {
  intro: [
    { msg: "――魔物と ひとが ともにくらす\nアオバ地方。" },
    { msg: "魔物を みつけ なかまにし\nともに あるく者を\nひとは『シーカー』と よぶ。" },
    { msg: "きょうは きみが はじめての\n相棒を もらえる 日だ!" },
    { msg: "かあさん「ハカセが けんきゅうじょで\nまってるわよ。いってらっしゃい!」" },
  ],

  starterChoice: [
    { msg: "モリノ博士「おお きたか!\nまちわびたぞ。きょうから きみも\nシーカーの みならいじゃ」" },
    { msg: "モリノ博士「まずは 相棒を えらんでもらう。\n3びきの なかから すきな 魔物を\nえらぶのじゃ!」" },
    { menu: { x: 90, y: 100, options: [
      { label: "ヒバチ (ほのお)", ops: [
        { msg: "ほのおの魔物 ヒバチを えらんだ!\nしっぽの ひが うれしそうに ゆれている。" },
        { starter: "hibachi" },
        { flag: ["rivalMon", 1] },
      ] },
      { label: "モクリン (くさ)", ops: [
        { msg: "くさの魔物 モクリンを えらんだ!\nあたまの わかばが ぴょこんと はねた。" },
        { starter: "mokurin" },
        { flag: ["rivalMon", 2] },
      ] },
      { label: "シズクン (みず)", ops: [
        { msg: "みずの魔物 シズクンを えらんだ!\nぷるぷると よろこんでいる。" },
        { starter: "shizukun" },
        { flag: ["rivalMon", 3] },
      ] },
    ] } },
    { cond: { flag: "starter" },
      then: [
        { msg: "モリノ博士「よい えらびじゃ。\nこの『魔物ずかん』と ホシダマも\nもっていくがよい」" },
        { give: { item: "hoshidama" } },
        { give: { item: "hoshidama" } },
        { msg: "ホシダマを 2こ 手に入れた!\nメニューの『ずかん』で であった魔物を\nきろくできる。" },
        { msg: "モリノ博士「アカツキのまちの 協会で\nシーカー試験に ごうかくすれば\nいちにんまえじゃ。がんばるのじゃぞ!」" },
      ],
      else: [{ msg: "モリノ博士「えんりょせず えらぶのじゃ」" }] },
  ],

  leaveVillage: [
    { cond: { flag: "starter" },
      then: [{ warp: { map: "route1", x: 6, y: 1, dir: "d" } }],
      else: [
        { msg: "かあさん「相棒も いないのに\nそとは あぶないわ! まず ハカセの\nところへ いきなさい」" },
        { warp: { map: "home", x: 6, y: 7, dir: "u" } },
      ] },
  ],

  rivalFight: [
    { cond: { flag: "rivalDone" },
      then: [],
      else: [
        { msg: "テッタ「おっ! おまえも 相棒\nもらったんだな! よし しょうぶだ!」" },
        { battle: { trainer: "rival" } },
        { flag: ["rivalDone", 1] },
        { msg: "テッタ「おれは もっと しゅぎょうして\nシーカー試験に いどむぜ。\nまた アカツキのまちでな!」" },
      ] },
  ],

  shopDoor: [
    { shop: "akatsuki" },
  ],

  examFight: [
    { cond: { flag: "badge1" },
      then: [{ msg: "ジオ「認定シーカーどの、\n世界は ひろい。 図鑑の かんせいを\nたのしみに しておるぞ」" }],
      else: [
        { msg: "ジオ「シーカー試験に いどむか。\nわしの 3びきを やぶってみせよ!」" },
        { battle: { trainer: "examiner" } },
        { flag: ["badge1", 1] },
        { msg: "『シーカーのあかし』を さずかった!!" },
        { msg: "ジオ「きみの 旅は ここからだ。\nアオバ地方の 魔物ずかんの かんせいを\nめざすがよい!」" },
        { msg: "―― モンスターシーカー v0.1 ――\nここまで あそんでくれて ありがとう!\nつづきは アップデートで!" },
      ] },
  ],
};

// ---------------- 図鑑の ならび ----------------
DATA.dexOrder = [
  "hibachi", "hibashira", "mokurin", "morigami", "shizukun", "uminon",
  "nezumaru", "torippi", "kazeppo", "nekomata", "togemaru", "mimizun",
  "tsuchigoro", "iwagoron", "pikarin", "mahobi", "dokugama", "oogama",
  "kanimaru", "komorin", "yorubane", "honekage", "ryuko",
];
