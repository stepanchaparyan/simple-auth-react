import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-components';
import { Progress } from 'reactstrap';
import { storage } from '../../config/fbConfig';
import Constants from '../../constants';
import messages from '../../en.messages';
import '../../styles.scss';

class UploadSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      phoneNumber: '',
      image: null,
      photoURL: null,
      progress: 0,
      show: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
  }

  static propTypes = {
    imageSource: PropTypes.string,
    user: PropTypes.object
  };

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}));
      this.resetProgress();
    }
  }

  resetProgress = () => {
    this.setState ({
      progress: 0
    });
  }

  handleUpload = (imageSource) => {
    const uid = this.props.user.uid;
    const { image } = this.state;
    const uploadTask = storage.ref(`${uid}/${imageSource}`).put(image);
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      this.setState({progress});
      this.setState({image: false});
    },
    (error) => {
      console.log(error);
    },
    () => {
      storage.ref(uid).child(imageSource).getDownloadURL().then(url => {
        this.setState(() => ({photoURL: url}));
      });
    });
  }

  render() {
    // console.log(this.props);
    const { imageSource } = this.props;
    return (
      <div>
          <p className='favorite-section-title'>{messages['My favorite ']} {imageSource}</p>
          <div>
              <label htmlFor={imageSource}>
                  <Image
                      id='uploadImage'
                      src={this.state.photoURL || Constants[imageSource]}
                      width={180}
                      height={140}
                  />
              </label>
              <input
                id={imageSource}
                className='hideInput'
                type="file"
                onChange={this.handleChange}
              />
          </div>
          <Progress
              className='dashboard-progress'
              color="info"
              value={this.state.progress}
              max='100'>
              {this.state.progress}%
          </Progress>
          <Button
              className='dashboard-upload-Btn'
              onClick={() => this.handleUpload((imageSource))}
              disabled={!this.state.image}
          >
          {messages.Upload}
          </Button>
      </div>
    );
  }
}

export default UploadSection;