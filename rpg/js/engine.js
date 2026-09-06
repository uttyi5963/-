// ============================================================
// クリスタルナイツ - エンジン (描画/入力/音/シーン/セーブ)
// ============================================================

const SCREEN_W = 320, SCREEN_H = 288, TILE = 16;
// ゲームボーイ 4かいちょう パレット (あかるい -> くらい)
const PAL = ["#9bbc0f", "#8bac0f", "#306230", "#0f380f"];

// ---------------- GBカラーモード ----------------
// ゲームボーイカラーの ながれを くむ 4色パレット群。
// 1スプライトは 4色のまま、種類ごとに パレットを わりあてる (GBC方式)。
// コンフィグ「がめんカラー」で ON/OFF (OFF = クラシックな GB緑)。
const GBC_PALS = {
  terra:   ["#d8f8a8", "#78c850", "#287828", "#0c3008"], // 草原・森
  water:   ["#c8e8f8", "#58a8f0", "#2060c0", "#102858"], // 水・氷晶
  earth:   ["#f0d8a8", "#c89858", "#785028", "#301808"], // 山・岩・道
  stone:   ["#e8e8f0", "#a8a8c0", "#585878", "#181828"], // 石造り・床壁
  sand:    ["#f8f0c0", "#e0c070", "#a07830", "#403008"], // 砂漠
  snow:    ["#f8f8ff", "#b8d8f0", "#6890c0", "#203058"], // 雪原
  night:   ["#d0c0f0", "#8868c8", "#483080", "#100828"], // 夜・魔
  fire:    ["#f8d0a0", "#f08838", "#c03818", "#400808"], // 炎・赤系
  wood:    ["#e8c890", "#b08850", "#684828", "#201008"], // 木製・土のNPC
  gold:    ["#f8f0c8", "#f0c848", "#b07818", "#402808"], // 宝・王・町アイコン
  holy:    ["#f8f0e8", "#f0b0c8", "#a05880", "#381028"], // 聖・セリア
  knight:  ["#e8e0f0", "#9080c0", "#504088", "#181030"], // 暗黒騎士レオン
  paladin: ["#f8f8f0", "#88c0e8", "#3868b0", "#102048"], // パラディン
};
const GBC_TILE = {
  grass: "terra", forest: "terra", flower: "terra", pine: "terra", palm: "terra",
  water: "water", water2: "water", fountain: "water", bridge: "wood",
  mountain: "earth", path: "earth", scree: "earth", deadtree: "wood",
  floor: "stone", wall: "stone", pillar: "stone", stairs: "stone", statue: "stone",
  door: "wood", table: "wood", bed: "wood", counter: "wood", shelf: "wood",
  carpet: "fire", banner: "fire", torch: "fire",
  chest: "gold", chest_open: "gold", sand: "sand", snow: "snow", nightgrass: "night",
  icon_castle: "gold", icon_town: "gold", icon_cave: "earth", icon_tower: "stone", icon_shrine: "water",
};
const GBC_CHAR = {
  hero: "knight", pal: "paladin", glen: "terra", gou: "fire", celia: "holy", rod: "night",
  king: "gold", soldier: "stone", elder: "wood", villager: "wood", crystal: "water",
};
const GBC_MON = {
  goblin: "terra", bat: "night", toad: "terra", skeleton: "stone", wizard: "night",
  golem: "earth", gargoyle: "stone", demon: "fire", treant: "terra", voidos: "night",
  bird: "water", worm: "sand", kraken: "water", dragon: "fire", zarba: "night",
  slime: "water", eye: "night", mantis: "terra", cat: "fire", wisp: "holy", crab: "fire",
};
function gbcPalFor(realName) {
  let k = null;
  if (SPR.tiles && SPR.tiles[realName]) k = GBC_TILE[realName];
  else if (SPR.chars && SPR.chars[realName]) k = GBC_CHAR[String(realName).split("_")[0]];
  else if (SPR.mons && SPR.mons[realName]) k = GBC_MON[realName];
  return GBC_PALS[k] || GBC_PALS.stone;
}

