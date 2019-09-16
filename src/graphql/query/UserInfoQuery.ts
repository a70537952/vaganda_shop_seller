import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField, WithPagination } from "./Query";

disableFragmentWarnings();

export interface UserInfoVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  user_id?: String;
  gender?: number;
  avatar?: String;
  cover?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_user_id?: SortField;
  sort_gender?: SortField;
  sort_avatar?: SortField;
  sort_cover?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_user_id?: String;
  where_like_gender?: String;
  where_like_avatar?: String;
  where_like_cover?: String;
  except_self?: boolean;
  has_avatar?: boolean;
  has_cover?: boolean;
}

export function useUserInfoQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<{ userInfo: WithPagination<TData> }, UserInfoVars>
) {
  return useQuery<{ userInfo: WithPagination<TData> }, UserInfoVars>(
    userInfoQuery(fragment),
    options
  );
}

export function userInfoQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query UserInfo(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $user_id: String
      $gender: Int
      $avatar: String
      $cover: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_user_id: String
      $sort_gender: String
      $sort_avatar: String
      $sort_cover: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_user_id: String
      $where_like_gender: String
      $where_like_avatar: String
      $where_like_cover: String
      $except_self: Boolean
      $has_avatar: Boolean
      $has_cover: Boolean
    ) {
      userInfo(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        user_id: $user_id
        gender: $gender
        avatar: $avatar
        cover: $cover
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_user_id: $sort_user_id
        sort_gender: $sort_gender
        sort_avatar: $sort_avatar
        sort_cover: $sort_cover
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_user_id: $where_like_user_id
        where_like_gender: $where_like_gender
        where_like_avatar: $where_like_avatar
        where_like_cover: $where_like_cover
        except_self: $except_self
        has_avatar: $has_avatar
        has_cover: $has_cover
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
