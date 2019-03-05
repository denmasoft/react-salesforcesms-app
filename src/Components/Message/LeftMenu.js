import React, { Component } from 'react';

class LeftMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:''
        };
    }
    render() {
        return (<div className="left-menu">
        <div className="left-menu-block">
          <div className="left-menu-item current w-clearfix">
            <div className="left-menu-item-icon inbox"></div>
            <div className="left-menu-item-name">Inbox</div>
          </div>
          <div className="left-menu-item w-clearfix">
            <div className="left-menu-item-icon"></div>
            <div className="left-menu-item-name">Sent</div>
          </div>
        </div>
      </div>);
    }
}

export default LeftMenu;