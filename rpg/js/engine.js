// ============================================================
// クリスタルナイツ - エンジン (描画/入力/音/シーン/セーブ)
// ============================================================

const SCREEN_W = 320, SCREEN_H = 288, TILE = 16;
// ゲームボーイ 4かいちょう パレット (あかるい -> くらい)
const PAL = ["#9bbc0f", "#8bac0f", "#306230", "#0f380f"];

// ---------------- 描画 ----------------
const Gfx = {
  canvas: null, ctx: null,
  cache: new Map(),

  init() {
    this.canvas = document.getElementById("screen");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textBaseline = "top";
  },

  // スプライト名 -> オフスクリーンキャンバス (パレット変換つき)
  sprite(name, variant) {
    const key = name + "/" + (variant || "");
    if (this.cache.has(key)) return this.cache.get(key);
    let rows = null, scale = 1;
    const realName = (SPR.alias && SPR.alias[name]) || name;
    if (SPR.tiles[realName]) { rows = SPR.tiles[realName]; scale = 2; }
    else if (SPR.chars[realName]) rows = SPR.chars[realName];
    else if (SPR.mons[realName]) rows = SPR.mons[realName];
    if (!rows) rows = SPR.tiles.grass;
    const size = rows.length * scale;
    const cv = document.createElement("canvas");
    cv.width = size; cv.height = size;
    const c = cv.getContext("2d");
    // variant "dark": ぜんぶ くらいいろに / "flash": はんてん
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch < "0" || ch > "3") continue;
        let pi = +ch;
        if (variant === "dark") pi = pi === 0 ? 2 : 3;
        else if (variant === "flash") pi = 3 - pi;
        c.fillStyle = PAL[pi];
        c.fillRect(x * scale, y * scale, scale, scale);
      }
    }
    this.cache.set(key, cv);
    return cv;
  },

  clear(pi = 0) {
    this.ctx.fillStyle = PAL[pi];
    this.ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  },

  draw(name, x, y, opts = {}) {
    const cv = this.sprite(name, opts.variant);
    const c = this.ctx;
    const w = cv.width * (opts.scale || 1);
    const h = cv.height * (opts.scale || 1);
    c.save();
    c.imageSmoothingEnabled = false;
    if (opts.flip) {
      c.translate(x + w, y);
      c.scale(-1, 1);
      c.drawImage(cv, 0, 0, w, h);
    } else {
      c.drawImage(cv, x, y, w, h);
    }
    c.restore();
  },

  text(str, x, y, pi = 3, size = 12) {
    const c = this.ctx;
    c.font = `bold ${size}px 'MS Gothic', 'Hiragino Kaku Gothic ProN', monospace`;
    c.fillStyle = PAL[pi];
    c.fillText(str, x, y);
  },

  textR(str, rightX, y, pi = 3, size = 12) {
    const c = this.ctx;
    c.font = `bold ${size}px 'MS Gothic', 'Hiragino Kaku Gothic ProN', monospace`;
    const w = c.measureText(str).width;
    c.fillStyle = PAL[pi];
    c.fillText(str, rightX - w, y);
  },

  window(x, y, w, h) {
    const c = this.ctx;
    c.fillStyle = PAL[3];
    c.fillRect(x, y, w, h);
    c.fillStyle = PAL[0];
    c.fillRect(x + 2, y + 2, w - 4, h - 4);
    c.fillStyle = PAL[3];
    c.fillRect(x + 4, y + 4, w - 8, 1);
    c.fillRect(x + 4, y + h - 5, w - 8, 1);
  },

  cursor(x, y, pi = 3) {
    const c = this.ctx;
    c.fillStyle = PAL[pi];
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + 7, y + 4);
    c.lineTo(x, y + 8);
    c.fill();
  },

  bar(x, y, w, h, ratio, pi = 3) {
    const c = this.ctx;
    c.fillStyle = PAL[1];
    c.fillRect(x, y, w, h);
    c.fillStyle = PAL[pi];
    c.fillRect(x, y, Math.max(0, Math.min(w, Math.round(w * ratio))), h);
  },
};

