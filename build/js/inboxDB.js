import idb from 'idb';
import _ from 'lodash';
var inboxDB = (function() {
    'use strict';
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }
    function initDb(){
        idb.open('Inbox', 1, function(upgradeDB) {
            var store = upgradeDB.createObjectStore('messages', {
              keyPath: 'lead'
            });
            store.createIndex('slug', 'slug');
            store.createIndex('lead', 'lead');
          });
    }
    function clearData(){
       return new Promise( function (resolve) {
        idb.open('Inbox').then( function (idbCx) {
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
    initDb: (initDb)
  };
})();
export default inboxDB;