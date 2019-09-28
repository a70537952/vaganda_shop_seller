import gql from "graphql-tag";

export let updateShopBannerMutationFragments: any = {
  Setting: gql`
    fragment fragment on ShopInfo {
      id
      shop_id
      banner
      banner_large
    }
  `
};
