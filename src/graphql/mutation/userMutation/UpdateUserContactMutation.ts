import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateUserContactMutationVars {
  phoneCountryCode: String;
  phone: String;
}

export function useUpdateUserContactMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateUserContactMutation: TData },
    UpdateUserContactMutationVars
  >
) {
  return useMutation<
    { updateUserContactMutation: TData },
    UpdateUserContactMutationVars
  >(UpdateUserContactMutation(fragment), options);
}

export function UpdateUserContactMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UpdateUserContactMutation(
      $phoneCountryCode: String
      $phone: String
    ) {
      updateUserContactMutation(
        phoneCountryCode: $phoneCountryCode
        phone: $phone
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
