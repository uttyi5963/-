// ============================================================
// アルカナダンジョン - フィールドメニュー / ショップ
// ============================================================

function itemList() {
  return Object.entries(G.state.items).map(([id, count]) => ({ id, count, def: DATA.items[id] }));
}

// フィールドで どうぐを なかまに つかう
function applyFieldItem(def, h) {
  if (def.heal) {
    if (h.hp <= 0 || h.hp >= h.maxhp) return null;
    h.hp = Math.min(h.maxhp, h.hp + def.heal);
    return `${h.name}の HPが 回復した!`;
  }
  if (def.mpheal) {
    if (h.mp >= h.maxmp) return null;
    h.mp = Math.min(h.maxmp, h.mp + def.mpheal);
    return `${h.name}の MPが 回復した!`;
  }
  if (def.cure) {
    if (!h[def.cure]) return null;
    h[def.cure] = false;
    return `${h.name}の じょうたいが なおった!`;
  }
  return null;
}

class MenuScene {
  constructor() {
    this.opaque = false;
    this.state = "main";
    this.sel = 0; this.sub = 0; this.scroll = 0;
  }

  update() {
    if (this.state === "main") this.updMain();
    else if (this.state === "party") this.updParty();
    else if (this.state === "detail") this.updDetail();
    else if (this.state === "item") this.updItem();
    else if (this.state === "itemTarget") this.updItemTarget();
    else if (this.state === "jobSelect") this.updJobSelect();
    else if (this.state === "jobPick") this.updJobPick();
    else if (this.state === "subskill") this.updSubskill();
    else if (this.state === "config") this.updConfig();
  }

