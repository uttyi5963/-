// ============================================================
// クリスタルナイツ (SNES風リメイク) - きどう
// ============================================================

const BUILD_VERSION = "snes-v0.1.0";

class TitleScene {
  constructor() {
    this.opaque = true;
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    if (Input.tap("a")) {
      AudioSys.unlock();
      const ng = DATA.newGame;
      G.replace(new FieldScene(ng.map, ng.x, ng.y, ng.dir));
    }
  }
  draw() {
    Gfx.clear(10);
    const c = Gfx.ctx;
    c.fillStyle = "#183050";
    c.fillRect(0, 300, SCREEN_W, 148);
    const bob = Math.floor(this.t * 2) % 2;
    Gfx.draw("hero_d", SCREEN_W / 2 - 32, 220 + bob * 4, { scale: 1.5 });

    Gfx.text("CRYSTAL KNIGHTS", SCREEN_W / 2 - 150, 80, 4, 26);
    Gfx.text("クリスタルナイツ", SCREEN_W / 2 - 140, 120, 13, 30);
    Gfx.text("〜あんこくきしの ものがたり〜", SCREEN_W / 2 - 150, 165, 3, 18);
    Gfx.text("(SNES風 リメイク)", SCREEN_W / 2 - 100, 190, 12, 16);

    if (Math.floor(this.t * 2) % 2 === 0) {
      Gfx.text("- PUSH Z -", SCREEN_W / 2 - 60, 340, 4, 20);
    }
    Gfx.text(BUILD_VERSION, 10, SCREEN_H - 24, 3, 14);
  }
}

function bootGame() {
  Gfx.init();
  Input.init();
  G.push(new TitleScene());

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    try {
      const top = G.top();
      if (top) top.update(dt);

      let start = 0;
      for (let i = G.scenes.length - 1; i >= 0; i--) {
        if (G.scenes[i].opaque) { start = i; break; }
      }
      for (let i = start; i < G.scenes.length; i++) {
        if (G.scenes[i].draw) G.scenes[i].draw();
      }
      Input.endFrame();
    } catch (e) {
      console.error("[クリスタルナイツ SNES風] フレームエラー:", e);
      try { Input.endFrame(); } catch (_) {}
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

window.MS = { G, Gfx, Input, AudioSys, DATA, SPR, STATE };

addEventListener("DOMContentLoaded", bootGame);
