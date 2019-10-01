import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface UserCartVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
user_id?: String;
product_type_id?: String;
quantity?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_user_id?: SortField;
sort_product_type_id?: SortField;
sort_quantity?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_user_id?: String;
where_like_product_type_id?: String;
where_like_quantity?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_user_id?: String;
where_not_product_type_id?: String;
where_not_quantity?: String;
}

export function useUserCartLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ userCart: WithPagination<TData> }, UserCartVars>
) {
    return useLazyQuery<{userCart: WithPagination<TData>}, UserCartVars>(userCartQuery(fragment), options);
}

export function useUserCartQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{userCart: WithPagination<TData>}, UserCartVars>) {
    return useQuery<{userCart: WithPagination<TData>}, UserCartVars>(userCartQuery(fragment), options);
}

export function userCartQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query UserCart
    (
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$user_id: String,
$product_type_id: String,
$quantity: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_user_id: String,
$sort_product_type_id: String,
$sort_quantity: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_user_id: String,
$where_like_product_type_id: String,
$where_like_quantity: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_user_id: String,
$where_not_product_type_id: String,
$where_not_quantity: String,)
     {
        userCart
        (
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
user_id: $user_id,
product_type_id: $product_type_id,
quantity: $quantity,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_user_id: $sort_user_id,
sort_product_type_id: $sort_product_type_id,
sort_quantity: $sort_quantity,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_user_id: $where_like_user_id,
where_like_product_type_id: $where_like_product_type_id,
where_like_quantity: $where_like_quantity,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_user_id: $where_not_user_id,
where_not_product_type_id: $where_not_product_type_id,
where_not_quantity: $where_not_quantity,)
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
