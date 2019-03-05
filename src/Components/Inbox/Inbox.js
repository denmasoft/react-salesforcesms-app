import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import LeftMenu from './LeftMenu';
import Customers from '../Customer/Customers';
import inboxDB from '../../inboxDB';
import notify from '../../Services/notify';
import apiService from '../../Services/apiService';
import $ from 'jquery';
import history from '../../history';
import { CookieStorage } from 'cookie-storage';
import { Scrollbars } from 'react-custom-scrollbars';
import remove from 'lodash/remove';
import filter from 'lodash/filter';
import difference from 'lodash/difference';
import findIndex from 'lodash/findIndex';
import truncate from 'lodash/truncate';
const cookieStorage = new CookieStorage();
class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            redirect: false,
            customers: [],
            totalCostumers: 0,
            todayCustomers:[],
            yesterdayCustomers:[]
        };
    }
    getCustomers(leads, time) {
        let customers = remove(leads, function(l) {
            return l.date == time;
          });
        return customers;
    }
    async getMessages(leads, time) {
        let messages = filter(leads, function(o) { return o.day==time; });
        if(!messages.length){
            let _moment = time=='MORE_THAN_7_DAYS'?'LAST_N_DAYS:7':time.toUpperCase();
            messages = await apiService.getMessages('inbox', 0, _moment);
            await inboxDB.saveMessages(messages);
        }
        let customers = this.getCustomers(messages, time);
        return customers;
    }
    async getMessagesByDate(timestamp){
        let messages = [];
        messages = await inboxDB.getMessagesByDate(timestamp);
            if(!messages.length){
                messages = await apiService.getMessages('inbox',0, timestamp.toUpperCase());
                await inboxDB.saveMessages(messages);
        }
        return messages;
    }
    async tick(){
        let todays = await inboxDB.getMessagesByDate('today');
        let todayFound = await apiService.getMessages('inbox',0,'TODAY');
        let found = todayFound[0];
        let idx = findIndex(todays, function(o) { return o.text==found.text; });
        if(idx==-1){
            await inboxDB.saveMessages(found);
            let todays = await inboxDB.getMessagesByDate('today');
            this.setState({todayCustomers: todays});
            navigator.serviceWorker.getRegistration().then(function(reg) {
                reg.showNotification('New Message from '+found.name, {
                body: truncate(found.text),
                icon: "https://uploads-ssl.webflow.com/5967b41cb774a27ff6684ea6/59712aa25b29c06cb9482ba0_logo-redesigned.png",
                tag: '/inbox/messages/'+found.slug,
                actions: [{ action: 'explore', title: 'Read', icon: '#' }],
                });
            });
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    async componentDidMount(){
        try {
            this.interval = setInterval(() => this.tick(), 60000);
            let messagesFromYesterday = await this.getMessagesByDate('yesterday');
            this.setState({ yesterdayCustomers: messagesFromYesterday });
            let old_messages = await this.getMessagesByDate('MORE_THAN_7_DAYS');
            this.setState({ customers: old_messages });
        } catch (error) {
        }
    }
    async componentWillMount() {
        if(!cookieStorage.getItem('SFSID')){
            history.push('/login');
            return;
        }
        else{
            $('#sloader').show();
            $('body').removeClass('body').addClass('body-2');
            $('.notification-button').hide();
            $('.logo').hide();
            $('.left-menu').hide();
            $('.app-name').show();
            try {
                let todays = [];
                todays = await inboxDB.getMessagesByDate('today');
                if(!todays.length){
                    todays = await apiService.getMessages('inbox',0,'TODAY');
                    await inboxDB.saveMessages(todays);
                }
                this.setState({todayCustomers: todays});
                this.setState({totalCostumers: todays.length});
                $('#sloader').hide();
            } catch (error) {
                $('#sloader').hide();
                notify.shout('Error',error.message, 'error');
            }
        }
    }
    render() {
            if(this.state.redirect==true){
                $('body').removeClass('body-2').addClass('body');
                history.push('/login');
            }
            if(this.state.totalCostumers==0){
                return (<div>
                    <NavBar/>
                    <LeftMenu/>
                    <div  className="message-section">
                        <div className="w-container">
                            <div className="no-messages">No messages found.</div>
                        </div>
                    </div>
                </div>);    
            }
            return (<div>
                <NavBar/>
                <LeftMenu/>
                <div  className="message-section">
                <Scrollbars style={{ height: "650px" }}>
                    <div className="w-container" style={{height:"auto"}}>
                        <div className="msg-section-block">
                            <div className="filter-section">
                                <a href="#" className="date-filter w-inline-block">
                                    <div>Today</div>
                                </a>
                            </div>
                        </div>
                        { !this.state.todayCustomers && <div className="no-customers" >Loading Messages.</div>}
                        <Customers customers={this.state.todayCustomers} type='inbox' id='today' />
                        <div className="msg-section-block">
                            <div className="filter-section">
                                <a href="#" className="date-filter w-inline-block">
                                    <div>Yesterday</div>
                                </a>
                            </div>
                        </div>
                        { !this.state.yesterdayCustomers && <div className="no-customers" >Loading Messages.</div>}
                        <Customers customers={this.state.yesterdayCustomers} type='inbox' id='yesterday'/>
                        <div className="msg-section-block">
                            <div className="filter-section">
                                <a href="#" className="date-filter w-inline-block">
                                    <div>More than 7 days</div>
                                </a>
                            </div>
                        </div>
                        { !this.state.customers && <div className="no-customers" >Loading Messages.</div>}
                        <Customers customers={this.state.customers} type='inbox' id='more_than_7_days'/>                    
                    </div>
                </Scrollbars>
                </div>
            </div>);
        }
    }

    export default Inbox;