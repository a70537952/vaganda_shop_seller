import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {WithPagination, SortField} from "./Query";

disableFragmentWarnings();

export interface ShopContactInfoVars {
    
offset?: number;
limit?: number;
created_at?: String;
updated_at?: String;
id?: String;
shop_id?: String;
email?: String;
website?: String;
telephone_country_code?: String;
telephone?: String;
phone_country_code?: String;
phone?: String;
is_phone_verified?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_shop_id?: SortField;
sort_email?: SortField;
sort_website?: SortField;
sort_telephone_country_code?: SortField;
sort_telephone?: SortField;
sort_phone_country_code?: SortField;
sort_phone?: SortField;
sort_is_phone_verified?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_shop_id?: String;
where_like_email?: String;
where_like_website?: String;
where_like_telephone_country_code?: String;
where_like_telephone?: String;
where_like_phone_country_code?: String;
where_like_phone?: String;
where_like_is_phone_verified?: String;
}

export function useShopContactInfoLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopContactInfo: WithPagination<TData> }, ShopContactInfoVars>
) {
    return useLazyQuery<{shopContactInfo: WithPagination<TData>}, ShopContactInfoVars>(shopContactInfoQuery(fragment), options);
}

export function useShopContactInfoQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopContactInfo: WithPagination<TData>}, ShopContactInfoVars>) {
    return useQuery<{shopContactInfo: WithPagination<TData>}, ShopContactInfoVars>(shopContactInfoQuery(fragment), options);
}

export function shopContactInfoQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopContactInfo
    (
$offset: Int,
$limit: Int,
$created_at: String,
$updated_at: String,
$id: ID,
$shop_id: String,
$email: String,
$website: String,
$telephone_country_code: String,
$telephone: String,
$phone_country_code: String,
$phone: String,
$is_phone_verified: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_shop_id: String,
$sort_email: String,
$sort_website: String,
$sort_telephone_country_code: String,
$sort_telephone: String,
$sort_phone_country_code: String,
$sort_phone: String,
$sort_is_phone_verified: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_shop_id: String,
$where_like_email: String,
$where_like_website: String,
$where_like_telephone_country_code: String,
$where_like_telephone: String,
$where_like_phone_country_code: String,
$where_like_phone: String,
$where_like_is_phone_verified: String,)
     {
        shopContactInfo
        (
offset: $offset,
limit: $limit,
created_at: $created_at,
updated_at: $updated_at,
id: $id,
shop_id: $shop_id,
email: $email,
website: $website,
telephone_country_code: $telephone_country_code,
telephone: $telephone,
phone_country_code: $phone_country_code,
phone: $phone,
is_phone_verified: $is_phone_verified,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_shop_id: $sort_shop_id,
sort_email: $sort_email,
sort_website: $sort_website,
sort_telephone_country_code: $sort_telephone_country_code,
sort_telephone: $sort_telephone,
sort_phone_country_code: $sort_phone_country_code,
sort_phone: $sort_phone,
sort_is_phone_verified: $sort_is_phone_verified,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_shop_id: $where_like_shop_id,
where_like_email: $where_like_email,
where_like_website: $where_like_website,
where_like_telephone_country_code: $where_like_telephone_country_code,
where_like_telephone: $where_like_telephone,
where_like_phone_country_code: $where_like_phone_country_code,
where_like_phone: $where_like_phone,
where_like_is_phone_verified: $where_like_is_phone_verified,)
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
