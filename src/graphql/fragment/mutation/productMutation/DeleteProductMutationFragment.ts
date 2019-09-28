import gql from "graphql-tag";

export let deleteProductMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on Product {
      id
    }
  `
};
