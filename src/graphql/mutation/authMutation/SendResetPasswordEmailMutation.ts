import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface SendResetPasswordEmailMutationVars {
  email: String;
}

export function useSendResetPasswordEmailMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { sendResetPasswordEmailMutation: TData },
    SendResetPasswordEmailMutationVars
  >
) {
  return useMutation<
    { sendResetPasswordEmailMutation: TData },
    SendResetPasswordEmailMutationVars
  >(SendResetPasswordEmailMutation(fragment), options);
}

export function SendResetPasswordEmailMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation SendResetPasswordEmailMutation($email: String!) {
      sendResetPasswordEmailMutation(email: $email) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
