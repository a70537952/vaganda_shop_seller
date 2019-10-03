import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";


disableFragmentWarnings();

export interface ShopNotificationSettingTypeVars {
    
type?: String;
}

export function useShopNotificationSettingTypeLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopNotificationSettingType: TData[] }, ShopNotificationSettingTypeVars>
) {
    return useLazyQuery<{shopNotificationSettingType: TData[]}, ShopNotificationSettingTypeVars>(shopNotificationSettingTypeQuery(fragment), options);
}

export function useShopNotificationSettingTypeQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopNotificationSettingType: TData[]}, ShopNotificationSettingTypeVars>) {
    return useQuery<{shopNotificationSettingType: TData[]}, ShopNotificationSettingTypeVars>(shopNotificationSettingTypeQuery(fragment), options);
}

export function shopNotificationSettingTypeQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopNotificationSettingType
    (
$type: String!,)
     {
        shopNotificationSettingType
        (
type: $type,)
        {
            ...fragment
        }
    }
    ${fragment}
`;
}
