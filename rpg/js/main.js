// ============================================================
// クリスタルナイツ - きどう / タイトル / エンディング
// ============================================================

// ビルド版。タイトル画面に 小さく 表示し、端末が 最新コードに
// 更新できているか 一目で わかるようにする (キャッシュ確認用)。
const BUILD_VERSION = "v2026.07.19c";

class TitleScene {
  constructor() {
    this.opaque = true;
    this.sel = 0;
    this.t = 0;
    this.cmdBuf = []; // クリスタルコマンド (↑→↓←↑→↓←) の入力バッファ
    AudioSys.bgm("title");
  }

  // 裏技: 菱形 (クリスタル) を 2かい なぞると おんがくかんが ひらく
  checkCrystalCmd() {
    const SEQ = ["up", "right", "down", "left", "up", "right", "down", "left"];
    for (const d of ["up", "right", "down", "left"]) {
      if (Input.tap(d)) this.cmdBuf.push(d);
    }
    while (this.cmdBuf.length > 0 &&
      !SEQ.slice(0, this.cmdBuf.length).every((v, i) => v === this.cmdBuf[i])) {
      this.cmdBuf.shift();
    }
    if (this.cmdBuf.length === SEQ.length) {
      this.cmdBuf = [];
      AudioSys.sfx("levelup");
      G.push(new MusicRoomScene());
      return true;
    }
    return false;
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
    if (this.checkCrystalCmd()) return;
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
    // ながれ星 (ときどき よこぎる)
    const sph = this.t % 9;
    if (sph < 1.1) {
      c.fillStyle = PAL[1];
      const sx = 40 + sph * 220, sy = 20 + sph * 60;
      for (let k = 0; k < 5; k++) c.fillRect(sx - k * 6, sy - k * 2, 4, 2);
      c.fillStyle = PAL[0];
      c.fillRect(sx, sy, 3, 2);
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
    Gfx.textR("かんぜんばん", 310, 166, 1, 9);

    const opts = this.options();
    Gfx.window(88, 176, 144, opts.length * 18 + 14);
    opts.forEach((o, i) => Gfx.text(o, 114, 184 + i * 18, 3, 11));
    Gfx.cursor(100, 187 + this.sel * 18);

    Gfx.text("Z:けってい X:キャンセル M:おと", 60, 268, 1, 10);
    Gfx.text(BUILD_VERSION, 4, 280, 1, 9);
  }
}

// おんがくかん (タイトルのクリスタルコマンドで開く隠しサウンドテスト)
class MusicRoomScene {
  constructor() {
    this.opaque = true;
    this.sel = 0;
    this.tracks = [
      ["title", "クリスタルのテーマ"], ["field", "みちくさの風"],
      ["town", "まちのだんらん"], ["dungeon", "くらやみの通路"],
      ["under", "地底のこどう"], ["battle", "たたかいのとき"],
      ["boss", "強敵うちて"], ["shrine", "いのりのほこら"],
      ["victory", "勝利のファンファーレ"], ["gameover", "ついとうの調べ"],
      ["ending", "旅路の果てに"], ["sky", "そらをかけるシリウス号"],
      ["sea", "海のゆりかご"], ["last", "星の塔"],
      ["star", "星のせかいへ"], ["hall", "でんどうの間"],
      ["spirit", "精霊のまい"],
    ].filter(([k]) => AudioSys.songs && AudioSys.songs[k]);
    this.scroll = 0;
  }
  update() {
    const n = this.tracks.length, view = 10;
    if (Input.tap("up")) { this.sel = (this.sel + n - 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % n; AudioSys.sfx("cursor"); }
    if (this.sel < this.scroll) this.scroll = this.sel;
    if (this.sel >= this.scroll + view) this.scroll = this.sel - view + 1;
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      this.playing = this.tracks[this.sel][0];
      AudioSys.bgm(this.playing);
    }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); AudioSys.bgm("title"); G.pop(); }
  }
  draw() {
    Gfx.clear(3);
    const c = Gfx.ctx;
    c.fillStyle = PAL[2];
    for (let i = 0; i < 12; i++) {
      const x = (i * 53 + 17) % SCREEN_W, y = (i * 37 + 11) % SCREEN_H;
      c.fillRect(x, y, 2, 2);
    }
    Gfx.window(30, 14, 260, 260);
    Gfx.text("おんがくかん", 44, 24);
    Gfx.textR("ひみつの サウンドルーム", 280, 24, 1, 9);
    const view = 10;
    this.tracks.slice(this.scroll, this.scroll + view).forEach(([k, name], i) => {
      const idx = this.scroll + i, y = 52 + i * 19;
      Gfx.text(String(idx + 1).padStart(2, "0"), 48, y, 1, 10);
      Gfx.text(name, 76, y, 3, 10);
      if (this.playing === k) Gfx.text("♪", 268, y, 2, 10);
      if (idx === this.sel) Gfx.cursor(38, y + 3);
    });
    Gfx.text("A: さいせい  B: もどる", 92, 252, 1, 9);
  }
}

