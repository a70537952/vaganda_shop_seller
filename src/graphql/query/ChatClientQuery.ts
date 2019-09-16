import gql, { disableFragmentWarnings } from "graphql-tag";
import { DocumentNode } from "graphql";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";

import { SortField, WithPagination } from "./Query";

disableFragmentWarnings();

export interface ChatClientVars {
  offset?: number;
  limit?: number;
  created_at?: String;
  updated_at?: String;
  id?: String;
  chat_id?: String;
  client_type?: String;
  client_id?: String;
  is_open_chat?: String;
  is_read?: String;
  sort_created_at?: SortField;
  sort_updated_at?: SortField;
  sort_id?: SortField;
  sort_chat_id?: SortField;
  sort_client_type?: SortField;
  sort_client_id?: SortField;
  sort_is_open_chat?: SortField;
  sort_is_read?: SortField;
  where_like_created_at?: String;
  where_like_updated_at?: String;
  where_like_id?: String;
  where_like_chat_id?: String;
  where_like_client_type?: String;
  where_like_client_id?: String;
  where_like_is_open_chat?: String;
  where_like_is_read?: String;
  where_not_created_at?: String;
  where_not_updated_at?: String;
  where_not_id?: String;
  where_not_chat_id?: String;
  where_not_client_type?: String;
  where_not_client_id?: String;
  where_not_is_open_chat?: String;
  where_not_is_read?: String;
}

export function useChatClientQuery<TData = any>(
  fragment: DocumentNode,
  options?: QueryHookOptions<
    { chatClient: WithPagination<TData> },
    ChatClientVars
  >
) {
  return useQuery<{ chatClient: WithPagination<TData> }, ChatClientVars>(
    chatClientQuery(fragment),
    options
  );
}

export function chatClientQuery(fragment: DocumentNode): DocumentNode {
  return gql`
    query ChatClient(
      $offset: Int
      $limit: Int
      $created_at: String
      $updated_at: String
      $id: ID
      $chat_id: String
      $client_type: String
      $client_id: String
      $is_open_chat: String
      $is_read: String
      $sort_created_at: String
      $sort_updated_at: String
      $sort_id: String
      $sort_chat_id: String
      $sort_client_type: String
      $sort_client_id: String
      $sort_is_open_chat: String
      $sort_is_read: String
      $where_like_created_at: String
      $where_like_updated_at: String
      $where_like_id: String
      $where_like_chat_id: String
      $where_like_client_type: String
      $where_like_client_id: String
      $where_like_is_open_chat: String
      $where_like_is_read: String
      $where_not_created_at: String
      $where_not_updated_at: String
      $where_not_id: String
      $where_not_chat_id: String
      $where_not_client_type: String
      $where_not_client_id: String
      $where_not_is_open_chat: String
      $where_not_is_read: String
    ) {
      chatClient(
        offset: $offset
        limit: $limit
        created_at: $created_at
        updated_at: $updated_at
        id: $id
        chat_id: $chat_id
        client_type: $client_type
        client_id: $client_id
        is_open_chat: $is_open_chat
        is_read: $is_read
        sort_created_at: $sort_created_at
        sort_updated_at: $sort_updated_at
        sort_id: $sort_id
        sort_chat_id: $sort_chat_id
        sort_client_type: $sort_client_type
        sort_client_id: $sort_client_id
        sort_is_open_chat: $sort_is_open_chat
        sort_is_read: $sort_is_read
        where_like_created_at: $where_like_created_at
        where_like_updated_at: $where_like_updated_at
        where_like_id: $where_like_id
        where_like_chat_id: $where_like_chat_id
        where_like_client_type: $where_like_client_type
        where_like_client_id: $where_like_client_id
        where_like_is_open_chat: $where_like_is_open_chat
        where_like_is_read: $where_like_is_read
        where_not_created_at: $where_not_created_at
        where_not_updated_at: $where_not_updated_at
        where_not_id: $where_not_id
        where_not_chat_id: $where_not_chat_id
        where_not_client_type: $where_not_client_type
        where_not_client_id: $where_not_client_id
        where_not_is_open_chat: $where_not_is_open_chat
        where_not_is_read: $where_not_is_read
      ) {
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
