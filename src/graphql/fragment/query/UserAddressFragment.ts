import gql from 'graphql-tag';

export let userAddressFragments: any = {
  FormEditUserAddress: gql`
    fragment fragment on UserAddress {
      id
      address_1
      address_2
      address_3
      city
      state
      postal_code
      country
    }
  `
};
