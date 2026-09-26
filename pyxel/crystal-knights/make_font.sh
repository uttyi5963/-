#!/usr/bin/env bash
# クリスタルナイツ (Pyxel版) - つかっている文字だけを ふくむ フォントを つくりなおす
#
# data.py / field.py / main.py 内の 文字列リテラルから 使用中の文字を あつめ、
# IPAゴシックフォントを その文字だけに サブセットして assets/font.ttf を つくる。
# ゲーム内の セリフを ふやしたら、この スクリプトを 再実行すること。
#
# 実行: bash pyxel/crystal-knights/make_font.sh
set -euo pipefail
cd "$(dirname "$0")"

CHARS=$(python3 - <<'PYEOF'
import re
chars = set()
for fname in ["data.py", "field.py", "main.py"]:
    src = open(fname, encoding="utf-8").read()
    for m in re.finditer(r'"((?:[^"\\]|\\.)*)"', src):
        chars.update(m.group(1))
    for m in re.finditer(r"'((?:[^'\\]|\\.)*)'", src):
        chars.update(m.group(1))
uniq = sorted(c for c in chars if ord(c) > 127)
print("".join(uniq))
PYEOF
)

FONT_SRC="/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf"
if [ ! -f "$FONT_SRC" ]; then
  echo "IPAゴシックフォントが見つかりません: $FONT_SRC" >&2
  exit 1
fi

mkdir -p assets
python3 -m fontTools.subset "$FONT_SRC" \
  --output-file=assets/font.ttf \
  --text="${CHARS} abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?():;-〜「」" \
  --glyph-names \
  --layout-features='' \
  --no-hinting

echo "フォント再生成完了: assets/font.ttf ($(du -h assets/font.ttf | cut -f1))"
