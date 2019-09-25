import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface BraintreeTransactionVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
pay_for?: String;
pay_for_reference_id?: String;
transaction_id?: String;
braintree_status?: String;
currency?: String;
amount?: String;
status?: String;
error?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_pay_for?: SortField;
sort_pay_for_reference_id?: SortField;
sort_transaction_id?: SortField;
sort_braintree_status?: SortField;
sort_currency?: SortField;
sort_amount?: SortField;
sort_status?: SortField;
sort_error?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_pay_for?: String;
where_like_pay_for_reference_id?: String;
where_like_transaction_id?: String;
where_like_braintree_status?: String;
where_like_currency?: String;
where_like_amount?: String;
where_like_status?: String;
where_like_error?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_pay_for?: String;
where_not_pay_for_reference_id?: String;
where_not_transaction_id?: String;
where_not_braintree_status?: String;
where_not_currency?: String;
where_not_amount?: String;
where_not_status?: String;
where_not_error?: String;
}

export function useBraintreeTransactionLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ braintreeTransaction: WithPagination<TData> }, BraintreeTransactionVars>
) {
    return useLazyQuery<{braintreeTransaction: WithPagination<TData>}, BraintreeTransactionVars>(braintreeTransactionQuery(fragment), options);
}

export function useBraintreeTransactionQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{braintreeTransaction: WithPagination<TData>}, BraintreeTransactionVars>) {
    return useQuery<{braintreeTransaction: WithPagination<TData>}, BraintreeTransactionVars>(braintreeTransactionQuery(fragment), options);
}

export function braintreeTransactionQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query BraintreeTransaction(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$pay_for: String,
$pay_for_reference_id: String,
$transaction_id: String,
$braintree_status: String,
$currency: String,
$amount: String,
$status: String,
$error: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_pay_for: String,
$sort_pay_for_reference_id: String,
$sort_transaction_id: String,
$sort_braintree_status: String,
$sort_currency: String,
$sort_amount: String,
$sort_status: String,
$sort_error: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_pay_for: String,
$where_like_pay_for_reference_id: String,
$where_like_transaction_id: String,
$where_like_braintree_status: String,
$where_like_currency: String,
$where_like_amount: String,
$where_like_status: String,
$where_like_error: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_pay_for: String,
$where_not_pay_for_reference_id: String,
$where_not_transaction_id: String,
$where_not_braintree_status: String,
$where_not_currency: String,
$where_not_amount: String,
$where_not_status: String,
$where_not_error: String,
    ) {
        braintreeTransaction(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
pay_for: $pay_for,
pay_for_reference_id: $pay_for_reference_id,
transaction_id: $transaction_id,
braintree_status: $braintree_status,
currency: $currency,
amount: $amount,
status: $status,
error: $error,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_pay_for: $sort_pay_for,
sort_pay_for_reference_id: $sort_pay_for_reference_id,
sort_transaction_id: $sort_transaction_id,
sort_braintree_status: $sort_braintree_status,
sort_currency: $sort_currency,
sort_amount: $sort_amount,
sort_status: $sort_status,
sort_error: $sort_error,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_pay_for: $where_like_pay_for,
where_like_pay_for_reference_id: $where_like_pay_for_reference_id,
where_like_transaction_id: $where_like_transaction_id,
where_like_braintree_status: $where_like_braintree_status,
where_like_currency: $where_like_currency,
where_like_amount: $where_like_amount,
where_like_status: $where_like_status,
where_like_error: $where_like_error,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_pay_for: $where_not_pay_for,
where_not_pay_for_reference_id: $where_not_pay_for_reference_id,
where_not_transaction_id: $where_not_transaction_id,
where_not_braintree_status: $where_not_braintree_status,
where_not_currency: $where_not_currency,
where_not_amount: $where_not_amount,
where_not_status: $where_not_status,
where_not_error: $where_not_error,
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
