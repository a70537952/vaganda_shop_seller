import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface RemoveUserAvatarMutationVars {}

export function useRemoveUserAvatarMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { removeUserAvatarMutation: TData },
    RemoveUserAvatarMutationVars
  >
) {
  return useMutation<
    { removeUserAvatarMutation: TData },
    RemoveUserAvatarMutationVars
  >(RemoveUserAvatarMutation(fragment), options);
}

export function RemoveUserAvatarMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation RemoveUserAvatarMutation(
    
    ){
            removeUserAvatarMutation(
            
            ){
             ...fragment
           }
        }
    ${fragment}
`;
}
