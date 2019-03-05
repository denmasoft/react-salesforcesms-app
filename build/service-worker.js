'use strict';

var precacheConfig = [["/asset-manifest.json","2e462385675f6651b792078bdded9c48"],["/css/jquery.gritter.css","f780ac5406879c350ee1c2481b045222"],["/css/jquery.gritter.min.css","8fbd35a3d301749de53f4f72ad421ef2"],["/css/loading.css","21c8820fe3fdfe39c8c78cfb403766c0"],["/css/normalize.css","519121fa4cdf6782a4c1c412564605e2"],["/css/sms-salesforce.webflow.css","ac19e95a8e7fd5a94e072af96425bcc1"],["/css/webflow.css","14a1770b3cc975353d519199ecd7e99f"],["/favicon.ico","c92b85a5b907c70211f4ec25e29a8c4a"],["/font-awesome/4.5.0/css/font-awesome.min.css","7c5c70efc6386e1f69e66154da8c5c8d"],["/font-awesome/4.5.0/fonts/fontawesome-webfont.eot","32400f4e08932a94d8bfd2422702c446"],["/font-awesome/4.5.0/fonts/fontawesome-webfont.svg","65e8f7dd6a65aa5812afa9050bfc720e"],["/font-awesome/4.5.0/fonts/fontawesome-webfont.ttf","a3de2170e4e9df77161ea5d3f31b2668"],["/font-awesome/4.5.0/fonts/fontawesome-webfont.woff","a35720c2fed2c7f043bc7e4ffb45e073"],["/font-awesome/4.5.0/fonts/fontawesome-webfont.woff2","db812d8a70a4e88e888744c1c9a27e89"],["/fonts/fontawesome-webfont.eot","674f50d287a8c48dc19ba404d20fe713"],["/fonts/fontawesome-webfont.ttf","b06871f281fee6b241d60582ae9369b9"],["/fonts/fontawesome-webfont.woff","fee66e712a8a08eef5805a46892932ad"],["/fonts/fontawesome-webfont.woff2","af7ae505a9eed503f8b8e6982036873e"],["/images/artsfon.com-86256-p-1600.jpeg","528a065ac12a13622d4e1b6dd674dc46"],["/images/artsfon.com-86256-p-2000.jpeg","59fa35371d1f42c6727cf67db700afc0"],["/images/artsfon.com-86256-p-800.jpeg","3a2a88b843ddc0bc1f1d2375ad0b626c"],["/images/artsfon.com-86256.jpg","e5a3a58fcc00eac2fc6410edd20a909c"],["/images/gritter-light.png","e63064048f2e8659e3463152e9538fe4"],["/images/gritter-long.png","73ab5f9e18c8c475e178b54443cf6184"],["/images/gritter.png","0d28eb4cdd458ada4abc38b596ad281c"],["/images/ie-spacer.gif","df3e567d6f16d040326c7a0ea29a4f41"],["/images/logo-256x256.png","0c595b7a7698db956075ac7f951301ff"],["/images/logo-32x32.png","819a19b0d09479d348ef7a03eeaaf862"],["/images/logo.ico","8e3b772d10c77ef4899015d3a06bb307"],["/images/trees.jpg","f532b8c618b90a0483fe07be66e6b1b9"],["/index.html","0db64f7a9151a1fc50ecc46112a67812"],["/js/inboxDB.js","010afdedaea8c15ebd2a8b786ddfc74a"],["/js/jquery.gritter.min.js","318e1599ae73b18d1d9a778f03a61922"],["/js/jquery.slimscroll.min.js","f1dbc7920f93bd2b1dcfede95b473e4e"],["/js/socketcluster.js","829ea6ceb467fc74c6cd6dfb42bfd9f1"],["/js/socketcluster.min.js","b2ad16f5a8a133af0a65bc93ec051b6f"],["/js/webflow.js","53b042bc9c8b35e5a47c33f28e60ecfb"],["/logo.ico","8e3b772d10c77ef4899015d3a06bb307"],["/manifest.json","97a4ce8567a8058e59b75e01116eb24e"],["/static/css/main.c17080f1.css","302476b8b379a677f648aa1e48918ebd"],["/static/js/main.c7ca8a85.js","9decb1c06af193507f9459a8f446b96f"]];
var cacheName = 'sw-precache--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^homescreen/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "You have received a new message",
    icon: "https://uploads-ssl.webflow.com/5967b41cb774a27ff6684ea6/59712aa25b29c06cb9482ba0_logo-redesigned.png"
  });
});
self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(event.notification.tag);
  }));
});