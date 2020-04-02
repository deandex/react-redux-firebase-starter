import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { compose } from 'recompose';
import { Nav } from 'react-bootstrap';

import * as ROUTES from '../../global/routes';
import { withAuthorization, withEmailVerification } from '../../hoc/Session';

import { AccountNav } from '../../containers/Header';
import AccountInformation from '../../containers/Account/AccountInformation';
import ChangePassword from '../../containers/Account/ChangePassword';

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
            <Nav.Link eventKey={ROUTES.ACCOUNT}>Contact information</Nav.Link>
            <Nav.Link eventKey={ROUTES.ACCOUNT_CHANGE_PASSWORD}>Change password</Nav.Link>
          </Nav>
        </div>
        <div className="w-40 p-4">
          <Switch>
            <Route exact path={ROUTES.ACCOUNT}>
              <AccountInformation />
            </Route>
            <Route path={ROUTES.ACCOUNT_CHANGE_PASSWORD}>
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
      <div className="d-flex align-items-center mt-3 mb-4 account-info">
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
