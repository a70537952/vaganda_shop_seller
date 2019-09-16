import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Typography from '@material-ui/core/Typography';
import IconClose from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  isOpen: boolean;
  toggle: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  borderRound: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '50%',
    padding: '15px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
  checkIcon: {
    fontSize: '50px'
  },
  buttonClose: {
    marginTop: theme.spacing(1)
  },
  content: {
    margin: 0
  }
}));

export default function ModalPaymentFailed(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isOpen, toggle } = props;

  return (
    <Modal
      disableBackdropClick
      closeAfterTransition
      disableAutoFocus
      open={isOpen}
      onClose={toggle}
      fullWidth
    >
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
        className={classes.content}
      >
        <Grid container item xs={12} justify={'center'}>
          <div className={classes.borderRound}>
            <IconClose color={'primary'} className={classes.checkIcon} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography
            paragraph
            gutterBottom
            variant="h5"
            color="initial"
            align="center"
            style={{ textTransform: 'capitalize' }}
          >
            {t('global$$payment failed')}
          </Typography>
          <Typography variant="body1" color="initial" align="center">
            {t('global$$your payment has failed. please try again.')}
          </Typography>
        </Grid>
        <Grid
          container
          item
          justify="center"
          alignItems={'center'}
          direction="column"
          xs={12}
          spacing={1}
        >
          <Button
            size="large"
            variant="outlined"
            color="primary"
            onClick={toggle}
          >
            {t('global$$close')}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
