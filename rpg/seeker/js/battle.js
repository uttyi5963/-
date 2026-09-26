// ============================================================
// モンスターシーカー - 戦闘 (てもちの魔物 1体 vs あいて)
// たたかう / ホシダマ(捕獲) / こうたい / にげる
// ============================================================

function rnd(a, b) { return a + Math.random() * (b - a); }

class BattleScene {
  // opts: { wild: {id, lv} } または { trainer: "トレーナーID" }, onWin
  constructor(opts = {}) {
    this.opaque = true;
    this.opts = opts;
    this.onWin = opts.onWin || null;

    // あいての 準備
    this.trainer = null;
    this.enemyQueue = [];
    if (opts.trainer) {
      const t = DATA.trainers[opts.trainer];
      this.trainer = t;
      for (const [id0, lv] of t.mons) {
        let id = id0;
        if (id === "RIVAL_STARTER") {
          // ライバルは こちらに有利なタイプを えらんでいる
          const pick = { 1: "shizukun", 2: "hibachi", 3: "mokurin" };
          id = pick[G.state.flags.rivalMon] || "shizukun";
        }
        this.enemyQueue.push(G.makeMon(id, lv));
      }
    } else {
      this.enemyQueue.push(G.makeMon(opts.wild.id, opts.wild.lv));
    }
    this.enemy = this.enemyQueue.shift();
    // 野生には まれに「いろちがい」(1/64) が あらわれる
    if (opts.wild) this.enemy.shiny = Math.random() < 1 / 64;
    G.recordSeen(this.enemy.id);

    // じぶんの 先頭の元気な魔物
    this.activeIdx = G.state.party.findIndex((m) => m.hp > 0);
    this.finished = false;

    this.phase = "msg";     // msg / menu / moves / switch
    this.sel = 0; this.sel2 = 0;
    this.queue = [];        // { text, fn } の れつ。A で すすめる
    this.shake = 0; this.flashE = 0; this.flashP = 0;

    const intro = this.trainer
      ? `${this.trainer.name}が\nしょうぶを しかけてきた!`
      : `あっ! やせいの ${this.enemy.name}が\nとびだしてきた! (Lv${this.enemy.lv})`;
    this.say(intro);
    if (this.enemy.shiny) this.say("……! いろの ちがう\nめずらしい すがただ!!", () => AudioSys.sfx("levelup"));
    this.say(`いけっ! ${this.mine().name}!`);
    this.flush("menu");

    AudioSys.bgm(this.trainer ? "boss" : "battle");
  }

  mine() { return G.state.party[this.activeIdx]; }
  sp(m) { return DATA.species[m.id]; }

  // ---------------- メッセージキュー ----------------
  say(text, fn) { this.pending = this.pending || []; this.pending.push({ text, fn }); }
  flush(nextPhase) {
    this.queue = this.pending || [];
    this.pending = null;
    this.afterQueue = nextPhase;
    this.phase = "msg";
    this.cur = null;
    this.advance();
  }
  advance() {
    if (this.queue.length === 0) {
      this.cur = null;
      if (this.afterQueue === "end") { this.endBattle(); return; }
      if (this.afterQueue === "lose") { this.loseBattle(); return; }
      if (this.afterQueue === "forceSwitch") { this.phase = "switch"; this.forced = true; this.sel = 0; return; }
      this.phase = this.afterQueue || "menu";
      this.sel = 0;
      return;
    }
    this.cur = this.queue.shift();
    this.chars = 0;
    if (this.cur.fn) this.cur.fn();
  }

  // ---------------- ダメージ ----------------
  calcDmg(atkMon, defMon, move) {
    const lvterm = atkMon.lv * 0.4 + 2;
    let dmg = (lvterm * move.pow * atkMon.atk / Math.max(1, defMon.def)) / 42 + 2;
    const mod = DATA.typeMod(move.type, this.sp(defMon).type);
    const stab = this.sp(atkMon).type === move.type ? 1.2 : 1;
    const crit = Math.random() < 1 / 16;
    dmg = Math.round(dmg * mod * stab * (crit ? 1.5 : 1) * rnd(0.85, 1.0));
    return { dmg: Math.max(1, dmg), mod, crit };
  }

