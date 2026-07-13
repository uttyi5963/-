// ============================================================
// クリスタルナイツ - フィールドメニュー / ショップ
// ============================================================

function itemList() {
  return Object.entries(G.state.items).map(([id, count]) => ({ id, count, def: DATA.items[id] }));
}

// フィールドでのアイテムこうか。つかえたら メッセージ、だめなら null
function applyFieldItem(def, hero) {
  if (def.statHp) {
    if (hero.hp <= 0) return null;
    hero.bonusHp = (hero.bonusHp || 0) + def.statHp;
    G.applyStats(hero);
    hero.hp = Math.min(hero.maxhp, hero.hp + def.statHp);
    return `${hero.name}の 最大HPが ${def.statHp} あがった!`;
  }
  if (def.statMp) {
    if (hero.hp <= 0) return null;
    hero.bonusMp = (hero.bonusMp || 0) + def.statMp;
    G.applyStats(hero);
    hero.mp = Math.min(hero.maxmp, hero.mp + def.statMp);
    return `${hero.name}の 最大MPが ${def.statMp} あがった!`;
  }
  if (def.partyheal) {
    G.state.party.forEach((h) => {
      if (h.hp > 0) {
        h.hp = h.maxhp; h.mp = h.maxmp;
        Object.keys(DATA.statuses).forEach((s) => { h[s] = false; });
      }
    });
    return "仲間ぜんいんが 完全に 回復した!";
  }
  if (def.elixir) {
    if (hero.hp <= 0) return null;
    hero.hp = hero.maxhp;
    hero.mp = hero.maxmp;
    return `${hero.name}の HPとMPが 完全に 回復した!`;
  }
  if (def.heal) {
    if (hero.hp <= 0) return null;
    hero.hp = Math.min(hero.maxhp, hero.hp + def.heal);
    return `${hero.name}の HPが 回復した!`;
  }
  if (def.mp) {
    if (hero.hp <= 0) return null;
    hero.mp = Math.min(hero.maxmp, hero.mp + def.mp);
    return `${hero.name}の MPが 回復した!`;
  }
  if (def.revive) {
    if (hero.hp > 0) return null;
    hero.hp = Math.max(1, Math.floor(hero.maxhp * def.revive));
    return `${hero.name}は 生き返った!`;
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
    return "仲間ぜんいんの HPが 回復した!";
  }
  if (spell.type === "heal") {
    if (target.hp <= 0) return null;
    target.hp = Math.min(target.maxhp, target.hp + G.calcHeal(caster, spell));
    return `${target.name}の HPが 回復した!`;
  }
  if (spell.type === "revive") {
    if (target.hp > 0) return null;
    target.hp = Math.max(1, Math.floor(target.maxhp * spell.pow));
    return `${target.name}は 生き返った!`;
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
    this.commands = ["強さ", "呪文", "道具", "そうび", "たいれつ", "図鑑", "クエスト", "せってい", "パスワード", "セーブ", "ちず"];
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
      if (cmd === "強さ") { this.state = "heroPick"; this.mode = "status"; this.sub = 0; }
      else if (cmd === "呪文") { this.state = "heroPick"; this.mode = "spell"; this.sub = 0; }
      else if (cmd === "道具") { this.state = "item"; this.sub = 0; this.scroll = 0; }
      else if (cmd === "そうび") { this.state = "heroPick"; this.mode = "equip"; this.sub = 0; }
      else if (cmd === "たいれつ") { this.state = "heroPick"; this.mode = "row"; this.sub = 0; }
      else if (cmd === "図鑑") { G.push(new BestiaryScene()); }
      else if (cmd === "クエスト") { G.push(new QuestScene()); }
      else if (cmd === "ちず") { G.push(new MapScene()); }
      else if (cmd === "せってい") {
        G.push(new ConfigScene());
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
          else G.push(new MessageScene("セーブに 失敗した……"));
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
      if (it.def.escape) {
        const w = G.state.lastWorld;
        if (!w || /^(world\d*|underworld|starworld)$/.test(G.state.map)) { AudioSys.sfx("buzz"); return; }
        AudioSys.sfx("confirm");
        G.removeItem(it.id);
        G.pop();
        G.fade(() => {
          G.state.map = w.map; G.state.x = w.x; G.state.y = w.y;
          const f = G.scenes.find((s) => s instanceof FieldScene);
          if (f) f.loadMap();
        });
        return;
      }
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
        // 連続使用: ざいこが あるかぎり ターゲット選択に とどまる
        if ((G.state.items[this.pendingItem.id] || 0) > 0) return;
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
    this.nav(3, "sel2");
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "heroPick"; return; }
    if (Input.tap("a")) {
      this.slot = ["weapon", "armor", "acc"][this.sel2];
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
      const old = h[this.slot];
      if (old) G.addItem(old);
      G.removeItem(it.id);
      h[this.slot] = it.id;
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
      Gfx.text(c, 226, 11 + i * 16, 3, 11);
    });
    if (this.state === "main") Gfx.cursor(212, 14 + this.sel * 16);

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
    Gfx.text("道具", 32, 48);
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
    Gfx.text(`${this.picked.name}の 呪文`, 32, 48);
    if (spells.length === 0) Gfx.text("フィールドで つかえる 呪文が ない", 40, 76, 3, 10);
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
    const cname = h.acc ? DATA.items[h.acc].name : "なし";
    Gfx.text("ぶき  : " + wname, 48, 70);
    Gfx.text("よろい: " + aname, 48, 88);
    Gfx.text("アクセ: " + cname, 48, 106);
    Gfx.text(`攻撃 ${G.atkOf(h)}  防御 ${G.defOf(h)}`, 48, 126, 3, 10);
    if (this.state === "equipSlot") {
      Gfx.cursor(34, 73 + this.sel2 * 18);
    } else {
      const cands = this.equipCandidates(h, this.slot);
      const view = 5;
      const start = Math.max(0, Math.min(this.sel3 - (view - 1), cands.length - view));
      cands.slice(start, start + view).forEach((it, i) => {
        const y = 144 + i * 18;
        const stat = it.def.kind === "weapon" ? `攻撃${it.def.atk}`
          : it.def.kind === "armor" ? `防御${it.def.def}` : (it.def.tag || "");
        Gfx.text(it.def.name, 60, y, 3, 11);
        Gfx.textR(stat, 280, y, 3, 10);
        if (start + i === this.sel3) Gfx.cursor(46, y + 3);
      });
      if (start > 0) Gfx.text("▲", 286, 144, 3, 10);
      if (start + view < cands.length) Gfx.text("▼", 286, 144 + (view - 1) * 18, 3, 10);
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
      ["ちから", G.strOf(h)],
      ["素早さ", G.agiOf(h)],
      ["体力", G.vitOf(h)],
      ["知性", G.intOf(h)],
      ["攻撃", G.atkOf(h)],
      ["防御", G.defOf(h)],
      ["熟練度", `${h.prof || 0} / 99`],
      ["経験値", h.exp],
      ["つぎのレベルまで", Math.max(0, G.expTotalFor(h.lv + 1) - h.exp)],
    ];
    rows.forEach(([k, v], i) => {
      Gfx.text(String(k), 44, 84 + i * 16, 3, 11);
      Gfx.textR(String(v), 276, 84 + i * 16, 3, 11);
    });
  }
}

