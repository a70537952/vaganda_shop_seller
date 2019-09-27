import gql from "graphql-tag";

export let shopSettingFragments: any = {
  ModalUpdateShopAccount: gql`
    fragment fragment on ShopSetting {
      id
      shop_id
      title
      value
    }
  `
};
