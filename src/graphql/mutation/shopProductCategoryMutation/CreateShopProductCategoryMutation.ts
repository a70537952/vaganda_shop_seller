import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface CreateShopProductCategoryMutationVars {
    
shop_id: String;
title: String;
}

export function useCreateShopProductCategoryMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ createShopProductCategoryMutation: TData }, CreateShopProductCategoryMutationVars>) {
    return useMutation<{ createShopProductCategoryMutation: TData }, CreateShopProductCategoryMutationVars>(CreateShopProductCategoryMutation(fragment), options);
}

export function CreateShopProductCategoryMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation CreateShopProductCategoryMutation
    (
$shop_id: String!,
$title: String!,
)
    {
            createShopProductCategoryMutation
            (
shop_id: $shop_id,
title: $title,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
