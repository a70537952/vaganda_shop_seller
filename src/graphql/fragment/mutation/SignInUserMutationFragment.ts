import gql from 'graphql-tag';

export let signInUserMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on User {
      id
      api_token
    }
  `
};
