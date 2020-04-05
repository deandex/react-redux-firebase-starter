import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';

import * as ROUTES from '../../global/routes';
import { FirebaseContext } from '../../hoc/Firebase';

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

  handleMouseEnter = () => {
    document.getElementById('user-label-name').classList.add('hover');
  };

  handleMouseLeave = () => {
    document.getElementById('user-label-name').classList.remove('hover');
  };

  handleClick(e) {
    e.preventDefault();

    const { onClick } = this.props;
    onClick(e);
  }

  render() {
    const { children } = this.props;

    return (
      <a
        href="#dropdown-toggle"
        className="nav-link pr-0"
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
      </a>
    );
  }
}

CustomToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

const CustomNavBrand = ({ children }) => {
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();

    history.push(ROUTES.LANDING);
  };

  return (
    <a href="#home" className="navbar-brand" onClick={handleClick}>
      {children}
    </a>
  );
};

CustomNavBrand.propTypes = {
  children: PropTypes.element.isRequired,
};

const NavigationAuth = ({ authUser }) => {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const { displayName, firstName, lastName, photo, avatar, agency } = authUser;
  const firstInitial = firstName.substring(0, 1);
  const lastInitial = lastName.substring(0, 1);
  const agencyLogo = agency && agency.img && agency.img.logo ? agency.img.logo : null;
  let userPhoto = avatar || null;

  if (!userPhoto && photo) {
    userPhoto = photo;
  }

  const handleSignOut = () => {
    firebase.userProvider.doSignOut();
  };

  const handleRedirect = (selectedKey) => {
    history.push(selectedKey);
  };

  return (
    <Navbar expand="lg" bg="white" variant="light" fixed="top" className="navbar-top" collapseOnSelect>
      <Navbar.Brand as={CustomNavBrand}>
        {agencyLogo ? (
          <div className="d-flex align-items-center">
            <div className="brand-logo" style={{ backgroundImage: `url("${agencyLogo}")` }} />
            <div className="brand-name text-deansoft-base d-none d-md-block">{agency.name}</div>
          </div>
        ) : (
          <img src={DeansoftLogo} alt="Logo" />
        )}
      </Navbar.Brand>
      <Nav className="ml-auto d-md-none flex-row">
        <Nav.Item className="align-self-center">
          <Nav.Link href="#link" className="nav-icon">
            <img src={SearchIcon} alt="Search" />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="align-self-center">
          <Nav.Link href="#link" className="nav-icon">
            <img src={NotificationIcon} alt="Notification" />
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Navbar.Toggle aria-controls="top-navbar-nav" />
      <Navbar.Collapse id="top-navbar-nav">
        <Nav className="ml-auto">
          <div className="d-md-none">
            <Nav.Link eventKey={ROUTES.ACCOUNT} onSelect={handleRedirect}>
              My Account
            </Nav.Link>
            <Nav.Link onClick={handleSignOut} className="text-danger">
              Sign Out
            </Nav.Link>
          </div>
          <div className="d-none d-md-flex">
            <Nav.Item className="align-self-center">
              <Nav.Link href="#link" className="nav-icon">
                <img src={SearchIcon} alt="Search" />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="align-self-center">
              <Nav.Link href="#link" className="nav-icon">
                <img src={NotificationIcon} alt="Notification" />
              </Nav.Link>
            </Nav.Item>
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
                  <div id="user-label-name" className="label-name">
                    {displayName}
                  </div>
                  <img src={CheveronDownIcon} alt="" className="caret" />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey={ROUTES.ACCOUNT} active={false} onSelect={handleRedirect}>
                  My Account
                </Dropdown.Item>
                <Dropdown.Item onClick={handleSignOut} className="danger">
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavigationAuth.propTypes = { authUser: PropTypes.instanceOf(Object).isRequired };

const AccountNav = () => {
  const { path } = useRouteMatch();
  const history = useHistory();

  const handleOnSelect = (selectedKey) => {
    history.push(selectedKey);
  };

  const activeKeyNav = path.indexOf('account') !== -1 ? ROUTES.ACCOUNT : '';

  return (
    <Nav fill activeKey={activeKeyNav} onSelect={handleOnSelect} className="page-navbar">
      <Nav.Item>
        <Nav.Link eventKey={ROUTES.ACCOUNT}>My Account</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);

export { AccountNav };
