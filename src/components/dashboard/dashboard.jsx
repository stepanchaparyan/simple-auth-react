import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { Jumbotron } from 'reactstrap';
import messages from '../../en.messages';
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
              <h1 className="dashboard__text--lg">{messages['Hello, everyone!']}</h1>
              <p className="dashboard__text--sm">{messages['Information page about signed user']}</p>
              <hr />
              <div className='showFavorites' onClick={this.showExtraInfo}>{messages['Show my favorites']}</div>
            </Jumbotron>
            {this.state.show &&
              <div className='dashboard__favorites'>
                  <UploadSection imageSource='Painter' user={user} />
                  <UploadSection imageSource='Singer' user={user} />
                  <div>
                      <p className='favorite-section-title'>{messages['My favorite song']}</p>
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