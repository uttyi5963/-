// ============================================================
// クリスタルナイツ - ATBバトル (FF4スタイル アクティブタイムバトル)
// ============================================================

function rnd(a, b) { return a + Math.random() * (b - a); }

class BattleScene {
  constructor(groupIds, opts = {}) {
    this.opaque = true;
    this.opts = opts;
    this.boss = !!opts.boss;

    // てき生成 (おなじしゅるいには A,B,C…)
    const counts = {};
    groupIds.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
    const seen = {};
    this.enemies = groupIds.map((id, i) => {
      const def = DATA.monsters[id];
      let name = def.name;
      if (counts[id] > 1) {
        seen[id] = (seen[id] || 0);
        name += "ABCD"[seen[id]++];
      }
      return {
        id, def, name,
        hp: def.hp, maxhp: def.hp,
        atb: rnd(0, 50), dead: false,
        flash: 0,
      };
    });

    this.party = G.state.party.map((h) => ({
      h, atb: rnd(20, 60), defending: false, protect: false, flash: 0,
    }));

    this.phase = "intro";
    this.introT = 0;
    this.ready = null;       // いま コマンドにゅうりょくちゅうの プレイヤー
    this.menu = "root";      // root / spell / item / targetE / targetP
    this.sel = 0; this.sel2 = 0; this.targetSel = 0;
    this.anim = null;
    this.log = "";
    this.pops = [];          // ダメージすうじ
    this.shadowActs = 0;     // しれんボスの こうどうかいすう
    this.fleeing = false;

    AudioSys.bgm(opts.music || "battle");
  }

  // ---------------- ユーティリティ ----------------
  aliveEnemies() { return this.enemies.filter((e) => !e.dead); }
  aliveParty() { return this.party.filter((p) => p.h.hp > 0); }

  restoreBgm() {
    const m = DATA.maps[G.state.map];
    if (m && m.bgm) AudioSys.bgm(m.bgm);
    else AudioSys.stopBgm();
  }

  elemMod(def, elem) {
    if (!elem) return 1;
    return (def.weak || []).includes(elem) ? 1.75 : 1;
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
    return { x: 250, y: 26 + i * 50, size: 32 };
  }

  // ---------------- こうしん ----------------
  update(dt) {
    this.pops = this.pops.filter((p) => (p.t += dt) < 0.9);
    this.enemies.forEach((e) => { if (e.flash > 0) e.flash -= dt; });
    this.party.forEach((p) => { if (p.flash > 0) p.flash -= dt; });

    if (this.phase === "intro") {
      this.introT += dt;
      if (this.introT > 0.7) { this.phase = "atb"; this.log = ""; }
      return;
    }

    if (this.phase === "exec") {
      const a = this.anim;
      a.t += dt;
      while (a.fired < a.events.length && a.events[a.fired].t <= a.t) {
        a.events[a.fired++].fn();
      }
      if (a.t >= a.dur) {
        this.anim = null;
        if (a.actor) a.actor.atb = 0;
        this.afterAction();
      }
      return;
    }

    if (this.phase === "command") {
      this.updateCommand();
      return;
    }

    if (this.phase === "atb") {
      // ゲージじゅうてん (ウェイトモード: コマンド/アニメちゅうは とまる)
      for (const p of this.aliveParty()) p.atb = Math.min(100, p.atb + (25 + p.h.agi * 3) * dt);
      for (const e of this.aliveEnemies()) e.atb = Math.min(100, e.atb + (25 + e.def.agi * 3) * dt);

      // てきのターン
      const e = this.aliveEnemies().find((e) => e.atb >= 100);
      if (e) { this.enemyAct(e); return; }

      // プレイヤーのターン
      const p = this.aliveParty().find((p) => p.atb >= 100);
      if (p) {
        this.ready = p;
        p.defending = false;
        if (this.poisonTick(p)) return;
        this.phase = "command";
        this.menu = "root";
        this.sel = 0;
        AudioSys.sfx("cursor");
      }
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
      this.log = `${p.h.name}は どくに たおれた…`;
      AudioSys.sfx("dead");
      this.checkEnd();
      return true;
    }
    return false;
  }

