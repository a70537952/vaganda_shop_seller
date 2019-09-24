import React from "react";
import { IUserFragmentIndex } from "../graphql/fragmentType/query/UserFragmentInterface";

export interface IContext {
  user: IUserFragmentIndex | null;
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
  user: null,
  shop: {},
  getContext: () => {},
  permission: [],
  shopList: [],
  shopSetting: {},
  shopAdminList: [],
  shopAdmin: {},
  switchShop: ShopId => {}
});
