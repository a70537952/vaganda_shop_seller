import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CHAT_CLIENT from "../../../constant/CHAT_CLIENT";
import {
  IChatClientFragmentChatIClientShop,
  IChatClientFragmentChatIClientUser
} from "../../../graphql/fragmentType/query/ChatClientFragmentInterface";
import CHAT_MESSAGE from "../../../constant/CHAT_MESSAGE";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import UserAvatar from "../../UserAvatar";
import ShopLogo from "../../ShopLogo";
import ListItemText from "@material-ui/core/ListItemText";
import LinesEllipsis from "react-lines-ellipsis";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";

interface IChatIClientUser {
  name: string;
  [key: string]: any;
}

interface IChatIClientUserShop {
  name: string;
  [key: string]: any;
}

interface IProps {
  chatClients: {
    id: string;
    client_type: string;
    client_id: string;

    chat_clients: {
      client_type: string;
      client_id: string;
      client: IChatIClientUser | IChatIClientUserShop;
      [key: string]: any;
    }[]

    chat: {
      latest_chat_message?: {
        type: string;
        body: string;
        [key: string]: any;
      }
    }
    [key: string]: any;
  }[];

  onSelectChat?: (chatId: string) => void;
}


export default function ChatList(props: IProps) {
  const { t } = useTranslation();
  const { chatClients, onSelectChat } = props;
  const [selectedChatId, setSelectedChatId] = useState<string>('');

  return <List>
    {chatClients.map(
      chatClient => {
        let chatOtherClient = chatClient.chat_clients.find(client =>
          client.client_type !== chatClient.client_type || client.client_id !== chatClient.client_id) || chatClient.chat_clients[0];

        let chatName = "";
        let chatOtherClientSender = null;
        if (chatOtherClient.client_type === CHAT_CLIENT.CLIENT_TYPE.USER) {
          chatOtherClientSender = chatOtherClient.client as IChatIClientUser;
          chatName = chatOtherClientSender.name;
        }

        if (chatOtherClient.client_type === CHAT_CLIENT.CLIENT_TYPE.SHOP) {
          chatOtherClientSender = chatOtherClient.client as IChatIClientUserShop;
          chatName = chatOtherClientSender.name;
        }

        let latestChatMessage = chatClient.chat.latest_chat_message;
        let chatPreviewText = "";

        if(latestChatMessage) {
          if (latestChatMessage.type === CHAT_MESSAGE.MESSAGE_TYPE.TEXT) {
            chatPreviewText = latestChatMessage.body;
          }

          if (latestChatMessage.type === CHAT_MESSAGE.MESSAGE_TYPE.IMAGE) {
            chatPreviewText = `[${t("image")}]`;
          }

          if (latestChatMessage.type === CHAT_MESSAGE.MESSAGE_TYPE.NOTIFICATION) {
            chatPreviewText = `[${t("notification")}]`;
          }
        }

        return <React.Fragment key={chatClient.id}>
          <ListItem selected={selectedChatId === chatClient.id}
                    button
                    onClick={() => {
                      setSelectedChatId(chatClient.id);
                      if(onSelectChat) {
                        onSelectChat(chatClient.id)
                      }
                    }}>
            {chatOtherClientSender &&
            <ListItemAvatar>
              <>
                {chatClient.client_type === CHAT_CLIENT.CLIENT_TYPE.USER &&
                <UserAvatar size={40} user={chatOtherClientSender as IChatClientFragmentChatIClientUser}/>
                }
                {chatClient.client_type === CHAT_CLIENT.CLIENT_TYPE.SHOP &&
                <ShopLogo shop={chatOtherClientSender as IChatClientFragmentChatIClientShop}/>
                }
              </>
            </ListItemAvatar>
            }
            <ListItemText
              primary={chatName}
              secondary={<LinesEllipsis
                style={{ whiteSpace: "pre-wrap" }}
                text={chatPreviewText}
                maxLine="2"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />}
            />
          </ListItem>
          <Divider component="li"/>
        </React.Fragment>;
      }
    )}
  </List>;
}
