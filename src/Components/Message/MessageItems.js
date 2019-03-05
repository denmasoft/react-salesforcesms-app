import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Message from './Message';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
class MessageItems extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:'',
            redirect: false
        };
    }

    render() {
        let items;
        if(this.props.items){
            items = this.props.items.map(item => {
                return (
                    <Message message={item} />
                );
            });
        }
        return (<Scrollbars style={{ height: "700px" }}><div className="messages" style={{height:"auto"}}>
            {items}
        </div></Scrollbars>);
    }
}
MessageItems.propTypes = {
    items: PropTypes.array
}
export default MessageItems;