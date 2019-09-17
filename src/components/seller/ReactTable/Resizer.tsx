import { makeStyles } from "@material-ui/core/styles/index";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    width: "36px",
    top: 0,
    bottom: 0,
    right: "-35px",
    cursor: "col-resize"
  },
  icon: {
    fontSize: 10
  }
});

export default function ReactTableResizer(props: any) {
  const classes = useStyles();
  const {
    onMouseDown, onTouchStart
  } = props;

  return <div
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
    className={classes.root}>
    <SettingsEthernetIcon className={classes.icon}/>
  </div>;
}
