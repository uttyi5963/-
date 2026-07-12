// ============================================================
// クリスタルナイツ - きどう / タイトル / エンディング
// ============================================================

class TitleScene {
  constructor() {
    this.opaque = true;
    this.sel = 0;
    this.t = 0;
    AudioSys.bgm("title");
  }
  options() {
    const opts = ["はじめから"];
    if (G.hasSave()) opts.push("つづきから");
    // どれかの スロットに しんエンドの きろくが あれば 2しゅうめ かいほう
    for (let n = 1; n <= G.SLOTS; n++) {
      const info = G.slotInfo(n);
      if (info && info.trueClear) { opts.push("つよくてニューゲーム"); break; }
    }
    opts.push("パスワード");
    return opts;
  }

  // 戦闘モード (ウェイト/アクティブ) を えらんでから かいし
  pickBattleMode(then) {
    G.push(new MessageScene(
      "戦闘モードを えらんでください。\nウェイト: コマンドちゅう じかんが とまる\nアクティブ: 敵は まちません (上級者)",
      () => {
        G.push(new ChoiceScene(["ウェイト", "アクティブ"], (sel) => {
          then(sel !== 1); // キャンセルは ウェイトあつかい
        }, { x: 104, y: 190, cancelable: false }));
      }
    ));
  }
  update(dt) {
    this.t += dt;
    const opts = this.options();
    if (Input.tap("up") || Input.tap("down")) {
      this.sel = (this.sel + 1) % opts.length;
      AudioSys.sfx("cursor");
    }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      const pick = opts[this.sel];
      if (pick === "つづきから") {
        G.push(new SlotPickScene("load", (slot) => {
          if (slot >= 0 && G.load(slot)) {
            G.fade(() => G.replace(new FieldScene()));
          }
        }));
      } else if (pick === "つよくてニューゲーム") {
        G.push(new SlotPickScene("load", (slot) => {
          if (slot < 0) return;
          const info = G.slotInfo(slot);
          if (!info || !info.trueClear) {
            G.push(new MessageScene("しんエンドの クリアきろくが ある\nスロットを えらんでください。"));
            return;
          }
          if (G.newGamePlus(slot)) {
            G.fade(() => {
              G.replace(new FieldScene());
              const boot = DATA.scripts[DATA.newGame.runScript];
              if (boot) runScript(boot);
            });
          }
        }));
      } else if (pick === "パスワード") {
        G.push(new ChoiceScene(["よみこむ", "かきだす"], (sel) => {
          if (sel < 0) return;
          if (sel === 0) {
            G.push(new SlotPickScene("save", (slot) => {
              if (slot < 0) return;
              CodeOverlay.show("import", "", (text) => {
                if (G.importCode(text, slot)) {
                  G.push(new MessageScene(`スロット${slot}に よみこんだ!\n「つづきから」で あそべます。`));
                } else {
                  G.push(new MessageScene("パスワードが ちがうようだ……"));
                }
              });
            }));
          } else {
            G.push(new SlotPickScene("load", (slot) => {
              if (slot < 0) return;
              const code = G.exportCode(slot);
              if (code) CodeOverlay.show("export", code);
              else G.push(new MessageScene("その スロットは からっぽだ。"));
            }));
          }
        }, { x: 104, y: 190 }));
      } else {
        this.pickBattleMode((wait) => {
          G.newGame();
          G.state.config.atbWait = wait;
          G.fade(() => {
            G.replace(new FieldScene());
            const boot = DATA.scripts[DATA.newGame.runScript];
            if (boot) runScript(boot);
          });
        });
      }
    }
  }
  draw() {
    Gfx.clear(3);
    // ほしぞら
    const c = Gfx.ctx;
    c.fillStyle = PAL[1];
    for (let i = 0; i < 40; i++) {
      const x = (i * 53 + 17) % SCREEN_W;
      const y = (i * 37 + 11) % 160;
      if ((i + Math.floor(this.t)) % 5 !== 0) c.fillRect(x, y, 2, 2);
    }
    // ながれる くも
    c.fillStyle = PAL[2];
    for (let i = 0; i < 3; i++) {
      const cx = (this.t * (8 + i * 4) + i * 130) % (SCREEN_W + 60) - 60;
      const cy = 24 + i * 26;
      c.fillRect(cx, cy, 44, 5);
      c.fillRect(cx + 8, cy - 3, 26, 3);
    }
    // とおくの やまなみ
    c.fillStyle = PAL[2];
    for (let i = 0; i < 6; i++) {
      const x = i * 58 - 10, h = 26 + (i % 3) * 12;
      c.beginPath();
      c.moveTo(x, 172); c.lineTo(x + 34, 172 - h); c.lineTo(x + 68, 172);
      c.fill();
    }
    c.fillStyle = PAL[1];
    c.fillRect(0, 170, SCREEN_W, 3);
    // クリスタルの こどう (光のわ)
    const pulse = (this.t % 2) / 2;
    if (pulse < 0.6) {
      const r = 26 + pulse * 40;
      c.strokeStyle = PAL[1];
      c.lineWidth = 2;
      c.globalAlpha = 0.6 - pulse;
      c.beginPath();
      const cx0 = SCREEN_W / 2, cy0 = 72;
      c.moveTo(cx0, cy0 - r); c.lineTo(cx0 + r, cy0); c.lineTo(cx0, cy0 + r); c.lineTo(cx0 - r, cy0);
      c.closePath(); c.stroke();
      c.globalAlpha = 1;
    }
    const bob = Math.sin(this.t * 2) * 3;
    Gfx.draw("crystal", SCREEN_W / 2 - 24, 40 + bob, { scale: 3 });

    c.font = "bold 24px 'MS Gothic', monospace";
    c.fillStyle = PAL[0];
    const title = "クリスタルナイツ";
    const tw = c.measureText(title).width;
    c.fillText(title, (SCREEN_W - tw) / 2, 120);
    Gfx.text("〜 暗黒騎士の 物語 〜", 74, 152, 1, 12);

    const opts = this.options();
    Gfx.window(88, 176, 144, opts.length * 18 + 14);
    opts.forEach((o, i) => Gfx.text(o, 114, 184 + i * 18, 3, 11));
    Gfx.cursor(100, 187 + this.sel * 18);

    Gfx.text("Z:けってい X:キャンセル M:おと", 60, 268, 1, 10);
  }
}

