import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField, WithPagination } from "./Query";

disableFragmentWarnings();

export interface FacebookUserVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  user_id?: String;
  name?: String;
  gender?: String;
  facebook_user_id?: String;
  facebook_profile_link?: String;
  facebook_email?: String;
  facebook_short_access_token?: String;
  facebook_user_avatar?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_user_id?: SortField;
  sort_name?: SortField;
  sort_gender?: SortField;
  sort_facebook_user_id?: SortField;
  sort_facebook_profile_link?: SortField;
  sort_facebook_email?: SortField;
  sort_facebook_short_access_token?: SortField;
  sort_facebook_user_avatar?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_user_id?: String;
  where_like_name?: String;
  where_like_gender?: String;
  where_like_facebook_user_id?: String;
  where_like_facebook_profile_link?: String;
  where_like_facebook_email?: String;
  where_like_facebook_short_access_token?: String;
  where_like_facebook_user_avatar?: String;
}

export function useFacebookUserQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<
    { facebookUser: WithPagination<TData> },
    FacebookUserVars
  >
) {
  return useQuery<{ facebookUser: WithPagination<TData> }, FacebookUserVars>(
    facebookUserQuery(fragment),
    options
  );
}

export function facebookUserQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query FacebookUser(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $user_id: String
      $name: String
      $gender: String
      $facebook_user_id: String
      $facebook_profile_link: String
      $facebook_email: String
      $facebook_short_access_token: String
      $facebook_user_avatar: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_user_id: String
      $sort_name: String
      $sort_gender: String
      $sort_facebook_user_id: String
      $sort_facebook_profile_link: String
      $sort_facebook_email: String
      $sort_facebook_short_access_token: String
      $sort_facebook_user_avatar: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_user_id: String
      $where_like_name: String
      $where_like_gender: String
      $where_like_facebook_user_id: String
      $where_like_facebook_profile_link: String
      $where_like_facebook_email: String
      $where_like_facebook_short_access_token: String
      $where_like_facebook_user_avatar: String
    ) {
      facebookUser(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        user_id: $user_id
        name: $name
        gender: $gender
        facebook_user_id: $facebook_user_id
        facebook_profile_link: $facebook_profile_link
        facebook_email: $facebook_email
        facebook_short_access_token: $facebook_short_access_token
        facebook_user_avatar: $facebook_user_avatar
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_user_id: $sort_user_id
        sort_name: $sort_name
        sort_gender: $sort_gender
        sort_facebook_user_id: $sort_facebook_user_id
        sort_facebook_profile_link: $sort_facebook_profile_link
        sort_facebook_email: $sort_facebook_email
        sort_facebook_short_access_token: $sort_facebook_short_access_token
        sort_facebook_user_avatar: $sort_facebook_user_avatar
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_user_id: $where_like_user_id
        where_like_name: $where_like_name
        where_like_gender: $where_like_gender
        where_like_facebook_user_id: $where_like_facebook_user_id
        where_like_facebook_profile_link: $where_like_facebook_profile_link
        where_like_facebook_email: $where_like_facebook_email
        where_like_facebook_short_access_token: $where_like_facebook_short_access_token
        where_like_facebook_user_avatar: $where_like_facebook_user_avatar
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
