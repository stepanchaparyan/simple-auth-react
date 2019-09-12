import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { Jumbotron } from 'reactstrap';
import M from '../../Messages';
import ReactPlayer from 'react-player';
import UploadSection from './uploadSection';
import '../../styles.scss';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  static propTypes = {
    user: PropTypes.object
  };

  showExtraInfo = () => {
    this.setState ({
      show: !this.state.show
    });
  }

  render() {
    const { user } = this.props;
    if (!user) {return <Redirect to='/signIn' />;}
    return (
      <DocumentTitle title='Simple Auth App - Dashboard'>
        <div className="dashboard">
            <Jumbotron>
              <h1 className="dashboard__text--lg">{M.get('dashboard.helloEveryone!')}</h1>
              <p className="dashboard__text--sm">{M.get('dashboard.informationPageAboutSignedUser')}</p>
              <hr />
              <div className='showFavorites' onClick={this.showExtraInfo}>{M.get('dashboard.showMyFavorites')}</div>
            </Jumbotron>
            {this.state.show &&
              <div className='dashboard__favorites'>
                  <UploadSection imageSource='Painter' user={user} />
                  <UploadSection imageSource='Singer' user={user} />
                  <div>
                      <p className='favorite-section-title'>{M.get('dashboard.myFavoriteSong')}</p>
                      <ReactPlayer
                          url='https://www.youtube.com/watch?v=PfAWReBmxEs'
                          controls
                          width={200}
                          height={200}
                      />
                  </div>
              </div>
            }
        </div>
      </DocumentTitle>
    );
  }
}

export default Dashboard;