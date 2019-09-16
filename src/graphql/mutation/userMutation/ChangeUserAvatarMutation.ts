import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface ChangeUserAvatarMutationVars {
    
userAvatar: File;
}

export function useChangeUserAvatarMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ changeUserAvatarMutation: TData }, ChangeUserAvatarMutationVars>) {
    return useMutation<{ changeUserAvatarMutation: TData }, ChangeUserAvatarMutationVars>(ChangeUserAvatarMutation(fragment), options);
}

export function ChangeUserAvatarMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation ChangeUserAvatarMutation
    (
$userAvatar: Upload,
)
    {
            changeUserAvatarMutation
            (
userAvatar: $userAvatar,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
