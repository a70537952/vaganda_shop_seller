import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface ResetUserPasswordMutationVars {
    
token: String;
password: String;
}

export function useResetUserPasswordMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ resetUserPasswordMutation: TData }, ResetUserPasswordMutationVars>) {
    return useMutation<{ resetUserPasswordMutation: TData }, ResetUserPasswordMutationVars>(ResetUserPasswordMutation(fragment), options);
}

export function ResetUserPasswordMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation ResetUserPasswordMutation
    (
$token: String!,
$password: String!,
)
    {
            resetUserPasswordMutation
            (
token: $token,
password: $password,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
