import gql, { disableFragmentWarnings } from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { QueryHookOptions, useQuery } from '@apollo/react-hooks';

import { SortField } from './Query';

disableFragmentWarnings();

export interface ProductUnitVars {
  created_at?: String;
  updated_at?: String;
  id?: String;
  unit_name?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_unit_name?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_unit_name?: String;
}

export function useProductUnitQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<{ productUnit: TData[] }, ProductUnitVars>
) {
  return useQuery<{ productUnit: TData[] }, ProductUnitVars>(
    productUnitQuery(fragment),
    options
  );
}

export function productUnitQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query ProductUnit(
      $created_at: String
      $updated_at: String
      $id: ID
      $unit_name: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_unit_name: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_unit_name: String
    ) {
      productUnit(
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        unit_name: $unit_name
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_unit_name: $sort_unit_name
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_unit_name: $where_like_unit_name
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
