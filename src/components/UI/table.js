import React from 'react';
import PropTypes from 'prop-types';

import { NumberHelper } from '../../helpers';

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg';
import { ReactComponent as TrashIcon } from '../../assets/svg/Trash.svg';

const Table = ({ headers, data, onEdit, onDelete }) => {
  return (
    <table className="table-gray">
      <thead>
        <tr>
          {headers.map(header => (
            <th key={`header-${header.key}-${NumberHelper.getRandomNumber()}`} style={header.style || null}>
              {header.title}
            </th>
          ))}
          <th />
        </tr>
      </thead>
      {data ? (
        <tbody>
          {Object.keys(data).map(row => {
            const rowView = data[row].map(col => <td key={`col-${col}-${NumberHelper.getRandomNumber()}`}>{col}</td>);
            return (
              <tr key={`row-${row}-${NumberHelper.getRandomNumber()}`}>
                {rowView}
                <td className="action">
                  {onEdit ? (
                    <button type="button" onClick={e => onEdit(row, e)}>
                      <EditIcon title="Edit" />
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button type="button" onClick={e => onDelete(row, e)}>
                      <TrashIcon title="Delete" />
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      ) : null}
    </table>
  );
};

Table.propTypes = {
  headers: PropTypes.instanceOf(Array).isRequired,
  data: PropTypes.instanceOf(Object),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

Table.defaultProps = { data: null, onEdit: null, onDelete: null };

export default Table;
