import gql from "graphql-tag";

export let shopAdminFragments: any = {
  Index: gql`
    fragment fragment on ShopAdmin {
      id
      shop_id
      user_id
      shop_admin_role_id
      shop_admin_role {
        id
        title
        permission
        is_shop_owner_role
      }
      shop {
        id
        name
        shop_category_id
        has_physical_shop
        shop_info {
          id
          logo
          logo_small
          logo_medium
        }
        shop_setting {
          id
          title
          value
        }
      }
    }
  `
};
