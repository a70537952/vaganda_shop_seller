import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles/index";
import React from "react";

const useStyles = makeStyles(() => {
  const widthHeight = 40;
  return {
    root: {
      position: "absolute",
      width: widthHeight,
      height: widthHeight,
      top: "calc(50% - " + widthHeight / 2 + "px)",
      left: "calc(50% - " + widthHeight / 2 + "px)"
    }
  };
});

export default function ReactTableExpander(props: any) {
  const classes = useStyles();
  const {
    loading
  } = props;

  if (!loading) return null;

  return <CircularProgress className={classes.root}/>;
}