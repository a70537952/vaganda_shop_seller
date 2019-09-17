import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: "calc(50% - 10px)",
    left: "calc(50% - 56px)"
  }
});

export default function ReactTableNoData(props: any) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    loading
  } = props;

  if (loading) return null;

  return <Paper className={classes.root} elevation={0}>
    {t("no data found")}
  </Paper>;
}
