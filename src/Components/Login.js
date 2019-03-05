import $ from 'jquery';
import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Redirect } from 'react-router-dom';
import indexedDB from '../indexedDB';
import notify from '../Services/notify';
import history from '../history';
import apiService from '../Services/apiService';
import { CookieStorage } from 'cookie-storage';
import {SocketService} from "../Services/socketService";
const cookieStorage = new CookieStorage();
const socketService = new SocketService();
class Login extends Component {
    constructor(props) {
        super(props);
        this.signup = this.signup.bind(this);
        this.state = {loading: true};
    }
    /*async _signup(response){
        let res = await indexedDB.addUser(response);
        return res;
    }*/
    async signup(response){
        //let res = await this._signup(response);
        //return res;
    }
    componentDidMount(){
    }
    render() {
        let html;
        const responseGoogle = (response) => {
                $('#sloader').show();
                apiService.authenticate('eric@niznikhealth.com').then(res=>{
                    $('#sloader').hide();
                    if(res.data.token!=null){
                        cookieStorage.setItem('SFSID', res.data.token);
                        //socketService.subscribe(res.data.id);
                        socketService.subscribe('005j000000Avn69AAB');
                        history.push('/inbox');
                    }
                    else{
                        notify.shout('Error', res.data.message, 'error');
                        return
                    }
                });
            }
            return ( <div className = "login-section">
                <div className = "w-container">
                <div className = "login-block">
                <div className = "logo-block"> <img src = "/images/logo-256x256.png" className = "image"/> </div>
                <div className = "welcome-message"> Welcome to SMS Salesforce! </div>
                <div className = "description-text"> Important!You only will be able to log in with a Google account of <strong> @arntreatment.com </strong> or <strong>@niznikhealth.com</strong> </div>
                <div className = "button-block">
                <GoogleLogin className = "link-block w-inline-block w-clearfix"
                clientId = "22137223202-tc6lutpp8fq32u8fc25mnfia8pkahkup.apps.googleusercontent.com"
                buttonText = "Sign in with Google"
                onSuccess = { responseGoogle }
                onFailure = { responseGoogle }>
                <div className = "google-logo">  </div>
                <div className = "google-login-text" > Sign in with Google </div>
                </GoogleLogin>
                </div> <div className="error-message">Your don&#x27;t have access to this application.</div></div> </div> </div>
            );
        }
    }

    export default Login;