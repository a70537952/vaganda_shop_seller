import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface RemoveChatClientMutationVars {
    
chatClientId: String;
}

export function useRemoveChatClientMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ removeChatClientMutation: TData }, RemoveChatClientMutationVars>) {
    return useMutation<{ removeChatClientMutation: TData }, RemoveChatClientMutationVars>(RemoveChatClientMutation(fragment), options);
}

export function RemoveChatClientMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation RemoveChatClientMutation
    (
$chatClientId: String!,
)
    {
            removeChatClientMutation
            (
chatClientId: $chatClientId,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
