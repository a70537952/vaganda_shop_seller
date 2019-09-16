import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface DeleteProductMutationVars {
  shop_id: String;
  productIds: String[];
}

export function useDeleteProductMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { deleteProductMutation: TData[] },
    DeleteProductMutationVars
  >
) {
  return useMutation<
    { deleteProductMutation: TData[] },
    DeleteProductMutationVars
  >(DeleteProductMutation(fragment), options);
}

export function DeleteProductMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation DeleteProductMutation($shop_id: String!, $productIds: [String]!) {
      deleteProductMutation(shop_id: $shop_id, productIds: $productIds) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
