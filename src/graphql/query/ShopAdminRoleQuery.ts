import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ShopAdminRoleVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
shop_id?: String;
title?: String;
permission?: String[];
is_shop_owner_role?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_shop_id?: SortField;
sort_title?: SortField;
sort_permission?: SortField;
sort_is_shop_owner_role?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_shop_id?: String;
where_like_title?: String;
where_like_permission?: String;
where_like_is_shop_owner_role?: String;
}

export function useShopAdminRoleLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopAdminRole: WithPagination<TData> }, ShopAdminRoleVars>
) {
    return useLazyQuery<{shopAdminRole: WithPagination<TData>}, ShopAdminRoleVars>(shopAdminRoleQuery(fragment), options);
}

export function useShopAdminRoleQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopAdminRole: WithPagination<TData>}, ShopAdminRoleVars>) {
    return useQuery<{shopAdminRole: WithPagination<TData>}, ShopAdminRoleVars>(shopAdminRoleQuery(fragment), options);
}

export function shopAdminRoleQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopAdminRole(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$shop_id: String,
$title: String,
$permission: [String],
$is_shop_owner_role: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_shop_id: String,
$sort_title: String,
$sort_permission: String,
$sort_is_shop_owner_role: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_shop_id: String,
$where_like_title: String,
$where_like_permission: String,
$where_like_is_shop_owner_role: String,
    ) {
        shopAdminRole(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
shop_id: $shop_id,
title: $title,
permission: $permission,
is_shop_owner_role: $is_shop_owner_role,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_shop_id: $sort_shop_id,
sort_title: $sort_title,
sort_permission: $sort_permission,
sort_is_shop_owner_role: $sort_is_shop_owner_role,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_shop_id: $where_like_shop_id,
where_like_title: $where_like_title,
where_like_permission: $where_like_permission,
where_like_is_shop_owner_role: $where_like_is_shop_owner_role,
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
