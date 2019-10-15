import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import React from "react";
import Popper from "@material-ui/core/Popper";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import ForumIcon from "@material-ui/icons/Forum";
import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import useForm from "../../_hook/useForm";
import SendIcon from "@material-ui/icons/Send";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { useChatClientQuery } from "../../../graphql/query/ChatClientQuery";
import { chatClientFragments } from "../../../graphql/fragment/query/ChatClientFragment";
import {
  IChatClientFragmentChat,
  IChatClientFragmentChatIClientShop,
  IChatClientFragmentChatIClientUser
} from "../../../graphql/fragmentType/query/ChatClientFragmentInterface";
import CircularProgress from "@material-ui/core/CircularProgress";
import CHAT_CLIENT from "../../../constant/CHAT_CLIENT";
import CHAT_MESSAGE from "../../../constant/CHAT_MESSAGE";
import UserAvatar from "../../UserAvatar";
import ShopLogo from "../../ShopLogo";
import LinesEllipsis from "react-lines-ellipsis";

interface IProps {

}

const useStyles = makeStyles((theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  buttonToggleChat: {
    position: "fixed",
    bottom: 0,
    right: "5px"
  },
  rootPaper: {},
  rootGrid: {
    height: "100%"
  },
  chatLeftPaper: {
    borderRight: "1px solid #ddd",
    height: "100%"
  },
  chatRightPaper: {
    height: "100%",
    background: "#eee",
    position: "relative"
  },
  chatInputPaper: {
    borderTop: "1px solid #ddd",
    height: "125px",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    padding: theme.spacing(1)
  },
  chatInputGrid: {
    height: "100%"
  }
}));

export default function Chat(props: IProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const {} = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { loading: loadingChatClient, data: chatClientData } = useChatClientQuery<IChatClientFragmentChat>(chatClientFragments.Chat, {
    variables: {
      sort_chat_last_message_at: "desc",
      limit: 10,
      offset: 0
    },
    fetchPolicy: "network-only"
  });

  console.log("chatClientData", chatClientData);
  let chatClients: IChatClientFragmentChat[] = [];

  if (chatClientData) {
    chatClients = chatClientData.chatClient.items;
  }
  console.log("chatClients", chatClients);
  // useEffect(() => {
  //   if(context.user) {
  //     Echo.private('App.User.' + context.user.id);
  //     // .listen('.ExampleEvent', (e: any) => {
  //     //   console.log('e', e);
  //     // });
  //
  //     return () => {
  //       Echo.leave('App.User.' + context.user.id);
  //     };
  //   }
  // }, [JSON.stringify(context.user)]);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const { value, setValue, error, disable } = useForm({
    message: {
      value: ""
    }
  });

  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let chatPaperContainerStyle = {
    width: "700px",
    height: "610px"
  };

  if (isMobile) {
    chatPaperContainerStyle = {
      width: "700px",
      height: "610px"
    };
  }

  return <>
    <Button className={classes.buttonToggleChat}
            variant="contained"
            color={"primary"}
            size={"large"}
            onClick={handleClick}>
      <ForumIcon className={classes.leftIcon}/>
      {t("chat")}
    </Button>
    <Popper open={open}
            anchorEl={anchorEl}
            disablePortal
            transition
            placement={"top-end"}
            modifiers={{
              flip: {
                enabled: false
              }
            }}>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={classes.rootPaper} style={chatPaperContainerStyle} elevation={3}>
            <Grid container className={classes.rootGrid}>
              {loadingChatClient ?
                <Grid container justify={"center"} alignContent={"center"} spacing={3}>
                  <Grid container item xs={12} justify={"center"}>
                    <CircularProgress color={"primary"}/>
                  </Grid>
                  <Grid container item xs={12} justify={"center"}>
                    <Typography variant={"h6"} color={"primary"}>
                      {t("loading chat")}...
                    </Typography>
                  </Grid>
                </Grid>
                :
                <>
                  <Grid item xs={4} md={4}>
                    <Paper className={classes.chatLeftPaper} square elevation={0}>
                      <List>
                        {chatClients.map(
                          chatClient => {
                            let chatOtherClient = chatClient.chat_clients.find(client =>
                              client.client_type !== chatClient.client_type || client.client_id !== chatClient.client_id) || chatClient.chat_clients[0];

                            let chatName = "";
                            let chatOtherClientSender = null;
                            if (chatOtherClient.client_type === CHAT_CLIENT.CLIENT_TYPE.USER) {
                              chatOtherClientSender = chatOtherClient.client as IChatClientFragmentChatIClientUser;
                              chatName = chatOtherClientSender.name;
                            }

                            if (chatOtherClient.client_type === CHAT_CLIENT.CLIENT_TYPE.SHOP) {
                              chatOtherClientSender = chatOtherClient.client as IChatClientFragmentChatIClientShop;
                              chatName = chatOtherClientSender.name;
                            }

                            let latestChatMessage = chatClient.chat.latest_chat_message;
                            let chatPreviewText = "";

                            if (latestChatMessage.type === CHAT_MESSAGE.MESSAGE_TYPE.TEXT) {
                              chatPreviewText = latestChatMessage.body;
                            }

                            if (latestChatMessage.type === CHAT_MESSAGE.MESSAGE_TYPE.IMAGE) {
                              chatPreviewText = `[${t("image")}]`;
                            }

                            if (latestChatMessage.type === CHAT_MESSAGE.MESSAGE_TYPE.NOTIFICATION) {
                              chatPreviewText = `[${t("notification")}]`;
                            }

                            return <React.Fragment key={chatClient.id}>
                              <ListItem selected={false} button>
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
                                    style={{ whiteSpace: 'pre-wrap' }}
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
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <Paper className={classes.chatRightPaper} square elevation={0}>
                      <Paper className={classes.chatInputPaper} square elevation={0}>
                        <Grid className={classes.chatInputGrid} container spacing={1} alignContent={"space-between"}>
                          <Grid xs={12} item>
                            <TextField
                              disabled={disable.message}
                              error={Boolean(error.message)}
                              placeholder={t("message...")}
                              value={value.message}
                              onChange={(e) => {
                                setValue("message", e.target.value);
                              }}
                              helperText={error.message}
                              margin="none"
                              fullWidth
                              multiline
                            />
                          </Grid>
                          <Grid xs={12} container item justify={"space-between"} spacing={1}>
                            <Grid item>

                            </Grid>
                            <Grid item>
                              <Button color={"primary"}
                                      size={"small"}
                                      variant={"contained"}>
                                {t("send")}
                                <SendIcon fontSize={"small"} className={classes.rightIcon}/>
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Paper>
                  </Grid>
                </>
              }

            </Grid>
          </Paper>
        </Fade>
      )}
    </Popper>
  </>;
}
