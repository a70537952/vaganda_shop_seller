export interface IShopAdminRoleFragmentAdminRole {
  id: string;
  title: string;
  permission: string;
  is_shop_owner_role: number;
  created_at: string;
}

export interface IShopAdminRoleFragmentShopAdminRoleSelect {
  id: string;
  title: string;
  permission: string;
  is_shop_owner_role: number;
}

export interface IShopAdminRoleFragmentModalCreateEditShopAdminRole {
  id: string;
  title: string;
  permission: string;
  is_shop_owner_role: number;
  created_at: string;
}