// ---------------- 入力 ----------------
const Input = {
  down: {},
  hit: {},

  keyName(e) {
    switch (e.key) {
      case "ArrowUp": case "w": case "W": return "up";
      case "ArrowDown": case "s": case "S": return "down";
      case "ArrowLeft": case "a": case "A": return "left";
      case "ArrowRight": case "d": case "D": return "right";
      case "z": case "Z": case "Enter": case " ": return "a";
      case "x": case "X": case "Escape": case "Backspace": return "b";
      default: return null;
    }
  },

  init() {
    addEventListener("keydown", (e) => {
      AudioSys.unlock();
      if (e.key === "m" || e.key === "M") { AudioSys.toggleMute(); return; }
      const k = this.keyName(e);
      if (!k) return;
      e.preventDefault();
      if (!this.down[k]) this.hit[k] = true;
      this.down[k] = true;
    });
    addEventListener("keyup", (e) => {
      const k = this.keyName(e);
      if (k) this.down[k] = false;
    });
    // タッチそうさ
    document.querySelectorAll("button[data-key]").forEach((btn) => {
      const key = btn.dataset.key;
      const fake = { key, preventDefault() {} };
      const pressOn = (e) => {
        e.preventDefault();
        AudioSys.unlock();
        const k = this.keyName(fake);
        if (k) { if (!this.down[k]) this.hit[k] = true; this.down[k] = true; }
      };
      const pressOff = (e) => {
        e.preventDefault();
        const k = this.keyName(fake);
        if (k) this.down[k] = false;
      };
      btn.addEventListener("pointerdown", pressOn);
      btn.addEventListener("pointerup", pressOff);
      btn.addEventListener("pointerleave", pressOff);
      btn.addEventListener("pointercancel", pressOff);
    });
  },

  // おしたしゅんかんだけ true (フレームごとにクリア)
  tap(k) { return !!this.hit[k]; },
  held(k) { return !!this.down[k]; },
  endFrame() { this.hit = {}; },
};

