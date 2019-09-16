import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles({
  processingDialogPaper: {
    backgroundColor: 'unset',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default function DialogProcessingPayment(props: IProps) {
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
      onClose={props.onClose}
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
              {t('global$$payment is processing...')}
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
