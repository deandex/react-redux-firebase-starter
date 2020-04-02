import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import routes from '../../routes';

import PageLoader from '../../components/PageLoader';

import Header from '../Header';
import Footer from '../Footer';

const Layout = () => {
  return (
    <div className="wrapper">
      <Header />
      <main className="container">
        <React.Suspense fallback={<PageLoader />}>
          <Switch>
            {routes.map((route) => {
              return route.component ? (
                <Route
                  key={route.key}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={() => <route.component />}
                />
              ) : null;
            })}
            <Redirect to="/" />
          </Switch>
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
