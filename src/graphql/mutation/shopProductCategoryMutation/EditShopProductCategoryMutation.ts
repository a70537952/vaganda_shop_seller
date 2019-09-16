import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface EditShopProductCategoryMutationVars {
    
shop_id: String;
shop_product_category_id: String;
title: String;
}

export function useEditShopProductCategoryMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ editShopProductCategoryMutation: TData }, EditShopProductCategoryMutationVars>) {
    return useMutation<{ editShopProductCategoryMutation: TData }, EditShopProductCategoryMutationVars>(EditShopProductCategoryMutation(fragment), options);
}

export function EditShopProductCategoryMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation EditShopProductCategoryMutation
    (
$shop_id: String!,
$shop_product_category_id: String!,
$title: String!,
)
    {
            editShopProductCategoryMutation
            (
shop_id: $shop_id,
shop_product_category_id: $shop_product_category_id,
title: $title,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