  stName(st) { return DATA.statusNames[st] || st; }

  applyStatus(target, st) {
    if (target.status) { this.say("しかし うまく きまらなかった!"); return; }
    target.status = st;
    if (st === "sleep") target.sleepT = 0;
    this.say(`${target.name}は ${this.stName(st)}じょうたいに なった!`, () => AudioSys.sfx("buzz"));
  }

  useMove(atkMon, defMon, moveId, isMine) {
    const move = DATA.moves[moveId];
    this.say(`${atkMon.name}の ${move.name}!`, () => AudioSys.sfx("hit"));
    if (Math.random() > (move.acc ?? 1)) {
      this.say("しかし はずれてしまった!");
      return;
    }
    // 補助技 (ダメージなし・状態異常を あたえる)
    if (move.status) {
      this.applyStatus(defMon, move.status);
      return;
    }
    const { dmg, mod, crit } = this.calcDmg(atkMon, defMon, move);
    this.say(null, () => {
      defMon.hp = Math.max(0, defMon.hp - dmg);
      if (isMine) { this.flashE = 0.3; } else { this.flashP = 0.3; this.shake = 0.25; }
      AudioSys.sfx(crit ? "crit" : "hit");
    });
    if (crit) this.say("きゅうしょに あたった!");
    if (mod >= 2) this.say("こうかは ばつぐんだ!");
    else if (mod < 1) this.say("こうかは いまひとつの ようだ……");
    // 追加効果 (らいめいの まひ など)
    if (move.inflict && !defMon.status) {
      this.say(null, () => {
        if (defMon.hp <= 0 || defMon.status) return;
        if (Math.random() < move.inflict.chance) {
          this.pending = [];
          this.applyStatus(defMon, move.inflict.status);
          this.queue = this.pending.concat(this.queue);
          this.pending = null;
        }
      });
    }
  }

  // 1体ぶんの行動 (ねむり/まひの 行動不能チェックつき)
  performAct(a, d, mv, mine) {
    if (a.hp <= 0 || d.hp <= 0) return;
    if (a.status === "sleep") {
      a.sleepT = (a.sleepT || 0) + 1;
      if (a.sleepT >= 2 && (Math.random() < 0.5 || a.sleepT > 3)) {
        a.status = null;
        this.say(`${a.name}は 目をさました!`);
      } else {
        this.say(`${a.name}は ぐうぐう ねむっている……`);
        return;
      }
    }
    if (a.status === "para" && Math.random() < 0.25) {
      this.say(`${a.name}は 体がしびれて うごけない!`);
      return;
    }
    this.useMove(a, d, mv, mine);
  }

  effSpd(m) { return m.spd * (m.status === "para" ? 0.5 : 1); }

  enemyMove() {
    const mv = this.enemy.moves[Math.floor(Math.random() * this.enemy.moves.length)];
    this.performAct(this.enemy, this.mine(), mv, false);
  }

