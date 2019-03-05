let isSubscribed = false;
const applicationServerPublicKey = 'BEEz03y1bAgtg6n4Uv1saslNzZr84X2IPxWdRgjE5HFJ7N3Bh06K4TD5a7BvGkK3p6gjgOlEnJfAnZYh0i12ers';
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function subscribeUser(swRegistration) {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function(subscription) {
            console.log('User is subscribed');
            isSubscribed = true;
            console.log(JSON.stringify(subscription));
            fetch("https://salesforce-api.nbhsystems.com/subscribe", {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "content-type": "application/json"
                }
            }).then(function(o) {
                console.log("Push Sent...");
            });
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
        });
}

function _reg(registration){
    registration.pushManager.getSubscription()
        .then(subscription => {
            isSubscribed = !(subscription === null);
            if (isSubscribed) {
                console.log('User is subscribed.');
            } else {
                console.log('User is not subscribed.');
            }
        }).catch(error => {
        console.error('Error during subscribing:', error);
    });
}


export default function initializeUI() {
    if (Notification.permission !== "granted"){
        Notification.requestPermission(function(status) {
            if (Notification.permission == 'granted') {
                navigator.serviceWorker.getRegistration().then(function(reg) {
                    reg.showNotification('NBHSYSTEMS', {
                        body: "You'll be notified as soon as any message arrives",
                        icon: "https://uploads-ssl.webflow.com/5967b41cb774a27ff6684ea6/59712aa25b29c06cb9482ba0_logo-redesigned.png"
                    });
                    subscribeUser(reg);
                    _reg(reg);
                });
            }
        });
    }
}