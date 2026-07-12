// ============================================================
// クリスタルナイツ - フィールドメニュー / ショップ
// ============================================================

function itemList() {
  return Object.entries(G.state.items).map(([id, count]) => ({ id, count, def: DATA.items[id] }));
}

// フィールドでのアイテムこうか。つかえたら メッセージ、だめなら null
function applyFieldItem(def, hero) {
  if (def.partyheal) {
    G.state.party.forEach((h) => {
      if (h.hp > 0) {
        h.hp = h.maxhp; h.mp = h.maxmp;
        Object.keys(DATA.statuses).forEach((s) => { h[s] = false; });
      }
    });
    return "なかまぜんいんが かんぜんに かいふくした!";
  }
  if (def.elixir) {
    if (hero.hp <= 0) return null;
    hero.hp = hero.maxhp;
    hero.mp = hero.maxmp;
    return `${hero.name}の HPとMPが かんぜんに かいふくした!`;
  }
  if (def.heal) {
    if (hero.hp <= 0) return null;
    hero.hp = Math.min(hero.maxhp, hero.hp + def.heal);
    return `${hero.name}の HPが かいふくした!`;
  }
  if (def.mp) {
    if (hero.hp <= 0) return null;
    hero.mp = Math.min(hero.maxmp, hero.mp + def.mp);
    return `${hero.name}の MPが かいふくした!`;
  }
  if (def.revive) {
    if (hero.hp > 0) return null;
    hero.hp = Math.max(1, Math.floor(hero.maxhp * def.revive));
    return `${hero.name}は いきかえった!`;
  }
  if (def.cure) {
    if (!hero[def.cure]) return null;
    hero[def.cure] = false;
    return `${hero.name}の ${DATA.statuses[def.cure].name}が なおった!`;
  }
  if (def.cureall) {
    if (hero.hp <= 0) return null;
    const had = Object.keys(DATA.statuses).filter((s) => hero[s]);
    if (had.length === 0) return null;
    had.forEach((s) => { hero[s] = false; });
    return `${hero.name}の ${had.map((s) => DATA.statuses[s].name).join("・")}が なおった!`;
  }
  return null;
}

function applyFieldSpell(spell, caster, target) {
  if (spell.type === "heal" && spell.all) {
    const alive = G.state.party.filter((h) => h.hp > 0 && h.hp < h.maxhp);
    if (alive.length === 0) return null;
    alive.forEach((h) => { h.hp = Math.min(h.maxhp, h.hp + G.calcHeal(caster, spell)); });
    return "なかまぜんいんの HPが かいふくした!";
  }
  if (spell.type === "heal") {
    if (target.hp <= 0) return null;
    target.hp = Math.min(target.maxhp, target.hp + G.calcHeal(caster, spell));
    return `${target.name}の HPが かいふくした!`;
  }
  if (spell.type === "revive") {
    if (target.hp > 0) return null;
    target.hp = Math.max(1, Math.floor(target.maxhp * spell.pow));
    return `${target.name}は いきかえった!`;
  }
  if (spell.type === "cure") {
    const sts = spell.cureAll ? Object.keys(DATA.statuses) : ["poison"];
    const had = sts.filter((s) => target[s]);
    if (had.length === 0) return null;
    had.forEach((s) => { target[s] = false; });
    return `${target.name}の ${had.map((s) => DATA.statuses[s].name).join("・")}が なおった!`;
  }
  return null;
}

class MenuScene {
  constructor() {
    this.opaque = false;
    this.state = "main";
    this.sel = 0;
    this.sub = 0;
    this.scroll = 0;
    this.target = 0;
    this.picked = null;
    this.commands = ["つよさ", "じゅもん", "どうぐ", "そうび", "たいれつ", "ずかん", "クエスト", "せってい", "パスワード", "セーブ"];
  }

  update() {
    switch (this.state) {
      case "main": this.updMain(); break;
      case "status": this.updStatus(); break;
      case "heroPick": this.updHeroPick(); break;
      case "spellList": this.updSpellList(); break;
      case "item": this.updItem(); break;
      case "targetPick": this.updTargetPick(); break;
      case "equipSlot": this.updEquipSlot(); break;
      case "equipItem": this.updEquipItem(); break;
    }
  }

  nav(len, key) {
    if (len <= 0) return;
    if (Input.tap("up")) { this[key] = (this[key] + len - 1) % len; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this[key] = (this[key] + 1) % len; AudioSys.sfx("cursor"); }
  }

