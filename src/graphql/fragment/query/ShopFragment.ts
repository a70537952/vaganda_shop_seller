import gql from 'graphql-tag';

export let shopFragments: any = {
  ShopList: gql`
    fragment fragment on Shop {
      id
      user_id
      shop_category_id
      name
      has_physical_shop
      created_at
      updated_at
      shop_info {
        id
        summary
        logo
        logo_medium
        logo_large
        banner
        banner_medium
        banner_large
      }
      shop_product_category {
        id
        shop_id
        title
      }
      shop_setting {
        id
        title
        value
      }
    }
  `
};
