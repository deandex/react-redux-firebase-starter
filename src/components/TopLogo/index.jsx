import React from 'react';

import { MAIN_WEB_URL } from '../../global/environment';

import DeansoftLogo from '../../assets/images/logo.png';

const TopLogo = () => (
  <a href={MAIN_WEB_URL}>
    <img src={DeansoftLogo} className="login-logo" alt="" />
  </a>
);

export default TopLogo;
