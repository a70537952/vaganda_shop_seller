import gql from "graphql-tag";

export let UnpublishProductMutationFragments: any = {
  Product: gql`
    fragment fragment on Product {
      id
      is_publish
    }
  `
};
