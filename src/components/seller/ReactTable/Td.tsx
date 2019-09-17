import TableCell from "@material-ui/core/TableCell";
import React from "react";

export default function ReactTableTh(props: any) {
  const {
    children, className, style, onClick
  } = props;
  let isExpander = className.includes('-expander');
  let isCheckbox = className.includes('-checkbox');
  return <TableCell
    onClick={onClick}
    style={
      isExpander || isCheckbox ? { ...style, padding: 0 } : { ...style }
    }
  >
    {children}
  </TableCell>;
}
