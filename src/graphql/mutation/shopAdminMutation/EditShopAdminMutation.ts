import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface EditShopAdminMutationVars {
  shop_id: String;
  shop_admin_id: String;
  user_id: String;
  shop_admin_role_id: String;
}

export function useEditShopAdminMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { editShopAdminMutation: TData },
    EditShopAdminMutationVars
  >
) {
  return useMutation<
    { editShopAdminMutation: TData },
    EditShopAdminMutationVars
  >(EditShopAdminMutation(fragment), options);
}

export function EditShopAdminMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation EditShopAdminMutation(
      $shop_id: String!
      $shop_admin_id: String!
      $user_id: String!
      $shop_admin_role_id: String!
    ) {
      editShopAdminMutation(
        shop_id: $shop_id
        shop_admin_id: $shop_admin_id
        user_id: $user_id
        shop_admin_role_id: $shop_admin_role_id
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