// ============================================================
// モンスター図鑑
// ============================================================
// ---------------- 殿堂の間 (実績 いちらん) ----------------
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
    const arena = f("arenaDiamond") ? "ダイヤモンド" : f("arenaPlatinum") ? "プラチナ" : f("arenaGold") ? "ゴールド" : f("arenaSilver") ? "シルバー" : f("arenaBronze") ? "ブロンズ" : "みせいは";
    return [
      ["魔王 ザルバを 倒した", f("clear")],
      ["しんのてき ヴォイドスを 倒した", f("trueClear")],
      ["深淵竜 ヴァハを 倒した", f("superBoss")],
      ["星々の王 グランステラ", f("graveBoss")],
      ["拳王 ガロンに かった", f("garonBeat")],
      [`かくちの ぬしを しずめた (${lords}/6)`, lords >= 6],
      [`幻獣を たいじした (${genju}/3)`, genju >= 3],
      ["世界会議を ひらいた", f("summitDone")],
      [`闘技場 さいこうい: ${arena}`, f("arenaPlatinum")],
      ["ねこあつめを かんせいさせた", f("catDone")],
      [`図鑑に とうろくした (${seen}/${monsTotal})`, seen >= monsTotal],
      [`宝箱を あけた (${chests}こ)`, chests >= 60],
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
    Gfx.text("〜 英雄の きろく 〜", 92, 14, 3, 13);
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
    Gfx.text("モンスター図鑑", 14, 12);
    Gfx.textR(`討伐 ${killedCount}/${this.ids.length}`, 306, 12);

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

  // せいそく地: エンカウントテーブルから マップ名を 逆引き
  habitatsOf(id) {
    const regions = [];
    for (const [tid, t] of Object.entries(DATA.encounters)) {
      const groups = t.groups || [];
      const inGroups = groups.some((g) => g.includes(id));
      const inRare = t.rare && t.rare.id === id;
      if (!inGroups && !inRare) continue;
      let nm = null;
      for (const mp of Object.values(DATA.maps)) {
        if (mp.encounter === tid || (mp.zones || []).some((z) => z.table === tid)) {
          nm = mp.name.replace(/\s*(B?\d+F|さいじょうかい|1F)$/, "");
          break;
        }
      }
      if (nm && !regions.includes(nm)) regions.push(nm);
    }
    return regions;
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
      ["攻撃", def.atk],
      ["防御", def.def],
      ["素早さ", def.agi],
      ["経験値", def.exp],
      ["ギル", def.gold],
      ["倒したかず", e.killed],
    ];
    rows.forEach(([k, v], i) => {
      Gfx.text(String(k), 44, 126 + i * 16, 3, 10);
      Gfx.textR(String(v), 180, 126 + i * 16, 3, 10);
    });
    // じゃくてんは 1どでも 倒すと ひょうじ
    const elemName = { fire: "ほのお", ice: "こおり", thunder: "雷", holy: "せい" };
    const fmt = (arr) => (arr || []).map((x) => elemName[x] || x).join(" ") || "なし";
    if (e.killed > 0) {
      Gfx.text("じゃくてん: " + fmt(def.weak), 196, 126, 2, 10);
      Gfx.text("たいせい: " + fmt(def.resist), 196, 146, 3, 10);
      Gfx.text("きゅうしゅう: " + fmt(def.absorb), 196, 166, 3, 10);
    } else {
      Gfx.text("じゃくてん: ??????", 196, 126, 1, 10);
      Gfx.text("(倒すと わかる)", 196, 146, 1, 9);
    }
    // せいそく地 (1どでも 見かけたら ひょうじ)
    if (e.seen > 0) {
      const hab = this.habitatsOf(id);
      const label = hab.length > 0
        ? hab.slice(0, 2).join("、") + (hab.length > 2 ? " など" : "")
        : (def.boss ? "(ボス)" : "?????");
      Gfx.text("せいそく: " + label, 44, 226, 3, 9);
    }
    Gfx.text("A/B: もどる", 130, 246, 1, 9);
  }
}

