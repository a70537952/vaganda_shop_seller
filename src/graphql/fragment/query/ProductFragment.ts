import gql from "graphql-tag";

export let productFragments: any = {
  ProductList: gql`
    fragment fragment on Product {
      id
      title
      product_category_id
      description
      extra_option {
        key
        value
      }
      width
      width_unit
      height
      height_unit
      length
      length_unit
      weight
      weight_unit
      is_publish
      created_at

      product_image {
        id
        product_id
        path
        image_medium
        image_large
        image_original
      }

      product_category {
        id
        title
      }

      product_type {
        id
        product_id
        title
        quantity
        cost
        cost_currency
        price
        currency
        discount
        discount_unit
        discounted_price
        final_price
        discount_amount
        product_type_image {
          id
          product_type_id
          path
          image_medium
          image_large
          image_original
        }
      }

      product_shipping {
        id
        product_id
        shipping_method
        shipping_fee
        shipping_country
        is_disabled
      }

      shop_product_category_product {
        id
        shop_product_category_id
        shop_product_category {
          id
          title
        }
      }
    }
  `,
  ModalCreateEditProduct: gql`
    fragment fragment on Product {
      id
      title
      product_category_id
      description
      extra_option {
        key
        value
      }
      width
      width_unit
      height
      height_unit
      length
      length_unit
      weight
      weight_unit
      is_publish
      created_at

      product_image {
        id
        product_id
        path
        image_medium
        image_large
        image_original
      }

      product_category {
        id
        title
      }

      product_type {
        id
        product_id
        title
        quantity
        cost
        cost_currency
        price
        currency
        discount
        discount_unit
        discounted_price
        final_price
        discount_amount
        product_type_image {
          id
          product_type_id
          path
          image_medium
          image_large
          image_original
        }
      }

      product_shipping {
        id
        product_id
        shipping_method
        shipping_fee
        shipping_country
        is_disabled
      }

      shop_product_category_product {
        id
        shop_product_category_id
        shop_product_category {
          id
          title
        }
      }
    }
  `,
  Product: gql`
    fragment fragment on Product {
      id
      title
      product_category_id
      description
      extra_option {
        key
        value
      }
      width
      width_unit
      height
      height_unit
      length
      length_unit
      weight
      weight_unit
      is_publish
      created_at

      product_image {
        id
        product_id
        path
        image_medium
        image_large
        image_original
      }

      product_category {
        id
        title
      }

      product_type {
        id
        product_id
        title
        quantity
        cost
        cost_currency
        price
        currency
        discount
        discount_unit
        discounted_price
        final_price
        discount_amount
        product_type_image {
          id
          product_type_id
          path
          image_medium
          image_large
          image_original
        }
      }

      product_shipping {
        id
        product_id
        shipping_method
        shipping_fee
        shipping_country
        is_disabled
      }

      shop_product_category_product {
        id
        shop_product_category_id
        shop_product_category {
          id
          title
        }
      }
    }
  `
};
