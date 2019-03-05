import idb from 'idb';
import remove from 'lodash/remove';
import moment from 'moment';
var outboxDB = (function() {
    'use strict';
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }
    function initDb(){
        idb.open('Outbox', 3, function(upgradeDb) {
          if (!upgradeDb.objectStoreNames.contains('messages')) {
            let store = upgradeDb.createObjectStore('messages', {keyPath: 'lead'});
            store.createIndex('slug', 'slug');
            store.createIndex('lead', 'lead');
          }
          switch (upgradeDb.oldVersion) {
            case 1:
              let messagesv7 = upgradeDb.transaction.objectStore('messages');
              messagesv7.clear();
            case 2:
              let messagesv2 = upgradeDb.transaction.objectStore('messages');
              messagesv2.clear();
          }
      });
    }
    function _getMessages(){
      return new Promise( function (resolve) {
        idb.open('Outbox').then( function (idbCx) {
          var tx = idbCx.transaction('messages', "readonly");
          var store = tx.objectStore('messages');
          return store.getAll();
        }).catch( function (err) {
          console.log( err);
        }).then( resolve);
      });
      /*let db = await dbPromise;
      var tx = db.transaction('leads', 'readonly');
      var store = tx.objectStore('leads');
      let leads = await store.getAll();
      return leads;*/
  }
  async function getMessages(){
    let messages = await _getMessages();
    return messages;
  }
  async function getMessagesByDate(timestamp){
    let date = moment().format('YYYY-MM-DD');
    if(timestamp.toLowerCase()==='yesterday'){
      date = moment().subtract(1,'day').format('YYYY-MM-DD');
    }
    let messages = await _getMessages();
    let _messages = remove(messages, function(m) {
      if(timestamp.toLowerCase()==='more_than_7_days'){
        let mdate = moment(m.date);
        let yesterday = moment().subtract(1, 'day');
        return  yesterday.diff(mdate,'days')>=7;
      }
      return m.date == date;
    });
  return _messages;
  }
  function _saveMessages(leads){
    return new Promise( function (resolve) {
      idb.open('Outbox').then( function (idbCx) {
        var tx = idbCx.transaction('messages', "readwrite");
        var store = tx.objectStore('messages');
        leads.forEach(lead => {
          store.put(lead);
        });
      }).catch( function (err) {
        console.log( err);
      }).then( resolve);
    });
  }
  async function saveMessages(leads){
    await _saveMessages(leads);
  }
    function clearData(){
       return new Promise( function (resolve) {
        idb.open('Outbox').then( function (idbCx) {
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
    initDb: (initDb),
    getMessages: (getMessages),
    saveMessages: (saveMessages),
    getMessagesByDate: (getMessagesByDate)
  };
})();
export default outboxDB;