class GameOverScene {
  constructor() {
    this.opaque = true;
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    if (this.t > 1.2 && Input.tap("a")) {
      AudioSys.sfx("confirm");
      G.fade(() => G.replace(new TitleScene()));
    }
  }
  draw() {
    Gfx.clear(3);
    const c = Gfx.ctx;
    c.font = "bold 22px 'MS Gothic', monospace";
    c.fillStyle = PAL[0];
    const s = "ゲームオーバー";
    c.fillText(s, (SCREEN_W - c.measureText(s).width) / 2, 110);
    if (this.t > 1.2 && Math.floor(this.t * 2) % 2 === 0) {
      Gfx.text("Aボタンで タイトルへ", 96, 180, 1, 12);
    }
  }
}

class EndingScene {
  constructor() {
    this.opaque = true;
    this.t = 0;
    this.scroll = 0;
    AudioSys.bgm("ending");
    const p = G.state.party[0];
    const trueEnd = G.flag("trueClear");
    this.lines = trueEnd ? [
      "4つのクリスタルは",
      "それぞれの 神殿へ かえり",
      "世界は ひかりに つつまれた。",
      "",
      "光のきし レオンは",
      "バロンの 拳聖となり",
      "竜騎士 グレンは 空を、",
      "モンクのゴウは ぶを きわめた。",
      "",
      "ロッドは 魔道の がくしゃに。",
      "セリアの いのりは 今も",
      "世界を やさしく てらしている。",
      "",
      "",
      "CRYSTAL KNIGHTS",
      "〜 暗黒騎士の 物語 〜",
      "",
      `さいしゅうレベル: ${p ? p.lv : "??"}`,
      `プレイじかん: ${Math.floor(G.state.playtime / 60)}ふん`,
      "",
      "完全クリア おめでとう!",
      "",
      "THE END",
    ] : [
      "クリスタルの 光は",
      "ふたたび 世界を てらした。",
      "",
      "やみに おちた きしは",
      "光の きしへ。",
      "",
      "バロンのくにと ミストのむらに",
      "平和が もどった。",
      "",
      "",
      "CRYSTAL KNIGHTS",
      "〜 暗黒騎士の 物語 〜",
      "",
      `さいしゅうレベル: ${p ? p.lv : "??"}`,
      `プレイじかん: ${Math.floor(G.state.playtime / 60)}ふん`,
      "",
      "……だが 物語には つづきがある。",
      "4つの クリスタルが そろうとき、",
      "しんの 敵が すがたを あらわす。",
      "",
      "つづく",
    ];
  }
  update(dt) {
    this.t += dt;
    this.scroll += dt * 14;
    const maxScroll = this.lines.length * 20 - 100;
    if (this.scroll > maxScroll) this.scroll = maxScroll;
    if (this.t > 4 && Input.tap("a") && this.scroll >= maxScroll) {
      AudioSys.sfx("confirm");
      G.fade(() => G.replace(new TitleScene()));
    }
  }
  draw() {
    Gfx.clear(3);
    this.lines.forEach((l, i) => {
      const y = 200 + i * 20 - this.scroll;
      if (y < -20 || y > SCREEN_H) return;
      const c = Gfx.ctx;
      c.font = "bold 13px 'MS Gothic', monospace";
      c.fillStyle = PAL[0];
      c.fillText(l, (SCREEN_W - c.measureText(l).width) / 2, y);
    });
  }
}

