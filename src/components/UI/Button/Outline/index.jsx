import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as PlusIcon } from '../../../../assets/svg/plus.svg';

const OutlineButton = ({ title, onClick, grow }) => {
  return (
    <button
      type="button"
      className={`${grow ? 'w-100 ' : ''}btn outline-gray-button border rounded py-1 small`}
      onClick={onClick}
    >
      <div className={`d-flex align-items-center${grow ? ' justify-content-center' : ''}`}>
        <PlusIcon className="icon svg-stroke-logo" />
        {title}
      </div>
    </button>
  );
};

OutlineButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  grow: PropTypes.bool,
};

OutlineButton.defaultProps = { grow: false };

export default OutlineButton;
