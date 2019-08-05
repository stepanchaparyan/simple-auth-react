import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Dashboard from './components/dashboard/dashboard';
import SignIn from './components/auth/signIn';
import SignUp from './components/auth/signUp';
import ForgotPassword from './components/auth/forgotPassword';
import firebase from './config/fbConfig';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
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
      <BrowserRouter>
        <div className="App">
          <Navbar user={this.state.user}/>
          <Switch>
            <Route exact path='/' render={() => <Dashboard user={this.state.user}/>} />
            <Route path='/signin' render={() => <SignIn user={this.state.user}/>} />
            <Route path='/signup' render={() => <SignUp user={this.state.user}/>} />
            <Route path='/forgotPassword' component={ForgotPassword} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
