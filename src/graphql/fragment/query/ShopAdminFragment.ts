import gql from "graphql-tag";

export let shopAdminFragments: any = {
  Admin: gql`
    fragment fragment on ShopAdmin {
      id
      shop_id
      user_id
      user {
        id
        username
        name
      }
      shop_admin_role_id
      shop_admin_role {
        id
        title
        is_shop_owner_role
        permission
      }
      created_at
      updated_at
    }
  `,
  ModalCreateEditShopAdmin: gql`
    fragment fragment on ShopAdmin {
      id
      shop_id
      user_id
      user {
        id
        username
        name
      }
      shop_admin_role_id
      shop_admin_role {
        id
        title
        is_shop_owner_role
        permission
      }
      created_at
      updated_at
    }
  `
};
