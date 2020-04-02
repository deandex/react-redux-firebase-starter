import React from 'react';

import * as ROUTES_PATH from './global/routes';

const Landing = React.lazy(() => import('./pages/Landing'));
const Account = React.lazy(() => import('./pages/Account'));

const routes = [
  { key: 'route-home', path: ROUTES_PATH.LANDING, exact: true, name: 'Home', component: Landing },
  { key: 'route-account', path: ROUTES_PATH.ACCOUNT, exact: true, name: 'Account', component: Account },
  {
    key: 'route-account-change-password',
    path: ROUTES_PATH.ACCOUNT_CHANGE_PASSWORD,
    name: 'Account Change Password',
    component: Account,
  },
];

export default routes;
