import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UnpublishProductMutationVars {
  shop_id: String;
  productIds: String[];
}

export function useUnpublishProductMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { unpublishProductMutation: TData[] },
    UnpublishProductMutationVars
  >
) {
  return useMutation<
    { unpublishProductMutation: TData[] },
    UnpublishProductMutationVars
  >(UnpublishProductMutation(fragment), options);
}

export function UnpublishProductMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation UnpublishProductMutation(
      $shop_id: String!
      $productIds: [String]!
    ) {
      unpublishProductMutation(shop_id: $shop_id, productIds: $productIds) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
