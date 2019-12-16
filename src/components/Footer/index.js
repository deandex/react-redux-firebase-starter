import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DateTimeHelper } from '../../helpers';

const Footer = ({ authUser }) => (authUser ? <FooterAuth /> : null);

Footer.propTypes = { authUser: PropTypes.instanceOf(Object) };
Footer.defaultProps = { authUser: null };

function FooterAuth() {
  const yearNow = DateTimeHelper.getUTCNow().year();

  return (
    <div className="my-5">
      <div className="container border-top footer py-4 text-center text-fundra-secondary">
        {`© ${yearNow} Fundra Inc. All rights reserved. Terms, conditions, features, availability, pricing, fees, service and support options subject to change without notice`}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Footer);
