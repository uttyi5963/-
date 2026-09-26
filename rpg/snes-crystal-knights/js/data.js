// ============================================================
// クリスタルナイツ (SNES風リメイク) - ゲームデータ (v0.1: ヴェルダ城のみ)
// ============================================================

const DATA = {};

DATA.maps = {
  castle: {
    name: "ヴェルダ城",
    legend: {
      "#": { tile: "wall", solid: true },
      "B": { tile: "banner", solid: true },
      "T": { tile: "torch", solid: true },
      ".": { tile: "stonefloor" },
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
      { x: 9, y: 11, type: "warp", map: "world", wx: 7, wy: 27, dir: "d" },
      { x: 10, y: 11, type: "warp", map: "world", wx: 7, wy: 27, dir: "d" },
    ],
    npcs: [
      { id: "minister", x: 5, y: 1, spr: "villager",
        msg: "大臣「レオンどの、おめざめですか。\n世界会議への みちのりは まだ\nはじまったばかりで ございます」" },
      { id: "scholar", x: 14, y: 3, spr: "elder",
        msg: "宮廷学者リグル「六柱の 守護者たちが\n各地で あばれておる。まずは ちかくの\n村から たずねて みると よかろう」" },
    ],
  },
  world: {
    name: "フィールド",
    legend: {
      "w": { tile: "water", solid: true },
      ".": { tile: "grass" },
      "f": { tile: "forest" },
      "m": { tile: "mountain", solid: true },
      "C": { tile: "wall" },
    },
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwmmmmmmmmmmmmmmwwwwwwwwwwwwwwwwwwwwwwww",
      "wwm..........Cmwwwwwwwwwww.....wwwwwwwww",
      "wwm.....f.....mwwwwwwwwwww..f..wwwwwwwww",
      "wwmmmmmm.mmm.mmwwwwwwwwwww.....wwwwwwwww",
      "wwffffff.ffffffmmmmffffffwwwwwwwwwwwwwww",
      "wwffffff.ffffffmmmmffffffwwwwwwwwwwwwwww",
      "wwffffff.ffffffmmmmffffffwwwwwwwwwwwwwww",
      "ww..............mmmm..........wwwwwwwwww",
      "ww.....f........fmmm....ff........wwwwww",
      "ww....fff.......mmmm...ffff.......wwwwww",
      "ww.....f........mmmm....ff........wwwwww",
      "ww..............mmmm..............wwwwww",
      "ww..f...........mmmm..............wwwwww",
      "ww.ff...........mmmm......ff......wwwwww",
      "ww..............mmmm.....ffff.f...wwwwww",
      "ww..............mmmm......ff......wwwwww",
      "ww..............mmmm..............wwwwww",
      "ww..............mmmm..............wwwwww",
      "ww..............fmmf..............wwwwww",
      "ww..............mmmm..............wwwwww",
      "ww..............mmmm.......f......wwwwww",
      "ww...f..........mmmm..............wwwwww",
      "ww..fff.........mmmm..f...........wwwwww",
      "ww...f..........mmmm.ff...........wwwwww",
      "ww.....C........mmmm..f...........wwwwww",
      "ww..............mmmm..............wwwwww",
      "ww..........f...mmmm......f..f....wwwwww",
      "ww...ff.........mmmm.....ff.......wwwwww",
      "ww....f..f......mmmm..............wwwwww",
      "ww..............mmmm..............wwwwww",
      "www.............mmmm............wwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    ],
    events: [
      { x: 7, y: 26, type: "warp", map: "castle", wx: 9, wy: 10, dir: "u" },
      { x: 10, y: 28, type: "info", msg: "この さきは まだ じっそうされていない。\nつぎの アップデートを おまちください。" },
    ],
    npcs: [],
    encounter: "plains",
  },
};

DATA.enemies = {
  goblin: { name: "ゴブリン", spr: "goblin", maxhp: 16, atk: 7, def: 2, agi: 4, exp: 5, gold: 6 },
  bat: { name: "大コウモリ", spr: "bat", maxhp: 12, atk: 6, def: 1, agi: 9, exp: 4, gold: 4 },
};

DATA.encounters = {
  plains: { rate: 1 / 20, mons: ["goblin", "goblin", "bat"] },
};

DATA.newGame = { map: "castle", x: 9, y: 5, dir: "d" };