// ============================================================
// ワールドちず (メニューの「ちず」)
class MapScene {
  constructor() {
    this.t = 0;
    // 屋外や ひろい ダンジョンは そのまま、せまい 屋内は さいごの ワールドを うつす
    const cur = DATA.maps[G.state.map];
    if (cur.outdoor || cur.rows[0].length >= 14) {
      this.mapId = G.state.map;
      this.px = G.state.x; this.py = G.state.y;
    } else if (G.state.lastWorld) {
      this.mapId = G.state.lastWorld.map;
      this.px = G.state.lastWorld.x; this.py = G.state.lastWorld.y;
    } else {
      this.mapId = null;
    }
  }
  update(dt) {
    this.t += dt;
    if (Input.tap("a") || Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); }
  }
  draw() {
    Gfx.window(10, 10, 300, 268);
    if (!this.mapId) {
      Gfx.text("この あたりの ちずは ない。", 60, 130, 3, 12);
      Gfx.textR("A/Bで とじる", 292, 254, 1, 10);
      return;
    }
    const m = DATA.maps[this.mapId];
    const w = m.rows[0].length, h = m.rows.length;
    const s = Math.max(2, Math.min(8, Math.floor(272 / w), Math.floor(216 / h)));
    const ox = 160 - (w * s) / 2, oy = 34 + (212 - h * s) / 2;
    const c = Gfx.ctx;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const t = m.legend[m.rows[y][x]];
        if (!t) continue;
        let col;
        switch (t.tile) {
          case "water": case "water2": col = PAL[2]; break;
          case "mountain": col = PAL[3]; break;
          case "forest": case "pine": case "palm": case "deadtree": col = PAL[1]; break;
          case "grass": case "sand": case "snow": case "path": case "scree":
          case "nightgrass": case "flower": case "bridge":
          case "floor": case "carpet": col = PAL[0]; break;
          case "wall": case "pillar": col = PAL[2]; break;
          default: col = PAL[3]; // まち/ほこら などの アイコンは こいマーカー
        }
        c.fillStyle = col;
        c.fillRect(ox + x * s, oy + y * s, s, s);
      }
    }
    // げんざいち (てんめつする ひかり)
    if (Math.floor(this.t * 3) % 2 === 0) {
      c.fillStyle = PAL[3];
      c.fillRect(ox + this.px * s - 1, oy + this.py * s - 1, s + 2, s + 2);
      c.fillStyle = PAL[0];
      c.fillRect(ox + this.px * s, oy + this.py * s, s, s);
    }
    Gfx.text(m.name, 24, 18);
    Gfx.textR("A/Bで とじる", 292, 18, 1, 10);
  }
}

// クエストちょう
// ============================================================
class QuestScene {
  constructor() {
    this.opaque = true;
    this.scroll = 0;
    this.mode = "quest"; // quest / stats (←→で きりかえ)
  }

