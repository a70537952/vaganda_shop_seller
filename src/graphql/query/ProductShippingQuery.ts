import gql, { disableFragmentWarnings } from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { QueryHookOptions, useQuery } from '@apollo/react-hooks';

import { WithPagination, SortField } from './Query';

disableFragmentWarnings();

export interface ProductShippingVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  product_id?: String;
  shipping_method?: String;
  shipping_currency?: String;
  shipping_fee?: String;
  shipping_country?: String;
  is_disabled?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_product_id?: SortField;
  sort_shipping_method?: SortField;
  sort_shipping_currency?: SortField;
  sort_shipping_fee?: SortField;
  sort_shipping_country?: SortField;
  sort_is_disabled?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_product_id?: String;
  where_like_shipping_method?: String;
  where_like_shipping_currency?: String;
  where_like_shipping_fee?: String;
  where_like_shipping_country?: String;
  where_like_is_disabled?: String;
  where_not_created_at?: String;
  where_not_updated_at?: String;
  where_not_id?: String;
  where_not_product_id?: String;
  where_not_shipping_method?: String;
  where_not_shipping_currency?: String;
  where_not_shipping_fee?: String;
  where_not_shipping_country?: String;
  where_not_is_disabled?: String;
}

export function useProductShippingQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<
    { productShipping: WithPagination<TData> },
    ProductShippingVars
  >
) {
  return useQuery<
    { productShipping: WithPagination<TData> },
    ProductShippingVars
  >(productShippingQuery(fragment), options);
}

export function productShippingQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query ProductShipping(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $product_id: String
      $shipping_method: String
      $shipping_currency: String
      $shipping_fee: String
      $shipping_country: String
      $is_disabled: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_product_id: String
      $sort_shipping_method: String
      $sort_shipping_currency: String
      $sort_shipping_fee: String
      $sort_shipping_country: String
      $sort_is_disabled: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_product_id: String
      $where_like_shipping_method: String
      $where_like_shipping_currency: String
      $where_like_shipping_fee: String
      $where_like_shipping_country: String
      $where_like_is_disabled: String
      $where_not_created_at: String
      $where_not_updated_at: String
      $where_not_id: String
      $where_not_product_id: String
      $where_not_shipping_method: String
      $where_not_shipping_currency: String
      $where_not_shipping_fee: String
      $where_not_shipping_country: String
      $where_not_is_disabled: String
    ) {
      productShipping(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        product_id: $product_id
        shipping_method: $shipping_method
        shipping_currency: $shipping_currency
        shipping_fee: $shipping_fee
        shipping_country: $shipping_country
        is_disabled: $is_disabled
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_product_id: $sort_product_id
        sort_shipping_method: $sort_shipping_method
        sort_shipping_currency: $sort_shipping_currency
        sort_shipping_fee: $sort_shipping_fee
        sort_shipping_country: $sort_shipping_country
        sort_is_disabled: $sort_is_disabled
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_product_id: $where_like_product_id
        where_like_shipping_method: $where_like_shipping_method
        where_like_shipping_currency: $where_like_shipping_currency
        where_like_shipping_fee: $where_like_shipping_fee
        where_like_shipping_country: $where_like_shipping_country
        where_like_is_disabled: $where_like_is_disabled
        where_not_created_at: $where_not_created_at
        where_not_updated_at: $where_not_updated_at
        where_not_id: $where_not_id
        where_not_product_id: $where_not_product_id
        where_not_shipping_method: $where_not_shipping_method
        where_not_shipping_currency: $where_not_shipping_currency
        where_not_shipping_fee: $where_not_shipping_fee
        where_not_shipping_country: $where_not_shipping_country
        where_not_is_disabled: $where_not_is_disabled
      ) {
        items {
          ...fragment
        }
        cursor {
          total
          perPage
          currentPage
          hasPages
        }
      }
    }
    ${fragment}
  `;
}
