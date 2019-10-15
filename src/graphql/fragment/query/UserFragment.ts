import gql from "graphql-tag";

export let userFragments: any = {
  Index: gql`
    fragment fragment on User {
      id
      name
      email
      user_info {
        id
        avatar
        avatar_original
        avatar_small
        avatar_medium
        avatar_large
      }
    }
  `,
  ModalCreateEditShopAdmin: gql`
    fragment fragment on User {
      id
      username
      name
      user_info {
        id
        gender
        avatar
        avatar_small
      }
    }
  `
};