  // ぼうけんのきろく (プレイ統計)
  statsRows() {
    const f = (k) => !!G.flag(k);
    const kills = Object.values(G.state.bestiary || {}).reduce((a, e) => a + (e.killed || 0), 0);
    const seen = Object.keys(G.state.bestiary || {}).length;
    const chests = Object.keys(G.state.flags || {}).filter((k) => k.indexOf("chest_") === 0).length;
    const quests = this.quests().filter(([, st]) =>
      st.includes("かんりょう") || st.includes("討伐") || st.includes("つりあげた") || st.includes("さずかった")).length;
    const maxProf = Math.max(0, ...G.state.party.map((h) => h.prof || 0));
    const nushi = ["fishKing", "lakeKing", "nightKing"].filter(f).length;
    const pmin = Math.floor((G.state.playtime || 0) / 60);
    return [
      ["現在の章", G.currentChapter()],
      ["プレイ時間", `${Math.floor(pmin / 60)}じかん${pmin % 60}ふん`],
      ["しょじきん", `${G.state.gold} ギル`],
      ["討伐そうすう", `${kills} たい`],
      ["図鑑とうろく", `${seen} / ${Object.keys(DATA.monsters).length} 種`],
      ["宝箱はっけん", `${chests} こ`],
      ["クエスト達成", `${quests} けん`],
      ["さいこう熟練度", `${maxProf} / 99`],
      ["ぬし釣り", `${nushi} / 3 たい`],
      ["パーティ", `${G.state.party.length} にん`],
    ];
  }

  // メインストーリーの「つぎのもくてき」(みたされていない さいしょのもの)
  objective() {
    const steps = [
      ["intro", "王様の めいれいを きこう"],
      ["caveBoss", "にしの洞窟を ぬけて\nミストのむらへ むかおう"],
      ["crystal", "ミストのむらの 長老に あおう"],
      ["paladin", "きたのほこらで 試練を うけよう\n(クリスタルが 鍵)"],
      ["clear", "まてんろうで 魔王ザルバを たおそう"],
      ["magmaBoss", "みなみの おおあなの そこを しらべよう"],
      ["earthCrystal", "地底神殿で\nちのクリスタルを とりもどそう"],
      ["airship", "ムスペルの ドワーフに はなそう"],
      ["windCrystal", "ひこうせんで 空の島へ。\n風の神殿に いどもう"],
      ["submarine", "ドワーフに 風のクリスタルを みせよう"],
      ["waterCrystal", "海の底の 神殿へ もぐろう"],
      ["trueClear", "星のとうで ヴォイドスを たおそう!"],
    ];
    for (const [flag, text] of steps) {
      if (!G.flag(flag)) return text;
    }
    return "世界は すくわれた!\nかくしボスや 図鑑かんせいに 挑戦!";
  }

