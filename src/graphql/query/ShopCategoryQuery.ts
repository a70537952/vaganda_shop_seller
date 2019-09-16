import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField } from "./Query";

disableFragmentWarnings();

export interface ShopCategoryVars {
  created_at?: String;
  updated_at?: String;
  id?: String;
  title?: String;
  parent_category_id?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_title?: SortField;
  sort_parent_category_id?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_title?: String;
  where_like_parent_category_id?: String;
}

export function useShopCategoryQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<{ shopCategory: TData[] }, ShopCategoryVars>
) {
  return useQuery<{ shopCategory: TData[] }, ShopCategoryVars>(
    shopCategoryQuery(fragment),
    options
  );
}

export function shopCategoryQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query ShopCategory(
      $created_at: String
      $updated_at: String
      $id: ID
      $title: String
      $parent_category_id: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_title: String
      $sort_parent_category_id: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_title: String
      $where_like_parent_category_id: String
    ) {
      shopCategory(
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        title: $title
        parent_category_id: $parent_category_id
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_title: $sort_title
        sort_parent_category_id: $sort_parent_category_id
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_title: $where_like_title
        where_like_parent_category_id: $where_like_parent_category_id
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
