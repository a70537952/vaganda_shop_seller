import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {SortField} from "./Query";

disableFragmentWarnings();

export interface ShopNotificationSettingVars {
    
created_at?: String;
updated_at?: String;
id?: String;
shop_id?: String;
type?: String;
title?: String;
is_enable?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_shop_id?: SortField;
sort_type?: SortField;
sort_title?: SortField;
sort_is_enable?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_shop_id?: String;
where_like_type?: String;
where_like_title?: String;
where_like_is_enable?: String;
where_not_created_at?: String;
where_not_updated_at?: String;
where_not_id?: String;
where_not_shop_id?: String;
where_not_type?: String;
where_not_title?: String;
where_not_is_enable?: String;
}

export function useShopNotificationSettingLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopNotificationSetting: TData[] }, ShopNotificationSettingVars>
) {
    return useLazyQuery<{shopNotificationSetting: TData[]}, ShopNotificationSettingVars>(shopNotificationSettingQuery(fragment), options);
}

export function useShopNotificationSettingQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopNotificationSetting: TData[]}, ShopNotificationSettingVars>) {
    return useQuery<{shopNotificationSetting: TData[]}, ShopNotificationSettingVars>(shopNotificationSettingQuery(fragment), options);
}

export function shopNotificationSettingQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopNotificationSetting
    (
$created_at: String,
$updated_at: String,
$id: ID,
$shop_id: String,
$type: String,
$title: String,
$is_enable: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_shop_id: String,
$sort_type: String,
$sort_title: String,
$sort_is_enable: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_shop_id: String,
$where_like_type: String,
$where_like_title: String,
$where_like_is_enable: String,
$where_not_created_at: String,
$where_not_updated_at: String,
$where_not_id: String,
$where_not_shop_id: String,
$where_not_type: String,
$where_not_title: String,
$where_not_is_enable: String,)
     {
        shopNotificationSetting
        (
created_at: $created_at,
updated_at: $updated_at,
id: $id,
shop_id: $shop_id,
type: $type,
title: $title,
is_enable: $is_enable,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_shop_id: $sort_shop_id,
sort_type: $sort_type,
sort_title: $sort_title,
sort_is_enable: $sort_is_enable,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_shop_id: $where_like_shop_id,
where_like_type: $where_like_type,
where_like_title: $where_like_title,
where_like_is_enable: $where_like_is_enable,
where_not_created_at: $where_not_created_at,
where_not_updated_at: $where_not_updated_at,
where_not_id: $where_not_id,
where_not_shop_id: $where_not_shop_id,
where_not_type: $where_not_type,
where_not_title: $where_not_title,
where_not_is_enable: $where_not_is_enable,)
        {
            ...fragment
        }
    }
    ${fragment}
`;
}
