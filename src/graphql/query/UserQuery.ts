import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface UserVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
username?: String;
name?: String;
password?: String;
email?: String;
role_id?: String;
ip?: String;
last_login_at?: String;
email_verified_at?: String;
remember_token?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_username?: SortField;
sort_name?: SortField;
sort_password?: SortField;
sort_email?: SortField;
sort_role_id?: SortField;
sort_ip?: SortField;
sort_last_login_at?: SortField;
sort_email_verified_at?: SortField;
sort_remember_token?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_username?: String;
where_like_name?: String;
where_like_password?: String;
where_like_email?: String;
where_like_role_id?: String;
where_like_ip?: String;
where_like_last_login_at?: String;
where_like_email_verified_at?: String;
where_like_remember_token?: String;
except_self?: boolean;
}

export function useUserLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ user: WithPagination<TData> }, UserVars>
) {
    return useLazyQuery<{user: WithPagination<TData>}, UserVars>(userQuery(fragment), options);
}

export function useUserQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{user: WithPagination<TData>}, UserVars>) {
    return useQuery<{user: WithPagination<TData>}, UserVars>(userQuery(fragment), options);
}

export function userQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query User(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$username: String,
$name: String,
$password: String,
$email: String,
$role_id: String,
$ip: String,
$last_login_at: String,
$email_verified_at: String,
$remember_token: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_username: String,
$sort_name: String,
$sort_password: String,
$sort_email: String,
$sort_role_id: String,
$sort_ip: String,
$sort_last_login_at: String,
$sort_email_verified_at: String,
$sort_remember_token: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_username: String,
$where_like_name: String,
$where_like_password: String,
$where_like_email: String,
$where_like_role_id: String,
$where_like_ip: String,
$where_like_last_login_at: String,
$where_like_email_verified_at: String,
$where_like_remember_token: String,
$except_self: Boolean,
    ) {
        user(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
username: $username,
name: $name,
password: $password,
email: $email,
role_id: $role_id,
ip: $ip,
last_login_at: $last_login_at,
email_verified_at: $email_verified_at,
remember_token: $remember_token,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_username: $sort_username,
sort_name: $sort_name,
sort_password: $sort_password,
sort_email: $sort_email,
sort_role_id: $sort_role_id,
sort_ip: $sort_ip,
sort_last_login_at: $sort_last_login_at,
sort_email_verified_at: $sort_email_verified_at,
sort_remember_token: $sort_remember_token,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_username: $where_like_username,
where_like_name: $where_like_name,
where_like_password: $where_like_password,
where_like_email: $where_like_email,
where_like_role_id: $where_like_role_id,
where_like_ip: $where_like_ip,
where_like_last_login_at: $where_like_last_login_at,
where_like_email_verified_at: $where_like_email_verified_at,
where_like_remember_token: $where_like_remember_token,
except_self: $except_self,
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
