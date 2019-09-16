import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface CreateShopProductCategoryProductMutationVars {
    
shop_id: String;
shop_product_category_ids: String[];
product_ids: String[];
}

export function useCreateShopProductCategoryProductMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ createShopProductCategoryProductMutation: TData[] }, CreateShopProductCategoryProductMutationVars>) {
    return useMutation<{ createShopProductCategoryProductMutation: TData[] }, CreateShopProductCategoryProductMutationVars>(CreateShopProductCategoryProductMutation(fragment), options);
}

export function CreateShopProductCategoryProductMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation CreateShopProductCategoryProductMutation
    (
$shop_id: String!,
$shop_product_category_ids: [String]!,
$product_ids: [String]!,
)
    {
            createShopProductCategoryProductMutation
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
