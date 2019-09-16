import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface GetBraintreeClientTokenMutationVars {
    
}

export function useGetBraintreeClientTokenMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ getBraintreeClientTokenMutation: TData }, GetBraintreeClientTokenMutationVars>) {
    return useMutation<{ getBraintreeClientTokenMutation: TData }, GetBraintreeClientTokenMutationVars>(GetBraintreeClientTokenMutation(fragment), options);
}

export function GetBraintreeClientTokenMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation GetBraintreeClientTokenMutation
    
    {
            getBraintreeClientTokenMutation
            
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
