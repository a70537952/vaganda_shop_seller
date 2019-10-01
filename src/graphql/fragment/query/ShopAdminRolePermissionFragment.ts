import gql from "graphql-tag";

export let shopAdminRolePermissionFragments: any = {
  DefaultFragment: gql`
    fragment fragment on ShopAdminRolePermission {
      permissionSection
      permission
    }
  `
};
