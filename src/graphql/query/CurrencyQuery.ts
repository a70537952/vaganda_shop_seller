import gql, { disableFragmentWarnings } from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { QueryHookOptions, useQuery } from '@apollo/react-hooks';

import { SortField } from './Query';

disableFragmentWarnings();

export interface CurrencyVars {
  created_at?: String;
  updated_at?: String;
  id?: String;
  country?: String;
  currency?: String;
  iso?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_country?: SortField;
  sort_currency?: SortField;
  sort_iso?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_country?: String;
  where_like_currency?: String;
  where_like_iso?: String;
}

export function useCurrencyQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<{ currency: TData[] }, CurrencyVars>
) {
  return useQuery<{ currency: TData[] }, CurrencyVars>(
    currencyQuery(fragment),
    options
  );
}

export function currencyQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query Currency(
      $created_at: String
      $updated_at: String
      $id: ID
      $country: String
      $currency: String
      $iso: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_country: String
      $sort_currency: String
      $sort_iso: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_country: String
      $where_like_currency: String
      $where_like_iso: String
    ) {
      currency(
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        country: $country
        currency: $currency
        iso: $iso
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_country: $sort_country
        sort_currency: $sort_currency
        sort_iso: $sort_iso
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_country: $where_like_country
        where_like_currency: $where_like_currency
        where_like_iso: $where_like_iso
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
