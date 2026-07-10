// ============================================================
// クリスタルナイツ - ゲームデータ定義
// マップ / モンスター / アイテム / まほう / イベント
// ============================================================

const DATA = {};

// ---------------- じゅもん ----------------
// type: 'dmg'(こうげき) 'heal'(かいふく) 'revive' 'cure'(じょうたい) 'buff'
DATA.spells = {
  cure1:   { name: "ケアル",     mp: 4,  type: "heal",   pow: 30,  target: "ally",  field: true },
  cure2:   { name: "ケアルラ",   mp: 9,  type: "heal",   pow: 95,  target: "ally",  field: true },
  poisona: { name: "ポイゾナ",   mp: 3,  type: "cure",   target: "ally",  field: true },
  protect: { name: "プロテス",   mp: 5,  type: "buff",   target: "ally" },
  raise:   { name: "レイズ",     mp: 15, type: "revive", pow: 0.5, target: "ally",  field: true },
  fire1:   { name: "ファイア",   mp: 5,  type: "dmg", pow: 28, elem: "fire",    target: "enemy" },
  ice1:    { name: "ブリザド",   mp: 5,  type: "dmg", pow: 32, elem: "ice",     target: "enemy" },
  bolt1:   { name: "サンダー",   mp: 6,  type: "dmg", pow: 38, elem: "thunder", target: "enemy" },
  fire2:   { name: "ファイラ",   mp: 12, type: "dmg", pow: 75, elem: "fire",    target: "enemy" },
  ice2:    { name: "ブリザラ",   mp: 14, type: "dmg", pow: 88, elem: "ice",     target: "enemy" },
  // てきせんよう
  e_fire:  { name: "ファイア",   mp: 0, type: "dmg", pow: 16, elem: "fire",    target: "enemy" },
  e_ice_all:{ name: "つめたいいき", mp: 0, type: "dmg", pow: 15, elem: "ice",  target: "enemy", all: true },
  e_fire2: { name: "ファイラ",   mp: 0, type: "dmg", pow: 40, elem: "fire",    target: "enemy" },
  e_meteo: { name: "ダークメテオ", mp: 0, type: "dmg", pow: 48, elem: "none",  target: "enemy", all: true },
};

// ---------------- アイテム ----------------
// kind: 'use'(つかう) 'weapon' 'armor' 'key'
DATA.items = {
  potion:   { name: "ポーション",     kind: "use", price: 30,  heal: 60,  desc: "HPを 60 かいふく" },
  hipotion: { name: "ハイポーション", kind: "use", price: 150, heal: 250, desc: "HPを 250 かいふく" },
  ether:    { name: "エーテル",       kind: "use", price: 100, mp: 40,    desc: "MPを 40 かいふく" },
  phoenix:  { name: "フェニックスのお", kind: "use", price: 400, revive: 0.5, desc: "せんとうふのうから ふっかつ" },
  antidote: { name: "どくけし",       kind: "use", price: 20,  cure: "poison", desc: "どくを なおす" },

  w_dark:    { name: "ダークソード",   kind: "weapon", price: 300, atk: 8,  who: ["leon"], dark: true },
  w_steel:   { name: "こうてつのつるぎ", kind: "weapon", price: 450, atk: 12, who: ["leon"] },
  w_mythril: { name: "ミスリルソード", kind: "weapon", price: 900, atk: 16, who: ["leon"] },
  w_light:   { name: "ひかりのつるぎ", kind: "weapon", price: 0,   atk: 24, who: ["leon"], elem: "holy" },
  w_staff:   { name: "ロッド",         kind: "weapon", price: 60,  atk: 3,  who: ["rod", "celia"] },
  w_wizstaff:{ name: "まどうのつえ",   kind: "weapon", price: 500, atk: 7, int: 3, who: ["rod"] },
  w_mace:    { name: "いやしのつえ",   kind: "weapon", price: 450, atk: 6, int: 2, who: ["celia"] },

  a_dark:    { name: "あんこくのよろい", kind: "armor", price: 350, def: 6,  who: ["leon"], dark: true },
  a_steel:   { name: "こうてつのよろい", kind: "armor", price: 400, def: 10, who: ["leon"] },
  a_mythril: { name: "ミスリルメイル", kind: "armor", price: 950, def: 13, who: ["leon"] },
  a_light:   { name: "ひかりのよろい", kind: "armor", price: 0,   def: 16, who: ["leon"] },
  a_cloth:   { name: "ぬののローブ",   kind: "armor", price: 50,  def: 2,  who: ["rod", "celia"] },
  a_leather: { name: "かわのよろい",   kind: "armor", price: 200, def: 5,  who: ["leon", "rod", "celia"] },
  a_silk:    { name: "シルクのローブ", kind: "armor", price: 400, def: 7, int: 2, who: ["rod", "celia"] },

  crystal:   { name: "クリスタル",     kind: "key", price: 0, desc: "せいなる ひかりを やどす" },
};

