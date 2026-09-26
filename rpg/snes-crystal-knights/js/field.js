// ============================================================
// クリスタルナイツ (SNES風リメイク) - フィールドシーン
// ============================================================

const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };

class FieldScene {
  constructor(mapId, x, y, dir) {
    this.opaque = true;
    this.mapId = mapId;
    this.x = x;
    this.y = y;
    this.dir = dir || "d";
    this.moving = null; // {dx,dy,t}
    this.nameTimer = 2.0;
  }

  get map() { return DATA.maps[this.mapId]; }

  tileAt(x, y) {
    const m = this.map;
    const row = m.rows[y];
    if (row === undefined) return null;
    if (x < 0 || x >= row.length) return null;
    return m.legend[row[x]] || null;
  }

  solidAt(x, y) {
    const t = this.tileAt(x, y);
    return !t || !!t.solid;
  }

  npcAt(x, y) {
    return (this.map.npcs || []).find((n) => n.x === x && n.y === y);
  }

  eventAt(x, y) {
    return (this.map.events || []).find((e) => e.x === x && e.y === y);
  }

  update(dt) {
    if (this.nameTimer > 0) this.nameTimer -= dt;

    if (this.moving) {
      this.moving.t += dt * 5.2;
      if (this.moving.t >= 1) {
        this.x += this.moving.dx;
        this.y += this.moving.dy;
        this.moving = null;
        this.onStep();
      }
      return;
    }

    if (Input.tap("a")) { this.interact(); return; }

    for (const [d, [dx, dy]] of Object.entries(DIRS)) {
      const key = { u: "up", d: "down", l: "left", r: "right" }[d];
      if (Input.held(key)) { this.tryMove(d, dx, dy); return; }
    }
  }

  tryMove(d, dx, dy) {
    this.dir = d;
    const nx = this.x + dx, ny = this.y + dy;
    const ev = this.eventAt(nx, ny);
    if (ev) {
      if (ev.type === "info") { G.push(new MessageScene(ev.msg)); return; }
      if (ev.type === "warp") { this.warpTo(ev.map, ev.wx, ev.wy, ev.dir); return; }
    }
    if (this.solidAt(nx, ny)) return;
    if (this.npcAt(nx, ny)) return;
    this.moving = { dx, dy, t: 0 };
  }

  warpTo(mapId, x, y, dir) {
    this.mapId = mapId;
    this.x = x; this.y = y; this.dir = dir || "d";
    this.moving = null;
    this.nameTimer = 2.0;
  }

  interact() {
    const [dx, dy] = DIRS[this.dir];
    const npc = this.npcAt(this.x + dx, this.y + dy);
    if (npc) G.push(new MessageScene(npc.msg));
  }

  onStep() {
    const tableId = this.map.encounter;
    if (!tableId) return;
    const table = DATA.encounters[tableId];
    if (Math.random() < table.rate) {
      const enemyId = table.mons[Math.floor(Math.random() * table.mons.length)];
      G.push(new BattleScene(enemyId));
    }
  }

  draw() {
    const m = this.map;
    const mw = m.rows[0].length, mh = m.rows.length;

    let px = this.x * TILE, py = this.y * TILE;
    if (this.moving) {
      px += this.moving.dx * TILE * this.moving.t;
      py += this.moving.dy * TILE * this.moving.t;
    }

    let camx = px - SCREEN_W / 2 + TILE / 2;
    let camy = py - SCREEN_H / 2 + TILE / 2;
    camx = Math.max(0, Math.min(mw * TILE - SCREEN_W, camx));
    camy = Math.max(0, Math.min(mh * TILE - SCREEN_H, camy));
    if (mw * TILE < SCREEN_W) camx = (mw * TILE - SCREEN_W) / 2;
    if (mh * TILE < SCREEN_H) camy = (mh * TILE - SCREEN_H) / 2;

    Gfx.clear(0);

    const x0 = Math.floor(camx / TILE), y0 = Math.floor(camy / TILE);
    const x1 = x0 + Math.ceil(SCREEN_W / TILE) + 1, y1 = y0 + Math.ceil(SCREEN_H / TILE) + 1;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const t = this.tileAt(tx, ty);
        if (!t) continue;
        Gfx.draw(t.tile, tx * TILE - camx, ty * TILE - camy);
      }
    }

    for (const n of (m.npcs || [])) {
      Gfx.draw(n.spr, n.x * TILE - camx, n.y * TILE - camy - TILE);
    }

    const sprName = { u: "hero_u", d: "hero_d", l: "hero_s", r: "hero_s" }[this.dir];
    const flip = this.dir === "r";
    Gfx.draw(sprName, px - camx, py - camy - TILE, { flip });

    if (this.nameTimer > 0) {
      Gfx.window(8, 8, 240, 46);
      Gfx.text(m.name, 26, 22);
    }
  }
}
