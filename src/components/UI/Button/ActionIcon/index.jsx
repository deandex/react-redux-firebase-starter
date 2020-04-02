import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as PencilIcon } from '../../../../assets/svg/edit-pencil.svg';
import { ReactComponent as TrashIcon } from '../../../../assets/svg/trash-2.svg';

const ActionIconButton = ({ onEditClick, onDeleteClick }) => {
  return (
    <>
      <button type="button" className="action-icon-button" onClick={onEditClick}>
        <PencilIcon className="svg-fill-logo" />
      </button>
      <button type="button" className="action-icon-button" onClick={onDeleteClick}>
        <TrashIcon className="svg-fill-logo" />
      </button>
    </>
  );
};

ActionIconButton.propTypes = {
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

ActionIconButton.defaultProps = {
  onEditClick: null,
  onDeleteClick: null,
};

export default ActionIconButton;
