import gql from "graphql-tag";

export let getBraintreeClientTokenMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on BraintreeClientToken {
      clientToken
    }
  `
};
