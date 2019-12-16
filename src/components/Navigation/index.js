import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Nav } from 'react-bootstrap';

import * as routes from '../../constants/routes';
import { FirebaseContext } from '../Firebase';

import DeansoftLogo from '../../assets/images/logo.png';
import SearchIcon from '../../assets/svg/search-slim.svg';
import NotificationIcon from '../../assets/svg/notifications-outline.svg';
import CheveronDownIcon from '../../assets/svg/cheveron-down.svg';

const Navigation = ({ authUser }) => (authUser ? <NavigationAuth authUser={authUser} /> : null);

Navigation.propTypes = { authUser: PropTypes.instanceOf(Object) };
Navigation.defaultProps = { authUser: null };

class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    const { onClick } = this.props;
    onClick(e);
  }

  render() {
    const { children } = this.props;

    return (
      <a href="#dropdown-toggle" className="nav-link pr-0" onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

CustomToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

const NavigationAuth = ({ authUser }) => {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const { displayName, firstName, lastName, photo, avatar } = authUser;
  const firstInitial = firstName.substring(0, 1);
  const lastInitial = lastName.substring(0, 1);
  let userPhoto = avatar || null;

  if (!userPhoto && photo) {
    userPhoto = photo;
  }

  const handleSignOut = () => {
    firebase.userProvider.doSignOut();
  };

  const handleRedirect = selectedKey => {
    history.push(selectedKey);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white navbar-top fixed-top">
      <Link className="navbar-brand" to={routes.LANDING}>
        <img src={DeansoftLogo} alt="Logo" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item align-self-center">
            <a className="nav-link nav-icon" href="#link">
              <img src={SearchIcon} alt="Search" />
            </a>
          </li>
          <li className="nav-item align-self-center">
            <a className="nav-link nav-icon" href="#link">
              <img src={NotificationIcon} alt="Notification" />
            </a>
          </li>
          <Dropdown as="li" className="nav-item nav-profile-menu" navbar alignRight>
            <Dropdown.Toggle id="dropdown-no-caret" as={CustomToggle}>
              <div className="d-flex align-items-center">
                {userPhoto ? (
                  <div className="user-avatar">
                    <div className="profile-image" style={{ backgroundImage: `url("${userPhoto}")` }} />
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center user-initial">
                    <span>{`${firstInitial}${lastInitial}`}</span>
                  </div>
                )}
                <div className="label-name">{displayName}</div>
                <img src={CheveronDownIcon} alt="" className="caret" />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="#test" onSelect={handleRedirect}>
                Donor Management
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey={routes.ACCOUNT} onSelect={handleRedirect}>
                My Account
              </Dropdown.Item>
              <Dropdown.Item onClick={handleSignOut} className="danger">
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
      </div>
    </nav>
  );
};

NavigationAuth.propTypes = { authUser: PropTypes.instanceOf(Object).isRequired };

const AccountNav = () => {
  const { path } = useRouteMatch();
  const history = useHistory();

  const handleOnSelect = selectedKey => {
    history.push(selectedKey);
  };

  return (
    <Nav fill activeKey={path} onSelect={handleOnSelect} className="page-navbar">
      <Nav.Item>
        <Nav.Link eventKey={routes.ACCOUNT}>My Account</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="#test">Test</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);

export { AccountNav };
