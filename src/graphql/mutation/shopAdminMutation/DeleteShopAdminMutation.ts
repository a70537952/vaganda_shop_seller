import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface DeleteShopAdminMutationVars {
  shop_id: String;
  shop_admin_ids: String[];
}

export function useDeleteShopAdminMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { deleteShopAdminMutation: TData[] },
    DeleteShopAdminMutationVars
  >
) {
  return useMutation<
    { deleteShopAdminMutation: TData[] },
    DeleteShopAdminMutationVars
  >(DeleteShopAdminMutation(fragment), options);
}

export function DeleteShopAdminMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation DeleteShopAdminMutation(
      $shop_id: String!
      $shop_admin_ids: [String]!
    ) {
      deleteShopAdminMutation(
        shop_id: $shop_id
        shop_admin_ids: $shop_admin_ids
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
