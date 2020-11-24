const staticAssets = [
  './pwa',
  './pwa/style.css',
  './pwa/index.js',
  './pwa/index.html',
  './pwa/images',
  './pwa/images/icons',
  './pwa/images/icons/lqtfe_30x30.png',
  './pwa/images/icons/lqtfe_512x512.png',
];

self.addEventListener('install', async () => {
  const cache = await caches.open('static-cache');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.url) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(newtorkFirst(req));
  }
});

self.addEventListener('notificationclick', function (event) {
  // console.log('event::', event, clients);
  event.notification.close();
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    includeUncontrolled: true
  }).then(function(clientList) {
    for(let client of clientList) {
      console.log('client::', client);
      if (client.url === event.notification.data.url && 'focused' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow)
      return clients.openWindow('/');
  }));
});

async function cacheFirst(req) {
  const cachedResponse = caches.match(req);
  return cachedResponse || fetch(req);
}

async function newtorkFirst(req) {
  const cache = await caches.open('dynamic-cache');

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}
