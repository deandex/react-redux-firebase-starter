import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as ROUTES from '../../constants/routes';
import { MSG_RESET_PWD_SUCCESS } from '../../constants/messages';
import { FirebaseContext } from '../Firebase';

import { setSuccessAction, clearSuccessAction, setErrorAction, clearErrorAction } from '../../actions/core';

import SEO from '../Seo';
import { SignUpLink } from '../SignUp';
import { SignInFacebook, SignInGoogle } from '../Social';

import DeansoftLogo from '../../assets/images/logo.png';

const PasswordForgetPage = () => (
  <>
    <SEO title="Forgot Password" />
    <div className="login-container w-75 mx-auto text-center">
      <img src={DeansoftLogo} className="login-logo" alt="" />
      <div className="login-header mt-4">
        <h1>Forgot Password</h1>
        <div className="login-note text-fundra-secondary">
          Enter your email below and we will send you a magic link to reset your password.
        </div>
      </div>
      <div className="login-form">
        <PasswordForgetForm />
        <SignUpLink />
        <div className="social-login mt-5">
          <SignInFacebook />
          <SignInGoogle />
        </div>
      </div>
    </div>
  </>
);

const INITIAL_STATE = {
  email: '',
  btnText: 'Reset Password',
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { onClearError, onClearSuccess } = this.props;
    onClearSuccess();
    onClearError();
  }

  onSubmit = event => {
    const { email } = this.state;
    const { onSetError, onSetSuccess, onClearError, onClearSuccess } = this.props;
    const firebase = this.context;

    onClearError();
    onClearSuccess();

    this.setState({ btnText: 'Please wait...' });

    firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        onSetSuccess(MSG_RESET_PWD_SUCCESS);
      })
      .catch(error => {
        onSetError(error.message);
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, btnText } = this.state;
    const { error, success } = this.props;

    const isInvalid = email === '' || btnText === 'Please wait...';

    return (
      <form action="submit-forgot-password" className="text-left" onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="email"
            className="form-control"
            placeholder="Enter your email address"
            autoComplete="email"
            required
          />
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
        <button
          disabled={isInvalid}
          type="submit"
          className="submit-button auth-button text-white btn-fundra-primary text-decoration-none mt-4"
        >
          {btnText}
        </button>
      </form>
    );
  }
}

PasswordForgetFormBase.contextType = FirebaseContext;

PasswordForgetFormBase.propTypes = {
  onSetSuccess: PropTypes.func.isRequired,
  onClearSuccess: PropTypes.func.isRequired,
  onSetError: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};

PasswordForgetFormBase.defaultProps = { error: null, success: null };

const PasswordForgetLink = () => (
  <Link className="forgot-link text-fundra-secondary-black" to={ROUTES.PASSWORD_FORGET}>
    Forgot your password?
  </Link>
);

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

const PasswordForgetForm = connect(mapStateToProps, mapDispatchToProps)(PasswordForgetFormBase);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
