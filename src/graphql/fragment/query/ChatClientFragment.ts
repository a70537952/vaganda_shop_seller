import gql from "graphql-tag";

export let chatClientFragments: any = {
  Chat: gql`
    fragment fragment on ChatClient {
      id
      chat_id
      client_type
      client_id
      is_open_chat
      is_read
      client {
        ... on User {
          id
          name
          user_info {
            id
            avatar
            avatar_small
          }
        }
       ... on Shop {
          id
          name
          shop_info {
            id
            logo
            logo_small
          }
        }
      }
      chat {
        id
        chat_type
        chat_type_id
        title
        description
        last_message_at
        
        latest_chat_message {
          id
          chat_id
          client_type
          client_id
          body
          type
          created_at
        }
      }
    }
  `
};