  quests() {
    const f = (k) => G.flag(k);
    const list = [];
    if (f("iceQuest") || f("iceBoss")) {
      list.push(["りゅうたいじ (ハンター)",
        f("iceReward") ? "かんりょう" : f("iceBoss") ? "ハンターに ほうこく" : "氷の洞窟の りゅうを 倒す"]);
    }
    if (f("magmaBoss")) {
      list.push(["輝く石",
        f("glowReward") ? "がくしゃに ゆずった" : f("forged") ? "つるぎに きたえた"
          : "がくしゃに ゆずるか 鍛冶屋で きたえるか"]);
    }
    if (f("seaBoss")) {
      list.push(["海のぬし たいじ",
        f("seaReward") ? "かんりょう" : "ソレイユの せんいんに ほうこく"]);
    }
    if (f("arenaBronze") || f("arenaSilver") || f("arenaGold") || f("arenaPlatinum")) {
      const rank = f("arenaPlatinum") ? "伝説 (プラチナせいは)" : f("arenaGold") ? "チャンピオン!" : f("arenaSilver") ? "シルバーせいは" : "ブロンズせいは";
      list.push(["闘技場", rank]);
    }
    if (f("summitQuest")) {
      const inv = ["inviteTwine", "inviteFrim", "inviteZahra", "inviteDverg"].filter(f).length;
      list.push(["世界会議",
        f("summitDone") ? "開催 された!" : `おさたちに 招待を とどける (${inv}/4)`]);
    }
    if (f("starGate")) {
      list.push(["クレーターのぬし たいじ",
        f("craterBoss") ? "かんりょう" : "星の世界の だいクレーターへ"]);
    }
    if (f("allCrystals")) {
      const gj = (f("sylphidDown") ? 1 : 0) + (f("gnomosDown") ? 1 : 0) + (f("undinaDown") ? 1 : 0);
      list.push(["幻獣 たいじ",
        gj >= 3 ? "かんりょう" : `そら/地底/うみに けはい (${gj}/3)`]);
    }
    if (f("dvergQuest")) {
      list.push(["おうの 依頼",
        f("dvergReward") ? "かんりょう" : `マグマトカゲたいじ (${Math.min(5, G.killsOf("firelizard"))}/5)`]);
    }
    if (f("dockQuest")) {
      list.push(["船着き場の こまりごと",
        f("dockDone") ? "かんりょう" : `コウモリたいじ (${Math.min(5, G.killsOf("bat"))}/5)`]);
    }
    if (f("nightBoss")) {
      const eps = ["leonEp2", "glenEp2", "gouEp2", "celiaEp2", "rodEp2"].filter(f).length;
      list.push(["ひとりひとりの あゆみ",
        eps >= 5 ? "かんりょう" : `仲間の 物語を たどる (${eps}/5)`]);
    }
    if (f("trueClear") && ["leonEp2", "glenEp2", "gouEp2", "celiaEp2", "rodEp2"].every(f)) {
      const eps3 = ["leonEp3", "glenEp3", "gouEp3", "celiaEp3", "rodEp3"].filter(f).length;
      list.push(["きわみへの あゆみ",
        eps3 >= 5 ? "かんりょう" : `師との 語らい (${eps3}/5)`]);
    }
    if (f("nightQuest")) {
      list.push(["女王の かなしみ",
        f("nightReward") ? "かんりょう" : f("nightBoss") ? "ノクスのまちのおさに ほうこく" : "闇の大聖堂の おくへ"]);
    }
    if (f("shardQuest")) {
      list.push(["星のかけら あつめ",
        f("shardDone") ? "かんりょう" : `かけらを さがす (${G.state.items.star_shard || 0}/3)`]);
    }
    if (f("duskQuest")) {
      list.push(["たそがれオオカミ たいじ",
        f("duskReward") ? "かんりょう" : `オオカミを 倒す (${Math.min(4, G.killsOf("duskwolf"))}/4)`]);
    }
    if (f("stormQuest")) {
      list.push(["らいじんの いかり",
        f("stormReward") ? "かんりょう" : f("stormBoss") ? "ボルテのむらおさに ほうこく" : "雷電のほこらの さいしんぶへ"]);
    }
    if (f("hawkQuest")) {
      list.push(["らいめいタカ たいじ",
        f("hawkReward") ? "かんりょう" : `らいめいタカを おとす (${Math.min(4, G.killsOf("thunderhawk"))}/4)`]);
    }
    if (f("ruinsQuest")) {
      list.push(["守り神の ぼうそう",
        f("ruinsReward") ? "かんりょう" : f("ruinsBoss") ? "リーフェのむらおさに ほうこく" : "こだいのいせきの さいしんぶへ"]);
    }
    if (f("catQuest2")) {
      list.push(["緑のヒョウ たいじ",
        f("catReward2") ? "かんりょう" : `緑のヒョウを 倒す (${Math.min(4, G.killsOf("junglecat"))}/4)`]);
    }
    if (f("tombQuest")) {
      list.push(["よみがえった 砂の王",
        f("tombReward") ? "かんりょう" : f("tombBoss") ? "ザハラのぞくちょうに ほうこく" : "すなのだいびょうの げんしつへ"]);
    }
    if (f("wormQuest")) {
      list.push(["砂ワーム たいじ",
        f("wormReward") ? "かんりょう" : `砂ワームを 倒す (${Math.min(4, G.killsOf("sandworm2"))}/4)`]);
    }
    if (f("glacierQuest")) {
      list.push(["ひょうがのめがみ",
        f("glacierReward") ? "かんりょう" : f("glacierBoss") ? "フリムのむらおさに ほうこく" : "ひょうがの洞窟の さいだんへ"]);
    }
    if (f("wolfQuest")) {
      list.push(["雪オオカミ たいじ",
        f("wolfReward") ? "かんりょう" : `雪オオカミを 倒す (${Math.min(3, G.killsOf("snowwolf"))}/3)`]);
    }
    if (f("twinQuest")) {
      list.push(["かがみのぬし たいじ",
        f("twinReward") ? "かんりょう" : f("mirrorBoss") ? "トワインのおさに ほうこく" : "かがみの洞窟の おくへ"]);
    }
    if (f("mirrorBoss")) {
      list.push(["とこしえのとう",
        f("chronoBoss") ? "時の番人を しずめた" : "封印のとけた とうの 頂上へ"]);
    }
    if (f("garonSeen")) {
      list.push(["拳王ガロン",
        f("garonBeat") ? "かんりょう" : "試練の山の 頂上で さいせん"]);
    }
    if (f("trueClear")) {
      const rush = (f("rush1") ? 1 : 0) + (f("rush2") ? 1 : 0) + (f("rush3") ? 1 : 0);
      list.push(["継承の間",
        rush >= 3 ? "ぜんみち せいは!" : `ボスれんせんに いどむ (${rush}/3)`]);
    }
    if (f("phantomBoss")) {
      list.push(["幻のしろ", "おうのけんを うけついだ"]);
    }
    if (f("craterBoss")) {
      list.push(["星のはか",
        f("graveBoss") ? "ぬしを しずめた" : "封印の とけた はかの さいしんぶへ"]);
    }
    if (f("stellaQuest")) {
      list.push(["まいごのステラ",
        f("stellaDone") ? "かんりょう" : f("stellaFound") ? "長老に ほうこく" : "クレーターのおくで ステラをさがす"]);
    }
    if (f("worldtearGiven")) list.push(["長老の おくりもの", "世界のしずくを さずかった"]);
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
    if (f("forestBoss")) list.push(["まよいの森の ぬし", "討伐 かんりょう"]);
    if (f("clear")) list.push(["じょうの ふっこう",
      f("castleReward") ? "ほうしょう うけとりずみ"
        : f("castleFund") ? "しえんずみ (王宮に みせ)"
        : "ぶかんちょうが しきんを さがしている"]);
    if (f("superBoss")) list.push(["深淵竜 ヴァハ", "討伐! 伝説の 勇者"]);
    // 仲間の こじんイベント
    if (f("paladin")) list.push(["グレンと いもうと",
      f("glenEvent") ? "かんりょう" : "バロン城に だれか きている"]);
    if (f("earthCrystal")) list.push(["ゴウの 修行",
      f("gouEvent") ? "かんりょう" : "ソレイユに みおぼえのある かげ"]);
    if (f("windCrystal")) list.push(["セリアの おもいで",
      f("celiaEvent") ? "かんりょう" : "ミストのむらに シスターが"]);
    if (f("underOpen")) list.push(["ロッドの おんし",
      f("rodEvent") ? "かんりょう" : "ムスペルのやどに けんきゅうかが"]);
    return list;
  }

