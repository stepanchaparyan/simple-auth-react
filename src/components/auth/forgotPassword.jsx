import React, { Component } from 'react';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator';
import '../../stylesheets/auth.scss';
import logo from '../../assets/logo.png';
import SweetAlert from 'sweetalert2-react';
import 'sweetalert2/dist/sweetalert2.css';
import { Button } from 'reactstrap';
import firebase from '../../config/fbConfig';

class ForgotPasword extends Component {
    state = {
        email: ''
    }    
    
    handleChange = (e, value) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    sendEmail = (e) => {
        e.preventDefault();
        firebase.auth.sendPasswordResetEmail(this.state.email).then((u) => {
            document.getElementById("wrongEmail").style.visibility = 'hidden';
        }).catch((error) => {
            document.getElementById("wrongEmail").style.visibility = 'visible';
        });
    }

    render () {
        return (
        <div className="loginContainer">  
          <div className="formForgotPassword">          
            <div className="logo">
                <img src={logo} alt="Logo"/>
            </div>
            <div className="title">Forgot password</div>            
            <ValidationForm onSubmit={this.sendEmail}>
                <div className="form-group">
                    <label className="lebel" htmlFor="email">Enter your email to reset password</label>
                    <TextInput  name="email" 
                                id="email" 
                                type="email" 
                                validator={validator.isEmail} 
                                errorMessage={{validator:"Please enter a valid email"}}
                                value={this.state.email}
                                onChange={this.handleChange}
                    />
                </div>
                <div id="wrongEmail">Please enter a valid email</div>
                <SweetAlert
                    show={this.state.show}
                    title="GOOD!"            
                    text="Please check your email"
                    onConfirm={() => this.setState({ show: false })}
                />
                <div className="form-group" id="btn">
                    <Button className="btnSignIn" size="lg" block color="info">Submit</Button>
                </div>
                </ValidationForm>
          </div>
        </div>
        )
    }
}

 
export default ForgotPasword;