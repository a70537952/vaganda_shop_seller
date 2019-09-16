import TableCell from '@material-ui/core/TableCell';
import React from 'react';

export default class ReactTableTh extends React.Component<any, any> {
  render() {
    const { children, className, style, onClick } = this.props;

    let isExpander = className.includes('-expander');
    let isCheckbox = className.includes('-checkbox');

    return (
      <TableCell
        onClick={onClick}
        style={
          isExpander || isCheckbox ? { ...style, padding: 0 } : { ...style }
        }
      >
        {children}
      </TableCell>
    );
  }
}
