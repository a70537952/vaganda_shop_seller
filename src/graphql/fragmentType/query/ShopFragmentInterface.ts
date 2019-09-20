export interface IShopFragmentShopList {
  id: string;
  user_id: string;
  shop_category_id: string;
  name: string;
  has_physical_shop: string;
  created_at: string;
  updated_at: string;
  shop_info: {
    id: string;
    summary: string;
    logo: string;
    logo_medium: string;
    logo_large: string;
    banner: string;
    banner_medium: string;
    banner_large: string;
  };
  shop_product_category: {
    id: string;
    shop_id: string;
    title: string;
  };
  shop_setting: {
    id: string;
    title: string;
    value: string;
  };
}