// ---------------- ストレージ ----------------
// localStorage がつかえない環境 (プライベートブラウズ/サンドボックス等) では
// メモリに保存してゲームを続行できるようにする。パスワード機能で永続化を補う。
const Store = {
  mem: {},
  ok: (() => {
    try {
      const k = "__ck_probe";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })(),
  get(k) {
    if (this.ok) { try { return localStorage.getItem(k); } catch (e) { /* fallthrough */ } }
    return Object.prototype.hasOwnProperty.call(this.mem, k) ? this.mem[k] : null;
  },
  set(k, v) {
    this.mem[k] = v;
    if (this.ok) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  },
  del(k) {
    delete this.mem[k];
    if (this.ok) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  },
};

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
    const gbc = typeof G !== "undefined" && G.state && G.state.config && G.state.config.gbc;
    const key = name + "/" + (variant || "") + (gbc ? "/c" : "");
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
        else if (variant === "light") pi = Math.max(0, pi - 1); // こおり系リカラー
        c.fillStyle = (gbc ? gbcPalFor(realName) : PAL)[pi];
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
    // うちがわの かざりわく
    c.fillStyle = PAL[3];
    c.fillRect(x + 4, y + 4, w - 8, 1);
    c.fillRect(x + 4, y + h - 5, w - 8, 1);
    c.fillRect(x + 4, y + 4, 1, h - 8);
    c.fillRect(x + w - 5, y + 4, 1, h - 8);
    // よすみの アクセント
    c.fillStyle = PAL[2];
    c.fillRect(x, y, 2, 2);
    c.fillRect(x + w - 2, y, 2, 2);
    c.fillRect(x, y + h - 2, 2, 2);
    c.fillRect(x + w - 2, y + h - 2, 2, 2);
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
      // パスワード入力ちゅうは ゲームそうさを うけつけない
      if (e.target && (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT")) return;
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
    // 十字パッド: パッド全面をタッチ面にして、指の位置から方向を判定
    // (中央のデッドゾーンなし / 押したまま スライドで方向転換できる)
    const pad = document.querySelector(".dpad");
    if (pad) {
      const DIRS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      let padActive = false;
      const clearDirs = () => {
        DIRS.forEach((d) => { const k = this.keyName({ key: d }); if (k) this.down[k] = false; });
      };
      const setFromPoint = (e) => {
        const r = pad.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const key = Math.abs(dx) > Math.abs(dy)
          ? (dx < 0 ? "ArrowLeft" : "ArrowRight")
          : (dy < 0 ? "ArrowUp" : "ArrowDown");
        const k = this.keyName({ key });
        DIRS.forEach((d) => {
          const dk = this.keyName({ key: d });
          if (dk && dk !== k) this.down[dk] = false;
        });
        if (k) { if (!this.down[k]) this.hit[k] = true; this.down[k] = true; }
      };
      pad.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        AudioSys.unlock();
        padActive = true;
        try { pad.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        setFromPoint(e);
      });
      pad.addEventListener("pointermove", (e) => { if (padActive) setFromPoint(e); });
      const padOff = (e) => { e.preventDefault(); padActive = false; clearDirs(); };
      pad.addEventListener("pointerup", padOff);
      pad.addEventListener("pointercancel", padOff);
    }

    // タッチそうさ (A/B/STARTボタン)
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

  // BGM: notes=[ノート(0=きゅうふ), はくすう] のれつ。bass はていおんパート(さんかくは)
  songs: {
    title:   { tempo: 100, notes: [[60,1],[64,1],[67,1],[72,2],[71,1],[67,1],[64,1],[60,2],[62,1],[65,1],[69,2],[67,1],[64,1],[60,3]] },
    field:   { tempo: 132, notes: [[60,1],[62,1],[64,1.5],[64,0.5],[67,1],[64,1],[62,1],[60,1],[62,1],[64,1],[65,1.5],[65,0.5],[69,1],[67,1],[64,1],[62,1]] },
    town:    { tempo: 104, notes: [[67,1],[69,1],[71,2],[67,1],[64,2],[65,1],[67,1],[69,2],[65,1],[62,2],[64,1],[65,1],[67,2],[64,1],[60,2],[62,1],[64,1],[62,1],[60,3]] },
    dungeon: { tempo: 90,  notes: [[48,2],[51,1],[53,1],[48,2],[54,1],[53,1],[51,2],[48,1],[46,1],[48,4]] },
    under:   { tempo: 76,  notes: [[45,2],[48,1],[45,1],[50,2],[48,1],[45,1],[43,2],[41,1],[43,1],[45,4]] },
    battle:  { tempo: 168, notes: [[57,0.5],[57,0.5],[60,0.5],[57,0.5],[62,0.5],[60,0.5],[57,0.5],[55,0.5],[57,0.5],[57,0.5],[60,0.5],[62,0.5],[64,1],[62,0.5],[60,0.5],[57,1]] },
    boss:    { tempo: 160, notes: [[50,0.5],[50,0.5],[50,0.5],[53,0.5],[50,0.5],[56,0.5],[55,0.5],[53,0.5],[50,0.5],[50,0.5],[58,0.5],[56,0.5],[55,1],[53,0.5],[51,0.5],[50,1]] },
    shrine:  { tempo: 80,  notes: [[64,2],[67,2],[71,3],[69,1],[67,2],[64,2],[65,2],[64,2],[62,4]] },
    victory: { tempo: 140, notes: [[60,0.5],[60,0.5],[60,0.5],[60,1.5],[56,1],[58,1],[60,1.5],[58,0.5],[60,3]], once: true },
    gameover:{ tempo: 70,  notes: [[64,2],[62,2],[60,2],[59,2],[57,4]], once: true },
    ending:  { tempo: 96,  notes: [[60,1],[64,1],[67,1],[72,2],[71,1],[72,1],[74,2],[72,1],[71,1],[67,2],[69,1],[71,1],[72,4]] },
    sky:     { tempo: 112, notes: [[72,0.5],[76,0.5],[79,0.5],[76,0.5],[72,0.5],[76,0.5],[81,1],[79,0.5],[76,0.5],[74,0.5],[76,0.5],[77,1],[76,0.5],[74,0.5],[72,2]],
               bass: [[48,2],[52,2],[53,2],[55,2]] },
    sea:     { tempo: 84,  notes: [[62,1.5],[65,0.5],[69,2],[67,1],[65,1],[62,2],[60,1.5],[62,0.5],[65,2],[64,1],[62,1],[57,2]],
               bass: [[38,4],[41,4],[43,4],[38,4]] },
    last:    { tempo: 152, notes: [[57,0.5],[57,0.5],[60,0.5],[62,0.5],[64,1],[62,0.5],[60,0.5],[64,0.5],[64,0.5],[67,0.5],[69,0.5],[71,1],[69,0.5],[67,0.5],[64,1],[62,1],[60,0.5],[57,1.5]],
               bass: [[33,1],[33,1],[36,1],[38,1],[40,1],[38,1],[36,1],[33,1]] },
    // 星の世界: ゆったりした 3びょうしの こもりうた
    star:    { tempo: 92,  notes: [[74,1],[78,1],[81,1],[79,2],[76,1],[78,1.5],[74,0.5],[76,3],[71,1],[73,1],[76,1],[78,2],[73,1],[74,3],[71,1],[69,3]],
               bass: [[50,3],[47,3],[52,3],[45,3],[50,3],[43,3]] },
    // ドヴェルグ王宮: ちからづよい こうしんきょく
    hall:    { tempo: 108, notes: [[55,1],[55,0.5],[57,0.5],[59,1],[62,1],[59,1],[57,1],[55,1.5],[53,0.5],[55,1],[57,1.5],[59,0.5],[60,2],[59,1],[57,1],[55,2]],
               bass: [[43,1],[50,1],[43,1],[50,1],[41,1],[48,1],[43,1],[50,1]] },
    // 幻獣せん: うずまく はやい みつどの 戦い
    spirit:  { tempo: 172, notes: [[62,0.5],[65,0.5],[69,0.5],[70,0.5],[69,0.5],[65,0.5],[62,0.5],[60,0.5],[62,0.5],[65,0.5],[70,0.5],[72,1],[70,0.5],[69,0.5],[65,0.5],[62,0.5],[63,0.5],[62,1.5]],
               bass: [[38,0.5],[38,0.5],[45,0.5],[38,0.5],[36,0.5],[36,0.5],[43,0.5],[36,0.5]] },
  },

  bgm(name) {
    if (name === this.seqName) return;
    this.seqName = name;
    this.seq = this.songs[name] || null;
    this.seqPos = 0;
    this.bassPos = 0;
    const t = this.ctx ? this.ctx.currentTime + 0.08 : 0;
    this.nextTime = t;
    this.bassNextTime = t;
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
    // ていおんパート
    if (this.seq.bass) {
      while (this.bassNextTime < this.ctx.currentTime + 0.25) {
        if (this.bassPos >= this.seq.bass.length) this.bassPos = 0;
        const [note, beats] = this.seq.bass[this.bassPos++];
        const dur = beats * spb;
        if (note > 0) this.tone(this.freq(note), this.bassNextTime, Math.min(dur * 0.95, 1.2), 0.02, "triangle");
        this.bassNextTime += dur;
      }
    }
  },
};

// ---------------- ゲーム全体 ----------------
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
      weapon: d.weapon, armor: d.armor, acc: null,
      special: d.special || null,
      command: d.command || null,
      spells: d.spells.slice(),
      row: d.row || "front",
      poison: false, paladin: false,
      limit: 0, // 必殺ゲージ (0..100)
      prof: 0, profAct: 0, // 熟練度と 行動カウント
    };
    this.applyStats(h);
    // レベルに 王子た しゅうとくずみ 呪文
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
    if (h.ascended) {
      // きゅうきょくジョブ: 全ステータス+8、HP/MP 15%アップ
      h.maxhp = Math.round(h.maxhp * 1.15);
      h.maxmp = Math.round(h.maxmp * 1.15);
      h.str += 8; h.agi += 8; h.vit += 8; h.int += 8;
    }
    // 果実による恒久ボーナス
    h.maxhp += h.bonusHp || 0;
    h.maxmp += h.bonusMp || 0;
    h.str += h.bonusStr || 0;
    h.vit += h.bonusVit || 0;
    h.agi += h.bonusAgi || 0;
    h.int += h.bonusInt || 0;
    // 熟練度ボーナス (戦闘で4回行動するごとに1あがる、最大99)
    const pg = DATA.profGrowth && DATA.profGrowth[h.id];
    if (pg && h.prof) {
      if (pg.hp) h.maxhp += Math.floor(h.prof / pg.hp);
      if (pg.mp) h.maxmp += Math.floor(h.prof / pg.mp);
      if (pg.str) h.str += Math.floor(h.prof / pg.str);
      if (pg.agi) h.agi += Math.floor(h.prof / pg.agi);
      if (pg.vit) h.vit += Math.floor(h.prof / pg.vit);
      if (pg.int) h.int += Math.floor(h.prof / pg.int);
    }
  },

  expTotalFor(lv) {
    let t = 0;
    for (let l = 1; l < lv; l++) t += DATA.expNext(l);
    return t;
  },

  MAX_LV: 99,
  MAX_GOLD: 999999,

  gainGold(n) {
    this.state.gold = Math.min(this.MAX_GOLD, this.state.gold + n);
  },

  // かくとくEXP -> レベルアップしょり。メッセージれつをかえす
  addExp(h, amount) {
    const msgs = [];
    h.exp += amount;
    // レベル99が じょうげん。あまった 経験値は きりすて
    const capExp = this.expTotalFor(this.MAX_LV);
    if (h.exp > capExp) h.exp = capExp;
    while (h.lv < this.MAX_LV && h.exp >= this.expTotalFor(h.lv + 1)) {
      h.lv++;
      const bs = { hp: h.maxhp, mp: h.maxmp, str: h.str, agi: h.agi, vit: h.vit, int: h.int };
      this.applyStats(h);
      h.hp = Math.min(h.maxhp, h.hp + (h.maxhp - bs.hp));
      h.mp = Math.min(h.maxmp, h.mp + (h.maxmp - bs.mp));
      // どの能力が いくつ あがったかを そえる
      const gains = [["HP", h.maxhp - bs.hp], ["MP", h.maxmp - bs.mp],
        ["力", h.str - bs.str], ["素早", h.agi - bs.agi],
        ["体力", h.vit - bs.vit], ["知性", h.int - bs.int]]
        .filter(([, v]) => v > 0).map(([k, v]) => `${k}+${v}`).join(" ");
      msgs.push(`${h.name}は レベル${h.lv}に あがった!` + (gains ? `\n${gains}` : ""));
      const learn = DATA.heroes[h.id].learn[h.lv];
      if (learn && !h.spells.includes(learn)) {
        h.spells.push(learn);
        msgs.push(`${h.name}は ${DATA.spells[learn].name}を おぼえた!`);
      }
    }
    return msgs;
  },

  // どうぐ整理: つかう→ぶき→よろい→アクセ→たいせつなもの の順に ならべなおす
  sortItems() {
    const kindOrder = { use: 0, weapon: 1, armor: 2, acc: 3, key: 4 };
    const defIdx = Object.keys(DATA.items);
    const sorted = Object.entries(this.state.items).sort(([a], [b]) => {
      const ka = kindOrder[(DATA.items[a] || {}).kind] ?? 9;
      const kb = kindOrder[(DATA.items[b] || {}).kind] ?? 9;
      if (ka !== kb) return ka - kb;
      return defIdx.indexOf(a) - defIdx.indexOf(b);
    });
    this.state.items = Object.fromEntries(sorted);
  },

  accOf(h) { return (h.acc && DATA.items[h.acc]) || {}; },
  strOf(h) { return h.str + (this.accOf(h).str || 0); },
  agiOf(h) { return h.agi + (this.accOf(h).agi || 0); },
  vitOf(h) { return h.vit + (this.accOf(h).vit || 0); },
  atkOf(h) { return Math.round((this.strOf(h) + (DATA.items[h.weapon]?.atk || 0)) * (h._boost || 1)); },
  defOf(h) {
    return (DATA.items[h.armor]?.def || 0) + (this.accOf(h).def || 0) + Math.floor(this.vitOf(h) / 4);
  },
  intOf(h) {
    return Math.round((h.int + (this.accOf(h).int || 0)
      + (DATA.items[h.weapon]?.int || 0) + (DATA.items[h.armor]?.int || 0)) * (h._boost || 1));
  },
  // アクセサリの とくしゅこうか
  accGuards(h, st) { return (this.accOf(h).guard || []).includes(st); },
  accResist(h, elem) {
    const r = this.accOf(h).resist;
    return r && elem != null && r[elem] != null ? r[elem] : 1;
  },
  accAbil(h, k) { return this.accOf(h).abil === k; },
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

  // げんざいの章 (フラグから逆算)
  currentChapter(flags) {
    const f = flags || this.state.flags;
    if (f.trueClear) return "全七章 クリア";
    if (f.towerOpen) return "第七章 星の塔編";
    if (f.mirrorBoss && f.glacierBoss && f.tombBoss) return "第六章 常夜編";
    if (f.allCrystals) return "第五章 新大陸編";
    if (f.submarine) return "第四章 深海編";
    if (f.airship) return "第三章 天空編";
    if (f.ch2) return "第二章 地底編";
    return "第一章 地上編";
  },
  setFlag(k, v) { this.state.flags[k] = v; },

  // ---------- モンスター図鑑 ----------
  bestiaryEntry(id) {
    if (!this.state.bestiary) this.state.bestiary = {};
    if (!this.state.bestiary[id]) this.state.bestiary[id] = { seen: 0, killed: 0 };
    return this.state.bestiary[id];
  },
  recordSeen(id) { this.bestiaryEntry(id).seen++; },
  recordKill(id) { this.bestiaryEntry(id).killed++; },
  killsOf(id) {
    return (this.state.bestiary && this.state.bestiary[id] && this.state.bestiary[id].killed) || 0;
  },

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
      bestiary: {},
    };
  },

  SAVE_KEY: "crystal_knights_save",
  SLOTS: 4,

  slotKey(n) { return this.SAVE_KEY + "_slot" + n; },

  // 昔の 1スロットセーブを スロット1へ ひっこし
  migrateLegacy() {
    try {
      const old = Store.get(this.SAVE_KEY);
      if (old && !Store.get(this.slotKey(1))) {
        Store.set(this.slotKey(1), old);
        Store.del(this.SAVE_KEY);
      }
    } catch (e) { /* ignore */ }
  },

  // オートセーブ (スロット5に じどうきろく。マップいどうごとに よばれる)
  AUTO_SLOT: 5,
  autosave() {
    try {
      Store.set(this.slotKey(this.AUTO_SLOT), this.serialize());
    } catch (e) { /* ようりょうオーバーなどは だまって むし */ }
  },

  // _ ではじまるキーは 戦闘中だけの一時強化なので セーブに含めない
  serialize() {
    return JSON.stringify(this.state, (k, v) => (k.startsWith && k.startsWith("_") ? undefined : v));
  },

  save(slot = 1) {
    try {
      Store.set(this.slotKey(slot), this.serialize());
      return true;
    } catch (e) { return false; }
  },

  // ---------- パスワード (セーブコードの かきだし/よみこみ) ----------
  // スマホなど localStorage がのこらない環境や 機種変更むけの ひきつぎ機能
  CODE_PREFIX: "CK1.",

  exportCode(slot) {
    const raw = Store.get(this.slotKey(slot));
    if (!raw) return null;
    try {
      return this.CODE_PREFIX + btoa(unescape(encodeURIComponent(raw)));
    } catch (e) { return null; }
  },

  importCode(text, slot) {
    try {
      const t = String(text || "").trim();
      if (!t.startsWith(this.CODE_PREFIX)) return false;
      const raw = decodeURIComponent(escape(atob(t.slice(this.CODE_PREFIX.length))));
      const s = JSON.parse(raw);
      if (!s || !s.party || !s.party[0] || !s.party[0].id) return false;
      Store.set(this.slotKey(slot), raw);
      return true;
    } catch (e) { return false; }
  },

  hasSave() {
    for (let n = 1; n <= this.SLOTS + 1; n++) if (this.slotInfo(n)) return true;
    return false;
  },

  // スロットのようやく (からっぽなら null)
  slotInfo(n) {
    try {
      const s = JSON.parse(Store.get(this.slotKey(n)));
      if (!s || !s.party || !s.party[0]) return null;
      return {
        name: s.party[0].name, lv: s.party[0].lv,
        map: (DATA.maps[s.map] && DATA.maps[s.map].name) || s.map,
        min: Math.floor((s.playtime || 0) / 60),
        members: s.party.length,
        trueClear: !!(s.flags && s.flags.trueClear),
        chapter: this.currentChapter(s.flags || {}),
      };
    } catch (e) { return null; }
  },

  // つよくてニューゲーム: クリアデータから レベル/そうび/ギル/図鑑を ひきつぎ
  newGamePlus(slot) {
    let src;
    try { src = JSON.parse(Store.get(this.slotKey(slot))); } catch (e) { return false; }
    if (!src || !src.party || !src.flags || !src.flags.trueClear) return false;

    this.newGame();
    this.state.gold = src.gold;
    this.state.bestiary = src.bestiary || {};
    this.state.config = src.config || { atbWait: true };
    // キーアイテムは もちこせない
    this.state.items = {};
    for (const [id, n] of Object.entries(src.items || {})) {
      if (DATA.items[id] && DATA.items[id].kind !== "key") this.state.items[id] = n;
    }
    // 仲間は 物語で さいかにゅう (そだてた すがたのまま)
    this.state.ngHeroes = {};
    for (const h of src.party) {
      this.state.ngHeroes[h.id] = JSON.parse(JSON.stringify(h));
    }
    // レオンは 暗黒騎士に もどって さいしゅっぱつ
    const leon = JSON.parse(JSON.stringify(this.state.ngHeroes.leon));
    const base = DATA.heroes.leon;
    leon.paladin = false;
    leon.cls = base.cls; leon.spr = base.spr;
    leon.special = base.special; leon.command = base.command || null;
    if (leon.weapon === "w_light") leon.weapon = "w_dark";
    if (leon.armor === "a_light") leon.armor = "a_dark";
    this.applyStats(leon);
    leon.hp = leon.maxhp; leon.mp = leon.maxmp;
    leon.poison = leon.blind = leon.silence = leon.toad = false;
    this.state.party = [leon];
    return true;
  },

  load(slot = 1) {
    try {
      const s = JSON.parse(Store.get(this.slotKey(slot)));
      if (!s || !s.party) return false;
      if (!s.config) s.config = { atbWait: true };
      if (!s.bestiary) s.bestiary = {};
      if (s.items && s.items.w_boltstaff) {
        s.items.w_sagestaff = (s.items.w_sagestaff || 0) + s.items.w_boltstaff;
        delete s.items.w_boltstaff;
      }
      const patchHero = (h) => {
        if (!h.row) h.row = (DATA.heroes[h.id] && DATA.heroes[h.id].row) || "front";
        if (h.limit == null) h.limit = 0;
        if (h.prof == null) h.prof = 0;
        if (h.profAct == null) h.profAct = 0;
        if (h.acc === undefined) h.acc = null;
        // はいばんした ぶきの ひっこし
        if (h.weapon === "w_boltstaff") h.weapon = "w_sagestaff";
        // ふるいセーブは command が null のことがある (ロッドの覚醒等を補完)
        if (h.command == null) {
          h.command = h.paladin ? DATA.paladin.command
            : (DATA.heroes[h.id] && DATA.heroes[h.id].command) || null;
        }
        // あたらしく 追加された 習得呪文を 旧セーブに 補完 (レベル到達ぶんのみ)
        const learn = (DATA.heroes[h.id] && DATA.heroes[h.id].learn) || {};
        if (Array.isArray(h.spells)) {
          for (const [lv, sid] of Object.entries(learn)) {
            if (h.lv >= +lv && DATA.spells[sid] && !h.spells.includes(sid)) h.spells.push(sid);
          }
        }
      };
      // 7章化: 星の塔の開放フラグを旧セーブに補完
      if ((s.flags.trueClear || s.flags.nightBoss || s.flags.clear2) && !s.flags.towerOpen) {
        s.flags.towerOpen = 1;
      }
      s.party.forEach(patchHero);
      if (s.ngHeroes) Object.values(s.ngHeroes).forEach(patchHero);
      this.state = s;
      // 無限回廊の 中で セーブしていたら 同じ階を 復元する
      if (s.map === "endless") {
        if (s.endless && s.endless.seed != null) Endless.build(s.endless.seed, s.endless.floor);
        else { s.map = "world"; s.x = 5; s.y = 22; s.endless = null; }
      }
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
    this.cancelable = opts.cancelable !== false;
    // 画面に おさまるように 自動調整: 幅は いちばん長い せんたくし、
    // たかさは 最大13行 (こえたら スクロール)、はみ出す いちは 内がわへ
    const maxChars = Math.max(1, ...options.map((o) => String(o).length));
    this.w = Math.max(100, Math.min(300, maxChars * 12 + 36));
    this.view = Math.min(options.length, 13);
    this.scroll = 0;
    const h = this.view * 17 + 16;
    this.x = Math.max(4, Math.min(opts.x ?? 210, 316 - this.w));
    this.y = Math.max(4, Math.min(opts.y ?? 150, 284 - h));
  }
  update() {
    if (Input.tap("up")) { this.sel = (this.sel + this.options.length - 1) % this.options.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % this.options.length; AudioSys.sfx("cursor"); }
    // カーソルが 見えるいちに スクロールを ついずい
    if (this.sel < this.scroll) this.scroll = this.sel;
    if (this.sel >= this.scroll + this.view) this.scroll = this.sel - this.view + 1;
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
    const w = this.w, h = this.view * 17 + 16;
    Gfx.window(this.x, this.y, w, h);
    this.options.slice(this.scroll, this.scroll + this.view).forEach((op, i) => {
      Gfx.text(op, this.x + 22, this.y + 10 + i * 17);
    });
    if (this.scroll > 0) Gfx.text("▲", this.x + w - 16, this.y + 6, 2, 8);
    if (this.scroll + this.view < this.options.length) Gfx.text("▼", this.x + w - 16, this.y + h - 12, 2, 8);
    Gfx.cursor(this.x + 10, this.y + 13 + (this.sel - this.scroll) * 17);
  }
}

