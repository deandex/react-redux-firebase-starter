import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import * as ROUTES from '../../global/routes';
import { FIREBASE_API_URL } from '../../global/environment';
import { DateTimeUtils, HttpUtils } from '../../utils';
import { FirebaseContext } from '../../hoc/Firebase';
import { withAuthorization, withEmailVerification } from '../../hoc/Session';

import SEO from '../../components/Seo';

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

const PLAN_SETTING = {
  goalSetting: true,
  programBudgeting: true,
  grantManagement: true,
  scenarioAnalysis: true,
  campaignManagement: true,
  crmManagement: true,
  annualReporting: true,
  impactAnalysis: true,
  financialAnalysis: true,
};

const Landing = ({ authUser }) => {
  const [quote, setQuote] = useState('');
  const [planSetting] = useState(PLAN_SETTING);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    let hasCanceled = false;
    let userToken = authUser.idToken;
    let counter = 0;

    const doRepeat = () => {
      counter += 1;
      firebase.getFreshToken().then((idToken) => {
        userToken = idToken;
        // eslint-disable-next-line no-use-before-define
        doRequest();
      });
    };

    const doRequest = () => {
      if (userToken && quote === '') {
        const axiosConfig = { headers: { Authorization: `Bearer ${userToken}` } };
        const QUOTE_API_URL = `${FIREBASE_API_URL}/v1/quotes`;
        HttpUtils.getRequest(QUOTE_API_URL, axiosConfig)
          .then((res) => {
            if (res.code === 200) {
              if (!hasCanceled) {
                setQuote(res.message);
              }
            }
          })
          .catch((err) => {
            if (err === 'Unauthorized') {
              if (!hasCanceled && counter < 2) {
                doRepeat();
              }
            } else {
              console.log(err);
            }
          });
      }
    };

    doRequest();

    return () => {
      hasCanceled = true;
    };
  }, [authUser.idToken, firebase, quote]);

  return (
    <>
      <SEO title="Dashboard" />
      <div className="main-container">
        <h1 className="mt-2 mb-3">{DateTimeUtils.getHumanizedGreeting(authUser.displayName)}</h1>
        <div className="dashboard-quote">{quote}</div>
        <div className="dashboard-menu">
          <div className="gray-box dashboard-menu-item">
            <div className="menu-item-header">
              <img src={FundraiseHeaderMenuIcon} alt="" />
              <div className="header-title">Plan</div>
            </div>
            <div className="row menu-item-body plan-business">
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.goalSetting}>
                  <>
                    <img src={BaseSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Goal Setting</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} useAnchor disabled={!planSetting.programBudgeting}>
                  <>
                    <img src={SponsorshipSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Program Budgeting</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.scenarioAnalysis}>
                  <>
                    <img src={AlloSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Scenario Analysis</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
            </div>
          </div>
          <div className="gray-box dashboard-menu-item">
            <div className="menu-item-header">
              <img src={FundsHeaderMenuIcon} alt="" />
              <div className="header-title">Fund</div>
            </div>
            <div className="row menu-item-body fundraise-business">
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.campaignManagement}>
                  <>
                    <img src={MetricsSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Campaign Management</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.grantManagement}>
                  <>
                    <img src={ProfileSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Grant Management</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.crmManagement}>
                  <>
                    <img src={DonorsSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">CRM</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
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
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.annualReporting}>
                  <>
                    <img src={VarianceSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Annual Reporting</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.impactAnalysis}>
                  <>
                    <img src={ReportSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Impact Analysis</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
              <div className="col-md-3 item-menu-icon">
                <SubscriptionLink to={ROUTES.LANDING} disabled={!planSetting.financialAnalysis}>
                  <>
                    <img src={OprSubMenuIcon} alt="" className="menu-icon" />
                    <div className="menu-title">Financial Analysis</div>
                    <img src={CheveronRightIcon} alt="" className="icon-next" />
                  </>
                </SubscriptionLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SubscriptionLink = ({ to, children, useAnchor, disabled }) => {
  let customLink = (
    <>
      <div className="overlay-upgrade" />
      <div className="disabled-link">{children}</div>
    </>
  );

  if (!disabled) {
    customLink = useAnchor ? <a href={to}>{children}</a> : <Link to={to}>{children}</Link>;
  }

  return customLink;
};

SubscriptionLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  useAnchor: PropTypes.bool,
  disabled: PropTypes.bool,
};
SubscriptionLink.defaultProps = { useAnchor: false, disabled: false };

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

const condition = (authUser) => !!authUser;

Landing.propTypes = { authUser: PropTypes.instanceOf(Object) };
Landing.defaultProps = { authUser: null };

export default compose(connect(mapStateToProps), withEmailVerification, withAuthorization(condition))(Landing);
