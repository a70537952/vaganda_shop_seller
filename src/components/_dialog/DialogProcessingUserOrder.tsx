import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  open: boolean;
}

const useStyles = makeStyles({
  processingDialogPaper: {
    backgroundColor: 'unset',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default function DialogProcessingUserOrder(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog
      fullScreen
      open={props.open}
      PaperProps={{
        classes: {
          root: classes.processingDialogPaper
        }
      }}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <div>
        <Grid item container xs={12} spacing={3}>
          <Grid container alignItems="center" justify="center" item xs={12}>
            <CircularProgress size={45} color="primary" />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="inherit"
              align="center"
              gutterBottom
            >
              {t('global$$order is processing...')}
            </Typography>
            <Typography
              variant="subtitle1"
              color="inherit"
              align="center"
              gutterBottom
            >
              {t('global$$please do not close this window')}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}
