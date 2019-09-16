import gql from "graphql-tag";

export let countryFragments: any = {
  CountrySelect: gql`
    fragment fragment on Country {
      id
      name
    }
  `
};
