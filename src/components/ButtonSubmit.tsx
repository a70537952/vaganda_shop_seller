import React, { Component, ComponentClass, FunctionComponent, ReactElement, ReactNode } from "react";

import { makeStyles } from "@material-ui/styles";

import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { PropTypes, Theme } from "@material-ui/core";
import { IconProps } from "@material-ui/core/Icon";


interface IProps {
  loading?: boolean;
  onClick?: () => void;
  label: string;
  loadingLabel?: string;
  fullWidth?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  color?: PropTypes.Color;
  icon?: FunctionComponent | ComponentClass | string
}

const useStyles = makeStyles((theme: Theme) => ({
  submitBtn: { margin: theme.spacing(2, 0, 0, 0) },
  rightIcon: { marginLeft: theme.spacing(1) }
}));

export default function ButtonSubmit(props: IProps) {
  const {
    loading, onClick, label, loadingLabel,
    fullWidth, variant, color, icon
  } = props;
  const classes = useStyles();

  return <Button
    fullWidth={fullWidth}
    variant={variant}
    color={color}
    onClick={loading ? undefined : onClick}
  >
    {loading ?
      <>
        {loadingLabel}
        <CircularProgress
          className={classes.rightIcon}
          size={18}
          color={"inherit"}
        />
      </>
      :
      <>
        {label}
        {icon &&
          <Box display="flex" component="span" className={classes.rightIcon}>
            {React.createElement<IconProps>(icon, { fontSize: 'small'})}
          </Box>
        }
      </>
    }
  </Button>;
}