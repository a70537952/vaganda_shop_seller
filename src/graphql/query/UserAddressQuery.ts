import gql, { disableFragmentWarnings } from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { QueryHookOptions, useQuery } from '@apollo/react-hooks';

import { WithPagination, SortField } from './Query';

disableFragmentWarnings();

export interface UserAddressVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  user_id?: String;
  address_1?: String;
  address_2?: String;
  address_3?: String;
  city?: String;
  state?: String;
  postal_code?: String;
  country?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_user_id?: SortField;
  sort_address_1?: SortField;
  sort_address_2?: SortField;
  sort_address_3?: SortField;
  sort_city?: SortField;
  sort_state?: SortField;
  sort_postal_code?: SortField;
  sort_country?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_user_id?: String;
  where_like_address_1?: String;
  where_like_address_2?: String;
  where_like_address_3?: String;
  where_like_city?: String;
  where_like_state?: String;
  where_like_postal_code?: String;
  where_like_country?: String;
}

export function useUserAddressQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<
    { userAddress: WithPagination<TData> },
    UserAddressVars
  >
) {
  return useQuery<{ userAddress: WithPagination<TData> }, UserAddressVars>(
    userAddressQuery(fragment),
    options
  );
}

export function userAddressQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query UserAddress(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $user_id: String
      $address_1: String
      $address_2: String
      $address_3: String
      $city: String
      $state: String
      $postal_code: String
      $country: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_user_id: String
      $sort_address_1: String
      $sort_address_2: String
      $sort_address_3: String
      $sort_city: String
      $sort_state: String
      $sort_postal_code: String
      $sort_country: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_user_id: String
      $where_like_address_1: String
      $where_like_address_2: String
      $where_like_address_3: String
      $where_like_city: String
      $where_like_state: String
      $where_like_postal_code: String
      $where_like_country: String
    ) {
      userAddress(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        user_id: $user_id
        address_1: $address_1
        address_2: $address_2
        address_3: $address_3
        city: $city
        state: $state
        postal_code: $postal_code
        country: $country
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_user_id: $sort_user_id
        sort_address_1: $sort_address_1
        sort_address_2: $sort_address_2
        sort_address_3: $sort_address_3
        sort_city: $sort_city
        sort_state: $sort_state
        sort_postal_code: $sort_postal_code
        sort_country: $sort_country
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_user_id: $where_like_user_id
        where_like_address_1: $where_like_address_1
        where_like_address_2: $where_like_address_2
        where_like_address_3: $where_like_address_3
        where_like_city: $where_like_city
        where_like_state: $where_like_state
        where_like_postal_code: $where_like_postal_code
        where_like_country: $where_like_country
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
