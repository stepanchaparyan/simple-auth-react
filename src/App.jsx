import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Dashboard from './components/dashboard/dashboard';
import SignIn from './components/auth/signIn';
import SignUp from './components/auth/signUp';
import ForgotPassword from './components/auth/forgotPassword';
import firebase from './config/fbConfig';
import Spinner from './components/myComponents/Spinner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      phoneNumber: '',
      loading: false
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
        this.setState({ loading:true });
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }

      // { user &&
      //   this.getExtraInfoFromFirebaseStorage(user);
      // }
    });
  }

  getExtraInfoFromFirebaseStorage = (user) => {
    const uid = user.uid;
    firebase.firestore().collection('users').doc(uid).get()
    .then((doc) => {
      doc.data();
      this.setState({
          phoneNumber: doc.data().phoneNumber
      });
    });
  }

  render() {
    const loading = this.state.loading;

    return (
      <BrowserRouter>
      {loading ?
        <div className="App">
          <Navbar user={this.state.user}/>
          <Switch>
            <Route exact path='/' render={() => <Dashboard user={this.state.user}/>} />
            <Route path='/signin' render={() => <SignIn user={this.state.user}/>} />
            <Route path='/signup' render={() => <SignUp user={this.state.user}/>} />
            <Route path='/forgotPassword' component={ForgotPassword} />
          </Switch>
        </div>
        : <Spinner />
      }
      </BrowserRouter>
    );
  }
}

export default App;
