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
        email: '',
        errorText: '',
        message: ''
    }    
    
    handleChange = (e) => {
        this.setState({
            email: e.target.value,
            message: '',
            errorText: ''
        })
    }

    sendEmail = (e) => {
        e.preventDefault();
        firebase.auth().sendPasswordResetEmail(this.state.email).then((u) => {
            this.setState({show: true, message: true})
        }).catch((error) => {
            this.setState({errorText: error.message});
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
                <div id="wrongUser">
                    { this.state.errorText ? <p>{this.state.errorText}</p> : null }
                </div>
                <div id="wrongUser">
                    { this.state.message ? <p>{'Please check your email'}</p> : null }
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

 
export default ForgotPasword;