import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ShopSettingVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
shop_id?: String;
title?: String;
value?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_shop_id?: SortField;
sort_title?: SortField;
sort_value?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_shop_id?: String;
where_like_title?: String;
where_like_value?: String;
}

export function useShopSettingLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopSetting: WithPagination<TData> }, ShopSettingVars>
) {
    return useLazyQuery<{shopSetting: WithPagination<TData>}, ShopSettingVars>(shopSettingQuery(fragment), options);
}

export function useShopSettingQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopSetting: WithPagination<TData>}, ShopSettingVars>) {
    return useQuery<{shopSetting: WithPagination<TData>}, ShopSettingVars>(shopSettingQuery(fragment), options);
}

export function shopSettingQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopSetting(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$shop_id: String,
$title: String,
$value: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_shop_id: String,
$sort_title: String,
$sort_value: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_shop_id: String,
$where_like_title: String,
$where_like_value: String,
    ) {
        shopSetting(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
shop_id: $shop_id,
title: $title,
value: $value,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_shop_id: $sort_shop_id,
sort_title: $sort_title,
sort_value: $sort_value,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_shop_id: $where_like_shop_id,
where_like_title: $where_like_title,
where_like_value: $where_like_value,
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
