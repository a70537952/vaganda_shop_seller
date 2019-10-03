import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface UpdateShopNotificationSettingMutationVars {
    
shop_id: String;
type?: String;
title?: String;
is_enable?: boolean;
}

export function useUpdateShopNotificationSettingMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ updateShopNotificationSettingMutation: TData }, UpdateShopNotificationSettingMutationVars>) {
    return useMutation<{ updateShopNotificationSettingMutation: TData }, UpdateShopNotificationSettingMutationVars>(UpdateShopNotificationSettingMutation(fragment), options);
}

export function UpdateShopNotificationSettingMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation UpdateShopNotificationSettingMutation
    (
$shop_id: String!,
$type: String,
$title: String,
$is_enable: Boolean,
)
    {
            updateShopNotificationSettingMutation
            (
shop_id: $shop_id,
type: $type,
title: $title,
is_enable: $is_enable,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
