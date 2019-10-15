export interface IUserFragmentIndex {
  id: string;
  name: string;
  email: string;
  user_info: {
    id: string;
    avatar: string;
    avatar_original: string;
    avatar_small: string;
    avatar_medium: string;
    avatar_large: string;
  }
}

export interface IUserFragmentModalCreateEditShopAdmin {
  id: string;
  username: string;
  name: string;
  user_info: {
    id: string;
    gender: string;
    avatar: string;
    avatar_small: string;
  }
}
