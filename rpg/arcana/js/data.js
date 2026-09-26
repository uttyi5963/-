// ============================================================
// アルカナダンジョン - ゲームデータ
// ============================================================

const DATA = {};

// ---------------- ジョブ ----------------
// learn: { SPしきい値: スキルID }。0SPは そのジョブに ついた しゅんかんに おぼえる。
// スキルは 一度 おぼえると DATA上の h.skillLib に のこりつづけ、
// べつジョブに かえても サブスキル(さいだい3つ)として もちこめる。
DATA.jobs = {
  warrior: {
    name: "せんし", spr: "warrior", weapon: "w_sword", armor: "a_leather",
    base: { hp: 34, mp: 6, str: 14, agi: 9, vit: 13, int: 4 },
    growth: { hp: 5.4, mp: 0.6, str: 2.0, agi: 1.1, vit: 1.8, int: 0.3 },
    learn: { 0: "slash", 20: "guard_break", 60: "power_strike" },
  },
  mage: {
    name: "まほうつかい", spr: "mage", weapon: "w_rod", armor: "a_robe",
    base: { hp: 22, mp: 24, str: 6, agi: 9, vit: 7, int: 15 },
    growth: { hp: 2.6, mp: 3.4, str: 0.5, agi: 1.0, vit: 0.7, int: 2.2 },
    learn: { 0: "fire", 20: "blizzard", 60: "thunder_storm" },
  },
  cleric: {
    name: "しんかん", spr: "cleric", weapon: "w_staff", armor: "a_robe",
    base: { hp: 26, mp: 20, str: 7, agi: 8, vit: 9, int: 13 },
    growth: { hp: 3.2, mp: 2.8, str: 0.7, agi: 0.9, vit: 1.0, int: 1.8 },
    learn: { 0: "heal", 20: "cure_all", 60: "revive" },
  },
  rogue: {
    name: "とうぞく", spr: "rogue", weapon: "w_dagger", armor: "a_leather",
    base: { hp: 28, mp: 10, str: 11, agi: 16, vit: 9, int: 7 },
    growth: { hp: 3.4, mp: 1.0, str: 1.4, agi: 2.2, vit: 1.0, int: 0.6 },
    learn: { 0: "double_slash", 20: "focus_strike", 60: "shadow_step" },
  },
};

// ---------------- スキル ----------------
DATA.skills = {
  slash: { name: "れんげき", kind: "atk", mp: 0, pow: 1.3 },
  guard_break: { name: "よろいくだき", kind: "atk", mp: 4, pow: 1.6 },
  power_strike: { name: "ごうげき", kind: "atk", mp: 8, pow: 2.4 },
  fire: { name: "ファイア", kind: "magic", mp: 3, pow: 8, target: "enemy" },
  blizzard: { name: "ブリザド", kind: "magic", mp: 6, pow: 7, target: "all_enemy" },
  thunder_storm: { name: "サンダガ", kind: "magic", mp: 12, pow: 12, target: "all_enemy" },
  heal: { name: "ヒール", kind: "heal", mp: 3, pow: 22, target: "ally" },
  cure_all: { name: "ケアルガ", kind: "heal", mp: 10, pow: 20, target: "all_ally" },
  revive: { name: "レイズ", kind: "revive", mp: 14, pow: 0.5, target: "ally" },
  double_slash: { name: "にどぎり", kind: "atk", mp: 2, pow: 0.8, hits: 2 },
  focus_strike: { name: "みやぶりづき", kind: "atk", mp: 4, pow: 1.9 },
  shadow_step: { name: "かげぬい", kind: "atk", mp: 6, pow: 2.2 },
};

// ---------------- アイテム ----------------
DATA.items = {
  w_sword: { name: "てつのつるぎ", kind: "weapon", atk: 6, price: 80 },
  w_rod: { name: "りゅうのつえ", kind: "weapon", int: 5, price: 80 },
  w_staff: { name: "いやしのつえ", kind: "weapon", int: 4, price: 80 },
  w_dagger: { name: "みじかいナイフ", kind: "weapon", atk: 4, price: 70 },
  a_leather: { name: "かわのよろい", kind: "armor", def: 4, price: 60 },
  a_robe: { name: "ぬののローブ", kind: "armor", def: 2, int: 2, price: 60 },
  potion: { name: "やくそう", kind: "use", heal: 30, price: 12 },
  ether: { name: "エーテル", kind: "use", mpheal: 10, price: 20 },
  antidote: { name: "どくけしそう", kind: "use", cure: "poison", price: 10 },
};