  update() {
    if (Input.tap("left") || Input.tap("right")) {
      this.mode = this.mode === "quest" ? "stats" : "quest";
      AudioSys.sfx("cursor");
    }
    const qn = this.quests().length;
    const maxScroll = Math.max(0, qn - 6);
    if (this.mode === "quest") {
      if (Input.tap("up")) { this.scroll = Math.max(0, this.scroll - 1); if (qn > 6) AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.scroll = Math.min(maxScroll, this.scroll + 1); if (qn > 6) AudioSys.sfx("cursor"); }
    }
    if (Input.tap("a") || Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); }
  }

  drawStats() {
    Gfx.clear(0);
    Gfx.window(4, 4, 312, 30);
    Gfx.text("ぼうけんのきろく", 14, 12);
    Gfx.textR("◀▶ クエストちょう", 306, 12, 1, 9);
    Gfx.window(4, 38, 312, 230);
    this.statsRows().forEach(([k, v], i) => {
      const y = 50 + i * 21;
      Gfx.text(k, 20, y, 3, 10);
      Gfx.textR(String(v), 300, y, 3, 10);
    });
    Gfx.text("B: もどる", 136, 274, 1, 9);
  }

  draw() {
    if (this.mode === "stats") { this.drawStats(); return; }
    Gfx.clear(0);
    Gfx.window(4, 4, 312, 30);
    Gfx.text("クエストちょう", 14, 12);
    Gfx.textR(G.currentChapter() + " ◀▶", 306, 12, 2, 10);

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
// ---------------- コンフィグ ----------------
// たびのこころえ (ページ式ヘルプ)
class HelpScene {
  constructor() {
    this.opaque = false;
    this.page = 0;
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    const n = DATA.helpPages.length;
    if (Input.tap("left")) { this.page = (this.page + n - 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("right") || Input.tap("a")) {
      if (this.page < n - 1) { this.page++; AudioSys.sfx("cursor"); }
      else { AudioSys.sfx("cancel"); G.pop(); }
    }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); }
  }
  draw() {
    const p = DATA.helpPages[this.page];
    Gfx.window(16, 24, 288, 240);
    Gfx.text(p.title, 32, 34);
    Gfx.textR(`${this.page + 1}/${DATA.helpPages.length}`, 290, 34, 1, 10);
    p.lines.forEach((l, i) => Gfx.text(l, 32, 62 + i * 20, 3, 10));
    if (Math.floor(this.t * 2) % 2 === 0) {
      Gfx.text(this.page < DATA.helpPages.length - 1 ? "▶ つぎへ (B: とじる)" : "A/B: とじる", 96, 246, 1, 9);
    }
  }
}

