export interface IChatClientFragmentChatIClientUser {
  id: string;
  name: string;
  user_info: {
    id: string;
    avatar: string;
    avatar_small: string;
  }
}

export interface IChatClientFragmentChatIClientShop {
  id: string;
  name: string;
  shop_info: {
  id: string;
  logo: string;
  logo_small: string;
}
}

export interface IChatClientFragmentChat {
  id: string;
  chat_id: string;
  client_type: string;
  client_id: string;
  is_open_chat: number;
  is_read: number;
  client: IChatClientFragmentChatIClientUser | IChatClientFragmentChatIClientShop
  chat: {
    id: string;
    chat_type: string;
    chat_type_id: string;
    title: string;
    description: string;
    last_message_at: string;

    latest_chat_message: {
      id: string;
      chat_id: string;
      client_type: string;
      client_id: string;
      body: string;
      type: string;
      created_at: string;
    }
  }
}
