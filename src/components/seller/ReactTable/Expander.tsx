import { makeStyles, Theme } from "@material-ui/core/styles/index";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    alignItems: "center",
    display: "flex"
  }
}));

export default function ReactTableExpander(props: any) {
  const classes = useStyles();
  const {
    expandable,
    expander,
    isExpanded,
    hasSubComponent
  } = props;

  if (!expandable || !expander || !hasSubComponent) return null;

  return <div className={classes.root}>
    {isExpanded && <ExpandMoreIcon/>}
    {!isExpanded && <ChevronRightIcon/>}
  </div>;
}
