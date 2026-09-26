// ============================================================
// アルカナダンジョン - 戦闘 (パーティ さいだい4にん vs てき さいだい3たい)
// たたかう / とくぎ (ジョブわざ + サブスキル) / どうぐ / ぼうぎょ / にげる
// ============================================================

function rnd(a, b) { return a + Math.random() * (b - a); }

// てきの インスタンスを つくる
function makeEnemy(id, lv) {
  const d = DATA.enemies[id];
  const n = lv - 1;
  return {
    id, name: d.name, spr: d.spr, lv,
    maxhp: Math.round(d.base.hp + d.growth.hp * n),
    atk: Math.round(d.base.atk + d.growth.atk * n),
    def: Math.round(d.base.def + d.growth.def * n),
    agi: Math.round(d.base.agi + d.growth.agi * n),
    hp: 0, guard: false,
  };
}

class BattleScene {
  // opts: { wild: [{id, lv}, ...] }, onWin
  constructor(opts = {}) {
    this.opaque = true;
    this.opts = opts;
    this.onWin = opts.onWin || null;

    this.enemies = opts.wild.map((e) => {
      const em = makeEnemy(e.id, e.lv);
      em.hp = em.maxhp;
      return em;
    });
    this.party = G.state.party;
    this.finished = false;
    this.resolved = false;
    this.escaped = false;

    this.phase = "msg";     // msg / command / skill / item / target
    this.sel = 0;
    this.queue = [];        // { text, fn } の れつ。A で すすめる
    this.chars = 0;
    this.cur = null;
    this.pending = null;

    this.round = 0;
    this.order = [];        // このラウンドの こうどうじゅんばん
    this.orderIdx = 0;
    this.actorIdx = null;   // げんざい めいれいちゅうの パーティいちインデックス

    const names = this.enemies.map((e) => e.name).join("、");
    this.say(`${names}が あらわれた!`);
    this.flush("newRound");

    AudioSys.bgm(this.enemies.some((e) => DATA.enemies[e.id].boss) ? "boss" : "battle");
  }

