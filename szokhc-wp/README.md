# szokhc-wp

医療法人社団 貞栄会 / 静岡ホームクリニック公式サイトの WordPress 移行用ワークスペース。

現状はテーマディレクトリのみ管理しています。WordPress 本体・データベース・アップロード画像はサーバ側で管理する想定です。

## ディレクトリ構成

```
szokhc-wp/
└── szokhc/                    ← WordPressテーマ本体（wp-content/themes/szokhc/ にそのまま置く）
    ├── style.css              テーマヘッダ + デザイントークン + ベーススタイル
    ├── functions.php          ブートストラップ。inc/ 配下を順に読み込む
    ├── header.php             共通ヘッダ（ロゴ・グローバルナビ・TEL）
    ├── footer.php             共通フッタ（フッターウィジェット3列）
    ├── front-page.php         トップページ（セクション順だけ管理）
    ├── page.php / single.php / archive.php / search.php / 404.php / index.php
    ├── searchform.php
    ├── inc/
    │   ├── setup.php          theme support / メニュー / 画像サイズ / ウィジェット
    │   ├── enqueue.php        CSS / JS 読み込み
    │   ├── cpt.php            CPT・タクソノミー定義
    │   ├── customizer.php     クリニック連絡先・ヒーロー領域の設定
    │   └── template-tags.php  ヘルパ関数
    ├── template-parts/
    │   ├── hero.php
    │   ├── audience-nav.php   対象別ナビ（患者／病院／施設）
    │   ├── news.php           お知らせ最新5件
    │   ├── services.php       診療メニュー（CPT: szk_service）
    │   ├── access.php         受診時間・アクセス
    │   └── conference.php     講演会情報（CPT: szk_conference）
    └── assets/
        ├── css/app.css        拡張スタイル
        ├── js/                （未使用、必要時にここに）
        └── images/            （未使用、必要時にここに）
```

## コンテンツタイプ設計

トップページに並ぶ各セクションはハードコードせず、以下に分離しています。

| 種別 | スラッグ | 用途 |
|---|---|---|
| 投稿 (post) | `news` カテゴリ | お知らせ |
| szk_conference | conference | 講演会情報 |
| szk_staff | staff | 医師・スタッフ紹介 |
| szk_service | service | 診療メニュー（在宅診療／リウマチ膠原病など） |
| szk_facility | facility | 拠点・施設 |

タクソノミー：

- `szk_news_category` … お知らせカテゴリ
- `szk_audience` … 対象（患者 / 病院関係者 / 施設関係者）

## カスタマイザ項目

外観 → カスタマイズ から編集できる項目：

- クリニック連絡先：法人名 / クリニック名 / 電話 / FAX / 住所 / 受付時間 / 補足 / 問い合わせメール
- ヒーロー領域：見出し / リード文 / CTA×2 / 背景画像

## メニュー位置

- `global` … グローバルナビ
- `utility` … ヘッダー補助
- `footer` … フッターナビ
- `audience` … 対象別ナビ（説明欄を入れるとカードのリード文になる）

## 導入手順

1. WordPress (6.0+, PHP 8.0+) をサーバに設置
2. `szokhc-wp/szokhc/` を `wp-content/themes/szokhc/` に配置
3. 管理画面 → 外観 → テーマで「Szokhc」を有効化
4. 外観 → カスタマイズ → クリニック連絡先 / ヒーロー領域 を入力
5. 外観 → メニュー で global / footer / audience を作成して割り当て
6. 投稿・CPT に既存サイトのコンテンツを移行

## 残作業（HTML ソース受領後）

- [ ] トップページのブランドカラー・タイポを `style.css` の `:root` に反映
- [ ] ロゴ・ヒーロー画像・診療メニューサムネを `assets/images/` または管理画面メディアに配置
- [ ] 各セクションのマージン・グリッド比率を現サイトに合わせる
- [ ] 既存サイトに固有のセクション（実績報告、社会貢献活動など）があれば template-parts を追加
- [ ] お知らせ・講演会の既存コンテンツを CSV / WXR で移行
