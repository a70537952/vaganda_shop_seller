import { withStyles } from '@material-ui/core/styles/index';
import TablePagination from '@material-ui/core/TablePagination';
import React from 'react';
import { withTranslation } from 'react-i18next';

const defaultButton = (props: any) => (
  <button type="button" {...props} className="-btn">
    {props.children}
  </button>
);

class ReactTablePagination extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.getSafePage = this.getSafePage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.applyPage = this.applyPage.bind(this);

    this.state = {
      page: props.page
    };
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.page !== state.page) {
      let newState = { ...state };
      newState.page = props.page;
      return newState;
    }
    return null;
  }

  getSafePage(page: any) {
    if (Number.isNaN(page)) {
      page = this.props.page;
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1);
  }

  changePage(event: any, page?: any) {
    page = this.getSafePage(page);
    this.setState({ page });
    if (this.props.page !== page) {
      this.props.onPageChange(page);
    }
  }

  applyPage(e: any) {
    if (e) {
      e.preventDefault();
    }
    const page = this.state.page;
    this.changePage(page === '' ? this.props.page : page);
  }

  render() {
    const {
      // Computed
      pages,
      // Props
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      PreviousComponent = defaultButton,
      NextComponent = defaultButton,
      classes,
      t
    } = this.props;
    return (
      <TablePagination
        classes={{
          select: classes.select
        }}
        rowsPerPageOptions={pageSizeOptions}
        component="div"
        count={this.props.totalRow}
        rowsPerPage={this.props.pageSize}
        page={page}
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
        onChangePage={this.changePage.bind(this)}
        onChangeRowsPerPage={e => onPageSizeChange(Number(e.target.value))}
      />
    );
  }
}

export default withStyles(theme => ({
  select: {
    padding: '7px 16px 5px 8px',
    marginRight: 5
  }
}))(withTranslation()(ReactTablePagination));
