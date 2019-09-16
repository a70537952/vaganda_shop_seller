import { withStyles } from "@material-ui/core/styles/index";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { withTranslation } from "react-i18next";

class ReactTableTh extends React.Component<any, any> {
  render() {
    const { children, className, style, toggleSort, classes, t } = this.props;

    let sortable = className.includes('-cursor-pointer');
    let isSortDesc: any = className.includes('-sort-desc') ? 'desc' : false;
    let isSortAsc: any = className.includes('-sort-asc') ? 'asc' : false;
    let isExpander = className.includes('-expander');
    let isCheckbox = className.includes('-checkbox');

    return (
      <TableCell
        className={classes.root}
        onClick={(e: any) => {
          toggleSort(e);
        }}
        sortDirection={isSortDesc || isSortAsc}
        style={
          isExpander || isCheckbox ? { ...style, padding: 0 } : { ...style }
        }
      >
        {sortable ? (
          <Tooltip title={t('sort')} placement={'bottom-end'} enterDelay={300}>
            <TableSortLabel
              active={Boolean(isSortDesc || isSortAsc)}
              direction={isSortDesc || isSortAsc || 'asc'}
            >
              {children}
            </TableSortLabel>
          </Tooltip>
        ) : (
          children
        )}
      </TableCell>
    );
  }
}

export default withStyles(theme => ({
  root: {
    // fontSize: '0.85rem',
    position: 'relative'
  }
}))(withTranslation()(ReactTableTh));
