import socketCluster from 'socketcluster-client';
import truncate from "lodash/truncate";
import inboxDB from '../inboxDB';
export class  SocketService{

    constructor(){
        var options = {
            port: 443,
            hostname: 'salesforce-api.nbhsystems.com',
            secure: true
        };
        this.socket = socketCluster.create(options);
        this.isConnected();

    }
    isConnected(){
        this.socket.on('connect', function () {
            console.log('CONNECTED!!');
        });
    }
    subscribe(channel){
        let subscribeChannel = this.socket.subscribe(channel);
        console.log(channel);
        subscribeChannel.watch(async function (data) {
            console.log(data);
            await inboxDB.saveMessages([data]);
            navigator.serviceWorker.getRegistration().then(function(reg) {
                reg.showNotification('New Message from '+data.name, {
                    body: truncate(data.text),
                    icon: "https://uploads-ssl.webflow.com/5967b41cb774a27ff6684ea6/59712aa25b29c06cb9482ba0_logo-redesigned.png",
                    tag: '/inbox/messages/'+data.slug,
                    actions: [{ action: 'explore', title: 'Read', icon: '#' }],
                });
            });
        });
    }
}
