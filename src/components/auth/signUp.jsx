import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../../stylesheets/auth.scss';
import { ValidationForm, TextInput, TextInputGroup } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import { FaEye } from 'react-icons/fa';
import logo from '../../assets/logo2.png';
import { DebounceInput } from 'react-debounce-input';
import { Button } from 'reactstrap';
import firebase from '../../config/fbConfig';
import DocumentTitle from 'react-document-title';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    phoneNumber: '',
    type: 'password',
    user: '',
    errorText: ''
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((resp, user) => {
      this.setState({user: user});
      firebase.firestore().collection('users').doc(resp.user.uid).set({
        firstName: this.state.firstName,
        phoneNumber: this.state.phoneNumber,
      });
    })
    .catch((error) => {
      this.text = error.message;
      this.setState({errorText: error.message});
    });
  }

  showhidepass = (e) => {
    this.state.type === 'password' ? this.setState({type: 'text'}) : this.setState({type: 'password'})
  }
  render() {
    if (this.props.user) return <Redirect to='/' /> 
    return (
      <DocumentTitle title='Simple Auth App - Sign Up'>
        <div className="loginContainer">
        <div className="formSignUp">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="title">Sign Up</div>
          <ValidationForm onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label className="lebel" htmlFor="email">Email</label>
                <DebounceInput element={TextInput}
                    debounceTimeout={500}
                    name="email"
                    id="email"
                    type="email"
                    validator={validator.isEmail}
                    errorMessage={{ validator: "Please enter a valid email" }}
                    value={this.state.email}
                    onChange={this.handleChange}                   
                />
            </div>
            <div className="form-group">
                <label className="lebel" htmlFor="password">Password</label>
                <DebounceInput element={TextInputGroup}
                    debounceTimeout={500}
                    name="password"
                    id="password"
                    type={this.state.type}
                    required
                    pattern=".{6,}"
                    errorMessage={{
                        required: "Password is required",
                        pattern: "Password should be at least 6 characters long"
                    }}
                    value={this.state.password}
                    onChange={this.handleChange}
                    append={<div id="eye" onClick={this.showhidepass}><FaEye /></div>}
                    autoComplete='true'
                />
            </div>
            <div className="form-group">
                <label className="lebel" htmlFor="firstName">First Name</label>
                <DebounceInput element={TextInputGroup}
                    debounceTimeout={500}
                    name="firstName"
                    id="firstName"
                    type="text"
                    required
                    pattern=".{3,}"
                    errorMessage={{
                        required: "First Name is required",
                        pattern: "First Name should be at least 3 characters long"
                    }}
                    value={this.state.firstName}
                    onChange={this.handleChange}
                />
            </div>
            <div className="form-group">
                <label className="lebel" htmlFor="phoneNumber">Phone Number</label>
                <DebounceInput element={TextInputGroup}
                    debounceTimeout={500}
                    name="phoneNumber"
                    id="phoneNumber"
                    type="number"
                    required
                    pattern=".{9,}"
                    errorMessage={{
                        required: "Phone Number is required",
                        pattern: "Phone Number should be at least 9 characters long"
                    }}
                    value={this.state.phoneNumber}
                    onChange={this.handleChange}
                />
            </div>
            <div id="wrongUser">
                  { this.state.errorText ? <p>{this.state.errorText}</p> : null }
              </div>
            <div className="form-group" id="btn">
                  <Button className="btnSignIn" size="lg" block color="info">Submit</Button>
            </div>
        </ValidationForm>
        </div>
      </div>  
     </DocumentTitle>
    )
  }
}


export default SignUp;