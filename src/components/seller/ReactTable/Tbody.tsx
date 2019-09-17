import TableBody from "@material-ui/core/TableBody";
import React from "react";

export default function ReactTableTbody(props: any) {
  const {
    children, style
  } = props;

  return <TableBody style={style}>{children}</TableBody>;
}