import gql from "graphql-tag";

export let userOrderDetailCommentFragments: any = {
  OrderComment: gql`
    fragment fragment on UserOrderDetailComment {
      id
      user_order_detail_id
      comment
      star
      created_at
      user_order_detail {
        id
        product_title
        product_type_title
      }
       user_order_detail_comment_image {
         id
         image_medium
         path
         image_original
       }
    }
  `,
  Dashboard: gql`
    fragment fragment on UserOrderDetailComment {
      id
      comment
      star
      user_order_detail {
        id
        product_title
      }
      created_at
    }
  `
};
