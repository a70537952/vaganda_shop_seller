import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface UpdateShopAccountMutationVars {
    
shop_id: String;
account?: String;
}

export function useUpdateShopAccountMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ updateShopAccountMutation: TData }, UpdateShopAccountMutationVars>) {
    return useMutation<{ updateShopAccountMutation: TData }, UpdateShopAccountMutationVars>(UpdateShopAccountMutation(fragment), options);
}

export function UpdateShopAccountMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation UpdateShopAccountMutation
    (
$shop_id: String!,
$account: String,
)
    {
            updateShopAccountMutation
            (
shop_id: $shop_id,
account: $account,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
