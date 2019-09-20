export interface IUserOrderDetailCommentFragmentOrderComment {
  id: string;
  user_order_detail_id: string;

  user_order_detail: {
    id: string;
    product_title: string;
    product_type_title: string;
  };
  user_id: string;
  shop_id: string;
  product_id: string;
  comment: string;
  star: string;
  created_at: string;
  updated_at: string;

  user_order_detail_comment_image: {
    id: string;
    user_order_detail_comment_id: string;
    path: string;
    image_medium: string;
    image_large: string;
    image_original: string;
  };

  user: {
    id: string;
    name: string;
    user_info: {
      id: string;
      avatar: string;
      avatar_small: string;
      avatar_medium: string;
    };
  };
}

export interface IUserOrderDetailCommentFragmentDashboard {
  id: string;
  user_order_detail_id: string;

  user_order_detail: {
    id: string;
    product_title: string;
    product_type_title: string;
  };
  user_id: string;
  shop_id: string;
  product_id: string;
  comment: string;
  star: string;
  created_at: string;
  updated_at: string;

  user_order_detail_comment_image: {
    id: string;
    user_order_detail_comment_id: string;
    path: string;
    image_medium: string;
    image_large: string;
    image_original: string;
  };

  user: {
    id: string;
    name: string;
    user_info: {
      id: string;
      avatar: string;
      avatar_small: string;
      avatar_medium: string;
    };
  };
}

export interface IUserOrderDetailCommentFragmentUserOrderDetailCommentList {
  id: string;
  user_order_detail_id: string;

  user_order_detail: {
    id: string;
    product_title: string;
    product_type_title: string;
  };
  user_id: string;
  shop_id: string;
  product_id: string;
  comment: string;
  star: string;
  created_at: string;
  updated_at: string;

  user_order_detail_comment_image: {
    id: string;
    user_order_detail_comment_id: string;
    path: string;
    image_medium: string;
    image_large: string;
    image_original: string;
  };

  user: {
    id: string;
    name: string;
    user_info: {
      id: string;
      avatar: string;
      avatar_small: string;
      avatar_medium: string;
    };
  };
}
