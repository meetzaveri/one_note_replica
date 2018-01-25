import React from 'react';
import { FormattedMessage } from 'react-intl';

import H1 from './../H1';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';
import Custombtn from './custombtn';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <NavBar>
           <H1>Login </H1>
        </NavBar>
      </div>
    );
  }
}

export default Header;
