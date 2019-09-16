import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface ChangeUserCoverMutationVars {
  file: File;
}

export function useChangeUserCoverMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { changeUserCoverMutation: TData },
    ChangeUserCoverMutationVars
  >
) {
  return useMutation<
    { changeUserCoverMutation: TData },
    ChangeUserCoverMutationVars
  >(ChangeUserCoverMutation(fragment), options);
}

export function ChangeUserCoverMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation ChangeUserCoverMutation($file: Upload) {
      changeUserCoverMutation(file: $file) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
