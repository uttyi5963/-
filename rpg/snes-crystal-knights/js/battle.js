// ============================================================
// クリスタルナイツ (SNES風リメイク) - せんとう (v0.1: レオン1にん vs てき1たい)
// たたかう / にげる
// ============================================================

function rnd(a, b) { return a + Math.random() * (b - a); }

class BattleScene {
  constructor(enemyId, onWin) {
    this.opaque = true;
    this.onWin = onWin || null;
    this.enemyId = enemyId;
    this.enemy = Object.assign({}, DATA.enemies[enemyId]);
    this.enemy.hp = this.enemy.maxhp;

    this.phase = "msg";
    this.pages = [`あっ! ${this.enemy.name}が\nとびだしてきた!`];
    this.page = 0;
    this.chars = 0;
    this.sel = 0;
    this.finished = false;
    this.won = false;
    this.lost = false;

    AudioSys.bgm("battle");
  }

  leon() { return STATE.leon; }

  say(...lines) {
    this.pages = lines;
    this.page = 0;
    this.chars = 0;
    this.phase = "msg";
  }

  update(dt) {
    if (this.phase === "msg") {
      this.chars += dt * 60;
      const text = this.pages[this.page];
      if (Input.tap("a")) {
        if (this.chars < text.length) { this.chars = text.length; return; }
        this.page++;
        this.chars = 0;
        if (this.page >= this.pages.length) {
          if (this.finished) this.close();
          else { this.phase = "command"; this.sel = 0; }
        }
      }
      return;
    }
    if (this.phase === "command") {
      if (Input.tap("up") || Input.tap("down")) this.sel = 1 - this.sel;
      if (Input.tap("a")) {
        if (this.sel === 0) this.doAttack();
        else this.doFlee();
      }
    }
  }

  doAttack() {
    const leon = this.leon();
    const dmg = Math.max(1, Math.round(leon.str - this.enemy.def * 0.5 + rnd(-1, 2)));
    this.enemy.hp = Math.max(0, this.enemy.hp - dmg);
    const lines = [`レオンの こうげき!\n${this.enemy.name}に ${dmg}の ダメージ!`];
    if (this.enemy.hp <= 0) {
      lines.push(`${this.enemy.name}を たおした!`);
      leon.exp += this.enemy.exp;
      lines.push(`けいけんち ${this.enemy.exp}を えた!`);
      this.finished = true; this.won = true;
      this.say(...lines);
      return;
    }
    const edmg = Math.max(1, Math.round(this.enemy.atk - leon.vit * 0.5 + rnd(-1, 2)));
    leon.hp = Math.max(0, leon.hp - edmg);
    lines.push(`${this.enemy.name}の こうげき!\nレオンに ${edmg}の ダメージ!`);
    if (leon.hp <= 0) {
      lines.push("レオンは たおれてしまった……");
      this.finished = true; this.lost = true;
    }
    this.say(...lines);
  }

  doFlee() {
    if (Math.random() < 0.8) {
      this.finished = true;
      this.say("うまく にげきれた!");
      return;
    }
    const edmg = Math.max(1, Math.round(this.enemy.atk - this.leon().vit * 0.5 + rnd(-1, 2)));
    this.leon().hp = Math.max(0, this.leon().hp - edmg);
    const lines = ["しかし にげられない!", `${this.enemy.name}の こうげき!\nレオンに ${edmg}の ダメージ!`];
    if (this.leon().hp <= 0) {
      lines.push("レオンは たおれてしまった……");
      this.finished = true; this.lost = true;
    }
    this.say(...lines);
  }

  close() {
    G.pop();
    if (this.lost) this.leon().hp = this.leon().maxhp; // v0.1のかんい ゲームオーバー
    if (this.onWin && this.won) this.onWin();
  }

