import gql from "graphql-tag";

export let shopFragments: any = {
  ModalUpdateShopCategory: gql`
    fragment fragment on Shop {
      id
      shop_category_id
      shop_category {
        id
      }
    }
  `
};
