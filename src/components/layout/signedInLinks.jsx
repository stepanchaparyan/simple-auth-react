import React, {Component, Fragment } from 'react';
import { Nav, NavItem, Progress } from 'reactstrap';
import PropTypes from 'prop-types';
import firebase, {storage} from '../../config/fbConfig';
import ReactTooltip from 'react-tooltip';
import { Button, Icon, Image, Tooltip } from 'react-components';
import M from '../../Messages';
import '../../styles.scss';
import Constants from '../../constants';

class SignedInLinks extends Component {
  static propTypes = {
    signOut: PropTypes.func,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
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

    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.showExtraInfo = this.showExtraInfo.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
    this.updateUserPhotoURL = this.updateUserPhotoURL.bind(this);
    this.confirmNewName = this.confirmNewName.bind(this);
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

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}));
      this.resetProgress();
    }
  }

  handleUpload = () => {
    const uid = this.props.user.uid;
    const {image} = this.state;
    const uploadTask = storage.ref(`${uid}/${image.name}`).put(image);
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      this.setState({progress});
    },
    (error) => {
      console.log(error);
    },
    () => {
      storage.ref(uid).child(image.name).getDownloadURL().then(photoURL => {
        this.updateUserPhotoURL(photoURL);
        firebase.firestore().collection('users').doc(uid).update({
          photoURL: photoURL,
          updated: new Date()
        });
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

  updateAuthUserDisplayName = (displayName) => {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: displayName
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  updateFirestoreUserDisplayName = (displayName) => {
    const uid = this.props.user.uid;
    firebase.firestore().collection('users').doc(uid).update({
        displayName: displayName,
        updated: new Date()
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  confirmNewName = (e) => {
    e.preventDefault();
    this.setState({editable: !this.state.editable});
    const displayName = this.textInputName.current.value;
    this.setState({displayName: displayName});
    this.updateAuthUserDisplayName(displayName);
    this.updateFirestoreUserDisplayName(displayName);
  }

  updateAuthUserEmail = (email,password) => {
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
    });
    user.updateEmail(email)
    .catch((error) => {
      this.setState ({
        emailUpdateError: error.message
      });
      console.log(error.message);
    });
  }

  updateFirestoreUserEmail = (email) => {
    const uid = this.props.user.uid;
    firebase.firestore().collection('users').doc(uid).update({
        email: email,
        updated: new Date()
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  confirmNewEmail = (e) => {
    e.preventDefault();
    this.setState({editable: !this.state.editable});
    const email = this.textInputEmail.current.value;
    const password = this.textInputPassword.current.value;
    this.setState({email: email});
    this.updateAuthUserEmail(email, password);
    this.updateFirestoreUserEmail(email);
  }

  render () {
    // console.log(this.props.user);
    return (
      <Nav pills>
        <Tooltip
            position="left"
            content={this.state.displayName || this.props.user.displayName}
          >
          <NavItem
              className="nav__profileName text-ellipsis">
              {this.state.displayName || this.props.user.displayName}
          </NavItem>
        </Tooltip>
        <Image
            circle
            width={40}
            height={40}
            className='nav__avatar'
            src={this.state.photoURL || this.props.user.photoURL || Constants.photoURL}
            onClick={this.showExtraInfo}
        />
        <div className='navbar__profileInfo'>
            {this.state.show &&
                <div className='navbar__profileInfo__full'>
                  <div className='navbar__profileInfo__leftPart'>
                      <div className='navbar__profileInfo__leftPart__title'>{M.get('name')}</div>
                      { this.state.editable ?
                      <Fragment>
                        <Icon name='check' size={1.2} className="navbar__profileInfo__faEdit" onClick={this.confirmNewName} />
                        <input type="text" className="navbar__profileInfo__editableInput" ref={this.textInputName} defaultValue={this.state.displayName || this.props.user.displayName}></input>
                      </Fragment> :
                      <Fragment>
                        <div className="text-ellipsis"
                              data-tip={this.state.displayName || this.props.user.displayName}>
                              <Icon name='edit' size={1.2} className="navbar__profileInfo__faEdit" onClick={() => this.setState({editable: !this.state.editable})} />
                              {this.state.displayName || this.props.user.displayName}
                        </div>
                        <ReactTooltip className='navbar__profileInfo__editableInput__tooltipClass' place="left" type="info" effect="solid" />
                      </Fragment>
                      }
                      <div className='navbar__profileInfo__leftPart__title'>{M.get('email')}</div>
                      { this.state.editable ?
                      <Fragment>
                        <Icon name='check' size={1.2} className="navbar__profileInfo__faEdit" onClick={this.confirmNewEmail} />
                        <input type="text" className="navbar__profileInfo__editableInput" ref={this.textInputEmail} defaultValue={this.state.email || this.props.user.email}></input>
                      </Fragment> :
                      <Fragment>
                        <div className="text-ellipsis"
                              data-tip={this.state.email || this.props.user.email}>
                              <Icon name='edit' size={1.2} className="navbar__profileInfo__faEdit" onClick={() => this.setState({editable: !this.state.editable})} />
                              {this.state.email || this.props.user.email}
                        </div>
                        {this.state.emailUpdateError && <div className='navbar__profileInfo__emailErrorMessage'>{this.state.emailUpdateError}</div>}
                        <ReactTooltip className='navbar__profileInfo__editableInput__tooltipClass' place="left" type="info" effect="solid" />
                      </Fragment>
                      }
                      { this.state.editable &&
                      <Fragment>
                        <div className='navbar__profileInfo__leftPart__title'>{M.get('confirmPassword')}</div>
                        <input type="text" className='navbar__profileInfo__editableInput navbar__profileInfo__editableInput--margin' ref={this.textInputPassword} defaultValue=''></input>
                      </Fragment>
                      }
                  </div>
                  <div className="navbar__profileInfo__rightPart">
                      <Fragment>
                          <label htmlFor="navbar__profileInfo__fileInput">
                              <Image
                                  className='navbar__profileInfo__uploadingImage'
                                  src={this.state.photoURL || this.props.user.photoURL}
                                  width={120}
                                  height={120}
                              />
                          </label>
                          <input className="navbar__profileInfo__fileInput"
                            id="navbar__profileInfo__fileInput"
                            type="file"
                            onChange={this.handleChange}
                          />
                      </Fragment>
                      <Progress
                          color="info"
                          value={this.state.progress}
                          max='100'>
                          {this.state.progress}%
                      </Progress>
                      <Button className='navbar__profileInfo__uploadBtn'
                          onClick={this.handleUpload}
                          disabled={!this.state.image}
                          >
                          {M.get('upload')}
                      </Button>
                  </div>
                </div>
            }
        </div>
        <Tooltip
            content={M.get('signOut')}
            position='bottom'
          >
            <NavItem
              onClick={this.props.signOut} >
              <Icon name='sign-out' size={1.9} />
            </NavItem>
        </Tooltip>
      </Nav>
    );
  }
}

export default SignedInLinks;