class GameOverScene {
  constructor() {
    this.opaque = true;
    this.t = 0;
    this.sel = 0;
    // オートセーブが あれば「つづきから」を だせる
    this.canContinue = !!G.slotInfo(G.AUTO_SLOT);
  }
  update(dt) {
    this.t += dt;
    if (this.t < 1.2) return;
    if (this.canContinue && (Input.tap("up") || Input.tap("down"))) {
      this.sel = 1 - this.sel;
      AudioSys.sfx("cursor");
    }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      if (this.canContinue && this.sel === 0) {
        // オートセーブから さいかい
        G.fade(() => {
          if (G.load(G.AUTO_SLOT)) G.replace(new FieldScene());
          else G.replace(new TitleScene());
        });
      } else {
        G.fade(() => G.replace(new TitleScene()));
      }
    }
  }
  draw() {
    Gfx.clear(3);
    const c = Gfx.ctx;
    c.font = "bold 22px 'MS Gothic', monospace";
    c.fillStyle = PAL[0];
    const s = "ゲームオーバー";
    c.fillText(s, (SCREEN_W - c.measureText(s).width) / 2, 100);
    if (this.t <= 1.2) return;
    if (this.canContinue) {
      const opts = ["つづきから (オートセーブ)", "タイトルへ"];
      opts.forEach((o, i) => {
        Gfx.text(o, 116, 156 + i * 22, this.sel === i ? 0 : 1, 11);
        if (this.sel === i) Gfx.text("▶", 102, 156 + i * 22, 0, 11);
      });
    } else if (Math.floor(this.t * 2) % 2 === 0) {
      Gfx.text("Aボタンで タイトルへ", 96, 180, 1, 12);
    }
  }
}

