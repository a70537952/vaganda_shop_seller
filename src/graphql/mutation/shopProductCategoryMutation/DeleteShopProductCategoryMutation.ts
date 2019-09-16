import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface DeleteShopProductCategoryMutationVars {
  shop_id: String;
  shop_product_category_ids: String[];
}

export function useDeleteShopProductCategoryMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { deleteShopProductCategoryMutation: TData[] },
    DeleteShopProductCategoryMutationVars
  >
) {
  return useMutation<
    { deleteShopProductCategoryMutation: TData[] },
    DeleteShopProductCategoryMutationVars
  >(DeleteShopProductCategoryMutation(fragment), options);
}

export function DeleteShopProductCategoryMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation DeleteShopProductCategoryMutation(
      $shop_id: String!
      $shop_product_category_ids: [String]!
    ) {
      deleteShopProductCategoryMutation(
        shop_id: $shop_id
        shop_product_category_ids: $shop_product_category_ids
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