  // ---------------- びょうが (原作クリスタルナイツ じゅんきょ) ----------------
  // 原作の battle.js は てきを 左がわ、パーティを 右がわに はいちする。
  // はいけいは そら/ちへいせんの グラデーションではなく、フラットいろ + うすい
  // ちへいせんラインと 1〜2しょくの シルエットだけの シンプルな つくり。
  draw() {
    const c = Gfx.ctx;
    const GROUND_Y = 300;

    // はいけい: フラットいろ + とおくの やまなみシルエット + ちへいせんライン
    c.fillStyle = "#182838"; c.fillRect(0, 0, SCREEN_W, SCREEN_H);
    c.fillStyle = "#101020";
    for (let i = 0; i < 6; i++) {
      const x = 10 + i * 92, w = 78, h = 36 + (i % 3) * 14;
      c.beginPath();
      c.moveTo(x, GROUND_Y); c.lineTo(x + w / 2, GROUND_Y - h); c.lineTo(x + w, GROUND_Y);
      c.fill();
    }
    c.fillStyle = "#283818"; c.fillRect(0, GROUND_Y, SCREEN_W, 14);
    c.fillStyle = "#1c2810";
    for (let i = 0; i < 14; i++) c.fillRect((i * 44 + 8) % SCREEN_W, GROUND_Y + 4 + (i % 3), 20, 3);

    // てき (原作と おなじ ひだりがわ、あしもとに かげ)
    const ex = 150, ey = 190, escale = 4;
    const esize = Gfx.sprite(this.enemy.spr) ? Gfx.sprite(this.enemy.spr).width * escale : 96;
    c.fillStyle = "#101020";
    c.fillRect(ex + esize * 0.15, ey + esize - 6, esize * 0.7, 8);
    Gfx.draw(this.enemy.spr, ex, ey, { scale: escale });

    // てきステータス (ひだりした, HPは バーのみ ひょうじ)
    const ebx = 24, eby = GROUND_Y + 40;
    Gfx.window(ebx, eby, 200, 68);
    Gfx.text(this.enemy.name, ebx + 16, eby + 12, 4, 16);
    const ratio = this.enemy.hp / this.enemy.maxhp;
    c.fillStyle = "#301818"; c.fillRect(ebx + 16, eby + 40, 168, 12);
    c.fillStyle = PAL[9]; c.fillRect(ebx + 16, eby + 40, Math.max(0, 168 * ratio), 12);

    // じぶんの パーティ (原作と おなじ みぎがわ、てきの ほうを むいて たつ)
    const leon = this.leon();
    Gfx.draw("hero_s", SCREEN_W - 190, 150, { scale: 2.2, flip: true });

    // パーティステータス (みぎした)
    const pbx = SCREEN_W - 224, pby = GROUND_Y + 40;
    Gfx.window(pbx, pby, 200, 68);
    Gfx.text(`レオン Lv${leon.lv}`, pbx + 16, pby + 10, 4, 15);
    Gfx.text(`HP ${leon.hp}/${leon.maxhp}`, pbx + 16, pby + 32, 3, 13);
    Gfx.text(`MP ${leon.mp}/${leon.maxmp}`, pbx + 16, pby + 50, 3, 13);

    // メッセージログ (じょうぶ, 原作の ログウィンドウと おなじ いち)
    if (this.phase === "msg") {
      Gfx.window(16, 16, SCREEN_W - 32, 76);
      const text = this.pages[this.page];
      const shown = text.slice(0, Math.floor(this.chars));
      shown.split("\n").forEach((l, i) => { if (i < 3) Gfx.text(l, 34, 34 + i * 26); });
    }

    // コマンドウィンドウ (原作と おなじ ひだりうえに フロートひょうじ)
    if (this.phase === "command") {
      const opts = ["たたかう", "にげる"];
      const cw = 200, ch = opts.length * 40 + 24;
      Gfx.window(16, 16, cw, ch);
      opts.forEach((o, i) => {
        const y = 30 + i * 40;
        Gfx.text(o, 60, y, 4, 17);
        if (i === this.sel) Gfx.cursor(28, y + 4);
      });
    }
  }
}
