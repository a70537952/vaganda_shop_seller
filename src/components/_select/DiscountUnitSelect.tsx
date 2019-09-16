import MenuItem from '@material-ui/core/MenuItem';

import React from 'react';
import {
  useTranslation,
  WithTranslation,
  withTranslation
} from 'react-i18next';
import Select from './Select';
import { PropTypes } from '@material-ui/core';

interface IProps {
  onChange: (value: unknown) => void;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  value?: string;
  disabled?: boolean;
  margin?: PropTypes.Margin;
  error?: boolean;
  helperText?: string;
}
export default function DiscountUnitSelect(props: IProps) {
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
      label={label || t('global$$discount unit')}
      required={required}
      value={value}
      onChange={option => {
        onChange(option.value);
      }}
      disabled={disabled}
      options={[
        ...[{ value: '', label: t('global$$please select') }],
        ...[
          { value: 'Price', label: t('global$$price') },
          { value: 'Percentage', label: t('global$$percentage') }
        ]
      ]}
    />
  );
}
