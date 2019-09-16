import { PropTypes, Theme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { emphasize } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import classNames from 'classnames';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Skeleton } from '@material-ui/lab';
import FormControl from '@material-ui/core/FormControl';

interface IProps {
  loading?: boolean;
  loadingHeight?: any;
  isMulti?: boolean;
  options?: { value: any; label: string }[];
  value?: any;
  onChange?: (value: any) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  margin?: PropTypes.Margin;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    height: 250,
    minWidth: 290
  },
  input: {
    display: 'flex'
    // padding: 0,
    // height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    // flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  }
}));

export default function Select(props: IProps) {
  const classes = useStyles();
  const theme: Theme = useTheme();
  const [value, setValue] = useState<any>(
    props.options
      ? props.options.find(option => option.value === props.value)
      : null
  );
  const {
    isMulti,
    options,
    onChange,
    label,
    required,
    margin,
    error,
    helperText,
    fullWidth,
    disabled,
    loading,
    loadingHeight
  } = props;

  useEffect(() => {
    if (options) {
      let newValue = options.find(
        (option: { value: any; label: string }) => option.value === props.value
      );
      if (newValue) {
        setValue(newValue);
      }
    }
  }, [value !== props.value, options]);

  if (loading) {
    return (
      <FormControl fullWidth margin={margin}>
        <Skeleton
          variant={'rect'}
          width={'100%'}
          height={loadingHeight || 48}
        />
      </FormControl>
    );
  }

  return (
    <ReactSelect
      menuPosition={'fixed'}
      classes={classes}
      styles={{
        container: base => ({
          ...base,
          width: '100%'
        }),
        input: base => ({
          ...base,
          color: theme.palette.text.primary,
          '& input': {
            font: 'inherit'
          }
        })
      }}
      TextFieldProps={{
        required: required,
        label: label,
        error: error,
        fullWidth: fullWidth,
        helperText: helperText,
        margin: margin,
        disabled: disabled,
        InputLabelProps: {
          shrink: true
        }
      }}
      options={options}
      placeholder={label}
      components={{
        Control,
        MenuList,
        Menu,
        MultiValue,
        NoOptionsMessage,
        Option,
        Placeholder,
        SingleValue,
        ValueContainer,
        IndicatorSeparator
      }}
      value={value}
      onChange={(newValue: any) => {
        setValue(newValue);
        if (onChange) {
          onChange(newValue);
        }
      }}
      isMulti={isMulti}
      isDisabled={disabled}
    />
  );
}

function MenuList(props: any) {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const height = 48;
  const initialOffset = options.indexOf(value) * height;

  return (
    <AutoSizer disableHeight>
      {(data: any) => (
        <List
          width={data.width}
          height={maxHeight}
          itemCount={children.length}
          itemSize={height}
          initialScrollOffset={initialOffset}
        >
          {({ index, style }) => <div style={style}>{children[index]}</div>}
        </List>
      )}
    </AutoSizer>
  );
}

const IndicatorSeparator = ({ innerProps }: any) => {
  return <span {...innerProps} />;
};

function Option(props: any) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function inputComponent({ inputRef, ...props }: any) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: any) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps }
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
    />
  );
}

function Menu(props: any) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

function MultiValue(props: any) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function NoOptionsMessage(props: any) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function Placeholder(props: any) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function SingleValue(props: any) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: any) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}
