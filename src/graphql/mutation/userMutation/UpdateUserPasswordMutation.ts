import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateUserPasswordMutationVars {
  currentPassword: String;
  newPassword: String;
}

export function useUpdateUserPasswordMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateUserPasswordMutation: TData },
    UpdateUserPasswordMutationVars
  >
) {
  return useMutation<
    { updateUserPasswordMutation: TData },
    UpdateUserPasswordMutationVars
  >(UpdateUserPasswordMutation(fragment), options);
}

export function UpdateUserPasswordMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UpdateUserPasswordMutation(
      $currentPassword: String!
      $newPassword: String!
    ) {
      updateUserPasswordMutation(
        currentPassword: $currentPassword
        newPassword: $newPassword
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
