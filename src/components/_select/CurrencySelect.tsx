import Select from './Select';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from '@material-ui/core';

interface IProps {
  onChange: (value: unknown) => void;
  label?: string;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  margin?: PropTypes.Margin;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export default function CurrencySelect(props: IProps) {
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
      label={label || t('global$$currency')}
      required={required}
      value={value}
      onChange={option => {
        onChange(option.value);
      }}
      disabled={disabled}
      options={[
        ...[{ value: '', label: t('global$$none') }],
        ...[
          { value: 'MYR', label: 'MYR' },
          { value: 'SGD', label: 'SGD' },
          { value: 'TWD', label: 'TWD' },
          { value: 'CNY', label: 'CNY' }
        ]
      ]}
    />
  );
}
