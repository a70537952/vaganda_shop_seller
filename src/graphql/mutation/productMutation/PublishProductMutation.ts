import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface PublishProductMutationVars {
    
shop_id: String;
productIds: String[];
}

export function usePublishProductMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ publishProductMutation: TData[] }, PublishProductMutationVars>) {
    return useMutation<{ publishProductMutation: TData[] }, PublishProductMutationVars>(PublishProductMutation(fragment), options);
}

export function PublishProductMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation PublishProductMutation
    (
$shop_id: String!,
$productIds: [String]!,
)
    {
            publishProductMutation
            (
shop_id: $shop_id,
productIds: $productIds,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
