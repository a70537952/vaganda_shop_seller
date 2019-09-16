import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField, WithPagination } from "./Query";

disableFragmentWarnings();

export interface ProductTypeVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  product_id?: String;
  title?: String;
  quantity?: String;
  price?: String;
  currency?: String;
  discount?: String;
  discount_unit?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_product_id?: SortField;
  sort_title?: SortField;
  sort_quantity?: SortField;
  sort_price?: SortField;
  sort_currency?: SortField;
  sort_discount?: SortField;
  sort_discount_unit?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_product_id?: String;
  where_like_title?: String;
  where_like_quantity?: String;
  where_like_price?: String;
  where_like_currency?: String;
  where_like_discount?: String;
  where_like_discount_unit?: String;
}

export function useProductTypeQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<
    { productType: WithPagination<TData> },
    ProductTypeVars
  >
) {
  return useQuery<{ productType: WithPagination<TData> }, ProductTypeVars>(
    productTypeQuery(fragment),
    options
  );
}

export function productTypeQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query ProductType(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $product_id: String
      $title: String
      $quantity: String
      $price: String
      $currency: String
      $discount: String
      $discount_unit: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_product_id: String
      $sort_title: String
      $sort_quantity: String
      $sort_price: String
      $sort_currency: String
      $sort_discount: String
      $sort_discount_unit: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_product_id: String
      $where_like_title: String
      $where_like_quantity: String
      $where_like_price: String
      $where_like_currency: String
      $where_like_discount: String
      $where_like_discount_unit: String
    ) {
      productType(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        product_id: $product_id
        title: $title
        quantity: $quantity
        price: $price
        currency: $currency
        discount: $discount
        discount_unit: $discount_unit
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_product_id: $sort_product_id
        sort_title: $sort_title
        sort_quantity: $sort_quantity
        sort_price: $sort_price
        sort_currency: $sort_currency
        sort_discount: $sort_discount
        sort_discount_unit: $sort_discount_unit
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_product_id: $where_like_product_id
        where_like_title: $where_like_title
        where_like_quantity: $where_like_quantity
        where_like_price: $where_like_price
        where_like_currency: $where_like_currency
        where_like_discount: $where_like_discount
        where_like_discount_unit: $where_like_discount_unit
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
