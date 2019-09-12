import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { DebounceInput } from 'react-debounce-input';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { ValidationForm, TextInput, TextInputGroup } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Button, Image, Icon } from 'react-components';
import firebase from '../../config/fbConfig';
import M from '../../Messages';
import logo from '../../assets/logo2.png';
import '../../styles.scss';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    type: 'password',
    user: '',
    errorText: '',
    iconName: 'eye-slash'
  }

  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  }

  static propTypes = {
    user: PropTypes.object
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((user) => {
      this.setState({user: user});
    })
    .catch((error) => {
      this.setState({errorText: error.message});
    });
  }

  showhidepass = () => {
    this.state.type === 'password' ? this.setState({type: 'text'}) : this.setState({type: 'password'});
    this.state.iconName === 'eye-slash' ? this.setState({iconName: 'eye'}) : this.setState({iconName: 'eye-slash'});
  }

  render() {
    if (this.props.user) {return <Redirect to='/' />;}
    return (
      <DocumentTitle title='Simple Auth App - Sign In'>
        <div className="loginContainer">
        <div className="formSignIn">
            <div className="logo">
              <Image id='logo' src={logo} alt="Logo" height={20} width={210}/>
            </div>
            <div className="title">{M.get('logIn')}</div>
            <ValidationForm onSubmit={this.handleSubmit}>
              <div className="form-group">
                  <label className="lebel" htmlFor="email">{M.get('email')}</label>
                  <DebounceInput element={TextInput}
                      debounceTimeout={500}
                      name="email"
                      id="email"
                      type="email"
                      validator={validator.isEmail}
                      errorMessage={{ validator: 'Please enter a valid email' }}
                      value={this.state.email}
                      onChange={this.handleChange}
                  />
              </div>
              <div className="form-group">
                  <label className="lebel" htmlFor="password">{M.get('password')}</label>
                  <DebounceInput element={TextInputGroup}
                      debounceTimeout={500}
                      name="password"
                      id="password"
                      type={this.state.type}
                      required
                      pattern=".{6,}"
                      errorMessage={{
                          required: 'Password is required',
                          pattern: 'Password should be at least 6 characters long'
                      }}
                      value={this.state.password}
                      onChange={this.handleChange}
                      append={<div id="eye" onClick={this.showhidepass}><Icon name={this.state.iconName} className='eye' /> </div>}
                      autoComplete='true'
                  />
              </div>
              <div id="wrongUser">
                  { this.state.errorText ? <p>{this.state.errorText}</p> : null }
              </div>
              <div className="form-group">
                <Button className="btnSign">{M.get('submit')}</Button>
              </div>
              <Link className="forgotPassword" to="/forgotPassword">{M.get('forgotPassword')}?</Link>
              <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={firebase.auth()}
                className={'socialAuth'}
              />
          </ValidationForm>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default SignIn;