// ものがたりのきろく (章のあらすじビューア)
class StoryRecapScene {
  constructor() {
    this.opaque = false;
    this.page = 0;
    this.t = 0;
    // すすんだ章までしか よめない
    const ch = G.currentChapter();
    const order = ["第一章", "第二章", "第三章", "第四章", "第五章", "第六章", "第七章", "全七章"];
    const idx = order.findIndex((o) => ch.startsWith(o));
    this.maxPage = ch === "全七章 クリア" ? DATA.storyRecap.length - 1 : Math.max(0, idx);
  }
  update(dt) {
    this.t += dt;
    if (Input.tap("left")) { this.page = Math.max(0, this.page - 1); AudioSys.sfx("cursor"); }
    if (Input.tap("right") || Input.tap("a")) {
      if (this.page < this.maxPage) { this.page++; AudioSys.sfx("cursor"); }
      else { AudioSys.sfx("cancel"); G.pop(); }
    }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); }
  }
  draw() {
    const p = DATA.storyRecap[this.page];
    Gfx.window(16, 30, 288, 228);
    Gfx.text(p.title, 32, 40);
    Gfx.textR(`${this.page + 1}/${this.maxPage + 1}`, 290, 40, 1, 10);
    p.lines.forEach((l, i) => Gfx.text(l, 32, 70 + i * 20, 3, 10));
    if (Math.floor(this.t * 2) % 2 === 0) {
      Gfx.text(this.page < this.maxPage ? "▶ つぎの章へ (B: とじる)" : "A/B: とじる", 92, 240, 1, 9);
    }
  }
}

class ConfigScene {
  constructor() {
    this.opaque = false;
    this.sel = 0;
  }

  get cfg() {
    if (!G.state.config) G.state.config = { atbWait: true };
    return G.state.config;
  }

  rows() {
    const c = this.cfg;
    return [
      ["戦闘モード", c.atbWait !== false ? "ウェイト" : "アクティブ", "ウェイト: コマンドちゅう じかんていし"],
      ["カーソルきおく", c.memory !== false ? "ON" : "OFF", "まえの ターンの コマンドいちを おぼえる"],
      ["戦闘そくど", (c.bspeed || 1) === 2 ? "2ばい" : "ふつう", "2ばいなら レベルあげが はかどる"],
      ["いどうそくど", c.wspeed === 2 ? "はやい" : "ふつう", "フィールドを きびきび あるく"],
      ["エンカウント", c.encOff ? "OFF" : "ON", "OFFにすると ざこ敵が でなくなる"],
      ["おと", AudioSys.muted ? "OFF" : "ON", "BGMと こうかおん (Mキーでも きりかえ)"],
      ["たびのこころえ", "みる", "あそびかたの かんたんガイド"],
    ];
  }

  toggle(i) {
    const c = this.cfg;
    if (i === 0) c.atbWait = c.atbWait === false;
    else if (i === 1) c.memory = c.memory === false;
    else if (i === 2) c.bspeed = (c.bspeed || 1) === 2 ? 1 : 2;
    else if (i === 3) c.wspeed = c.wspeed === 2 ? 1 : 2;
    else if (i === 4) c.encOff = !c.encOff;
    else if (i === 5) AudioSys.toggleMute();
    else if (i === 6) { AudioSys.sfx("confirm"); G.push(new HelpScene()); return; }
    AudioSys.sfx("cursor");
  }

  update() {
    const n = this.rows().length;
    if (Input.tap("up")) { this.sel = (this.sel + n - 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("a") || Input.tap("left") || Input.tap("right")) this.toggle(this.sel);
    if (Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); }
  }

  draw() {
    Gfx.window(30, 38, 260, 216);
    Gfx.text("コンフィグ", 44, 46);
    this.rows().forEach(([name, val], i) => {
      const y = 72 + i * 26;
      Gfx.text(name, 58, y, 3, 11);
      Gfx.textR(val, 276, y, 3, 11);
      if (i === this.sel) Gfx.cursor(44, y + 3);
    });
    Gfx.text(this.rows()[this.sel][2], 40, 234, 3, 9);
  }
}

