import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface CreateChatMutationVars {
    
chatType: String;
senderClientType: String;
senderClientId: String;
receiverClientType: String;
receiverClientId: String;
}

export function useCreateChatMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ createChatMutation: TData }, CreateChatMutationVars>) {
    return useMutation<{ createChatMutation: TData }, CreateChatMutationVars>(CreateChatMutation(fragment), options);
}

export function CreateChatMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation CreateChatMutation
    (
$chatType: String!,
$senderClientType: String!,
$senderClientId: String!,
$receiverClientType: String!,
$receiverClientId: String!,
)
    {
            createChatMutation
            (
chatType: $chatType,
senderClientType: $senderClientType,
senderClientId: $senderClientId,
receiverClientType: $receiverClientType,
receiverClientId: $receiverClientId,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
