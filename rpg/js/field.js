// ============================================================
// クリスタルナイツ - フィールドシーン
// ============================================================

const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };

class FieldScene {
  constructor() {
    this.opaque = true;
    this.moving = null;      // {dx,dy,t}
    this.pendingScript = null;
    this.npcs = [];
    this.nameTimer = 0;
    this.loadMap();
  }

  get map() { return DATA.maps[G.state.map]; }

  loadMap() {
    const m = this.map;
    this.moving = null;
    this.nameTimer = 2.2;
    this.npcs = (m.npcs || []).map((n) => {
      let { x, y } = n;
      // セーブちてんが NPCのホームだったばあいは となりに よける
      if (x === G.state.x && y === G.state.y) {
        for (const [dx, dy] of Object.values(DIRS)) {
          const t = m.legend[(m.rows[y + dy] || "")[x + dx]];
          if (t && !t.solid) { x += dx; y += dy; break; }
        }
      }
      return { def: n, x, y, t: 0, wt: Math.random() * 3 + 1, moving: null };
    });
    if (m.bgm) AudioSys.bgm(m.bgm);
  }

  tileAt(x, y) {
    const m = this.map;
    if (y < 0 || y >= m.rows.length) return null;
    const row = m.rows[y];
    if (x < 0 || x >= row.length) return null;
    return m.legend[row[x]] || null;
  }

  solidAt(x, y) {
    const t = this.tileAt(x, y);
    return !t || !!t.solid;
  }

  npcAt(x, y) {
    return this.npcs.find((n) => {
      if (n.def.hideFlag && G.flag(n.def.hideFlag)) return false;
      const tx = n.moving ? n.moving.tx : n.x;
      const ty = n.moving ? n.moving.ty : n.y;
      return (n.x === x && n.y === y) || (tx === x && ty === y);
    });
  }

  eventAt(x, y) {
    return (this.map.events || []).find((e) => e.x === x && e.y === y && e.type === "enter");
  }

  chestAt(x, y) {
    return (this.map.chests || []).find((c) => c.x === x && c.y === y);
  }

  // ---------------- こうしん ----------------
  update(dt) {
    G.state.playtime += dt;
    if (this.nameTimer > 0) this.nameTimer -= dt;

    this.updateNpcs(dt);

    if (this.moving) {
      this.moving.t += dt * 5.2;
      if (this.moving.t >= 1) {
        G.state.x += this.moving.dx;
        G.state.y += this.moving.dy;
        this.moving = null;
        this.onStep();
      }
      return;
    }

    // メニュー (Bボタン)
    if (Input.tap("b")) {
      AudioSys.sfx("confirm");
      G.push(new MenuScene());
      return;
    }
    // しらべる/はなす (Aボタン)
    if (Input.tap("a")) {
      this.interact();
      return;
    }
    // いどう (みじかいタップでも むきは かわる)
    for (const [dir, [dx, dy]] of Object.entries(DIRS)) {
      const keyName = { u: "up", d: "down", l: "left", r: "right" }[dir];
      if (Input.held(keyName) || Input.tap(keyName)) {
        this.tryMove(dir, dx, dy);
        return;
      }
    }
  }

  tryMove(dir, dx, dy) {
    G.state.dir = dir;
    const nx = G.state.x + dx, ny = G.state.y + dy;
    const m = this.map;

    // マップのそとへ → でぐち
    if (ny < 0 || ny >= m.rows.length || nx < 0 || nx >= (m.rows[0] || "").length) {
      if (m.exit) {
        const e = m.exit;
        G.fade(() => {
          G.state.map = e.map; G.state.x = e.x; G.state.y = e.y; G.state.dir = e.dir || "d";
          this.loadMap();
        });
      }
      return;
    }

    // イベントタイル (ワープは ふみこむまえに はんてい)
    const ev = this.eventAt(nx, ny);
    if (ev) {
      if (ev.cond && !G.flag(ev.cond.flag)) {
        if (ev.failScript) runScript(ev.failScript);
        return;
      }
      if (ev.warp) {
        const w = ev.warp;
        G.fade(() => {
          G.state.map = w.map; G.state.x = w.x; G.state.y = w.y; G.state.dir = w.dir || "d";
          this.loadMap();
        });
        return;
      }
      if (ev.scriptId || ev.script) {
        this.pendingScript = ev.script || DATA.scripts[ev.scriptId];
      }
    }

    if (this.solidAt(nx, ny)) return;
    if (this.npcAt(nx, ny)) return;
    if (this.chestAt(nx, ny)) return;

    this.moving = { dx, dy, t: 0 };
  }

  onStep() {
    G.state.steps++;

    // どくのダメージ
    if (G.state.steps % 4 === 0) {
      for (const h of G.state.party) {
        if (h.poison && h.hp > 1) h.hp = Math.max(1, h.hp - 2);
      }
    }

    if (this.pendingScript) {
      const s = this.pendingScript;
      this.pendingScript = null;
      runScript(s);
      return;
    }

    this.checkEncounter();
  }

  checkEncounter() {
    const m = this.map;
    let table = null;
    if (m.encounter) table = DATA.encounters[m.encounter];
    else if (m.zones) {
      const z = m.zones.find((z) =>
        G.state.x >= z.x && G.state.x < z.x + z.w && G.state.y >= z.y && G.state.y < z.y + z.h);
      if (z) table = DATA.encounters[z.table];
    }
    if (!table) return;
    if (Math.random() < table.rate) {
      const group = table.groups[Math.floor(Math.random() * table.groups.length)];
      AudioSys.sfx("encounter");
      G.push(new BattleScene(group, {}));
    }
  }

