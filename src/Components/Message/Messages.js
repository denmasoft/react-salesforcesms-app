import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import NavBar from './NavBar';
import LeftMenu from './LeftMenu';
import MessageItems from './MessageItems';
import indexedDB from '../../indexedDB';
import notify from '../../Services/notify';
import $ from 'jquery';
import history from '../../history';
import { CookieStorage } from 'cookie-storage';
const cookieStorage = new CookieStorage();
class Messages extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:'',
            redirect: false,
            items: []
        };
    }
    async componentWillMount() {
        if(!cookieStorage.getItem('SFSID')){
            history.push('/login');
            return;
        }
        else{
            $('#sloader').show();
            try {
                let conversation = await indexedDB.getMessages(this.props.match.params.type ,this.props.match.params.slug);
                this.setState({ items: conversation });
            } catch (error) {
                $('#sloader').hide();
                notify.shout('Error',error.message, 'error');
                return;
            }
            //$('body').removeClass('body').addClass('body-2');
            $('.notification-button').show();
            $('.logo').show();
            $('.left-menu').hide();
            $('.app-name').hide();
            $('#sloader').hide();
        }
        /*$('#sloader').show();
        let user = await indexedDB.getUser();
        if(typeof user=='undefined' || user==null){
            this.setState({redirect: true});
            $('#sloader').hide();
            notify.shout('Error','Please, provide a valid @arntreatment.com or @niznikhealth.com account.','error');
            return;
        }else{
            let conversation = await indexedDB.getMessages(this.props.match.params.slug);
            this.setState({ items: conversation });
            $('#sloader').hide();
        }*/
    }
    render() {
        if(this.state.redirect==true){
            history.push('/login');
        }
        $('.left-menu').hide();
        return (<div>
                <NavBar/>
                <LeftMenu/>
                <div  className="message-section">
                    <div className="w-container">
                        <div className="messages user-details">
                            <MessageItems items={this.state.items}/>
                        </div>
                    </div>
                    <div className="section">
                        <div className="w-container">
                            <div className="new-msg-block">
                                <div className="w-form">
                                    <input type="text" className="message-textbox w-input" maxlength="256" name="message" data-name="message" placeholder="Enter a new message" id="message" required="" />
                                    <input type="submit" value="" className="submit-button w-button" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>);
    }
}

export default Messages;