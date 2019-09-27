export interface IShopAddressFragmentModalUpdateShopAddress {
  id: string;
  shop_id: string;
  address_1: string;
  address_2: string;
  address_3: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  shop: {
    id: string;
    has_physical_shop: string;
  }
}
