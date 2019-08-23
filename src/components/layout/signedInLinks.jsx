import React, {Component} from 'react';
import { Nav, NavItem, Progress, Tooltip } from 'reactstrap';
import '../../stylesheets/navbar.scss';
import messages from '../../en.messages';
import PropTypes from 'prop-types';
import {FaSignOutAlt, FaEdit, FaCheck} from 'react-icons/fa';
import firebase, {storage} from '../../config/fbConfig';
import ReactTooltip from 'react-tooltip';

class SignedInLinks extends Component {
  static propTypes = {
    signOut: PropTypes.func,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      tooltipSignOutOpen: false,
      tooltipNameOpen: false,
      image: null,
      progress: 0,
      show: false,
      displayName: null,
      email: null,
      phoneNumber: null,
      photoURL: null,
      editable: false,
      emailUpdateError: null
    };
    this.textInputName = React.createRef();
    this.textInputEmail = React.createRef();
    this.textInputPassword = React.createRef();

    this.toggleSignOut = this.toggleSignOut.bind(this);
    this.toggleName = this.toggleName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.showExtraInfo = this.showExtraInfo.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
    this.updateUserPhotoURL = this.updateUserPhotoURL.bind(this);
    this.confirmNewName = this.confirmNewName.bind(this);
  }

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}));
      this.resetProgress();
    }
  }

  handleUpload = () => {
    const {image} = this.state;
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      this.setState({progress});
    },
    (error) => {
      console.log(error);
    },
    () => {
      storage.ref('images').child(image.name).getDownloadURL().then(photoURL => {
        this.updateUserPhotoURL(photoURL);
        this.setState({photoURL});
        this.setState({image:null});
      });
    });
  }

  updateUserPhotoURL = (photoURL) => {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      photoURL: photoURL
    }).catch(function(error) {
      console.log(error);
    });
  }

  updateUserDisplayName = (displayName) => {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: displayName
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  updateUserEmail = (email,password) => {
    let user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );
    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
    }).catch((error) => {
      this.setState ({
        emailUpdateError: error.message
      });
      console.log('111', error.message);
    });
    user.updateEmail(email)
    .catch((error) => {
      this.setState ({
        emailUpdateError: error.message
      });
      console.log('222', error.message);
    });
  }

  showExtraInfo = () => {
    this.setState ({
      show: !this.state.show
    });
  }

  resetProgress = () => {
    this.setState ({
      progress: 0
    });
  }

  confirmNewName = (e) => {
    e.preventDefault();
    this.setState({editable: !this.state.editable});
    const displayName = this.textInputName.current.value;
    this.updateUserDisplayName(displayName);
    this.setState({displayName: displayName});
  }

  confirmNewEmail = (e) => {
    e.preventDefault();
    this.setState({editable: !this.state.editable});
    const email = this.textInputEmail.current.value;
    const password = this.textInputPassword.current.value;
    this.updateUserEmail(email, password);
    this.setState({email: email});
  }

  toggleSignOut() {
    this.setState({
      tooltipSignOutOpen: !this.state.tooltipSignOutOpen
    });
  }

  toggleName() {
    this.setState({
      tooltipNameOpen: !this.state.tooltipNameOpen
    });
  }

  render () {
    console.log(this.props.user);

    return (
      <Nav pills>
        <NavItem
            id='profileName'
            className="nav-text text-ellipsis">
            {this.state.displayName || this.props.user.displayName}
        </NavItem>
        <Tooltip
            placement="auto"
            isOpen={this.state.tooltipNameOpen}
            target="profileName"
            toggle={this.toggleName}
          >
          {this.state.displayName || this.props.user.displayName}
        </Tooltip>
        <img
            id='avatar'
            src={this.state.photoURL || this.props.user.photoURL}
            onClick={this.showExtraInfo}
        />
        <div id='about'>
            {this.state.show &&
                <div id='main'>
                  <div id="one">

                      <div className='infoText'>Name</div>
                      { this.state.editable ?
                      <>
                        <FaCheck size={20} className="faEdit" onClick={this.confirmNewName} />
                        <input type="text" className="editableInput" ref={this.textInputName} defaultValue={this.state.displayName || this.props.user.displayName}></input>
                      </> :
                      <>
                        <div className="userInfo text-ellipsis"
                              data-tip={this.state.displayName || this.props.user.displayName}>
                              <FaEdit size={20} className="faEdit" onClick={() => this.setState({editable: !this.state.editable})} />
                              {this.state.displayName || this.props.user.displayName}
                        </div>
                        <ReactTooltip className='tooltipClass' place="left" type="info" effect="solid" />
                      </>
                      }
                      
                      <div className='infoText'>Email</div>
                      { this.state.editable ?
                      <>
                        <FaCheck size={20} className="faEdit" onClick={this.confirmNewEmail} />
                        <input type="text" className="editableInput" ref={this.textInputEmail} defaultValue={this.state.email || this.props.user.email}></input>
                      </> :
                      <>
                        <div className="userInfo text-ellipsis"
                              data-tip={this.state.email || this.props.user.email}>
                              <FaEdit size={20} className="faEdit" onClick={() => this.setState({editable: !this.state.editable})} />
                              {this.state.email || this.props.user.email}
                        </div>
                        {this.state.emailUpdateError && <div id='emailErrorMessage'>{this.state.emailUpdateError}</div>}
                        <ReactTooltip className='tooltipClass' place="left" type="info" effect="solid" />
                      </>
                      }
                    
                      { this.state.editable &&
                      <>
                        <div className='infoText text-ellipsis'>Confirm password</div>
                        <input type="text" className="editableInput" id='inputPass' ref={this.textInputPassword} defaultValue=''></input>
                      </>
                      }

                  </div>
                  <div id="two">
                      <div className="image-upload">
                          <label htmlFor="fileInput">
                              <img id='img' src={this.state.photoURL || this.props.user.photoURL} />
                          </label>
                          <input id="fileInput"
                            type="file"
                            onChange={this.handleChange}
                          />
                      </div>
                      <Progress id='progressBar'
                          color="info"
                          value={this.state.progress}
                          max='100'>
                          {this.state.progress}%
                      </Progress>
                      <button id='uploadBtn'
                          onClick={this.handleUpload}
                          disabled={!this.state.image}>
                          Upload
                      </button>
                  </div>
                </div>
            }
        </div>
        <NavItem id='signOut'
            onClick={this.props.signOut}
            className="nav-text">
            <FaSignOutAlt size={25} />
        </NavItem>
        <Tooltip
            placement="right"
            isOpen={this.state.tooltipSignOutOpen}
            target="signOut"
            toggle={this.toggleSignOut}
          >
          {messages.signOut}
        </Tooltip>
      </Nav>
    );
  }
}

export default SignedInLinks;