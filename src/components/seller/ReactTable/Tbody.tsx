import TableBody from "@material-ui/core/TableBody";
import React from "react";

export default class ReactTableTbody extends React.Component<any, any> {
  render() {
    const { children, className, style } = this.props;

    return <TableBody style={style}>{children}</TableBody>;
  }
}
