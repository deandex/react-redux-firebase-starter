import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as ImageUpload } from '../../assets/svg/Upload.svg';

const UploadUI = ({ onChange, text }) => {
  return (
    <div className="file-upload-wrapper">
      <a href="#upload" className="upload-link">
        <ImageUpload className="svg-stroke-logo" />
        {text}
      </a>
      <input type="file" name="cover" onChange={onChange} accept="image/*" />
    </div>
  );
};

UploadUI.propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
};

UploadUI.defaultProps = { text: 'Change ' };

export default UploadUI;
