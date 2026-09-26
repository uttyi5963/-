# クリスタルナイツ (Pyxel版)

既存の `rpg/` 配下にある vanilla JS 版クリスタルナイツとは別に、
[Pyxel](https://github.com/kitao/pyxel) (Python製のレトロゲームエンジン) で
同じ世界観のリメイクを作っています。**v0.1 の現在は最初のヴェルダ城のみ**を
移植した、実験的な最小構成です。

## セットアップ

```bash
pip install pyxel fonttools
```

## ローカルで遊ぶ (要ディスプレイ環境)

```bash
cd pyxel/crystal-knights
pyxel run main.py
```

## 自動テスト (ヘッドレス、ディスプレイ不要)

```bash
python3 test/pyxel-crystal-knights-test.py
```

`pyxel.init(..., headless=True)` と `pyxel.set_btn()` / `pyxel.flip()` を使い、
実際のキー入力をシミュレートしながら画面のピクセルまで検証する。

## Web公開用ビルド

```bash
bash pyxel/crystal-knights/build.sh
```

`pyxel package` → `pyxel app2html` で単一の `index.html` を生成し、
`rpg/pyxel-crystal-knights/index.html` に配置する。この場所に置くのは、
既存の GitHub Pages ワークフロー (`.github/workflows/pages.yml`) が
`rpg/**` の変更だけを監視・公開する設定になっているため
(ワークフロー自体は変更していない)。生成後は `git add`/`commit`/`push` すれば
自動でデプロイされる。

## 日本語フォントについて

Pyxel 標準の `pyxel.text()` は日本語を描画できない (ASCII専用ビットマップフォント)。
そのため `pyxel.Font()` でカスタムTTFを読み込んでいる。フルサイズのIPAゴシック
(約6MB) をそのまま同梱すると重すぎるため、`fonttools` の `pyftsubset` で
**実際にゲーム内で使っている文字だけ**に絞り込んだサブセット (`assets/font.ttf`,
現状 約24KB) を使っている。セリフを追加・変更したら:

```bash
bash pyxel/crystal-knights/make_font.sh
```

を再実行して `assets/font.ttf` を作り直すこと。

## 既知のトレードオフ

- **外部CDN依存**: `pyxel app2html` が生成するHTMLは、ブラウザ上でPythonを
  丸ごと実行する Pyodide ランタイムを `cdn.jsdelivr.net` から読み込む方式。
  既存の3作品(クリスタルナイツ/モンスターシーカー/アルカナダンジョン)が
  完全に依存ゼロ・瞬時に起動するのに対し、こちらは初回読み込みが重くなる
  (Pyodide本体が数十MB規模)。
- **この開発環境での見た目確認の限界**: 開発に使っているサンドボックス環境は
  ネットワークポリシーで `cdn.jsdelivr.net` へのアクセスがブロックされており、
  生成したHTMLを実際にブラウザで動かして視覚確認することができない。
  ヘッドレステストでロジックとピクセル出力は検証済みだが、実際の
  GitHub Pages上での見た目は、公開後に確認する必要がある。
