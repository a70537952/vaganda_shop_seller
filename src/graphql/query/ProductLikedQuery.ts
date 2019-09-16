import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField, WithPagination } from "./Query";

disableFragmentWarnings();

export interface ProductLikedVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  product_id?: String;
  user_id?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_product_id?: SortField;
  sort_user_id?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_product_id?: String;
  where_like_user_id?: String;
  where_not_created_at?: String;
  where_not_updated_at?: String;
  where_not_id?: String;
  where_not_product_id?: String;
  where_not_user_id?: String;
}

export function useProductLikedQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<
    { productLiked: WithPagination<TData> },
    ProductLikedVars
  >
) {
  return useQuery<{ productLiked: WithPagination<TData> }, ProductLikedVars>(
    productLikedQuery(fragment),
    options
  );
}

export function productLikedQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query ProductLiked(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $product_id: String
      $user_id: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_product_id: String
      $sort_user_id: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_product_id: String
      $where_like_user_id: String
      $where_not_created_at: String
      $where_not_updated_at: String
      $where_not_id: String
      $where_not_product_id: String
      $where_not_user_id: String
    ) {
      productLiked(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        product_id: $product_id
        user_id: $user_id
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_product_id: $sort_product_id
        sort_user_id: $sort_user_id
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_product_id: $where_like_product_id
        where_like_user_id: $where_like_user_id
        where_not_created_at: $where_not_created_at
        where_not_updated_at: $where_not_updated_at
        where_not_id: $where_not_id
        where_not_product_id: $where_not_product_id
        where_not_user_id: $where_not_user_id
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
