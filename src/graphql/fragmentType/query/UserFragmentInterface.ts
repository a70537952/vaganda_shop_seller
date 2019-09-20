export interface IUserFragmentFormEditUserAccount {
  id: string;
  username: string;
  name: string;
  user_info: {
    id: string;
    gender: number;
    avatar_original: string;
    avatar_small: string;
    avatar_medium: string;
    avatar_large: string;
  };
}

export interface IUserFragmentFormEditUserContact {
  id: string;
  email: string;
  email_verified_at: string;
  is_sign_up_user: number;
  user_info: {
    id: string;
    phone_country_code: string;
    phone: string;
  };
}

export interface IUserFragmentFormSignUp {
  id: string;
  username: string;
  email: string;
}

export interface IUserFragmentIndex {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  is_sign_up_user: string;
  user_info: {
    id: string;
    avatar: string;
    avatar_original: string;
    avatar_small: string;
    avatar_medium: string;
    avatar_large: string;
    phone_country_code: string;
    phone: string;
  };
  user_address: {
    id: string;
    user_id: string;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  shop_admins: {
    id: string;
    shop_id: string;
  };
}
