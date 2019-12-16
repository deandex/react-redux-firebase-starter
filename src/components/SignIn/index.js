import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import { MSG_PROFILE_NO_AGENCY } from '../../constants/messages';
import { FirebaseContext } from '../Firebase';

import { setSuccessAction, clearSuccessAction, setErrorAction, clearErrorAction } from '../../actions/core';

import SEO from '../Seo';
import { SignInGoogle, SignInFacebook } from '../Social';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

import { ReactComponent as FundraLogo } from '../../assets/svg/logo-Fundra.svg';

const SignInPage = () => (
  <>
    <SEO title="Signin" />
    <div className="login-container w-50 mx-auto text-center">
      <FundraLogo className="login-logo" />
      <div className="login-header mt-4">
        <h1>Welcome back</h1>
        <div className="login-note text-fundra-secondary">Just one minute away from experiencing Fundra!</div>
      </div>
      <div className="login-form">
        <div className="social-login">
          <SignInFacebook />
          <SignInGoogle />
        </div>
        <div className="heading-with-line small">
          <h2>Sign In With Email</h2>
        </div>
        <SignInForm />
        <SignUpLink />
      </div>
    </div>
  </>
);

const SignInFormBase = ({ history, onSetSuccess, onClearSuccess, onSetError, onClearError, success, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [isSendActivationEmail, setIsSendActivationEmail] = useState(false);
  const [btnText, setBtnText] = useState('Sign In');

  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    onClearSuccess();
    onClearError();
  }, [onClearSuccess, onClearError]);

  const handleErrorSignIn = err => {
    onSetError(err);
    setBtnText('Sign In');
  };

  const doResetForm = () => {
    setEmail('');
    setPassword('');
    setBtnText('Sign In');
  };

  const onSubmit = event => {
    onClearSuccess();
    onClearError();
    setIsSendActivationEmail(false);
    setBtnText('Please wait...');

    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        return firebase.userProvider.doVerifyAuthUser(authUser.user);
      })
      .then(authUserProfile => {
        if (!authUserProfile.emailVerified) {
          firebase.userProvider.doSignOut();
          setProfile({
            emailVerified: authUserProfile.emailVerified,
            email: authUserProfile.email,
            social: authUserProfile.social,
            token: authUserProfile.token,
            uid: authUserProfile.uid,
            firstName: authUserProfile.firstName,
          });
          setIsSendActivationEmail(true);
          doResetForm();
        } else if (!authUserProfile.agency) {
          firebase.userProvider.doSignOut();
          doResetForm();
          onSetError(MSG_PROFILE_NO_AGENCY);
        } else {
          history.push(ROUTES.LANDING);
        }
      })
      .catch(err => {
        firebase.userProvider.doSignOut();
        handleErrorSignIn(err.message);
      });

    event.preventDefault();
  };

  const onSendActivationEmail = () => {
    setIsSendActivationEmail(false);
    firebase.userProvider.doRegisterToken(profile.uid).then(({ token }) => {
      const profileData = { ...profile, token };
      firebase.userProvider.doSendVerify(profileData).then(() => {
        onSetSuccess('Email sent successfully! Please verify your email');
      });
    });
  };

  const isInvalid = password === '' || email === '' || btnText === 'Please wait...';

  return (
    <form action="submit-login" className="text-left" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          className="form-control"
          id="email"
          name="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          required
        />
      </div>
      <div className="form-group last">
        <label htmlFor="password">Password</label>
        <input
          className="form-control"
          id="password"
          name="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          type="password"
          placeholder="******************"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="text-right">
        <PasswordForgetLink />
      </div>
      {success && (
        <div className="mt-3 mb-0 alert alert-success text-center" role="alert">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-3 mb-0 alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      {isSendActivationEmail ? (
        <div className="mt-3 mb-0 alert alert-danger text-center" role="alert">
          {`Please verify your email address\nor click `}
          <a href="#resend-activation-link" onClick={onSendActivationEmail}>
            here
          </a>
          &nbsp; to resend email activation link
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isInvalid}
        className="submit-button auth-button text-white btn-fundra-primary text-decoration-none mt-4"
      >
        {btnText}
      </button>
    </form>
  );
};

SignInFormBase.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  onSetSuccess: PropTypes.func.isRequired,
  onClearSuccess: PropTypes.func.isRequired,
  onSetError: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};

SignInFormBase.defaultProps = { error: null, success: null };

const mapStateToProps = state => ({
  error: state.coreState.error,
  success: state.coreState.success,
});

const mapDispatchToProps = dispatch => ({
  onSetSuccess: message => dispatch(setSuccessAction(message)),
  onClearSuccess: () => dispatch(clearSuccessAction()),
  onSetError: message => dispatch(setErrorAction(message)),
  onClearError: () => dispatch(clearErrorAction()),
});

const SignInForm = compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignInFormBase);

export default SignInPage;

export { SignInForm };