  updMain() {
    const cmds = ["つよさ", "ジョブ", "もちもの", "セーブ", "コンフィグ", "とじる"];
    if (Input.tap("up")) { this.sel = (this.sel + cmds.length - 1) % cmds.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % cmds.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); return; }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      const c = cmds[this.sel];
      if (c === "つよさ") { this.state = "party"; this.sub = 0; }
      else if (c === "ジョブ") { this.state = "jobSelect"; this.sub = 0; }
      else if (c === "もちもの") { this.state = "item"; this.sub = 0; this.scroll = 0; }
      else if (c === "セーブ") {
        G.push(new SlotPickScene("save", (slot) => {
          if (slot > 0) {
            const ok = G.save(slot);
            G.push(new MessageScene(ok ? "ぼうけんを きろくした!" : "セーブに しっぱいした……"));
          }
        }));
      }
      else if (c === "コンフィグ") { this.state = "config"; this.sub = 0; }
      else { G.pop(); }
    }
  }

  // ---------------- つよさ ----------------
  updParty() {
    const party = G.state.party;
    if (party.length === 0) { this.state = "main"; return; }
    if (Input.tap("up")) { this.sub = (this.sub + party.length - 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sub = (this.sub + 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a")) { AudioSys.sfx("confirm"); this.state = "detail"; }
  }

  updDetail() {
    if (Input.tap("b") || Input.tap("a")) { AudioSys.sfx("cancel"); this.state = "party"; }
  }

  // ---------------- ジョブ ----------------
  updJobSelect() {
    const party = G.state.party;
    if (party.length === 0) { this.state = "main"; return; }
    if (Input.tap("up")) { this.sub = (this.sub + party.length - 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sub = (this.sub + 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a")) { AudioSys.sfx("confirm"); this.state = "jobPick"; this.sel = 0; }
  }

  updJobPick() {
    const ids = Object.keys(DATA.jobs);
    const h = G.state.party[this.sub];
    if (Input.tap("up")) { this.sel = (this.sel + ids.length - 1) % ids.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % ids.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "jobSelect"; return; }
    if (Input.tap("a")) {
      const jobId = ids[this.sel];
      if (jobId === h.cls) { AudioSys.sfx("buzz"); return; }
      G.changeJob(h, jobId);
      G.addSp(h, 0); // このジョブの 0SPわざを すぐ おぼえる
      AudioSys.sfx("levelup");
      this.state = "subskill"; this.sel = 0; this.slotSel = 0;
    }
  }

  // ---------------- サブスキル ----------------
  updSubskill() {
    const h = G.state.party[this.sub];
    const jobSkills = G.jobSkillsOf(h);
    const lib = h.skillLib.filter((id) => !jobSkills.includes(id));
    const rows = 3 + lib.length; // 3スロット + ライブラリいちらん
    if (Input.tap("up")) { this.sel = (this.sel + rows - 1) % rows; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % rows; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "jobSelect"; return; }
    if (Input.tap("a")) {
      if (this.sel < 3) {
        // スロットを えらんだ: からにする
        if (h.subskills[this.sel] !== undefined) {
          h.subskills.splice(this.sel, 1);
          AudioSys.sfx("cancel");
        }
      } else {
        const skillId = lib[this.sel - 3];
        if (h.subskills.includes(skillId)) { AudioSys.sfx("buzz"); return; }
        if (h.subskills.length >= G.MAX_SUBSKILLS) {
          h.subskills.shift();
        }
        h.subskills.push(skillId);
        AudioSys.sfx("confirm");
      }
    }
  }

  // ---------------- もちもの ----------------
  updItem() {
    const items = itemList();
    if (items.length === 0) {
      if (Input.tap("b") || Input.tap("a")) { AudioSys.sfx("cancel"); this.state = "main"; }
      return;
    }
    if (Input.tap("up")) { this.sub = (this.sub + items.length - 1) % items.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sub = (this.sub + 1) % items.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a")) {
      const it = items[Math.min(this.sub, items.length - 1)];
      if (it.def.kind !== "use" && it.def.kind !== "weapon" && it.def.kind !== "armor") { AudioSys.sfx("buzz"); return; }
      AudioSys.sfx("confirm");
      this.useItem = it;
      this.state = "itemTarget";
      this.sel = 0;
    }
  }

  updItemTarget() {
    const party = G.state.party;
    if (Input.tap("up")) { this.sel = (this.sel + party.length - 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "item"; return; }
    if (Input.tap("a")) {
      const h = party[this.sel];
      const def = this.useItem.def;
      if (def.kind === "use") {
        const msg = applyFieldItem(def, h);
        if (!msg) { AudioSys.sfx("buzz"); return; }
        AudioSys.sfx("heal");
        G.removeItem(this.useItem.id);
        G.push(new MessageScene(msg));
      } else {
        // ぶき/よろい そうび: もとの そうびは もちものへ もどす
        const slot = def.kind === "weapon" ? "weapon" : "armor";
        const old = h[slot];
        G.removeItem(this.useItem.id);
        if (old) G.addItem(old);
        h[slot] = this.useItem.id;
        AudioSys.sfx("confirm");
        G.push(new MessageScene(`${h.name}は ${def.name}を そうびした!`));
      }
      this.state = "item";
      this.sub = 0;
    }
  }

  updConfig() {
    const rows = 1;
    if (Input.tap("up")) { this.sub = (this.sub + rows - 1) % rows; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sub = (this.sub + 1) % rows; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a") || Input.tap("left") || Input.tap("right")) {
      AudioSys.sfx("confirm");
      const c = G.state.config;
      if (this.sub === 0) c.gbc = !c.gbc;
    }
  }

  // ---------------- びょうが ----------------
  draw() {
    if (this.state === "main") {
      Gfx.window(200, 8, 112, 6 * 18 + 12);
      ["つよさ", "ジョブ", "もちもの", "セーブ", "コンフィグ", "とじる"].forEach((c, i) => {
        Gfx.text(c, 226, 16 + i * 18);
        if (i === this.sel) Gfx.cursor(210, 19 + i * 18);
      });
      Gfx.window(8, 8, 130, 30);
      Gfx.text(`${G.state.gold} ギル`, 18, 17, 3, 11);
    }
    else if (this.state === "party") {
      const party = G.state.party;
      Gfx.window(20, 30, 280, party.length * 34 + 16);
      party.forEach((h, i) => {
        const y = 40 + i * 34;
        Gfx.draw(DATA.jobs[h.cls].spr, 32, y - 4, { scale: 1.5 });
        Gfx.text(`${h.name}  ${DATA.jobs[h.cls].name}  Lv${h.lv}`, 64, y, h.hp > 0 ? 3 : 1, 11);
        Gfx.text(`HP ${h.hp}/${h.maxhp}  MP ${h.mp}/${h.maxmp}`, 64, y + 14, h.hp > 0 ? 2 : 1, 10);
        if (i === this.sub) Gfx.cursor(24, y + 8);
      });
      Gfx.window(20, 240, 280, 40);
      Gfx.text("Aで くわしく", 32, 252, 3, 11);
    }
    else if (this.state === "detail") {
      const h = G.state.party[this.sub];
      const jd = DATA.jobs[h.cls];
      Gfx.window(20, 24, 280, 240);
      Gfx.draw(jd.spr, 40, 40, { scale: 3 });
      Gfx.text(`${h.name}`, 110, 44, 3, 13);
      Gfx.text(`${jd.name}  Lv${h.lv}`, 110, 64, 3, 11);
      Gfx.text(`HP ${h.hp}/${h.maxhp}  MP ${h.mp}/${h.maxmp}`, 110, 82, 3, 11);
      Gfx.text(`ちから ${G.strOf(h)}  すばやさ ${G.agiOf(h)}`, 40, 106, 3, 11);
      Gfx.text(`たいりょく ${G.vitOf(h)}  ちせい ${h.int}`, 40, 122, 3, 11);
      const next = h.lv >= G.MAX_LV ? 0 : G.expTotalFor(h.lv + 1) - h.exp;
      Gfx.text(`つぎのレベルまで ${next}`, 40, 138, 2, 10);
      Gfx.text(`ぶき: ${h.weapon ? DATA.items[h.weapon].name : "なし"}`, 40, 158, 3, 10);
      Gfx.text(`よろい: ${h.armor ? DATA.items[h.armor].name : "なし"}`, 40, 172, 3, 10);
      Gfx.text(`SP(${jd.name}): ${h.jobSp[h.cls] || 0}`, 40, 190, 2, 10);
      Gfx.text("ジョブわざ:", 40, 208, 3, 10);
      const skills = G.jobSkillsOf(h);
      skills.forEach((id, i) => Gfx.text(DATA.skills[id].name, 56, 222 + i * 13, 3, 9));
      Gfx.text("サブスキル: " + (h.subskills.map((id) => DATA.skills[id].name).join(", ") || "なし"), 40, 222 + skills.length * 13 + 6, 2, 9);
    }
    else if (this.state === "jobSelect") {
      const party = G.state.party;
      Gfx.window(20, 30, 280, party.length * 30 + 16);
      party.forEach((h, i) => {
        const y = 40 + i * 30;
        Gfx.text(`${h.name}  (げんざい: ${DATA.jobs[h.cls].name})`, 32, y);
        if (i === this.sub) Gfx.cursor(20, y + 3);
      });
      Gfx.window(20, 240, 280, 40);
      Gfx.text("だれの ジョブを かえる?", 32, 252, 3, 11);
    }
    else if (this.state === "jobPick") {
      const h = G.state.party[this.sub];
      const ids = Object.keys(DATA.jobs);
      Gfx.window(20, 30, 280, ids.length * 20 + 16);
      ids.forEach((id, i) => {
        const jd = DATA.jobs[id];
        const y = 40 + i * 20;
        const cur = id === h.cls;
        Gfx.text(`${jd.name}${cur ? " (げんざい)" : ""}`, 32, y, cur ? 2 : 3, 11);
        if (i === this.sel) Gfx.cursor(20, y + 3);
      });
      Gfx.window(20, 240, 280, 40);
      Gfx.text(`${h.name}の ジョブを かえる`, 32, 252, 3, 11);
    }
    else if (this.state === "subskill") {
      const h = G.state.party[this.sub];
      const jobSkills = G.jobSkillsOf(h);
      const lib = h.skillLib.filter((id) => !jobSkills.includes(id));
      Gfx.window(20, 14, 280, 216);
      Gfx.text("サブスキル (さいだい3つ)", 32, 22, 3, 10);
      for (let i = 0; i < 3; i++) {
        const y = 40 + i * 16;
        const id = h.subskills[i];
        Gfx.text(`枠${i + 1}: ${id ? DATA.skills[id].name : "からっぽ"}`, 40, y, id ? 3 : 1, 10);
        if (this.sel === i) Gfx.cursor(24, y + 3);
      }
      Gfx.text("おぼえている スキル:", 32, 96, 3, 10);
      lib.forEach((id, i) => {
        const y = 112 + i * 15;
        const equipped = h.subskills.includes(id);
        Gfx.text(DATA.skills[id].name, 40, y, equipped ? 1 : 3, 9);
        if (this.sel === 3 + i) Gfx.cursor(24, y + 2);
      });
      if (lib.length === 0) Gfx.text("(まだ べつジョブの スキルが ない)", 40, 112, 2, 9);
      Gfx.window(20, 234, 280, 48);
      Gfx.text("Aで つけかえ / Bで もどる", 32, 248, 3, 10);
    }
    else if (this.state === "item") {
      const items = itemList();
      Gfx.window(20, 30, 280, 200);
      if (items.length === 0) Gfx.text("なにも もっていない", 40, 50, 3, 11);
      const view = 9;
      const sel = Math.min(this.sub, Math.max(0, items.length - 1));
      const sc = Math.max(0, Math.min(sel - view + 1, items.length - view));
      items.slice(sc, sc + view).forEach((it, i) => {
        const y = 42 + i * 19;
        Gfx.text(it.def.name, 46, y);
        Gfx.textR("x" + it.count, 288, y);
        if (sc + i === sel) Gfx.cursor(32, y + 3);
      });
      Gfx.window(20, 240, 280, 40);
      const cur = items[sel];
      Gfx.text(cur ? (cur.def.desc || "") : "", 32, 252, 3, 10);
    }
    else if (this.state === "itemTarget") {
      const party = G.state.party;
      Gfx.window(20, 30, 280, party.length * 34 + 16);
      party.forEach((h, i) => {
        const y = 40 + i * 34;
        Gfx.text(`${h.name}  ${DATA.jobs[h.cls].name}`, 64, y, h.hp > 0 ? 3 : 1, 11);
        Gfx.text(`HP ${h.hp}/${h.maxhp}  MP ${h.mp}/${h.maxmp}`, 64, y + 14, h.hp > 0 ? 2 : 1, 10);
        if (i === this.sel) Gfx.cursor(24, y + 8);
      });
      Gfx.window(20, 240, 280, 40);
      Gfx.text("だれに つかう?", 32, 252, 3, 11);
    }
    else if (this.state === "config") {
      const c = G.state.config;
      Gfx.window(40, 60, 240, 60);
      Gfx.text("がめんカラー", 66, 76);
      Gfx.textR(c.gbc ? "GBカラー" : "クラシック", 268, 76);
      if (this.sub === 0) Gfx.cursor(48, 79);
    }
  }
}

// ---------------- おみせ ----------------
class ShopScene {
  constructor(shopId, onDone) {
    this.opaque = false;
    this.shop = DATA.shops[shopId];
    this.onDone = onDone;
    this.state = "root";
    this.sel = 0; this.sub = 0;
    this.notice = "いらっしゃい! なにを おもとめ?";
  }

  update() {
    if (this.state === "root") {
      const opts = 3;
      if (Input.tap("up")) { this.sel = (this.sel + opts - 1) % opts; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sel = (this.sel + 1) % opts; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { this.close(); return; }
      if (Input.tap("a")) {
        AudioSys.sfx("confirm");
        if (this.sel === 0) { this.state = "buy"; this.sub = 0; this.notice = "どれに するんだい?"; }
        else if (this.sel === 1) { this.state = "sell"; this.sub = 0; this.notice = "なにを うるんだい?"; }
        else this.close();
      }
    } else if (this.state === "buy") {
      const stock = this.shop.stock;
      if (Input.tap("up")) { this.sub = (this.sub + stock.length - 1) % stock.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sub = (this.sub + 1) % stock.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "root"; return; }
      if (Input.tap("a")) {
        const def = DATA.items[stock[this.sub]];
        if (G.state.gold < def.price) { AudioSys.sfx("buzz"); this.notice = "お金が たりないよ!"; }
        else {
          G.state.gold -= def.price;
          G.addItem(stock[this.sub]);
          AudioSys.sfx("chest");
          this.notice = `${def.name}を おかいあげ!`;
        }
      }
    } else if (this.state === "sell") {
      const items = itemList().filter((it) => it.def.price > 0);
      if (items.length === 0) {
        this.notice = "うれるものが ないね";
        if (Input.tap("b") || Input.tap("a")) { AudioSys.sfx("cancel"); this.state = "root"; }
        return;
      }
      if (Input.tap("up")) { this.sub = (this.sub + items.length - 1) % items.length; AudioSys.sfx("cursor"); }
      if (Input.tap("down")) { this.sub = (this.sub + 1) % items.length; AudioSys.sfx("cursor"); }
      if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "root"; return; }
      if (Input.tap("a")) {
        const it = items[Math.min(this.sub, items.length - 1)];
        const gain = Math.floor(it.def.price / 2);
        G.removeItem(it.id);
        G.state.gold += gain;
        AudioSys.sfx("chest");
        this.notice = `${it.def.name}を ${gain}ギルで かいとり!`;
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
      Gfx.window(4, 48, 312, stock.length * 19 + 16);
      stock.forEach((id, i) => {
        const def = DATA.items[id];
        const y = 58 + i * 19;
        Gfx.text(def.name, 32, y);
        Gfx.textR(def.price + "G", 250, y);
        Gfx.textR("x" + (G.state.items[id] || 0), 300, y, 3, 10);
        if (i === this.sub) Gfx.cursor(18, y + 3);
      });
    } else if (this.state === "sell") {
      const items = itemList().filter((it) => it.def.price > 0);
      Gfx.window(4, 48, 312, Math.max(1, items.length) * 19 + 16);
      items.forEach((it, i) => {
        const y = 58 + i * 19;
        Gfx.text(it.def.name, 32, y);
        Gfx.textR("x" + it.count, 220, y);
        Gfx.textR(Math.floor(it.def.price / 2) + "G", 300, y);
        if (i === this.sub) Gfx.cursor(18, y + 3);
      });
    }
  }
}
