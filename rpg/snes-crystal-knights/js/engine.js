// ============================================================
// クリスタルナイツ (SNES風リメイク) - エンジン
// ============================================================

const SCREEN_W = 512, SCREEN_H = 448, TILE = 32;
// 16しょく パレット (SNES風の こい・くっきりした いろあい)
const PAL = [
  "#101020", // 0: くろ・りんかく
  "#2a2a3a", // 1: こいかげ
  "#4a4a5a", // 2: 中間グレー(いし)
  "#8a8a9a", // 3: あかるいグレー(いし ハイライト)
  "#f0f0f0", // 4: しろ・ハイライト
  "#a86850", // 5: はだ(かげ)
  "#f0c090", // 6: はだ(あかるい)
  "#503018", // 7: かみ・こげちゃ
  "#c83028", // 8: あか(マント)
  "#781818", // 9: こいあか
  "#3050a0", // a: あお(よろい)
  "#80a0e0", // b: あかるいあお
  "#308050", // c: みどり(しぜん)
  "#e8b830", // d: きん・UI
  "#785030", // e: 木・ちゃいろ
  "#c8a878", // f: あかるい木・すな
];
const HEX = "0123456789abcdef";

// ---------------- ストレージ ----------------
const Store = {
  mem: {},
  ok: (() => {
    try {
      const k = "__sk_probe";
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

  sprite(name) {
    if (this.cache.has(name)) return this.cache.get(name);
    const isTile = SPR.tiles && SPR.tiles[name];
    const rows = isTile || (SPR.chars && SPR.chars[name]) || (SPR.mons && SPR.mons[name]);
    if (!rows) return null;
    const scale = isTile ? 2 : 1;
    const size = rows.length * scale;
    const cv = document.createElement("canvas");
    cv.width = size; cv.height = size;
    const c = cv.getContext("2d");
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        const pi = HEX.indexOf(ch);
        if (pi < 0) continue;
        c.fillStyle = PAL[pi];
        c.fillRect(x * scale, y * scale, scale, scale);
      }
    }
    this.cache.set(name, cv);
    return cv;
  },

  clear(pi = 0) {
    this.ctx.fillStyle = PAL[pi];
    this.ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  },

  draw(name, x, y, opts = {}) {
    const cv = this.sprite(name);
    if (!cv) return;
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

  text(str, x, y, pi = 4, size = 18) {
    const c = this.ctx;
    c.font = `bold ${size}px 'MS Gothic', 'Hiragino Kaku Gothic ProN', monospace`;
    c.fillStyle = PAL[pi];
    c.fillText(str, x, y);
  },

  textR(str, rightX, y, pi = 4, size = 18) {
    const c = this.ctx;
    c.font = `bold ${size}px 'MS Gothic', 'Hiragino Kaku Gothic ProN', monospace`;
    const w = c.measureText(str).width;
    c.fillStyle = PAL[pi];
    c.fillText(str, rightX - w, y);
  },

  window(x, y, w, h) {
    const c = this.ctx;
    c.fillStyle = PAL[0];
    c.fillRect(x, y, w, h);
    c.fillStyle = "#182848";
    c.fillRect(x + 3, y + 3, w - 6, h - 6);
    c.fillStyle = PAL[13];
    c.fillRect(x + 3, y + 3, w - 6, 2);
    c.fillRect(x + 3, y + h - 5, w - 6, 2);
    c.fillRect(x + 3, y + 3, 2, h - 6);
    c.fillRect(x + w - 5, y + 3, 2, h - 6);
  },

  cursor(x, y, pi = 13) {
    const c = this.ctx;
    c.fillStyle = PAL[pi];
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + 12, y + 7);
    c.lineTo(x, y + 14);
    c.fill();
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
      if (e.target && (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT")) return;
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
  },

  tap(k) { return !!this.hit[k]; },
  held(k) { return !!this.down[k]; },
  endFrame() { this.hit = {}; },
};

// ---------------- サウンド (かんい) ----------------
const AudioSys = {
  ctx: null,
  unlock() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return; }
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  },
  tone(freq, t0, dur, vol = 0.05) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "square"; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  },
  sfx(name) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (name === "hit") { this.tone(200, t, 0.08); this.tone(100, t + 0.05, 0.12); }
    else if (name === "confirm") { this.tone(880, t, 0.06); this.tone(1320, t + 0.06, 0.09); }
  },
  bgm() { /* v0.1: BGMは みしっそう */ },
};

// ---------------- ゲーム全体 ----------------
const G = {
  scenes: [],
  push(s) { this.scenes.push(s); },
  pop() { return this.scenes.pop(); },
  top() { return this.scenes[this.scenes.length - 1]; },
  replace(s) { this.scenes = [s]; },
};

// ---------------- メッセージシーン ----------------
class MessageScene {
  constructor(pages, onDone) {
    this.pages = Array.isArray(pages) ? pages : [pages];
    this.page = 0;
    this.chars = 0;
    this.onDone = onDone || null;
    this.opaque = false;
  }
  update(dt) {
    if (this.page >= this.pages.length) return; // すでに とじたあとの よびだしは むし
    this.chars += dt * 60;
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
        }
      }
    }
  }
  draw() {
    const text = this.pages[this.page];
    if (text == null) return;
    Gfx.window(8, 340, 496, 100);
    const shown = text.slice(0, Math.floor(this.chars));
    const lines = shown.split("\n");
    for (let i = 0; i < lines.length && i < 3; i++) {
      Gfx.text(lines[i], 26, 358 + i * 26);
    }
    if (this.chars >= text.length && Math.floor(performance.now() / 300) % 2 === 0) {
      Gfx.cursor(474, 410);
    }
  }
}
