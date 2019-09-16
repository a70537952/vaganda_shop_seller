import React from "react";
import { useTranslation } from "react-i18next";
import { PropTypes } from "@material-ui/core";
import Select from "./Select";

interface IProps {
  onChange: (value: unknown) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  label?: string;
  margin?: PropTypes.Margin;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export default function LengthHeightWidthSelect(props: IProps) {
  const { t } = useTranslation();

  const {
    label,
    required,
    margin,
    error,
    disabled,
    fullWidth,
    helperText,
    value,
    onChange
  } = props;

  return (
    <Select
      fullWidth={fullWidth}
      helperText={helperText}
      margin={margin}
      error={error}
      label={label}
      required={required}
      value={value}
      onChange={option => {
        onChange(option.value);
      }}
      disabled={disabled}
      options={[
        ...[{ value: '', label: t('global$$none') }],
        ...[
          { value: 'mm', label: t('global$$mm') },
          { value: 'cm', label: t('global$$cm') },
          { value: 'm', label: t('global$$m') }
        ]
      ]}
    />
  );
}
