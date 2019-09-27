import gql from "graphql-tag";

export let shopContactInfoFragments: any = {
  ModalUpdateShopContactInfo: gql`
    fragment fragment on ShopContactInfo {
      id
      shop_id
      email
      website
      telephone_country_code
      telephone
      phone_country_code
      phone
    }
  `
};
