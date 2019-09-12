import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Image, Spinner } from 'react-components';
import { Progress } from 'reactstrap';
import firebase, { storage } from '../../config/fbConfig';
import M from '../../Messages';
import '../../styles.scss';

class UploadSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      progress: 0,
      favSingerPhotoURL: '',
      favPainterPhotoURL: ''
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
        firebase.firestore().collection('users').doc(uid).update({
          [`fav${imageSource}PhotoURL`]: url,
          updated: new Date()
        });
        this.setState(() => ({[`fav${imageSource}PhotoURL`]: url}));
      });
    });
  }

  componentDidMount = () => {
      const imageSource = this.props.imageSource;
      firebase.firestore().collection('users').doc(this.props.user.uid).get()
      .then((doc) => {
        doc.data();
        this.setState({
          [`fav${imageSource}PhotoURL`]: doc.data()[`fav${imageSource}PhotoURL`]
        });
      });
  }

  render() {
    const { imageSource } = this.props;
    return (
      <div className='imageContainer'>
          <p className='favorite-section-title'>{M.get('dashboard.myFavorite')} {imageSource}</p>
          <div>
          { this.state[`fav${imageSource}PhotoURL`] ?
            <div>
              <label htmlFor={imageSource}>
                  <Image
                      className='uploadImage'
                      src={this.state[`fav${imageSource}PhotoURL`]}
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
          : <Spinner size={15} className={'uploadSpinner'}/>
          }
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
          {M.get('upload')}
          </Button>
      </div>
    );
  }
}

export default UploadSection;