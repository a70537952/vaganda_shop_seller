import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ProductCategoryVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
title?: String;
parent_category_id?: String;
image?: String;
extra_option?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_title?: SortField;
sort_parent_category_id?: SortField;
sort_image?: SortField;
sort_extra_option?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_title?: String;
where_like_parent_category_id?: String;
where_like_image?: String;
where_like_extra_option?: String;
parent_category_id_is_null?: boolean;
}

export function useProductCategoryLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ productCategory: WithPagination<TData> }, ProductCategoryVars>
) {
    return useLazyQuery<{productCategory: WithPagination<TData>}, ProductCategoryVars>(productCategoryQuery(fragment), options);
}

export function useProductCategoryQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{productCategory: WithPagination<TData>}, ProductCategoryVars>) {
    return useQuery<{productCategory: WithPagination<TData>}, ProductCategoryVars>(productCategoryQuery(fragment), options);
}

export function productCategoryQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ProductCategory(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$title: String,
$parent_category_id: String,
$image: String,
$extra_option: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_title: String,
$sort_parent_category_id: String,
$sort_image: String,
$sort_extra_option: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_title: String,
$where_like_parent_category_id: String,
$where_like_image: String,
$where_like_extra_option: String,
$parent_category_id_is_null: Boolean,
    ) {
        productCategory(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
title: $title,
parent_category_id: $parent_category_id,
image: $image,
extra_option: $extra_option,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_title: $sort_title,
sort_parent_category_id: $sort_parent_category_id,
sort_image: $sort_image,
sort_extra_option: $sort_extra_option,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_title: $where_like_title,
where_like_parent_category_id: $where_like_parent_category_id,
where_like_image: $where_like_image,
where_like_extra_option: $where_like_extra_option,
parent_category_id_is_null: $parent_category_id_is_null,
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
