import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import SignedInLinks from './signedInLinks';
import SignedOutLinks from './signedOutLinks';
import firebase from '../../config/fbConfig';
import { Image } from 'react-components';
import logo from '../../assets/logo2.png';
import '../../styles.scss';

class MyNavbar extends Component {
  static propTypes = {
    user: PropTypes.object,
    phoneNumber: PropTypes.string
  };

  signOut = () => {
      firebase.auth().signOut();
  }

  render () {
    const { user } = this.props;
    const links = user ? <SignedInLinks user={user} signOut={this.signOut} /> : <SignedOutLinks />;

    return (
      <Navbar className="p-2 bg-info text-white" light expand="md">
        <Container>
          <NavbarBrand href="/">
              <Image src={logo} alt="Logo" width={200} height={22}/>
          </NavbarBrand>
          {links}
        </Container>
      </Navbar>
    );
  }
}

export default MyNavbar;