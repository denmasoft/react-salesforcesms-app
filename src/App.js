import React, { Component } from 'react';
import './App.css';
import Routes from './routes';
class App extends Component {
    constructor(){
        super();
        this.state={
            appName: "SalesForce SMS App",
            home: false
        }
    }
    render() {
        return (
            <div>
                <Routes name={this.state.appName}/>
            </div>
        );
    }
}

export default App;