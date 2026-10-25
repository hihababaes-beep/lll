// يحفظ مكتبات الإنترنت (خرائط، فايربيس، أيقونات) بعد أول تشغيل ليفتح التطبيق أسرع.
// لا يحفظ index.html نفسه ولا بيانات فايربيس، فتبقى تحديثات تطبيقك فورية.
const CACHE = 'cdn-libs-v1';
const HOSTS = ['unpkg.com', 'www.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (!HOSTS.includes(u.hostname)) return;
  if (!/\.(js|css|woff2?)(\?|$)/.test(u.pathname)) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const update = fetch(req).then(r => { if (r && r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(update); return hit; }
    return (await update) || Response.error();
  })());
});
