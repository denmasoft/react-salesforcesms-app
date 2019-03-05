import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Customer from './Customer';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
class Customers extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:'',
            redirect: false
        };
    }
    componentDidMount(){
      }
    render() {
        let clients = null;
        if(this.props.customers.length>0){
            clients = this.props.customers.map(customer => {
                return (
                    <Customer id={this.props.id} type={this.props.type} key={customer.name} customer={customer} />
                );
            });
        }
        else{
            return (
                <div className="messages" style={{height:"auto"}}>
                    <div className="no-customers">No messages found.</div>
                </div>);
        }
        return (
            <Scrollbars style={{ height: "350px" }}>
                <div className="messages" style={{height:"auto"}}>
                    {clients}
                </div>
        </Scrollbars>);
    }
}
Customers.propTypes = {
    customers: PropTypes.array,
    id: PropTypes.string,
    type: PropTypes.string
}
export default Customers;