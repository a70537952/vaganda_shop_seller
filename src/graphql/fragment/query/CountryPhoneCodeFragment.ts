import gql from 'graphql-tag';

export let countryPhoneCodeFragments: any = {
  CountryPhoneCodeSelect: gql`
    fragment fragment on CountryPhoneCode {
      id
      name
      phone_code
    }
  `
};
