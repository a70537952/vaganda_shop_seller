import Table from "@material-ui/core/Table";
import React from "react";

export default function ReactTableTable(props: any) {
  const {
    children, style
  } = props;

  return <Table style={style}>{children}</Table>;
}