export interface IUserOrderDetailFragmentOrderDetail {
  id: string;
  order_id: string;
  user_id: string;
  shop_id: string;

  shop: {
    id: string;
    name: string;
    shop_info: {
      id: string;
      logo: string;
      logo_small: string;
    };

    shop_setting: {
      id: string;
      title: string;
      value: string;
    };
  };

  order_address: {
    id: string;
    order_id: string;
    user_id: string;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  product_id: string;

  product: {
    id: string;
    product_image: {
      id: string;
      product_id: string;
      path: string;
      image_medium: string;
      image_large: string;
      image_original: string;
    };
  };
  shop_name: string;
  product_title: string;
  product_type_title: string;
  product_quantity: string;
  product_cost_currency: string;
  product_cost: string;

  product_discount_unit: string;
  product_discount: string;
  product_unit_price_currency: string;
  product_unit_price: string;
  product_discount_amount: string;
  product_discounted_price: string;
  product_final_price: string;

  product_total_price: string;
  product_paid_unit_price_currency: string;
  product_paid_unit_price: string;
  product_paid_total_price: string;

  product_shipping_title: string;

  product_shipping_currency: string;
  product_shipping_fee: string;
  product_shipping_country: string;
  product_total_shipping_fee: string;
  product_paid_shipping_currency: string;
  product_paid_shipping_fee: string;
  product_paid_total_shipping_fee: string;

  order_detail_status: string;
  product_shipping_track_number: string;
  message: string;
  remark: string;
  is_commented: string;
  order_detail_comment: {
    id: string;
    comment: string;
    star: string;
    user_order_detail_comment_image: {
      id: string;
      path: string;
      image_medium: string;
      image_original: string;
    };
  };

  auto_received_at: string;
  shipped_at: string;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface IUserOrderDetailFragmentDashboard {
  id: string;
  order_id: string;
  user_id: string;
  shop_id: string;

  shop: {
    id: string;
    name: string;
    shop_info: {
      id: string;
      logo: string;
      logo_small: string;
    };

    shop_setting: {
      id: string;
      title: string;
      value: string;
    };
  };

  order_address: {
    id: string;
    order_id: string;
    user_id: string;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  product_id: string;

  product: {
    id: string;
    product_image: {
      id: string;
      product_id: string;
      path: string;
      image_medium: string;
      image_large: string;
      image_original: string;
    };
  };
  shop_name: string;
  product_title: string;
  product_type_title: string;
  product_quantity: string;
  product_cost_currency: string;
  product_cost: string;

  product_discount_unit: string;
  product_discount: string;
  product_unit_price_currency: string;
  product_unit_price: string;
  product_discount_amount: string;
  product_discounted_price: string;
  product_final_price: string;

  product_total_price: string;
  product_paid_unit_price_currency: string;
  product_paid_unit_price: string;
  product_paid_total_price: string;

  product_shipping_title: string;

  product_shipping_currency: string;
  product_shipping_fee: string;
  product_shipping_country: string;
  product_total_shipping_fee: string;
  product_paid_shipping_currency: string;
  product_paid_shipping_fee: string;
  product_paid_total_shipping_fee: string;

  order_detail_status: string;
  product_shipping_track_number: string;
  message: string;
  remark: string;
  is_commented: string;
  order_detail_comment: {
    id: string;
    comment: string;
    star: string;
    user_order_detail_comment_image: {
      id: string;
      path: string;
      image_medium: string;
      image_original: string;
    };
  };

  auto_received_at: string;
  shipped_at: string;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface IUserOrderDetailFragmentUserOrderDetailList {
  id: string;
  order_id: string;
  user_id: string;
  shop_id: string;

  shop: {
    id: string;
    name: string;
    shop_info: {
      id: string;
      logo: string;
      logo_small: string;
    };

    shop_setting: {
      id: string;
      title: string;
      value: string;
    };
  };

  order_address: {
    id: string;
    order_id: string;
    user_id: string;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  product_id: string;

  product: {
    id: string;
    product_image: {
      id: string;
      product_id: string;
      path: string;
      image_medium: string;
      image_large: string;
      image_original: string;
    };
  };
  shop_name: string;
  product_title: string;
  product_type_title: string;
  product_quantity: string;
  product_cost_currency: string;
  product_cost: string;

  product_discount_unit: string;
  product_discount: string;
  product_unit_price_currency: string;
  product_unit_price: string;
  product_discount_amount: string;
  product_discounted_price: string;
  product_final_price: string;

  product_total_price: string;
  product_paid_unit_price_currency: string;
  product_paid_unit_price: string;
  product_paid_total_price: string;

  product_shipping_title: string;

  product_shipping_currency: string;
  product_shipping_fee: string;
  product_shipping_country: string;
  product_total_shipping_fee: string;
  product_paid_shipping_currency: string;
  product_paid_shipping_fee: string;
  product_paid_total_shipping_fee: string;

  order_detail_status: string;
  product_shipping_track_number: string;
  message: string;
  remark: string;
  is_commented: string;
  order_detail_comment: {
    id: string;
    comment: string;
    star: string;
    user_order_detail_comment_image: {
      id: string;
      path: string;
      image_medium: string;
      image_original: string;
    };
  };

  auto_received_at: string;
  shipped_at: string;
  received_at: string;
  created_at: string;
  updated_at: string;
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