  // ---------------- メッセージキュー ----------------
  say(text, fn) { this.pending = this.pending || []; this.pending.push({ text, fn }); }
  flush(nextPhase) {
    this.queue = (this.pending || []).concat(this.queue);
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
      if (this.afterQueue === "newRound") { this.startRound(); return; }
      if (this.afterQueue === "nextActor") { this.nextActor(); return; }
      this.phase = this.afterQueue || "command";
      this.sel = 0;
      return;
    }
    this.cur = this.queue.shift();
    this.chars = 0;
    if (this.cur.fn) this.cur.fn();
  }

  // ---------------- ラウンド すすこう ----------------
  aliveParty() { return this.party.filter((h) => h.hp > 0); }
  aliveEnemies() { return this.enemies.filter((e) => e.hp > 0); }

  startRound() {
    this.round++;
    const actors = [];
    this.party.forEach((h, i) => { if (h.hp > 0) actors.push({ side: "party", i, agi: G.agiOf(h) }); });
    this.enemies.forEach((e, i) => { if (e.hp > 0) actors.push({ side: "enemy", i, agi: e.agi + Math.random() * 0.01 }); });
    actors.sort((a, b) => b.agi - a.agi);
    this.order = actors;
    this.orderIdx = 0;
    this.party.forEach((h) => { h._guard = false; });
    this.nextActor();
  }

  nextActor() {
    if (this.checkEnd()) return;
    while (this.orderIdx < this.order.length) {
      const a = this.order[this.orderIdx++];
      if (a.side === "party") {
        const h = this.party[a.i];
        if (h.hp <= 0) continue;
        if (h.paralyze && Math.random() < 0.25) {
          this.say(`${h.name}は からだが しびれて うごけない!`);
          this.flush("nextActor");
          return;
        }
        this.actorIdx = a.i;
        this.phase = "command";
        this.sel = 0;
        return;
      } else {
        const e = this.enemies[a.i];
        if (e.hp <= 0) continue;
        this.enemyAct(e);
        return;
      }
    }
    this.flush("newRound");
  }

  // resolved: しょうはいが きまった しゅんかんに たつ (finished は シーンが
  // とじるまで false のまま。テストの メッセージおくり ヘルパーが とちゅうで
  // とまらないように するため)
  checkEnd() {
    if (this.resolved) return true;
    if (this.aliveEnemies().length === 0) {
      this.resolved = true;
      this.winBattle();
      return true;
    }
    if (this.aliveParty().length === 0) {
      this.resolved = true;
      this.say("パーティは ぜんめつ してしまった……");
      this.flush("lose");
      return true;
    }
    return false;
  }

  // ---------------- こうげき/わざ の けいさん ----------------
  physDmg(atk, def) { return Math.max(1, Math.round(atk - def * 0.5 + rnd(-1, 2))); }
  magicDmg(intPow, mod) { return Math.max(1, Math.round(intPow * mod * rnd(0.9, 1.1))); }

  targetEnemy() { const a = this.aliveEnemies(); return a[Math.floor(Math.random() * a.length)]; }

  // ---------------- パーティの こうどう ----------------
  doAttack(h, target) {
    const dmg = this.physDmg(G.atkOf(h), target.def);
    this.say(`${h.name}の こうげき!`, () => AudioSys.sfx("hit"));
    this.say(null, () => {
      target.hp = Math.max(0, target.hp - dmg);
    });
    this.say(`${target.name}に ${dmg}の ダメージ!`);
    if (target.hp <= 0) this.say(`${target.name}を たおした!`, () => AudioSys.sfx("dead"));
    this.flush("nextActor");
  }

  doSkill(h, skillId, target) {
    const sk = DATA.skills[skillId];
    if (h.mp < sk.mp) { AudioSys.sfx("buzz"); return; }
    h.mp -= sk.mp;
    this.say(`${h.name}の ${sk.name}!`, () => AudioSys.sfx(sk.kind === "magic" ? "magic" : sk.kind === "heal" ? "heal" : "hit"));
    if (sk.kind === "atk") {
      const hits = sk.hits || 1;
      let total = 0;
      for (let n = 0; n < hits; n++) {
        if (target.hp <= 0) break;
        const dmg = this.physDmg(Math.round(G.atkOf(h) * sk.pow), target.def);
        target.hp = Math.max(0, target.hp - dmg);
        total += dmg;
      }
      this.say(null, () => {});
      this.say(`${target.name}に ${total}の ダメージ!`);
      if (target.hp <= 0) this.say(`${target.name}を たおした!`, () => AudioSys.sfx("dead"));
    } else if (sk.kind === "magic") {
      const targets = sk.target === "all_enemy" ? this.aliveEnemies() : [target];
      this.say(null, () => {});
      for (const t of targets) {
        const dmg = this.magicDmg(G.intOf(h) * sk.pow, 1);
        t.hp = Math.max(0, t.hp - dmg);
        this.say(`${t.name}に ${dmg}の ダメージ!`);
      }
      const dead = targets.filter((t) => t.hp <= 0);
      if (dead.length) this.say(dead.map((t) => t.name).join("と") + "を たおした!", () => AudioSys.sfx("dead"));
    } else if (sk.kind === "heal") {
      const targets = (sk.target === "all_ally" ? this.aliveParty() : [target]).filter((t) => t.hp > 0);
      this.say(null, () => {});
      for (const t of targets) {
        const heal = G.calcHeal(h, sk);
        t.hp = Math.min(t.maxhp, t.hp + heal);
        this.say(`${t.name}の HPが ${heal} かいふく!`);
      }
    } else if (sk.kind === "revive") {
      if (target.hp > 0) { this.say("すでに いきている。"); }
      else {
        target.hp = Math.max(1, Math.round(target.maxhp * sk.pow));
        this.say(`${target.name}は いきかえった!`, () => AudioSys.sfx("levelup"));
      }
    }
    this.flush("nextActor");
  }

  doDefend(h) {
    h._guard = true;
    this.say(`${h.name}は みをまもっている。`);
    this.flush("nextActor");
  }

  doItem(h, itemId, target) {
    const it = DATA.items[itemId];
    G.removeItem(itemId);
    this.say(`${h.name}は ${it.name}を つかった!`, () => AudioSys.sfx("heal"));
    if (it.heal) { target.hp = Math.min(target.maxhp, target.hp + it.heal); this.say(`${target.name}の HPが ${it.heal} かいふく!`); }
    if (it.mpheal) { target.mp = Math.min(target.maxmp, target.mp + it.mpheal); this.say(`${target.name}の MPが ${it.mpheal} かいふく!`); }
    if (it.cure === "poison") { target.poison = false; this.say(`${target.name}の どくが なおった!`); }
    if (it.cure === "paralyze") { target.paralyze = false; this.say(`${target.name}の まひが なおった!`); }
    this.flush("nextActor");
  }

  doFlee() {
    const myAgi = this.aliveParty().reduce((s, h) => s + G.agiOf(h), 0) / Math.max(1, this.aliveParty().length);
    const enAgi = this.aliveEnemies().reduce((s, e) => s + e.agi, 0) / Math.max(1, this.aliveEnemies().length);
    const chance = Math.max(0.3, Math.min(0.95, 0.6 + (myAgi - enAgi) / 40));
    if (Math.random() < chance) {
      this.escaped = true;
      this.say("うまく にげきれた!");
      this.flush("end");
    } else {
      this.say("しかし にげられない!");
      this.flush("nextActor");
    }
  }

  // ---------------- てきの こうどう ----------------
  enemyAct(e) {
    const targets = this.aliveParty();
    if (targets.length === 0) return;
    const t = targets[Math.floor(Math.random() * targets.length)];
    const dmg = this.physDmg(e.atk, G.defOf(t) * (t._guard ? 2 : 1));
    this.say(`${e.name}の こうげき!`, () => AudioSys.sfx("hit"));
    this.say(null, () => { t.hp = Math.max(0, t.hp - dmg); });
    this.say(`${t.name}に ${dmg}の ダメージ!`);
    if (t.hp <= 0) this.say(`${t.name}は たおれた!`, () => AudioSys.sfx("dead"));
    this.flush("nextActor");
  }

  // ---------------- しゅうりょう しょり ----------------
  winBattle() {
    const totalExp = this.enemies.reduce((s, e) => s + DATA.enemies[e.id].exp, 0);
    const totalSp = this.enemies.reduce((s, e) => s + DATA.enemies[e.id].sp, 0);
    const totalGold = this.enemies.reduce((s, e) => s + (DATA.enemies[e.id].gold || 0), 0);
    this.say("せんとうに かった!");
    this.say(`けいけんち ${totalExp}、SP ${totalSp}を えた!`);
    if (totalGold) { G.gainGold(totalGold); this.say(`${totalGold}ギルを てにいれた!`); }
    for (const h of this.party) {
      if (h.hp <= 0) continue;
      const msgs = G.addExp(h, totalExp);
      msgs.forEach((m) => this.say(m, () => AudioSys.sfx("levelup")));
      const spMsgs = G.addSp(h, totalSp);
      spMsgs.forEach((m) => this.say(m, () => AudioSys.sfx("levelup")));
    }
    this.flush("end");
  }

  endBattle() {
    if (this.finished) return;
    this.finished = true;
    G.pop();
    if (this.onWin && !this.escaped) this.onWin();
  }

  loseBattle() {
    if (this.finished) return;
    this.finished = true;
    G.fade(() => {
      G.state.gold = Math.floor(G.state.gold / 2);
      const ng = DATA.newGame;
      G.state.map = ng.gameOverMap || ng.map;
      G.state.x = ng.gameOverX ?? ng.x;
      G.state.y = ng.gameOverY ?? ng.y;
      G.state.dir = "d";
      this.party.forEach((h) => { h.hp = h.maxhp; h.mp = h.maxmp; h.poison = false; h.paralyze = false; });
      G.scenes = G.scenes.filter((s) => s instanceof FieldScene);
      const f = G.scenes.find((s) => s instanceof FieldScene);
      if (f) f.loadMap();
      else G.push(new FieldScene());
      G.push(new MessageScene("目が さめると……ギルドの ちかくに\n横たわっていた。ギルドが 半分\nもちさられていた……"));
    });
  }

  // ---------------- にゅうりょく ----------------
  update(dt) {
    if (this.phase === "msg") {
      this.chars += dt * 50;
      if (this.cur && this.cur.text == null) { this.advance(); return; }
      if (Input.tap("a") || Input.tap("b")) {
        if (this.cur && this.chars < this.cur.text.length) this.chars = this.cur.text.length;
        else this.advance();
      }
      return;
    }
    if (this.phase === "command") { this.updCommand(); return; }
    if (this.phase === "skill") { this.updSkill(); return; }
    if (this.phase === "item") { this.updItem(); return; }
    if (this.phase === "target") { this.updTarget(); return; }
  }

  updCommand() {
    const opts = ["たたかう", "とくぎ", "どうぐ", "ぼうぎょ", "にげる"];
    if (Input.tap("up")) { this.sel = (this.sel + opts.length - 1) % opts.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % opts.length; AudioSys.sfx("cursor"); }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      const pick = opts[this.sel];
      const h = this.party[this.actorIdx];
      if (pick === "たたかう") { this.pendingAction = "atk"; this.phase = "target"; this.targetSide = "enemy"; this.sel = 0; }
      else if (pick === "とくぎ") {
        this.skillList = G.usableSkillsOf(h);
        if (this.skillList.length === 0) { AudioSys.sfx("buzz"); return; }
        this.phase = "skill"; this.sel = 0;
      } else if (pick === "どうぐ") {
        this.itemList = Object.keys(G.state.items).filter((id) => DATA.items[id].kind === "use");
        if (this.itemList.length === 0) { AudioSys.sfx("buzz"); return; }
        this.phase = "item"; this.sel = 0;
      } else if (pick === "ぼうぎょ") { this.doDefend(h); }
      else if (pick === "にげる") { this.doFlee(); }
    }
  }

  updSkill() {
    const list = this.skillList;
    if (Input.tap("up")) { this.sel = (this.sel + list.length - 1) % list.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % list.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.phase = "command"; this.sel = 0; return; }
    if (Input.tap("a")) {
      const skillId = list[this.sel];
      const sk = DATA.skills[skillId];
      const h = this.party[this.actorIdx];
      if (h.mp < sk.mp) { AudioSys.sfx("buzz"); return; }
      AudioSys.sfx("confirm");
      this.pendingAction = "skill";
      this.pendingSkill = skillId;
      if (sk.kind === "heal" || sk.kind === "revive") { this.targetSide = "ally"; }
      else { this.targetSide = "enemy"; }
      if (sk.target === "all_enemy" || sk.target === "all_ally") {
        // ぜんたいわざは ターゲットせんたく なしで そのまま はつどう
        const h2 = this.party[this.actorIdx];
        this.doSkill(h2, skillId, sk.target === "all_enemy" ? this.aliveEnemies()[0] : this.aliveParty()[0]);
        return;
      }
      this.phase = "target"; this.sel = 0;
    }
  }

  updItem() {
    const list = this.itemList;
    if (list.length === 0) { this.phase = "command"; return; }
    if (Input.tap("up")) { this.sel = (this.sel + list.length - 1) % list.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % list.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.phase = "command"; this.sel = 0; return; }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      this.pendingAction = "item";
      this.pendingItem = list[this.sel];
      this.targetSide = "ally";
      this.phase = "target"; this.sel = 0;
    }
  }

  // あいてがわの ターゲットいちらん (heal系は いきているひとだけ、revive系は たおれたひとだけ)
  allyTargets() {
    const sk = this.pendingSkill && DATA.skills[this.pendingSkill];
    if (sk && sk.kind === "revive") {
      const down = this.party.filter((h) => h.hp <= 0);
      return down.length ? down : this.party.filter((h) => h.hp > 0);
    }
    const alive = this.party.filter((h) => h.hp > 0);
    return alive.length ? alive : this.party;
  }

  updTarget() {
    const realList = this.targetSide === "enemy" ? this.aliveEnemies() : this.allyTargets();
    if (realList.length === 0) { this.phase = "command"; this.sel = 0; return; }
    if (this.sel >= realList.length) this.sel = 0;
    if (Input.tap("up")) { this.sel = (this.sel + realList.length - 1) % realList.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % realList.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) {
      AudioSys.sfx("cancel");
      this.phase = this.pendingAction === "atk" ? "command" : this.pendingAction === "item" ? "item" : "skill";
      this.sel = 0;
      return;
    }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      const target = realList[this.sel];
      const h = this.party[this.actorIdx];
      if (this.pendingAction === "atk") this.doAttack(h, target);
      else if (this.pendingAction === "skill") this.doSkill(h, this.pendingSkill, target);
      else if (this.pendingAction === "item") this.doItem(h, this.pendingItem, target);
      this.pendingAction = null; this.pendingSkill = null; this.pendingItem = null;
    }
  }

  // ---------------- びょうが ----------------
  draw() {
    Gfx.clear(0);
    const c = Gfx.ctx;
    c.fillStyle = PAL[1];
    c.fillRect(0, 0, SCREEN_W, 150);

    // てき
    this.enemies.forEach((e, i) => {
      const x = 60 + i * 90, y = 40;
      if (e.hp > 0) {
        Gfx.draw(e.spr, x, y, { scale: 2.4 });
        Gfx.bar(x, y + 62, 58, 6, e.hp / e.maxhp, 3);
        Gfx.text(e.name, x, y + 70, 3, 9);
      }
    });

    // パーティ ステータス
    Gfx.window(4, 152, 312, 64);
    this.party.forEach((h, i) => {
      const x = 12 + (i % 2) * 154, y = 158 + Math.floor(i / 2) * 28;
      const jname = DATA.jobs[h.cls].name;
      const dead = h.hp <= 0;
      Gfx.text(`${h.name}(${jname})`, x, y, dead ? 1 : 3, 10);
      Gfx.text(`HP${h.hp}/${h.maxhp}`, x, y + 12, dead ? 1 : 2, 9);
      Gfx.textR(`MP${h.mp}/${h.maxmp}`, x + 148, y + 12, dead ? 1 : 2, 9);
      if (this.actorIdx === i && (this.phase === "command" || this.phase === "skill" || this.phase === "item")) {
        Gfx.cursor(x - 8, y + 3);
      }
    });

    // した: メッセージ/コマンド
    Gfx.window(4, 218, 312, 66);
    if (this.phase === "msg" && this.cur && this.cur.text != null) {
      const shown = this.cur.text.slice(0, Math.floor(this.chars));
      shown.split("\n").forEach((l, i) => { if (i < 3) Gfx.text(l, 14, 228 + i * 17); });
      if (this.chars >= this.cur.text.length && Math.floor(performance.now() / 300) % 2 === 0) {
        Gfx.cursor(300, 268);
      }
    } else if (this.phase === "command") {
      const opts = ["たたかう", "とくぎ", "どうぐ", "ぼうぎょ", "にげる"];
      opts.forEach((o, i) => {
        const y = 226 + i * 15;
        Gfx.text(o, 30, y, 3, 11);
        if (i === this.sel) Gfx.cursor(16, y + 2);
      });
    } else if (this.phase === "skill") {
      const h = this.party[this.actorIdx];
      this.skillList.forEach((id, i) => {
        const sk = DATA.skills[id];
        const y = 226 + i * 15;
        const usable = h.mp >= sk.mp;
        Gfx.text(sk.name, 30, y, usable ? 3 : 1, 10);
        Gfx.textR(`MP${sk.mp}`, 300, y, usable ? 2 : 1, 9);
        if (i === this.sel) Gfx.cursor(16, y + 2);
      });
    } else if (this.phase === "item") {
      this.itemList.forEach((id, i) => {
        const it = DATA.items[id];
        const y = 226 + i * 15;
        const n = G.state.items[id] || 0;
        Gfx.text(it.name, 30, y, 3, 10);
        Gfx.textR(`x${n}`, 300, y, 2, 9);
        if (i === this.sel) Gfx.cursor(16, y + 2);
      });
    } else if (this.phase === "target") {
      if (this.targetSide === "enemy") {
        Gfx.text("だれを ねらう?", 16, 226, 3, 11);
        this.aliveEnemies().forEach((e, i) => {
          const y = 240 + i * 14;
          Gfx.text(e.name, 30, y, 3, 10);
          if (i === this.sel) Gfx.cursor(16, y + 2);
        });
      } else {
        Gfx.text("だれに つかう?", 16, 226, 3, 11);
        this.allyTargets().forEach((h, i) => {
          const y = 240 + i * 14;
          Gfx.text(`${h.name} HP${h.hp}/${h.maxhp}`, 30, y, h.hp > 0 ? 3 : 1, 10);
          if (i === this.sel) Gfx.cursor(16, y + 2);
        });
      }
    }
  }
}
