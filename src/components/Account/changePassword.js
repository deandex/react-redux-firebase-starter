import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spinner } from 'react-bootstrap';

import { FirebaseContext } from '../Firebase';

import { clearSuccessAction, clearErrorAction } from '../../actions/core';
import { updatePasswordAction } from '../../actions/profile';

import SEO from '../Seo';

const ChangePassword = ({ authUser, onClearSuccess, onClearError, updatePassword, error, success }) => {
  const [state, setState] = useState({
    email: authUser.email,
    currentPassword: '',
    password: '',
    confirmPassword: '',
    btnText: 'Change Password',
  });

  const firebase = useContext(FirebaseContext);
  const showCurrentPassword = authUser.providerData.findIndex(provider => provider.providerId === 'password') !== -1;

  useEffect(() => {
    onClearSuccess();
    onClearError();
  }, [onClearSuccess, onClearError]);

  const handleOnSubmit = event => {
    setState(prevState => ({ ...prevState, btnText: 'Please wait...' }));
    const formData = {
      uid: authUser.uid,
      email: state.email,
      currentPassword: state.currentPassword,
      password: state.password,
      linkPasswordProvider: !showCurrentPassword,
    };

    updatePassword(formData, firebase).then(result => {
      if (result && result.type === 'ERROR_SET') {
        setState(prevState => ({ ...prevState, btnText: 'Change Password' }));
      } else {
        setState(prevState => ({
          ...prevState,
          currentPassword: '',
          password: '',
          confirmPassword: '',
          btnText: 'Change Password',
        }));
      }
    });

    event.preventDefault();
  };

  const handleOnChange = event => {
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const validatePassword = event => {
    const confirmField = event.target;

    if (state.password !== confirmField.value) {
      confirmField.setCustomValidity("Passwords Don't Match");
    } else {
      confirmField.setCustomValidity('');
    }
  };

  const isInvalid = state.password === '' || state.confirmPassword === '' || state.btnText === 'Please wait...';

  return (
    <>
      <SEO title="Change Password" />
      <form action="submit-change-password" className="text-left" onSubmit={handleOnSubmit}>
        <input type="hidden" autoComplete="email" value={state.email} />
        {showCurrentPassword ? (
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              className="form-control"
              id="currentPassword"
              name="currentPassword"
              value={state.currentPassword}
              onChange={handleOnChange}
              type="password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
            />
          </div>
        ) : null}
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            className="form-control"
            id="password"
            name="password"
            value={state.password}
            onChange={handleOnChange}
            type="password"
            placeholder="Enter your new password"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleOnChange}
            onKeyUp={validatePassword}
            type="password"
            placeholder="Confirm your new password"
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
          className="submit-button text-white btn-fundra-primary text-decoration-none mt-4"
        >
          {isInvalid && state.btnText === 'Please wait...' ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              Updating...
            </>
          ) : (
            state.btnText
          )}
        </button>
      </form>
    </>
  );
};

ChangePassword.propTypes = {
  onClearSuccess: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  authUser: PropTypes.instanceOf(Object).isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};
ChangePassword.defaultProps = { error: null, success: null };

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  error: state.coreState.error,
  success: state.coreState.success,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onClearSuccess: clearSuccessAction,
      onClearError: clearErrorAction,
      updatePassword: updatePasswordAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
