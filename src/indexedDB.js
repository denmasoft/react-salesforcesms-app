import idb from 'idb';
import _ from 'lodash';
import PushNotificationService from './PushNotificationService';
import apiService from './Services/apiService';
import { CookieStorage } from 'cookie-storage';
var indexedDB = (function() {
    'use strict';
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }
    var dbPromise = idb.open('SalesforceSMS', 18, function(upgradeDb) {
        switch (upgradeDb.oldVersion) {
          case 0:
            // (oldVersion is 0)
          case 1:
            upgradeDb.createObjectStore('user', {keyPath: 'provider_id'});
          case 2:
            let userStore = upgradeDb.transaction.objectStore('user');
              userStore.createIndex('provider_id', 'provider_id', {unique: true});
          case 3:
            let userstore = upgradeDb.transaction.objectStore('user');
             userstore.createIndex('email', 'email');
             userstore.createIndex('name', 'name');
             userstore.createIndex('salesforce_id', 'salesforce_id');
          case 4:
            let _leads = upgradeDb.createObjectStore('leads', {keyPath: 'lead'});
            _leads.createIndex('slug', 'slug');
            _leads.createIndex('lead', 'lead');
          case 5:
            let _conversation = upgradeDb.createObjectStore('conversation', {keyPath: 'sms_id'});
            _conversation.createIndex('sms_id', 'sms_id');
          case 6:
            let leadStore = upgradeDb.transaction.objectStore('leads');
            leadStore.clear();
          case 7:
            let createdDate = upgradeDb.transaction.objectStore('leads');
            createdDate.createIndex('createdDate', 'createdDate');
          case 8:
            let phone = upgradeDb.transaction.objectStore('leads');
            phone.createIndex('phone', 'phone');
          case 9:
            let smsstore = upgradeDb.transaction.objectStore('leads');
            smsstore.createIndex('sms', 'sms');
          case 10:
            let store = upgradeDb.transaction.objectStore('leads');
            store.clear();
          case 11:
            let _conversationStore = upgradeDb.transaction.objectStore('conversation');
            _conversationStore.clear();
          case 12:
            let leadsStore = upgradeDb.transaction.objectStore('leads');
            leadsStore.clear();
            let conversationStore = upgradeDb.transaction.objectStore('conversation');
            conversationStore.clear();
            const cookieStorage = new CookieStorage();
            cookieStorage.removeItem('SFSID');
          case 13:
            let conversationv13 = upgradeDb.transaction.objectStore('conversation');
            conversationv13.clear();
            const cookieStoragev13 = new CookieStorage();
            cookieStoragev13.removeItem('SFSID');
          case 14:
            let conversationv14 = upgradeDb.transaction.objectStore('conversation');
            conversationv14.clear();
            const cookieStoragev14 = new CookieStorage();
            cookieStoragev14.removeItem('SFSID');
          case 15:
            let conversationv15 = upgradeDb.transaction.objectStore('conversation');
            conversationv15.clear();
            const cookieStoragev15 = new CookieStorage();
            cookieStoragev15.removeItem('SFSID');
          case 16:
            let conversationv16 = upgradeDb.transaction.objectStore('conversation');
            conversationv16.clear();
            const cookieStoragev16 = new CookieStorage();
            cookieStoragev16.removeItem('SFSID');
          case 17:
            let conversationv17 = upgradeDb.transaction.objectStore('conversation');
            conversationv17.clear();
            const cookieStoragev17 = new CookieStorage();
            cookieStoragev17.removeItem('SFSID');
        }
      });
    async function _addUser(user){
        let db = await dbPromise;
        var tx = db.transaction('user', 'readwrite');
        var store = tx.objectStore('user');
        let _user = await store.add(user);
        return _user;
    }
    async function _addLead(lead){
        let db = await dbPromise;
        var tx = db.transaction('leads', 'readwrite');
        var store = tx.objectStore('leads');
        await store.add(lead);
    }
    async function _addConversation(message){
        let db = await dbPromise;
        var tx = db.transaction('conversation', 'readwrite');
        var store = tx.objectStore('conversation');
        await store.add(message);
    }
    async function _getLeads(){
        let db = await dbPromise;
        var tx = db.transaction('leads', 'readonly');
        var store = tx.objectStore('leads');
        let leads = await store.getAll();
        return leads;
    }
    async function getLeads(){
        let leads = await _getLeads();
        if(leads.length==0){
            leads = await apiService.getLeads(0);
            leads = leads.data;
            for(let l=0;l<leads.length;l++){
                if(leads[l].lead!=null){
                    await _addLead(leads[l]);
                }
            }
        }
        return leads;
    }
    async function addUser(res){
        let _user = {
            name: res.w3.ig,
            provider: 'Google',
            email: res.w3.U3,
            provider_id: res.El,
            token: res.Zi.access_token,
            provider_pic: res.w3.Paa
        };
        let user = await _addUser(_user);
        PushNotificationService();
        return user;
    }
    async function getByEmail(key) {
        let db = await dbPromise;
        var tx = db.transaction('user', 'readonly');
        var store = tx.objectStore('user');
        var index = store.index('email');
        let user = await index.get(key);
        return user;
    }
    async function getBySalesforceId(key) {
        let db = await dbPromise;
        var tx = db.transaction('user', 'readonly');
        var store = tx.objectStore('user');
        var index = store.index('salesforce_id');
        let user = await index.get(key);
        return user;
    }
    function getLeadBySlug(db,key){
        return new Promise( function (resolve) {
          idb.open(db).then( function (idbCx) {
            let tx = idbCx.transaction('messages', "readonly");
            let store = tx.objectStore('messages');
            let index = store.index('slug');
            let lead = index.get(key);
            return lead;
          }).catch( function (err) {
            console.log( err);
          }).then( resolve);
        });
    }
    /*async function getLeadBySlug(key) {
        let db = await dbPromise;
        var tx = db.transaction('leads', 'readonly');
        var store = tx.objectStore('leads');
        var index = store.index('slug');
        let lead = await index.get(key);
        return lead;
    }*/
    async function _getUser(){
        let db = await dbPromise;
        var tx = db.transaction('user', 'readonly');
        var store = tx.objectStore('user');
        let users = await store.getAll();
        return users[0];
    }
    async function _getConversation(lead){
        let db = await dbPromise;
        var tx = db.transaction('conversation', 'readonly');
        var store = tx.objectStore('conversation');
        let conversation = await store.getAll();
        conversation = _.filter(conversation, function(c) { return c.id==lead; });
        return conversation;
    }
    async function getUser() {
        return await _getUser();
    }
    async function getMessages(db, slug){
        let _db = db.charAt(0).toUpperCase() + db.slice(1);
        let lead = await getLeadBySlug(_db, slug);
        let conversation = await _getConversation(lead.lead);
        if(conversation.length==0){
            conversation = await apiService.getConversation(lead.lead);
            conversation = conversation.data;
            for(let c=0;c<conversation.length;c++){
                await _addConversation(conversation[c]);
            }
        }
        return conversation;
    }
    function clearData(){
       return new Promise( function (resolve) {
        idb.open('SalesforceSMS').then( function (idbCx) {
          var tx = idbCx.transaction( idbCx.objectStoreNames, "readwrite");
          return Promise.all( Array.from( idbCx.objectStoreNames,
              osName => {return tx.objectStore( osName).clear();}))
              .then( function () {return tx.complete;});
        }).catch( function (err) {
          console.log( err);
        }).then( resolve);
      });
    }
  return {
    dbPromise: (dbPromise),
    addUser: (addUser),
    getUser: (getUser),
    getLeads: (getLeads),
    getMessages: (getMessages),
    clearData: (clearData),
    getBySalesforceId: (getBySalesforceId)
  };
})();
export default indexedDB;