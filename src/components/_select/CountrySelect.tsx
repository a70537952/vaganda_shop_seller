import React from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from '@material-ui/core';
import Select from './Select';
import { useCountryQuery } from '../../graphql/query/CountryQuery';
import { ICountryFragmentCountrySelect } from '../../graphql/fragment/interface/CountryFragmentInterface';
import { countryFragments } from '../../graphql/fragment/query/CountryFragment';

interface IProps {
  onChange: (value: unknown) => void;
  required?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  margin?: PropTypes.Margin;
  value?: string;
  disabled?: boolean;
  extraOptions?: [{ value: string; label: string }];
}

export default function CountrySelect(props: IProps) {
  const { t } = useTranslation();

  const { loading, data } = useCountryQuery<ICountryFragmentCountrySelect>(
    countryFragments.CountrySelect,
    {
      variables: { sort_name: 'asc' }
    }
  );

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
    extraOptions
  } = props;

  let countries: ICountryFragmentCountrySelect[] = [];

  if (!loading && data) {
    countries = data.country;
  }

  return (
    <Select
      loading={loading}
      loadingHeight={48}
      label={label || t('global$$country')}
      required={required}
      margin={margin}
      error={error}
      disabled={disabled}
      fullWidth={fullWidth}
      helperText={helperText}
      options={[
        ...[{ value: '', label: t('global$$none') }],
        ...(extraOptions || []),
        ...countries.map((country: any) => ({
          value: country.name,
          label: t('global$$countryKey::' + country.name)
        }))
      ]}
      value={value}
      onChange={option => {
        onChange(option.value);
      }}
    />
  );
}
