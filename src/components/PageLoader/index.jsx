import React, { useEffect } from 'react';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

const PageLoader = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return <div />;
};

export default PageLoader;
