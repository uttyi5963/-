#!/usr/bin/env bash
# クリスタルナイツ (Pyxel版) - Web公開用ビルドスクリプト
#
# Pythonソース一式を .pyxapp にパッケージし、ブラウザで動く単一HTMLに変換して
# rpg/pyxel-crystal-knights/index.html へ配置する (既存のGitHub Pagesワークフローが
# rpg/** を監視しているため、これでワークフローの変更なしに公開できる)。
#
# 実行: bash pyxel/crystal-knights/build.sh
set -euo pipefail
cd "$(dirname "$0")"

rm -f crystal-knights.pyxapp crystal-knights.html
pyxel package . main.py
pyxel app2html crystal-knights.pyxapp

OUT_DIR="../../rpg/pyxel-crystal-knights"
mkdir -p "$OUT_DIR"
cp crystal-knights.html "$OUT_DIR/index.html"

rm -f crystal-knights.pyxapp crystal-knights.html

echo "ビルド完了: $OUT_DIR/index.html"
