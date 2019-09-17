import { makeStyles } from "@material-ui/core/styles/index";
import TableRow from "@material-ui/core/TableRow";
import React from "react";


const useStyles = makeStyles({
  row: {
    "&:nth-of-type(odd)": {}
  }
});

export default function ReactTableTr(props: any) {
  const classes = useStyles();
  const {
    children, style
  } = props;

  return <TableRow className={classes.row} style={style}>
    {children}
  </TableRow>;
}
