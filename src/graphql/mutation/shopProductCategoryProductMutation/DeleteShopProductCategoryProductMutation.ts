import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface DeleteShopProductCategoryProductMutationVars {
    
shop_id: String;
shop_product_category_ids: String[];
product_ids: String[];
}

export function useDeleteShopProductCategoryProductMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ deleteShopProductCategoryProductMutation: TData[] }, DeleteShopProductCategoryProductMutationVars>) {
    return useMutation<{ deleteShopProductCategoryProductMutation: TData[] }, DeleteShopProductCategoryProductMutationVars>(DeleteShopProductCategoryProductMutation(fragment), options);
}

export function DeleteShopProductCategoryProductMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation DeleteShopProductCategoryProductMutation
    (
$shop_id: String!,
$shop_product_category_ids: [String]!,
$product_ids: [String]!,
)
    {
            deleteShopProductCategoryProductMutation
            (
shop_id: $shop_id,
shop_product_category_ids: $shop_product_category_ids,
product_ids: $product_ids,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
