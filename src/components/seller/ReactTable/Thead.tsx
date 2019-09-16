import TableHead from "@material-ui/core/TableHead";
import React from "react";

export default class ReactTableThead extends React.Component<any, any> {
  render() {
    const { children, className, style } = this.props;
    let isHeader = className.includes('-header');
    let isFilters = className.includes('-filters');
    if (isFilters) return null;
    return <TableHead style={style}>{children}</TableHead>;
  }
}
