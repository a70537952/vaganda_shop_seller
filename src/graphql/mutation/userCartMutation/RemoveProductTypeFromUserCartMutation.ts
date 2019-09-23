import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface RemoveProductTypeFromUserCartMutationVars {
    
user_cart_ids: String[];
}

export function useRemoveProductTypeFromUserCartMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ removeProductTypeFromUserCartMutation: TData[] }, RemoveProductTypeFromUserCartMutationVars>) {
    return useMutation<{ removeProductTypeFromUserCartMutation: TData[] }, RemoveProductTypeFromUserCartMutationVars>(RemoveProductTypeFromUserCartMutation(fragment), options);
}

export function RemoveProductTypeFromUserCartMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation RemoveProductTypeFromUserCartMutation
    (
$user_cart_ids: [String]!,
)
    {
            removeProductTypeFromUserCartMutation
            (
user_cart_ids: $user_cart_ids,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
