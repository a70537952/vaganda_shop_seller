import gql from "graphql-tag";

export let userOrderDetailFragments: any = {
  OrderDetail: gql`
    fragment fragment on UserOrderDetail {
      id
      order_id
      product_title
      product_type_title
      product_quantity
      product_shipping_title
      product_shipping_country
      product_unit_price_currency
      product_final_price
      product_total_price
      product_shipping_fee
      product_shipping_currency
      product_total_shipping_fee
      product_shipping_track_number
      message
      order_detail_status
      order_address {
        id
        order_id
        address_1
        address_2
        address_3
        city
        state
        postal_code
        country
      }
      is_commented
      remark
      created_at
    }
  `,
  Dashboard: gql`
    fragment fragment on UserOrderDetail {
      id
      product_title
      product_type_title
      product_quantity
      order_detail_status
      created_at
    }
  `,
  ModalUpdateUserOrderDetail: gql`
    fragment fragment on UserOrderDetail {
     id
     order_id
     product_title
     product_type_title
     product_quantity
     product_cost_currency
     product_cost
     product_unit_price_currency
     product_unit_price
     product_discount
     product_discount_unit
     product_total_price
     product_final_price
     product_shipping_title
     product_shipping_currency
     product_shipping_fee
     product_shipping_country
     product_total_shipping_fee
     order_detail_status
     product_shipping_track_number
     remark
     message
     is_commented
     order_detail_comment{
      id
      comment
      star
      user_order_detail_comment_image {
        id
        path
        image_medium
        image_original
      }
     }
    }
  `
};
