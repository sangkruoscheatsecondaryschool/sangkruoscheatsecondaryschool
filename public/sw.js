// Service worker for School Management PWA
// Strategy:
//   - Navigations: network-first, fallback to /offline.html
//   - Same-origin static assets: cache-first
//   - Everything else: pass-through (no caching)

const CACHE = "sm-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Same-origin only. Never cache Supabase / third-party.
  if (url.origin !== self.location.origin) return;

  // Never intercept auth/API routes.
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/auth")) return;
  if (url.pathname.startsWith("/_next/data/")) return;

  // Navigations → network-first, fallback to offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(OFFLINE_URL);
        return cached || Response.error();
      }),
    );
    return;
  }

  // Static assets → cache-first.
  const isStatic =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/icon" ||
    url.pathname === "/apple-icon" ||
    /\.(?:css|js|woff2?|ttf|otf|png|jpe?g|svg|webp|ico)$/i.test(url.pathname);

  if (!isStatic) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      });
    }),
  );
});