// ---------------- なかま ----------------
DATA.heroes = {
  leon: {
    name: "レオン", cls: "あんこくきし", spr: "hero",
    base:   { hp: 48, mp: 6, str: 10, agi: 7, vit: 9, int: 4 },
    growth: { hp: 11, mp: 2, str: 2, agi: 1, vit: 2, int: 1 },
    weapon: "w_dark", armor: "a_dark",
    special: "dark", // あんこく
    spells: [],
    learn: {},
  },
  celia: {
    name: "セリア", cls: "しろまどうし", spr: "celia",
    base:   { hp: 30, mp: 24, str: 5, agi: 8, vit: 6, int: 11 },
    growth: { hp: 7, mp: 5, str: 1, agi: 1, vit: 1, int: 2 },
    weapon: "w_staff", armor: "a_cloth",
    spells: ["cure1"],
    learn: { 4: "poisona", 6: "protect", 9: "cure2", 12: "raise" },
  },
  rod: {
    name: "ロッド", cls: "くろまどうし", spr: "rod",
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
  special: "holy", // せいけん
  bonus: { hp: 30, mp: 12, str: 4, vit: 3 },
};

// レベルl から l+1 に あがるのに ひつような けいけんち
DATA.expNext = (l) => 6 * l * l + 4 * l;

// ---------------- モンスター ----------------
DATA.monsters = {
  goblin:   { name: "ゴブリン",     spr: "goblin",   hp: 16, atk: 7,  def: 2,  agi: 4, exp: 5,  gold: 6 },
  bat:      { name: "おおコウモリ", spr: "bat",      hp: 12, atk: 6,  def: 1,  agi: 9, exp: 4,  gold: 4 },
  toad:     { name: "どくガエル",   spr: "toad",     hp: 22, atk: 8,  def: 2,  agi: 5, exp: 7,  gold: 8, poison: 0.3 },
  skeleton: { name: "スケルトン",   spr: "skeleton", hp: 34, atk: 13, def: 4,  agi: 6, exp: 14, gold: 14, weak: ["fire", "holy"] },
  wizard:   { name: "まどうし",     spr: "wizard",   hp: 28, atk: 8,  def: 3,  agi: 7, exp: 18, gold: 22, acts: [{ spell: "e_fire", rate: 0.5 }] },
  gargoyle: { name: "ガーゴイル",   spr: "gargoyle", hp: 46, atk: 16, def: 6,  agi: 9, exp: 26, gold: 28 },
  golem:    { name: "ゴーレム",     spr: "golem",    hp: 85, atk: 21, def: 13, agi: 3, exp: 55, gold: 60, weak: ["thunder"] },
  ddemon:   { name: "ダークデーモン", spr: "demon",  hp: 66, atk: 22, def: 8,  agi: 10, exp: 62, gold: 55, weak: ["holy"], acts: [{ spell: "e_fire2", rate: 0.3 }] },

  demonguard: { name: "デーモンガード", spr: "demon", boss: true, scale: 3,
    hp: 170, atk: 15, def: 5, agi: 6, exp: 90, gold: 150, weak: ["holy"],
    acts: [{ spell: "e_ice_all", rate: 0.35 }] },
  shadow: { name: "あんこくのかげ", spr: "hero_d", pal: "dark", boss: true, scale: 3, trial: true,
    hp: 999, atk: 17, def: 99, agi: 7, exp: 0, gold: 0 },
  zarba: { name: "まおうザルバ", spr: "zarba", boss: true, scale: 3,
    hp: 400, atk: 24, def: 8, agi: 9, exp: 0, gold: 0, weak: ["holy"],
    acts: [{ spell: "e_fire2", rate: 0.3 }], phase2: "zarba2" },
  zarba2: { name: "ザルバ しんのすがた", spr: "zarba", pal: "dark", boss: true, scale: 4,
    hp: 480, atk: 30, def: 10, agi: 12, exp: 0, gold: 0, weak: ["holy"],
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
};

// ---------------- ショップ ----------------
DATA.shops = {
  town: {
    name: "ミストのみせ",
    stock: ["potion", "hipotion", "ether", "antidote", "phoenix",
            "w_steel", "w_mythril", "w_wizstaff", "w_mace",
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
    "c": { tile: "icon_cave" },
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
    "wwffffff.ffffffmmmmffffffwwwwbwwwwwwwwww",
    "wwffffff.ffffffmmmmffffffwwwwbwwwwwwwwww",
    "ww..............mmmm..........wwwwwwwwww",
    "ww.....f........mmmm....ff........wwwwww",
    "ww....fff.......mmmm...ffff.......wwwwww",
    "ww.....f........mmmm....ff........wwwwww",
    "ww..............mmmm..............wwwwww",
    "ww..f...........mmmm..............wwwwww",
    "ww.ff...........mmmm......ff......wwwwww",
    "ww..............mmmm.....ffff.....wwwwww",
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
    "ww..............mmmm......f.......wwwwww",
    "ww...ff.........mmmm.....ff.......wwwwww",
    "ww....f.........mmmm..............wwwwww",
    "ww..............mmmm..............wwwwww",
    "www.............mmmm............wwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  zones: [
    { x: 2, y: 6, w: 14, h: 3, table: "north" },
    { x: 20, y: 6, w: 6, h: 3, table: "north" },
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
  chests: [],
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
  npcs: [],
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

// ---------------- きょうつうスクリプト ----------------
DATA.scripts = {
  intro: [
    { msg: "バロンおう「あんこくきし レオンよ。\nミストのむらの ちょうろうがもつ\nクリスタルを うばってくるのだ」" },
    { msg: "レオン「……なぜ クリスタルを?\nミストのむらは へいわな むらです」" },
    { msg: "バロンおう「たみを まもるためだ。\nゆけ! これは めいれいだ!!」" },
    { msg: "レオン(……おうは かわられた。\nだが きしである わたしに\nめいれいに そむくことは できぬ……)" },
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
        { msg: "こうして クリスタルのひかりは\nせかいに もどった。\nあんこくきしは ひかりのきしとなり\nでんせつは かたりつがれていく……。" },
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
