import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ChatVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
title?: String;
description?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_title?: SortField;
sort_description?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_title?: String;
where_like_description?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_title?: String;
where_not_description?: String;
}

export function useChatLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ chat: WithPagination<TData> }, ChatVars>
) {
    return useLazyQuery<{chat: WithPagination<TData>}, ChatVars>(chatQuery(fragment), options);
}

export function useChatQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{chat: WithPagination<TData>}, ChatVars>) {
    return useQuery<{chat: WithPagination<TData>}, ChatVars>(chatQuery(fragment), options);
}

export function chatQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query Chat
    (
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$title: String,
$description: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_title: String,
$sort_description: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_title: String,
$where_like_description: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_title: String,
$where_not_description: String,)
     {
        chat
        (
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
title: $title,
description: $description,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_title: $sort_title,
sort_description: $sort_description,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_title: $where_like_title,
where_like_description: $where_like_description,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_title: $where_not_title,
where_not_description: $where_not_description,)
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
