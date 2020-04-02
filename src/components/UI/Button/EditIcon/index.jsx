import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as PencilIcon } from '../../../../assets/svg/edit-pencil.svg';

const EditIconButton = ({ onClick, show }) => {
  return (
    <button type="button" className={`edit-icon-button${show ? ' show' : ''}`} onClick={onClick}>
      <PencilIcon className="svg-fill-logo" />
    </button>
  );
};

EditIconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

EditIconButton.defaultProps = {
  show: false,
};

export default EditIconButton;
