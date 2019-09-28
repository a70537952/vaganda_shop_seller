import gql from "graphql-tag";

export let publishProductMutationFragments: any = {
  Product: gql`
    fragment fragment on Product {
      id
      is_publish
    }
  `
};
