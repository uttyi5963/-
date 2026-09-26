# ============================================================
# クリスタルナイツ (Pyxel版) - ゲームデータ (v0.2: 城 + フィールドの一部)
# ============================================================

NOT_YET = "この さきは まだ じっそうされていない。\nつぎの アップデートを おまちください。"

MAPS = {
    "castle": {
        "name": "ヴェルダ城",
        "legend": {
            "#": {"tile": "wall", "solid": True},
            "B": {"tile": "banner", "solid": True},
            "T": {"tile": "torch", "solid": True},
            ".": {"tile": "floor", "solid": False},
            "c": {"tile": "carpet", "solid": False},
            "P": {"tile": "pillar", "solid": True},
            "d": {"tile": "door", "solid": False},
        },
        "rows": [
            "##B#T##B#cc#B##T#B##",
            "#........cc........#",
            "#..P.....cc.....P..#",
            "#........cc........#",
            "#........cc........#",
            "#..P.....cc.....P..#",
            "#........cc........#",
            "#........cc........#",
            "#..P.....cc.....P..#",
            "#........cc........#",
            "#........cc........#",
            "#########dd#########",
        ],
        "events": [
            {"x": 9, "y": 11, "type": "warp", "map": "world", "wx": 7, "wy": 27, "dir": "d"},
            {"x": 10, "y": 11, "type": "warp", "map": "world", "wx": 7, "wy": 27, "dir": "d"},
        ],
        "npcs": [
            {"id": "minister", "x": 5, "y": 1, "spr": "villager",
             "msg": "大臣「レオンどの、おめざめですか。\n世界会議への みちのりは まだ\nはじまったばかりで ございます」"},
            {"id": "scholar", "x": 14, "y": 3, "spr": "elder",
             "msg": "宮廷学者リグル「六柱の 守護者たちが\n各地で あばれておる。まずは ちかくの\n村から たずねて みると よかろう」"},
        ],
        "chests": [],
        "encounter": None,
    },
    "world": {
        "name": "フィールド",
        "legend": {
            "w": {"tile": "water", "solid": True},
            ".": {"tile": "grass", "solid": False},
            "f": {"tile": "forest", "solid": False},
            "m": {"tile": "mountain", "solid": True},
            "b": {"tile": "bridge", "solid": False},
            "C": {"tile": "icon_castle", "solid": False},
            "Q": {"tile": "icon_castle", "solid": False},
        },
        "rows": [
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            "wwmmmmmmmmmmmmmmwwwwwwwwwwwwwwwwwwwwwwww",
            "wwm..........Qmwwwwwwwwwww.....wwwwwwwww",
            "wwm.....f.....mwwwwwwwwwww..f..wwwwwwwww",
            "wwmmmmmm.mmm.mmwwwwwwwwwww.....wwwwwwwww",
            "wwffffff.ffffffmmmmffffffwwwwbwwwwwwwwww",
            "wwffffff.ffffffmmmmffffffwwwwbwwwwwwwwww",
            "wwffffff.ffffffmmmmffffffwwwwbwwwwwwwwww",
            "ww..............mmmm..........wwwwwwwwww",
            "ww.....f........fmmm....ff........wwwwww",
            "ww....fff.......mmmm...ffff.......wwwwww",
            "ww.....f........mmmm....ff........wwwwww",
            "ww..............mmmm..............wwwwww",
            "ww..f...........mmmm..............wwwwww",
            "ww.ff...........mmmm......ff......wwwwww",
            "ww..............mmmm.....ffff.f...wwwwww",
            "ww..............mmmm......ff......wwwwww",
            "ww..............mmmm..............wwwwww",
            "ww..............mmmm..............wwwwww",
            "ww..............fmmf..............wwwwww",
            "ww..............mmmm..............wwwwww",
            "ww..............mmmm.......f......wwwwww",
            "ww...f..........mmmm..............wwwwww",
            "ww..fff.........mmmm..f...........wwwwww",
            "ww...f..........mmmm.ff...........wwwwww",
            "ww.....C........mmmm..f...........wwwwww",
            "ww..............mmmm..............wwwwww",
            "ww..........f...mmmm......f..f....wwwwww",
            "ww...ff.........mmmm.....ff.......wwwwww",
            "ww....f..f......mmmm..............wwwwww",
            "ww..............mmmm..............wwwwww",
            "www.............mmmm............wwwwwwww",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        ],
        "events": [
            {"x": 7, "y": 26, "type": "warp", "map": "castle", "wx": 9, "wy": 10, "dir": "u"},
            {"x": 10, "y": 28, "type": "info", "msg": NOT_YET},
            {"x": 15, "y": 14, "type": "info", "msg": NOT_YET},
            # 山脈の 東がわは 洞窟/飛空艇(未実装)でしか たどりつけない区画。
            # つながる ルートが できるまでは reachable=False としておく。
            {"x": 27, "y": 22, "type": "info", "msg": NOT_YET, "reachable": False},
            {"x": 16, "y": 20, "type": "info", "msg": NOT_YET},
            {"x": 19, "y": 20, "type": "info", "msg": NOT_YET, "reachable": False},
            {"x": 16, "y": 10, "type": "info", "msg": NOT_YET},
            {"x": 21, "y": 7, "type": "info", "msg": NOT_YET, "reachable": False},
            {"x": 9, "y": 30, "type": "info", "msg": NOT_YET},
            {"x": 30, "y": 16, "type": "info", "msg": NOT_YET, "reachable": False},
            {"x": 5, "y": 24, "type": "info", "msg": NOT_YET},
        ],
        "npcs": [],
        "chests": [],
        "encounter": "plains",
        "spawn": (7, 27),
        "allow_disconnected": True,
    },
}

NEW_GAME = {"map": "castle", "x": 9, "y": 5, "dir": "d"}

# ---------------- てき (v0.2: 平原の 2しゅるい) ----------------
ENEMIES = {
    "goblin": {"name": "ゴブリン", "spr": "goblin", "maxhp": 16, "atk": 7, "def": 2, "agi": 4, "exp": 5, "gold": 6},
    "bat": {"name": "大コウモリ", "spr": "bat", "maxhp": 12, "atk": 6, "def": 1, "agi": 9, "exp": 4, "gold": 4},
}

ENCOUNTERS = {
    "plains": {"rate": 1 / 20, "mons": ["goblin", "goblin", "bat"]},
}
