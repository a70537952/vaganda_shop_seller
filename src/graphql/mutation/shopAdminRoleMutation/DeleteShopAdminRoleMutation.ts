import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface DeleteShopAdminRoleMutationVars {
  shop_id: String;
  shop_admin_role_ids: String[];
}

export function useDeleteShopAdminRoleMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { deleteShopAdminRoleMutation: TData[] },
    DeleteShopAdminRoleMutationVars
  >
) {
  return useMutation<
    { deleteShopAdminRoleMutation: TData[] },
    DeleteShopAdminRoleMutationVars
  >(DeleteShopAdminRoleMutation(fragment), options);
}

export function DeleteShopAdminRoleMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation DeleteShopAdminRoleMutation(
      $shop_id: String!
      $shop_admin_role_ids: [String]!
    ) {
      deleteShopAdminRoleMutation(
        shop_id: $shop_id
        shop_admin_role_ids: $shop_admin_role_ids
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
