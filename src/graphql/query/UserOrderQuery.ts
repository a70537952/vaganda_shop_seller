import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface UserOrderVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
transaction_id?: String;
transaction_type?: String;
user_id?: String;
user_name?: String;
user_email?: String;
user_contact_number?: String;
order_paid_currency?: String;
order_paid_price?: String;
order_status?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_transaction_id?: SortField;
sort_transaction_type?: SortField;
sort_user_id?: SortField;
sort_user_name?: SortField;
sort_user_email?: SortField;
sort_user_contact_number?: SortField;
sort_order_paid_currency?: SortField;
sort_order_paid_price?: SortField;
sort_order_status?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_transaction_id?: String;
where_like_transaction_type?: String;
where_like_user_id?: String;
where_like_user_name?: String;
where_like_user_email?: String;
where_like_user_contact_number?: String;
where_like_order_paid_currency?: String;
where_like_order_paid_price?: String;
where_like_order_status?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_transaction_id?: String;
where_not_transaction_type?: String;
where_not_user_id?: String;
where_not_user_name?: String;
where_not_user_email?: String;
where_not_user_contact_number?: String;
where_not_order_paid_currency?: String;
where_not_order_paid_price?: String;
where_not_order_status?: String;
}

export function useUserOrderLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ userOrder: WithPagination<TData> }, UserOrderVars>
) {
    return useLazyQuery<{userOrder: WithPagination<TData>}, UserOrderVars>(userOrderQuery(fragment), options);
}

export function useUserOrderQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{userOrder: WithPagination<TData>}, UserOrderVars>) {
    return useQuery<{userOrder: WithPagination<TData>}, UserOrderVars>(userOrderQuery(fragment), options);
}

export function userOrderQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query UserOrder(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$transaction_id: String,
$transaction_type: String,
$user_id: String,
$user_name: String,
$user_email: String,
$user_contact_number: String,
$order_paid_currency: String,
$order_paid_price: String,
$order_status: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_transaction_id: String,
$sort_transaction_type: String,
$sort_user_id: String,
$sort_user_name: String,
$sort_user_email: String,
$sort_user_contact_number: String,
$sort_order_paid_currency: String,
$sort_order_paid_price: String,
$sort_order_status: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_transaction_id: String,
$where_like_transaction_type: String,
$where_like_user_id: String,
$where_like_user_name: String,
$where_like_user_email: String,
$where_like_user_contact_number: String,
$where_like_order_paid_currency: String,
$where_like_order_paid_price: String,
$where_like_order_status: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_transaction_id: String,
$where_not_transaction_type: String,
$where_not_user_id: String,
$where_not_user_name: String,
$where_not_user_email: String,
$where_not_user_contact_number: String,
$where_not_order_paid_currency: String,
$where_not_order_paid_price: String,
$where_not_order_status: String,
    ) {
        userOrder(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
transaction_id: $transaction_id,
transaction_type: $transaction_type,
user_id: $user_id,
user_name: $user_name,
user_email: $user_email,
user_contact_number: $user_contact_number,
order_paid_currency: $order_paid_currency,
order_paid_price: $order_paid_price,
order_status: $order_status,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_transaction_id: $sort_transaction_id,
sort_transaction_type: $sort_transaction_type,
sort_user_id: $sort_user_id,
sort_user_name: $sort_user_name,
sort_user_email: $sort_user_email,
sort_user_contact_number: $sort_user_contact_number,
sort_order_paid_currency: $sort_order_paid_currency,
sort_order_paid_price: $sort_order_paid_price,
sort_order_status: $sort_order_status,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_transaction_id: $where_like_transaction_id,
where_like_transaction_type: $where_like_transaction_type,
where_like_user_id: $where_like_user_id,
where_like_user_name: $where_like_user_name,
where_like_user_email: $where_like_user_email,
where_like_user_contact_number: $where_like_user_contact_number,
where_like_order_paid_currency: $where_like_order_paid_currency,
where_like_order_paid_price: $where_like_order_paid_price,
where_like_order_status: $where_like_order_status,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_transaction_id: $where_not_transaction_id,
where_not_transaction_type: $where_not_transaction_type,
where_not_user_id: $where_not_user_id,
where_not_user_name: $where_not_user_name,
where_not_user_email: $where_not_user_email,
where_not_user_contact_number: $where_not_user_contact_number,
where_not_order_paid_currency: $where_not_order_paid_currency,
where_not_order_paid_price: $where_not_order_paid_price,
where_not_order_status: $where_not_order_status,
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
