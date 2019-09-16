import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField, WithPagination } from "./Query";

disableFragmentWarnings();

export interface ProductVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  shop_id?: String;
  user_id?: String;
  title?: String;
  product_category_id?: String;
  description?: String;
  extra_option?: String;
  width?: String;
  width_unit?: String;
  height?: String;
  height_unit?: String;
  length?: String;
  length_unit?: String;
  weight?: String;
  weight_unit?: String;
  is_publish?: String;
  product_rating?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_shop_id?: SortField;
  sort_user_id?: SortField;
  sort_title?: SortField;
  sort_product_category_id?: SortField;
  sort_description?: SortField;
  sort_extra_option?: SortField;
  sort_width?: SortField;
  sort_width_unit?: SortField;
  sort_height?: SortField;
  sort_height_unit?: SortField;
  sort_length?: SortField;
  sort_length_unit?: SortField;
  sort_weight?: SortField;
  sort_weight_unit?: SortField;
  sort_is_publish?: SortField;
  sort_product_rating?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_shop_id?: String;
  where_like_user_id?: String;
  where_like_title?: String;
  where_like_product_category_id?: String;
  where_like_description?: String;
  where_like_extra_option?: String;
  where_like_width?: String;
  where_like_width_unit?: String;
  where_like_height?: String;
  where_like_height_unit?: String;
  where_like_length?: String;
  where_like_length_unit?: String;
  where_like_weight?: String;
  where_like_weight_unit?: String;
  where_like_is_publish?: String;
  where_like_product_rating?: String;
  where_not_created_at?: String;
  where_not_updated_at?: String;
  where_not_id?: String;
  where_not_shop_id?: String;
  where_not_user_id?: String;
  where_not_title?: String;
  where_not_product_category_id?: String;
  where_not_description?: String;
  where_not_extra_option?: String;
  where_not_width?: String;
  where_not_width_unit?: String;
  where_not_height?: String;
  where_not_height_unit?: String;
  where_not_length?: String;
  where_not_length_unit?: String;
  where_not_weight?: String;
  where_not_weight_unit?: String;
  where_not_is_publish?: String;
  where_not_product_rating?: String;
  sort_price?: SortField;
  where_like_product_category?: String;
  where_shop_product_category_id?: String;
}

export function useProductQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<{ product: WithPagination<TData> }, ProductVars>
) {
  return useQuery<{ product: WithPagination<TData> }, ProductVars>(
    productQuery(fragment),
    options
  );
}

export function productQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query Product(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $shop_id: String
      $user_id: String
      $title: String
      $product_category_id: String
      $description: String
      $extra_option: String
      $width: String
      $width_unit: String
      $height: String
      $height_unit: String
      $length: String
      $length_unit: String
      $weight: String
      $weight_unit: String
      $is_publish: String
      $product_rating: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_shop_id: String
      $sort_user_id: String
      $sort_title: String
      $sort_product_category_id: String
      $sort_description: String
      $sort_extra_option: String
      $sort_width: String
      $sort_width_unit: String
      $sort_height: String
      $sort_height_unit: String
      $sort_length: String
      $sort_length_unit: String
      $sort_weight: String
      $sort_weight_unit: String
      $sort_is_publish: String
      $sort_product_rating: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_shop_id: String
      $where_like_user_id: String
      $where_like_title: String
      $where_like_product_category_id: String
      $where_like_description: String
      $where_like_extra_option: String
      $where_like_width: String
      $where_like_width_unit: String
      $where_like_height: String
      $where_like_height_unit: String
      $where_like_length: String
      $where_like_length_unit: String
      $where_like_weight: String
      $where_like_weight_unit: String
      $where_like_is_publish: String
      $where_like_product_rating: String
      $where_not_created_at: String
      $where_not_updated_at: String
      $where_not_id: String
      $where_not_shop_id: String
      $where_not_user_id: String
      $where_not_title: String
      $where_not_product_category_id: String
      $where_not_description: String
      $where_not_extra_option: String
      $where_not_width: String
      $where_not_width_unit: String
      $where_not_height: String
      $where_not_height_unit: String
      $where_not_length: String
      $where_not_length_unit: String
      $where_not_weight: String
      $where_not_weight_unit: String
      $where_not_is_publish: String
      $where_not_product_rating: String
      $sort_price: String
      $where_like_product_category: String
      $where_shop_product_category_id: String
    ) {
      product(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        shop_id: $shop_id
        user_id: $user_id
        title: $title
        product_category_id: $product_category_id
        description: $description
        extra_option: $extra_option
        width: $width
        width_unit: $width_unit
        height: $height
        height_unit: $height_unit
        length: $length
        length_unit: $length_unit
        weight: $weight
        weight_unit: $weight_unit
        is_publish: $is_publish
        product_rating: $product_rating
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_shop_id: $sort_shop_id
        sort_user_id: $sort_user_id
        sort_title: $sort_title
        sort_product_category_id: $sort_product_category_id
        sort_description: $sort_description
        sort_extra_option: $sort_extra_option
        sort_width: $sort_width
        sort_width_unit: $sort_width_unit
        sort_height: $sort_height
        sort_height_unit: $sort_height_unit
        sort_length: $sort_length
        sort_length_unit: $sort_length_unit
        sort_weight: $sort_weight
        sort_weight_unit: $sort_weight_unit
        sort_is_publish: $sort_is_publish
        sort_product_rating: $sort_product_rating
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_shop_id: $where_like_shop_id
        where_like_user_id: $where_like_user_id
        where_like_title: $where_like_title
        where_like_product_category_id: $where_like_product_category_id
        where_like_description: $where_like_description
        where_like_extra_option: $where_like_extra_option
        where_like_width: $where_like_width
        where_like_width_unit: $where_like_width_unit
        where_like_height: $where_like_height
        where_like_height_unit: $where_like_height_unit
        where_like_length: $where_like_length
        where_like_length_unit: $where_like_length_unit
        where_like_weight: $where_like_weight
        where_like_weight_unit: $where_like_weight_unit
        where_like_is_publish: $where_like_is_publish
        where_like_product_rating: $where_like_product_rating
        where_not_created_at: $where_not_created_at
        where_not_updated_at: $where_not_updated_at
        where_not_id: $where_not_id
        where_not_shop_id: $where_not_shop_id
        where_not_user_id: $where_not_user_id
        where_not_title: $where_not_title
        where_not_product_category_id: $where_not_product_category_id
        where_not_description: $where_not_description
        where_not_extra_option: $where_not_extra_option
        where_not_width: $where_not_width
        where_not_width_unit: $where_not_width_unit
        where_not_height: $where_not_height
        where_not_height_unit: $where_not_height_unit
        where_not_length: $where_not_length
        where_not_length_unit: $where_not_length_unit
        where_not_weight: $where_not_weight
        where_not_weight_unit: $where_not_weight_unit
        where_not_is_publish: $where_not_is_publish
        where_not_product_rating: $where_not_product_rating
        sort_price: $sort_price
        where_like_product_category: $where_like_product_category
        where_shop_product_category_id: $where_shop_product_category_id
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
