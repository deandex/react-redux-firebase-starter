import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import * as routes from '../../constants/routes';
import { DateTimeHelper } from '../../helpers';
import { withAuthorization, withEmailVerification } from '../Session';

import SEO from '../Seo';

import CheveronRightIcon from '../../assets/svg/cheveron-right.svg';
import FundraiseHeaderMenuIcon from '../../assets/svg/Fundraise-Header-Menu.svg';
import BaseSubMenuIcon from '../../assets/svg/Base-Sub-Menu.svg';
import SponsorshipSubMenuIcon from '../../assets/svg/Sponsorship-Sub-Menu.svg';
import AlloSubMenuIcon from '../../assets/svg/Allo-Sub-Menu.svg';
import AnalyzeHeaderMenuIcon from '../../assets/svg/Analyze-Header-Menu.svg';
import VarianceSubMenuIcon from '../../assets/svg/Variance-Sub-Menu.svg';
import ReportSubMenuIcon from '../../assets/svg/Report-Sub-Menu.svg';
import OprSubMenuIcon from '../../assets/svg/Opr-Sub-Menu.svg';
import FundsHeaderMenuIcon from '../../assets/svg/Funds-Header-Menu.svg';
import MetricsSubMenuIcon from '../../assets/svg/Metrics-Sub-Menu.svg';
import ProfileSubMenuIcon from '../../assets/svg/Profile-Sub-Menu.svg';
import DonorsSubMenuIcon from '../../assets/svg/Donors-Sub-Menu.svg';

const Landing = ({ authUser }) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const QUOTE_API_URL = `${process.env.REACT_APP_MAIN_WEB_URL}/api/quotes.php`;
    axios
      .get(QUOTE_API_URL)
      .then(res => {
        if (res.data.code === 200) {
          setQuote(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <SEO title="Dashboard" />
      <div className="main-container">
        <h1 className="mt-4 mb-3">{DateTimeHelper.getHumanizedGreeting(authUser.displayName)}</h1>
        <div className="dashboard-quote">{quote}</div>
        <div className="dashboard-menu">
          <div className="gray-box dashboard-menu-item">
            <div className="menu-item-header">
              <img src={FundraiseHeaderMenuIcon} alt="" />
              <div className="header-title">Plan</div>
            </div>
            <div className="row menu-item-body plan-business">
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.LANDING}>
                  <img src={BaseSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Program Budgeting</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.LANDING}>
                  <img src={SponsorshipSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Grant Budgeting</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.LANDING}>
                  <img src={AlloSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Scenario Analysis</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
            </div>
          </div>
          <div className="gray-box dashboard-menu-item">
            <div className="menu-item-header">
              <img src={FundsHeaderMenuIcon} alt="" />
              <div className="header-title">Fundraise</div>
            </div>
            <div className="row menu-item-body fundraise-business">
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.CAMPAIGNS}>
                  <img src={MetricsSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Campaigns Management</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.ACCOUNT}>
                  <img src={ProfileSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Profile Management</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.DONORS}>
                  <img src={DonorsSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Donors Management</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
            </div>
          </div>
          <div className="gray-box dashboard-menu-item need-upgrade">
            <div className="overlay-upgrade" />
            <div className="menu-item-header">
              <img src={AnalyzeHeaderMenuIcon} alt="" />
              <div className="header-title">Analyze</div>
            </div>
            <div className="row menu-item-body analyze-business">
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.LANDING}>
                  <img src={VarianceSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Variance Reporting</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.LANDING}>
                  <img src={ReportSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Report Sharing</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
              <div className="col-md-3 item-menu-icon">
                <Link to={routes.LANDING}>
                  <img src={OprSubMenuIcon} alt="" className="menu-icon" />
                  <div className="menu-title">Financial Analysis</div>
                  <img src={CheveronRightIcon} alt="" className="icon-next" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

const condition = authUser => !!authUser;

Landing.propTypes = { authUser: PropTypes.instanceOf(Object) };
Landing.defaultProps = { authUser: null };

export default compose(connect(mapStateToProps), withEmailVerification, withAuthorization(condition))(Landing);
