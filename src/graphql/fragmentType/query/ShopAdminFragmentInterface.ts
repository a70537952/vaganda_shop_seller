export interface IShopAdminFragmentAdmin {
  id: string;
  shop_id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
  shop_admin_role_id: string;
  shop_admin_role: {
    id: string;
    title: string;
    is_shop_owner_role: string;
    permission: string;
  };
  created_at: string;
  updated_at: string;
}
export interface IShopAdminFragmentModalCreateEditShopAdmin {
  id: string;
  shop_id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
  shop_admin_role_id: string;
  shop_admin_role: {
    id: string;
    title: string;
    is_shop_owner_role: string;
    permission: string;
  };
  created_at: string;
  updated_at: string;
}
