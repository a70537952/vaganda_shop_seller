import React from "react";
import { useTranslation } from "react-i18next";
import { IChatClientFragmentChat } from "../../../graphql/fragmentType/query/ChatClientFragmentInterface";
import { useChatClientQuery } from "../../../graphql/query/ChatClientQuery";
import { chatClientFragments } from "../../../graphql/fragment/query/ChatClientFragment";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import ChatList from "./ChatList";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  chatLeftPaper: {
    height: "100%"
  },
  loadingContainer: {
    height: "100%"
  }
});

interface IProps {
  onSelectChat?: (chatId: string) => void;
}


export default function ChatLeftPanel(props: IProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { onSelectChat } = props;
  const chatClientPageSize = 10;
  const { loading: loadingChatClient, data: chatClientData, fetchMore: fetchMoreChatClient } = useChatClientQuery<IChatClientFragmentChat>(chatClientFragments.Chat, {
    variables: {
      sort_chat_last_message_at: "desc",
      limit: chatClientPageSize,
      offset: 0
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  let chatClients: IChatClientFragmentChat[] = [];
  let chatClientHasPages: boolean = false;
  let chatClientCurrentPage: number = 1;

  if (chatClientData) {
    chatClients = chatClientData.chatClient.items;
    chatClientHasPages = chatClientData.chatClient.cursor.hasPages;
    chatClientCurrentPage = chatClientData.chatClient.cursor.currentPage;
  }
  console.log("chatClients", chatClients);

  return <>
    {loadingChatClient && !chatClientData ?
      <Grid className={classes.loadingContainer}
            container
            justify={"center"}
            alignContent={"center"} spacing={1}>
        <Grid container item xs={12} justify={"center"}>
          <CircularProgress size={24} color={"primary"}/>
        </Grid>
        <Grid container item xs={12} justify={"center"}>
          <Typography variant={"subtitle1"} color={"primary"}>
            {t("loading chat")}...
          </Typography>
        </Grid>
      </Grid>
      :
      <Paper className={classes.chatLeftPaper} square elevation={0}>
        <ChatList chatClients={chatClients} onSelectChat={onSelectChat}/>
        {chatClientHasPages &&
        <>
          {loadingChatClient ?
            <Button
              fullWidth
              color="primary">
              <CircularProgress
                size={24}
                color={"inherit"}
              />
            </Button>
            :
            <Button
              fullWidth
              color="primary"
              onClick={() => {
                fetchMoreChatClient({
                  variables: {
                    offset: chatClientPageSize * chatClientCurrentPage
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    prev.chatClient.items = prev.chatClient.items.concat(
                      fetchMoreResult.chatClient.items
                    );
                    prev.chatClient.cursor = fetchMoreResult.chatClient.cursor;
                    return prev;
                  }
                });
              }}
            >
              {t("load more")}
            </Button>
          }
        </>
        }
      </Paper>
    }
  </>;
}
