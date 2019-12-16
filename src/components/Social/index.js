import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { MSG_PROFILE_NO_AGENCY } from '../../constants/messages';

import { setSuccessAction, clearSuccessAction, setErrorAction, clearErrorAction } from '../../actions/core';

import { ReactComponent as FacebookLogo } from '../../assets/svg/Facebook-Icon.svg';
import { ReactComponent as GoogleLogo } from '../../assets/svg/Google.svg';

const SignInGoogleBase = ({ caption, history, onSetError, onClearError }) => {
  const firebase = useContext(FirebaseContext);

  const onSubmit = event => {
    onClearError();

    firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        return firebase.userProvider.doVerifySocialUser(socialAuthUser.user);
      })
      .then(authUserProfile => {
        if (!authUserProfile.agency) {
          firebase.userProvider.doSignOut();
          onSetError(MSG_PROFILE_NO_AGENCY);
        } else {
          history.push(ROUTES.LANDING);
        }
      })
      .catch(err => {
        onSetError(err.message);
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit" className="social-button google text-fundra-black">
        <GoogleLogo className="svg-fill-logo" />
        {`${caption} with Google`}
      </button>
    </form>
  );
};

SignInGoogleBase.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  onSetError: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  caption: PropTypes.string,
};
SignInGoogleBase.defaultProps = { caption: 'Sign In' };

const SignInFacebookBase = ({ caption, history, onSetError, onClearError }) => {
  const firebase = useContext(FirebaseContext);

  const doLinkWithCredential = authInfo => {
    firebase.fetchProvidersForEmail(authInfo.email).then(provider => {
      if (provider[0] === 'google.com') {
        firebase
          .doHiddenSignInWithGoogle(authInfo.email)
          .then(socialAuthUser => {
            socialAuthUser.user.linkWithCredential(authInfo.credential).then(() => {
              return firebase.userProvider.doVerifySocialUser(socialAuthUser.user);
            });
          })
          .then(authUserProfile => {
            if (!authUserProfile.agency) {
              firebase.userProvider.doSignOut();
              onSetError(MSG_PROFILE_NO_AGENCY);
            } else {
              history.push(ROUTES.LANDING);
            }
          })
          .catch(err => {
            onSetError(err.message);
          });
      }
    });
  };

  const onSubmit = event => {
    onClearError();

    firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        return firebase.userProvider.doVerifySocialUser(socialAuthUser.user);
      })
      .then(authUserProfile => {
        if (!authUserProfile.agency) {
          firebase.userProvider.doSignOut();
          onSetError(MSG_PROFILE_NO_AGENCY);
        } else {
          history.push(ROUTES.LANDING);
        }
      })
      .catch(err => {
        if (err.code === 'auth/account-exists-with-different-credential') {
          doLinkWithCredential(err);
        } else {
          onSetError(err.message);
        }
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit" className="social-button facebook text-white">
        <FacebookLogo className="svg-fill-logo" />
        {`${caption} with Facebook`}
      </button>
    </form>
  );
};

SignInFacebookBase.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  onSetError: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  caption: PropTypes.string,
};
SignInFacebookBase.defaultProps = { caption: 'Sign In' };

const mapDispatchToProps = dispatch => ({
  onSetSuccess: message => dispatch(setSuccessAction(message)),
  onClearSuccess: () => dispatch(clearSuccessAction()),
  onSetError: message => dispatch(setErrorAction(message)),
  onClearError: () => dispatch(clearErrorAction()),
});

const SignInGoogle = compose(withRouter, connect(null, mapDispatchToProps))(SignInGoogleBase);

const SignInFacebook = compose(withRouter, connect(null, mapDispatchToProps))(SignInFacebookBase);

export { SignInGoogle, SignInFacebook };
