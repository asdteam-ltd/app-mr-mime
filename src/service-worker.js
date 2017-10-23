var CACHE_NAME = 'mime',
// ссылки на кэшируемые файлы
    cacheUrls = [
        '/',
        '/index.html',
        '/js/main.js',
        '/service-worker.js',
        '/js/vendor.js',
        '/css/style.css',
        '/images/touch/mrmime48.png',
        '/images/touch/mrmime72.png',
        '/images/touch/mrmime96.png',
        '/images/touch/mrmime192.png',
        '/components/add-item/add-item.html',
        '/components/common/common.html',
        '/components/items-list/items-list.html',
        '/components/login/login.html',
        '/components/login/login.html',
        '/components/wishes/wishes.html',
        '/components/dashboard/dashboard.html',
        '/fonts/fontawesome-webfont.woff?v=4.7.0',
        '/fonts/fontawesome-webfont.ttf?v=4.7.0',
];

var CACHE = 'network-or-cache';

// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  // Try network and if it fails, go for the cached copy.
  evt.respondWith(fromNetwork(evt.request, 2000).catch(function () {
    return fromCache(evt.request);
  }));
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(cacheUrls);
  });
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    // Reject in case of timeout.
    var timeoutId = setTimeout(reject, timeout);
    // Fulfill in case of success.
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      console.log('[SERVICE WORKER]', request, response);
      caches[caches.match(request) ? 'put' : 'add'](response);
      fulfill(response);
    // Reject also if network fetch rejects.
    }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}