  updMain() {
    this.nav(this.commands.length, "sel");
    if (Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); return; }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      const cmd = this.commands[this.sel];
      if (cmd === "つよさ") { this.state = "heroPick"; this.mode = "status"; this.sub = 0; }
      else if (cmd === "じゅもん") { this.state = "heroPick"; this.mode = "spell"; this.sub = 0; }
      else if (cmd === "どうぐ") { this.state = "item"; this.sub = 0; this.scroll = 0; }
      else if (cmd === "そうび") { this.state = "heroPick"; this.mode = "equip"; this.sub = 0; }
      else if (cmd === "たいれつ") { this.state = "heroPick"; this.mode = "row"; this.sub = 0; }
      else if (cmd === "ずかん") { G.push(new BestiaryScene()); }
      else if (cmd === "クエスト") { G.push(new QuestScene()); }
      else if (cmd === "せってい") {
        if (!G.state.config) G.state.config = { atbWait: true };
        G.state.config.atbWait = G.state.config.atbWait === false;
        const mode = G.state.config.atbWait ? "ウェイト" : "アクティブ";
        G.push(new MessageScene(
          `せんとうモード: ${mode}\n` +
          (G.state.config.atbWait
            ? "(コマンドを えらんでいるあいだ\n じかんが とまります)"
            : "(コマンドちゅうも てきは うごきます!)")));
      }
      else if (cmd === "パスワード") {
        G.push(new ChoiceScene(["かきだす", "よみこむ"], (pick) => {
          if (pick < 0) return;
          if (pick === 0) {
            G.push(new SlotPickScene("load", (slot) => {
              if (slot < 0) return;
              const code = G.exportCode(slot);
              if (code) CodeOverlay.show("export", code);
              else G.push(new MessageScene("その スロットは からっぽだ。"));
            }));
          } else {
            G.push(new SlotPickScene("save", (slot) => {
              if (slot < 0) return;
              CodeOverlay.show("import", "", (text) => {
                if (G.importCode(text, slot)) {
                  G.push(new MessageScene(`スロット${slot}に よみこんだ!`));
                } else {
                  G.push(new MessageScene("パスワードが ちがうようだ……"));
                }
              });
            }));
          }
        }, { x: 180, y: 130 }));
      }
      else if (cmd === "セーブ") {
        G.push(new SlotPickScene("save", (slot) => {
          if (slot < 0) return;
          if (G.save(slot)) {
            const msgs = [`スロット${slot}に きろくした!`];
            if (!Store.ok) msgs.push("※このかんきょうでは きろくが きえる\n ことがあります。メニューの\n「パスワード」で かきだせます!");
            G.push(new MessageScene(msgs));
          }
          else G.push(new MessageScene("セーブに しっぱいした……"));
        }));
      }
    }
  }

  updHeroPick() {
    this.nav(G.state.party.length, "sub");
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      this.picked = G.state.party[this.sub];
      if (this.mode === "status") this.state = "status";
      else if (this.mode === "spell") { this.state = "spellList"; this.sel2 = 0; }
      else if (this.mode === "equip") { this.state = "equipSlot"; this.sel2 = 0; }
      else if (this.mode === "row") {
        // まえ/うしろ を きりかえて えらびなおしへ
        this.picked.row = this.picked.row === "back" ? "front" : "back";
      }
    }
  }

  updStatus() {
    if (Input.tap("b") || Input.tap("a")) { AudioSys.sfx("cancel"); this.state = "heroPick"; }
  }

  fieldSpells(h) {
    return h.spells.map((id) => ({ id, def: DATA.spells[id] })).filter((s) => s.def.field);
  }

  updSpellList() {
    const spells = this.fieldSpells(this.picked);
    this.sel2 = this.sel2 || 0;
    if (spells.length > 0) {
      if (Input.tap("up")) { this.sel2 = (this.sel2 + spells.length - 1) % spells.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel2 = (this.sel2 + 1) % spells.length; AudioSys.sfx("cursor"); }
    }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "heroPick"; return; }
    if (Input.tap("a") && spells.length > 0) {
      const sp = spells[this.sel2];
      if (this.picked.mp < sp.def.mp || this.picked.hp <= 0 ||
          this.picked.silence || this.picked.toad) { AudioSys.sfx("buzz"); return; }
      AudioSys.sfx("confirm");
      this.pendingSpell = sp;
      this.state = "targetPick";
      this.target = 0;
      this.targetMode = "spell";
    }
  }

  updItem() {
    const items = itemList();
    if (items.length > 0) {
      if (Input.tap("up")) { this.sub = (this.sub + items.length - 1) % items.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sub = (this.sub + 1) % items.length; AudioSys.sfx("cursor"); }
    }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a") && items.length > 0) {
      const it = items[Math.min(this.sub, items.length - 1)];
      if (it.def.kind !== "use") { AudioSys.sfx("buzz"); return; }
      AudioSys.sfx("confirm");
      this.pendingItem = it;
      this.state = "targetPick";
      this.target = 0;
      this.targetMode = "item";
    }
  }

  updTargetPick() {
    this.nav(G.state.party.length, "target");
    if (Input.tap("b")) {
      AudioSys.sfx("cancel");
      this.state = this.targetMode === "item" ? "item" : "spellList";
      return;
    }
    if (Input.tap("a")) {
      const hero = G.state.party[this.target];
      if (this.targetMode === "item") {
        const msg = applyFieldItem(this.pendingItem.def, hero);
        if (!msg) { AudioSys.sfx("buzz"); return; }
        G.removeItem(this.pendingItem.id);
        AudioSys.sfx("heal");
        G.push(new MessageScene(msg));
        this.state = "item";
        this.sub = 0;
      } else {
        const sp = this.pendingSpell;
        const msg = applyFieldSpell(sp.def, this.picked, hero);
        if (!msg) { AudioSys.sfx("buzz"); return; }
        this.picked.mp -= sp.def.mp;
        AudioSys.sfx("heal");
        G.push(new MessageScene(msg));
        this.state = "spellList";
      }
    }
  }

  equipCandidates(h, slot) {
    return itemList().filter((it) =>
      it.def.kind === slot && (it.def.who || []).includes(h.id));
  }

  updEquipSlot() {
    this.nav(2, "sel2");
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "heroPick"; return; }
    if (Input.tap("a")) {
      this.slot = this.sel2 === 0 ? "weapon" : "armor";
      const cands = this.equipCandidates(this.picked, this.slot);
      if (cands.length === 0) { AudioSys.sfx("buzz"); return; }
      AudioSys.sfx("confirm");
      this.state = "equipItem";
      this.sel3 = 0;
    }
  }

  updEquipItem() {
    const cands = this.equipCandidates(this.picked, this.slot);
    if (cands.length > 0) {
      if (Input.tap("up")) { this.sel3 = (this.sel3 + cands.length - 1) % cands.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel3 = (this.sel3 + 1) % cands.length; AudioSys.sfx("cursor"); }
    }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "equipSlot"; return; }
    if (Input.tap("a") && cands.length > 0) {
      const it = cands[Math.min(this.sel3, cands.length - 1)];
      const h = this.picked;
      const old = this.slot === "weapon" ? h.weapon : h.armor;
      if (old) G.addItem(old);
      G.removeItem(it.id);
      if (this.slot === "weapon") h.weapon = it.id; else h.armor = it.id;
      AudioSys.sfx("confirm");
      this.state = "equipSlot";
    }
  }

  // ---------------- びょうが ----------------
  draw() {
    if (this.state === "status") { this.drawStatus(); return; }

    // パーティいちらん (ひだり)
    const n = G.state.party.length;
    Gfx.window(4, 4, 196, Math.min(268, n * 48 + 20));
    G.state.party.forEach((h, i) => {
      const y = 14 + i * 48;
      const back = h.row === "back";
      Gfx.draw(h.spr === "hero" || h.spr === "pal" ? h.spr + "_d" : h.spr, back ? 22 : 14, y + 8);
      Gfx.text(h.name, 42, y);
      Gfx.text(`Lv${h.lv} ${h.cls}`, 96, y, 3, 9);
      Gfx.text(`HP${h.hp}/${h.maxhp}`, 42, y + 16, h.hp === 0 ? 2 : 3, 10);
      Gfx.text(`MP${h.mp}/${h.maxmp}`, 122, y + 16, 3, 10);
      Gfx.text(back ? "後" : "前", 180, y, 3, 9);
      const sts = Object.keys(DATA.statuses).filter((s) => h[s]);
      if (sts.length) {
        Gfx.text(sts.slice(0, 2).map((s) => DATA.statuses[s].name).join(" "), 42, y + 29, 2, 9);
      }
      if ((this.state === "heroPick" && this.sub === i) ||
          (this.state === "targetPick" && this.target === i)) {
        Gfx.cursor(5, y + 12);
      }
    });

    // コマンド (みぎうえ)
    Gfx.window(204, 4, 112, 184);
    this.commands.forEach((c, i) => {
      Gfx.text(c, 226, 12 + i * 17, 3, 11);
    });
    if (this.state === "main") Gfx.cursor(212, 15 + this.sel * 17);

    // しょじきん / プレイじかん (みぎした)
    Gfx.window(204, 192, 112, 58);
    Gfx.textR(`${G.state.gold} ギル`, 306, 200);
    const pmin = Math.floor((G.state.playtime || 0) / 60);
    Gfx.textR(`${Math.floor(pmin / 60)}じかん${pmin % 60}ふん`, 306, 216, 3, 10);
    Gfx.text(DATA.maps[G.state.map].name, 212, 232, 3, 10);

    if (this.state === "item") this.drawItemList();
    if (this.state === "spellList") this.drawSpellList();
    if (this.state === "equipSlot" || this.state === "equipItem") this.drawEquip();
  }

  drawItemList() {
    const items = itemList();
    Gfx.window(20, 40, 280, 200);
    Gfx.text("どうぐ", 32, 48);
    if (items.length === 0) Gfx.text("なにも もっていない", 40, 76);
    const view = 8;
    if (this.sub < this.scroll) this.scroll = this.sub;
    if (this.sub >= this.scroll + view) this.scroll = this.sub - view + 1;
    items.slice(this.scroll, this.scroll + view).forEach((it, i) => {
      const y = 72 + i * 19;
      Gfx.text(it.def.name, 48, y);
      Gfx.textR("x" + it.count, 280, y);
      if (this.scroll + i === this.sub) Gfx.cursor(34, y + 3);
    });
    const it = items[this.sub];
    if (it && it.def.desc) Gfx.text(it.def.desc, 32, 222, 3, 10);
  }

  drawSpellList() {
    const spells = this.fieldSpells(this.picked);
    Gfx.window(20, 40, 280, 180);
    Gfx.text(`${this.picked.name}の じゅもん`, 32, 48);
    if (spells.length === 0) Gfx.text("フィールドで つかえる じゅもんが ない", 40, 76, 3, 10);
    spells.forEach((s, i) => {
      const y = 72 + i * 19;
      Gfx.text(s.def.name, 48, y);
      Gfx.textR(`MP ${s.def.mp}`, 280, y);
      if (i === (this.sel2 || 0)) Gfx.cursor(34, y + 3);
    });
    Gfx.text(`MP ${this.picked.mp}/${this.picked.maxmp}`, 32, 198, 3, 10);
  }

  drawEquip() {
    const h = this.picked;
    Gfx.window(20, 40, 280, 200);
    Gfx.text(`${h.name}の そうび`, 32, 48);
    const wname = h.weapon ? DATA.items[h.weapon].name : "なし";
    const aname = h.armor ? DATA.items[h.armor].name : "なし";
    Gfx.text("ぶき  : " + wname, 48, 74);
    Gfx.text("よろい: " + aname, 48, 93);
    Gfx.text(`こうげき ${G.atkOf(h)}  ぼうぎょ ${G.defOf(h)}`, 48, 116, 3, 10);
    if (this.state === "equipSlot") {
      Gfx.cursor(34, 77 + this.sel2 * 19);
    } else {
      const cands = this.equipCandidates(h, this.slot);
      cands.forEach((it, i) => {
        const y = 140 + i * 18;
        const stat = it.def.kind === "weapon" ? `こうげき${it.def.atk}` : `ぼうぎょ${it.def.def}`;
        Gfx.text(it.def.name, 60, y, 3, 11);
        Gfx.textR(stat, 280, y, 3, 10);
        if (i === this.sel3) Gfx.cursor(46, y + 3);
      });
    }
  }

  drawStatus() {
    const h = this.picked;
    Gfx.window(20, 20, 280, 240);
    Gfx.draw(h.spr === "hero" || h.spr === "pal" ? h.spr + "_d" : h.spr, 36, 34, { scale: 2 });
    Gfx.text(h.name, 84, 36);
    Gfx.text(`${h.cls}  レベル ${h.lv}`, 84, 55, 3, 11);
    const rows = [
      ["HP", `${h.hp}/${h.maxhp}`],
      ["MP", `${h.mp}/${h.maxmp}`],
      ["ちから", h.str],
      ["すばやさ", h.agi],
      ["たいりょく", h.vit],
      ["ちせい", G.intOf(h)],
      ["こうげき", G.atkOf(h)],
      ["ぼうぎょ", G.defOf(h)],
      ["けいけんち", h.exp],
      ["つぎのレベルまで", Math.max(0, G.expTotalFor(h.lv + 1) - h.exp)],
    ];
    rows.forEach(([k, v], i) => {
      Gfx.text(String(k), 44, 84 + i * 17, 3, 11);
      Gfx.textR(String(v), 276, 84 + i * 17, 3, 11);
    });
  }
}

