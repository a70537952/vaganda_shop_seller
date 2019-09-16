import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { MutationHookOptions, useMutation } from "@apollo/react-hooks";

export function useSendResetPasswordEmailMutation(
  options?: MutationHookOptions
) {
  return useMutation(SendResetPasswordEmailMutation(), options);
}

export function SendResetPasswordEmailMutation(): DocumentNode {
  return gql`
    mutation SendResetPasswordEmailMutation($email: String!) {
      sendResetPasswordEmailMutation(email: $email) {
        id
      }
    }
  `;
}