// ---------------- きどう ----------------
function bootGame() {
  Gfx.init();
  Input.init();
  G.migrateLegacy();
  G.push(new TitleScene());

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    AudioSys.tick();

    const fading = G.updateFade(dt);
    const top = G.top();
    if (top && !fading && !CodeOverlay.open) top.update(dt);

    // いちばんうえの opaque シーンから じゅんに えがく
    let start = 0;
    for (let i = G.scenes.length - 1; i >= 0; i--) {
      if (G.scenes[i].opaque) { start = i; break; }
    }
    for (let i = start; i < G.scenes.length; i++) {
      if (G.scenes[i].draw) G.scenes[i].draw();
    }
    G.drawFade();

    Input.endFrame();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// じどうテストよう フック
window.CK = { G, Gfx, Input, AudioSys, DATA, SPR };
window.CKDEBUG = {
  noEncounters: false, // テストよう: ランダムエンカウントを とめる
  warp(map, x, y) {
    G.state.map = map; G.state.x = x; G.state.y = y;
    const f = G.scenes.find((s) => s instanceof FieldScene);
    if (f) f.loadMap();
  },
  give(item, n = 1) { G.addItem(item, n); },
  gold(n) { G.state.gold += n; },
  flag(k, v = 1) { G.setFlag(k, v); },
  levelup(times = 1) {
    for (const h of G.state.party) {
      G.addExp(h, G.expTotalFor(h.lv + times) - h.exp);
      h.hp = h.maxhp; h.mp = h.maxmp;
    }
  },
  winBattle() {
    const b = G.top();
    if (b instanceof BattleScene) {
      b.enemies.forEach((e) => { e.hp = 0; e.dead = true; });
      b.checkEnd();
    }
  },
  key(k) {
    Input.hit[k] = true;
  },
};

addEventListener("DOMContentLoaded", bootGame);