  // ---------------- コマンドにゅうりょく ----------------
  rootCommands() {
    const h = this.ready.h;
    const cmds = [{ id: "fight", name: "たたかう" }];
    if (h.special === "dark") cmds.push({ id: "dark", name: "あんこく" });
    if (h.special === "holy") cmds.push({ id: "holy", name: "せいけん" });
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
        else if (cmd.id === "spell") { this.menu = "spell"; this.sel2 = 0; }
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
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.menu = this.pendingAct.type === "item" ? "item" : "spell"; return; }
      if (Input.tap("a")) {
        AudioSys.sfx("confirm");
        this.pendingAct.targetP = this.party[this.targetSel];
        this.doPlayerAction(this.pendingAct);
      }
      return;
    }
  }

  // ---------------- プレイヤーのこうどう ----------------
  doPlayerAction(act) {
    const p = this.ready;
    const h = p.h;
    const events = [];
    let dur = 1.0;

    const hitEnemy = (target, dmg, sfx = "hit") => {
      events.push({ t: 0.4, fn: () => {
        if (target.dead) { this.log += "  しかし てきは いない!"; return; }
        target.hp = Math.max(0, target.hp - dmg);
        target.flash = 0.25;
        AudioSys.sfx(sfx);
        const pos = this.enemyPos(this.enemies.indexOf(target));
        this.pop(pos.x + pos.size / 2, pos.y, dmg);
        this.afterDamageEnemy(target, events);
      } });
    };

    if (act.type === "fight") {
      const t = act.target;
      events.push({ t: 0, fn: () => { this.log = `${h.name}の こうげき!`; } });
      const wdef = DATA.items[h.weapon] || {};
      if (Math.random() < 0.05) {
        events.push({ t: 0.4, fn: () => {
          this.log = `${h.name}の こうげき! ミス!`;
          AudioSys.sfx("cancel");
        } });
      } else {
        const crit = Math.random() < 1 / 16;
        let dmg = this.physDmg(G.atkOf(h), t.def.def);
        dmg = Math.round(dmg * this.elemMod(t.def, wdef.elem) * (crit ? 2 : 1));
        if (crit) events.push({ t: 0.35, fn: () => { this.log = "かいしんの いちげき!!"; } });
        hitEnemy(t, dmg, crit ? "crit" : "hit");
      }
    }
    else if (act.type === "dark") {
      const cost = Math.floor(h.maxhp / 8);
      events.push({ t: 0, fn: () => {
        this.log = `${h.name}の あんこく!`;
        h.hp = Math.max(1, h.hp - cost);
        AudioSys.sfx("dark");
      } });
      this.aliveEnemies().forEach((e) => {
        const dmg = Math.round(this.physDmg(Math.round(G.atkOf(h) * 1.5), e.def.def));
        hitEnemy(e, dmg);
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
      const dmg = Math.round(this.physDmg(Math.round(G.atkOf(h) * 1.6), t.def.def) * this.elemMod(t.def, "holy"));
      hitEnemy(t, dmg);
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
    else if (act.type === "spell") {
      const sp = act.spell.def;
      events.push({ t: 0, fn: () => {
        this.log = `${h.name}は ${sp.name}を となえた!`;
        h.mp -= sp.mp;
        AudioSys.sfx(sp.type === "dmg" ? "magic" : "heal");
      } });
      if (sp.type === "dmg") {
        const targets = sp.all ? this.aliveEnemies() : [act.target];
        targets.forEach((e) => {
          const dmg = Math.round(sp.pow * (1 + G.intOf(h) / 16) * rnd(0.9, 1.1) * this.elemMod(e.def, sp.elem));
          hitEnemy(e, dmg, "magic");
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
            if (t.h.hp <= 0 || !t.h.poison) { this.log = "しかし きかなかった!"; return; }
            t.h.poison = false;
            this.log = `${t.h.name}の どくが きえた!`;
          } else if (sp.type === "buff") {
            if (t.h.hp <= 0) { this.log = "しかし きかなかった!"; return; }
            t.protect = true;
            this.log = `${t.h.name}の ぼうぎょが あがった!`;
          }
        } });
      }
    }
    else if (act.type === "item") {
      const it = act.item;
      const t = act.targetP;
      events.push({ t: 0, fn: () => { this.log = `${h.name}は ${it.def.name}を つかった!`; } });
      events.push({ t: 0.45, fn: () => {
        const def = it.def;
        if (def.heal) {
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
        } else if (def.cure === "poison") {
          if (!t.h.poison) { this.log = "しかし きかなかった!"; return; }
          G.removeItem(it.id);
          t.h.poison = false;
          this.log = `${t.h.name}の どくが なおった!`;
          AudioSys.sfx("heal");
        }
      } });
    }

    this.startAnim(events, dur, p);
  }

  // てきに ダメージをあたえたあとの しょり (しれんボスなど)
  afterDamageEnemy(target, events) {
    if (target.def.trial && target.hp < target.maxhp) {
      target.hp = target.maxhp;
      this.log = "『やみは ちからでは はらえぬ……』\nかげの きずが ふさがっていく!";
    }
  }

  // ---------------- てきのこうどう ----------------
  enemyAct(e) {
    const events = [];
    const dur = 1.0;

    // どく/フェーズしょり
    const targets = this.aliveParty();
    if (targets.length === 0) return;

    // しれんボス: 6かい こうどうしたら しずまる
    if (e.def.trial) this.shadowActs++;

    let action = { type: "attack" };
    for (const a of (e.def.acts || [])) {
      if (Math.random() < a.rate) { action = { type: "spell", spell: DATA.spells[a.spell] }; break; }
    }

    if (action.type === "spell") {
      const sp = action.spell;
      events.push({ t: 0, fn: () => {
        this.log = `${e.name}は ${sp.name}を となえた!`;
        AudioSys.sfx("magic");
      } });
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
          AudioSys.sfx("hit");
          if (p.h.hp <= 0) { p.atb = 0; this.log = `${p.h.name}は たおれた!`; AudioSys.sfx("dead"); }
        } });
      });
    } else {
      const p = targets[Math.floor(Math.random() * targets.length)];
      events.push({ t: 0, fn: () => { this.log = `${e.name}の こうげき!`; } });
      events.push({ t: 0.45, fn: () => {
        if (p.h.hp <= 0) return;
        let dmg = this.physDmg(e.def.atk, G.defOf(p.h));
        if (p.defending) dmg = Math.round(dmg * 0.5);
        if (p.protect) dmg = Math.round(dmg * 0.6);
        dmg = Math.max(1, dmg);
        p.h.hp = Math.max(0, p.h.hp - dmg);
        p.flash = 0.25;
        const pos = this.partyPos(this.party.indexOf(p));
        this.pop(pos.x, pos.y, dmg, 2);
        AudioSys.sfx("hit");
        if (e.def.poison && Math.random() < e.def.poison && p.h.hp > 0 && !p.h.poison) {
          p.h.poison = true;
          this.log = `${p.h.name}は どくを うけた!`;
        }
        if (p.h.hp <= 0) { p.atb = 0; this.log = `${p.h.name}は たおれた!`; AudioSys.sfx("dead"); }
      } });
    }

    this.startAnim(events, dur, e);
  }

  startAnim(events, dur, actor) {
    events.sort((a, b) => a.t - b.t);
    this.anim = { events, dur, t: 0, fired: 0, actor };
    this.phase = "exec";
  }

  // ---------------- こうどうごの しょり ----------------
  afterAction() {
    this.ready = null;

    // てきの しぼう
    for (const e of this.enemies) {
      if (!e.dead && e.hp <= 0) {
        e.dead = true;
        AudioSys.sfx("dead");
      }
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
          phaser.dead = false; phaser.atb = 80;
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
    if (this.aliveEnemies().length === 0) {
      this.win();
      return;
    }
    if (this.phase !== "waitend") this.phase = "atb";
  }

  win() {
    const exp = this.enemies.reduce((s, e) => s + (DATA.monsters[e.id].exp || 0), 0);
    const gold = this.enemies.reduce((s, e) => s + (DATA.monsters[e.id].gold || 0), 0);
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
    // はいけい
    Gfx.clear(0);
    const c = Gfx.ctx;
    c.fillStyle = PAL[1];
    c.fillRect(0, 168, SCREEN_W, 8);
    for (let i = 0; i < 10; i++) {
      c.fillRect(12 + i * 32, 160 + (i % 3) * 2, 10, 2);
    }

    // てき
    this.enemies.forEach((e, i) => {
      if (e.dead) return;
      const pos = this.enemyPos(i);
      const variant = e.flash > 0 ? "flash" : (e.def.pal || undefined);
      Gfx.draw(e.def.spr, pos.x, pos.y, { scale: pos.scale, variant });
    });

    // パーティ
    this.party.forEach((p, i) => {
      const pos = this.partyPos(i);
      let spr = p.h.spr;
      if (spr === "hero" || spr === "pal") spr += "_s";
      const variant = p.flash > 0 ? "flash" : (p.h.hp <= 0 ? "dark" : undefined);
      Gfx.draw(spr, pos.x, pos.y, { scale: 2, variant });
      if (this.phase === "command" && this.ready === p) {
        Gfx.cursor(pos.x - 10, pos.y + 12);
      }
    });

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
  }

  drawStatus() {
    // てきめい (ひだりした)
    Gfx.window(4, 196, 100, 88);
    this.aliveEnemies().slice(0, 4).forEach((e, i) => {
      Gfx.text(e.name, 10, 204 + i * 19, 3, 10);
    });

    // パーティステータス (みぎした)
    Gfx.window(106, 196, 210, 88);
    this.party.forEach((p, i) => {
      const y = 203 + i * 26;
      const dead = p.h.hp <= 0;
      Gfx.text(p.h.name, 114, y, dead ? 2 : 3, 11);
      Gfx.textR(`${p.h.hp}`, 218, y, dead ? 2 : 3, 11);
      Gfx.text(`/${p.h.maxhp}`, 220, y, 3, 9);
      if (p.h.poison) Gfx.text("どく", 114, y + 12, 2, 8);
      Gfx.bar(258, y + 4, 48, 5, p.atb / 100);
      if (this.phase === "command" && this.ready === p) Gfx.cursor(106, y + 2, 3);
    });
  }

  drawCommand() {
    if (this.menu === "root") {
      const cmds = this.rootCommands();
      Gfx.window(4, 96, 96, cmds.length * 16 + 12);
      cmds.forEach((cmd, i) => {
        Gfx.text(cmd.name, 26, 102 + i * 16, 3, 11);
      });
      Gfx.cursor(12, 105 + this.sel * 16);
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
