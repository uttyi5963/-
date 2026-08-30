// ============================================================
// モンスターシーカー - フィールドメニュー / ショップ
// ============================================================

function itemList() {
  return Object.entries(G.state.items).map(([id, count]) => ({ id, count, def: DATA.items[id] }));
}

// フィールドで どうぐを 魔物に つかう
function applyFieldItem(def, mon) {
  if (def.heal) {
    if (mon.hp <= 0 || mon.hp >= mon.maxhp) return null;
    mon.hp = Math.min(mon.maxhp, mon.hp + def.heal);
    return `${mon.name}の HPが 回復した!`;
  }
  if (def.cureAll) {
    if (!mon.status) return null;
    const name = DATA.statusNames[mon.status] || mon.status;
    mon.status = null;
    return `${mon.name}の ${name}が なおった!`;
  }
  if (def.revive) {
    if (mon.hp > 0) return null;
    mon.hp = Math.max(1, Math.floor(mon.maxhp * def.revive));
    return `${mon.name}は 元気を とりもどした!`;
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
    else if (this.state === "monDetail") this.updDetail();
    else if (this.state === "item") this.updItem();
    else if (this.state === "itemTarget") this.updItemTarget();
    else if (this.state === "dex") this.updDex();
    else if (this.state === "box") this.updBox();
    else if (this.state === "config") this.updConfig();
  }

  updMain() {
    const cmds = ["つよさ", "もちもの", "ずかん", "ボックス", "セーブ", "コンフィグ", "とじる"];
    if (Input.tap("up")) { this.sel = (this.sel + cmds.length - 1) % cmds.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sel = (this.sel + 1) % cmds.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); G.pop(); return; }
    if (Input.tap("a")) {
      AudioSys.sfx("confirm");
      const c = cmds[this.sel];
      if (c === "つよさ") { this.state = "party"; this.sub = 0; }
      else if (c === "もちもの") { this.state = "item"; this.sub = 0; this.scroll = 0; }
      else if (c === "ずかん") { this.state = "dex"; this.sub = 0; this.scroll = 0; }
      else if (c === "ボックス") { this.state = "box"; this.sub = 0; this.boxMode = 0; }
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

  updParty() {
    const party = G.state.party;
    if (party.length === 0) { this.state = "main"; return; }
    if (Input.tap("up")) { this.sub = (this.sub + party.length - 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sub = (this.sub + 1) % party.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a")) { AudioSys.sfx("confirm"); this.state = "monDetail"; }
    // Selectで ならびかえ (せんとうに)
    if (Input.tap("start") && this.sub > 0) {
      const m = party.splice(this.sub, 1)[0];
      party.unshift(m);
      this.sub = 0;
      AudioSys.sfx("confirm");
    }
  }

  updDetail() {
    if (Input.tap("b") || Input.tap("a")) { AudioSys.sfx("cancel"); this.state = "party"; }
  }

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
      if (it.def.kind !== "use") { AudioSys.sfx("buzz"); return; }
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
      const msg = applyFieldItem(this.useItem.def, party[this.sel]);
      if (!msg) { AudioSys.sfx("buzz"); return; }
      AudioSys.sfx("heal");
      G.removeItem(this.useItem.id);
      G.push(new MessageScene(msg));
      this.state = "item";
      this.sub = 0;
    }
  }

  updBox() {
    // 左右で「あずける(てもち)」⇔「ひきだす(ボックス)」を きりかえ
    if (Input.tap("left") || Input.tap("right")) {
      this.boxMode = 1 - this.boxMode;
      this.sub = 0;
      AudioSys.sfx("cursor");
    }
    const list = this.boxMode === 0 ? G.state.party : G.state.box;
    if (Input.tap("up") && list.length) { this.sub = (this.sub + list.length - 1) % list.length; AudioSys.sfx("cursor"); }
    if (Input.tap("down") && list.length) { this.sub = (this.sub + 1) % list.length; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a") && list.length) {
      const i = Math.min(this.sub, list.length - 1);
      if (this.boxMode === 0) {
        // あずける: 戦える魔物が ほかに いないと あずけられない
        const others = G.state.party.filter((m, j) => j !== i && m.hp > 0);
        if (others.length === 0) { AudioSys.sfx("buzz"); return; }
        const m = G.state.party.splice(i, 1)[0];
        G.state.box.push(m);
        AudioSys.sfx("confirm");
      } else {
        // ひきだす: てもちは 5ひきまで
        if (G.state.party.length >= 5) { AudioSys.sfx("buzz"); return; }
        const m = G.state.box.splice(i, 1)[0];
        G.state.party.push(m);
        AudioSys.sfx("confirm");
      }
      this.sub = 0;
    }
  }

  updDex() {
    const n = DATA.dexOrder.length;
    if (Input.tap("up")) { this.sub = (this.sub + n - 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sub = (this.sub + 1) % n; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
  }

  updConfig() {
    const rows = 2;
    if (Input.tap("up")) { this.sub = (this.sub + rows - 1) % rows; AudioSys.sfx("cursor"); }
    if (Input.tap("down")) { this.sub = (this.sub + 1) % rows; AudioSys.sfx("cursor"); }
    if (Input.tap("b")) { AudioSys.sfx("cancel"); this.state = "main"; return; }
    if (Input.tap("a") || Input.tap("left") || Input.tap("right")) {
      AudioSys.sfx("confirm");
      const c = G.state.config;
      if (this.sub === 0) c.gbc = !c.gbc;
      else if (this.sub === 1) c.encOff = !c.encOff;
    }
  }

  // ---------------- びょうが ----------------
  draw() {
    if (this.state === "main") {
      Gfx.window(200, 8, 112, 7 * 18 + 12);
      ["つよさ", "もちもの", "ずかん", "ボックス", "セーブ", "コンフィグ", "とじる"].forEach((c, i) => {
        Gfx.text(c, 226, 16 + i * 18);
        if (i === this.sel) Gfx.cursor(210, 19 + i * 18);
      });
      Gfx.window(8, 8, 130, 30);
      Gfx.text(`${G.state.gold} ギル`, 18, 17, 3, 11);
    }
    else if (this.state === "party" || this.state === "itemTarget") {
      const party = G.state.party;
      Gfx.window(20, 30, 280, party.length * 34 + 16);
      party.forEach((m, i) => {
        const y = 40 + i * 34;
        const sp = DATA.species[m.id];
        Gfx.draw(sp.spr, 32, y - 4, { scale: 1.5, variant: sp.pal });
        Gfx.text(`${m.name}  Lv${m.lv}`, 64, y, m.hp > 0 ? 3 : 1, 11);
        const st = m.status ? ` (${DATA.statusNames[m.status]})` : "";
        Gfx.text(`HP ${m.hp}/${m.maxhp}  ${DATA.types[sp.type].name}${st}`, 64, y + 14, m.hp > 0 ? 2 : 1, 10);
        const cursorSel = this.state === "party" ? this.sub : this.sel;
        if (i === cursorSel) Gfx.cursor(24, y + 8);
      });
      Gfx.window(20, 240, 280, 40);
      Gfx.text(this.state === "party" ? "Aでくわしく / Enterでせんとうへ" : "だれに つかう?", 32, 252, 3, 11);
    }
    else if (this.state === "monDetail") {
      const m = G.state.party[this.sub];
      const sp = DATA.species[m.id];
      Gfx.window(20, 24, 280, 240);
      Gfx.draw(sp.spr, 40, 40, { scale: 3, variant: sp.pal });
      Gfx.text(`${m.name}`, 110, 44, 3, 13);
      Gfx.text(`Lv${m.lv}  ${DATA.types[sp.type].name}タイプ`, 110, 64, 3, 11);
      Gfx.text(`HP ${m.hp}/${m.maxhp}`, 110, 82, 3, 11);
      Gfx.text(`こうげき ${m.atk}  ぼうぎょ ${m.def}`, 40, 106, 3, 11);
      Gfx.text(`すばやさ ${m.spd}`, 40, 122, 3, 11);
      const next = m.lv >= G.MAX_LV ? 0 : G.expTotalFor(m.lv + 1) - m.exp;
      Gfx.text(`つぎのレベルまで ${next}`, 40, 138, 2, 10);
      Gfx.text("わざ:", 40, 160, 3, 11);
      m.moves.forEach((id, i) => {
        const mv = DATA.moves[id];
        Gfx.text(`${mv.name} (${DATA.types[mv.type].name} ${mv.pow})`, 56, 176 + i * 15, 3, 10);
      });
      const ev = sp.evolve;
      if (ev) Gfx.text(`Lv${ev.lv}で しんかしそうだ…`, 40, 244, 2, 10);
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
    else if (this.state === "dex") {
      const order = DATA.dexOrder;
      Gfx.window(20, 14, 280, 216);
      const view = 10;
      const sc = Math.max(0, Math.min(this.sub - view + 1, order.length - view));
      order.slice(sc, sc + view).forEach((id, i) => {
        const y = 26 + i * 19;
        const b = G.state.bestiary[id];
        const no = String(sc + i + 1).padStart(2, "0");
        if (b && b.caught) {
          Gfx.text(`No${no} ${DATA.species[id].name}`, 46, y, 3, 11);
          Gfx.textR("★", 288, y, 3, 10);
        } else if (b && b.seen) {
          Gfx.text(`No${no} ${DATA.species[id].name}`, 46, y, 2, 11);
        } else {
          Gfx.text(`No${no} ？？？？？`, 46, y, 1, 11);
        }
        if (sc + i === this.sub) Gfx.cursor(32, y + 3);
      });
      const caught = order.filter((id) => G.state.bestiary[id] && G.state.bestiary[id].caught).length;
      const seen = order.filter((id) => G.state.bestiary[id] && G.state.bestiary[id].seen).length;
      Gfx.window(20, 234, 280, 48);
      Gfx.text(`みつけた ${seen}  つかまえた ${caught} / ${order.length}`, 32, 242, 3, 10);
      const cur = order[this.sub];
      const cb = G.state.bestiary[cur];
      if (cb && cb.caught) {
        const d = DATA.species[cur].dex;
        Gfx.text(d.length > 26 ? d.slice(0, 26) : d, 32, 258, 2, 9);
        if (d.length > 26) Gfx.text(d.slice(26), 32, 270, 2, 9);
      }
    }
    else if (this.state === "box") {
      const party = G.state.party, box = G.state.box;
      const list = this.boxMode === 0 ? party : box;
      Gfx.window(20, 14, 280, 30);
      Gfx.text(this.boxMode === 0 ? "◀ あずける (てもち) ▶" : "◀ ひきだす (ボックス) ▶", 60, 23, 3, 12);
      Gfx.window(20, 48, 280, 186);
      if (list.length === 0) {
        Gfx.text(this.boxMode === 0 ? "てもちが いない" : "ボックスは からっぽ", 40, 66, 2, 11);
      }
      const view = 9;
      const sel = Math.min(this.sub, Math.max(0, list.length - 1));
      const sc = Math.max(0, Math.min(sel - view + 1, list.length - view));
      list.slice(sc, sc + view).forEach((m, i) => {
        const y = 60 + i * 19;
        Gfx.text(`${m.name}  Lv${m.lv}`, 46, y, m.hp > 0 ? 3 : 1, 11);
        Gfx.textR(`HP ${m.hp}/${m.maxhp}`, 288, y, 2, 10);
        if (sc + i === sel) Gfx.cursor(32, y + 3);
      });
      Gfx.window(20, 240, 280, 42);
      Gfx.text(`てもち ${party.length}/5  ボックス ${box.length}`, 32, 248, 3, 10);
      Gfx.text("←→できりかえ / Aで うつす", 32, 262, 2, 10);
    }
    else if (this.state === "config") {
      const c = G.state.config;
      Gfx.window(40, 60, 240, 90);
      const rows = [
        ["がめんカラー", c.gbc ? "GBカラー" : "クラシック"],
        ["エンカウント", c.encOff ? "OFF" : "ON"],
      ];
      rows.forEach(([k, v], i) => {
        const y = 76 + i * 22;
        Gfx.text(k, 66, y);
        Gfx.textR(v, 268, y);
        if (i === this.sub) Gfx.cursor(50, y + 3);
      });
    }
  }
}

// ---------------- ショップ ----------------
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
      Gfx.window(4, 262, 312, 22);
      Gfx.text(DATA.items[stock[this.sub]].desc || "", 14, 267, 3, 10);
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
