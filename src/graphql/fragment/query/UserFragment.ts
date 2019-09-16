import gql from "graphql-tag";

export let userFragments: any = {
  FormEditUserAccount: gql`
    fragment fragment on User {
      id
      username
      name
      user_info {
        id
        gender
        avatar_original
        avatar_small
        avatar_medium
        avatar_large
      }
    }
  `,
  FormEditUserContact: gql`
    fragment fragment on User {
      id
      email
      email_verified_at
      is_sign_up_user
      user_info {
        id
        phone_country_code
        phone
      }
    }
  `,
  FormSignUp: gql`
    fragment fragment on User {
      id
      username
      email
    }
  `,
  Index: gql`
    fragment fragment on User {
      id
      name
      email
      email_verified_at
      is_sign_up_user
      user_info {
        id
        avatar
        avatar_original
        avatar_small
        avatar_medium
        avatar_large
        phone_country_code
        phone
      }
      user_address {
        id
        user_id
        address_1
        address_2
        address_3
        city
        state
        postal_code
        country
      }
      shop_admins {
        id
        shop_id
      }
    }
  `
};
