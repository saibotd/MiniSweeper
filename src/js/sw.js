var CACHE = 'network-or-cache';

self.addEventListener('install', function(evt) {
        evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
    if(evt.request.method == 'GET'){
        evt.respondWith(fromCache(evt.request));
        evt.waitUntil(update(evt.request));
    } else {
        evt.respondWith(fromNetwork(evt.request, 5000));
    }
});

function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            './css/app.css',
            './js/app.js',
            './index.html',
            'https://fonts.googleapis.com/css?family=Fredoka+One'
        ]);
    });
}

function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request, { mode: "cors" }).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || fromNetwork(request, 5000)
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}
