import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface SignUpUserMutationVars {
    
username: String;
email: String;
password: String;
}

export function useSignUpUserMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ signUpUserMutation: TData }, SignUpUserMutationVars>) {
    return useMutation<{ signUpUserMutation: TData }, SignUpUserMutationVars>(SignUpUserMutation(fragment), options);
}

export function SignUpUserMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation SignUpUserMutation
    (
$username: String!,
$email: String!,
$password: String!,
)
    {
            signUpUserMutation
            (
username: $username,
email: $email,
password: $password,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
