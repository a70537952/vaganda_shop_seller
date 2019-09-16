import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateShopCategoryMutationVars {
  shop_id: String;
  shop_category_id: String;
}

export function useUpdateShopCategoryMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateShopCategoryMutation: TData },
    UpdateShopCategoryMutationVars
  >
) {
  return useMutation<
    { updateShopCategoryMutation: TData },
    UpdateShopCategoryMutationVars
  >(UpdateShopCategoryMutation(fragment), options);
}

export function UpdateShopCategoryMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UpdateShopCategoryMutation(
      $shop_id: String!
      $shop_category_id: String!
    ) {
      updateShopCategoryMutation(
        shop_id: $shop_id
        shop_category_id: $shop_category_id
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
