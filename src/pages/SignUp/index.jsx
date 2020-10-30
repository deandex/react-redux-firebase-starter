import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as ROUTES from '../../global/routes';
import { MSG_REGISTER_SUCCESS } from '../../global/messages';
import { FirebaseContext } from '../../hoc/Firebase';

import { setSuccessAction, clearSuccessAction, setErrorAction, clearErrorAction } from '../../services/core/actions';

import SEO from '../../components/Seo';
import TopLogo from '../../components/TopLogo';
import { SignInGoogle, SignInFacebook } from '../../components/Social';

const SignUpPage = () => (
  <>
    <SEO title="Signup" />
    <div className="login-container w-50 mx-auto text-center">
      <TopLogo />
      <div className="login-header mt-4">
        <h1>Get Started</h1>
        <div className="login-note text-deansoft-secondary">Just one minute away from experiencing This App!</div>
      </div>
      <div className="login-form">
        <SignUpForm />
        <SignInLink />
        <div className="social-login mt-5">
          <SignInFacebook caption="Sign Up" />
          <SignInGoogle caption="Sign Up" />
        </div>
      </div>
    </div>
  </>
);

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  passwordOne: '',
  passwordTwo: '',
  btnText: 'Sign Up',
};

class SignUpFormBase extends Component {
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
    const firebase = this.context;
    const { firstName, lastName, email, phone, passwordOne } = this.state;
    const { onSetSuccess, onClearSuccess, onSetError, onClearError } = this.props;

    onClearSuccess();
    onClearError();
    this.setState({ btnText: 'Please wait...' });

    const formData = { firstName, lastName, email, phone };

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return firebase.userProvider.doRegisterNewUser(authUser.user.uid, formData);
      })
      .then(() => {
        firebase.userProvider.doSignOut();
        this.setState({ ...INITIAL_STATE });
        onSetSuccess(MSG_REGISTER_SUCCESS);

        setTimeout(() => {
          document.location = ROUTES.SIGN_IN;
        }, 5000);
      })
      .catch(error => {
        firebase.userProvider.doSignOut();

        this.setState({ btnText: 'Sign Up' });
        onSetError(error.message);
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  validatePassword = event => {
    const confirmField = event.target;
    const { passwordOne } = this.state;

    if (passwordOne !== confirmField.value) {
      confirmField.setCustomValidity("Passwords Don't Match");
    } else {
      confirmField.setCustomValidity('');
    }
  };

  render() {
    const { error, success } = this.props;
    const { firstName, lastName, email, phone, passwordOne, passwordTwo, btnText } = this.state;
    const isInvalid =
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      passwordOne === '' ||
      passwordTwo === '' ||
      btnText === 'Please wait...';

    return (
      <form action="submit-signup" className="text-left" onSubmit={this.onSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="firstName">First Name</label>
            <input
              className="form-control"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={this.onChange}
              type="text"
              placeholder="Enter your first name"
              autoComplete="given-name"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="lastName">Last Name</label>
            <input
              className="form-control"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={this.onChange}
              type="text"
              placeholder="Enter your last name"
              autoComplete="family-name"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={this.onChange}
            type="email"
            placeholder="Enter your email address"
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            className="form-control"
            id="phone"
            name="phone"
            value={phone}
            onChange={this.onChange}
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordOne">Password</label>
          <input
            className="form-control"
            id="passwordOne"
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="******************"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordTwo">Confirm Password</label>
          <input
            className="form-control"
            id="passwordTwo"
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            onKeyUp={this.validatePassword}
            type="password"
            placeholder="******************"
            autoComplete="new-password"
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
          type="submit"
          disabled={isInvalid}
          className="submit-button auth-button text-white btn-deansoft-primary text-decoration-none mt-4"
        >
          {btnText}
        </button>
      </form>
    );
  }
}

SignUpFormBase.contextType = FirebaseContext;
SignUpFormBase.propTypes = {
  onSetSuccess: PropTypes.func.isRequired,
  onClearSuccess: PropTypes.func.isRequired,
  onSetError: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};
SignUpFormBase.defaultProps = { error: null, success: null };

const SignUpLink = () => (
  <p className="mt-3 sign-up">
    Don&rsquo;t have an account?
    <Link className="text-deansoft-secondary-black ml-1" to={ROUTES.SIGN_UP}>
      Register
    </Link>
  </p>
);

const SignInLink = () => (
  <p className="mt-3 sign-up">
    Already have an account?
    <Link className="text-deansoft-secondary-black ml-1" to={ROUTES.SIGN_IN}>
      Sign In
    </Link>
  </p>
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

const SignUpForm = connect(mapStateToProps, mapDispatchToProps)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