// ---------------- 章タイトルカード ----------------
class ChapterTitleScene {
  constructor(title, onDone) {
    this.opaque = true;
    this.title = title;
    this.onDone = onDone || null;
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    if (this.t > 2.6 || (this.t > 0.6 && (Input.tap("a") || Input.tap("b")))) {
      G.pop();
      if (this.onDone) this.onDone();
    }
  }
  draw() {
    Gfx.clear(3);
    const c = Gfx.ctx;
    // ほしくずの ちらつき
    c.fillStyle = PAL[2];
    for (let i = 0; i < 14; i++) {
      const x = (i * 53 + 17) % SCREEN_W, y = (i * 37 + 11) % SCREEN_H;
      if ((i + Math.floor(this.t * 2)) % 5 !== 0) c.fillRect(x, y, 2, 2);
    }
    // すみの かざりわく
    [[12, 12, 1, 1], [SCREEN_W - 12, 12, -1, 1],
     [12, SCREEN_H - 12, 1, -1], [SCREEN_W - 12, SCREEN_H - 12, -1, -1]].forEach(([x, y, sx, sy]) => {
      c.fillRect(x, y, 18 * sx, 2 * sy);
      c.fillRect(x, y, 2 * sx, 18 * sy);
    });
    // 中央から ひろがる 2本のライン
    const lw = Math.min(1, Math.max(0, (this.t - 0.3) / 0.5)) * 152;
    if (lw > 2) {
      c.fillStyle = PAL[2];
      c.fillRect(SCREEN_W / 2 - lw / 2, 112, lw, 2);
      c.fillRect(SCREEN_W / 2 - lw / 2, 150, lw, 2);
    }
    // クリスタルの きらめき
    if (this.t > 0.45) {
      const cx = SCREEN_W / 2, cy = 94, s = 8;
      c.fillStyle = PAL[1];
      c.beginPath();
      c.moveTo(cx, cy - s); c.lineTo(cx + s * 0.7, cy); c.lineTo(cx, cy + s); c.lineTo(cx - s * 0.7, cy);
      c.fill();
      c.fillStyle = PAL[0];
      c.fillRect(cx - 1, cy - 4, 2, 4);
      if (Math.floor(this.t * 3) % 2 === 0) {
        c.fillStyle = PAL[1];
        c.fillRect(cx - s - 6, cy, 4, 1); c.fillRect(cx + s + 3, cy, 4, 1);
        c.fillRect(cx, cy - s - 6, 1, 4); c.fillRect(cx, cy + s + 3, 1, 4);
      }
    }
    // タイトル
    if (this.t > 0.25) {
      c.font = "bold 17px 'MS Gothic', monospace";
      c.fillStyle = PAL[this.t > 0.55 ? 0 : 1];
      c.fillText(this.title, (SCREEN_W - c.measureText(this.title).width) / 2, 138);
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
    this.trueEnd = trueEnd; // 章間ロール(偽エンド)は おわったら フィールドへ もどる
    // 真エンドでは キャラ別の後日談ビネットを はさむ
    this.phase = trueEnd ? "vignette" : "scroll";
    this.vidx = 0;
    this.vt = 0;
    const asc = (h) => h && h.ascended;
    const heroOf = (id) => G.state.party.find((h) => h.id === id);
    this.vignettes = trueEnd ? [
      { id: "leon", title: "レオン 〜光の騎士〜", lines: [
        "剣を鞘に納めた若き騎士は、",
        "王のかたわらで民の声に耳を傾ける。",
        asc(heroOf("leon")) ? "ゴッドパラディンの伝説は、" : "その背中は、",
        "新たな騎士たちの道しるべとなった。",
      ] },
      { id: "glen", title: "グレン 〜大空の竜騎士〜", lines: [
        "シリウス号の甲板に立ち、",
        "彼は今日も世界の空を巡る。",
        "雲の向こうに友の笑顔を思い出しながら、",
        "槍は高く、誇りはもっと高く。",
      ] },
      { id: "gou", title: "ゴウ 〜受け継がれる拳〜", lines: [
        "試練の山の頂で、彼は弟子を取った。",
        "師の教えと拳王との勝負の記憶を、",
        "次の世代へ受け渡すために。",
        asc(heroOf("gou")) ? "極意はまだ、その先にある。" : "修行に終わりはない。",
      ] },
      { id: "celia", title: "セリア 〜祈りの家〜", lines: [
        "ネブラの村に小さな祈りの家を開き、",
        "傷ついた旅人を癒やしている。",
        "夜になると窓辺に灯りをともす。",
        "いつか帰ってくる仲間たちのために。",
      ] },
      { id: "rod", title: "ロッド 〜真理の探究者〜", lines: [
        "ガレフ先生と魔道の学び舎を建て、",
        "子供たちに魔法の楽しさを教えている。",
        asc(heroOf("rod")) ? "陰と陽、ふたつの式の先にある真理を、" : "クリスタルの謎を、",
        "彼はまだ追いかけている。",
      ] },
    ] : [];
    this.lines = trueEnd ? [
      "4つのクリスタルは",
      "それぞれの 神殿へ かえり",
      "世界は ひかりに つつまれた。",
      "",
      "光のきし レオンは",
      "ヴェルダの 剣聖となり",
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
      "ヴェルダのくにと ネブラのむらに",
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
    if (this.phase === "vignette") {
      this.vt += dt;
      // Aボタン か 7秒で つぎのビネットへ
      if ((this.vt > 1 && Input.tap("a")) || this.vt > 7) {
        AudioSys.sfx("cursor");
        this.vidx++;
        this.vt = 0;
        if (this.vidx >= this.vignettes.length) this.phase = "scroll";
      }
      return;
    }
    this.scroll += dt * 14;
    const maxScroll = this.lines.length * 20 - 100;
    if (this.scroll > maxScroll) this.scroll = maxScroll;
    if (this.t > 4 && (Input.tap("a") || Input.tap("b")) && this.scroll >= maxScroll) {
      AudioSys.sfx("confirm");
      if (this.trueEnd) {
        G.fade(() => G.replace(new TitleScene()));
      } else {
        // 章のまくあい: そのまま ぼうけんを つづける
        G.fade(() => {
          G.replace(new FieldScene());
          G.autosave();
        });
      }
    }
  }
  draw() {
    Gfx.clear(3);
    const c = Gfx.ctx;
    if (this.phase === "vignette") {
      const v = this.vignettes[this.vidx];
      if (!v) return;
      // 星空
      for (let k = 0; k < 40; k++) {
        const sx = (k * 53) % SCREEN_W, sy = (k * 97) % 150;
        c.fillStyle = PAL[(k + Math.floor(performance.now() / 700)) % 3 === 0 ? 1 : 2];
        c.fillRect(sx, sy, 2, 2);
      }
      // キャラスプライト (戦闘立ちポーズがあれば使用)
      const h = G.state.party.find((q) => q.id === v.id);
      let spr = h ? h.spr + "_b_idle" : null;
      if (!spr || !SPR.chars[spr]) spr = h ? h.spr : "hero";
      Gfx.draw(spr, SCREEN_W / 2 - 24, 60, { scale: 3 });
      // タイトルと本文 (タイプライタ表示)
      c.font = "bold 13px 'MS Gothic', monospace";
      c.fillStyle = PAL[0];
      c.fillText(v.title, (SCREEN_W - c.measureText(v.title).width) / 2, 135);
      const shown = Math.floor(this.vt * 28);
      let used = 0;
      v.lines.forEach((l, i) => {
        const part = l.slice(0, Math.max(0, shown - used));
        used += l.length;
        c.font = "bold 11px 'MS Gothic', monospace";
        c.fillStyle = PAL[1];
        c.fillText(part, (SCREEN_W - c.measureText(l).width) / 2, 165 + i * 20);
      });
      // ページ送りヒント
      if (this.vt > 1 && Math.floor(performance.now() / 400) % 2 === 0) {
        c.fillStyle = PAL[1];
        c.fillText("▼", SCREEN_W - 24, SCREEN_H - 14);
      }
      return;
    }
    this.lines.forEach((l, i) => {
      const y = 200 + i * 20 - this.scroll;
      if (y < -20 || y > SCREEN_H) return;
      c.font = "bold 13px 'MS Gothic', monospace";
      c.fillStyle = PAL[0];
      c.fillText(l, (SCREEN_W - c.measureText(l).width) / 2, y);
    });
    // スクロールが おわったら そうさプロンプト
    const maxScroll2 = this.lines.length * 20 - 100;
    if (this.scroll >= maxScroll2 && Math.floor(performance.now() / 450) % 2 === 0) {
      c.font = "bold 11px 'MS Gothic', monospace";
      c.fillStyle = PAL[1];
      const hint = this.trueEnd ? "▼ Z/Aボタンで タイトルへ" : "▼ Z/Aボタンで ぼうけんを つづける";
      c.fillText(hint, SCREEN_W - c.measureText(hint).width - 12, SCREEN_H - 12);
    }
  }
}

// ---------------- きどう ----------------
function bootGame() {
  Gfx.init();
  Input.init();
  G.migrateLegacy();
  G.push(new TitleScene());

  let last = performance.now();
  let errFrames = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // 1フレームの例外で ゲーム全体が とまらないように try でつつむ (フリーズ防止)
    try {
      AudioSys.tick();

      const fading = G.updateFade(dt);
      const top = G.top();
      if (top && !fading && !CodeOverlay.open) top.update(dt);

      // 戦闘フリーズの保険 (勝利後に フィールドへ 戻らない/戦闘が おわらない 対策)
      battleWatchdog(dt);

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
      errFrames = 0;
    } catch (e) {
      errFrames++;
      if (errFrames <= 3) console.error("[クリスタルナイツ] フレームエラー:", e);
      // さいしょの エラーは あとで しらべられるよう のこす
      if (!G.__lastError) G.__lastError = String((e && (e.stack || e.message)) || e);
      try { Input.endFrame(); } catch (_) {}
      // 戦闘ちゅうに エラーが つづいたら 安全に フィールドへ もどして フリーズを かいひ
      if (errFrames === 20) {
        try { recoverFromError(); errFrames = 0; } catch (_) {}
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// 戦闘フリーズの保険。メインループから 毎フレーム よばれる。
//  (1) 勝利メッセージが 何らかの りゆうで 20秒 すすまない → 強制的に 勝利処理してフィールドへ
//  (2) 戦闘中に キャンセル(X/Esc)を 約2秒 長押し → 手動で フィールドへ 脱出
let _winWatchT = 0, _escHoldT = 0;
function battleWatchdog(dt) {
  const nameOf = (s) => (s && s.constructor && s.constructor.name) || "";
  const bs = G.scenes.find((s) => nameOf(s) === "BattleScene");
  if (!bs) { _winWatchT = 0; _escHoldT = 0; return; }

  // (1) 勝利が 宣言済み(win済み)なのに 戦闘が スタックに のこりつづける ケースの 自動復帰。
  //     win() 専用の 目印 __victoryPushed で 判定するので、2形態ボスや 試練の
  //     とちゅう演出を あやまって うちきる ことは ない。
  if (bs.__victoryPushed && !bs.__finished) {
    _winWatchT += dt;
    if (_winWatchT > 20) {
      while (G.scenes.length && G.top() !== bs) G.pop(); // うえの メッセージ等を どける
      try { bs.finishBattle(); } catch (_) { forceFieldFromBattle(bs); }
      _winWatchT = 0;
    }
  } else {
    _winWatchT = 0;
  }

  // (2) 手動脱出: X(キャンセル)を 約2秒 押しっぱなしで フィールドへ にげる (報酬なし・保険)
  if (Input.down && Input.down.b) {
    _escHoldT += dt;
    if (_escHoldT > 2) { forceFieldFromBattle(bs); _escHoldT = 0; }
  } else {
    _escHoldT = 0;
  }
}

// 戦闘を 強制終了して フィールドだけを のこす (にげる相当・ストーリー継続は しない)
function forceFieldFromBattle(bs) {
  const nameOf = (s) => (s && s.constructor && s.constructor.name) || "";
  try { if (bs && bs.restoreBgm) bs.restoreBgm(); } catch (_) { try { AudioSys.stopBgm(); } catch (__) {} }
  G.scenes = G.scenes.filter((s) => nameOf(s) === "FieldScene");
  if (!G.scenes.length) G.push(new FieldScene());
  const f = G.scenes.find((s) => nameOf(s) === "FieldScene");
  if (f && f.loadMap) f.loadMap();
  if (G.state && G.state.party) G.state.party.forEach((h) => { if (h.hp <= 0) h.hp = 1; });
  const m = DATA.maps[G.state.map];
  if (m && m.bgm) AudioSys.bgm(m.bgm); else AudioSys.stopBgm();
}

// 連続エラー時の きんきゅう復帰 (戦闘から フィールドへ にがす)
function recoverFromError() {
  const nameOf = (s) => (s && s.constructor && s.constructor.name) || "";
  const inBattle = G.scenes.some((s) => nameOf(s) === "BattleScene");
  if (!inBattle) return;
  // 戦闘/メッセージ/子シーンを 取りのぞき、フィールドだけ のこす
  G.scenes = G.scenes.filter((s) => nameOf(s) === "FieldScene");
  if (G.scenes.length === 0) { G.push(new FieldScene()); }
  const f = G.scenes.find((s) => nameOf(s) === "FieldScene");
  if (f && f.loadMap) f.loadMap();
  // 全滅しないよう HP0の 仲間を 1に
  if (G.state && G.state.party) G.state.party.forEach((h) => { if (h.hp <= 0) h.hp = 1; });
  const m = DATA.maps[G.state.map];
  if (m && m.bgm) AudioSys.bgm(m.bgm); else AudioSys.stopBgm();
  G.push(new MessageScene("なにかの ちからで 戦いから\nにげだした……。\n(エラーから 復帰しました)"));
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
