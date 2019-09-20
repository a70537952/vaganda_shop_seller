import React from "react";
import { PropTypes } from "@material-ui/core";
import Select from "./Select";
import { useTranslation } from "react-i18next";
import { useCountryPhoneCodeQuery } from "../../graphql/query/CountryPhoneCodeQuery";
import { countryPhoneCodeFragments } from "../../graphql/fragment/query/CountryPhoneCodeFragment";
import { ICountryPhoneCodeFragmentCountryPhoneCodeSelect } from "../../graphql/fragmentType/query/CountryPhoneCodeFragmentInterface";

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
  className?: string;
}

export default function CountryPhoneCodeSelect(props: IProps) {
  const { t } = useTranslation();

  const { loading, data } = useCountryPhoneCodeQuery<
    ICountryPhoneCodeFragmentCountryPhoneCodeSelect
  >(countryPhoneCodeFragments.CountryPhoneCodeSelect, {
    variables: { sort_name: 'asc' }
  });

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

  let countryPhoneCodes: ICountryPhoneCodeFragmentCountryPhoneCodeSelect[] = [];

  if (!loading && data) {
    countryPhoneCodes = data.countryPhoneCode;
  }

  return (
    <Select
      loading={loading}
      loadingHeight={48}
      label={label || t('global$$country phone code')}
      required={required}
      margin={margin}
      error={error}
      disabled={disabled}
      fullWidth={fullWidth}
      helperText={helperText}
      options={[
        ...[{ value: '', label: t('global$$none') }],
        ...countryPhoneCodes.map((countryPhoneCode: any) => ({
          value: countryPhoneCode.phone_code,
          label: `${t(
            'global$$countryPhoneCodeKey::' + countryPhoneCode.name
          )} (${countryPhoneCode.phone_code})`
        }))
      ]}
      value={value}
      onChange={option => {
        onChange(option.value);
      }}
    />
  );
}
