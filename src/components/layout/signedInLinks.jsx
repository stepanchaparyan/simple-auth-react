import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import '../../stylesheets/navbar.scss';

class SignedInLinks extends Component {
  render () {
    return (
      <Nav pills>
        <NavItem onClick={this.props.signOut} className="text-white nav-text">Sign Out</NavItem>
        <NavLink exact to='/' className="text-white nav-text profileName">{this.props.user.email}</NavLink>
      </Nav>
    )
  }
}

export default SignedInLinks;