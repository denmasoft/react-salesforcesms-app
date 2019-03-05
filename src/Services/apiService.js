import axios from 'axios';
import { CookieStorage } from 'cookie-storage';
const cookieStorage = new CookieStorage();
var apiService = (function() {
    'use strict';
    let apiUrl = 'https://salesforce-api.nbhsystems.com/sms/v1/';
    async function _getLeads(type, id){
        return await axios.get(apiUrl+'messages/'+type+'/'+id,{
            headers: { Authorization: cookieStorage.getItem('SFSID') }
        });
    }
    async function _getMessages(type, id, _moment){
        try {
             let result = await axios.get(apiUrl+'messages/'+type+'/'+id+'/'+_moment,{
                headers: { Authorization: cookieStorage.getItem('SFSID') }
            });
            return result.data;
        } catch (error) {
            throw error;
        }
    }
    async function getConversation(id){
        try {
            return await axios.get(apiUrl+'conversation/'+id,{
                headers: { Authorization: cookieStorage.getItem('SFSID') }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async function authenticate(email){
        return await axios.post(apiUrl+'oauth/authenticate',{email: email});
    }
    return {
        'getLeads': _getLeads,
        'getMessages': _getMessages,
        'authenticate': authenticate,
        'getConversation': getConversation//
      };
})();
export default apiService;