import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ShopProductCategoryProductVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
shop_product_category_id?: String;
product_id?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_shop_product_category_id?: SortField;
sort_product_id?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_shop_product_category_id?: String;
where_like_product_id?: String;
}

export function useShopProductCategoryProductLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopProductCategoryProduct: WithPagination<TData> }, ShopProductCategoryProductVars>
) {
    return useLazyQuery<{shopProductCategoryProduct: WithPagination<TData>}, ShopProductCategoryProductVars>(shopProductCategoryProductQuery(fragment), options);
}

export function useShopProductCategoryProductQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopProductCategoryProduct: WithPagination<TData>}, ShopProductCategoryProductVars>) {
    return useQuery<{shopProductCategoryProduct: WithPagination<TData>}, ShopProductCategoryProductVars>(shopProductCategoryProductQuery(fragment), options);
}

export function shopProductCategoryProductQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopProductCategoryProduct(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$shop_product_category_id: String,
$product_id: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_shop_product_category_id: String,
$sort_product_id: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_shop_product_category_id: String,
$where_like_product_id: String,
    ) {
        shopProductCategoryProduct(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
shop_product_category_id: $shop_product_category_id,
product_id: $product_id,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_shop_product_category_id: $sort_shop_product_category_id,
sort_product_id: $sort_product_id,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_shop_product_category_id: $where_like_shop_product_category_id,
where_like_product_id: $where_like_product_id,
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
