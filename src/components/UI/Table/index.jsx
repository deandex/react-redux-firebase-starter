import React from 'react';
import PropTypes from 'prop-types';

import { NumberUtils } from '../../../utils';

import { ReactComponent as ApproveIcon } from '../../../assets/svg/checkmark-outline.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/edit.svg';
import { ReactComponent as TrashIcon } from '../../../assets/svg/Trash.svg';
import { ReactComponent as SubscribeIcon } from '../../../assets/svg/inbox-full.svg';

const Table = ({ headers, data, actionClass, onSubscribe, onApprove, onEdit, onDelete }) => {
  const hasActionColumn = onEdit || onDelete || onSubscribe || onApprove;

  return (
    <table className="table-gray">
      <thead>
        <tr>
          {headers.map(header => (
            <th key={`header-${header.key}-${NumberUtils.getRandomNumber()}`} style={header.style || null}>
              {header.title}
            </th>
          ))}
          {hasActionColumn ? <th /> : null}
        </tr>
      </thead>
      {data ? (
        <tbody>
          {Object.keys(data).map(row => {
            const rowView = data[row].map(col => (
              <td key={`col-${col.colKey}-${NumberUtils.getRandomNumber()}`} className={col.colClassName || null}>
                {col.colValue}
              </td>
            ));
            return (
              <tr key={`row-${row}-${NumberUtils.getRandomNumber()}`}>
                {rowView}
                {hasActionColumn ? (
                  <td className={`action${actionClass ? ` ${actionClass}` : ''}`}>
                    {onSubscribe ? (
                      <button type="button" onClick={e => onSubscribe(row, e)} className="subscribe">
                        <SubscribeIcon title="Subscription" className="svg-fill-logo" />
                      </button>
                    ) : null}
                    {onApprove ? (
                      <button type="button" onClick={e => onApprove(row, e)} className="approve">
                        <ApproveIcon title="Approve" className="svg-fill-logo" />
                      </button>
                    ) : null}
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
                ) : null}
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
  actionClass: PropTypes.string,
  onSubscribe: PropTypes.func,
  onApprove: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

Table.defaultProps = { data: null, actionClass: '', onSubscribe: null, onApprove: null, onEdit: null, onDelete: null };

export default React.memo(Table);
