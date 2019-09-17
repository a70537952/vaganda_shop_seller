import TableHead from "@material-ui/core/TableHead";
import React from "react";


export default function ReactTableThead(props: any) {
  const {
    children, className, style
  } = props;
  let isHeader = className.includes("-header");
  let isFilters = className.includes("-filters");
  if (isFilters) return null;
  return <TableHead style={style}>{children}</TableHead>;
}