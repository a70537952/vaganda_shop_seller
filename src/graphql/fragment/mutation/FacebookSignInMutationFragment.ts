import gql from 'graphql-tag';

export let facebookSignInMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on User {
      id
      api_token
    }
  `
};