  // ---------------- ターンしんこう ----------------
  runTurn(myMoveId) {
    const me = this.mine(), en = this.enemy;
    const enMoveId = en.moves[Math.floor(Math.random() * en.moves.length)];
    const myPri = DATA.moves[myMoveId].pri || 0;
    const enPri = DATA.moves[enMoveId].pri || 0;
    const mySpd = this.effSpd(me), enSpd = this.effSpd(en);
    const meFirst = myPri !== enPri ? myPri > enPri
      : mySpd !== enSpd ? mySpd > enSpd : Math.random() < 0.5;

    const acts = meFirst
      ? [[me, en, myMoveId, true], [en, me, enMoveId, false]]
      : [[en, me, enMoveId, false], [me, en, myMoveId, true]];

    for (const [a, d, mv, mine] of acts) {
      this.say(null, () => {
        this.pending = [];
        this.performAct(a, d, mv, mine);
        this.queue = this.pending.concat(this.queue);
        this.pending = null;
      });
      this.say(null, () => this.checkFaint());
    }
    // ターンおわりの どくダメージ
    this.say(null, () => {
      this.pending = [];
      for (const m of [me, en]) {
        if (m.hp > 0 && m.status === "poison") {
          const dmg = Math.max(1, Math.round(m.maxhp / 8));
          this.say(`${m.name}は どくの ダメージを うけた!`, () => {
            m.hp = Math.max(0, m.hp - dmg);
            AudioSys.sfx("hit");
          });
        }
      }
      this.queue = this.pending.concat(this.queue);
      this.pending = null;
    });
    this.say(null, () => this.checkFaint());
    this.flush("menu");
  }

  // たおれた魔物の しょり (キューのとちゅうで よばれ、いこうの流れを さしかえる)
  checkFaint() {
    const me = this.mine(), en = this.enemy;
    if (en.hp <= 0) {
      this.queue = [];
      this.pending = [];
      this.say(`${en.name}は たおれた!`, () => AudioSys.sfx("dead"));
      G.recordKill(en.id);
      // けいけんち
      const exp = Math.max(1, Math.round(this.sp(en).exp * en.lv / 3.2));
      this.say(`${me.name}は けいけんちを\n${exp} かくとく!`);
      const msgs = G.addMonExp(me, exp);
      msgs.forEach((t) => this.say(t, () => AudioSys.sfx("levelup")));
      if (this.trainer && this.enemyQueue.length > 0) {
        this.say(null, () => {
          this.enemy = this.enemyQueue.shift();
          G.recordSeen(this.enemy.id);
          this.pending = [];
          this.say(`${this.trainer.name}は\n${this.enemy.name}を くりだした! (Lv${this.enemy.lv})`);
          this.queue = this.pending.concat(this.queue);
          this.pending = null;
        });
        this.flush("menu");
      } else {
        if (this.trainer) {
          G.gainGold(this.trainer.gold);
          this.say(`しょうぶに かった!\n${this.trainer.gold}ギルを 手に入れた!`, () => AudioSys.bgm("victory"));
          this.say(this.trainer.winMsg);
        } else {
          this.say(null, () => AudioSys.bgm("victory"));
        }
        this.flush("end");
      }
      return;
    }
    if (me.hp <= 0) {
      this.queue = [];
      this.pending = [];
      this.say(`${me.name}は たおれてしまった!`, () => AudioSys.sfx("dead"));
      if (G.aliveMons().length > 0) {
        this.say("つぎの魔物を えらぼう!");
        this.flush("forceSwitch");
      } else {
        this.say("たたかえる魔物が いなくなった……");
        this.flush("lose");
      }
    }
  }

  // ---------------- 捕獲 ----------------
  // ねむり/まひ/どくの あいては つかまえやすい (1.5倍)
  catchChance(en, ball) {
    let p = this.sp(en).catch * ball.rate * (1 - 0.72 * en.hp / en.maxhp);
    if (en.hp / en.maxhp <= 0.25) p += 0.1;
    if (en.status) p *= 1.5;
    return Math.max(0.03, Math.min(0.95, p));
  }

