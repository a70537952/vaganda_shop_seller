export interface IProductFragmentModalCreateEditProduct {
  id: string;
  title: string;
  product_category_id: string;
  description: string;
  extra_option: {
    key: string;
    value: string;
  }[];
  width: string;
  width_unit: string;
  height: string;
  height_unit: string;
  length: string;
  length_unit: string;
  weight: string;
  weight_unit: string;
  is_publish: number;
  created_at: string;

  product_image: {
    id: string;
    product_id: string;
    path: string;
    image_medium: string;
    image_large: string;
    image_original: string;
  };

  product_category: {
    id: string;
    title: string;
  };

  product_type: {
    id: string;
    product_id: string;
    title: string;
    quantity: string;
    cost: string;
    cost_currency: string;
    price: string;
    currency: string;
    discount: string;
    discount_unit: string;
    discounted_price: string;
    final_price: string;
    discount_amount: string;
    product_type_image: {
      id: string;
      product_type_id: string;
      path: string;
      image_medium: string;
      image_large: string;
      image_original: string;
    };
  }[];

  product_shipping: {
    id: string;
    product_id: string;
    shipping_method: string;
    shipping_fee: string;
    shipping_country: string;
    is_disabled: number;
  }[];

  shop_product_category_product: {
    id: string;
    shop_product_category_id: string;
    shop_product_category: {
      id: string;
      title: string;
    };
  };
}

export interface IProductFragmentProduct {
  id: string;
  title: string;
  is_publish: string;
  created_at: string;
  shop_product_category_product: {
    id: string;
    shop_product_category: {
      id: string;
      title: string;
    }
  }[]
  product_category: {
    id: string;
    title: string;
  }
  product_type: IProductFragmentProductIProductType[]
  product_image: {
    id: string;
    path: string;
    image_medium: string;
    image_original: string;
  }[]
}

export interface IProductFragmentProductIProductType {
  id: string;
  title: string;
  quantity: string;
  currency: string;
  price: number;
  discount_unit: string;
  discount: string;
  discount_amount: string;
  final_price: string;
  product_type_image: {
    id: string;
    path: string;
    image_medium: string;
    image_original: string;
  }[]
}