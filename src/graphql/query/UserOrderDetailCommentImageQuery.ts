import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface UserOrderDetailCommentImageVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
user_order_detail_comment_id?: String;
path?: String;
extension?: String;
mime_type?: String;
width?: String;
height?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_user_order_detail_comment_id?: SortField;
sort_path?: SortField;
sort_extension?: SortField;
sort_mime_type?: SortField;
sort_width?: SortField;
sort_height?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_user_order_detail_comment_id?: String;
where_like_path?: String;
where_like_extension?: String;
where_like_mime_type?: String;
where_like_width?: String;
where_like_height?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_user_order_detail_comment_id?: String;
where_not_path?: String;
where_not_extension?: String;
where_not_mime_type?: String;
where_not_width?: String;
where_not_height?: String;
}

export function useUserOrderDetailCommentImageLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ userOrderDetailCommentImage: WithPagination<TData> }, UserOrderDetailCommentImageVars>
) {
    return useLazyQuery<{userOrderDetailCommentImage: WithPagination<TData>}, UserOrderDetailCommentImageVars>(userOrderDetailCommentImageQuery(fragment), options);
}

export function useUserOrderDetailCommentImageQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{userOrderDetailCommentImage: WithPagination<TData>}, UserOrderDetailCommentImageVars>) {
    return useQuery<{userOrderDetailCommentImage: WithPagination<TData>}, UserOrderDetailCommentImageVars>(userOrderDetailCommentImageQuery(fragment), options);
}

export function userOrderDetailCommentImageQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query UserOrderDetailCommentImage
    (
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$user_order_detail_comment_id: String,
$path: String,
$extension: String,
$mime_type: String,
$width: String,
$height: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_user_order_detail_comment_id: String,
$sort_path: String,
$sort_extension: String,
$sort_mime_type: String,
$sort_width: String,
$sort_height: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_user_order_detail_comment_id: String,
$where_like_path: String,
$where_like_extension: String,
$where_like_mime_type: String,
$where_like_width: String,
$where_like_height: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_user_order_detail_comment_id: String,
$where_not_path: String,
$where_not_extension: String,
$where_not_mime_type: String,
$where_not_width: String,
$where_not_height: String,)
     {
        userOrderDetailCommentImage
        (
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
user_order_detail_comment_id: $user_order_detail_comment_id,
path: $path,
extension: $extension,
mime_type: $mime_type,
width: $width,
height: $height,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_user_order_detail_comment_id: $sort_user_order_detail_comment_id,
sort_path: $sort_path,
sort_extension: $sort_extension,
sort_mime_type: $sort_mime_type,
sort_width: $sort_width,
sort_height: $sort_height,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_user_order_detail_comment_id: $where_like_user_order_detail_comment_id,
where_like_path: $where_like_path,
where_like_extension: $where_like_extension,
where_like_mime_type: $where_like_mime_type,
where_like_width: $where_like_width,
where_like_height: $where_like_height,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_user_order_detail_comment_id: $where_not_user_order_detail_comment_id,
where_not_path: $where_not_path,
where_not_extension: $where_not_extension,
where_not_mime_type: $where_not_mime_type,
where_not_width: $where_not_width,
where_not_height: $where_not_height,)
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
