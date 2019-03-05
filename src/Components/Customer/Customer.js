import React, { Component } from 'react';
import PropTypes from 'prop-types';
import history from '../../history';
import truncate from 'lodash/truncate';
import inboxDB from '../../inboxDB';
import $ from 'jquery';
class Customer extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:'',
            style: ''
        };
        this.goToUrl = this.goToUrl.bind(this);
    }
    async goToUrl(url) {
        this.props.customer.read=true;
        await inboxDB.isRead(this.props.customer,this.props.customer.lead);
        history.push(url);
      }
    componentWillMount(){}
    render() {
        let text_truncated = truncate(this.props.customer.text);
        let cid = 'c_'+this.props.id;
        let cclass = 'total-new-msg '+this.props.id;
        let new_text = '+ new';
        let css_style = {
            backgroundImage: 'linear-gradient(180deg, '+this.props.customer.color+', '+this.props.customer.color+')',
          };
          let read_style={};
          if(this.props.customer.read==true){
              read_style={fontWeight: '300'};
              new_text = '';
              cclass = this.props.id;
          }
        return (<div className="message-item">
            <a className="message-block w-inline-block w-clearfix" href="#" onClick={()=>this.goToUrl('/'+this.props.type+'/messages/'+this.props.customer.slug)}>
                <div className="first-letter-text" style={css_style}>{this.props.customer.letter}</div>
                <div className="name-block w-clearfix">
                    <div className="message-sender-name" style={read_style}>{this.props.customer.name}</div>
                    <div className="total-messsages">({this.props.customer.total}+)</div>
                </div>
                <div id={cid} className={cclass}>{new_text}</div>
                <div className="message-excerpt new-message" style={read_style}>{text_truncated}</div>
            </a>
        </div>);
    }
}
Customer.propTypes = {
    customer: PropTypes.object,
    type: PropTypes.string
}

export default Customer;