// ---------------- サウンド ----------------
const AudioSys = {
  ctx: null, muted: false,
  seq: null, seqPos: 0, nextTime: 0, seqName: null, tempo: 120, loop: true,

  unlock() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return; }
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  },

  toggleMute() { this.muted = !this.muted; },

  freq(note) { return 440 * Math.pow(2, (note - 69) / 12); },

  tone(freq, t0, dur, vol = 0.04, type = "square") {
    if (!this.ctx || this.muted) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  },

  sfx(name) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    switch (name) {
      case "cursor": this.tone(1100, t, 0.05, 0.03); break;
      case "confirm": this.tone(880, t, 0.06, 0.04); this.tone(1320, t + 0.06, 0.09, 0.04); break;
      case "cancel": this.tone(440, t, 0.08, 0.03); break;
      case "buzz": this.tone(110, t, 0.15, 0.05); break;
      case "hit": this.tone(200, t, 0.06, 0.06); this.tone(100, t + 0.04, 0.1, 0.06); break;
      case "crit": this.tone(300, t, 0.05, 0.07); this.tone(80, t + 0.04, 0.16, 0.08); break;
      case "magic": for (let i = 0; i < 6; i++) this.tone(600 + i * 180, t + i * 0.04, 0.06, 0.035); break;
      case "heal": for (let i = 0; i < 4; i++) this.tone(800 + i * 120, t + i * 0.06, 0.1, 0.03, "triangle"); break;
      case "dark": for (let i = 0; i < 5; i++) this.tone(400 - i * 60, t + i * 0.05, 0.09, 0.05); break;
      case "chest": this.tone(660, t, 0.08, 0.04); this.tone(990, t + 0.09, 0.14, 0.04); break;
      case "levelup": [523, 659, 784, 1047].forEach((f, i) => this.tone(f, t + i * 0.09, 0.12, 0.04)); break;
      case "dead": this.tone(220, t, 0.2, 0.05); this.tone(110, t + 0.15, 0.3, 0.05); break;
      case "step": this.tone(300, t, 0.03, 0.015); break;
      case "encounter": for (let i = 0; i < 4; i++) this.tone(150 + i * 50, t + i * 0.05, 0.07, 0.04); break;
    }
  },

  // BGM: [ノート(0=きゅうふ), はくすう] のれつ
  songs: {
    title:   { tempo: 100, notes: [[60,1],[64,1],[67,1],[72,2],[71,1],[67,1],[64,1],[60,2],[62,1],[65,1],[69,2],[67,1],[64,1],[60,3]] },
    field:   { tempo: 132, notes: [[60,1],[62,1],[64,1.5],[64,0.5],[67,1],[64,1],[62,1],[60,1],[62,1],[64,1],[65,1.5],[65,0.5],[69,1],[67,1],[64,1],[62,1]] },
    town:    { tempo: 104, notes: [[67,1],[69,1],[71,2],[67,1],[64,2],[65,1],[67,1],[69,2],[65,1],[62,2],[64,1],[65,1],[67,2],[64,1],[60,2],[62,1],[64,1],[62,1],[60,3]] },
    dungeon: { tempo: 90,  notes: [[48,2],[51,1],[53,1],[48,2],[54,1],[53,1],[51,2],[48,1],[46,1],[48,4]] },
    battle:  { tempo: 168, notes: [[57,0.5],[57,0.5],[60,0.5],[57,0.5],[62,0.5],[60,0.5],[57,0.5],[55,0.5],[57,0.5],[57,0.5],[60,0.5],[62,0.5],[64,1],[62,0.5],[60,0.5],[57,1]] },
    boss:    { tempo: 160, notes: [[50,0.5],[50,0.5],[50,0.5],[53,0.5],[50,0.5],[56,0.5],[55,0.5],[53,0.5],[50,0.5],[50,0.5],[58,0.5],[56,0.5],[55,1],[53,0.5],[51,0.5],[50,1]] },
    shrine:  { tempo: 80,  notes: [[64,2],[67,2],[71,3],[69,1],[67,2],[64,2],[65,2],[64,2],[62,4]] },
    victory: { tempo: 140, notes: [[60,0.5],[60,0.5],[60,0.5],[60,1.5],[56,1],[58,1],[60,1.5],[58,0.5],[60,3]], once: true },
    gameover:{ tempo: 70,  notes: [[64,2],[62,2],[60,2],[59,2],[57,4]], once: true },
    ending:  { tempo: 96,  notes: [[60,1],[64,1],[67,1],[72,2],[71,1],[72,1],[74,2],[72,1],[71,1],[67,2],[69,1],[71,1],[72,4]] },
  },

  bgm(name) {
    if (name === this.seqName) return;
    this.seqName = name;
    this.seq = this.songs[name] || null;
    this.seqPos = 0;
    this.nextTime = this.ctx ? this.ctx.currentTime + 0.08 : 0;
  },

  stopBgm() { this.seq = null; this.seqName = null; },

  tick() {
    if (!this.ctx || !this.seq || this.muted) return;
    const spb = 60 / this.seq.tempo;
    while (this.nextTime < this.ctx.currentTime + 0.25) {
      if (this.seqPos >= this.seq.notes.length) {
        if (this.seq.once) { this.seq = null; return; }
        this.seqPos = 0;
      }
      const [note, beats] = this.seq.notes[this.seqPos++];
      const dur = beats * spb;
      if (note > 0) this.tone(this.freq(note), this.nextTime, Math.min(dur * 0.9, 0.6), 0.028);
      this.nextTime += dur;
    }
  },
};