// スロットマシン (ソレイユの酒場の奥、レトロカジノ)
class SlotScene {
  constructor() {
    this.opaque = false;
    this.bet = 100;
    this.symbols = ["7", "剣", "星", "月", "実"];
    this.reels = [0, 1, 2];
    this.spin = [0, 0, 0];   // 0=停止, >0=回転中
    this.state = "ask";      // ask / spin / result
    this.t = 0;
    this.msg = "";
  }
  payout(a, b, c) {
    if (a === 0 && b === 0 && c === 0) return [5000, "777!! 大当たり!!"];
    if (a === b && b === c) return [1000, this.symbols[a] + "が 3つ そろった!"];
    if (a === b || b === c || a === c) return [200, "おしい! ペア!"];
    return [0, "はずれ……。"];
  }
  update(dt) {
    this.t += dt;
    if (this.state === "ask") {
      if (Input.tap("a")) {
        if (G.state.gold < this.bet) {
          this.msg = "お金が たりない!";
          this.state = "result"; this.t = 0;
          AudioSys.sfx("buzz");
          return;
        }
        G.state.gold -= this.bet;
        AudioSys.sfx("confirm");
        this.state = "spin";
        this.spin = [0.7 + Math.random() * 0.4, 1.3 + Math.random() * 0.5, 2.0 + Math.random() * 0.6];
        this.reels = this.reels.map(() => Math.floor(Math.random() * 5));
      } else if (Input.tap("b")) {
        AudioSys.sfx("cancel");
        G.pop();
      }
      return;
    }
    if (this.state === "spin") {
      let done = true;
      for (let i = 0; i < 3; i++) {
        if (this.spin[i] > 0) {
          this.spin[i] -= dt;
          this.reels[i] = Math.floor(this.t * 12 + i * 7) % 5;
          if (this.spin[i] <= 0) {
            this.reels[i] = Math.floor(Math.random() * 5);
            AudioSys.sfx("cursor");
          } else done = false;
        }
      }
      if (done) {
        const [win, msg] = this.payout(this.reels[0], this.reels[1], this.reels[2]);
        if (win > 0) { G.gainGold(win); AudioSys.sfx(win >= 1000 ? "levelup" : "chest"); }
        else AudioSys.sfx("cancel");
        this.msg = msg + (win > 0 ? `\n${win}ギル かくとく!` : "");
        this.state = "result"; this.t = 0;
      }
      return;
    }
    if (this.state === "result" && this.t > 0.4 && (Input.tap("a") || Input.tap("b"))) {
      this.state = "ask";
      this.msg = "";
    }
  }
  draw() {
    Gfx.window(60, 60, 200, 168);
    Gfx.text("クリスタルスロット", 88, 70);
    // リールまど
    for (let i = 0; i < 3; i++) {
      const x = 84 + i * 54;
      Gfx.window(x, 96, 44, 44);
      const sym = this.symbols[this.reels[i]];
      Gfx.text(sym, x + 15, 110, this.state === "spin" && this.spin[i] > 0 ? 1 : 3, 13);
    }
    Gfx.text(`かけ金 ${this.bet}G`, 92, 152, 3, 10);
    Gfx.textR(`しょじ ${G.state.gold}G`, 246, 152, 3, 10);
    if (this.state === "ask") {
      Gfx.text("A: まわす  B: やめる", 92, 176, 1, 10);
      Gfx.text("777で 5000ギル!", 100, 196, 2, 10);
    } else if (this.state === "result") {
      this.msg.split("\n").forEach((l, i) => Gfx.text(l, 84, 176 + i * 18, 3, 10));
    } else {
      Gfx.text("まわっている……", 106, 176, 1, 10);
    }
  }
}

class FishingScene {
  constructor(price, onDone, table) {
    this.opaque = false;
    this.price = price;
    this.table = table || "sky";
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
    if (this.table === "lake") {
      // 湖の桟橋: べつの さかなが つれる
      if (r < 0.05) {
        G.setFlag("lakeKing", 1);
        G.state.gold += 4000;
        AudioSys.sfx("levelup");
        return "湖のぬしだ!! 4000ギル!!";
      }
      if (r < 0.2) { G.state.gold += 800; AudioSys.sfx("chest"); return "にじマス! 800ギル!"; }
      if (r < 0.58) { G.state.gold += 150; AudioSys.sfx("chest"); return "あおブナを つった! 150ギル!"; }
      AudioSys.sfx("cancel");
      return "みずくさ だった……。";
    }
    if (this.table === "night") {
      // 夜の国の 星あかり釣り
      if (r < 0.04) {
        G.setFlag("nightKing", 1);
        G.state.gold += 6000;
        AudioSys.sfx("levelup");
        return "よるのぬしだ!! 6000ギル!!";
      }
      if (r < 0.19) { G.state.gold += 1200; AudioSys.sfx("chest"); return "夜光ウナギ! 1200ギル!"; }
      if (r < 0.58) { G.state.gold += 250; AudioSys.sfx("chest"); return "ほしくずクラゲを つった! 250ギル!"; }
      AudioSys.sfx("cancel");
      return "ぬけがら だった……。";
    }
    if (r < 0.05) {
      G.setFlag("fishKing", 1);
      G.state.gold += 2000;
      AudioSys.sfx("levelup");
      return "ぬしの おおものだ!! 2000ギル!!";
    }
    if (r < 0.18) { G.state.gold += 500; AudioSys.sfx("chest"); return "黄金ダイ! 500ギル!"; }
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
          this.resultText = "お金が たりない!";
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
    // 海の まど
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
          this.notice = "お金が たりないよ!";
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
        (def.kind === "weapon" ? `攻撃+${def.atk}` : def.kind === "armor" ? `防御+${def.def}` : "");
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
