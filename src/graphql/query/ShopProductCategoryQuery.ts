import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ShopProductCategoryVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
shop_id?: String;
title?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_shop_id?: SortField;
sort_title?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_shop_id?: String;
where_like_title?: String;
sort_product_count?: SortField;
}

export function useShopProductCategoryLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopProductCategory: WithPagination<TData> }, ShopProductCategoryVars>
) {
    return useLazyQuery<{shopProductCategory: WithPagination<TData>}, ShopProductCategoryVars>(shopProductCategoryQuery(fragment), options);
}

export function useShopProductCategoryQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopProductCategory: WithPagination<TData>}, ShopProductCategoryVars>) {
    return useQuery<{shopProductCategory: WithPagination<TData>}, ShopProductCategoryVars>(shopProductCategoryQuery(fragment), options);
}

export function shopProductCategoryQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopProductCategory
    (
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$shop_id: String,
$title: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_shop_id: String,
$sort_title: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_shop_id: String,
$where_like_title: String,
$sort_product_count: String,)
     {
        shopProductCategory
        (
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
shop_id: $shop_id,
title: $title,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_shop_id: $sort_shop_id,
sort_title: $sort_title,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_shop_id: $where_like_shop_id,
where_like_title: $where_like_title,
sort_product_count: $sort_product_count,)
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
