import gql from "graphql-tag";

export let userOrderDetailFragments: any = {
  OrderDetail: gql`
    fragment fragment on UserOrderDetail {
      id
      order_id
      user_id
      shop_id

      shop {
        id
        name
        shop_info {
          id
          logo
          logo_small
        }

        shop_setting {
          id
          title
          value
        }
      }

      order_address {
        id
        order_id
        user_id
        address_1
        address_2
        address_3
        city
        state
        postal_code
        country
      }
      product_id

      product {
        id
        product_image {
          id
          product_id
          path
          image_medium
          image_large
          image_original
        }
      }
      shop_name
      product_title
      product_type_title
      product_quantity
      product_cost_currency
      product_cost

      product_discount_unit
      product_discount
      product_unit_price_currency
      product_unit_price
      product_discount_amount
      product_discounted_price
      product_final_price

      product_total_price
      product_paid_unit_price_currency
      product_paid_unit_price
      product_paid_total_price

      product_shipping_title

      product_shipping_currency
      product_shipping_fee
      product_shipping_country
      product_total_shipping_fee
      product_paid_shipping_currency
      product_paid_shipping_fee
      product_paid_total_shipping_fee

      order_detail_status
      product_shipping_track_number
      message
      remark
      is_commented
      order_detail_comment {
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

      auto_received_at
      shipped_at
      received_at
      created_at
      updated_at
    }
  `,
  Dashboard: gql`
    fragment fragment on UserOrderDetail {
      id
      order_id
      user_id
      shop_id

      shop {
        id
        name
        shop_info {
          id
          logo
          logo_small
        }

        shop_setting {
          id
          title
          value
        }
      }

      order_address {
        id
        order_id
        user_id
        address_1
        address_2
        address_3
        city
        state
        postal_code
        country
      }
      product_id

      product {
        id
        product_image {
          id
          product_id
          path
          image_medium
          image_large
          image_original
        }
      }
      shop_name
      product_title
      product_type_title
      product_quantity
      product_cost_currency
      product_cost

      product_discount_unit
      product_discount
      product_unit_price_currency
      product_unit_price
      product_discount_amount
      product_discounted_price
      product_final_price

      product_total_price
      product_paid_unit_price_currency
      product_paid_unit_price
      product_paid_total_price

      product_shipping_title

      product_shipping_currency
      product_shipping_fee
      product_shipping_country
      product_total_shipping_fee
      product_paid_shipping_currency
      product_paid_shipping_fee
      product_paid_total_shipping_fee

      order_detail_status
      product_shipping_track_number
      message
      remark
      is_commented
      order_detail_comment {
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

      auto_received_at
      shipped_at
      received_at
      created_at
      updated_at
    }
  `,
  UserOrderDetailList: gql`
    fragment fragment on UserOrderDetail {
      id
      order_id
      user_id
      shop_id

      shop {
        id
        name
        shop_info {
          id
          logo
          logo_small
        }

        shop_setting {
          id
          title
          value
        }
      }

      order_address {
        id
        order_id
        user_id
        address_1
        address_2
        address_3
        city
        state
        postal_code
        country
      }
      product_id

      product {
        id
        product_image {
          id
          product_id
          path
          image_medium
          image_large
          image_original
        }
      }
      shop_name
      product_title
      product_type_title
      product_quantity
      product_cost_currency
      product_cost

      product_discount_unit
      product_discount
      product_unit_price_currency
      product_unit_price
      product_discount_amount
      product_discounted_price
      product_final_price

      product_total_price
      product_paid_unit_price_currency
      product_paid_unit_price
      product_paid_total_price

      product_shipping_title

      product_shipping_currency
      product_shipping_fee
      product_shipping_country
      product_total_shipping_fee
      product_paid_shipping_currency
      product_paid_shipping_fee
      product_paid_total_shipping_fee

      order_detail_status
      product_shipping_track_number
      message
      remark
      is_commented
      order_detail_comment {
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

      auto_received_at
      shipped_at
      received_at
      created_at
      updated_at
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
