import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UploadProductDescriptionImageMutationVars {
  shop_id: String;
  files: FileList;
}

export function useUploadProductDescriptionImageMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { uploadProductDescriptionImageMutation: TData[] },
    UploadProductDescriptionImageMutationVars
  >
) {
  return useMutation<
    { uploadProductDescriptionImageMutation: TData[] },
    UploadProductDescriptionImageMutationVars
  >(UploadProductDescriptionImageMutation(fragment), options);
}

export function UploadProductDescriptionImageMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UploadProductDescriptionImageMutation(
      $shop_id: String
      $files: Upload!
    ) {
      uploadProductDescriptionImageMutation(shop_id: $shop_id, files: $files) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
