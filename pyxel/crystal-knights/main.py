# ============================================================
# クリスタルナイツ (Pyxel版) - きどう
# ============================================================
import pyxel
import gfx
from field import FieldScene, Game
from data import NEW_GAME

BUILD_VERSION = "pyxel-v0.1.0"


class TitleScene:
    def __init__(self):
        self.opaque = True
        self.t = 0

    def update(self):
        self.t += 1 / 30
        if pyxel.btnp(pyxel.KEY_Z) or pyxel.btnp(pyxel.GAMEPAD1_BUTTON_A) or pyxel.btnp(pyxel.KEY_RETURN):
            ng = NEW_GAME
            Game.replace(FieldScene(ng["map"], ng["x"], ng["y"], ng["dir"]))

    def draw(self):
        pyxel.cls(0)
        pyxel.rect(0, 190, gfx.SCREEN_W, 98, 1)
        bob = int(self.t * 2) % 2
        gfx.draw_char("hero_d", 140, 150 + bob)

        gfx.text(92, 46, "CRYSTAL KNIGHTS")
        gfx.text(88, 70, "クリスタルナイツ")
        gfx.text(60, 96, "〜あんこくきしの ものがたり〜")

        if int(self.t * 2) % 2 == 0:
            gfx.text(108, 176, "- PUSH Z -")
        gfx.text(4, 280, BUILD_VERSION)


def update():
    top = Game.top()
    if top:
        top.update()


def draw():
    start = 0
    for i in range(len(Game.scenes) - 1, -1, -1):
        if getattr(Game.scenes[i], "opaque", False):
            start = i
            break
    for i in range(start, len(Game.scenes)):
        scene = Game.scenes[i]
        if hasattr(scene, "draw"):
            scene.draw()


def boot(headless=False):
    gfx.init(headless=headless)
    Game.push(TitleScene())
    if not headless:
        pyxel.run(update, draw)


if __name__ == "__main__":
    boot()
