import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface AddChatClientMutationVars {
    
chatId: String;
userId: String;
}

export function useAddChatClientMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ addChatClientMutation: TData }, AddChatClientMutationVars>) {
    return useMutation<{ addChatClientMutation: TData }, AddChatClientMutationVars>(AddChatClientMutation(fragment), options);
}

export function AddChatClientMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation AddChatClientMutation
    (
$chatId: String!,
$userId: String!,
)
    {
            addChatClientMutation
            (
chatId: $chatId,
userId: $userId,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
