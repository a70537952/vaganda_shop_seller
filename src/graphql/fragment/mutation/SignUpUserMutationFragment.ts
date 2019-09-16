import gql from 'graphql-tag';

export let signUpUserMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on User {
      id
    }
  `
};