// ---------------- セーブスロットせんたく ----------------
// mode: "save" | "load"。onPick(スロットばんごう 1..4, キャンセルは -1)
class SlotPickScene {
  constructor(mode, onPick) {
    this.mode = mode;
    this.onPick = onPick;
    this.sel = 0;
    this.opaque = false;
    // ロードじは オートセーブわくも えらべる
    this.count = mode === "load" ? G.SLOTS + 1 : G.SLOTS;
  }
  update() {
    if (Input.tap("up")) { this.sel = (this.sel + this.count - 1) % this.count; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % this.count; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) {
      AudioSys.sfx("cancel");
      G.pop();
      this.onPick(-1);
      return;
    }
    if (Input.tap("a")) {
      const slot = this.sel + 1;
      if (this.mode === "load" && !G.slotInfo(slot)) { AudioSys.sfx("buzz"); return; }
      AudioSys.sfx("confirm");
      G.pop();
      this.onPick(slot);
    }
  }
  draw() {
    Gfx.window(30, 40, 260, this.count * 32 + 44);
    Gfx.text(this.mode === "save" ? "どこに きろくしますか?" : "どの きろくで はじめますか?", 44, 48, 3, 11);
    for (let i = 0; i < this.count; i++) {
      const y = 72 + i * 32;
      const info = G.slotInfo(i + 1);
      Gfx.text(i + 1 > G.SLOTS ? "オートセーブ" : `スロット${i + 1}`, 58, y, 3, 11);
      if (info) {
        Gfx.textR(info.chapter, 276, y, 2, 9);
        Gfx.text(`${info.name} Lv${info.lv} 仲間${info.members}にん`, 58, y + 14, 3, 9);
        Gfx.textR(`${info.map} ${info.min}ふん`, 276, y + 14, 3, 9);
      } else {
        Gfx.text("(からっぽ)", 58, y + 14, 1, 9);
      }
      if (this.sel === i) Gfx.cursor(44, y + 6);
    }
  }
}

