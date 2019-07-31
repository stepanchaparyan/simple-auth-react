import React, {Component} from 'react';
import { Nav, NavItem } from 'reactstrap';
import '../../stylesheets/navbar.scss';
import messages from '../../en.messages';
import PropTypes from 'prop-types'; 

class SignedInLinks extends Component {
  static propTypes = {
    signOut: PropTypes.func
  };

  render () {
    return (
      <Nav pills>
        <NavItem onClick={this.props.signOut} className="text-white nav-text">{messages.signOut}</NavItem>
      </Nav>
    )
  }
}

export default SignedInLinks;