// ---------------- ゲームぜんたい ----------------
const G = {
  scenes: [],
  state: null,
  fadeT: 0, fadePhase: null, fadeCb: null,

  push(s) { this.scenes.push(s); if (s.enter) s.enter(); },
  pop() { const s = this.scenes.pop(); if (s && s.exit) s.exit(); return s; },
  top() { return this.scenes[this.scenes.length - 1]; },
  replace(s) { this.scenes = []; this.push(s); },

  fade(cb) {
    if (this.fadePhase) { if (cb) cb(); return; }
    this.fadePhase = "out"; this.fadeT = 0; this.fadeCb = cb;
  },

  updateFade(dt) {
    if (!this.fadePhase) return false;
    this.fadeT += dt * 3.5;
    if (this.fadeT >= 1) {
      if (this.fadePhase === "out") {
        if (this.fadeCb) this.fadeCb();
        this.fadeCb = null;
        this.fadePhase = "in"; this.fadeT = 0;
      } else {
        this.fadePhase = null;
      }
    }
    return true;
  },

  drawFade() {
    if (!this.fadePhase) return;
    const a = this.fadePhase === "out" ? this.fadeT : 1 - this.fadeT;
    Gfx.ctx.globalAlpha = Math.max(0, Math.min(1, a));
    Gfx.ctx.fillStyle = PAL[3];
    Gfx.ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    Gfx.ctx.globalAlpha = 1;
  },

  // ---------- パーティ/ステータス ----------
  makeHero(id, lv) {
    const d = DATA.heroes[id];
    const h = {
      id, name: d.name, cls: d.cls, spr: d.spr,
      lv, exp: this.expTotalFor(lv),
      weapon: d.weapon, armor: d.armor,
      special: d.special || null,
      command: d.command || null,
      spells: d.spells.slice(),
      row: d.row || "front",
      poison: false, paladin: false,
    };
    this.applyStats(h);
    // レベルに おうじた しゅうとくずみ じゅもん
    for (const [l, sp] of Object.entries(d.learn)) {
      if (lv >= +l && !h.spells.includes(sp)) h.spells.push(sp);
    }
    h.hp = h.maxhp; h.mp = h.maxmp;
    return h;
  },

  applyStats(h) {
    const d = DATA.heroes[h.id];
    const n = h.lv - 1;
    h.maxhp = d.base.hp + d.growth.hp * n;
    h.maxmp = d.base.mp + d.growth.mp * n;
    h.str = d.base.str + d.growth.str * n;
    h.agi = d.base.agi + d.growth.agi * n;
    h.vit = d.base.vit + d.growth.vit * n;
    h.int = d.base.int + d.growth.int * n;
    if (h.paladin) {
      const b = DATA.paladin.bonus;
      h.maxhp += b.hp; h.maxmp += b.mp; h.str += b.str; h.vit += b.vit;
    }
  },

  expTotalFor(lv) {
    let t = 0;
    for (let l = 1; l < lv; l++) t += DATA.expNext(l);
    return t;
  },

  // かくとくEXP -> レベルアップしょり。メッセージれつをかえす
  addExp(h, amount) {
    const msgs = [];
    h.exp += amount;
    while (h.exp >= this.expTotalFor(h.lv + 1)) {
      h.lv++;
      const beforeHp = h.maxhp, beforeMp = h.maxmp;
      this.applyStats(h);
      h.hp = Math.min(h.maxhp, h.hp + (h.maxhp - beforeHp));
      h.mp = Math.min(h.maxmp, h.mp + (h.maxmp - beforeMp));
      msgs.push(`${h.name}は レベル${h.lv}に あがった!`);
      const learn = DATA.heroes[h.id].learn[h.lv];
      if (learn && !h.spells.includes(learn)) {
        h.spells.push(learn);
        msgs.push(`${h.name}は ${DATA.spells[learn].name}を おぼえた!`);
      }
    }
    return msgs;
  },

  atkOf(h) { return h.str + (DATA.items[h.weapon]?.atk || 0); },
  defOf(h) { return (DATA.items[h.armor]?.def || 0) + Math.floor(h.vit / 4); },
  intOf(h) {
    return h.int + (DATA.items[h.weapon]?.int || 0) + (DATA.items[h.armor]?.int || 0);
  },
  calcHeal(h, spell) { return Math.round(spell.pow * (1 + this.intOf(h) / 16)); },

  classChange() {
    const h = this.state.party[0];
    h.paladin = true;
    h.cls = DATA.paladin.cls;
    h.spr = DATA.paladin.spr;
    h.special = DATA.paladin.special;
    h.command = DATA.paladin.command;
    this.applyStats(h);
    // それまでの そうびは もちものへ もどす
    if (h.weapon) this.addItem(h.weapon);
    if (h.armor) this.addItem(h.armor);
    h.weapon = "w_light";
    h.armor = "a_light";
    h.hp = h.maxhp; h.mp = h.maxmp;
  },

  // ---------- アイテム ----------
  addItem(id, n = 1) {
    const inv = this.state.items;
    inv[id] = (inv[id] || 0) + n;
  },
  removeItem(id, n = 1) {
    const inv = this.state.items;
    if (!inv[id]) return false;
    inv[id] -= n;
    if (inv[id] <= 0) delete inv[id];
    return true;
  },

  // ---------- フラグ ----------
  flag(k) { return !!this.state.flags[k]; },
  setFlag(k, v) { this.state.flags[k] = v; },

  // ---------- ニューゲーム/セーブ ----------
  newGame() {
    const ng = DATA.newGame;
    this.state = {
      party: ng.party.map((id) => this.makeHero(id, 1)),
      gold: ng.gold,
      items: Object.assign({}, ng.items),
      flags: {},
      map: ng.map, x: ng.x, y: ng.y, dir: ng.dir,
      steps: 0, playtime: 0,
      config: { atbWait: true },
    };
  },

  SAVE_KEY: "crystal_knights_save",

  save() {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.state));
      return true;
    } catch (e) { return false; }
  },

  hasSave() {
    try { return !!localStorage.getItem(this.SAVE_KEY); } catch (e) { return false; }
  },

  load() {
    try {
      const s = JSON.parse(localStorage.getItem(this.SAVE_KEY));
      if (!s || !s.party) return false;
      if (!s.config) s.config = { atbWait: true };
      for (const h of s.party) {
        if (!h.row) h.row = (DATA.heroes[h.id] && DATA.heroes[h.id].row) || "front";
        if (h.command === undefined) {
          h.command = h.paladin ? DATA.paladin.command
            : (DATA.heroes[h.id] && DATA.heroes[h.id].command) || null;
        }
      }
      this.state = s;
      return true;
    } catch (e) { return false; }
  },

  aliveParty() { return this.state.party.filter((h) => h.hp > 0); },
};

