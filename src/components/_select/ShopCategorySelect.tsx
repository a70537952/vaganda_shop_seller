import Select from "./Select";
import React from "react";
import { useTranslation } from "react-i18next";
import { useShopCategoryQuery } from "../../graphql/query/ShopCategoryQuery";
import { PropTypes } from "@material-ui/core";
import { IShopCategoryFragmentShopCategorySelect } from "../../graphql/fragment/interface/ShopCategoryFragmentInterface";
import { shopCategoryFragments } from "../../graphql/fragment/query/ShopCategoryFragment";

interface IProps {
  onChange: (value: unknown) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  margin?: PropTypes.Margin;
}

export default function ShopCategorySelect(props: IProps) {
  const { t } = useTranslation();

  const { loading, data } = useShopCategoryQuery<
    IShopCategoryFragmentShopCategorySelect
  >(shopCategoryFragments.ShopCategorySelect, {
    variables: { sort_title: 'asc' }
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

  let shopCategories: IShopCategoryFragmentShopCategorySelect[] = [];

  if (!loading && data) {
    shopCategories = data.shopCategory;
  }

  return (
    <Select
      loading={loading}
      loadingHeight={50}
      label={label || t('global$$shop category')}
      margin={margin}
      error={error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      value={value}
      onChange={option => {
        onChange(option.value);
      }}
      options={[
        ...[{ value: '', label: t('global$$none') }],
        ...shopCategories.map((shopCategory: any) => ({
          value: shopCategory.id,
          label: t('global$$shopCategory::' + shopCategory.title)
        }))
      ]}
      fullWidth={fullWidth}
    />
  );
}
