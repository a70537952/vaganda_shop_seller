import gql from "graphql-tag";

export let shopProductCategoryFragments: any = {
  ProductCategory: gql`
    fragment fragment on ShopProductCategory {
      id
      shop_id
      title
      created_at
      updated_at
      product_count
    }
  `,
  ModalCreateEditShopProductCategory: gql`
    fragment fragment on ShopProductCategory {
      id
      title
    }
  `
};
