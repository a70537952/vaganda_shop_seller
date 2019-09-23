import { makeStyles } from "@material-ui/core/styles/index";
import TablePagination from "@material-ui/core/TablePagination";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  select: {
    padding: "7px 16px 5px 8px",
    marginRight: 5
  }
});

export default function ReactTablePagination(props: any) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [page, setPage] = useState<any>(props.page);

  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  const {
    pageSizeOptions,
    pageSize,
    onPageSizeChange,
    onPageChange,
    totalRow
  } = props;

  function getSafePage(page: any) {
    if (Number.isNaN(page)) {
      page = props.page;
    }
    return Math.min(Math.max(page, 0), props.pages - 1);
  }

  function changePage(event: any, page?: any) {
    page = getSafePage(page);
    setPage(page);
    if (props.page !== page) {
      onPageChange(page);
    }
  }

  return <TablePagination
    classes={{
      select: classes.select
    }}
    rowsPerPageOptions={pageSizeOptions}
    component="div"
    count={totalRow}
    rowsPerPage={pageSize}
    page={page}
    backIconButtonProps={{
      "aria-label": "Previous Page"
    }}
    nextIconButtonProps={{
      "aria-label": "Next Page"
    }}
    labelRowsPerPage={t("rows per page:")}
    labelDisplayedRows={({ from, to, count }) =>
      t("{{from}} - {{to}} of {{count}}", {
        from,
        to,
        count
      })
    }
    onChangePage={changePage}
    onChangeRowsPerPage={e => onPageSizeChange(Number(e.target.value))}
  />;
}
