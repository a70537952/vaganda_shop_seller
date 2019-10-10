import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface CreateChatMessageMutationVars {
    
chatId: String;
senderClientType: String;
senderClientId: String;
body: String;
type: String;
}

export function useCreateChatMessageMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ createChatMessageMutation: TData }, CreateChatMessageMutationVars>) {
    return useMutation<{ createChatMessageMutation: TData }, CreateChatMessageMutationVars>(CreateChatMessageMutation(fragment), options);
}

export function CreateChatMessageMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation CreateChatMessageMutation
    (
$chatId: String!,
$senderClientType: String!,
$senderClientId: String!,
$body: String!,
$type: String!,
)
    {
            createChatMessageMutation
            (
chatId: $chatId,
senderClientType: $senderClientType,
senderClientId: $senderClientId,
body: $body,
type: $type,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
