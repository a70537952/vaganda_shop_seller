import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface CreateShopAdminRoleMutationVars {
    
shop_id: String;
title: String;
permission: String[];
}

export function useCreateShopAdminRoleMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ createShopAdminRoleMutation: TData }, CreateShopAdminRoleMutationVars>) {
    return useMutation<{ createShopAdminRoleMutation: TData }, CreateShopAdminRoleMutationVars>(CreateShopAdminRoleMutation(fragment), options);
}

export function CreateShopAdminRoleMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation CreateShopAdminRoleMutation
    (
$shop_id: String!,
$title: String!,
$permission: [String]!,
)
    {
            createShopAdminRoleMutation
            (
shop_id: $shop_id,
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
