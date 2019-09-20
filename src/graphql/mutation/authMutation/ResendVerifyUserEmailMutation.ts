import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface ResendVerifyUserEmailMutationVars {
    
email?: String;
}

export function useResendVerifyUserEmailMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ resendVerifyUserEmailMutation: TData }, ResendVerifyUserEmailMutationVars>) {
    return useMutation<{ resendVerifyUserEmailMutation: TData }, ResendVerifyUserEmailMutationVars>(ResendVerifyUserEmailMutation(fragment), options);
}

export function ResendVerifyUserEmailMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation ResendVerifyUserEmailMutation
    (
$email: String,
)
    {
            resendVerifyUserEmailMutation
            (
email: $email,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
