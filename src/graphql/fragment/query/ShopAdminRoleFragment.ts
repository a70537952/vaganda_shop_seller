import gql from 'graphql-tag';

export let shopAdminRoleFragments: any = {
  SellerAdminRole: gql`
    fragment fragment on ShopAdminRole {
      id
      title
      permission
      is_shop_owner_role
      created_at
    }
  `,
  ShopAdminRoleSelect: gql`
    fragment fragment on ShopAdminRole {
      id
      title
      permission
      is_shop_owner_role
    }
  `
};