// ============================================================
// モンスターずかん
// ============================================================
// ---------------- でんどうのま (じっせき いちらん) ----------------
class AchievementScene {
  constructor(onDone) {
    this.opaque = true;
    this.onDone = onDone || null;
  }
  rows() {
    const f = (k) => !!G.flag(k);
    const monsTotal = Object.keys(DATA.monsters).length;
    const seen = Object.keys(G.state.bestiary || {}).length;
    const chests = Object.keys(G.state.flags || {}).filter((k) => k.indexOf("chest_") === 0).length;
    const genju = ["sylphidDown", "gnomosDown", "undinaDown"].filter(f).length;
    const lords = ["craterBoss", "mirrorBoss", "glacierBoss", "tombBoss", "ruinsBoss", "stormBoss"].filter(f).length;
    const arena = f("arenaPlatinum") ? "プラチナ" : f("arenaGold") ? "ゴールド" : f("arenaSilver") ? "シルバー" : f("arenaBronze") ? "ブロンズ" : "みせいは";
    return [
      ["まおう ザルバを たおした", f("clear")],
      ["しんのてき ヴォイドスを たおした", f("trueClear")],
      ["しんえんりゅう ヴァハを たおした", f("superBoss")],
      ["ほしぼしのおう グランステラ", f("graveBoss")],
      ["けんおう ガロンに かった", f("garonBeat")],
      [`かくちの ぬしを しずめた (${lords}/6)`, lords >= 6],
      [`げんじゅうを たいじした (${genju}/3)`, genju >= 3],
      ["せかいかいぎを ひらいた", f("summitDone")],
      [`とうぎじょう さいこうい: ${arena}`, f("arenaPlatinum")],
      ["ねこあつめを かんせいさせた", f("catDone")],
      [`ずかんに とうろくした (${seen}/${monsTotal})`, seen >= monsTotal],
      [`たからばこを あけた (${chests}こ)`, chests >= 60],
      ["つりぼりの ぬしを つった", f("fishKing")],
    ];
  }
  update() {
    if (Input.tap("a") || Input.tap("b")) {
      AudioSys.sfx("cancel");
      G.pop();
      if (this.onDone) this.onDone();
    }
  }
  draw() {
    Gfx.clear(0);
    Gfx.window(4, 4, 312, 280);
    Gfx.text("〜 えいゆうの きろく 〜", 92, 14, 3, 13);
    this.rows().forEach(([name, done], i) => {
      const y = 34 + i * 16;
      Gfx.text(done ? "☆" : "・", 18, y, done ? 3 : 1, 11);
      Gfx.text(name, 38, y, done ? 3 : 1, 10);
    });
    const p = G.state.party[0];
    const pmin = Math.floor((G.state.playtime || 0) / 60);
    Gfx.text(`レベル${p ? p.lv : "?"}  プレイじかん ${Math.floor(pmin / 60)}じかん${pmin % 60}ふん`, 18, 250, 2, 10);
    Gfx.text("A/B: もどる", 130, 266, 1, 9);
  }
}

