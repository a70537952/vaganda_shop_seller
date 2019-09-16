import React from 'react';

export interface IContext {
  user: any;
  shop: any;
  getContext: () => void;
  permission: string[];
  shopList: any[];
  shopSetting: any;
  shopAdminList: any[];
  shopAdmin: any;
  switchShop: (ShopId: string) => void;
}

export const AppContext = React.createContext<IContext>({
  user: {},
  shop: {},
  getContext: () => {},
  permission: [],
  shopList: [],
  shopSetting: {},
  shopAdminList: [],
  shopAdmin: {},
  switchShop: ShopId => {}
});
