import React, { Component } from 'react';
import PropTypes from 'prop-types';
class Message extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:''
        };
    }
    render() {
        let css_style = {
            backgroundImage: 'linear-gradient(180deg, '+this.props.message.color+', '+this.props.message.color+')',
        };
        return (<div className={this.props.message.is=='receiver'?'user-message-line w-clearfix':'sender-msg-row w-clearfix'}>
            <div className={this.props.message.is=='receiver'? 'sender-info user w-clearfix':'sender-info w-clearfix'}>
                <div className={this.props.message.is=='receiver'?'first-letter-text red-bg detail user-msg':'first-letter-text red-bg detail'} style={css_style}>{this.props.message.letter}</div>
                <div className="message-date">{this.props.message.timestamp}</div>
            </div>
            <div className={this.props.message.is=='receiver'?'sender-message user-msg-line':'sender-message'}>
                <div className={this.props.message.is=='receiver'?'text-message user-txt':'text-message'}>{this.props.message.sms}
                </div>
            </div>
        </div>);
    }
}

Message.propTypes = {
    message: PropTypes.object
}
export default Message;