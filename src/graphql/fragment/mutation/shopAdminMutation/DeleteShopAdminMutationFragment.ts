import gql from "graphql-tag";

export let deleteShopAdminMutationFragments: any = {
  DefaultFragment: gql`
    fragment fragment on ShopAdmin {
      id
    }
  `
};
