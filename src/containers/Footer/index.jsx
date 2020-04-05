import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CLIENT_NAME } from '../../global/environment';
import { DateTimeUtils } from '../../utils';

const Footer = ({ authUser }) => (authUser ? <FooterAuth /> : null);

Footer.propTypes = { authUser: PropTypes.instanceOf(Object) };
Footer.defaultProps = { authUser: null };

function FooterAuth() {
  const yearNow = DateTimeUtils.getUTCNow().year();

  return (
    <div className="container border-top footer py-4 text-center text-deansoft-secondary">
      {`© ${yearNow} ${CLIENT_NAME}. All rights reserved. Terms, conditions, features, availability, pricing, fees, service and support options subject to change without notice`}
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Footer);
