import React, {Component} from 'react';
import { Nav, NavItem } from 'reactstrap';
import '../../stylesheets/navbar.scss';

class SignedInLinks extends Component {
  render () {
    return (
      <Nav pills>
        <NavItem onClick={this.props.signOut} className="text-white nav-text">Sign Out</NavItem>
      </Nav>
    )
  }
}

export default SignedInLinks;