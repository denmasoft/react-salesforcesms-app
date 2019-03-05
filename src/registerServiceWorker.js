// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.
import inboxDB from './inboxDB';
import outboxDB from './outboxDB';
let swReg = null;
var crypto = require('crypto');
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);


export function getswReg() {
    return swReg;
}


export default function register() {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }
        window.addEventListener('load', () => {
            const swUrl = 'service-worker.js';
            if (isLocalhost) {
                checkValidServiceWorker(swUrl);
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                        'worker. To learn more, visit https://goo.gl/SC7cgQ'
                    );
                });
            } else {
                registerValidSW(swUrl);
            }
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
        });
    }
}
function updateOnlineStatus(event) {
    if (navigator.onLine) {
      // handle online status
      console.log('online');
    } else {
      // handle offline status
      console.log('offline');
    }
  }
function registerValidSW(swUrl) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.update();
            inboxDB.initDb();
            outboxDB.initDb();
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            registration.showNotification('NBHSYSTEMS', {
                                body: "New content is available, please refresh.",
                                icon: "https://uploads-ssl.webflow.com/5967b41cb774a27ff6684ea6/59712aa25b29c06cb9482ba0_logo-redesigned.png"
                              });
                        } else {
                            registration.showNotification('NBHSYSTEMS', {
                                body: "Content is cached for offline use.",
                                icon: "https://uploads-ssl.webflow.com/5967b41cb774a27ff6684ea6/59712aa25b29c06cb9482ba0_logo-redesigned.png"
                              });
                        }
                    }
                    else{
                        console.log(installingWorker.state);
                    }
                };
            };
        })
        .catch(error => {
            console.error('Error during service worker registration:', error);
        });
}

function checkValidServiceWorker(swUrl) {
    fetch(swUrl)
        .then(response => {
            if (
                response.status === 404 ||
                response.headers.get('content-type').indexOf('javascript') === -1
            ) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                registerValidSW(swUrl);
            }
        })
        .catch(() => {
            console.log(
                'No internet connection found. App is running in offline mode.'
            );
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}