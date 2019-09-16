import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface UploadImageMutationVars {
    
images: FileList;
}

export function useUploadImageMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ uploadImageMutation: TData[] }, UploadImageMutationVars>) {
    return useMutation<{ uploadImageMutation: TData[] }, UploadImageMutationVars>(UploadImageMutation(fragment), options);
}

export function UploadImageMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation UploadImageMutation
    (
$images: Upload!,
)
    {
            uploadImageMutation
            (
images: $images,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
