import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField } from "./Query";

disableFragmentWarnings();

export interface ProductDescriptionImageVars {
  created_at?: String;
  updated_at?: String;
  id?: String;
  shop_id?: String;
  user_id?: String;
  path?: String;
  extension?: String;
  mime_type?: String;
  width?: String;
  height?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_shop_id?: SortField;
  sort_user_id?: SortField;
  sort_path?: SortField;
  sort_extension?: SortField;
  sort_mime_type?: SortField;
  sort_width?: SortField;
  sort_height?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_shop_id?: String;
  where_like_user_id?: String;
  where_like_path?: String;
  where_like_extension?: String;
  where_like_mime_type?: String;
  where_like_width?: String;
  where_like_height?: String;
}

export function useProductDescriptionImageQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<
    { productDescriptionImage: TData[] },
    ProductDescriptionImageVars
  >
) {
  return useQuery<
    { productDescriptionImage: TData[] },
    ProductDescriptionImageVars
  >(productDescriptionImageQuery(fragment), options);
}

export function productDescriptionImageQuery(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    query ProductDescriptionImage(
      $created_at: String
      $updated_at: String
      $id: ID
      $shop_id: String
      $user_id: String
      $path: String
      $extension: String
      $mime_type: String
      $width: String
      $height: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_shop_id: String
      $sort_user_id: String
      $sort_path: String
      $sort_extension: String
      $sort_mime_type: String
      $sort_width: String
      $sort_height: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_shop_id: String
      $where_like_user_id: String
      $where_like_path: String
      $where_like_extension: String
      $where_like_mime_type: String
      $where_like_width: String
      $where_like_height: String
    ) {
      productDescriptionImage(
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        shop_id: $shop_id
        user_id: $user_id
        path: $path
        extension: $extension
        mime_type: $mime_type
        width: $width
        height: $height
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_shop_id: $sort_shop_id
        sort_user_id: $sort_user_id
        sort_path: $sort_path
        sort_extension: $sort_extension
        sort_mime_type: $sort_mime_type
        sort_width: $sort_width
        sort_height: $sort_height
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_shop_id: $where_like_shop_id
        where_like_user_id: $where_like_user_id
        where_like_path: $where_like_path
        where_like_extension: $where_like_extension
        where_like_mime_type: $where_like_mime_type
        where_like_width: $where_like_width
        where_like_height: $where_like_height
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
