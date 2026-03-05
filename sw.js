const CACHE = 'btc-ema-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'SIGNAL') return;
  const { signal, price, sl, tp1, tp2, strength, strengthLabel } = e.data;
  const emoji = signal === 'BUY' ? '🟢' : '🔴';
  self.registration.showNotification(`${emoji} BTC ${signal} SIGNAL — $${price}`, {
    body: `💪 ${strengthLabel} (${strength}/100)\n🛑 Stop Loss: $${sl}\n🎯 TP1: $${tp1}  🚀 TP2: $${tp2}`,
    tag: 'btc-signal', renotify: true, requireInteraction: true,
    vibrate: [300, 100, 300, 100, 600]
  });
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./index.html'));
});
