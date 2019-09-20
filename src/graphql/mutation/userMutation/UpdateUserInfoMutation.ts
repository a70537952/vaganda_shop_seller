import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface UpdateUserInfoMutationVars {
    
name?: String;
gender?: number;
}

export function useUpdateUserInfoMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ updateUserInfoMutation: TData }, UpdateUserInfoMutationVars>) {
    return useMutation<{ updateUserInfoMutation: TData }, UpdateUserInfoMutationVars>(UpdateUserInfoMutation(fragment), options);
}

export function UpdateUserInfoMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation UpdateUserInfoMutation
    (
$name: String,
$gender: Int,
)
    {
            updateUserInfoMutation
            (
name: $name,
gender: $gender,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
