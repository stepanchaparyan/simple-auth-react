import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../../stylesheets/auth.scss';
import { ValidationForm, TextInput, TextInputGroup } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import { FaEye } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { DebounceInput } from 'react-debounce-input';
import { Button } from 'reactstrap';
import firebase from '../../config/fbConfig';

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    type: 'password',
    user: '',
    errorText: ''
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((user) => { 
      this.setState({user: user})
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
    if (this.state.user) return <Redirect to='/' /> 
    return (
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
                       required: "FirstName is required",
                       pattern: "FirstName should be at least 3 characters long"
                   }}
                   value={this.state.firstName}
                   onChange={this.handleChange}
               />
           </div>

           <div className="form-group">
               <label className="lebel" htmlFor="lastName">Last Name</label>
               <DebounceInput element={TextInputGroup}
                   debounceTimeout={500}
                   name="lastName"
                   id="lastName"
                   type="text"
                   required
                   pattern=".{3,}"
                   errorMessage={{
                       required: "Last Name is required",
                       pattern: "Last Name should be at least 3 characters long"
                   }}
                   value={this.state.lastName}
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
    )
  }
}


export default SignUp;