class BestiaryScene {
  constructor() {
    this.opaque = true;
    this.ids = Object.keys(DATA.monsters);
    this.sel = 0;
    this.scroll = 0;
    this.detail = false;
  }

  entry(id) {
    return (G.state.bestiary && G.state.bestiary[id]) || { seen: 0, killed: 0 };
  }

  update() {
    if (this.detail) {
      if (Input.tap("a") || Input.tap("b")) { AudioSys.sfx("cancel"); this.detail = false; }
      return;
    }
    const n = this.ids.length;
    if (Input.tap("up")) { this.sel = (this.sel + n - 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); return; }
    if (Input.tap("a")) {
      if (this.entry(this.ids[this.sel]).seen > 0) {
        AudioSys.sfx("confirm");
        this.detail = true;
      } else {
        AudioSys.sfx("buzz");
      }
    }
  }

  draw() {
    Gfx.clear(0);
    const killedCount = this.ids.filter((id) => this.entry(id).killed > 0).length;
    Gfx.window(4, 4, 312, 30);
    Gfx.text("モンスターずかん", 14, 12);
    Gfx.textR(`とうばつ ${killedCount}/${this.ids.length}`, 306, 12);

    if (this.detail) {
      this.drawDetail();
      return;
    }

    Gfx.window(4, 38, 312, 246);
    const view = 12;
    if (this.sel < this.scroll) this.scroll = this.sel;
    if (this.sel >= this.scroll + view) this.scroll = this.sel - view + 1;
    this.ids.slice(this.scroll, this.scroll + view).forEach((id, i) => {
      const y = 48 + i * 19;
      const idx = this.scroll + i;
      const e = this.entry(id);
      const def = DATA.monsters[id];
      const name = e.seen > 0 ? def.name : "???????";
      Gfx.text(`No.${String(idx + 1).padStart(2, "0")}`, 20, y, 1, 10);
      Gfx.text(name, 70, y, e.seen > 0 ? 3 : 1, 11);
      if (e.killed > 0) Gfx.textR(`x${e.killed}`, 300, y, 3, 10);
      if (idx === this.sel) Gfx.cursor(8, y + 3);
    });
    Gfx.text("A:くわしく  B:もどる", 100, 272, 1, 9);
  }

