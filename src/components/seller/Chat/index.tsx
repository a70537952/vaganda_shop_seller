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
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import useForm from "../../_hook/useForm";
import SendIcon from '@material-ui/icons/Send';

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
    position: "absolute",
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
    height: '100%'
  }
}));

export default function Chat(props: IProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const {} = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const {value, setValue, error, disable} = useForm({
    message: {
      value: ''
    }
  });

  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let chatPaperContainerStyle = {
    width: "570px",
    height: "510px"
  };

  if (isMobile) {
    chatPaperContainerStyle = {
      width: "570px",
      height: "510px"
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
    <Popper open={open} anchorEl={anchorEl} transition placement={"top-end"}>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={classes.rootPaper} style={chatPaperContainerStyle}>
            <Grid container className={classes.rootGrid}>
              <Grid item xs={3} md={3}>
                <Paper className={classes.chatLeftPaper} square elevation={0}>
                  123
                </Paper>
              </Grid>
              <Grid item xs={9} md={9}>
                <Paper className={classes.chatRightPaper} square elevation={0}>
                  <Paper className={classes.chatInputPaper} square elevation={0}>
                    <Grid className={classes.chatInputGrid} container spacing={1} alignContent={'space-between'}>
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
                      <Grid xs={12} container item justify={'space-between'} spacing={1}>
                        <Grid item>

                        </Grid>
                        <Grid item>
                          <Button color={'primary'}
                                  size={'small'}
                                  variant={'contained'}>
                            {t('send')}
                            <SendIcon fontSize={'small'} className={classes.rightIcon}/>
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      )}
    </Popper>
  </>;
}