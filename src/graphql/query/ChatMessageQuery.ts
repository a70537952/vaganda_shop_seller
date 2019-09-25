import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ChatMessageVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
chat_id?: String;
client_type?: String;
client_id?: String;
body?: String;
type?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_chat_id?: SortField;
sort_client_type?: SortField;
sort_client_id?: SortField;
sort_body?: SortField;
sort_type?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_chat_id?: String;
where_like_client_type?: String;
where_like_client_id?: String;
where_like_body?: String;
where_like_type?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_chat_id?: String;
where_not_client_type?: String;
where_not_client_id?: String;
where_not_body?: String;
where_not_type?: String;
}

export function useChatMessageLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ chatMessage: WithPagination<TData> }, ChatMessageVars>
) {
    return useLazyQuery<{chatMessage: WithPagination<TData>}, ChatMessageVars>(chatMessageQuery(fragment), options);
}

export function useChatMessageQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{chatMessage: WithPagination<TData>}, ChatMessageVars>) {
    return useQuery<{chatMessage: WithPagination<TData>}, ChatMessageVars>(chatMessageQuery(fragment), options);
}

export function chatMessageQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ChatMessage(
    
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$chat_id: String,
$client_type: String,
$client_id: String,
$body: String,
$type: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_chat_id: String,
$sort_client_type: String,
$sort_client_id: String,
$sort_body: String,
$sort_type: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_chat_id: String,
$where_like_client_type: String,
$where_like_client_id: String,
$where_like_body: String,
$where_like_type: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_chat_id: String,
$where_not_client_type: String,
$where_not_client_id: String,
$where_not_body: String,
$where_not_type: String,
    ) {
        chatMessage(
        
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
chat_id: $chat_id,
client_type: $client_type,
client_id: $client_id,
body: $body,
type: $type,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_chat_id: $sort_chat_id,
sort_client_type: $sort_client_type,
sort_client_id: $sort_client_id,
sort_body: $sort_body,
sort_type: $sort_type,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_chat_id: $where_like_chat_id,
where_like_client_type: $where_like_client_type,
where_like_client_id: $where_like_client_id,
where_like_body: $where_like_body,
where_like_type: $where_like_type,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_chat_id: $where_not_chat_id,
where_not_client_type: $where_not_client_type,
where_not_client_id: $where_not_client_id,
where_not_body: $where_not_body,
where_not_type: $where_not_type,
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
