import React from 'react';
import {Router} from 'react-router';
import {Route,  Switch} from 'react-router-dom';
import Login from './Components/Login';
import Inbox from './Components/Inbox/Inbox';
import Outbox from './Components/Outbox/Outbox';
import Messages from "./Components/Message/Messages";
import history from './history';
const Routes = () => (
    <Router history={history} >
        <Switch>
            <Route exact path="/inbox" component={Inbox}/>
            <Route exact path="/" component={Inbox}/>
            <Route exact path="/sent" component={Outbox}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/:type/messages/:slug" component={Messages}/>
        </Switch>
    </Router>
);

export default Routes;