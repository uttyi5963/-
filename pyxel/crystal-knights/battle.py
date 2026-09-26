# ============================================================
# クリスタルナイツ (Pyxel版) - せんとう (v0.2: レオン1にん vs てき1たい)
# たたかう / にげる
# ============================================================
import random
import pyxel
import gfx
from data import ENEMIES
import state


def rnd(a, b):
    return a + random.random() * (b - a)


class BattleScene:
    def __init__(self, enemy_id, on_win=None):
        self.opaque = True
        self.on_win = on_win
        self.enemy_id = enemy_id
        d = ENEMIES[enemy_id]
        self.enemy = dict(d)
        self.enemy["hp"] = self.enemy["maxhp"]

        self.phase = "msg"
        self.pages = [f"あっ! {self.enemy['name']}が\nとびだしてきた!"]
        self.page = 0
        self.sel = 0
        self.finished = False
        self.won = False
        self.lost = False

    def leon(self):
        return state.STATE["leon"]

    def say(self, *lines):
        self.pages = list(lines)
        self.page = 0
        self.phase = "msg"

    def update(self):
        if self.phase == "msg":
            if pyxel.btnp(pyxel.KEY_Z) or pyxel.btnp(pyxel.GAMEPAD1_BUTTON_A):
                self.page += 1
                if self.page >= len(self.pages):
                    if self.finished:
                        self.close()
                    else:
                        self.phase = "command"
                        self.sel = 0
            return
        if self.phase == "command":
            if pyxel.btnp(pyxel.KEY_UP) or pyxel.btnp(pyxel.KEY_DOWN):
                self.sel = 1 - self.sel
            if pyxel.btnp(pyxel.KEY_Z) or pyxel.btnp(pyxel.GAMEPAD1_BUTTON_A):
                if self.sel == 0:
                    self.do_attack()
                else:
                    self.do_flee()
            return

    def do_attack(self):
        leon = self.leon()
        dmg = max(1, round(leon["str"] - self.enemy["def"] * 0.5 + rnd(-1, 2)))
        self.enemy["hp"] = max(0, self.enemy["hp"] - dmg)
        lines = [f"レオンの こうげき!\n{self.enemy['name']}に {dmg}の ダメージ!"]
        if self.enemy["hp"] <= 0:
            lines.append(f"{self.enemy['name']}を たおした!")
            leon["exp"] += self.enemy["exp"]
            lines.append(f"けいけんち {self.enemy['exp']}を えた!")
            self.finished = True
            self.won = True
            self.say(*lines)
            return
        edmg = max(1, round(self.enemy["atk"] - leon["vit"] * 0.5 + rnd(-1, 2)))
        leon["hp"] = max(0, leon["hp"] - edmg)
        lines.append(f"{self.enemy['name']}の こうげき!\nレオンに {edmg}の ダメージ!")
        if leon["hp"] <= 0:
            lines.append("レオンは たおれてしまった……")
            self.finished = True
            self.lost = True
        self.say(*lines)

    def do_flee(self):
        if random.random() < 0.8:
            self.finished = True
            self.say("うまく にげきれた!")
            return
        edmg = max(1, round(self.enemy["atk"] - self.leon()["vit"] * 0.5 + rnd(-1, 2)))
        self.leon()["hp"] = max(0, self.leon()["hp"] - edmg)
        lines = ["しかし にげられない!", f"{self.enemy['name']}の こうげき!\nレオンに {edmg}の ダメージ!"]
        if self.leon()["hp"] <= 0:
            lines.append("レオンは たおれてしまった……")
            self.finished = True
            self.lost = True
        self.say(*lines)

    def close(self):
        from field import Game
        Game.pop()
        if self.lost:
            # v0.2の かんい ゲームオーバー: HPを 全回復して つづける
            self.leon()["hp"] = self.leon()["maxhp"]
        if self.on_win and self.won:
            self.on_win()

    def draw(self):
        pyxel.cls(1)
        gfx.draw_mon(self.enemy["spr"], 140, 60, scale=3)
        gfx.bar(120, 130, 80, 6, self.enemy["hp"] / self.enemy["maxhp"], 3)
        gfx.text(120, 138, self.enemy["name"])

        gfx.window(4, 152, 312, 60)
        leon = self.leon()
        gfx.text(14, 162, f"レオン Lv{leon['lv']}")
        gfx.text(14, 176, f"HP {leon['hp']}/{leon['maxhp']}")
        gfx.text(14, 190, f"MP {leon['mp']}/{leon['maxmp']}")

        gfx.window(4, 218, 312, 66)
        if self.phase == "msg":
            lines = self.pages[self.page].split("\n")
            for i, line in enumerate(lines[:3]):
                gfx.text(14, 228 + i * 17, line)
        elif self.phase == "command":
            opts = ["たたかう", "にげる"]
            for i, o in enumerate(opts):
                y = 232 + i * 18
                gfx.text(40, y, o)
                if i == self.sel:
                    gfx.cursor(24, y + 2)
