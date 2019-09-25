import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface CurrencyExchangeRateVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
base?: String;
target?: String;
rate?: String;
source?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_base?: SortField;
sort_target?: SortField;
sort_rate?: SortField;
sort_source?: SortField;
where_created_at?: String;
where_updated_at?: String;
where_id?: String;
where_base?: String;
where_target?: String;
where_rate?: String;
where_source?: String;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_base?: String;
where_like_target?: String;
where_like_rate?: String;
where_like_source?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_base?: String;
where_not_target?: String;
where_not_rate?: String;
where_not_source?: String;
where_in_target?: String[];
}

export function useCurrencyExchangeRateLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ currencyExchangeRate: WithPagination<TData> }, CurrencyExchangeRateVars>
) {
    return useLazyQuery<{currencyExchangeRate: WithPagination<TData>}, CurrencyExchangeRateVars>(currencyExchangeRateQuery(fragment), options);
}

export function useCurrencyExchangeRateQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{currencyExchangeRate: WithPagination<TData>}, CurrencyExchangeRateVars>) {
    return useQuery<{currencyExchangeRate: WithPagination<TData>}, CurrencyExchangeRateVars>(currencyExchangeRateQuery(fragment), options);
}

export function currencyExchangeRateQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query CurrencyExchangeRate(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$base: String,
$target: String,
$rate: String,
$source: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_base: String,
$sort_target: String,
$sort_rate: String,
$sort_source: String,
$where_created_at: String,
$where_updated_at: String,
$where_id: String,
$where_base: String,
$where_target: String,
$where_rate: String,
$where_source: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_base: String,
$where_like_target: String,
$where_like_rate: String,
$where_like_source: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_base: String,
$where_not_target: String,
$where_not_rate: String,
$where_not_source: String,
$where_in_target: [String],
    ) {
        currencyExchangeRate(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
base: $base,
target: $target,
rate: $rate,
source: $source,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_base: $sort_base,
sort_target: $sort_target,
sort_rate: $sort_rate,
sort_source: $sort_source,
where_created_at: $where_created_at,
where_updated_at: $where_updated_at,
where_id: $where_id,
where_base: $where_base,
where_target: $where_target,
where_rate: $where_rate,
where_source: $where_source,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_base: $where_like_base,
where_like_target: $where_like_target,
where_like_rate: $where_like_rate,
where_like_source: $where_like_source,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_base: $where_not_base,
where_not_target: $where_not_target,
where_not_rate: $where_not_rate,
where_not_source: $where_not_source,
where_in_target: $where_in_target,
        ){
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
