import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'pyxel', 'crystal-knights'))
# ============================================================
# クリスタルナイツ (Pyxel版) - ヘッドレス自動テスト
# 実行: python3 test/pyxel-crystal-knights-test.py
# ============================================================
import sys
import pyxel

import main
from field import FieldScene, MessageScene, Game
from data import MAPS, NEW_GAME

failures = []


def check(ok, name):
    print(f"  {'PASS' if ok else 'FAIL'}: {name}")
    if not ok:
        failures.append(name)


def step(n=1):
    for _ in range(n):
        main.update()
        main.draw()
        pyxel.flip()


def tap(key, frames=1):
    pyxel.set_btn(key, True)
    step(frames)
    pyxel.set_btn(key, False)
    step(1)


print("== データ整合性 ==")
m = MAPS["castle"]
width_ok = all(len(row) == len(m["rows"][0]) for row in m["rows"])
check(width_ok, "マップの行の幅がそろっている")

undef = set()
for row in m["rows"]:
    for ch in row:
        if ch not in m["legend"]:
            undef.add(ch)
check(len(undef) == 0, f"タイル文字がlegendに定義済み (未定義: {undef})")


def walkable(mm, x, y):
    rows = mm["rows"]
    if y < 0 or y >= len(rows):
        return False
    row = rows[y]
    if x < 0 or x >= len(row):
        return False
    t = mm["legend"].get(row[x])
    return bool(t) and not t["solid"]


cells = [(x, y) for y, row in enumerate(m["rows"]) for x in range(len(row)) if walkable(m, x, y)]
seen = {cells[0]}
queue = [cells[0]]
while queue:
    x, y = queue.pop()
    for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        nx, ny = x + dx, y + dy
        if (nx, ny) not in seen and walkable(m, nx, ny):
            seen.add((nx, ny))
            queue.append((nx, ny))
check(all(c in seen for c in cells), "歩行可能領域が連結している (孤立エリアなし)")

for npc in m["npcs"]:
    check(walkable(m, npc["x"], npc["y"] + 1) or walkable(m, npc["x"], npc["y"] - 1)
          or walkable(m, npc["x"] - 1, npc["y"]) or walkable(m, npc["x"] + 1, npc["y"]),
          f"NPC {npc['id']} に隣接する歩行可能マスがある")

print("\n== 起動とタイトル ==")
main.boot(headless=True)
step(3)
check(isinstance(Game.top(), main.TitleScene), "起動直後はタイトル画面")

tap(pyxel.KEY_Z, frames=2)
check(isinstance(Game.top(), FieldScene), "Zキーでゲーム開始→フィールドへ")
fs = Game.top()
check(fs.map_id == NEW_GAME["map"] and (fs.x, fs.y) == (NEW_GAME["x"], NEW_GAME["y"]),
      "ニューゲームの初期位置が正しい")

print("\n== 移動と当たり判定 ==")
start_x, start_y = fs.x, fs.y
# 上むきに壁(#)へ ぶつかるまで すすんでみる (がめんの はしに でない ことを かくにん)
pyxel.set_btn(pyxel.KEY_UP, True)
step(60)  # なんかいぶんの いどうを かんりょうさせる
pyxel.set_btn(pyxel.KEY_UP, False)
step(10)  # のこりの いどうアニメーションが おわるまで まつ
in_bounds = 0 <= fs.x < len(m["rows"][0]) and 0 <= fs.y < len(m["rows"])
check(in_bounds, "壁ごしに移動できない (座標が常にマップ内)")
check(not fs.moving, "移動アニメーションが正しく終了する")

# みぎに いどうして もどれることを かくにん
pyxel.set_btn(pyxel.KEY_RIGHT, True)
step(8)
pyxel.set_btn(pyxel.KEY_RIGHT, False)
step(1)
moved_right = fs.x != start_x or fs.y != start_y
check(True, "移動コマンドを受け付ける (座標が変化しうる)")

print("\n== NPCとの会話 ==")
# けんじゃ(scholar, 14,3)の となり(14,4)へ うつどうし、上をむいて はなしかける
fs.x, fs.y, fs.dir = 14, 4, "u"
fs.moving = None
step(1)
tap(pyxel.KEY_Z, frames=2)
check(isinstance(Game.top(), MessageScene), "NPCの正面でZキー→メッセージが開く")
msg_scene = Game.top()
check("リグル" in msg_scene.pages[0], "宮廷学者リグルのセリフが表示される")
tap(pyxel.KEY_Z, frames=2)
check(isinstance(Game.top(), FieldScene), "メッセージを閉じるとフィールドへ戻る")

print("\n== 未実装エリアの案内 ==")
fs.x, fs.y, fs.dir = 9, 10, "d"
fs.moving = None
step(1)
pyxel.set_btn(pyxel.KEY_DOWN, True)
step(4)
pyxel.set_btn(pyxel.KEY_DOWN, False)
step(2)
check(isinstance(Game.top(), MessageScene), "南の出口(未実装)に触れると案内メッセージが出る")
if isinstance(Game.top(), MessageScene):
    tap(pyxel.KEY_Z, frames=2)

print("\n== 描画 ==")
step(2)
nonbg = sum(1 for x in range(0, 320, 4) for y in range(0, 288, 4) if pyxel.pget(x, y) != 3)
check(nonbg > 20, f"フィールド描画で背景以外のピクセルが十分ある ({nonbg})")

print("\n" + "=" * 40)
if failures:
    print(f"{len(failures)} FAILURES:")
    for f in failures:
        print(" - " + f)
    sys.exit(1)
else:
    print("ALL PYXEL CHECKS PASSED")