  drawDetail() {
    const id = this.ids[this.sel];
    const def = DATA.monsters[id];
    const e = this.entry(id);
    Gfx.window(20, 44, 280, 220);
    Gfx.draw(def.spr, 44, 64, { scale: 3, variant: def.pal });
    Gfx.text(def.name, 110, 60);
    if (def.boss) Gfx.text("ボス", 110, 78, 2, 10);
    if (def.race) Gfx.text("しゅぞく: " + { dragon: "りゅう", undead: "アンデッド", demon: "まぞく" }[def.race], 110, 94, 3, 10);
    const rows = [
      ["HP", def.hp],
      ["こうげき", def.atk],
      ["ぼうぎょ", def.def],
      ["すばやさ", def.agi],
      ["けいけんち", def.exp],
      ["ギル", def.gold],
      ["たおしたかず", e.killed],
    ];
    rows.forEach(([k, v], i) => {
      Gfx.text(String(k), 44, 126 + i * 16, 3, 10);
      Gfx.textR(String(v), 180, 126 + i * 16, 3, 10);
    });
    // じゃくてんは 1どでも たおすと ひょうじ
    const elemName = { fire: "ほのお", ice: "こおり", thunder: "かみなり", holy: "せい" };
    const fmt = (arr) => (arr || []).map((x) => elemName[x] || x).join(" ") || "なし";
    if (e.killed > 0) {
      Gfx.text("じゃくてん: " + fmt(def.weak), 196, 126, 2, 10);
      Gfx.text("たいせい: " + fmt(def.resist), 196, 146, 3, 10);
      Gfx.text("きゅうしゅう: " + fmt(def.absorb), 196, 166, 3, 10);
    } else {
      Gfx.text("じゃくてん: ??????", 196, 126, 1, 10);
      Gfx.text("(たおすと わかる)", 196, 146, 1, 9);
    }
    Gfx.text("A/B: もどる", 130, 244, 1, 9);
  }
}

// ============================================================
// クエストちょう
// ============================================================
class QuestScene {
  constructor() {
    this.opaque = true;
    this.scroll = 0;
  }

  // メインストーリーの「つぎのもくてき」(みたされていない さいしょのもの)
  objective() {
    const steps = [
      ["intro", "おうさまの めいれいを きこう"],
      ["caveBoss", "にしのどうくつを ぬけて\nミストのむらへ むかおう"],
      ["crystal", "ミストのむらの ちょうろうに あおう"],
      ["paladin", "きたのほこらで しれんを うけよう\n(クリスタルが かぎ)"],
      ["clear", "まてんろうで まおうザルバを たおそう"],
      ["magmaBoss", "みなみの おおあなの そこを しらべよう"],
      ["earthCrystal", "ちていしんでんで\nちのクリスタルを とりもどそう"],
      ["airship", "ムスペルの ドワーフに はなそう"],
      ["windCrystal", "ひこうせんで そらのしまへ。\nかぜのしんでんに いどもう"],
      ["submarine", "ドワーフに かぜのクリスタルを みせよう"],
      ["waterCrystal", "うみのそこの しんでんへ もぐろう"],
      ["trueClear", "ほしのとうで ヴォイドスを たおそう!"],
    ];
    for (const [flag, text] of steps) {
      if (!G.flag(flag)) return text;
    }
    return "せかいは すくわれた!\nかくしボスや ずかんかんせいに ちょうせん!";
  }

