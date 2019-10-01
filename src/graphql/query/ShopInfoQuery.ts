import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ShopInfoVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
shop_id?: String;
summary?: String;
logo?: String;
banner?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_shop_id?: SortField;
sort_summary?: SortField;
sort_logo?: SortField;
sort_banner?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_shop_id?: String;
where_like_summary?: String;
where_like_logo?: String;
where_like_banner?: String;
}

export function useShopInfoLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopInfo: WithPagination<TData> }, ShopInfoVars>
) {
    return useLazyQuery<{shopInfo: WithPagination<TData>}, ShopInfoVars>(shopInfoQuery(fragment), options);
}

export function useShopInfoQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopInfo: WithPagination<TData>}, ShopInfoVars>) {
    return useQuery<{shopInfo: WithPagination<TData>}, ShopInfoVars>(shopInfoQuery(fragment), options);
}

export function shopInfoQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopInfo
    (
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$shop_id: String,
$summary: String,
$logo: String,
$banner: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_shop_id: String,
$sort_summary: String,
$sort_logo: String,
$sort_banner: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_shop_id: String,
$where_like_summary: String,
$where_like_logo: String,
$where_like_banner: String,)
     {
        shopInfo
        (
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
shop_id: $shop_id,
summary: $summary,
logo: $logo,
banner: $banner,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_shop_id: $sort_shop_id,
sort_summary: $sort_summary,
sort_logo: $sort_logo,
sort_banner: $sort_banner,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_shop_id: $where_like_shop_id,
where_like_summary: $where_like_summary,
where_like_logo: $where_like_logo,
where_like_banner: $where_like_banner,)
        {
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
