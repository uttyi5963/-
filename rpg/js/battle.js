// ============================================================
// クリスタルナイツ - ATBバトル (FF4スタイル アクティブタイムバトル)
// ・アクティブ: コマンド選択中も時間は流れる
// ・ウェイト: コマンド選択中は時間が完全に停止する
// ・じゅもんには えいしょう時間があり、完了時に発動する
// ============================================================

function rnd(a, b) { return a + Math.random() * (b - a); }

class BattleScene {
  constructor(groupIds, opts = {}) {
    this.opaque = true;
    this.opts = opts;
    this.boss = !!opts.boss;
    this.waitMode = !G.state.config || G.state.config.atbWait !== false;

    // てき生成 (おなじしゅるいには A,B,C…)
    const counts = {};
    groupIds.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
    const seen = {};
    this.enemies = groupIds.map((id) => {
      const def = DATA.monsters[id];
      let name = def.name;
      if (counts[id] > 1) {
        seen[id] = (seen[id] || 0);
        name += "ABCD"[seen[id]++];
      }
      G.recordSeen(id);
      return {
        id, def, name,
        hp: def.hp, maxhp: def.hp,
        atb: rnd(0, 50), dead: false,
        casting: null, flash: 0,
      };
    });

    this.party = G.state.party.map((h) => ({
      h, atb: rnd(20, 60), defending: false, protect: false,
      casting: null, flash: 0,
      airborne: null,   // ジャンプちゅう {t, dur, target, double}
      jumpCount: 0,     // 2かいめからは ダブルジャンプ
      charge: 0,        // ためる (0..3) → こうげき 2/4/8ばい
      coverIdx: -1,     // かばっている なかまの ばんごう
    }));

    this.phase = "intro";   // intro / atb / command / waitend
    this.introT = 0;
    this.ready = null;      // コマンドにゅうりょくちゅうの プレイヤー
    this.readyQueue = [];
    this.menu = "root";
    this.sel = 0; this.sel2 = 0; this.targetSel = 0;
    this.anim = null;
    this.log = "";
    this.pops = [];
    this.shadowActs = 0;
    this.fleeing = false;
    this.shake = 0;        // がめんゆれ (おおダメージ/かいしん)
    this.screenFlash = 0;  // まほうはつどうの ひかり
    this.fx = [];          // ヒットエフェクト {x,y,kind,t}
    this.bgTheme = this.pickBgTheme();

    AudioSys.bgm(opts.music || "battle");
  }

  // げんざいの マップから せんとうはいけいを きめる
  pickBgTheme() {
    const m = String(G.state.map || "");
    if (/^icecave/.test(m)) return "ice";
    if (/^magma/.test(m)) return "fire";
    if (/^(cave|waterway|underworld)/.test(m)) return "cave";
    if (/^(tower|startower|skyisland)/.test(m)) return "tower";
    if (/^(temple|shrine|windtemple|seatemple)/.test(m)) return "temple";
    if (/^seafloor/.test(m)) return "sea";
    if (/^(world|lostwoods)/.test(m)) return "grass";
    return "interior";
  }

  // ---------------- ユーティリティ ----------------
  aliveEnemies() { return this.enemies.filter((e) => !e.dead); }
  aliveParty() { return this.party.filter((p) => p.h.hp > 0); }

  restoreBgm() {
    const m = DATA.maps[G.state.map];
    if (m && m.bgm) AudioSys.bgm(m.bgm);
    else AudioSys.stopBgm();
  }

  // 属性倍率: きゅうしゅう=-1(かいふく) / たいせい=0.5 / じゃくてん=8ばい
  elemMod(def, elem) {
    if (!elem) return 1;
    if ((def.absorb || []).includes(elem)) return -1;
    if ((def.resist || []).includes(elem)) return 0.5;
    if ((def.weak || []).includes(elem)) return 8;
    return 1;
  }

  // ぶきの属性 + しゅぞくとっこう(8ばい) をあわせた倍率
  weaponMod(h, def) {
    const w = DATA.items[h.weapon] || {};
    let m = this.elemMod(def, w.elem);
    if (w.slay && def.race && w.slay.includes(def.race)) m = Math.max(m, 8);
    return m;
  }

  physDmg(atk, def) {
    return Math.max(1, Math.round(atk * 2 * rnd(0.9, 1.1)) - def);
  }

  pop(x, y, txt, pi = 3) {
    this.pops.push({ x, y, txt: String(txt), t: 0, pi });
  }

  enemyPos(i) {
    const e = this.enemies[i];
    const scale = (e.def.scale || 2);
    const size = 16 * scale;
    if (this.enemies.length === 1) {
      return { x: 60 - size / 2 + 16, y: 96 - size / 2, size, scale };
    }
    return { x: 28 + (i % 2) * 14, y: 40 + i * 44, size, scale };
  }

  partyPos(i) {
    const n = this.party.length;
    const gap = n <= 3 ? 50 : 34;
    const y0 = n <= 3 ? 26 : 14;
    const p = this.party[i];
    const x = p && p.h.row === "back" ? 262 : 246;
    return { x, y: y0 + i * gap, size: 32 };
  }

  // ---------------- こうしん ----------------
  update(dt) {
    this.pops = this.pops.filter((p) => (p.t += dt) < 0.9);
    this.fx = this.fx.filter((f) => (f.t += dt) < 0.32);
    this.enemies.forEach((e) => { if (e.flash > 0) e.flash -= dt; });
    this.party.forEach((p) => { if (p.flash > 0) p.flash -= dt; });
    if (this.shake > 0) this.shake -= dt;
    if (this.screenFlash > 0) this.screenFlash -= dt;

    if (this.phase === "intro") {
      this.introT += dt;
      if (this.introT > 0.7) { this.phase = "atb"; this.log = ""; }
      return;
    }
    if (this.phase === "waitend") return;

    // アニメさいちゅうは 時間停止 (こうどうは 1つずつ)
    if (this.anim) {
      const a = this.anim;
      a.t += dt;
      while (a.fired < a.events.length && a.events[a.fired].t <= a.t) {
        a.events[a.fired++].fn();
      }
      if (a.t >= a.dur) {
        this.anim = null;
        this.afterAction();
      }
      return;
    }

    // ウェイトモード: コマンドにゅうりょくちゅうは 時間がかんぜんに とまる
    const waitPause = this.waitMode && this.phase === "command";

    if (!waitPause) {
      // ATBゲージ (えいしょう/ジャンプちゅうは たまらない)
      for (const p of this.aliveParty()) {
        if (!p.casting && !p.airborne) p.atb = Math.min(100, p.atb + (25 + p.h.agi * 3) * dt);
      }
      for (const e of this.aliveEnemies()) {
        if (!e.casting) e.atb = Math.min(100, e.atb + (25 + e.def.agi * 3) * dt);
      }

      // えいしょう進行 → 完了で発動
      for (const p of this.aliveParty()) {
        if (p.casting && (p.casting.t += dt) >= p.casting.dur) {
          const act = p.casting.act;
          p.casting = null;
          this.execSpell(p, act, false);
          return;
        }
      }
      // ジャンプ滞空 → 落下攻撃
      for (const p of this.aliveParty()) {
        if (p.airborne && (p.airborne.t += dt) >= p.airborne.dur) {
          this.resolveJump(p);
          return;
        }
      }
      for (const e of this.aliveEnemies()) {
        if (e.casting && (e.casting.t += dt) >= e.casting.dur) {
          const sp = e.casting.spell;
          e.casting = null;
          this.execEnemySpell(e, sp);
          return;
        }
      }

      // てきのターン (コマンド選択中でも おかまいなし)
      const e = this.aliveEnemies().find((e) => e.atb >= 100 && !e.casting);
      if (e) {
        this.enemyAct(e);
        if (this.anim) return;
      }

      // プレイヤーのターンまち
      for (const p of this.aliveParty()) {
        if (p.atb >= 100 && !p.casting && !p.airborne && p !== this.ready && !this.readyQueue.includes(p)) {
          this.readyQueue.push(p);
        }
      }
    }

    if (this.phase === "command") {
      if (!this.ready || this.ready.h.hp <= 0) {
        this.ready = null;
        this.phase = "atb";
        return;
      }
      this.updateCommand();
      return;
    }

    // つぎのコマンドにゅうりょく者
    while (this.readyQueue.length) {
      const p = this.readyQueue.shift();
      if (p.h.hp <= 0) continue;
      this.ready = p;
      p.defending = false;
      if (this.poisonTick(p)) { this.ready = null; return; }
      this.phase = "command";
      this.menu = "root";
      this.sel = 0;
      AudioSys.sfx("cursor");
      return;
    }
  }

