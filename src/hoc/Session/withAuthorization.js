import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROUTES from '../../global/routes';
import { LOCAL_STORAGE_PREFIX } from '../../global/environment';

import { FirebaseContext } from '../Firebase';

import { clearAuthUserAction } from '../../services/auth/actions';

const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      const firebase = this.context;
      this.listener = firebase.onAuthUserListener(
        (authUser) => {
          if (!condition(authUser)) {
            this.clearAllState();
          }
        },
        () => this.clearAllState(),
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    clearAllState() {
      const { history, onClearAuthUser } = this.props;
      localStorage.removeItem(LOCAL_STORAGE_PREFIX);
      onClearAuthUser();

      history.push(ROUTES.SIGN_IN);
    }

    render() {
      const { authUser } = this.props;
      // eslint-disable-next-line react/jsx-props-no-spreading
      return condition(authUser) ? <Component {...this.props} /> : null;
    }
  }

  WithAuthorization.contextType = FirebaseContext;

  WithAuthorization.propTypes = {
    authUser: PropTypes.instanceOf(Object),
    history: PropTypes.instanceOf(Object).isRequired,
    onClearAuthUser: PropTypes.func.isRequired,
  };
  WithAuthorization.defaultProps = { authUser: null };

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  });

  const mapDispatchToProps = (dispatch) => ({
    onClearAuthUser: () => dispatch(clearAuthUserAction()),
  });

  return compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(WithAuthorization);
};

export default withAuthorization;
