import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface PasswordResetVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
email?: String;
token?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_email?: SortField;
sort_token?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_email?: String;
where_like_token?: String;
}

export function usePasswordResetLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ passwordReset: WithPagination<TData> }, PasswordResetVars>
) {
    return useLazyQuery<{passwordReset: WithPagination<TData>}, PasswordResetVars>(passwordResetQuery(fragment), options);
}

export function usePasswordResetQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{passwordReset: WithPagination<TData>}, PasswordResetVars>) {
    return useQuery<{passwordReset: WithPagination<TData>}, PasswordResetVars>(passwordResetQuery(fragment), options);
}

export function passwordResetQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query PasswordReset
    (
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$email: String,
$token: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_email: String,
$sort_token: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_email: String,
$where_like_token: String,)
     {
        passwordReset
        (
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
email: $email,
token: $token,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_email: $sort_email,
sort_token: $sort_token,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_email: $where_like_email,
where_like_token: $where_like_token,)
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
