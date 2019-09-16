import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import { WithTranslation, withTranslation } from 'react-i18next';

interface IProps extends TypographyProps {
  classes: any;
  total: number;
  rowsPerPage: number;
  changePage: (event: any, page: number) => void;
  page: number;
  rowsPerPageOptions?: number[];
}

class Pagination extends React.Component<
  IProps & WithTranslation,
  Readonly<any>
> {
  render() {
    let {
      classes,
      total,
      rowsPerPage,
      t,
      changePage,
      page,
      rowsPerPageOptions
    } = this.props;

    return (
      <TablePagination
        classes={{
          select: classes.select
        }}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        rowsPerPageOptions={rowsPerPageOptions}
        backIconButtonProps={{
          'aria-label': 'Previous Page'
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page'
        }}
        labelRowsPerPage={t('rows per page:')}
        labelDisplayedRows={({ from, to, count }) =>
          t('{{from}} - {{to}} of {{count}}', {
            from,
            to,
            count
          })
        }
        onChangePage={changePage}
      />
    );
  }
}

export default withStyles(theme => ({}))(withTranslation()(Pagination));