  tryCapture(ballId) {
    const ball = DATA.items[ballId];
    G.removeItem(ballId);
    const en = this.enemy;
    this.say(`${ball.name}を なげた!`, () => AudioSys.sfx("confirm"));
    const p = this.catchChance(en, ball);
    if (Math.random() < p) {
      this.say(`やった! ${en.name}を\nつかまえた!!`, () => { AudioSys.sfx("levelup"); AudioSys.bgm("victory"); });
      const firstTime = !(G.state.bestiary[en.id] && G.state.bestiary[en.id].caught);
      G.recordCaught(en.id);
      const caught = G.makeMon(en.id, en.lv);
      caught.hp = Math.max(1, en.hp);
      if (en.shiny) {
        caught.shiny = true;
        G.bestiaryEntry(en.id).shiny = 1;
        this.say("いろちがいの きちょうな こたいだ!");
      }
      if (G.state.party.length < 5) {
        G.state.party.push(caught);
        this.say(`${en.name}は なかまに くわわった!`);
      } else {
        G.state.box.push(caught);
        this.say(`てもちが いっぱいなので\n${en.name}は ボックスへ おくられた。`);
      }
      if (firstTime) this.say(`${en.name}の データを ずかんに きろくした!\n『${this.sp(en).dex}』`);
      this.flush("end");
    } else {
      this.say("ああっ! でてきてしまった!");
      this.say(null, () => {
        this.pending = [];
        this.enemyMove();
        this.queue = this.pending.concat(this.queue);
        this.pending = null;
      });
      this.say(null, () => this.checkFaint());
      this.flush("menu");
    }
  }

  // ---------------- にげる / こうたい ----------------
  tryRun() {
    const me = this.mine(), en = this.enemy;
    let p = 0.6 + (me.spd - en.spd) * 0.02;
    p = Math.max(0.35, Math.min(0.95, p));
    if (Math.random() < p) {
      this.say("うまく にげきれた!");
      this.flush("end");
    } else {
      this.say("にげられなかった!");
      this.say(null, () => {
        this.pending = [];
        this.enemyMove();
        this.queue = this.pending.concat(this.queue);
        this.pending = null;
      });
      this.say(null, () => this.checkFaint());
      this.flush("menu");
    }
  }

  doSwitch(idx, free) {
    this.activeIdx = idx;
    this.say(`いけっ! ${this.mine().name}!`);
    if (!free) {
      // こうたいすると あいての こうげきを うける
      this.say(null, () => {
        this.pending = [];
        this.enemyMove();
        this.queue = this.pending.concat(this.queue);
        this.pending = null;
      });
      this.say(null, () => this.checkFaint());
    }
    this.flush("menu");
  }

  // ---------------- おわり ----------------
  endBattle() {
    if (this.finished) return;
    this.finished = true;
    G.pop();
    const m = DATA.maps[G.state.map];
    if (m && m.bgm) AudioSys.bgm(m.bgm); else AudioSys.stopBgm();
    if (this.onWin) this.onWin();
  }

  loseBattle() {
    if (this.finished) return;
    this.finished = true;
    const lost = Math.floor(G.state.gold / 2);
    G.state.gold -= lost;
    G.pop();
    G.healAllMons();
    G.fade(() => {
      G.state.map = "home"; G.state.x = 6; G.state.y = 7; G.state.dir = "d";
      const f = G.scenes.find((s) => s instanceof FieldScene);
      if (f) f.loadMap();
      AudioSys.bgm("town");
      G.push(new MessageScene(`めのまえが まっくらに なった……\n${lost}ギルを おとして\nむらまで はこばれた。`));
    });
  }

