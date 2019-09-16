import { withStyles } from "@material-ui/core/styles/index";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

class ReactTableTr extends React.Component<any, any> {
  render() {
    const { children, className, style, classes } = this.props;

    return (
      <TableRow className={classes.row} style={style}>
        {children}
      </TableRow>
    );
  }
}

export default withStyles(theme => ({
  row: {
    '&:nth-of-type(odd)': {
      //backgroundColor: theme.palette.background.default,
    }
  }
}))(ReactTableTr);
