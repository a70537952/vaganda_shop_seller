import gql from "graphql-tag";

export let updateShopLogoMutationFragments: any = {
  Setting: gql`
    fragment fragment on ShopInfo {
      id
      shop_id
      logo
      logo_medium
    }
  `
};
