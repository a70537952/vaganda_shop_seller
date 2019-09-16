import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface FacebookSignInMutationVars {
    
facebookID: String;
email: String;
name: String;
}

export function useFacebookSignInMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ facebookSignInMutation: TData }, FacebookSignInMutationVars>) {
    return useMutation<{ facebookSignInMutation: TData }, FacebookSignInMutationVars>(FacebookSignInMutation(fragment), options);
}

export function FacebookSignInMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation FacebookSignInMutation
    (
$facebookID: String!,
$email: String,
$name: String,
)
    {
            facebookSignInMutation
            (
facebookID: $facebookID,
email: $email,
name: $name,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
