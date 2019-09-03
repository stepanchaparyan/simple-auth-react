import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { Jumbotron } from 'reactstrap';
import firebase, { storage } from '../../config/fbConfig';
import Constants from '../../constants';
// import '../../stylesheets/dashboard.scss';
import '../../styles.scss';

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
            <h1 className="dashboard__text--lg">Hello, everyone!</h1>
            <p className="dashboard__text--sm">Information page about signed user</p>
            <hr />
          </Jumbotron>
        </div>
      </DocumentTitle>
    );
  }
}

export default Dashboard;