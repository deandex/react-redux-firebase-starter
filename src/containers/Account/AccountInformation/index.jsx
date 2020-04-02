import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spinner } from 'react-bootstrap';

import { FirebaseContext } from '../../../hoc/Firebase';

import { clearSuccessAction, clearErrorAction } from '../../../services/core/actions';
import { updateProfileAction } from '../../../services/user/actions';

import SEO from '../../../components/Seo';
import { UploadUI } from '../../../components/UI';

import ImagePhoto from '../../../assets/svg/Media_Icon.svg';

const AccountInformation = ({ authUser, onClearSuccess, onClearError, error, success, updateProfile }) => {
  const [state, setState] = useState({
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
    location: authUser.location,
    jobTitle: authUser.jobTitle,
    avatar: null,
    avatarPreview: authUser.avatar || null,
    photo: authUser.photo || ImagePhoto,
    btnText: 'Save',
  });

  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    onClearSuccess();
    onClearError();
  }, [onClearSuccess, onClearError]);

  const handleFileChange = event => {
    const { name } = event.target;
    const imgFile = event.target.files[0];
    const previewImg = `${name}Preview`;

    setState(prevState => ({
      ...prevState,
      [name]: imgFile,
      [previewImg]: URL.createObjectURL(imgFile),
    }));
  };

  const handleOnSubmit = event => {
    setState(prevState => ({ ...prevState, btnText: 'Please wait...' }));
    const formData = {
      uid: authUser.uid,
      firstName: state.firstName,
      lastName: state.lastName,
      location: state.location,
      jobTitle: state.jobTitle,
      avatar: state.avatar,
      prevAvatar: authUser.avatar,
    };

    updateProfile(formData, firebase).then(() => {
      setState(prevState => ({ ...prevState, btnText: 'Save' }));
    });

    event.preventDefault();
  };

  const handleOnChange = event => {
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSignOut = () => {
    firebase.userProvider.doSignOut();
  };

  const memoizeAvatarSrc = useMemo(() => (!state.avatarPreview && state.photo ? state.photo : state.avatarPreview), [
    state.avatarPreview,
    state.photo,
  ]);

  const isInvalid =
    state.firstName === '' || state.lastName === '' || state.email === '' || state.btnText === 'Please wait...';

  return (
    <>
      <SEO title="Account Information" />
      <form action="submit-account-information" className="text-left" onSubmit={handleOnSubmit}>
        <UploadUI name="avatar" containerClass="mb-3" onChange={handleFileChange} imageSrc={memoizeAvatarSrc} />
        <div className="form-group">
          <label htmlFor="email">
            Email Address
            <span className="required">*</span>
          </label>
          <input
            className="form-control"
            id="email"
            name="email"
            value={state.email}
            type="email"
            placeholder="Enter your email address"
            readOnly
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="firstName">
              First Name
              <span className="required">*</span>
            </label>
            <input
              className="form-control"
              id="firstName"
              name="firstName"
              value={state.firstName}
              onChange={handleOnChange}
              type="text"
              placeholder="Enter your first name"
              autoComplete="given-name"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="lastName">
              Last Name
              <span className="required">*</span>
            </label>
            <input
              className="form-control"
              id="lastName"
              name="lastName"
              value={state.lastName}
              onChange={handleOnChange}
              type="text"
              placeholder="Enter your last name"
              autoComplete="family-name"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            className="form-control"
            id="jobTitle"
            name="jobTitle"
            value={state.jobTitle}
            onChange={handleOnChange}
            type="text"
            placeholder="Enter your job title"
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
        <div className="form-footer-note no-pad pt-2">
          <span className="text-deansoft-secondary-danger">* Required fields</span>
        </div>
        <div className="d-flex justify-content-between pt-4">
          <div className="w-35">
            <button
              type="submit"
              disabled={isInvalid}
              className="submit-button text-white btn-deansoft-primary text-decoration-none"
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
          </div>
          <button
            type="button"
            onClick={!isInvalid ? handleSignOut : null}
            className="btn btn-link text-decoration-none text-danger font-weight-bold"
          >
            Log out
          </button>
        </div>
      </form>
    </>
  );
};

AccountInformation.propTypes = {
  onClearSuccess: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  authUser: PropTypes.instanceOf(Object).isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};
AccountInformation.defaultProps = { error: null, success: null };

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
      updateProfile: updateProfileAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AccountInformation);
