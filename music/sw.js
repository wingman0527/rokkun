/* ろっくんの おんがくばこ: でんぱが なくても ひらける ように ページと アイコンを おぼえて おく。
   いつもは ネットの あたらしい ものを つかい（4びょう まって こなければ おぼえた もの）、つながらない ときは おぼえた ものを だす。
   この フォルダ（music/）の なかだけ。ほかの ゲームには さわらない */
const NAME = 'onbako-8aacd462';
const FILES = ['./', 'about.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(NAME).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('onbako-') && k !== NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(new URL('./', location.href).pathname)) return;
  const cached = () => caches.open(NAME).then(c => c.match(req, { ignoreSearch: true }));
  const net = fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(NAME).then(c => c.put(url.origin + url.pathname, copy)); } return r; });
  const slow = new Promise(res => setTimeout(res, 4000)).then(cached);
  e.respondWith(Promise.race([net.catch(() => null), slow]).then(r => r || cached()).then(r => r || net));
});
