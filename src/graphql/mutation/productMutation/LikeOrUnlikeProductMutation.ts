import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface LikeOrUnlikeProductMutationVars {
  product_id: number;
}

export function useLikeOrUnlikeProductMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { likeOrUnlikeProductMutation: TData },
    LikeOrUnlikeProductMutationVars
  >
) {
  return useMutation<
    { likeOrUnlikeProductMutation: TData },
    LikeOrUnlikeProductMutationVars
  >(LikeOrUnlikeProductMutation(fragment), options);
}

export function LikeOrUnlikeProductMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation LikeOrUnlikeProductMutation($product_id: Int!) {
      likeOrUnlikeProductMutation(product_id: $product_id) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
