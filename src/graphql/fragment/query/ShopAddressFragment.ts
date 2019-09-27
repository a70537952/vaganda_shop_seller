import gql from "graphql-tag";

export let shopAddressFragments: any = {
  ModalUpdateShopAddress: gql`
    fragment fragment on ShopAddress {
        id
        shop_id
        address_1
        address_2
        address_3
        city
        state
        postal_code
        country
        latitude
        longitude
        shop {
          id
          has_physical_shop
        }
    }
  `
};
