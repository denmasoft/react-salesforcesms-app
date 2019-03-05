import React, { Component } from 'react';
import indexedDB from '../../indexedDB';
import history from '../../history';
import $ from 'jquery';
import { CookieStorage } from 'cookie-storage';
const cookieStorage = new CookieStorage();
class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:''
        };
        this.goToUrl = this.goToUrl.bind(this);
        this.logout = this.logout.bind(this);
    }
    logout(){
        const cookieStorage = new CookieStorage();
        cookieStorage.removeItem('SFSID');
        history.push('/login');
        $('body').removeClass('body-2').addClass('body');
       /*indexedDB.clearData().then(function(){
           
        });*/
    }
    goToUrl(url) {
        history.push(url);
      }
    render() {
        return (<div className="nav-bar">
            <div className="nav-block w-clearfix">
                <a href="#" className="profile-button nav-bar-button w-inline-block">
                    <div className="profile-block">
                        <div className="profile-letter">R</div>
                    </div>
                </a>
                <a href="#" className="notification-button w-inline-block">
                    <div className="notifications-block">
                        <div className="text-block">8</div>
                    </div>
                </a><img src="images/logo-32x32.png" className="logo"/>
                <div className="app-tittle">Sent</div>
                <div data-collapse="medium" data-animation="over-right" data-duration="400" className="navbar w-nav">
                    <div className="w-container">
                        <a href="#" className="brand w-nav-brand"><img src="images/logo-256x256.png" width="45"/></a>
                        <nav role="navigation" className="nav-menu w-nav-menu">
                            <div className="div-block">
                                <a href="#" className="link-block-2 w-hidden-main w-hidden-medium w-hidden-small w-inline-block">
                                    <div className="text-block-3"></div>
                                </a>
                                <div className="text-block-2 w-hidden-main w-hidden-medium w-hidden-small">Salesforce
                                    SMS
                                </div>
                            </div>
                            <a href="#" onClick={()=>this.goToUrl('/inbox')} className="nav-link w-nav-link">Inbox</a>
                            <a href="#" onClick={()=>this.goToUrl('/sent')} className="nav-link w-nav-link w--current">Sent</a>
                            <a href="#" onClick={()=>this.logout()} className="nav-link w-nav-link">Logout</a>
                            </nav>
                        <div className="app-name">SMS Salesforce</div>
                        <div className="menu-button w-nav-button">
                            <div className="w-icon-nav-menu"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NavBar;