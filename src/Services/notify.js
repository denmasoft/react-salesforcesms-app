import Gritter from '../gritter';
var notify = (function() {//
    'use strict';
    function shout(title,message,type){
        Gritter.add({
            title: title,
            text: message,
            class_name: 'gritter-center gritter-item-wrapper gritter-'+type,
            time: '3000'
        });
    }
    return {
        'shout': shout
      };
})();
export default notify;//