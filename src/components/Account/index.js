import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { compose } from 'recompose';
import { Nav } from 'react-bootstrap';

import * as routes from '../../constants/routes';
import { withAuthorization, withEmailVerification } from '../Session';

import { AccountNav } from '../Navigation';
import AccountInformation from './accountInformation';
import ChangePassword from './changePassword';

const AccountPage = () => {
  const history = useHistory();
  const routeLocation = useLocation();

  const handleNavSelect = selectedKey => {
    history.push(selectedKey);
  };

  return (
    <div className="main-container">
      <AccountPageHeader />
      <div className="gray-box d-flex mt-5">
        <div className="w-20 page-left-nav">
          <Nav defaultActiveKey={routeLocation.pathname} onSelect={handleNavSelect} className="flex-column p-2">
            <Nav.Link eventKey={routes.ACCOUNT}>Contact information</Nav.Link>
            <Nav.Link eventKey={routes.ACCOUNT_CHANGE_PASSWORD}>Change password</Nav.Link>
          </Nav>
        </div>
        <div className="w-45 p-4">
          <Switch>
            <Route exact path={routes.ACCOUNT}>
              <AccountInformation />
            </Route>
            <Route path={routes.ACCOUNT_CHANGE_PASSWORD}>
              <ChangePassword />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

const AccountPageHeaderBase = ({ authUser }) => {
  const { displayName, firstName, lastName, photo, avatar, jobTitle } = authUser;
  const firstInitial = firstName.substring(0, 1);
  const lastInitial = lastName.substring(0, 1);
  let userPhoto = avatar || null;

  if (!userPhoto && photo) {
    userPhoto = photo;
  }

  return (
    <>
      <div className="d-flex align-items-center my-4 account-info">
        {userPhoto ? (
          <div className="user-avatar">
            <div className="profile-image" style={{ backgroundImage: `url("${userPhoto}")` }} />
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center user-initial">
            <span>{`${firstInitial}${lastInitial}`}</span>
          </div>
        )}
        <div className="align-self-stretch d-flex flex-column justify-content-center">
          <div className="profile-name">{displayName}</div>
          <div className="profile-location">{jobTitle}</div>
        </div>
      </div>
      <AccountNav />
    </>
  );
};

AccountPageHeaderBase.propTypes = {
  authUser: PropTypes.instanceOf(Object),
};
AccountPageHeaderBase.defaultProps = { authUser: null };

const mapStateToProps = state => ({ authUser: state.sessionState.authUser });

const condition = authUser => !!authUser;

const AccountPageHeader = connect(mapStateToProps)(AccountPageHeaderBase);

export default compose(withEmailVerification, withAuthorization(condition))(AccountPage);

export { AccountPageHeader };
