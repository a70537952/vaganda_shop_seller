import gql from 'graphql-tag';

export let updateUserPasswordMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on User {
      id
    }
  `
};
