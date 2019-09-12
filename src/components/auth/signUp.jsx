import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { ValidationForm, TextInput, TextInputGroup } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import { DebounceInput } from 'react-debounce-input';
import { Button, Image, Icon } from 'react-components';
import firebase from '../../config/fbConfig';
import Constants from '../../constants';
import M from '../../Messages';
import logo from '../../assets/logo.png';
import '../../styles.scss';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    displayName: '',
    phoneNumber: '',
    type: 'password',
    user: '',
    errorText: '',
    photoURL: Constants.photoURL,
    iconName: 'eye-slash'
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
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((resp) => {
      resp.user.updateProfile({
        displayName: this.state.displayName,
        photoURL: this.state.photoURL
      });
      this.setState({user: resp.user});
      firebase.firestore().collection('users').doc(resp.user.uid).set({
        created: new Date(),
        updated: new Date(),
        displayName: this.state.displayName,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        photoURL: this.state.photoURL,
        favSingerPhotoURL: this.state.photoURL,
        favPainterPhotoURL: this.state.photoURL
      });
      setTimeout( function () { window.location.reload(); },1000);
    })
    .catch((error) => {
      this.text = error.message;
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
      <DocumentTitle title='Simple Auth App - Sign Up'>
        <div className="loginContainer">
        <div className="formSignUp">
          <div className="logo">
            <Image src={logo} id='logo' alt="Logo" height={80} width={200} />
          </div>
          <div className="title">{M.get('signup')}</div>
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
                    append={<div id="eye" onClick={this.showhidepass}><Icon name={this.state.iconName} className='eye' /></div>}
                    autoComplete='true'
                />
            </div>
            <div className="form-group">
                <label className="lebel" htmlFor="displayName">{M.get('displayName')}</label>
                <DebounceInput element={TextInputGroup}
                    debounceTimeout={500}
                    name="displayName"
                    id="displayName"
                    type="text"
                    required
                    pattern=".{3,}"
                    errorMessage={{
                        required: 'Name is required',
                        pattern: 'Name should be at least 3 characters long'
                    }}
                    value={this.state.displayName}
                    onChange={this.handleChange}
                />
            </div>
            {/* <div className="form-group">
                <label className="lebel" htmlFor="phoneNumber">{messages.phoneNumber}</label>
                <DebounceInput element={TextInputGroup}
                    debounceTimeout={500}
                    name="phoneNumber"
                    id="phoneNumber"
                    type="text"
                    required
                    pattern=".{9,}"
                    errorMessage={{
                        required: 'Phone Number is required',
                        pattern: 'Phone Number should be at least 9 characters long'
                    }}
                    value={this.state.phoneNumber}
                    onChange={this.handleChange}
                />
            </div> */}
            <div id="wrongUser">
                  { this.state.errorText ? <p>{this.state.errorText}</p> : null }
              </div>
            <div className="form-group">
                <Button className="btnSign">{M.get('submit')}</Button>
            </div>
        </ValidationForm>
        </div>
      </div>
     </DocumentTitle>
    );
  }
}

export default SignUp;