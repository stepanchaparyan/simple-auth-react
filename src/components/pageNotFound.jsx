import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import M from '../Messages';

class PageNotFound extends Component {
  render() {
    return (
      <DocumentTitle title='Simple Auth App - Page Not Found'>
        <div className="pageNotFound">
            <h1>{M.get('pageNotFound')}</h1>
        </div>
      </DocumentTitle>
    );
  }
}

export default PageNotFound;