  // ---------------- こうしん ----------------
  update(dt) {
    this.shake = Math.max(0, this.shake - dt);
    this.flashE = Math.max(0, this.flashE - dt);
    this.flashP = Math.max(0, this.flashP - dt);

    if (this.phase === "msg") {
      this.chars = (this.chars || 0) + dt * 50;
      // テキストなしステップ (エフェクトのみ) は じどうで つぎへ
      if (this.cur && this.cur.text == null) { this.advance(); return; }
      if (Input.tap("a") || Input.tap("b")) {
        if (this.cur && this.chars < this.cur.text.length) this.chars = this.cur.text.length;
        else this.advance();
      }
      return;
    }

    if (this.phase === "menu") {
      const n = 4;
      if (Input.tap("up")) { this.sel = (this.sel + 2) % n; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel = (this.sel + 2) % n; AudioSys.sfx("cursor"); }
      if (Input.tap("left")) { this.sel = this.sel % 2 === 0 ? this.sel + 1 : this.sel - 1; AudioSys.sfx("cursor"); }
      if (Input.tap("right")) { this.sel = this.sel % 2 === 0 ? this.sel + 1 : this.sel - 1; AudioSys.sfx("cursor"); }
      if (Input.tap("a")) {
        AudioSys.sfx("confirm");
        if (this.sel === 0) { this.phase = "moves"; this.sel2 = 0; }
        else if (this.sel === 1) { // ホシダマ
          if (this.trainer) { this.say("トレーナーの魔物は\nつかまえられない!"); this.flush("menu"); return; }
          const balls = ["kindama", "gindama", "hoshidama"].filter((b) => (G.state.items[b] || 0) > 0);
          if (balls.length === 0) { this.say("ホシダマを もっていない!"); this.flush("menu"); return; }
          this.tryCapture(balls[0]); // つよい たまから つかう
        }
        else if (this.sel === 2) { this.phase = "switch"; this.forced = false; this.sel = 0; }
        else { // にげる
          if (this.trainer) { this.say("しょうぶの とちゅうで\nにげられない!"); this.flush("menu"); return; }
          this.tryRun();
        }
      }
      return;
    }

    if (this.phase === "moves") {
      const moves = this.mine().moves;
      if (Input.tap("up")) { this.sel2 = (this.sel2 + moves.length - 1) % moves.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel2 = (this.sel2 + 1) % moves.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.phase = "menu"; return; }
      if (Input.tap("a")) {
        AudioSys.sfx("confirm");
        this.runTurn(moves[this.sel2]);
      }
      return;
    }

    if (this.phase === "switch") {
      const party = G.state.party;
      if (Input.tap("up")) { this.sel = (this.sel + party.length - 1) % party.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel = (this.sel + 1) % party.length; AudioSys.sfx("cursor"); }
      if (!this.forced && Input.tap("b")) { AudioSys.sfx("cancel"); this.phase = "menu"; return; }
      if (Input.tap("a")) {
        const m = party[this.sel];
        if (m.hp <= 0) { AudioSys.sfx("buzz"); return; }
        if (this.sel === this.activeIdx && !this.forced) { AudioSys.sfx("buzz"); return; }
        AudioSys.sfx("confirm");
        this.doSwitch(this.sel, this.forced);
        this.forced = false;
      }
      return;
    }
  }

  // ---------------- びょうが ----------------
  hpBar(x, y, w, m) {
    const c = Gfx.ctx;
    c.fillStyle = PAL[3];
    c.fillRect(x, y, w, 6);
    const r = Math.max(0, m.hp / m.maxhp);
    c.fillStyle = r > 0.5 ? PAL[2] : PAL[3];
    c.fillStyle = PAL[0];
    c.fillRect(x + 1, y + 1, Math.round((w - 2) * r), 4);
  }

