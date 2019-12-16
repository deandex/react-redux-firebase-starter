import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FirebaseContext } from '../Firebase';

import { setAuthUserAction } from '../../actions/authUser';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      const fundraProfile = JSON.parse(localStorage.getItem('deansoft-redux-starter-profile'));
      const { onSetAuthUser } = this.props;
      onSetAuthUser(fundraProfile);
    }

    componentDidMount() {
      const firebase = this.context;
      const { onSetAuthUser } = this.props;

      this.listener = firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem('deansoft-redux-starter-profile', JSON.stringify(authUser));
          onSetAuthUser(authUser);
        },
        () => {
          localStorage.removeItem('deansoft-redux-starter-profile');
          onSetAuthUser(null);
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...this.props} />;
    }
  }

  WithAuthentication.contextType = FirebaseContext;

  WithAuthentication.propTypes = {
    onSetAuthUser: PropTypes.func.isRequired,
  };

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: authUser => dispatch(setAuthUserAction(authUser)),
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
};

export default withAuthentication;
