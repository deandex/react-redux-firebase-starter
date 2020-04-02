import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FirebaseContext } from '../Firebase';
import { LOCAL_STORAGE_PREFIX } from '../../global/environment';

import { setAuthUserAction } from '../../services/auth/actions';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      const authProfile = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX));
      const { onSetAuthUser } = this.props;
      onSetAuthUser(authProfile);
    }

    componentDidMount() {
      const firebase = this.context;
      const { onSetAuthUser } = this.props;

      this.listener = firebase.onAuthUserListener(
        (authUser) => {
          localStorage.setItem(LOCAL_STORAGE_PREFIX, JSON.stringify(authUser));
          onSetAuthUser(authUser);
        },
        () => {
          localStorage.removeItem(LOCAL_STORAGE_PREFIX);
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

  const mapDispatchToProps = (dispatch) => ({
    onSetAuthUser: (authUser) => dispatch(setAuthUserAction(authUser)),
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
};

export default withAuthentication;