  draw() {
    Gfx.clear(0);
    const c = Gfx.ctx;
    c.save();
    if (this.shake > 0) c.translate(Math.round(rnd(-3, 3)), Math.round(rnd(-2, 2)));

    // じめん
    c.fillStyle = PAL[1];
    c.fillRect(196, 96, 100, 6);
    c.fillRect(30, 190, 110, 6);

    // あいて (みぎうえ)
    const en = this.enemy;
    const esc = this.sp(en).scale || 2;
    const esize = 16 * esc;
    const ex = 240 - esize / 2, ey = 96 - esize;
    const bob = Math.floor(performance.now() / 500) % 2;
    if (!(this.flashE > 0 && Math.floor(performance.now() / 60) % 2 === 0)) {
      Gfx.draw(this.sp(en).spr, ex, ey + bob, { scale: esc, variant: en.shiny ? "light" : this.sp(en).pal });
    }
    Gfx.window(8, 8, 150, 38);
    Gfx.text((en.shiny ? "★" : "") + en.name + (en.status ? `(${this.stName(en.status)})` : ""), 16, 15, 3, 11);
    Gfx.textR(`Lv${en.lv}`, 150, 15, 3, 10);
    this.hpBar(16, 32, 132, en);

    // じぶんの魔物 (ひだりした・せなかごし)
    const me = this.mine();
    const msc = this.sp(me).scale || 2;
    const msize = 16 * msc;
    const mx = 84 - msize / 2, my = 190 - msize;
    if (!(this.flashP > 0 && Math.floor(performance.now() / 60) % 2 === 0)) {
      Gfx.draw(this.sp(me).spr, mx, my + (1 - bob), { scale: msc, flip: true, variant: me.shiny ? "light" : this.sp(me).pal });
    }
    Gfx.window(162, 150, 150, 52);
    Gfx.text((me.shiny ? "★" : "") + me.name + (me.status ? `(${this.stName(me.status)})` : ""), 170, 157, 3, 11);
    Gfx.textR(`Lv${me.lv}`, 304, 157, 3, 10);
    this.hpBar(170, 174, 132, me);
    Gfx.text(`HP ${me.hp}/${me.maxhp}`, 170, 184, 3, 10);

    c.restore();

    // メッセージ / メニュー
    if (this.phase === "msg" && this.cur && this.cur.text != null) {
      Gfx.window(4, 218, 312, 66);
      const shown = this.cur.text.slice(0, Math.floor(this.chars));
      shown.split("\n").forEach((l, i) => { if (i < 3) Gfx.text(l, 14, 228 + i * 17); });
      if (this.chars >= this.cur.text.length && Math.floor(performance.now() / 300) % 2 === 0) {
        Gfx.cursor(300, 268);
      }
    } else if (this.phase === "menu") {
      Gfx.window(4, 218, 312, 66);
      const opts = ["たたかう", "ホシダマ", "こうたい", "にげる"];
      opts.forEach((o, i) => {
        const x = 30 + (i % 2) * 150, y = 232 + Math.floor(i / 2) * 24;
        Gfx.text(o, x, y);
        if (i === this.sel) Gfx.cursor(x - 14, y + 3);
      });
    } else if (this.phase === "moves") {
      const moves = this.mine().moves;
      const h = moves.length * 17 + 14;
      Gfx.window(4, 284 - h - 66, 190, h);
      moves.forEach((id, i) => {
        const mv = DATA.moves[id];
        const y = 284 - h - 66 + 8 + i * 17;
        Gfx.text(mv.name, 30, y, 3, 11);
        Gfx.textR(DATA.types[mv.type].name, 186, y, 2, 9);
        if (i === this.sel2) Gfx.cursor(14, y + 3);
      });
      Gfx.window(4, 218, 312, 66);
      const mv = DATA.moves[moves[this.sel2]];
      Gfx.text(`いりょく ${mv.pow}  タイプ: ${DATA.types[mv.type].name}`, 14, 232, 3, 11);
    } else if (this.phase === "switch") {
      const party = G.state.party;
      const h = party.length * 17 + 14;
      Gfx.window(40, 60, 240, h);
      party.forEach((m, i) => {
        const y = 68 + i * 17;
        Gfx.text(m.name, 66, y, m.hp > 0 ? 3 : 1, 11);
        Gfx.textR(`Lv${m.lv}  ${m.hp}/${m.maxhp}`, 272, y, m.hp > 0 ? 3 : 1, 10);
        if (i === this.sel) Gfx.cursor(50, y + 3);
      });
      Gfx.window(4, 218, 312, 66);
      Gfx.text(this.forced ? "つぎの魔物を えらぼう!" : "だれに こうたいする?", 14, 232);
    }
  }
}
