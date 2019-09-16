import Select from './Select';
import React from 'react';
import { useTranslation } from 'react-i18next';
import USER_ORDER_DETAIL from '../../constant/USER_ORDER_DETAIL';
import { PropTypes } from '@material-ui/core';

interface IProps {
  onChange: (value: unknown) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  except?: string[];
  only?: string[];
  fullWidth?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  margin?: PropTypes.Margin;
}

export default function UserOrderDetailStatusSelect(props: IProps) {
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
    onChange,
    except,
    only
  } = props;

  return (
    <Select
      fullWidth={fullWidth}
      label={label || t('global$$order detail status')}
      margin={margin}
      error={error}
      helperText={helperText}
      required={required}
      value={value}
      onChange={option => {
        onChange(option.value);
      }}
      disabled={disabled}
      options={[
        ...Object.keys(USER_ORDER_DETAIL.ORDER_DETAIL_STATUS)
          .filter((key: string) => {
            if (disabled) return true;

            if (
              except &&
              except.includes(USER_ORDER_DETAIL.ORDER_DETAIL_STATUS[key])
            ) {
              return false;
            }

            if (
              only &&
              !only.includes(USER_ORDER_DETAIL.ORDER_DETAIL_STATUS[key])
            ) {
              return false;
            }
            return true;
          })
          .map((key: string) => ({
            value: key,
            label: t(
              'global$$orderDetailStatus::' +
                USER_ORDER_DETAIL.ORDER_DETAIL_STATUS[key]
            )
          }))
      ]}
    />
  );
}