// ---------------- メッセージシーン ----------------
// pages: 文字列のれつ。1ページずつ Aボタンで すすむ
class MessageScene {
  constructor(pages, onDone) {
    this.pages = Array.isArray(pages) ? pages : [pages];
    this.page = 0;
    this.chars = 0;
    this.onDone = onDone || null;
    this.opaque = false;
  }
  update(dt) {
    this.chars += dt * 45;
    const text = this.pages[this.page];
    if (Input.tap("a") || Input.tap("b")) {
      if (this.chars < text.length) {
        this.chars = text.length;
      } else {
        this.page++;
        this.chars = 0;
        if (this.page >= this.pages.length) {
          G.pop();
          if (this.onDone) this.onDone();
        } else {
          AudioSys.sfx("cursor");
        }
      }
    }
  }
  draw() {
    const text = this.pages[this.page];
    if (text == null) return;
    Gfx.window(4, 218, 312, 66);
    const shown = text.slice(0, Math.floor(this.chars));
    const lines = shown.split("\n");
    for (let i = 0; i < lines.length && i < 3; i++) {
      Gfx.text(lines[i], 14, 228 + i * 17);
    }
    if (this.chars >= text.length && Math.floor(performance.now() / 300) % 2 === 0) {
      Gfx.cursor(300, 268);
    }
  }
}