  quests() {
    const f = (k) => G.flag(k);
    const list = [];
    if (f("iceQuest") || f("iceBoss")) {
      list.push(["りゅうたいじ (ハンター)",
        f("iceReward") ? "かんりょう" : f("iceBoss") ? "ハンターに ほうこく" : "こおりのどうくつの りゅうを たおす"]);
    }
    if (f("magmaBoss")) {
      list.push(["かがやくいし",
        f("glowReward") ? "がくしゃに ゆずった" : f("forged") ? "つるぎに きたえた"
          : "がくしゃに ゆずるか かじやで きたえるか"]);
    }
    if (f("seaBoss")) {
      list.push(["うみのぬし たいじ",
        f("seaReward") ? "かんりょう" : "ソレイユの せんいんに ほうこく"]);
    }
    if (f("arenaBronze") || f("arenaSilver") || f("arenaGold") || f("arenaPlatinum")) {
      const rank = f("arenaPlatinum") ? "でんせつ (プラチナせいは)" : f("arenaGold") ? "チャンピオン!" : f("arenaSilver") ? "シルバーせいは" : "ブロンズせいは";
      list.push(["とうぎじょう", rank]);
    }
    if (f("summitQuest")) {
      const inv = ["inviteTwine", "inviteFrim", "inviteZahra", "inviteDverg"].filter(f).length;
      list.push(["せかいかいぎ",
        f("summitDone") ? "かいさい された!" : `おさたちに しょうたいを とどける (${inv}/4)`]);
    }
    if (f("starGate")) {
      list.push(["クレーターのぬし たいじ",
        f("craterBoss") ? "かんりょう" : "ほしのせかいの だいクレーターへ"]);
    }
    if (f("allCrystals")) {
      const gj = (f("sylphidDown") ? 1 : 0) + (f("gnomosDown") ? 1 : 0) + (f("undinaDown") ? 1 : 0);
      list.push(["げんじゅう たいじ",
        gj >= 3 ? "かんりょう" : `そら/ちてい/うみに けはい (${gj}/3)`]);
    }
    if (f("dvergQuest")) {
      list.push(["おうの いらい",
        f("dvergReward") ? "かんりょう" : `マグマトカゲたいじ (${Math.min(5, G.killsOf("firelizard"))}/5)`]);
    }
    if (f("nightBoss")) {
      const eps = ["leonEp2", "glenEp2", "gouEp2", "celiaEp2", "rodEp2"].filter(f).length;
      list.push(["ひとりひとりの あゆみ",
        eps >= 5 ? "かんりょう" : `なかまの ものがたりを たどる (${eps}/5)`]);
    }
    if (f("nightQuest")) {
      list.push(["じょおうの かなしみ",
        f("nightReward") ? "かんりょう" : f("nightBoss") ? "ノクスのまちのおさに ほうこく" : "やみのだいせいどうの おくへ"]);
    }
    if (f("duskQuest")) {
      list.push(["たそがれオオカミ たいじ",
        f("duskReward") ? "かんりょう" : `オオカミを たおす (${Math.min(4, G.killsOf("duskwolf"))}/4)`]);
    }
    if (f("stormQuest")) {
      list.push(["らいじんの いかり",
        f("stormReward") ? "かんりょう" : f("stormBoss") ? "ボルテのむらおさに ほうこく" : "らいでんのほこらの さいしんぶへ"]);
    }
    if (f("hawkQuest")) {
      list.push(["らいめいタカ たいじ",
        f("hawkReward") ? "かんりょう" : `らいめいタカを おとす (${Math.min(4, G.killsOf("thunderhawk"))}/4)`]);
    }
    if (f("ruinsQuest")) {
      list.push(["まもりがみの ぼうそう",
        f("ruinsReward") ? "かんりょう" : f("ruinsBoss") ? "リーフェのむらおさに ほうこく" : "こだいのいせきの さいしんぶへ"]);
    }
    if (f("catQuest2")) {
      list.push(["みどりのひょう たいじ",
        f("catReward2") ? "かんりょう" : `みどりのひょうを たおす (${Math.min(4, G.killsOf("junglecat"))}/4)`]);
    }
    if (f("tombQuest")) {
      list.push(["よみがえった すなのおう",
        f("tombReward") ? "かんりょう" : f("tombBoss") ? "ザハラのぞくちょうに ほうこく" : "すなのだいびょうの げんしつへ"]);
    }
    if (f("wormQuest")) {
      list.push(["すなワーム たいじ",
        f("wormReward") ? "かんりょう" : `すなワームを たおす (${Math.min(4, G.killsOf("sandworm2"))}/4)`]);
    }
    if (f("glacierQuest")) {
      list.push(["ひょうがのめがみ",
        f("glacierReward") ? "かんりょう" : f("glacierBoss") ? "フリムのむらおさに ほうこく" : "ひょうがのどうくつの さいだんへ"]);
    }
    if (f("wolfQuest")) {
      list.push(["ゆきおおかみ たいじ",
        f("wolfReward") ? "かんりょう" : `ゆきおおかみを たおす (${Math.min(3, G.killsOf("snowwolf"))}/3)`]);
    }
    if (f("twinQuest")) {
      list.push(["かがみのぬし たいじ",
        f("twinReward") ? "かんりょう" : f("mirrorBoss") ? "トワインのおさに ほうこく" : "かがみのどうくつの おくへ"]);
    }
    if (f("mirrorBoss")) {
      list.push(["とこしえのとう",
        f("chronoBoss") ? "ときのばんにんを しずめた" : "ふういんのとけた とうの ちょうじょうへ"]);
    }
    if (f("garonSeen")) {
      list.push(["けんおうガロン",
        f("garonBeat") ? "かんりょう" : "しれんのやまの ちょうじょうで さいせん"]);
    }
    if (f("trueClear")) {
      const rush = (f("rush1") ? 1 : 0) + (f("rush2") ? 1 : 0) + (f("rush3") ? 1 : 0);
      list.push(["けいしょうのま",
        rush >= 3 ? "ぜんみち せいは!" : `ボスれんせんに いどむ (${rush}/3)`]);
    }
    if (f("phantomBoss")) {
      list.push(["まぼろしのしろ", "おうのけんを うけついだ"]);
    }
    if (f("craterBoss")) {
      list.push(["ほしのはか",
        f("graveBoss") ? "ぬしを しずめた" : "ふういんの とけた はかの さいしんぶへ"]);
    }
    if (f("stellaQuest")) {
      list.push(["まいごのステラ",
        f("stellaDone") ? "かんりょう" : f("stellaFound") ? "ちょうろうに ほうこく" : "クレーターのおくで ステラをさがす"]);
    }
    if (f("worldtearGiven")) list.push(["ちょうろうの おくりもの", "せかいのしずくを さずかった"]);
    if (f("catQuest")) {
      const cats = ["cat1", "cat2", "cat3", "cat4", "cat5"].filter(f).length;
      list.push(["ねこあつめ",
        f("catDone") ? "かんりょう" : `とくべつな ねこを なでる (${cats}/5)`]);
    }
    if (f("hideSeek")) {
      list.push(["むらの かくれんぼ",
        f("hideSeekDone") ? "かんりょう" : "きのちかくに かくれた モコをさがす"]);
    }
    if (f("fishKing")) list.push(["つりぼりの ぬし", "つりあげた!"]);
    if (f("forestBoss")) list.push(["まよいのもりの ぬし", "とうばつ かんりょう"]);
    if (f("clear")) list.push(["じょうの ふっこう",
      f("castleReward") ? "ほうしょう うけとりずみ"
        : f("castleFund") ? "しえんずみ (おうきゅうに みせ)"
        : "ぶかんちょうが しきんを さがしている"]);
    if (f("superBoss")) list.push(["しんえんりゅう ヴァハ", "とうばつ! でんせつの ゆうしゃ"]);
    // なかまの こじんイベント
    if (f("paladin")) list.push(["グレンと いもうと",
      f("glenEvent") ? "かんりょう" : "バロンじょうに だれか きている"]);
    if (f("earthCrystal")) list.push(["ゴウの しゅぎょう",
      f("gouEvent") ? "かんりょう" : "ソレイユに みおぼえのある かげ"]);
    if (f("windCrystal")) list.push(["セリアの おもいで",
      f("celiaEvent") ? "かんりょう" : "ミストのむらに シスターが"]);
    if (f("underOpen")) list.push(["ロッドの おんし",
      f("rodEvent") ? "かんりょう" : "ムスペルのやどに けんきゅうかが"]);
    return list;
  }

