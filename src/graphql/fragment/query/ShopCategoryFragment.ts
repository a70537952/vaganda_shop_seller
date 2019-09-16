import gql from 'graphql-tag';

export let shopCategoryFragments: any = {
  ShopCategorySelect: gql`
    fragment fragment on ShopCategory {
      id
      title
    }
  `
};
