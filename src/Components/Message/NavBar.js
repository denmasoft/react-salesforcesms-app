import React, { Component } from 'react';
import history from '../../history';
class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:''
        };
        this.goToUrl = this.goToUrl.bind(this);
    }
    goToUrl(url) {
      history.push(url);
    }
    render() {
        return (<div className="nav-bar">
        <div className="nav-block w-clearfix">
          <a href="#" onClick={()=>this.goToUrl('/inbox')} className="back-link w-inline-block">
            <div className="back-arrow"></div>
          </a>
          <a href="#" className="profile-button nav-bar-button w-inline-block">
            <div className="profile-block">
              <div className="profile-letter">R</div>
            </div>
          </a>
          <a href="#" className="notification-button w-inline-block">
            <div className="notifications-block">
              <div className="text-block">8</div>
            </div>
          </a><img src="/images/logo-32x32.png" class="logo" />
          <div className="app-tittle">Alex Grimm</div>
          <div className="app-name">SMS Salesforce</div>
        </div>
      </div>);
    }
}

export default NavBar;