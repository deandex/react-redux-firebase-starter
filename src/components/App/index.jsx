import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import * as ROUTES from '../../global/routes';

import ErrorBoundary from '../ErrorBoundary';
import PageLoader from '../PageLoader';
import ScrollToTop from '../ScrollToTop';

import { withAuthentication } from '../../hoc/Session';

import '../../assets/scss/app.scss';

// Containers
const DefaultLayout = React.lazy(() => import('../../containers/Layout'));

// Pages
const SignIn = React.lazy(() => import('../../pages/SignIn'));
const SingUp = React.lazy(() => import('../../pages/SignUp'));
const ForgotPassword = React.lazy(() => import('../../pages/PasswordForget'));

const App = () => (
  <Router>
    <ScrollToTop />
    <ErrorBoundary>
      <React.Suspense fallback={<PageLoader />}>
        <Switch>
          <Route exact path={ROUTES.SIGN_IN} name="Login Page" component={SignIn} />
          <Route exact path={ROUTES.SIGN_UP} name="Register Page" component={SingUp} />
          <Route exact path={ROUTES.PASSWORD_FORGET} name="Forgot Password Page" component={ForgotPassword} />
          <Route path={ROUTES.LANDING} name="Home" component={DefaultLayout} />
        </Switch>
      </React.Suspense>
    </ErrorBoundary>
  </Router>
);

export default withAuthentication(App);
