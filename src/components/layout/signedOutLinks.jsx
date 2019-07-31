import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import '../../stylesheets/navbar.scss';
import messages from '../../en.messages';

const SignedOutLinks = () => {
  return (
    <div>
      <Nav pills>
        <NavItem>
            <NavLink to='/signup/' className="text-white nav-text">{messages.signup}</NavLink>
            <NavLink to='/signin/' className="text-white nav-text">{messages.signIn}</NavLink>
        </NavItem>
      </Nav>
    </div>
  )
}

export default SignedOutLinks;