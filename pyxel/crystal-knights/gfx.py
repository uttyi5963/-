# ============================================================
# クリスタルナイツ (Pyxel版) - びょうが ヘルパー
# ============================================================
import pyxel
from sprites import TILES, CHARS, MONS

SCREEN_W = 320
SCREEN_H = 288
TILE = 16

# ゲームボーイ 4かいちょう パレット (あかるい -> くらい)
PAL = [0x9BBC0F, 0x8BAC0F, 0x306230, 0x0F380F]

JP_FONT = None


def init(headless=False):
    global JP_FONT
    pyxel.init(SCREEN_W, SCREEN_H, title="クリスタルナイツ", fps=30, headless=headless)
    pyxel.colors[0:4] = PAL
    try:
        JP_FONT = pyxel.Font("assets/font.ttf", 8)
    except Exception:
        JP_FONT = None


def draw_grid(rows, x, y, scale, variant=None):
    """'.'=とうめい、'0'-'3'=パレットいろ の もじれつを びょうがする。
    variant: 'dark' (全体をくらく) / 'flash' (はんてん)"""
    for ry, row in enumerate(rows):
        for rx, ch in enumerate(row):
            if ch < "0" or ch > "3":
                continue
            pi = int(ch)
            if variant == "dark":
                pi = 2 if pi == 0 else 3
            elif variant == "flash":
                pi = 3 - pi
            px = x + rx * scale
            py = y + ry * scale
            if scale == 1:
                pyxel.pset(px, py, pi)
            else:
                pyxel.rect(px, py, scale, scale, pi)


def draw_tile(name, x, y):
    rows = TILES.get(name)
    if rows:
        draw_grid(rows, x, y, 2)


def draw_char(name, x, y, flip=False, variant=None):
    rows = CHARS.get(name)
    if not rows:
        return
    if flip:
        rows = [row[::-1] for row in rows]
    draw_grid(rows, x, y, 1, variant)


def draw_mon(name, x, y, scale=1, variant=None):
    rows = MONS.get(name)
    if rows:
        draw_grid(rows, x, y, scale, variant)


def text(x, y, s, col=3):
    if JP_FONT:
        pyxel.text(x, y, s, col, JP_FONT)
    else:
        pyxel.text(x, y, s, col)


def text_width(s):
    if JP_FONT:
        return JP_FONT.text_width(s)
    return len(s) * pyxel.FONT_WIDTH


def window(x, y, w, h):
    pyxel.rect(x, y, w, h, 3)
    pyxel.rect(x + 2, y + 2, w - 4, h - 4, 0)
    pyxel.rect(x + 4, y + 4, w - 8, 1, 3)
    pyxel.rect(x + 4, y + h - 5, w - 8, 1, 3)
    pyxel.rect(x + 4, y + 4, 1, h - 8, 3)
    pyxel.rect(x + w - 5, y + 4, 1, h - 8, 3)
    pyxel.rect(x, y, 2, 2, 2)
    pyxel.rect(x + w - 2, y, 2, 2, 2)
    pyxel.rect(x, y + h - 2, 2, 2, 2)
    pyxel.rect(x + w - 2, y + h - 2, 2, 2, 2)


def cursor(x, y):
    pyxel.tri(x, y, x + 7, y + 4, x, y + 8, 3)


def bar(x, y, w, h, ratio, col=3):
    pyxel.rect(x, y, w, h, 1)
    fill_w = max(0, min(w, round(w * ratio)))
    pyxel.rect(x, y, fill_w, h, col)