// ---------------- せんたくしシーン ----------------
class ChoiceScene {
  constructor(options, onPick, opts = {}) {
    this.options = options;
    this.onPick = onPick;
    this.sel = 0;
    this.opaque = false;
    this.x = opts.x ?? 210;
    this.y = opts.y ?? 150;
    this.cancelable = opts.cancelable !== false;
  }
  update() {
    if (Input.tap("up")) { this.sel = (this.sel + this.options.length - 1) % this.options.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % this.options.length; AudioSys.sfx("cursor"); }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      const sel = this.sel;
      G.pop();
      this.onPick(sel);
    } else if (this.cancelable && Input.tap("b")) {
      AudioSys.sfx("cancel");
      G.pop();
      this.onPick(-1);
    }
  }
  draw() {
    const w = 100, h = this.options.length * 17 + 16;
    Gfx.window(this.x, this.y, w, h);
    this.options.forEach((op, i) => {
      Gfx.text(op, this.x + 22, this.y + 10 + i * 17);
    });
    Gfx.cursor(this.x + 10, this.y + 13 + this.sel * 17);
  }
}

// ---------------- スクリプトじっこう ----------------
// ops: data.js の イベントていぎ を じゅんばんに しょり
function runScript(ops, onDone) {
  let i = 0;
  const next = () => {
    while (i < ops.length) {
      const op = ops[i++];
      if (op.msg !== undefined) {
        G.push(new MessageScene(op.msg, next));
        return;
      }
      if (op.flag) { G.setFlag(op.flag[0], op.flag[1]); continue; }
      if (op.cond) {
        const pass = G.flag(op.cond.flag);
        const branch = pass ? (op.then || []) : (op.else || []);
        ops = ops.slice(0, i).concat(branch, ops.slice(i));
        continue;
      }
      if (op.give) {
        if (op.give.item) G.addItem(op.give.item);
        if (op.give.gold) G.state.gold += op.give.gold;
        AudioSys.sfx("chest");
        continue;
      }
      if (op.join) {
        if (!G.state.party.some((h) => h.id === op.join) && G.state.party.length < 5) {
          const lv = Math.max(G.state.party[0].lv, 1);
          G.state.party.push(G.makeHero(op.join, lv));
        }
        AudioSys.sfx("levelup");
        continue;
      }
      if (op.battle) {
        G.push(new BattleScene(op.battle.group, {
          boss: op.battle.boss,
          music: op.battle.music,
          onWin: next,
        }));
        return;
      }
      if (op.warp) {
        const w = op.warp;
        G.fade(() => {
          G.state.map = w.map; G.state.x = w.x; G.state.y = w.y; G.state.dir = w.dir || "d";
          const f = G.scenes.find((s) => s instanceof FieldScene);
          if (f) f.loadMap();
          next();
        });
        return;
      }
      if (op.shop) {
        G.push(new ShopScene(op.shop, next));
        return;
      }
      if (op.inn !== undefined) {
        const price = op.inn;
        G.push(new MessageScene(`やどや「いらっしゃい!\nひとばん ${price}ギルだよ。とまるかい?」`, () => {
          G.push(new ChoiceScene(["はい", "いいえ"], (sel) => {
            if (sel === 0) {
              if (G.state.gold < price) {
                G.push(new MessageScene("やどや「おかねが たりないよ!」", next));
              } else {
                G.state.gold -= price;
                G.fade(() => {
                  G.state.party.forEach((h) => {
                    h.hp = h.maxhp; h.mp = h.maxmp;
                    Object.keys(DATA.statuses).forEach((s) => { h[s] = false; });
                  });
                  AudioSys.sfx("heal");
                  G.push(new MessageScene("やどや「おはよう! げんきに なったね」", next));
                });
              }
            } else next();
          }));
        }));
        return;
      }
      if (op.classchange) { G.classChange(); AudioSys.sfx("levelup"); continue; }
      if (op.runScript) {
        ops = ops.slice(0, i).concat(DATA.scripts[op.runScript] || [], ops.slice(i));
        continue;
      }
      if (op.ending) {
        G.replace(new EndingScene());
        return;
      }
    }
    if (onDone) onDone();
  };
  next();
}
