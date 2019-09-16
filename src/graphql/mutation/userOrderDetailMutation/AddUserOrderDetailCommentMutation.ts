import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface AddUserOrderDetailCommentMutationVars {
    
userOrderDetailId: String;
comment: String;
star: number;
commentImages: String[];
}

export function useAddUserOrderDetailCommentMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ addUserOrderDetailCommentMutation: TData }, AddUserOrderDetailCommentMutationVars>) {
    return useMutation<{ addUserOrderDetailCommentMutation: TData }, AddUserOrderDetailCommentMutationVars>(AddUserOrderDetailCommentMutation(fragment), options);
}

export function AddUserOrderDetailCommentMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation AddUserOrderDetailCommentMutation
    (
$userOrderDetailId: String!,
$comment: String!,
$star: Int!,
$commentImages: [String],
)
    {
            addUserOrderDetailCommentMutation
            (
userOrderDetailId: $userOrderDetailId,
comment: $comment,
star: $star,
commentImages: $commentImages,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
