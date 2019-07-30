import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../../stylesheets/dashboard.scss';
import { storage } from '../../config/fbConfig';
import { Jumbotron, Progress, Button, CustomInput } from 'reactstrap';
import firebase from '../../config/fbConfig';
import DocumentTitle from 'react-document-title';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      firstName: '',
      phoneNumber: '',
      image: null,
      url: 'https://firebasestorage.googleapis.com/v0/b/delivery-service-851de.appspot.com/o/images%2Fgray.jpg?alt=media&token=948b1860-40a3-44de-afa6-cc51e36dc1cf',
      progress: 0,
      show: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  getExtraInfo = () => {
    const uid = this.props.user.uid ;
    firebase.firestore().collection('users').doc(uid).get()
    .then((doc) => {
      doc.data();
      this.setState({ 
        phoneNumber: doc.data().phoneNumber, 
        firstName: doc.data().firstName});
    });
    this.setState ({
      show: !this.state.show
    })
  }

  handleChange = e => {
    if(e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}))
    }
  }

  handleUpload = () => {
    const {image} = this.state;
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      this.setState({progress})
    },
    (error) => {
      console.log(error)
    },
    () => {
      storage.ref('images').child(image.name).getDownloadURL().then(url => {
        this.setState(() => ({url}))
      })        
    });    
  }

  render() {
    const { user } = this.props;
    if (!user) return <Redirect to='/signIn' /> 
    return (
      <DocumentTitle title='Simple Auth App - Dashboard'>
        <div className="dashboard"> 
          <Jumbotron>
            <h1 className="display-5">Hello, everyone!</h1>
            <p className="lead">Information page about signed user</p>
            <hr className="my-4" />
            <p className="lead">
              <Button color="info" onClick={this.getExtraInfo}>Click for more info</Button>
            </p>
          </Jumbotron>
            {this.state.show &&
              <>
                <div className='infoText'>User name - {this.state.firstName}</div>
                <div className='infoText'>User phone number - {this.state.phoneNumber}</div>
                <img src={this.state.url} alt="UploadImage" />
                <hr /> 
                <Progress id='progressBar' color="info" value={this.state.progress} max='100'>{this.state.progress}%</Progress>
                <hr /> 
                <CustomInput id="id" color="info" type='file' onChange={this.handleChange}/>
                <hr /> 
                <Button id='uploadBtn' color="info" block onClick={this.handleUpload} disabled={!this.state.image}>Upload New Image</Button> 
              </>
            }
        </div>
      </DocumentTitle>
    )
  }
}

export default Dashboard;