import gql from "graphql-tag";

export let productCategoryFragments: any = {
  ProductCategorySelect: gql`
    fragment fragment on ProductCategory {
      id
      title
      child_category {
        id
        title
        child_category {
          id
          title
        }
      }
    }
  `
};