  interact() {
    const [dx, dy] = DIRS[G.state.dir];
    let fx = G.state.x + dx, fy = G.state.y + dy;

    // たからばこ
    const chest = this.chestAt(fx, fy);
    if (chest) {
      const flagKey = "chest_" + chest.id;
      if (G.flag(flagKey)) {
        G.push(new MessageScene("たからばこは からっぽだ。"));
      } else {
        G.setFlag(flagKey, 1);
        AudioSys.sfx("chest");
        if (chest.gold) {
          G.state.gold += chest.gold;
          G.push(new MessageScene(`たからばこを あけた!\n${chest.gold}ギルを てにいれた!`));
        } else if (chest.item) {
          G.addItem(chest.item);
          G.push(new MessageScene(`たからばこを あけた!\n${DATA.items[chest.item].name}を てにいれた!`));
        }
      }
      return;
    }

    // カウンターごしの かいわ
    const t = this.tileAt(fx, fy);
    if (t && t.tile === "counter") { fx += dx; fy += dy; }

    const npc = this.npcAt(fx, fy);
    if (npc && !npc.moving) {
      npc.face = { u: "d", d: "u", l: "r", r: "l" }[G.state.dir];
      runScript(npc.def.script || []);
    }
  }

  // ---------------- NPC ----------------
  updateNpcs(dt) {
    for (const n of this.npcs) {
      if (n.moving) {
        n.moving.t += dt * 3;
        if (n.moving.t >= 1) {
          n.x = n.moving.tx; n.y = n.moving.ty;
          n.moving = null;
        }
        continue;
      }
      if (!n.def.wander) continue;
      n.wt -= dt;
      if (n.wt <= 0) {
        n.wt = Math.random() * 3 + 1.5;
        const dirs = Object.values(DIRS);
        const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
        const tx = n.x + dx, ty = n.y + dy;
        const home = n.def;
        if (Math.abs(tx - home.x) > 2 || Math.abs(ty - home.y) > 2) continue;
        if (this.solidAt(tx, ty)) continue;
        if (tx === G.state.x && ty === G.state.y) continue;
        // プレイヤーの いどうさきタイルにも はいらない
        if (this.moving &&
            tx === G.state.x + this.moving.dx && ty === G.state.y + this.moving.dy) continue;
        if (this.npcAt(tx, ty)) continue;
        if (this.eventAt(tx, ty)) continue;
        if (this.chestAt(tx, ty)) continue;
        n.moving = { tx, ty, t: 0 };
      }
    }
  }

  // ---------------- びょうが ----------------
  draw() {
    const m = this.map;
    const mw = (m.rows[0] || "").length, mh = m.rows.length;

    // プレイヤーのピクセルざひょう
    let px = G.state.x * TILE, py = G.state.y * TILE;
    if (this.moving) {
      px += this.moving.dx * TILE * this.moving.t;
      py += this.moving.dy * TILE * this.moving.t;
    }

    // カメラ
    let camx = px - SCREEN_W / 2 + TILE / 2;
    let camy = py - SCREEN_H / 2 + TILE / 2;
    camx = Math.max(0, Math.min(mw * TILE - SCREEN_W, camx));
    camy = Math.max(0, Math.min(mh * TILE - SCREEN_H, camy));
    if (mw * TILE < SCREEN_W) camx = (mw * TILE - SCREEN_W) / 2;
    if (mh * TILE < SCREEN_H) camy = (mh * TILE - SCREEN_H) / 2;

    Gfx.clear(3);

    const x0 = Math.floor(camx / TILE), y0 = Math.floor(camy / TILE);
    const x1 = x0 + Math.ceil(SCREEN_W / TILE) + 1, y1 = y0 + Math.ceil(SCREEN_H / TILE) + 1;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const t = this.tileAt(tx, ty);
        if (!t) continue;
        Gfx.draw(t.tile, tx * TILE - camx, ty * TILE - camy);
      }
    }

    // たからばこ
    for (const c of (m.chests || [])) {
      const opened = G.flag("chest_" + c.id);
      Gfx.draw(opened ? "chest_open" : "chest", c.x * TILE - camx, c.y * TILE - camy);
    }

    // NPC
    for (const n of this.npcs) {
      if (n.def.hideFlag && G.flag(n.def.hideFlag)) continue;
      let nx = n.x * TILE, ny = n.y * TILE;
      if (n.moving) {
        nx += (n.moving.tx - n.x) * TILE * n.moving.t;
        ny += (n.moving.ty - n.y) * TILE * n.moving.t;
      }
      Gfx.draw(n.def.spr, nx - camx, ny - camy - 2);
    }

    // プレイヤー (カエル化していたら カエルのすがた)
    const lead = G.state.party[0];
    const sprBase = lead ? lead.spr : "hero";
    let sprName, flip = false;
    if (G.state.dir === "u") sprName = sprBase + "_u";
    else if (G.state.dir === "l") sprName = sprBase + "_s";
    else if (G.state.dir === "r") { sprName = sprBase + "_s"; flip = true; }
    else sprName = sprBase + "_d";
    if (!SPR.chars[sprName]) sprName = sprBase;
    if (lead && lead.toad) { sprName = "toad"; flip = false; }
    const bob = this.moving && this.moving.t > 0.25 && this.moving.t < 0.75 ? -1 : 0;
    Gfx.draw(sprName, px - camx, py - camy - 2 + bob, { flip });

    // マップめい
    if (this.nameTimer > 0) {
      Gfx.window(4, 4, 150, 26);
      Gfx.text(m.name, 14, 11);
    }
  }
}