  // どくの ターンあたまダメージ。しんだら true
  poisonTick(p) {
    if (!p.h.poison || p.h.hp <= 0) return false;
    const d = Math.max(1, Math.floor(p.h.maxhp / 16));
    p.h.hp = Math.max(0, p.h.hp - d);
    const pos = this.partyPos(this.party.indexOf(p));
    this.pop(pos.x, pos.y, d, 2);
    if (p.h.hp <= 0) {
      p.atb = 0;
      p.casting = null;
      this.log = `${p.h.name}は どくに たおれた…`;
      AudioSys.sfx("dead");
      this.checkEnd();
      return true;
    }
    return false;
  }

  // ---------------- コマンドにゅうりょく ----------------
  rootCommands() {
    const p = this.ready;
    const h = p.h;
    const cmds = [{ id: "fight", name: "たたかう" }];
    if (h.special === "dark") cmds.push({ id: "dark", name: "あんこく" });
    if (h.special === "holy") cmds.push({ id: "holy", name: "せいけん" });
    if (h.command === "jump") cmds.push({ id: "jump", name: p.jumpCount > 0 ? "ダブルジャンプ" : "ジャンプ" });
    if (h.command === "charge") cmds.push({ id: "charge", name: "ためる" });
    if (h.command === "pray") cmds.push({ id: "pray", name: "いのる" });
    if (h.command === "cover") cmds.push({ id: "cover", name: "かばう" });
    if (h.spells.length > 0) cmds.push({ id: "spell", name: "じゅもん" });
    cmds.push({ id: "guard", name: "ぼうぎょ" });
    cmds.push({ id: "item", name: "どうぐ" });
    cmds.push({ id: "run", name: "にげる" });
    return cmds;
  }

