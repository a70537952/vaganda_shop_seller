import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface SetUserCartQuantityMutationVars {
  user_cart_id: number;
  quantity: number;
}

export function useSetUserCartQuantityMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { setUserCartQuantityMutation: TData },
    SetUserCartQuantityMutationVars
  >
) {
  return useMutation<
    { setUserCartQuantityMutation: TData },
    SetUserCartQuantityMutationVars
  >(SetUserCartQuantityMutation(fragment), options);
}

export function SetUserCartQuantityMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation SetUserCartQuantityMutation($user_cart_id: Int!, $quantity: Int!) {
      setUserCartQuantityMutation(
        user_cart_id: $user_cart_id
        quantity: $quantity
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
