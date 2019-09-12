import React, { Component } from 'react';
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import DocumentTitle from 'react-document-title';
import validator from 'validator';
import firebase from '../../config/fbConfig';
import { Button, Image } from 'react-components';
import M from '../../en.messages';
import '../../styles.scss';
import logo from '../../assets/logo.png';

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
        });
    }

    sendEmail = (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-unused-vars
        firebase.auth().sendPasswordResetEmail(this.state.email).then((u) => {
            this.setState({show: true, message: true});
        }).catch((error) => {
            this.setState({errorText: error.message});
        });
    }

    render () {
        return (
          <DocumentTitle title='Simple Auth App - ForgotPasword'>
            <div className="loginContainer">
            <div className="formForgotPassword">
                <div className="logo">
                    <Image id='logo' src={logo} alt="Logo" width={180} height={80}/>
                </div>
                <div className="title">{M.get('forgotPassword')}</div>
                <ValidationForm onSubmit={this.sendEmail}>
                    <div className="form-group">
                        <label className="lebel" htmlFor="email">{M.get('resetPassword')}</label>
                        <TextInput name="email"
                                   id="email"
                                   type="email"
                                   validator={validator.isEmail}
                                   errorMessage={{validator:'Please enter a valid email'}}
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

export default ForgotPasword;