  updateCommand() {
    if (this.menu === "root") {
      const cmds = this.rootCommands();
      if (Input.tap("up")) { this.sel = (this.sel + cmds.length - 1) % cmds.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel = (this.sel + 1) % cmds.length; AudioSys.sfx("cursor"); }
      if (Input.tap("a")) {
        const cmd = cmds[this.sel];
        AudioSys.sfx("confirm");
        const h = this.ready.h;
        if (cmd.id === "fight") { this.menu = "targetE"; this.targetSel = 0; this.pendingAct = { type: "fight" }; }
        else if (cmd.id === "dark") {
          const cost = Math.floor(h.maxhp / 8);
          if (h.hp <= cost) { AudioSys.sfx("buzz"); return; }
          this.doPlayerAction({ type: "dark" });
        }
        else if (cmd.id === "holy") {
          if (h.mp < 8) { AudioSys.sfx("buzz"); return; }
          this.menu = "targetE"; this.targetSel = 0; this.pendingAct = { type: "holy" };
        }
        else if (cmd.id === "jump") { this.menu = "targetE"; this.targetSel = 0; this.pendingAct = { type: "jump" }; }
        else if (cmd.id === "charge") {
          if (this.ready.charge >= 3) { AudioSys.sfx("buzz"); return; }
          this.doPlayerAction({ type: "charge" });
        }
        else if (cmd.id === "pray") this.doPlayerAction({ type: "pray" });
        else if (cmd.id === "cover") { this.menu = "targetP"; this.targetSel = 0; this.pendingAct = { type: "cover" }; }
        else if (cmd.id === "spell") {
          if (h.silence || h.toad) { AudioSys.sfx("buzz"); this.log = "こえが でない!"; return; }
          this.menu = "spell"; this.sel2 = 0;
        }
        else if (cmd.id === "guard") this.doPlayerAction({ type: "guard" });
        else if (cmd.id === "item") { this.menu = "item"; this.sel2 = 0; }
        else if (cmd.id === "run") this.doPlayerAction({ type: "run" });
      }
      return;
    }

    if (this.menu === "spell") {
      const spells = this.ready.h.spells.map((id) => ({ id, def: DATA.spells[id] }));
      if (Input.tap("up")) { this.sel2 = (this.sel2 + spells.length - 1) % spells.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel2 = (this.sel2 + 1) % spells.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.menu = "root"; return; }
      if (Input.tap("a")) {
        const sp = spells[this.sel2];
        if (this.ready.h.mp < sp.def.mp) { AudioSys.sfx("buzz"); return; }
        AudioSys.sfx("confirm");
        this.pendingAct = { type: "spell", spell: sp };
        if (sp.def.target === "enemy") {
          if (sp.def.all) this.doPlayerAction(this.pendingAct);
          else { this.menu = "targetE"; this.targetSel = 0; }
        } else {
          this.menu = "targetP"; this.targetSel = 0;
        }
      }
      return;
    }

    if (this.menu === "item") {
      const items = itemList().filter((it) => it.def.kind === "use");
      if (items.length === 0) {
        if (Input.tap("a") || Input.tap("b")) { AudioSys.sfx("cancel"); this.menu = "root"; }
        return;
      }
      if (Input.tap("up")) { this.sel2 = (this.sel2 + items.length - 1) % items.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel2 = (this.sel2 + 1) % items.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.menu = "root"; return; }
      if (Input.tap("a")) {
        AudioSys.sfx("confirm");
        this.pendingAct = { type: "item", item: items[Math.min(this.sel2, items.length - 1)] };
        this.menu = "targetP"; this.targetSel = 0;
      }
      return;
    }

    if (this.menu === "targetE") {
      const es = this.aliveEnemies();
      if (es.length === 0) { this.menu = "root"; return; }
      if (Input.tap("up") || Input.tap("left")) { this.targetSel = (this.targetSel + es.length - 1) % es.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down") || Input.tap("right")) { this.targetSel = (this.targetSel + 1) % es.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.menu = this.pendingAct.type === "spell" ? "spell" : "root"; return; }
      if (Input.tap("a")) {
        AudioSys.sfx("confirm");
        this.pendingAct.target = es[Math.min(this.targetSel, es.length - 1)];
        this.doPlayerAction(this.pendingAct);
      }
      return;
    }

    if (this.menu === "targetP") {
      if (Input.tap("up") || Input.tap("left")) { this.targetSel = (this.targetSel + this.party.length - 1) % this.party.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down") || Input.tap("right")) { this.targetSel = (this.targetSel + 1) % this.party.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) {
        AudioSys.sfx("cancel");
        this.menu = this.pendingAct.type === "item" ? "item"
          : this.pendingAct.type === "cover" ? "root" : "spell";
        return;
      }
      if (Input.tap("a")) {
        const t = this.party[this.targetSel];
        // ジャンプちゅうの なかまは えらべない / かばうは じぶんいがいの いきているなかま
        if (t.airborne ||
            (this.pendingAct.type === "cover" && (t === this.ready || t.h.hp <= 0))) {
          AudioSys.sfx("buzz");
          return;
        }
        AudioSys.sfx("confirm");
        this.pendingAct.targetP = t;
        this.doPlayerAction(this.pendingAct);
      }
      return;
    }
  }

  // てきに あたえるダメージを イベントれつに つむ (dmg<0 は きゅうしゅう=かいふく)
  queueHitEnemy(events, target, dmg, sfx = "hit") {
    events.push({ t: 0.4, fn: () => {
      if (target.dead) { this.log += "  しかし てきは いない!"; return; }
      const pos = this.enemyPos(this.enemies.indexOf(target));
      if (dmg < 0) {
        target.hp = Math.min(target.maxhp, target.hp - dmg);
        AudioSys.sfx("heal");
        this.pop(pos.x + pos.size / 2, pos.y, -dmg, 1);
        this.log = `${target.name}は こうげきを きゅうしゅうした!`;
        return;
      }
      target.hp = Math.max(0, target.hp - dmg);
      target.flash = 0.25;
      AudioSys.sfx(sfx);
      this.pop(pos.x + pos.size / 2, pos.y, dmg);
      this.fx.push({ x: pos.x + pos.size / 2, y: pos.y + pos.size / 2, kind: sfx === "magic" ? "burst" : "slash", t: 0 });
      if (sfx === "crit" || dmg >= 100) this.shake = 0.25;
      if (sfx === "magic") this.screenFlash = 0.15;
      // しれんボス: きずは ふさがる
      if (target.def.trial && target.hp < target.maxhp) {
        target.hp = target.maxhp;
        this.log = "『やみは ちからでは はらえぬ……』\nかげの きずが ふさがっていく!";
      }
    } });
  }

  // ---------------- プレイヤーのこうどう ----------------
  doPlayerAction(act) {
    const p = this.ready;
    const h = p.h;
    p.atb = 0;

    // えいしょうが ひつような じゅもん
    if (act.type === "spell") {
      const sp = act.spell.def;
      if (h.silence || h.toad) {
        this.startAnim([{ t: 0, fn: () => { this.log = `${h.name}は こえが でない!`; AudioSys.sfx("buzz"); } }], 0.6);
        this.ready = null;
        this.phase = "atb";
        return;
      }
      if ((sp.cast || 0) > 0) {
        h.mp -= sp.mp;
        p.casting = { act, t: 0, dur: sp.cast };
        this.log = `${h.name}は ${sp.name}の えいしょうを はじめた`;
        AudioSys.sfx("cursor");
        this.ready = null;
        this.phase = "atb";
        return;
      }
      this.execSpell(p, act, true);
      this.ready = null;
      this.phase = "atb";
      return;
    }

    const events = [];
    let dur = 1.0;

    // 後列からの ぶつりこうげきは はんげん
    const rowMul = h.row === "back" ? 0.5 : 1;

    if (act.type === "fight") {
      const t = act.target;
      events.push({ t: 0, fn: () => { this.log = `${h.name}の こうげき!`; } });
      // くらやみ: めいちゅうりつ 50%
      const missChance = h.blind ? 0.5 : 0.05;
      if (Math.random() < missChance) {
        events.push({ t: 0.4, fn: () => {
          this.log = `${h.name}の こうげき! ミス!` + (h.blind ? "\n(くらやみで ねらいが さだまらない)" : "");
          AudioSys.sfx("cancel");
        } });
      } else if (h.toad) {
        // カエル: 1〜3の こていダメージ
        const dmg = 1 + Math.floor(rnd(0, 3));
        events.push({ t: 0.2, fn: () => { this.log = `${h.name}の カエルパンチ…`; } });
        this.queueHitEnemy(events, t, dmg, "hit");
      } else {
        const crit = Math.random() < 1 / 16;
        // ためる: 2/4/8ばい (つかったら リセット)
        const chargeMul = Math.pow(2, p.charge);
        if (p.charge > 0) {
          events.push({ t: 0.2, fn: () => { this.log = `ためたちからを かいほう! (${chargeMul}ばい)`; } });
          p.charge = 0;
        }
        let dmg = this.physDmg(G.atkOf(h), t.def.def);
        dmg = Math.max(1, Math.round(dmg * this.weaponMod(h, t.def) * (crit ? 2 : 1) * rowMul * chargeMul));
        if (crit) events.push({ t: 0.35, fn: () => { this.log = "かいしんの いちげき!!"; } });
        this.queueHitEnemy(events, t, dmg, crit || chargeMul > 1 ? "crit" : "hit");
      }
    }
    else if (act.type === "jump") {
      const double = p.jumpCount > 0;
      p.jumpCount++;
      p.airborne = { t: 0, dur: 2.2, target: act.target, double };
      p.defending = false;
      events.push({ t: 0, fn: () => {
        this.log = `${h.name}は ${double ? "にだんとびで " : ""}とびあがった!`;
        AudioSys.sfx("confirm");
      } });
      dur = 0.7;
    }
    else if (act.type === "charge") {
      p.charge = Math.min(3, p.charge + 1);
      events.push({ t: 0, fn: () => {
        this.log = `${h.name}は ちからを ためている! (ため${p.charge}: ${Math.pow(2, p.charge)}ばい)`;
        AudioSys.sfx("dark");
      } });
      dur = 0.6;
    }
    else if (act.type === "pray") {
      events.push({ t: 0, fn: () => { this.log = `${h.name}は てんに いのった……`; AudioSys.sfx("cursor"); } });
      events.push({ t: 0.6, fn: () => {
        if (Math.random() < 0.5) {
          this.log = "いのりが とどいた!";
          AudioSys.sfx("heal");
          this.aliveParty().forEach((q) => {
            const v = Math.max(1, Math.round(q.h.maxhp * 0.3));
            q.h.hp = Math.min(q.h.maxhp, q.h.hp + v);
            const pos = this.partyPos(this.party.indexOf(q));
            this.pop(pos.x, pos.y, v, 3);
          });
        } else {
          this.log = "……いのりは とどかなかった";
          AudioSys.sfx("cancel");
        }
      } });
      dur = 1.2;
    }
    else if (act.type === "cover") {
      const t = act.targetP;
      p.coverIdx = this.party.indexOf(t);
      events.push({ t: 0, fn: () => {
        this.log = `${h.name}は ${t.h.name}を かばう かまえだ!`;
        AudioSys.sfx("confirm");
      } });
      dur = 0.5;
    }
    else if (act.type === "dark") {
      const cost = Math.floor(h.maxhp / 8);
      events.push({ t: 0, fn: () => {
        this.log = `${h.name}の あんこく!`;
        h.hp = Math.max(1, h.hp - cost);
        AudioSys.sfx("dark");
      } });
      this.aliveEnemies().forEach((e) => {
        const dmg = Math.max(1, Math.round(this.physDmg(Math.round(G.atkOf(h) * 1.5), e.def.def) * rowMul));
        this.queueHitEnemy(events, e, dmg);
      });
      dur = 1.2;
    }
    else if (act.type === "holy") {
      const t = act.target;
      events.push({ t: 0, fn: () => {
        this.log = `${h.name}の せいけん!`;
        h.mp -= 8;
        AudioSys.sfx("magic");
      } });
      const mod = Math.max(this.elemMod(t.def, "holy"), this.weaponMod(h, t.def));
      const dmg = Math.max(1, Math.round(this.physDmg(Math.round(G.atkOf(h) * 1.6), t.def.def) * mod * rowMul));
      this.queueHitEnemy(events, t, dmg);
    }
    else if (act.type === "guard") {
      p.defending = true;
      events.push({ t: 0, fn: () => { this.log = `${h.name}は みをまもっている`; } });
      dur = 0.5;
    }
    else if (act.type === "run") {
      if (this.boss) {
        events.push({ t: 0, fn: () => { this.log = "にげられない!!"; AudioSys.sfx("buzz"); } });
      } else {
        const pAgi = this.aliveParty().reduce((s, q) => s + q.h.agi, 0) / this.aliveParty().length;
        const eAgi = this.aliveEnemies().reduce((s, q) => s + q.def.agi, 0) / this.aliveEnemies().length;
        const chance = Math.max(0.25, Math.min(0.9, 0.5 + (pAgi - eAgi) * 0.03));
        if (Math.random() < chance) {
          events.push({ t: 0, fn: () => { this.log = "うまく にげだした!"; AudioSys.sfx("confirm"); } });
          this.fleeing = true;
          dur = 0.8;
        } else {
          events.push({ t: 0, fn: () => { this.log = "にげられなかった!"; AudioSys.sfx("buzz"); } });
        }
      }
    }
    else if (act.type === "item") {
      const it = act.item;
      const t = act.targetP;
      events.push({ t: 0, fn: () => { this.log = `${h.name}は ${it.def.name}を つかった!`; } });
      events.push({ t: 0.45, fn: () => {
        const def = it.def;
        if (def.partyheal) {
          G.removeItem(it.id);
          this.aliveParty().forEach((q) => {
            q.h.hp = q.h.maxhp; q.h.mp = q.h.maxmp;
            Object.keys(DATA.statuses).forEach((s) => { q.h[s] = false; });
            const pos = this.partyPos(this.party.indexOf(q));
            this.pop(pos.x, pos.y, q.h.maxhp, 3);
          });
          this.log = "なかまぜんいんが かんぜんに かいふくした!";
          AudioSys.sfx("heal");
        } else if (def.elixir) {
          if (t.h.hp <= 0) { this.log = "しかし きかなかった!"; return; }
          G.removeItem(it.id);
          t.h.hp = t.h.maxhp;
          t.h.mp = t.h.maxmp;
          this.log = `${t.h.name}は かんぜんに かいふくした!`;
          AudioSys.sfx("heal");
        } else if (def.heal) {
          if (t.h.hp <= 0) { this.log = "しかし きかなかった!"; return; }
          G.removeItem(it.id);
          t.h.hp = Math.min(t.h.maxhp, t.h.hp + def.heal);
          const pos = this.partyPos(this.party.indexOf(t));
          this.pop(pos.x, pos.y, def.heal, 3);
          AudioSys.sfx("heal");
        } else if (def.mp) {
          if (t.h.hp <= 0) { this.log = "しかし きかなかった!"; return; }
          G.removeItem(it.id);
          t.h.mp = Math.min(t.h.maxmp, t.h.mp + def.mp);
          AudioSys.sfx("heal");
        } else if (def.revive) {
          if (t.h.hp > 0) { this.log = "しかし きかなかった!"; return; }
          G.removeItem(it.id);
          t.h.hp = Math.max(1, Math.floor(t.h.maxhp * def.revive));
          this.log = `${t.h.name}は いきかえった!`;
          AudioSys.sfx("heal");
        } else if (def.cure) {
          if (!t.h[def.cure]) { this.log = "しかし きかなかった!"; return; }
          G.removeItem(it.id);
          t.h[def.cure] = false;
          this.log = `${t.h.name}の ${DATA.statuses[def.cure].name}が なおった!`;
          AudioSys.sfx("heal");
        }
      } });
    }

    this.startAnim(events, dur);
    this.ready = null;
    this.phase = "atb";
  }

  // ジャンプの ちゃくち攻撃。ダブルジャンプは 2れんげき。列のえいきょうなし
  resolveJump(p) {
    const h = p.h;
    const double = p.airborne.double;
    let target = p.airborne.target;
    p.airborne = null;
    if (!target || target.dead) target = this.aliveEnemies()[0];
    const events = [];
    events.push({ t: 0, fn: () => {
      this.log = `${h.name}の ${double ? "ダブルジャンプ!!" : "ジャンプこうげき!"}`;
      AudioSys.sfx("crit");
    } });
    if (!target) {
      events.push({ t: 0.3, fn: () => { this.log += "\nしかし てきは いなかった!"; } });
      this.startAnim(events, 0.8);
      return;
    }
    const hits = double ? 2 : 1;
    const per = double ? 1.8 : 2.2;
    for (let i = 0; i < hits; i++) {
      const dmg = Math.max(1, Math.round(this.physDmg(Math.round(G.atkOf(h) * per), target.def.def)));
      this.queueHitEnemy(events, target, dmg, "crit");
      // 2げきめは すこし おくらせる
      if (i === 1) events[events.length - 1].t = 0.75;
    }
    this.startAnim(events, double ? 1.3 : 1.0);
  }

  // じゅもんの発動 (えいしょう完了 or 即時)。payMp=true なら ここでMPをはらう
  execSpell(p, act, payMp) {
    const h = p.h;
    const sp = act.spell.def;
    const events = [];

    events.push({ t: 0, fn: () => {
      this.log = `${h.name}は ${sp.name}を となえた!`;
      if (payMp) h.mp -= sp.mp;
      AudioSys.sfx(sp.type === "dmg" ? "magic" : "heal");
    } });

    if (sp.type === "dmg") {
      // 発動時点で ターゲットが たおれていたら 生きているてきに うちなおす
      let targets;
      if (sp.all) targets = this.aliveEnemies();
      else {
        let t = act.target;
        if (!t || t.dead) t = this.aliveEnemies()[0];
        targets = t ? [t] : [];
      }
      if (targets.length === 0) {
        events.push({ t: 0.4, fn: () => { this.log = "しかし てきは いなかった!"; } });
      }
      targets.forEach((e) => {
        const dmg = Math.round(sp.pow * (1 + G.intOf(h) / 16) * rnd(0.9, 1.1) * this.elemMod(e.def, sp.elem));
        this.queueHitEnemy(events, e, dmg, "magic");
      });
    } else {
      const t = act.targetP;
      events.push({ t: 0.45, fn: () => {
        if (sp.type === "heal") {
          if (t.h.hp <= 0) { this.log = "しかし きかなかった!"; return; }
          const v = G.calcHeal(h, sp);
          t.h.hp = Math.min(t.h.maxhp, t.h.hp + v);
          const pos = this.partyPos(this.party.indexOf(t));
          this.pop(pos.x, pos.y, v, 3);
        } else if (sp.type === "revive") {
          if (t.h.hp > 0) { this.log = "しかし きかなかった!"; return; }
          t.h.hp = Math.max(1, Math.floor(t.h.maxhp * sp.pow));
          this.log = `${t.h.name}は いきかえった!`;
        } else if (sp.type === "cure") {
          const sts = sp.cureAll ? Object.keys(DATA.statuses) : ["poison"];
          const had = sts.filter((s) => t.h[s]);
          if (t.h.hp <= 0 || had.length === 0) { this.log = "しかし きかなかった!"; return; }
          had.forEach((s) => { t.h[s] = false; });
          this.log = `${t.h.name}の ${had.map((s) => DATA.statuses[s].name).join("・")}が きえた!`;
        } else if (sp.type === "buff") {
          if (t.h.hp <= 0) { this.log = "しかし きかなかった!"; return; }
          t.protect = true;
          this.log = `${t.h.name}の ぼうぎょが あがった!`;
        }
      } });
    }

    this.startAnim(events, 1.0);
  }

  // ---------------- てきのこうどう ----------------
  enemyAct(e) {
    // ジャンプで たいくうちゅうの なかまは ねらえない
    const targets = this.aliveParty().filter((p) => !p.airborne);
    e.atb = 0;
    if (targets.length === 0) {
      this.log = `${e.name}は ようすを うかがっている`;
      return;
    }

    // おくびょうな てき(ミスリルけい)は にげることがある
    if (e.def.flees && Math.random() < e.def.flees) {
      e.dead = true;
      e.fled = true;
      e.casting = null;
      this.log = `${e.name}は にげだした!!`;
      AudioSys.sfx("cancel");
      this.checkEnd();
      return;
    }

    // しれんボス: 6かい こうどうしたら しずまる
    if (e.def.trial) this.shadowActs++;

    let spell = null;
    for (const a of (e.def.acts || [])) {
      if (Math.random() < a.rate) { spell = DATA.spells[a.spell]; break; }
    }

    if (spell) {
      if ((spell.cast || 0) > 0) {
        e.casting = { spell, t: 0, dur: spell.cast };
        this.log = `${e.name}は じゅもんを えいしょうしている……!`;
        return;
      }
      this.execEnemySpell(e, spell);
      return;
    }

    // ぶつりこうげき
    const events = [];
    let p = targets[Math.floor(Math.random() * targets.length)];

    // かばう: べつのなかまが みがわりになる (ぶつりのみ)
    const guardian = this.party.find((q) =>
      q !== p && q.h.hp > 0 && !q.airborne && q.coverIdx === this.party.indexOf(p));
    const covered = !!guardian;
    const victim = covered ? guardian : p;
    // カウンターは 50%
    const counter = covered && Math.random() < 0.5;

    events.push({ t: 0, fn: () => { this.log = `${e.name}の こうげき!`; } });
    events.push({ t: 0.45, fn: () => {
      if (victim.h.hp <= 0) return;
      let dmg = this.physDmg(e.def.atk, G.defOf(victim.h));
      if (covered) {
        // みがわり時は まもりをかため ダメージは かならず 1けた
        dmg = Math.max(1, Math.min(9, dmg));
        this.log = `${victim.h.name}が ${p.h.name}を かばった!`;
      } else {
        if (victim.h.row === "back") dmg = Math.round(dmg * 0.5);
        if (victim.defending) dmg = Math.round(dmg * 0.5);
        if (victim.protect) dmg = Math.round(dmg * 0.6);
        dmg = Math.max(1, dmg);
      }
      victim.h.hp = Math.max(0, victim.h.hp - dmg);
      victim.flash = 0.25;
      const pos = this.partyPos(this.party.indexOf(victim));
      this.pop(pos.x, pos.y, dmg, 2);
      this.fx.push({ x: pos.x + 16, y: pos.y + 16, kind: "slash", t: 0 });
      AudioSys.sfx("hit");
      // ついかこうか (どく/くらやみ など)。みがわり時は はつどうしない
      const inf = e.def.inflict || (e.def.poison ? { status: "poison", rate: e.def.poison } : null);
      if (!covered && inf && Math.random() < inf.rate && victim.h.hp > 0 && !victim.h[inf.status]) {
        victim.h[inf.status] = true;
        this.log = `${victim.h.name}は ${DATA.statuses[inf.status].name}に かかった!`;
      }
      if (victim.h.hp <= 0) {
        victim.atb = 0; victim.casting = null;
        this.log = `${victim.h.name}は たおれた!`;
        AudioSys.sfx("dead");
      }
    } });
    if (counter) {
      events.push({ t: 0.95, fn: () => {
        if (guardian.h.hp <= 0 || e.dead) return;
        this.log = `${guardian.h.name}の カウンター!`;
      } });
      const cdmg = Math.max(1, Math.round(this.physDmg(G.atkOf(guardian.h), e.def.def)));
      this.queueHitEnemy(events, e, cdmg, "crit");
      events[events.length - 1].t = 1.25;
    }
    this.startAnim(events, counter ? 1.7 : 1.0);
  }

  execEnemySpell(e, sp) {
    const targets = this.aliveParty().filter((p) => !p.airborne);
    if (targets.length === 0) return;
    const events = [];
    events.push({ t: 0, fn: () => {
      this.log = `${e.name}は ${sp.name}を となえた!`;
      AudioSys.sfx("magic");
    } });

    // じょうたいいじょう じゅもん
    if (sp.type === "status") {
      const p = targets[Math.floor(Math.random() * targets.length)];
      events.push({ t: 0.5, fn: () => {
        if (p.h.hp <= 0) return;
        if (p.h[sp.status]) { this.log = "しかし きかなかった!"; return; }
        p.h[sp.status] = true;
        p.flash = 0.25;
        this.log = `${p.h.name}は ${DATA.statuses[sp.status].name}に かかった!`;
        AudioSys.sfx("buzz");
      } });
      this.startAnim(events, 1.0);
      return;
    }
    const victims = sp.all ? targets : [targets[Math.floor(Math.random() * targets.length)]];
    victims.forEach((p) => {
      events.push({ t: 0.45, fn: () => {
        if (p.h.hp <= 0) return;
        let dmg = Math.round(sp.pow * (1 + (e.def.int || 8) / 16) * rnd(0.9, 1.1));
        if (p.defending) dmg = Math.round(dmg * 0.5);
        if (p.protect) dmg = Math.round(dmg * 0.7);
        dmg = Math.max(1, dmg);
        p.h.hp = Math.max(0, p.h.hp - dmg);
        p.flash = 0.25;
        const pos = this.partyPos(this.party.indexOf(p));
        this.pop(pos.x, pos.y, dmg, 2);
        this.fx.push({ x: pos.x + 16, y: pos.y + 16, kind: "burst", t: 0 });
        AudioSys.sfx("hit");
        if (p.h.hp <= 0) {
          p.atb = 0; p.casting = null;
          this.log = `${p.h.name}は たおれた!`;
          AudioSys.sfx("dead");
        }
      } });
    });
    this.startAnim(events, 1.0);
  }

  startAnim(events, dur) {
    events.sort((a, b) => a.t - b.t);
    this.anim = { events, dur, t: 0, fired: 0 };
  }

  // ---------------- こうどうごの しょり ----------------
  afterAction() {
    // てきの しぼう (くだけちる えんしゅつ)
    for (const e of this.enemies) {
      if (!e.dead && e.hp <= 0) {
        e.dead = true;
        e.casting = null;
        G.recordKill(e.id);
        AudioSys.sfx("dead");
        const pos = this.enemyPos(this.enemies.indexOf(e));
        for (let k = 0; k < 6; k++) {
          this.pop(pos.x + (k % 3) * pos.size / 2, pos.y + Math.floor(k / 3) * pos.size / 2, "・", 2);
        }
        if (e.def.boss) this.shake = 0.4;
      }
    }

    // コマンド中のキャラが たおされたら メニューをとじる
    if (this.ready && this.ready.h.hp <= 0) {
      this.ready = null;
      if (this.phase === "command") this.phase = "atb";
    }

    if (this.fleeing) {
      this.restoreBgm();
      G.pop();
      return;
    }

    // ぜんめつは しれんクリアや フェーズ2より ゆうせんで はんてい
    if (this.aliveParty().length === 0) {
      this.checkEnd();
      return;
    }

    // しれんボスクリア
    const trial = this.enemies.find((e) => e.def.trial);
    if (trial && this.shadowActs >= 6 && !trial.dead) {
      trial.dead = true;
      G.push(new MessageScene([
        "レオンは けっして けんを ぬかず\nやみを うけとめつづけた……。",
        "『……それでよい。やみを みとめ\nうけいれたとき ひとは ひかりを しる』",
        "かげは しずかに きえていった。",
      ], () => {
        this.restoreBgm();
        G.pop();
        if (this.opts.onWin) this.opts.onWin();
      }));
      this.phase = "waitend";
      return;
    }

    // フェーズ2ボス
    const phaser = this.enemies.find((e) => e.dead && e.def.phase2 && !e.phased);
    if (phaser) {
      phaser.phased = true;
      const nid = phaser.def.phase2;
      const ndef = DATA.monsters[nid];
      G.push(new MessageScene(
        `${phaser.name}「ぐ ぐぬぬ……\nまだだ…… まだ おわらんぞ!!\nこれが わしの しんのすがた だ!!」`,
        () => {
          phaser.id = nid; phaser.def = ndef; phaser.name = ndef.name;
          phaser.hp = ndef.hp; phaser.maxhp = ndef.hp;
          phaser.dead = false; phaser.atb = 80; phaser.casting = null;
          AudioSys.sfx("encounter");
          this.phase = "atb";
        }
      ));
      this.phase = "waitend";
      return;
    }

    this.checkEnd();
  }

  checkEnd() {
    if (this.aliveParty().length === 0) {
      AudioSys.bgm("gameover");
      G.push(new MessageScene("パーティは ぜんめつした……", () => {
        G.replace(new GameOverScene());
      }));
      this.phase = "waitend";
      return;
    }
    if (this.aliveEnemies().length === 0 && this.phase !== "waitend") {
      this.win();
    }
  }

  win() {
    // にげた てきは けいけんちに ならない
    const beaten = this.enemies.filter((e) => !e.fled);
    const exp = beaten.reduce((s, e) => s + (DATA.monsters[e.id].exp || 0), 0);
    const gold = beaten.reduce((s, e) => s + (DATA.monsters[e.id].gold || 0), 0);
    AudioSys.bgm("victory");
    const msgs = ["まものたちを やっつけた!"];
    if (exp > 0 || gold > 0) msgs.push(`けいけんち ${exp} かくとく!\n${gold}ギルを てにいれた!`);
    G.state.gold += gold;
    for (const p of this.party) {
      if (p.h.hp > 0 && exp > 0) {
        const ups = G.addExp(p.h, exp);
        ups.forEach((m) => msgs.push(m));
      }
    }
    G.push(new MessageScene(msgs, () => {
      this.restoreBgm();
      G.pop();
      if (this.opts.onWin) this.opts.onWin();
    }));
    this.phase = "waitend";
  }

  // ---------------- びょうが ----------------
  draw() {
    Gfx.clear(0);
    const c = Gfx.ctx;
    c.save();
    if (this.shake > 0) {
      c.translate(Math.round(rnd(-3, 3)), Math.round(rnd(-2, 2)));
    }
    this.drawBg(c);

    // てき (ゆっくり じょうげに ゆれて いきているかんじに)
    this.enemies.forEach((e, i) => {
      if (e.dead) return;
      const pos = this.enemyPos(i);
      const bob = Math.floor(performance.now() / 600 + i) % 2;
      const variant = e.flash > 0 ? "flash" : (e.def.pal || undefined);
      // あしもとの かげ
      c.fillStyle = PAL[1];
      c.fillRect(pos.x + 3, pos.y + pos.size - 1 + bob, pos.size - 6, 3);
      Gfx.draw(e.def.spr, pos.x, pos.y + bob, { scale: pos.scale, variant });
      // えいしょうちゅうの しるし
      if (e.casting) {
        const n = 1 + Math.floor(performance.now() / 250) % 3;
        c.fillStyle = PAL[3];
        for (let k = 0; k < n; k++) c.fillRect(pos.x + pos.size / 2 - 8 + k * 7, pos.y - 8, 4, 4);
      }
    });

    // パーティ
    this.party.forEach((p, i) => {
      const pos = this.partyPos(i);
      if (p.airborne) {
        // たいくうちゅうは かげだけ
        c.fillStyle = PAL[2];
        c.fillRect(pos.x + 8, pos.y + 26, 16, 3);
        return;
      }
      let spr = p.h.spr;
      if (spr === "hero" || spr === "pal") spr += "_s";
      if (p.h.toad) spr = "toad"; // カエルのすがた
      const variant = p.flash > 0 ? "flash" : (p.h.hp <= 0 ? "dark" : undefined);
      Gfx.draw(spr, pos.x, pos.y, { scale: 2, variant });
      if (this.phase === "command" && this.ready === p) {
        Gfx.cursor(pos.x - 10, pos.y + 12);
      }
      if (p.casting) {
        const n = 1 + Math.floor(performance.now() / 250) % 3;
        c.fillStyle = PAL[3];
        for (let k = 0; k < n; k++) c.fillRect(pos.x + 8 + k * 7, pos.y - 8, 4, 4);
      }
    });

    // ヒットエフェクト
    this.drawFx(c);

    // ダメージポップ
    this.pops.forEach((p) => {
      const dy = -Math.min(14, p.t * 40);
      Gfx.text(p.txt, p.x, p.y + dy, p.pi, 13);
    });

    // ログ
    if (this.phase === "intro") {
      Gfx.window(4, 4, 312, 30);
      Gfx.text(this.boss ? "つよそうな てきが たちふさがる!!" : "まものが あらわれた!", 14, 12);
    } else if (this.log) {
      Gfx.window(4, 4, 312, this.log.includes("\n") ? 44 : 30);
      this.log.split("\n").forEach((l, i) => Gfx.text(l, 14, 12 + i * 15));
    }

    this.drawStatus();

    if (this.phase === "command") this.drawCommand();

    c.restore();
    // まほうの ひかり
    if (this.screenFlash > 0) {
      c.globalAlpha = Math.min(0.45, this.screenFlash * 3);
      c.fillStyle = PAL[0];
      c.fillRect(0, 0, SCREEN_W, 196);
      c.globalAlpha = 1;
    }
  }

  // せんとうはいけい (エリアごとに ふんいきを かえる)
  drawBg(c) {
    const t = this.bgTheme;
    // じめん
    c.fillStyle = PAL[1];
    c.fillRect(0, 168, SCREEN_W, 8);

    if (t === "grass") {
      // とおくの やまなみ と くも
      c.fillStyle = PAL[1];
      for (let i = 0; i < 5; i++) {
        const x = 20 + i * 66, w = 56, h = 26 + (i % 3) * 10;
        c.beginPath();
        c.moveTo(x, 160); c.lineTo(x + w / 2, 160 - h); c.lineTo(x + w, 160);
        c.fill();
      }
      c.fillStyle = PAL[1];
      c.fillRect(40, 28, 34, 6); c.fillRect(50, 24, 18, 5);
      c.fillRect(210, 40, 40, 6); c.fillRect(222, 36, 20, 5);
      c.fillStyle = PAL[2];
      for (let i = 0; i < 10; i++) c.fillRect(12 + i * 32, 160 + (i % 3) * 2, 10, 2);
    }
    else if (t === "cave") {
      // つららじょうの いわてんじょう と いわかげ
      c.fillStyle = PAL[2];
      c.fillRect(0, 0, SCREEN_W, 10);
      for (let i = 0; i < 11; i++) {
        const x = i * 30 + 6, h = 10 + (i * 7) % 18;
        c.beginPath();
        c.moveTo(x, 10); c.lineTo(x + 9, 10 + h); c.lineTo(x + 18, 10);
        c.fill();
      }
      c.fillStyle = PAL[1];
      c.fillRect(0, 150, 42, 18); c.fillRect(120, 156, 60, 12); c.fillRect(268, 148, 52, 20);
      c.fillStyle = PAL[2];
      for (let i = 0; i < 8; i++) c.fillRect(20 + i * 40, 162 + (i % 2) * 3, 12, 3);
    }
    else if (t === "ice") {
      // こおりの けっしょう と ひかるゆか
      c.fillStyle = PAL[1];
      for (let i = 0; i < 6; i++) {
        const x = 16 + i * 54, y = 18 + (i * 13) % 40, s = 8 + (i % 3) * 4;
        c.beginPath();
        c.moveTo(x, y - s); c.lineTo(x + s, y); c.lineTo(x, y + s); c.lineTo(x - s, y);
        c.fill();
      }
      c.fillStyle = PAL[2];
      for (let i = 0; i < 12; i++) c.fillRect(8 + i * 27, 158 + (i % 3) * 3, 14, 2);
    }
    else if (t === "fire") {
      // ようがんの あわ と ねつのゆらぎ
      c.fillStyle = PAL[2];
      c.fillRect(0, 156, SCREEN_W, 20);
      c.fillStyle = PAL[1];
      const ph = Math.floor(performance.now() / 400) % 2;
      for (let i = 0; i < 9; i++) {
        const x = 14 + i * 36, r = 3 + ((i + ph) % 3) * 2;
        c.beginPath(); c.arc(x, 164 + (i % 2) * 5, r, 0, Math.PI * 2); c.fill();
      }
      for (let i = 0; i < 5; i++) {
        c.fillRect(30 + i * 64, 20 + ((i + ph) % 2) * 6, 2, 14);
        c.fillRect(46 + i * 64, 34 - ((i + ph) % 2) * 6, 2, 12);
      }
    }
    else if (t === "tower") {
      // いしのはしら と ほしぞら
      c.fillStyle = PAL[1];
      for (let i = 0; i < 14; i++) {
        const x = (i * 47 + 23) % SCREEN_W, y = (i * 31 + 9) % 120;
        c.fillRect(x, y, 2, 2);
      }
      c.fillStyle = PAL[2];
      c.fillRect(6, 20, 14, 148); c.fillRect(300, 20, 14, 148);
      c.fillStyle = PAL[1];
      for (let y = 26; y < 168; y += 14) { c.fillRect(6, y, 14, 2); c.fillRect(300, y, 14, 2); }
    }
    else if (t === "temple") {
      // しんでんの はしら
      c.fillStyle = PAL[1];
      [30, 130, 250].forEach((x) => {
        c.fillRect(x, 30, 16, 138);
        c.fillRect(x - 3, 24, 22, 6);
        c.fillRect(x - 3, 162, 22, 6);
      });
      c.fillStyle = PAL[2];
      c.fillRect(0, 24, SCREEN_W, 3);
      for (let i = 0; i < 10; i++) c.fillRect(12 + i * 32, 162 + (i % 2) * 3, 10, 2);
    }
    else if (t === "sea") {
      // かいていの なみもよう と あわ
      c.fillStyle = PAL[1];
      const ph = Math.floor(performance.now() / 500) % 2;
      for (let y = 20; y < 150; y += 26) {
        for (let x = 0; x < SCREEN_W; x += 24) {
          c.fillRect(x + (ph ? 12 : 0) + (y % 52 ? 6 : 0), y, 12, 2);
        }
      }
      c.fillStyle = PAL[2];
      for (let i = 0; i < 6; i++) {
        c.beginPath(); c.arc(30 + i * 52, 60 + ((i * 17 + ph * 10) % 80), 3, 0, Math.PI * 2); c.fill();
      }
    }
    else {
      // しつない: かべのライン と いしだたみ
      c.fillStyle = PAL[2];
      c.fillRect(0, 14, SCREEN_W, 3);
      c.fillStyle = PAL[1];
      for (let i = 0; i < 8; i++) c.fillRect(4 + i * 40, 20, 2, 10);
      for (let i = 0; i < 10; i++) c.fillRect(12 + i * 32, 160 + (i % 3) * 2, 10, 2);
    }
  }

  drawFx(c) {
    this.fx.forEach((f) => {
      const p = Math.min(1, f.t / 0.3);
      c.fillStyle = PAL[3];
      if (f.kind === "slash") {
        // ななめに はしる きりせん
        const r = 3 + p * 13;
        for (let k = -1; k <= 1; k++) {
          const px = Math.round(f.x - r + k * 2), py = Math.round(f.y - r - k * 2);
          for (let s = 0; s < r * 2; s += 2) c.fillRect(px + s, py + s, 2, 2);
        }
      } else {
        // ほうしゃじょうに とびちる ひかり
        const r = 3 + p * 12;
        for (let k = 0; k < 8; k++) {
          const a = k * Math.PI / 4;
          c.fillRect(Math.round(f.x + Math.cos(a) * r) - 1, Math.round(f.y + Math.sin(a) * r) - 1, 3, 3);
        }
      }
    });
  }

  drawStatus() {
    // てきめい (ひだりした)
    Gfx.window(4, 196, 100, 88);
    this.aliveEnemies().slice(0, 4).forEach((e, i) => {
      Gfx.text(e.name, 10, 204 + i * 19, 3, 10);
      Gfx.bar(10, 216 + i * 19, 88, 3, e.hp / e.maxhp, 2);
    });

    // パーティステータス (みぎした)
    Gfx.window(106, 196, 210, 88);
    const compact = this.party.length > 3;
    const rowH = compact ? 16 : 26;
    const fs = compact ? 10 : 11;
    this.party.forEach((p, i) => {
      const y = (compact ? 201 : 203) + i * rowH;
      const dead = p.h.hp <= 0;
      Gfx.text(p.h.name, 114, y, dead ? 2 : 3, fs);
      const st = Object.keys(DATA.statuses).find((s) => p.h[s]);
      if (st) Gfx.text(DATA.statuses[st].mark, 160, y, 2, 8);
      if (p.charge > 0) Gfx.text(`た${p.charge}`, 172, y, 2, 8);
      Gfx.textR(`${p.h.hp}`, 218, y, dead ? 2 : 3, fs);
      Gfx.text(`/${p.h.maxhp}`, 220, y, 3, compact ? 8 : 9);
      if (p.airborne) {
        Gfx.text("ジャンプ!", 258, y, 3, compact ? 8 : 9);
      } else if (p.casting) {
        Gfx.bar(258, y + 4, 48, 5, p.casting.t / p.casting.dur, 2);
        if (!compact) Gfx.text("えいしょう", 258, y + 11, 2, 8);
      } else {
        Gfx.bar(258, y + 4, 48, 5, p.atb / 100);
      }
      if (this.phase === "command" && this.ready === p) Gfx.cursor(106, y + 2, 3);
    });
  }

  drawCommand() {
    if (this.menu === "root") {
      const cmds = this.rootCommands();
      Gfx.window(4, 88, 112, cmds.length * 16 + 12);
      cmds.forEach((cmd, i) => {
        Gfx.text(cmd.name, 26, 94 + i * 16, 3, 11);
      });
      Gfx.cursor(12, 97 + this.sel * 16);
    }
    else if (this.menu === "spell") {
      const spells = this.ready.h.spells.map((id) => ({ id, def: DATA.spells[id] }));
      const h = spells.length * 16 + 14;
      Gfx.window(4, 60, 150, h);
      spells.forEach((s, i) => {
        const ok = this.ready.h.mp >= s.def.mp;
        Gfx.text(s.def.name, 26, 67 + i * 16, ok ? 3 : 1, 11);
        Gfx.textR(String(s.def.mp), 144, 67 + i * 16, ok ? 3 : 1, 10);
      });
      Gfx.cursor(12, 70 + this.sel2 * 16);
    }
    else if (this.menu === "item") {
      const items = itemList().filter((it) => it.def.kind === "use");
      const h = Math.max(1, items.length) * 16 + 14;
      Gfx.window(4, 60, 170, h);
      if (items.length === 0) Gfx.text("つかえるものが ない", 16, 67, 3, 10);
      items.forEach((it, i) => {
        Gfx.text(it.def.name, 26, 67 + i * 16, 3, 11);
        Gfx.textR("x" + it.count, 160, 67 + i * 16, 3, 10);
      });
      if (items.length > 0) Gfx.cursor(12, 70 + Math.min(this.sel2, items.length - 1) * 16);
    }
    else if (this.menu === "targetE") {
      const es = this.aliveEnemies();
      if (es.length === 0) return;
      const t = es[Math.min(this.targetSel, es.length - 1)];
      const i = this.enemies.indexOf(t);
      const pos = this.enemyPos(i);
      if (Math.floor(performance.now() / 200) % 2 === 0) {
        Gfx.cursor(pos.x + pos.size + 4, pos.y + pos.size / 2 - 4);
      }
      Gfx.window(4, 96, 110, 28);
      Gfx.text(t.name, 14, 103, 3, 11);
    }
    else if (this.menu === "targetP") {
      const t = this.party[this.targetSel];
      const pos = this.partyPos(this.targetSel);
      if (Math.floor(performance.now() / 200) % 2 === 0) {
        Gfx.cursor(pos.x - 12, pos.y + 12);
      }
      Gfx.window(4, 96, 110, 28);
      Gfx.text(t.h.name, 14, 103, 3, 11);
    }
  }
}
