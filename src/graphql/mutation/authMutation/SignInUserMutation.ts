import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface SignInUserMutationVars {
  email: String;
  password: String;
}

export function useSignInUserMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { signInUserMutation: TData },
    SignInUserMutationVars
  >
) {
  return useMutation<{ signInUserMutation: TData }, SignInUserMutationVars>(
    SignInUserMutation(fragment),
    options
  );
}

export function SignInUserMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation SignInUserMutation($email: String!, $password: String!) {
      signInUserMutation(email: $email, password: $password) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
