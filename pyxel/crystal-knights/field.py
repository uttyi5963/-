# ============================================================
# クリスタルナイツ (Pyxel版) - フィールドシーン
# ============================================================
import pyxel
import gfx
from data import MAPS

DIRS = {"u": (0, -1), "d": (0, 1), "l": (-1, 0), "r": (1, 0)}


class MessageScene:
    """かんたんな メッセージまど。Zで つぎへ すすむ。"""

    def __init__(self, text, on_done=None):
        self.pages = text if isinstance(text, list) else [text]
        self.page = 0
        self.on_done = on_done
        self.opaque = False

    def update(self):
        if pyxel.btnp(pyxel.KEY_Z) or pyxel.btnp(pyxel.GAMEPAD1_BUTTON_A):
            self.page += 1
            if self.page >= len(self.pages):
                Game.pop()
                if self.on_done:
                    self.on_done()

    def draw(self):
        gfx.window(4, 218, 312, 66)
        lines = self.pages[self.page].split("\n")
        for i, line in enumerate(lines[:3]):
            gfx.text(14, 228 + i * 17, line)


class Game:
    """かんたんな シーンスタック。JS版の G.scenes と おなじやくわり。"""

    scenes = []

    @classmethod
    def push(cls, scene):
        cls.scenes.append(scene)

    @classmethod
    def pop(cls):
        if cls.scenes:
            return cls.scenes.pop()

    @classmethod
    def top(cls):
        return cls.scenes[-1] if cls.scenes else None

    @classmethod
    def replace(cls, scene):
        cls.scenes = [scene]


class FieldScene:
    def __init__(self, map_id, x, y, direction="d"):
        self.opaque = True
        self.map_id = map_id
        self.x = x
        self.y = y
        self.dir = direction
        self.moving = None  # (dx, dy, t)
        self.name_timer = 2.0

    @property
    def map(self):
        return MAPS[self.map_id]

    def tile_at(self, x, y):
        m = self.map
        rows = m["rows"]
        if y < 0 or y >= len(rows):
            return None
        row = rows[y]
        if x < 0 or x >= len(row):
            return None
        return m["legend"].get(row[x])

    def solid_at(self, x, y):
        t = self.tile_at(x, y)
        return t is None or t["solid"]

    def npc_at(self, x, y):
        for n in self.map.get("npcs", []):
            if n["x"] == x and n["y"] == y:
                return n
        return None

    def event_at(self, x, y):
        for e in self.map.get("events", []):
            if e["x"] == x and e["y"] == y:
                return e
        return None

    def update(self):
        if self.name_timer > 0:
            self.name_timer -= 1 / 30

        if self.moving:
            dx, dy, t = self.moving
            t += 5.2 / 30
            if t >= 1:
                self.x += dx
                self.y += dy
                self.moving = None
            else:
                self.moving = (dx, dy, t)
            return

        if pyxel.btnp(pyxel.KEY_Z) or pyxel.btnp(pyxel.GAMEPAD1_BUTTON_A):
            self.interact()
            return

        for d, (dx, dy) in DIRS.items():
            key = {"u": pyxel.KEY_UP, "d": pyxel.KEY_DOWN, "l": pyxel.KEY_LEFT, "r": pyxel.KEY_RIGHT}[d]
            if pyxel.btn(key):
                self.try_move(d, dx, dy)
                return

    def try_move(self, d, dx, dy):
        self.dir = d
        nx, ny = self.x + dx, self.y + dy
        ev = self.event_at(nx, ny)
        if ev:
            if ev["type"] == "exit":
                Game.push(MessageScene(ev["msg"]))
                return
        if self.solid_at(nx, ny):
            return
        if self.npc_at(nx, ny):
            return
        self.moving = (dx, dy, 0)

    def interact(self):
        dx, dy = DIRS[self.dir]
        fx, fy = self.x + dx, self.y + dy
        npc = self.npc_at(fx, fy)
        if npc:
            Game.push(MessageScene(npc["msg"]))

    def draw(self):
        m = self.map
        mw = len(m["rows"][0])
        mh = len(m["rows"])

        px = self.x * gfx.TILE
        py = self.y * gfx.TILE
        if self.moving:
            dx, dy, t = self.moving
            px += dx * gfx.TILE * t
            py += dy * gfx.TILE * t

        camx = px - gfx.SCREEN_W / 2 + gfx.TILE / 2
        camy = py - gfx.SCREEN_H / 2 + gfx.TILE / 2
        camx = max(0, min(mw * gfx.TILE - gfx.SCREEN_W, camx))
        camy = max(0, min(mh * gfx.TILE - gfx.SCREEN_H, camy))
        if mw * gfx.TILE < gfx.SCREEN_W:
            camx = (mw * gfx.TILE - gfx.SCREEN_W) / 2
        if mh * gfx.TILE < gfx.SCREEN_H:
            camy = (mh * gfx.TILE - gfx.SCREEN_H) / 2

        pyxel.cls(3)

        x0 = int(camx // gfx.TILE)
        y0 = int(camy // gfx.TILE)
        x1 = x0 + gfx.SCREEN_W // gfx.TILE + 1
        y1 = y0 + gfx.SCREEN_H // gfx.TILE + 1
        for ty in range(y0, y1 + 1):
            for tx in range(x0, x1 + 1):
                t = self.tile_at(tx, ty)
                if not t:
                    continue
                gfx.draw_tile(t["tile"], tx * gfx.TILE - camx, ty * gfx.TILE - camy)

        for n in m.get("npcs", []):
            gfx.draw_char(n["spr"], n["x"] * gfx.TILE - camx, n["y"] * gfx.TILE - camy - 2)

        spr_name = {"u": "hero_u", "d": "hero_d", "l": "hero_s", "r": "hero_s"}[self.dir]
        flip = self.dir == "r"
        gfx.draw_char(spr_name, px - camx, py - camy - 2, flip=flip)

        if self.name_timer > 0:
            gfx.window(4, 4, 150, 26)
            gfx.text(14, 11, m["name"])
