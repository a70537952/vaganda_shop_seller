import gql from "graphql-tag";

export let userOrderDetailCommentFragments: any = {
  OrderComment: gql`
    fragment fragment on UserOrderDetailComment {
      id
      user_order_detail_id

      user_order_detail {
        id
        product_title
        product_type_title
      }
      user_id
      shop_id
      product_id
      comment
      star
      created_at
      updated_at

      user_order_detail_comment_image {
        id
        user_order_detail_comment_id
        path
        image_medium
        image_large
        image_original
      }

      user {
        id
        name
        user_info {
          id
          avatar
          avatar_small
          avatar_medium
        }
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
