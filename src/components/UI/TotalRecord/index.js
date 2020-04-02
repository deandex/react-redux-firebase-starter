import React from 'react';
import PropTypes from 'prop-types';

import { StringUtils } from '../../../utils';

const TotalRecord = React.memo(({ title, total, limit }) => {
  let textView = 'Displaying ';
  const limitText = StringUtils.makePluralize(title, limit > 0 ? limit : total, true);
  if (limit > 0) {
    textView += `${total} of ${limitText}`;
  } else {
    textView += limitText;
  }

  return textView;
});

TotalRecord.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};

export default TotalRecord;
