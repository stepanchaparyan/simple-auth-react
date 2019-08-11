import React, {Component} from 'react';
import { Nav, NavItem, Tooltip, Progress, Button, Input } from 'reactstrap';
import '../../stylesheets/navbar.scss';
import messages from '../../en.messages';
import PropTypes from 'prop-types';
import { FaSignOutAlt } from 'react-icons/fa';
import Constants from '../../constants';
import firebase from '../../config/fbConfig';
// eslint-disable-next-line no-duplicate-imports
import { storage } from '../../config/fbConfig';

class SignedInLinks extends Component {
  static propTypes = {
    signOut: PropTypes.func,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
      displayName: '',
      phoneNumber: '',
      image: null,
      photoURL: Constants.photoURL,
      progress: 0,
      show: false
    };
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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
        this.setState(() => ({photoURL: url}));
        console.log(url);
      });
    });
  }

  getExtraInfo = () => {
    const uid = this.props.user.uid ;
    console.log(uid);
    firebase.firestore().collection('users').doc(uid).get()
    .then((doc) => {
      doc.data();
      this.setState({
          displayName: doc.data().displayName,
          phoneNumber: doc.data().phoneNumber,
          firstName: doc.data().firstName
      });
    });
    this.setState ({
      show: !this.state.show
    });
  }

  render () {
    console.log(this.props.user);
    return (
      <Nav pills>
        <NavItem id='profileName' className="nav-text">{this.props.user.displayName}</NavItem>
        <img id='avatar' src={this.state.photoURL} onClick={this.getExtraInfo}/>
        <div id='about'>
            {this.state.show &&
                  <div id='main'>
                    <div id="one">
                        <div className='infoText'>First name</div>
                        <div className="userInfo">{this.props.user.displayName}</div>
                        <div className='infoText'>Phone number</div>
                        <div className="userInfo">{this.state.phoneNumber}</div>
                        <div className='infoText'>Email</div>
                        <div className="userInfo">{this.props.user.email}</div>
                    </div>
                    <div id="two">
                        <div className="image-upload">
                            <label htmlFor="fileInput">
                                <img id='img' src={this.state.photoURL} />
                            </label>
                            <input id="fileInput" type="file" onChange={this.handleChange} />
                        </div>
                      <Progress id='progressBar' color="info" value={this.state.progress} max='100'>{this.state.progress}%</Progress>
                      <button id='uploadBtn' onClick={this.handleUpload} disabled={!this.state.image}>Upload</button>
                    </div>
                  </div>
            }
        </div>
        <NavItem id='signOut' onClick={this.props.signOut} className="nav-text"><FaSignOutAlt size={25} /></NavItem>
        <Tooltip placement="auto" isOpen={this.state.tooltipOpen} target="signOut" toggle={this.toggle}>
          {messages.signOut}
        </Tooltip>
      </Nav>
    );
  }
}

export default SignedInLinks;