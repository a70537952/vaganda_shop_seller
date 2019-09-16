import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface AddProductTypeToUserCartMutationVars {
  product_type_id: number;
  quantity: number;
}

export function useAddProductTypeToUserCartMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { addProductTypeToUserCartMutation: TData },
    AddProductTypeToUserCartMutationVars
  >
) {
  return useMutation<
    { addProductTypeToUserCartMutation: TData },
    AddProductTypeToUserCartMutationVars
  >(AddProductTypeToUserCartMutation(fragment), options);
}

export function AddProductTypeToUserCartMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation AddProductTypeToUserCartMutation(
      $product_type_id: Int!
      $quantity: Int!
    ) {
      addProductTypeToUserCartMutation(
        product_type_id: $product_type_id
        quantity: $quantity
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