  update() {
    const qn = this.quests().length;
    const maxScroll = Math.max(0, qn - 6);
    if (Input.tap("up")) { this.scroll = Math.max(0, this.scroll - 1); if (qn > 6) AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.scroll = Math.min(maxScroll, this.scroll + 1); if (qn > 6) AudioSys.sfx("cursor"); }
    if (Input.tap("a") || Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); }
  }

  draw() {
    Gfx.clear(0);
    Gfx.window(4, 4, 312, 30);
    Gfx.text("クエストちょう", 14, 12);

    Gfx.window(4, 38, 312, 72);
    Gfx.text("▼ つぎのもくてき", 14, 44, 2, 10);
    this.objective().split("\n").forEach((l, i) => Gfx.text(l, 20, 62 + i * 16, 3, 11));

    Gfx.window(4, 114, 312, 154);
    Gfx.text("▼ サブクエスト", 14, 120, 2, 10);
    const qs = this.quests();
    if (qs.length === 0) Gfx.text("(まだ なにも うけていない)", 24, 140, 1, 10);
    const view = 6;
    qs.slice(this.scroll, this.scroll + view).forEach(([name, state], i) => {
      const y = 140 + i * 21;
      Gfx.text(name, 20, y, 3, 10);
      Gfx.textR(state, 300, y, state === "かんりょう" ? 1 : 2, 9);
    });
    // スクロールできる ほうこうを しるしで
    if (this.scroll > 0) Gfx.text("▲", 152, 128, 2, 9);
    if (this.scroll + view < qs.length) Gfx.text("▼", 152, 262, 2, 9);
    Gfx.text(qs.length > view ? "↑↓:スクロール A/B:もどる" : "A/B: もどる", 100, 272, 1, 9);
  }
}

// ============================================================
// つりぼり ミニゲーム
// ============================================================
class FishingScene {
  constructor(price, onDone) {
    this.opaque = false;
    this.price = price;
    this.onDone = onDone || null;
    this.state = "ask";   // ask / wait / bite / result
    this.t = 0;
    this.waitDur = 0;
    this.resultText = "";
    this.bobX = 0;
  }

  // つれるものの ちゅうせん
  rollCatch() {
    const r = Math.random();
    if (r < 0.05) {
      G.setFlag("fishKing", 1);
      G.state.gold += 2000;
      AudioSys.sfx("levelup");
      return "ぬしの おおものだ!! 2000ギル!!";
    }
    if (r < 0.18) { G.state.gold += 500; AudioSys.sfx("chest"); return "おうごんダイ! 500ギル!"; }
    if (r < 0.55) { G.state.gold += 100; AudioSys.sfx("chest"); return "しろマスを つった! 100ギル!"; }
    AudioSys.sfx("cancel");
    return "ながぐつ だった……。";
  }

  update(dt) {
    this.t += dt;
    if (this.state === "ask") {
      if (Input.tap("a")) {
        if (G.state.gold < this.price) {
          AudioSys.sfx("buzz");
          this.resultText = "おかねが たりない!";
          this.state = "result";
          this.t = 0;
          return;
        }
        G.state.gold -= this.price;
        AudioSys.sfx("confirm");
        this.state = "wait";
        this.t = 0;
        this.waitDur = 1.2 + Math.random() * 2;
      } else if (Input.tap("b")) {
        AudioSys.sfx("cancel");
        G.pop();
        if (this.onDone) this.onDone();
      }
      return;
    }
    if (this.state === "wait") {
      this.bobX = Math.sin(this.t * 3) * 4;
      if (Input.tap("a")) {
        // はやすぎ
        this.resultText = "はやすぎた…… さかなに にげられた。";
        AudioSys.sfx("cancel");
        this.state = "result";
        this.t = 0;
        return;
      }
      if (this.t >= this.waitDur) {
        this.state = "bite";
        this.t = 0;
        AudioSys.sfx("encounter");
      }
      return;
    }
    if (this.state === "bite") {
      if (Input.tap("a")) {
        this.resultText = this.rollCatch();
        this.state = "result";
        this.t = 0;
        return;
      }
      if (this.t > 0.55) {
        this.resultText = "あたりを のがした……。";
        AudioSys.sfx("cancel");
        this.state = "result";
        this.t = 0;
      }
      return;
    }
    if (this.state === "result") {
      if (this.t > 0.6 && (Input.tap("a") || Input.tap("b"))) {
        AudioSys.sfx("cursor");
        this.state = "ask";
        this.t = 0;
      }
    }
  }

  draw() {
    // うみの まど
    Gfx.window(60, 56, 200, 120);
    for (let ty = 0; ty < 6; ty++) {
      for (let tx = 0; tx < 11; tx++) {
        Gfx.draw("water", 68 + tx * 16, 66 + ty * 16);
      }
    }
    const c = Gfx.ctx;
    if (this.state === "wait" || this.state === "bite") {
      // うき
      c.fillStyle = PAL[3];
      c.fillRect(156 + Math.round(this.bobX), this.state === "bite" ? 124 : 118, 6, 6);
      if (this.state === "bite") {
        c.font = "bold 22px 'MS Gothic', monospace";
        c.fillStyle = PAL[3];
        c.fillText("!", 176, 92);
      }
    }

    Gfx.window(4, 218, 312, 66);
    if (this.state === "ask") {
      Gfx.text(`1かい ${this.price}ギル (しょじ ${G.state.gold}G)`, 14, 228);
      Gfx.text("A: つりざおを たらす  B: やめる", 14, 248, 3, 11);
    } else if (this.state === "wait") {
      Gfx.text("……………", 14, 228);
      Gfx.text("(「!」が でたら すかさず A!)", 14, 248, 1, 10);
    } else if (this.state === "bite") {
      Gfx.text("きた!!", 14, 228);
    } else {
      Gfx.text(this.resultText, 14, 228);
      if (this.t > 0.6) Gfx.text("A: もういちど  B: やめる", 14, 248, 1, 10);
    }
  }
}

