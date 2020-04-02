import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';

import CustomToggle from '../CustomToggle';

import { ReactComponent as NavigationMoreIcon } from '../../../assets/svg/navigation-more.svg';
import { ReactComponent as CalendarIcon } from '../../../assets/svg/calendar.svg';
import { ReactComponent as ColumnsIcon } from '../../../assets/svg/columns.svg';
import { ReactComponent as HashIcon } from '../../../assets/svg/hash.svg';
import { ReactComponent as PercentIcon } from '../../../assets/svg/percent.svg';
import CheveronDownIcon from '../../../assets/svg/cheveron-down.svg';

const IconType = {
  calendar: CalendarIcon,
  columns: ColumnsIcon,
  hash: HashIcon,
  percent: PercentIcon,
  navigation: NavigationMoreIcon,
};

const DropdownSelect = ({ id, onSelect, title, children, iconName, titleMargin, smallFont, className }) => {
  const Icon = IconType[iconName];
  return (
    <Dropdown
      onSelect={onSelect}
      className={`custom-action-dropdown${smallFont ? ' small' : ''}${className !== '' ? ` ${className}` : ''}`}
    >
      <Dropdown.Toggle id={id} as={CustomToggle}>
        <div className="d-flex align-items-center">
          <Icon className="svg-stroke-logo icon mr-2" />
          <div className={`mr-${titleMargin} flex-grow-1 text-left`}>{title}</div>
          <img src={CheveronDownIcon} alt="" className="icon" />
        </div>
      </Dropdown.Toggle>
      {children}
    </Dropdown>
  );
};

DropdownSelect.propTypes = {
  id: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  iconName: PropTypes.string,
  titleMargin: PropTypes.number,
  smallFont: PropTypes.bool,
  className: PropTypes.string,
};

DropdownSelect.defaultProps = { iconName: 'navigation', titleMargin: 5, smallFont: false, className: '' };

export default React.memo(DropdownSelect);
