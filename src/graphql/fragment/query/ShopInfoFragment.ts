import gql from "graphql-tag";

export let shopInfoFragments: any = {
  ModalUpdateShopInfo: gql`
    fragment fragment on ShopInfo {
      id
      shop_id
      summary
    }
  `
};