DATA.shops = {
  town1: {
    name: "リブラの よろずや",
    stock: ["potion", "ether", "antidote", "w_sword", "w_rod", "w_staff", "w_dagger", "a_leather", "a_robe"],
  },
};

// ---------------- なかまキャラ (ジョブとは べつの こじんID) ----------------
DATA.heroes = {
  rin: { name: "リン", defaultJob: "warrior" },
  fio: { name: "フィオ", defaultJob: "mage" },
  els: { name: "エルス", defaultJob: "cleric" },
  kai: { name: "カイ", defaultJob: "rogue" },
};

DATA.expNext = (lv) => 8 + lv * lv * 2;

// ---------------- てき ----------------
DATA.enemies = {
  goblin: { name: "ゴブリン", spr: "goblin",
    base: { hp: 14, atk: 6, def: 3, agi: 6 }, growth: { hp: 2.4, atk: 1.1, def: 0.6, agi: 0.8 },
    exp: 6, sp: 8, gold: 5 },
  bat: { name: "デビルバット", spr: "bat",
    base: { hp: 10, atk: 5, def: 1, agi: 10 }, growth: { hp: 1.8, atk: 0.9, def: 0.3, agi: 1.3 },
    exp: 5, sp: 7, gold: 4 },
  toad: { name: "どくがえる", spr: "toad",
    base: { hp: 16, atk: 5, def: 4, agi: 4 }, growth: { hp: 2.6, atk: 0.9, def: 0.8, agi: 0.5 },
    exp: 6, sp: 7, gold: 5 },
  skeleton: { name: "がいこつへいし", spr: "skeleton",
    base: { hp: 20, atk: 8, def: 5, agi: 5 }, growth: { hp: 3.0, atk: 1.3, def: 0.9, agi: 0.7 },
    exp: 9, sp: 10, gold: 8 },
  voidos: { name: "ヴォイドス", spr: "voidos", boss: true,
    base: { hp: 120, atk: 16, def: 8, agi: 9 }, growth: { hp: 0, atk: 0, def: 0, agi: 0 },
    exp: 60, sp: 50, gold: 200 },
};

// ---------------- エンカウント ----------------
DATA.encounters = {
  bagin: { rate: 1 / 7, count: 2, mons: [
    ["goblin", 2, 4, 8], ["bat", 2, 4, 7], ["toad", 2, 3, 5], ["skeleton", 3, 5, 3],
  ] },
};

// ---------------- ニューゲーム ----------------
DATA.newGame = {
  map: "town", x: 8, y: 5, dir: "d",
  gold: 300,
  items: { potion: 3, ether: 1 },
  gameOverMap: "town", gameOverX: 8, gameOverY: 5,
  runScript: "intro",
};

// ---------------- マップ ----------------
DATA.maps = {};

DATA.maps.town = {
  name: "リブラの町",
  bgm: "town",
  legend: {
    "f": { tile: "forest", solid: true },
    ".": { tile: "grass" },
    "n": { tile: "deadtree", solid: true },
    "W": { tile: "wall", solid: true },
    "d": { tile: "door" },
    "p": { tile: "path" },
    "o": { tile: "fountain", solid: true },
  },
  rows: [
    "ffffffffffffffffff",
    "f...n......n.....f",
    "f..WWWW....WWWW..f",
    "f..WddW....WddW..f",
    "f...pp......pp...f",
    "f...pppppppppp...f",
    "f......o...p.....f",
    "f.n....p...p...n.f",
    "f......p.........f",
    "ffffffffpfffffffff",
  ],
  events: [
    { x: 8, y: 9, type: "enter", warp: { map: "bagin", x: 9, y: 11, dir: "u" } },
    { x: 4, y: 3, type: "enter", scriptId: "innDoor" },
    { x: 5, y: 3, type: "enter", scriptId: "innDoor" },
    { x: 12, y: 3, type: "enter", scriptId: "shopDoor" },
    { x: 13, y: 3, type: "enter", scriptId: "shopDoor" },
  ],
  npcs: [
    { id: "elder", x: 9, y: 6, spr: "elder",
      script: [{ scriptId: "elderTalk" }] },
    { id: "crystal_lore", x: 5, y: 6, spr: "crystal",
      script: [{ msg: "アルカナのけっしょう「わたしに ちかづくと……\nいや、なんでもない。\nメニューの『ジョブ』から いつでも\nしょくぎょうを かえられるよ」" }] },
    { id: "villager1", x: 3, y: 5, spr: "villager", wander: true,
      script: [{ msg: "まちのひと「バギンの迷宮には\nむかしの まほうつかいたちの\nちからが ねむっているらしいよ」" }] },
    { id: "innkeep", x: 6, y: 4, spr: "villager", pal: "light" },
  ],
  chests: [],
};

