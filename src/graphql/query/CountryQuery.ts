import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {SortField} from "./Query";

disableFragmentWarnings();

export interface CountryVars {
    
created_at?: String;
updated_at?: String;
id?: String;
name?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_name?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_name?: String;
}

export function useCountryLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ country: TData[] }, CountryVars>
) {
    return useLazyQuery<{country: TData[]}, CountryVars>(countryQuery(fragment), options);
}

export function useCountryQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{country: TData[]}, CountryVars>) {
    return useQuery<{country: TData[]}, CountryVars>(countryQuery(fragment), options);
}

export function countryQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query Country
    (
$created_at: String,
$updated_at: String,
$id: ID,
$name: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_name: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_name: String,)
     {
        country
        (
created_at: $created_at,
updated_at: $updated_at,
id: $id,
name: $name,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_name: $sort_name,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_name: $where_like_name,)
        {
            ...fragment
        }
    }
    ${fragment}
`;
}
