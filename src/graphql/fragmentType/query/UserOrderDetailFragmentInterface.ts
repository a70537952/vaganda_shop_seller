export interface IUserOrderDetailFragmentOrderDetail {
  id: string;
  order_id: string;
  product_title: string;
  product_type_title: string;
  product_quantity: string;
  product_shipping_title: string;
  product_shipping_country: string;
  product_unit_price_currency: string;
  product_final_price: string;
  product_total_price: string;
  product_shipping_fee: string;
  product_shipping_currency: string;
  product_total_shipping_fee: string;
  product_shipping_track_number: string;
  message: string;
  order_detail_status: string;
  order_address: {
    id: string;
    order_id: string;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  is_commented: string;
  remark: string;
  created_at: string;
}

export interface IUserOrderDetailFragmentDashboard {
  id: string;
  product_title: string;
  product_type_title: string;
  product_quantity: string;
  order_detail_status: string;
  created_at: string;
}

export interface IUserOrderDetailFragmentModalUpdateUserOrderDetail {
  id: string;
  order_id: string;
  product_title: string;
  product_type_title: string;
  product_quantity: string;
  product_cost_currency: string;
  product_cost: string;
  product_unit_price_currency: string;
  product_unit_price: string;
  product_discount: string;
  product_discount_unit: string;
  product_total_price: string;
  product_final_price: string;
  product_shipping_title: string;
  product_shipping_currency: string;
  product_shipping_fee: string;
  product_shipping_country: string;
  product_total_shipping_fee: string;
  order_detail_status: string;
  product_shipping_track_number: string;
  remark: string;
  message: string;
  is_commented: string;
  order_detail_comment: {
    id: string;
    comment: string;
    star: number;
    user_order_detail_comment_image: {
      id: string;
      path: string;
      image_medium: string;
      image_original: string;
    }[]
  }
}