// ---------------- パスワードオーバーレイ ----------------
// セーブコードの コピー/はりつけ用 DOM UI (スマホでも つかえる)
const CodeOverlay = {
  el: null,
  open: false,

  btn(label) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText =
      "padding:10px 18px;border:2px solid #0f380f;border-radius:6px;" +
      "background:#9bbc0f;color:#0f380f;font-weight:bold;font-size:14px;" +
      "font-family:monospace;cursor:pointer;";
    return b;
  },

  // mode: "export"(コードをみせる) | "import"(コードをうけとる)
  show(mode, code, onImport) {
    this.hide();
    this.open = true;
    const wrap = document.createElement("div");
    wrap.style.cssText =
      "position:fixed;inset:0;z-index:100;background:rgba(15,56,15,.92);" +
      "display:flex;align-items:center;justify-content:center;padding:16px;";
    const panel = document.createElement("div");
    panel.style.cssText =
      "background:#8bac0f;border:4px solid #0f380f;border-radius:8px;" +
      "padding:14px;width:min(440px,100%);display:flex;flex-direction:column;gap:10px;";
    const title = document.createElement("div");
    title.textContent = mode === "export"
      ? "パスワード (コピーして ほかの端末の「よみこむ」に はりつけてください)"
      : "パスワードを はりつけてください";
    title.style.cssText = "color:#0f380f;font-weight:bold;font-size:13px;font-family:monospace;";
    const ta = document.createElement("textarea");
    ta.value = code || "";
    ta.readOnly = mode === "export";
    ta.rows = 6;
    ta.style.cssText =
      "width:100%;resize:none;background:#9bbc0f;color:#0f380f;" +
      "border:2px solid #0f380f;border-radius:4px;font-family:monospace;" +
      "font-size:11px;padding:6px;word-break:break-all;";
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:10px;justify-content:flex-end;";
    const note = document.createElement("div");
    note.style.cssText = "color:#306230;font-size:11px;font-family:monospace;min-height:14px;";

    if (mode === "export") {
      const copy = this.btn("コピー");
      copy.addEventListener("click", () => {
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const done = () => { note.textContent = "コピーしました!"; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(ta.value).then(done, () => {
            try { document.execCommand("copy"); done(); } catch (e) { note.textContent = "ながおしで コピーしてください"; }
          });
        } else {
          try { document.execCommand("copy"); done(); } catch (e) { note.textContent = "ながおしで コピーしてください"; }
        }
      });
      row.appendChild(copy);
    } else {
      const ok = this.btn("よみこむ");
      ok.addEventListener("click", () => {
        const v = ta.value;
        this.hide();
        if (onImport) onImport(v);
      });
      row.appendChild(ok);
    }
    const close = this.btn("とじる");
    close.style.background = "#306230";
    close.style.color = "#9bbc0f";
    close.addEventListener("click", () => this.hide());
    row.appendChild(close);

    panel.appendChild(title);
    panel.appendChild(ta);
    panel.appendChild(note);
    panel.appendChild(row);
    wrap.appendChild(panel);
    document.body.appendChild(wrap);
    this.el = wrap;
    if (mode === "import") ta.focus();
    else { ta.focus(); ta.select(); }
  },

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    this.open = false;
  },
};

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
        // flag / item(しょじひん) / kills(図鑑の 討伐すう) / all(ぜんフラグ) で ぶんき
        let pass;
        if (op.cond.item) pass = (G.state.items[op.cond.item] || 0) > 0;
        else if (op.cond.itemCount) pass = (G.state.items[op.cond.itemCount.id] || 0) >= op.cond.itemCount.n;
        else if (op.cond.kills) pass = G.killsOf(op.cond.kills.id) >= op.cond.kills.n;
        else if (op.cond.prof) pass = G.state.party.some((h) => (h.prof || 0) >= op.cond.prof);
        else if (op.cond.bestiaryAll) pass = Object.keys(DATA.monsters).every((id) => G.killsOf(id) > 0);
        else if (op.cond.bestiaryKilled) pass = Object.keys(DATA.monsters)
          .filter((id) => G.killsOf(id) > 0).length >= op.cond.bestiaryKilled;
        else if (op.cond.all) pass = op.cond.all.every((k) => G.flag(k));
        else pass = G.flag(op.cond.flag);
        const branch = pass ? (op.then || []) : (op.else || []);
        ops = ops.slice(0, i).concat(branch, ops.slice(i));
        continue;
      }
      if (op.give) {
        if (op.give.item) G.addItem(op.give.item);
        if (op.give.gold) G.gainGold(op.give.gold);
        AudioSys.sfx("chest");
        continue;
      }
      if (op.omikuji) {
        // クリスタルおみくじ: 100ギルで 運だめし
        if (G.state.gold < 100) {
          G.push(new MessageScene("みこ「あら、100ギルが たりないみたい。\nまた きてね」", next));
          return;
        }
        G.state.gold -= 100;
        const r = Math.random();
        let msg;
        if (r < 0.2) {
          G.state.omikuji = "daikichi";
          msg = "【大吉】 つぎの 戦闘で 全員の\nひっさつゲージが 半分たまる!";
        } else if (r < 0.5) {
          G.state.omikuji = "kichi";
          msg = "【吉】 つぎの 戦闘は 全員\nATB満タンで はじまる!";
        } else if (r < 0.8) {
          G.state.party.forEach((h) => {
            if (h.hp > 0) h.hp = Math.min(h.maxhp, h.hp + Math.floor(h.maxhp * 0.3));
          });
          msg = "【小吉】 からだが かるくなった。\n(全員のHPが 30%かいふく)";
        } else if (r < 0.95) {
          msg = "【凶】 ……きにしない きにしない。\n(なにも おこらなかった)";
        } else {
          G.gainGold(10);
          msg = "【大凶】 みこ「これは ひどい……。\nおわびに 10ギル おかえしします」";
        }
        G.push(new MessageScene("おみくじを ひいた……\n" + msg, next));
        return;
      }
      if (op.prof) {
        // 熟練度を あたえる: { prof: ["leon", 10] }
        const ph = G.state.party.find((x) => x.id === op.prof[0]);
        if (ph) { ph.prof = Math.min(99, (ph.prof || 0) + op.prof[1]); G.applyStats(ph); }
        continue;
      }
      if (op.take) {
        if (op.take.item) G.removeItem(op.take.item);
        continue;
      }
      if (op.payGold) {
        // はらえたら ok、たりなければ ng の れつへ ぶんき
        const p = op.payGold;
        let branch;
        if (G.state.gold >= p.amount) {
          G.state.gold -= p.amount;
          AudioSys.sfx("chest");
          branch = p.ok || [];
        } else {
          AudioSys.sfx("buzz");
          branch = p.ng || [];
        }
        ops = ops.slice(0, i).concat(branch, ops.slice(i));
        continue;
      }
      if (op.rumor) {
        const r = DATA.rumors[Math.floor(Math.random() * DATA.rumors.length)];
        G.push(new MessageScene(r, next));
        return;
      }
      if (op.recap) {
        G.push(new StoryRecapScene());
        return;
      }
      if (op.slot) {
        G.push(new SlotScene());
        return;
      }
      if (op.fishing) {
        G.push(new FishingScene(op.fishing.price || 50, next, op.fishing.table));
        return;
      }
      if (op.ascend) {
        // 上位ジョブ: 全ステータス強化+ジョブ名変更+全回復
        G.state.party.forEach((h) => {
          h.ascended = true;
          const up = DATA.ascendJobs[h.id];
          if (up) h.cls = up.cls;
          G.applyStats(h);
          h.hp = h.maxhp; h.mp = h.maxmp;
        });
        G.setFlag("ascended", 1);
        AudioSys.sfx("levelup");
        continue;
      }
      if (op.healParty) {
        // れんせん用: いきているぜんいんを わりあいで 回復
        G.state.party.forEach((h) => {
          if (h.hp > 0) h.hp = Math.min(h.maxhp, h.hp + Math.round(h.maxhp * op.healParty));
        });
        AudioSys.sfx("heal");
        continue;
      }
      if (op.chapter) {
        G.push(new ChapterTitleScene(op.chapter, next));
        return;
      }
      if (op.achievements) {
        G.push(new AchievementScene(next));
        return;
      }
      if (op.menu) {
        // せんたくし: えらんだ options[n].ops を さしこんで つづける
        const m = op.menu;
        G.push(new ChoiceScene(m.options.map((o) => o.label), (sel) => {
          if (sel >= 0) {
            ops = ops.slice(0, i).concat(m.options[sel].ops || [], ops.slice(i));
          }
          next();
        }, { x: m.x ?? 190, y: m.y ?? 120 }));
        return;
      }
      if (op.join) {
        if (!G.state.party.some((h) => h.id === op.join) && G.state.party.length < 5) {
          // 2しゅうめは そだてた 仲間が もどってくる
          const saved = G.state.ngHeroes && G.state.ngHeroes[op.join];
          if (saved) {
            const h = JSON.parse(JSON.stringify(saved));
            h.hp = h.maxhp; h.mp = h.maxmp;
            h.poison = h.blind = h.silence = h.toad = false;
            G.state.party.push(h);
          } else {
            const lv = Math.max(G.state.party[0].lv, 1);
            G.state.party.push(G.makeHero(op.join, lv));
          }
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
      if (op.endless) {
        // 無限回廊の しんこう (enter/down/leave/boss) は Endless に いにん
        Endless.scriptOp(op.endless, next);
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
        G.push(new MessageScene(`宿屋「いらっしゃい!\nひとばん ${price}ギルだよ。とまるかい?」`, () => {
          G.push(new ChoiceScene(["はい", "いいえ"], (sel) => {
            if (sel === 0) {
              if (G.state.gold < price) {
                G.push(new MessageScene("宿屋「お金が たりないよ!」", next));
              } else {
                G.state.gold -= price;
                G.fade(() => {
                  G.state.party.forEach((h) => {
                    h.hp = h.maxhp; h.mp = h.maxmp;
                    Object.keys(DATA.statuses).forEach((s) => { h[s] = false; });
                  });
                  AudioSys.sfx("heal");
                  G.push(new MessageScene("宿屋「おはよう! げんきに なったね」", next));
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
