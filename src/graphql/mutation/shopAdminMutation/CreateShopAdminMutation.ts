import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface CreateShopAdminMutationVars {
    
shop_id: String;
user_id: String;
shop_admin_role_id: String;
}

export function useCreateShopAdminMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ createShopAdminMutation: TData }, CreateShopAdminMutationVars>) {
    return useMutation<{ createShopAdminMutation: TData }, CreateShopAdminMutationVars>(CreateShopAdminMutation(fragment), options);
}

export function CreateShopAdminMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation CreateShopAdminMutation
    (
$shop_id: String!,
$user_id: String!,
$shop_admin_role_id: String!,
)
    {
            createShopAdminMutation
            (
shop_id: $shop_id,
user_id: $user_id,
shop_admin_role_id: $shop_admin_role_id,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
