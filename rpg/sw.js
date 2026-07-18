// クリスタルナイツ Service Worker
// 方針: ネットワーク優先 (online なら つねに 最新を配信) + オフライン時は キャッシュに フォールバック。
// キャッシュ名を バージョンで きりかえ、更新のたび 古いキャッシュを 破棄する。
const CACHE = "ck-v7";
const ASSETS = [
  "./", "./index.html", "./manifest.json",
  "./icon-180.png", "./icon-512.png",
  "./js/sprites.js", "./js/data.js", "./js/engine.js",
  "./js/field.js", "./js/menu.js", "./js/battle.js", "./js/main.js",
];

self.addEventListener("install", (e) => {
  // 新しい SW を すぐ有効化 (待機しない)
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  // 古いバージョンの キャッシュを すべて削除 → 確実に 最新コードへ
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return; // 外部リクエストは そのまま

  // ネットワーク優先: つながれば 最新を とりに いき、キャッシュも 更新。
  // オフライン/失敗時のみ キャッシュを つかう。
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
