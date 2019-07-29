import React, {Component} from 'react';
import SignedInLinks from './signedInLinks';
import SignedOutLinks from './signedOutLinks';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import '../../stylesheets/navbar.scss';
import { FaTruck } from 'react-icons/fa';

import firebase from '../../config/fbConfig';

class MyNavbar extends Component {

  signOut = () => {
      firebase.auth().signOut();
  }  

  render () {
    const { user } = this.props;
    const links = user ? <SignedInLinks user={user} signOut={this.signOut}/> : <SignedOutLinks />;

    return (
      <Navbar className="p-2 bg-info text-white" light expand="md">
        <Container>
        <div className="iconAndTitle">
            <div className="FaTruck"> <FaTruck /></div>
            <NavbarBrand href="/">Simple Auth App</NavbarBrand>
        </div>
        {links}
        </Container>
      </Navbar>
    )
  }
}

export default MyNavbar;