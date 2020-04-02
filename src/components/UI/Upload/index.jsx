import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as ImageUpload } from '../../../assets/svg/Upload.svg';

const Upload = ({ name, onChange, imageSrc, previewClass, containerClass, text }) => (
  <div className={`d-flex${containerClass !== '' ? ` ${containerClass}` : ''}`}>
    <img className={`${name}-preview${previewClass !== '' ? ` ${previewClass}` : ''}`} src={imageSrc} alt="" />
    <div className="align-self-stretch d-flex flex-column justify-content-center">
      <div className="file-upload-wrapper">
        <a href="#upload" className="upload-link">
          <ImageUpload className="svg-stroke-logo" />
          {text}
        </a>
        <input type="file" name={name} onChange={onChange} accept="image/*" />
      </div>
      <small id="uploadHelp" className="form-text text-muted mt-0">
        File should be jpg, png, or gif
      </small>
    </div>
  </div>
);

Upload.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  imageSrc: PropTypes.string.isRequired,
  previewClass: PropTypes.string,
  containerClass: PropTypes.string,
  text: PropTypes.string,
};

Upload.defaultProps = { containerClass: '', text: 'Change ', previewClass: '' };

export default React.memo(Upload);
