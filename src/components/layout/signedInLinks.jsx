import React, {Component} from 'react';
import { Nav, NavItem, Tooltip, Progress } from 'reactstrap';
import '../../stylesheets/navbar.scss';
import messages from '../../en.messages';
import PropTypes from 'prop-types';
import {FaSignOutAlt} from 'react-icons/fa';
import firebase, {storage} from '../../config/fbConfig';

class SignedInLinks extends Component {
  static propTypes = {
    signOut: PropTypes.func,
    user: PropTypes.object,
    phoneNumber: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
      image: null,
      progress: 0,
      show: false
    };
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.showExtraInfo = this.showExtraInfo.bind(this);
    //this.resetProgress = this.resetProgress.bind(this);
    this.updateUserPhotoURL = this.updateUserPhotoURL.bind(this);
    //this.updateUserPhoneNumber = this.updateUserPhoneNumber.bind(this);
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
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
      storage.ref('images').child(image.name).getDownloadURL().then(url => {
        this.updateUserPhotoURL(url);
        setTimeout(() => { this.forceUpdate(); }, 2000);
        //this.updateUserPhoneNumber('00123456789');
      });
    });
  }

  updateUserPhotoURL = (url) => {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      photoURL: url
    }).then(function() {
      //console.log(url);
    }).catch(function(error) {
      console.log(error);
    });
  }

  // updateUserPhoneNumber = (number) => {
  //   let user = firebase.auth().currentUser;
  //   user.updatePhoneNumber({
  //     phoneNumber: number
  //   }).then(function() {
  //     console.log(number);
  //   }).catch(function(error) {
  //     console.log(error);
  //   });
  // }

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

  render () {
    console.log(this.props.user);

    return (
      <Nav pills>
        <NavItem
            id='profileName'
            className="nav-text">
            {this.props.user.displayName}
        </NavItem>
        <img
            id='avatar'
            src={this.props.user.photoURL}
            onClick={this.showExtraInfo}
        />
        <div id='about'>
            {this.state.show &&
                <div id='main'>
                  <div id="one">
                      <div className='infoText'>First name</div>
                      <div className="userInfo">{this.props.user.displayName}</div>
                      <div className='infoText'>Phone number</div>
                      <div className="userInfo">{this.props.phoneNumber}</div>
                      <div className='infoText'>Email</div>
                      <div className="userInfo">{this.props.user.email}</div>
                  </div>
                  <div id="two">
                      <div className="image-upload">
                          <label htmlFor="fileInput">
                              <img id='img' src={this.props.user.photoURL} />
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
            placement="auto"
            isOpen={this.state.tooltipOpen}
            target="signOut"
            toggle={this.toggle}
          >
          {messages.signOut}
        </Tooltip>
      </Nav>
    );
  }
}

export default SignedInLinks;