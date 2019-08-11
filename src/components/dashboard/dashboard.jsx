import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../../stylesheets/dashboard.scss';
import { storage } from '../../config/fbConfig';
import { Jumbotron, Progress, Button, CustomInput } from 'reactstrap';
// eslint-disable-next-line no-duplicate-imports
import firebase from '../../config/fbConfig';
import DocumentTitle from 'react-document-title';
import Constants from '../../constants';
import PropTypes from 'prop-types';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      phoneNumber: '',
      image: null,
      photoURL: Constants.photoURL,
      progress: 0,
      show: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  static propTypes = {
    user: PropTypes.object
  };

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
      });
    });
  }

  render() {
    const { user } = this.props;
    if (!user) {return <Redirect to='/signIn' />;}
    return (
      <DocumentTitle title='Simple Auth App - Dashboard'>
        <div className="dashboard">
          <Jumbotron>
            <h1 className="display-5">Hello, everyone!</h1>
            <p className="lead">Information page about signed user</p>
            <hr className="my-4" />
          </Jumbotron>
        </div>
      </DocumentTitle>
    );
  }
}

export default Dashboard;