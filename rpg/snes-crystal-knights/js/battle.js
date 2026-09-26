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

  draw() {
    Gfx.clear(11);
    Gfx.draw(this.enemy.spr, SCREEN_W / 2 - 64, 100, { scale: 4 });
    const barW = 220;
    const bx = SCREEN_W / 2 - barW / 2;
    Gfx.window(bx - 8, 270, barW + 16, 60);
    Gfx.text(this.enemy.name, bx, 282, 4, 16);
    const ratio = this.enemy.hp / this.enemy.maxhp;
    const c = Gfx.ctx;
    c.fillStyle = "#301818"; c.fillRect(bx, 306, barW, 14);
    c.fillStyle = PAL[9]; c.fillRect(bx, 306, Math.max(0, barW * ratio), 14);

    Gfx.window(8, 340, 220, 100);
    const leon = this.leon();
    Gfx.text(`レオン Lv${leon.lv}`, 26, 356, 4, 16);
    Gfx.text(`HP ${leon.hp}/${leon.maxhp}`, 26, 382, 4, 16);
    Gfx.text(`MP ${leon.mp}/${leon.maxmp}`, 26, 408, 4, 16);

    Gfx.window(240, 340, 264, 100);
    if (this.phase === "msg") {
      const text = this.pages[this.page];
      const shown = text.slice(0, Math.floor(this.chars));
      shown.split("\n").forEach((l, i) => { if (i < 3) Gfx.text(l, 258, 358 + i * 26); });
    } else if (this.phase === "command") {
      const opts = ["たたかう", "にげる"];
      opts.forEach((o, i) => {
        const y = 362 + i * 36;
        Gfx.text(o, 300, y);
        if (i === this.sel) Gfx.cursor(262, y + 4);
      });
    }
  }
}
