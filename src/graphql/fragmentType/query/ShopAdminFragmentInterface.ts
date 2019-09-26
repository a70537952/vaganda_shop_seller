export interface IShopAdminFragmentIndex {
  id: string;
  shop_id: string;
  user_id: string;
  shop_admin_role_id: string;
  shop_admin_role: {
    id: string;
    title: string;
    permission: string[];
    is_shop_owner_role: boolean;
  }
  shop: {
    id: string;
    shop_category_id: string;
    name: string;
    has_physical_shop: string;
    shop_info: {
      id: string;
      logo: string;
      logo_small: string;
      logo_medium: string;
    }
    shop_setting: {
      id: string;
      title: string;
      value: string;
    }[]
  }
}

export interface IShopAdminFragmentModalCreateEditShopAdmin {
  id: string;
  shop_id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
  }
  shop_admin_role_id: string;
  shop_admin_role: {
    id: string;
    title: string;
    is_shop_owner_role: string;
    permission: string;
  }
}