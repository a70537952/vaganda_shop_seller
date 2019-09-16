import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface EditShopAdminRoleMutationVars {
    
shop_id: String;
shop_admin_role_id: String;
title: String;
permission: String[];
}

export function useEditShopAdminRoleMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ editShopAdminRoleMutation: TData }, EditShopAdminRoleMutationVars>) {
    return useMutation<{ editShopAdminRoleMutation: TData }, EditShopAdminRoleMutationVars>(EditShopAdminRoleMutation(fragment), options);
}

export function EditShopAdminRoleMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation EditShopAdminRoleMutation
    (
$shop_id: String!,
$shop_admin_role_id: String!,
$title: String!,
$permission: [String]!,
)
    {
            editShopAdminRoleMutation
            (
shop_id: $shop_id,
shop_admin_role_id: $shop_admin_role_id,
title: $title,
permission: $permission,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
