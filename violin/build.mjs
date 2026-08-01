#!/usr/bin/env node
/*
 * 音程チェッカー ビルドスクリプト(依存なし・Node単体で動作)
 *
 *   node build.mjs
 *
 * 入力:
 *   src/template.html      HTMLシェル(script本体は /*__INJECT:名前__* / マーカー)
 *   data/samples.data.js   実録音バイオリンサンプル(base64)
 *   data/pieces.data.js    内蔵曲データ(コンパクト形式)
 *   src/app.js             メインスクリプト
 *
 * 出力:
 *   index.html             単一ファイル版(マニフェスト・アイコンをdata URI埋込、SWなし)
 *   pwa/                   Netlify Drop用フォルダ(index.html / manifest.json / sw.js / アイコン)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SW_CACHE_VERSION = 'ontei-checker-v18';

const read = p => readFileSync(join(ROOT, p), 'utf8');

/* ---- 1) 単一ファイル版の組み立て ---- */
let html = read('src/template.html');
for (const [name, path] of [
  ['samples', 'data/samples.data.js'],
  ['pieces', 'data/pieces.data.js'],
  ['app', 'src/app.js'],
]) {
  const marker = `/*__INJECT:${name}__*/`;
  if (!html.includes(marker)) throw new Error(`テンプレートにマーカーがありません: ${marker}`);
  html = html.split(marker).join(read(path));
}
writeFileSync(join(ROOT, 'index.html'), html);
console.log(`index.html  ${(html.length / 1024).toFixed(0)} KB`);

/* ---- 2) PWA版の組み立て ---- */
mkdirSync(join(ROOT, 'pwa'), { recursive: true });

// 埋め込みマニフェストを取り出してJSONファイル化、アイコンはPNGファイルに展開
const mfMatch = html.match(/<link rel="manifest" href="data:application\/manifest\+json,([^"]+)">/);
if (!mfMatch) throw new Error('data URIマニフェストが見つかりません');
const manifest = JSON.parse(decodeURIComponent(mfMatch[1]));

function writeDataUriPng(dataUri, filename) {
  const b64 = dataUri.replace(/^data:image\/png;base64,/, '');
  writeFileSync(join(ROOT, 'pwa', filename), Buffer.from(b64, 'base64'));
  return filename;
}
manifest.icons = (manifest.icons || []).map(icon => {
  const size = (icon.sizes || 'icon').split('x')[0];
  const file = writeDataUriPng(icon.src, `icon-${size}.png`);
  return { ...icon, src: file };
});
writeFileSync(join(ROOT, 'pwa', 'manifest.json'), JSON.stringify(manifest, null, 2));

let pwaHtml = html
  .replace(/<link rel="manifest" href="data:application\/manifest\+json,[^"]+">/,
           '<link rel="manifest" href="manifest.json">');

const favMatch = pwaHtml.match(/<link rel="icon" href="(data:image\/png;base64,[^"]+)"([^>]*)>/);
if (favMatch) {
  writeDataUriPng(favMatch[1], 'favicon.png');
  pwaHtml = pwaHtml.replace(favMatch[0], `<link rel="icon" href="favicon.png"${favMatch[2]}>`);
}
const appleMatch = pwaHtml.match(/<link rel="apple-touch-icon" href="(data:image\/png;base64,[^"]+)"([^>]*)>/);
if (appleMatch) {
  writeDataUriPng(appleMatch[1], 'apple-touch-icon.png');
  pwaHtml = pwaHtml.replace(appleMatch[0], `<link rel="apple-touch-icon" href="apple-touch-icon.png"${appleMatch[2]}>`);
}

pwaHtml = pwaHtml.replace('</body>', `<script>
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}
</script>
</body>`);
writeFileSync(join(ROOT, 'pwa', 'index.html'), pwaHtml);

// Service Worker(キャッシュ優先。バージョンはこのファイル先頭の SW_CACHE_VERSION で管理)
// 重複除去必須: 同じURLが2回あると cache.addAll が reject してSWのインストールが失敗する
// (maskable用に同じ512pxアイコンがマニフェストに2エントリある)
const precache = [...new Set(['./', './index.html', './manifest.json',
  ...manifest.icons.map(i => './' + i.src),
  ...(favMatch ? ['./favicon.png'] : []),
  ...(appleMatch ? ['./apple-touch-icon.png'] : [])])];
writeFileSync(join(ROOT, 'pwa', 'sw.js'), `const CACHE = '${SW_CACHE_VERSION}';
const ASSETS = ${JSON.stringify(precache, null, 2)};
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
`);
console.log(`pwa/        index.html + manifest.json + sw.js (${SW_CACHE_VERSION}) + アイコン${manifest.icons.length + (favMatch ? 1 : 0) + (appleMatch ? 1 : 0)}個`);
