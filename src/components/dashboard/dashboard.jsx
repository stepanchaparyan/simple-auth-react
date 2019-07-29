import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../../stylesheets/dashboard.scss';
import { storage } from '../../config/fbConfig';
import { Progress, Button, CustomInput } from 'reactstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      image: null,
      url: 'https://firebasestorage.googleapis.com/v0/b/delivery-service-851de.appspot.com/o/images%2Fgray.jpg?alt=media&token=948b1860-40a3-44de-afa6-cc51e36dc1cf',
      progress: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleChange = e => {
    if(e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}))
      console.log(image)
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
      <div className="dashboard">
        <div className="mainText">This is the main page</div>
        <Progress id='ttt' color="info" value={this.state.progress} max='100'>{this.state.progress}%</Progress>
        <br />
        <hr /> 
        <CustomInput id="id" color="info" type='file' onChange={this.handleChange}/>
        <br />
        <hr /> 
        <Button color="info"onClick={this.handleUpload} disabled={!this.state.image}>Upload</Button>      
        <br />
        <hr /> 
        <img src={this.state.url} alt="Upload Image" />
      </div>
    )
  }
}

export default Dashboard;