// ---------------- マップ: 迷宮バギン ----------------
DATA.maps.bagin = {
  name: "迷宮バギン",
  bgm: "dungeon",
  encounter: "bagin",
  legend: {
    ".": { tile: "floor" },
    "W": { tile: "wall", solid: true },
    "P": { tile: "pillar", solid: true },
    "c": { tile: "carpet" },
  },
  rows: [
    "WWWWWWWW.WWWWWWWWW",
    "W...P..cc..P....WW",
    "WW..c....P.WWW..WW",
    "W..P..WWW...c...WW",
    "WW...WW..P......WW",
    "WWW.WW..c..WW.WWWW",
    "W..WW..P..WW....WW",
    "WW.W..WW.....P..WW",
    "W...cWW..c..WW.WWW",
    "WWP..W..P..WW...WW",
    "WWW..WW...WW.c..WW",
    "WWWWWWWWW.WWWWWWWW",
  ],
  events: [
    { x: 9, y: 11, type: "enter", warp: { map: "town", x: 8, y: 8, dir: "d" } },
    { x: 8, y: 0, type: "enter", warp: { map: "town", x: 8, y: 8, dir: "d" } },
  ],
  npcs: [
    { id: "boss_voidos", x: 15, y: 9, spr: "voidos", hideFlag: "bossDown",
      script: [{ scriptId: "bossFight" }] },
  ],
  chests: [
    { id: "bg1", x: 15, y: 1, item: "ether" },
    { id: "bg2", x: 14, y: 10, item: "potion" },
  ],
};

// ---------------- スクリプト ----------------
DATA.scripts = {
  intro: [
    { cond: { flag: "party4" },
      then: [],
      else: [
        { msg: "……目が さめると、見知らぬ 天井が\nあった。ここは リブラの町、\nぼうけんしゃギルドの ちかく。" },
        { join: "rin" },
        { msg: "リン「よし、目が さめたな。\nおれは リン、せんしだ。\nおまえの ことは おれが まもる」" },
        { join: "fio" },
        { msg: "フィオ「わたしは フィオ。まほうつかいよ。\nバギンの迷宮に むかしの ちからが\nねむってるって うわさ、しってる?」" },
        { join: "els" },
        { msg: "エルス「しんかんの エルスです。\nみんなの かいふくは わたしに\nまかせてください」" },
        { join: "kai" },
        { msg: "カイ「とうぞくの カイだ。すばやさなら\nまかせろ。……で、さっそくだが\n迷宮に もぐってみないか?」" },
        { flag: ["party4", 1] },
        { msg: "こうして 4にんの ぼうけんが\nはじまった。\n\nヒント: メニューの『ジョブ』では\nなかまの しょくぎょうを いつでも\nかえられる。おぼえた スキルは\nべつジョブでも 3つまで つかえるぞ!" },
      ] },
  ],
  elderTalk: [
    { cond: { flag: "party4" },
      then: [{ msg: "ちょうろう「バギンの迷宮の おくには\nヴォイドスという ふるい魔物が\nねむっていると きいた。きをつけてな」" }],
      else: [{ runScript: "intro" }] },
  ],
  innDoor: [{ inn: 20 }],
  shopDoor: [{ shop: "town1" }],
  bossFight: [
    { cond: { flag: "bossDown" },
      then: [],
      else: [
        { msg: "やみが うずまいて……\nヴォイドスが すがたを あらわした!!" },
        { battle: { wild: [{ id: "voidos", lv: 8 }] } },
        { flag: ["bossDown", 1] },
        { flag: ["clearedRuins", 1] },
        { msg: "ヴォイドスを うちやぶった!\n\n―― アルカナダンジョン v0.1 ――\nここまで あそんでくれて ありがとう!\nつぎの アップデートを おたのしみに!" },
      ] },
  ],
};
