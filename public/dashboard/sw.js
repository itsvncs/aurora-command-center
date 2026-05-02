// Service Worker — cache da shell do dashboard
const CACHE = "aurora-shell-v3";
const ASSETS = [
  "/dashboard/",
  "/dashboard/index.html",
  "/dashboard/styles.css",
  "/dashboard/app.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Nunca cachear chamadas dinâmicas do HA
  if (url.pathname.startsWith("/api/")) return;
  if (e.request.method !== "GET") return;
  // Stale-while-revalidate apenas para a shell
  if (!ASSETS.some((a) => url.pathname.endsWith(a.replace("/dashboard/", "/dashboard/")) || url.pathname === a)) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      const network = fetch(e.request).then((res) => {
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
