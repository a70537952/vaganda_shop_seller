import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface VagandaUserVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
user_id?: String;
vaganda_user_name?: String;
vaganda_user_gender?: String;
vaganda_user_id?: String;
vaganda_email?: String;
vaganda_access_token?: String;
vaganda_refresh_token?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_user_id?: SortField;
sort_vaganda_user_name?: SortField;
sort_vaganda_user_gender?: SortField;
sort_vaganda_user_id?: SortField;
sort_vaganda_email?: SortField;
sort_vaganda_access_token?: SortField;
sort_vaganda_refresh_token?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_user_id?: String;
where_like_vaganda_user_name?: String;
where_like_vaganda_user_gender?: String;
where_like_vaganda_user_id?: String;
where_like_vaganda_email?: String;
where_like_vaganda_access_token?: String;
where_like_vaganda_refresh_token?: String;
}

export function useVagandaUserLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ vagandaUser: WithPagination<TData> }, VagandaUserVars>
) {
    return useLazyQuery<{vagandaUser: WithPagination<TData>}, VagandaUserVars>(vagandaUserQuery(fragment), options);
}

export function useVagandaUserQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{vagandaUser: WithPagination<TData>}, VagandaUserVars>) {
    return useQuery<{vagandaUser: WithPagination<TData>}, VagandaUserVars>(vagandaUserQuery(fragment), options);
}

export function vagandaUserQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query VagandaUser(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$user_id: String,
$vaganda_user_name: String,
$vaganda_user_gender: String,
$vaganda_user_id: String,
$vaganda_email: String,
$vaganda_access_token: String,
$vaganda_refresh_token: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_user_id: String,
$sort_vaganda_user_name: String,
$sort_vaganda_user_gender: String,
$sort_vaganda_user_id: String,
$sort_vaganda_email: String,
$sort_vaganda_access_token: String,
$sort_vaganda_refresh_token: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_user_id: String,
$where_like_vaganda_user_name: String,
$where_like_vaganda_user_gender: String,
$where_like_vaganda_user_id: String,
$where_like_vaganda_email: String,
$where_like_vaganda_access_token: String,
$where_like_vaganda_refresh_token: String,
    ) {
        vagandaUser(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
user_id: $user_id,
vaganda_user_name: $vaganda_user_name,
vaganda_user_gender: $vaganda_user_gender,
vaganda_user_id: $vaganda_user_id,
vaganda_email: $vaganda_email,
vaganda_access_token: $vaganda_access_token,
vaganda_refresh_token: $vaganda_refresh_token,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_user_id: $sort_user_id,
sort_vaganda_user_name: $sort_vaganda_user_name,
sort_vaganda_user_gender: $sort_vaganda_user_gender,
sort_vaganda_user_id: $sort_vaganda_user_id,
sort_vaganda_email: $sort_vaganda_email,
sort_vaganda_access_token: $sort_vaganda_access_token,
sort_vaganda_refresh_token: $sort_vaganda_refresh_token,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_user_id: $where_like_user_id,
where_like_vaganda_user_name: $where_like_vaganda_user_name,
where_like_vaganda_user_gender: $where_like_vaganda_user_gender,
where_like_vaganda_user_id: $where_like_vaganda_user_id,
where_like_vaganda_email: $where_like_vaganda_email,
where_like_vaganda_access_token: $where_like_vaganda_access_token,
where_like_vaganda_refresh_token: $where_like_vaganda_refresh_token,
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
