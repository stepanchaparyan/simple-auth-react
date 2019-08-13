import React, {Component} from 'react';
import SignedInLinks from './signedInLinks';
import SignedOutLinks from './signedOutLinks';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import '../../stylesheets/navbar.scss';
import logo from '../../assets/logo2.png';
import firebase from '../../config/fbConfig';
import PropTypes from 'prop-types';

class MyNavbar extends Component {
  static propTypes = {
    user: PropTypes.object,
    phoneNumber: PropTypes.string
  };

  signOut = () => {
      firebase.auth().signOut();
  }

  render () {
    const { user, phoneNumber } = this.props;
    const links = user ? <SignedInLinks user={user} signOut={this.signOut} phoneNumber={phoneNumber}/> : <SignedOutLinks />;

    return (
      <Navbar className="p-2 bg-info text-white" light expand="md">
        <Container>
          <NavbarBrand href="/">
            <div className="iconAndTitle">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
            </div>
          </NavbarBrand>
          {links}
        </Container>
      </Navbar>
    );
  }
}

export default MyNavbar;