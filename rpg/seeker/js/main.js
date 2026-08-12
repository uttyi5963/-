// ============================================================
// モンスターシーカー - タイトル / 起動 / メインループ
// ============================================================

const BUILD_VERSION = "v0.1.0";

class TitleScene {
  constructor() {
    this.opaque = true;
    this.sel = 0;
    this.t = 0;
  }

  options() {
    const opts = [];
    if (G.hasSave()) opts.push("つづきから");
    opts.push("はじめから");
    opts.push("ひきつぎコード");
    return opts;
  }

  startNew() {
    G.newGame();
    G.replace(new FieldScene());
    const boot = DATA.scripts[DATA.newGame.runScript];
    if (boot) runScript(JSON.parse(JSON.stringify(boot)));
  }

  update(dt) {
    this.t += dt;
    const opts = this.options();
    if (Input.tap("up")) { this.sel = (this.sel + opts.length - 1) % opts.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % opts.length; AudioSys.sfx("cursor"); }
    if (Input.tap("a") || Input.tap("start")) {
      AudioSys.sfx("confirm");
      AudioSys.unlock();
      const pick = opts[this.sel];
      if (pick === "つづきから") {
        G.push(new SlotPickScene("load", (slot) => {
          if (slot > 0 && G.load(slot)) {
            G.fade(() => G.replace(new FieldScene()));
          }
        }));
      } else if (pick === "はじめから") {
        G.fade(() => this.startNew());
      } else {
        CodeOverlay.show("import", (ok) => {
          if (ok && G.load(1)) G.fade(() => G.replace(new FieldScene()));
        });
      }
    }
  }

  draw() {
    Gfx.clear(0);
    const c = Gfx.ctx;
    // そらと くさはら
    c.fillStyle = PAL[1];
    c.fillRect(0, 190, SCREEN_W, 98);
    // タイトルまわりに 魔物たち
    const bob = Math.floor(this.t * 2) % 2;
    Gfx.draw("wisp", 48, 150 + bob, { scale: 2 });
    Gfx.draw("slime", 244, 152 - bob, { scale: 2 });
    Gfx.draw("treant", 146, 128 + bob, { scale: 2 });

    Gfx.text("MONSTER SEEKER", 84, 46, 2, 14);
    Gfx.text("モンスターシーカー", 88, 70, 3, 16);
    Gfx.text("〜アオバ地方の ずかんたび〜", 84, 96, 2, 11);

    const opts = this.options();
    opts.forEach((o, i) => {
      const y = 210 + i * 20;
      Gfx.text(o, 128, y, 3, 12);
      if (i === this.sel) Gfx.cursor(112, y + 3);
    });
    Gfx.text(BUILD_VERSION, 4, 280, 1, 9);
    if (Math.floor(this.t * 2) % 2 === 0) Gfx.text("- PUSH START -", 108, 176, 2, 10);
  }
}

// ---------------- 起動 ----------------
function bootGame() {
  Gfx.init();
  Input.init();
  G.push(new TitleScene());

  let last = performance.now();
  let errFrames = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    try {
      AudioSys.tick();
      if (G.state) G.state.playtime = (G.state.playtime || 0) + dt;

      const fading = G.updateFade(dt);
      const top = G.top();
      if (top && !fading && !CodeOverlay.open) top.update(dt);

      let start = 0;
      for (let i = G.scenes.length - 1; i >= 0; i--) {
        if (G.scenes[i].opaque) { start = i; break; }
      }
      for (let i = start; i < G.scenes.length; i++) {
        if (G.scenes[i].draw) G.scenes[i].draw();
      }
      G.drawFade();

      Input.endFrame();
      errFrames = 0;
    } catch (e) {
      errFrames++;
      if (errFrames <= 3) console.error("[モンスターシーカー] フレームエラー:", e);
      if (!G.__lastError) G.__lastError = String((e && (e.stack || e.message)) || e);
      try { Input.endFrame(); } catch (_) {}
      // エラーがつづいたら フィールドへ 復帰して フリーズをかいひ
      if (errFrames === 20) {
        try {
          G.scenes = G.scenes.filter((s) => s instanceof FieldScene);
          if (!G.scenes.length && G.state) G.push(new FieldScene());
          if (!G.state) G.replace(new TitleScene());
          errFrames = 0;
        } catch (_) {}
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// じどうテストよう フック
window.MS = { G, Gfx, Input, AudioSys, DATA, SPR };

addEventListener("DOMContentLoaded", bootGame);
