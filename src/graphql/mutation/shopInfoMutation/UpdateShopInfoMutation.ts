import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface UpdateShopInfoMutationVars {
    
shop_id: String;
summary?: String;
}

export function useUpdateShopInfoMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ updateShopInfoMutation: TData }, UpdateShopInfoMutationVars>) {
    return useMutation<{ updateShopInfoMutation: TData }, UpdateShopInfoMutationVars>(UpdateShopInfoMutation(fragment), options);
}

export function UpdateShopInfoMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation UpdateShopInfoMutation
    (
$shop_id: String!,
$summary: String,
)
    {
            updateShopInfoMutation
            (
shop_id: $shop_id,
summary: $summary,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
