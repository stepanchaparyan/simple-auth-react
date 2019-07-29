import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';
import Navbar from './components/layout/navbar';
import Dashboard from './components/dashboard/dashboard';
import SignIn from './components/auth/signIn';
import SignUp from './components/auth/signUp';
import ForgotPassword from './components/auth/forgotPassword';
import firebase from './config/fbConfig';

var createBrowserHistory = require('history').createBrowserHistory;
const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }


  render() {
    return ( 
      <>
      {!this.state.user ? 
      ( 
          <Router history={history}>
            <>
            <Navbar />
            <Route                 
                path='/'
                render={() => 
                <Dashboard />}
            />
            <Route
                path='/signIn'
                render={() => 
                <SignIn />}
            />
            <Route
                path='/forgotPassword'
                render={() => 
                <ForgotPassword />}
            />
            <Route
                path='/signUp'
                render={() => 
                <SignUp />}
            />
            </>      
          </Router>
        
      ) : 
      (
          <Router history={history}>
            <div className="App">
              <Navbar user={this.state.user} />
              <Switch>  
                  <Route 
                      path='/dashboard'
                      render={() => 
                      <Dashboard user={this.state.user} />}
                  />
                  <Route
                      path='*'
                      render={() => 
                      <Dashboard user={this.state.user}/>}
                  />
              </Switch>
            </div>
          </Router>
      
      )}
     </>  
    );
   
  }
}

export default App;
