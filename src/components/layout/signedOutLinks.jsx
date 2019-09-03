import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import messages from '../../en.messages';
import '../../styles.scss';

const SignedOutLinks = () => {
  return (
    <div>
      <Nav pills>
        <NavItem>
            <NavLink to='/signup/' className="navbar__navItem__navLink--text">{messages.signup}</NavLink>
            <NavLink to='/signin/' className="navbar__navItem__navLink--text">{messages.signIn}</NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default SignedOutLinks;