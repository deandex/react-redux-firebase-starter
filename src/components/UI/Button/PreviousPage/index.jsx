import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ReactComponent as CheveronLeftIcon } from '../../../../assets/svg/cheveron-left.svg';

const PreviousBackButton = ({ title, to }) => {
  return (
    <div className="back-button d-flex align-items-center mb-3">
      <CheveronLeftIcon className="svg-fill-logo" />
      <Link to={to} className="text-decoration-none text-reset">
        {title}
      </Link>
    </div>
  );
};

PreviousBackButton.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default PreviousBackButton;
