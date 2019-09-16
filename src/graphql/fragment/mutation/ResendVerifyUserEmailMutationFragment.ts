import gql from 'graphql-tag';

export let resendVerifyUserEmailMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on User {
      id
    }
  `
};
