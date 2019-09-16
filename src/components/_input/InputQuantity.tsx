import { Theme } from "@material-ui/core/styles";
import React from "react";
import { StyledComponentProps } from "@material-ui/core/styles/withStyles";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { makeStyles } from "@material-ui/styles";

interface IProps extends StyledComponentProps {
  onChange?: (value: number) => void;
  value: number;
  min?: number;
  step?: number;
  max?: number;
  disabled?: boolean;
  error?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 'fit-content',
    display: 'inline-block'
  },
  input: {
    textAlign: 'center'
  },
  error: {
    borderColor: theme.palette.primary.main,
    borderStyle: 'solid',
    borderWidth: '2px',
    transition: 'border-color 0.5s'
  }
}));

export default function InputQuantity(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { value, min, step = 1, disabled, error } = props;

  function onChange(value: any) {
    let returnValue: number = Math.round(Number(value));

    if (!props.min || returnValue >= props.min) {
      if (props.max && returnValue > props.max) {
        returnValue = props.max;
      }

      if (props.onChange && returnValue !== props.value) {
        props.onChange(returnValue);
      }
    } else if (value === '') {
      returnValue = props.min ? props.min : 0;
      if (props.onChange && returnValue !== props.value) {
        props.onChange(returnValue);
      }
    }
  }

  return (
    <Paper
      className={classNames(classes.root, { [classes.error]: error })}
      elevation={1}
    >
      <IconButton
        disabled={disabled}
        onClick={() => {
          onChange(value - step);
        }}
      >
        <RemoveIcon />
      </IconButton>
      <InputBase
        error={error}
        classes={{
          input: classes.input
        }}
        type={'number'}
        inputProps={{
          min: min,
          step: step,
          pattern: 'd*'
        }}
        placeholder={t('quantity')}
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value}
        disabled={disabled}
      />
      <IconButton
        disabled={disabled}
        onClick={() => {
          onChange(value + step);
        }}
      >
        <AddIcon />
      </IconButton>
    </Paper>
  );
}
