import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

import UserOrderInput from '../../input/UserOrderInput';

interface CreateUserOrderMutationVars {
  paymentNonce: String;
  userOrderInputs: UserOrderInput[];
}

export function useCreateUserOrderMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { createUserOrderMutation: TData },
    CreateUserOrderMutationVars
  >
) {
  return useMutation<
    { createUserOrderMutation: TData },
    CreateUserOrderMutationVars
  >(CreateUserOrderMutation(fragment), options);
}

export function CreateUserOrderMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation CreateUserOrderMutation(
      $paymentNonce: String!
      $userOrderInputs: [UserOrderInput]!
    ) {
      createUserOrderMutation(
        paymentNonce: $paymentNonce
        userOrderInputs: $userOrderInputs
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
