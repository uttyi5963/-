# クリスタルナイツを iPhone アプリにする手順

Apple Developer Program 登録済みの Mac での作業手順です。
ゲーム本体 (`rpg/`) はそのまま WebView でラップします (Capacitor 使用)。

## 0. 事前に必要なもの
- macOS + Xcode (最新版、App Store から)
- Node.js 18+ (https://nodejs.org)
- このリポジトリを Mac に clone

## 1. Capacitor プロジェクトを作る (初回のみ)

リポジトリ直下に `package.json` と `capacitor.config.json` を用意済みです。
まず `capacitor.config.json` の `appId` を自分のものに書き換えてください
(例: `com.yamada.crystalknights`)。あとは:

```bash
cd <このリポジトリ>
npm install
npm run ios:setup   # ios/ ネイティブプロジェクト生成
npm run ios:open    # Xcode が開く
```

## 2. Xcode での設定
1. 左のプロジェクト → TARGETS → App → **Signing & Capabilities**
   - Team: 自分の Developer アカウントを選択 (自動署名でOK)
   - Bundle Identifier: `com.<あなたのID>.crystalknights`
2. **General**
   - Display Name: クリスタルナイツ
   - App Icons: `rpg/icon-1024.png` (App Store用) と `rpg/icon-512.png` を
     Assets の AppIcon にドラッグ
   - Deployment Info: iPhone / Portrait のみにチェック
3. Info.plist に追記 (画面回転固定・全画面):
   - `UIRequiresFullScreen` = YES

## 3. 実機テスト
- iPhone を USB 接続 → Xcode 上部のデバイス選択で自分の iPhone → ▶ Run
- 初回は iPhone 側で「設定 > 一般 > VPNとデバイス管理」で開発者を信頼

## 4. App Store へ提出
1. Xcode: Product → Archive
2. Organizer が開いたら **Distribute App** → App Store Connect → Upload
3. https://appstoreconnect.apple.com で新規 App を作成
   (スクリーンショット・説明文・プライバシー情報を入力)
4. アップロードしたビルドを選んで審査へ提出

## 5. ゲームを更新したとき
```bash
git pull
npx cap sync ios
```
→ Xcode で再ビルド・再アーカイブするだけです。

## 補足
- **App Store を使わない場合**: iPhone の Safari でゲームの URL を開き、
  共有 → 「ホーム画面に追加」でも全画面アプリとして遊べます
  (PWA 対応済み: オフラインキャッシュ・アイコン・スタンドアロン表示)。
- セーブは WebView 内の localStorage に保存されます。アプリを
  削除するとセーブも消えるので、「パスワード」機能で控えを推奨。