// ============================================================
// ショップ
// ============================================================
class ShopScene {
  constructor(shopId, onDone) {
    this.opaque = false;
    this.shop = DATA.shops[shopId];
    this.onDone = onDone;
    this.state = "root";
    this.sel = 0;
    this.sub = 0;
    this.scroll = 0;
    this.notice = "いらっしゃい! なにをお のぞみだい?";
  }

  update() {
    if (this.state === "root") {
      const opts = 3;
      if (Input.tap("up")) { this.sel = (this.sel + opts - 1) % opts; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel = (this.sel + 1) % opts; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { this.close(); return; }
      if (Input.tap("a")) {
        AudioSys.sfx("confirm");
        if (this.sel === 0) { this.state = "buy"; this.sub = 0; this.scroll = 0; this.notice = "どれに するんだい?"; }
        else if (this.sel === 1) { this.state = "sell"; this.sub = 0; this.scroll = 0; this.notice = "なにを うるんだい?"; }
        else this.close();
      }
    } else if (this.state === "buy") {
      const stock = this.shop.stock;
      if (Input.tap("up")) { this.sub = (this.sub + stock.length - 1) % stock.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sub = (this.sub + 1) % stock.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "root"; this.notice = "ほかに ようは あるかい?"; return; }
      if (Input.tap("a")) {
        const id = stock[this.sub];
        const def = DATA.items[id];
        if (G.state.gold < def.price) {
          AudioSys.sfx("buzz");
          this.notice = "おかねが たりないよ!";
        } else {
          G.state.gold -= def.price;
          G.addItem(id);
          AudioSys.sfx("chest");
          this.notice = `${def.name}を おかいあげ! まいど!`;
        }
      }
    } else if (this.state === "sell") {
      const items = itemList().filter((it) => it.def.price > 0);
      if (items.length === 0) {
        this.notice = "うれるものが ないみたいだね";
        if (Input.tap("b") || Input.tap("a")) { AudioSys.sfx("cancel"); this.state = "root"; }
        return;
      }
      if (Input.tap("up")) { this.sub = (this.sub + items.length - 1) % items.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sub = (this.sub + 1) % items.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "root"; this.notice = "ほかに ようは あるかい?"; return; }
      if (Input.tap("a")) {
        const it = items[Math.min(this.sub, items.length - 1)];
        const gain = Math.floor(it.def.price / 2);
        G.removeItem(it.id);
        G.state.gold += gain;
        AudioSys.sfx("chest");
        this.notice = `${it.def.name}を ${gain}ギルで かいとったよ`;
        const after = itemList().filter((x) => x.def.price > 0);
        if (this.sub >= after.length) this.sub = Math.max(0, after.length - 1);
      }
    }
  }

  close() {
    AudioSys.sfx("cancel");
    G.pop();
    if (this.onDone) this.onDone();
  }

  draw() {
    Gfx.window(4, 4, 312, 40);
    Gfx.text(this.notice, 14, 12, 3, 11);
    Gfx.text(this.shop.name, 14, 27, 3, 9);
    Gfx.textR(`${G.state.gold} ギル`, 306, 12);

    if (this.state === "root") {
      Gfx.window(4, 48, 100, 70);
      ["かう", "うる", "でる"].forEach((c, i) => Gfx.text(c, 28, 58 + i * 18));
      Gfx.cursor(14, 61 + this.sel * 18);
    } else if (this.state === "buy") {
      const stock = this.shop.stock;
      Gfx.window(4, 48, 312, 214);
      const view = 10;
      if (this.sub < this.scroll) this.scroll = this.sub;
      if (this.sub >= this.scroll + view) this.scroll = this.sub - view + 1;
      stock.slice(this.scroll, this.scroll + view).forEach((id, i) => {
        const def = DATA.items[id];
        const y = 58 + i * 19;
        Gfx.text(def.name, 32, y);
        Gfx.textR(def.price + "G", 250, y);
        Gfx.textR("x" + (G.state.items[id] || 0), 300, y, 3, 10);
        if (this.scroll + i === this.sub) Gfx.cursor(18, y + 3);
      });
      const def = DATA.items[stock[this.sub]];
      const desc = def.desc ||
        (def.kind === "weapon" ? `こうげき+${def.atk}` : def.kind === "armor" ? `ぼうぎょ+${def.def}` : "");
      Gfx.window(4, 262, 312, 22);
      Gfx.text(desc, 14, 267, 3, 10);
    } else if (this.state === "sell") {
      const items = itemList().filter((it) => it.def.price > 0);
      Gfx.window(4, 48, 312, 214);
      const view = 10;
      if (this.sub < this.scroll) this.scroll = this.sub;
      if (this.sub >= this.scroll + view) this.scroll = this.sub - view + 1;
      items.slice(this.scroll, this.scroll + view).forEach((it, i) => {
        const y = 58 + i * 19;
        Gfx.text(it.def.name, 32, y);
        Gfx.textR("x" + it.count, 220, y);
        Gfx.textR(Math.floor(it.def.price / 2) + "G", 300, y);
        if (this.scroll + i === this.sub) Gfx.cursor(18, y + 3);
      });
    }
  }
}
