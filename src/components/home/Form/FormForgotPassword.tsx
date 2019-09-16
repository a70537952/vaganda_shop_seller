import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import FormUtil, { Fields } from '../../../utils/FormUtil';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { useSendResetPasswordEmailMutation } from '../../../graphql/mutation/userMutation/SendResetPasswordEmailMutation';

interface IProps {
  onLoginClick: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  login: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginLeft: theme.spacing(1)
  },
  buttonResetPassword: {
    marginTop: theme.spacing(2)
  },
  containerLogin: {
    marginTop: theme.spacing(2)
  },
  buttonResetPasswordProgress: {
    color: '#fff'
  }
}));

export default function FormForgotPassword(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let forgotPasswordFields = [
    {
      field: 'email',
      isCheckEmpty: true,
      emptyMessage: t('please enter email')
    }
  ];

  const [
    sendResetPasswordEmailMutation,
    { loading: isSendingResetPasswordEmailMutation }
  ] = useSendResetPasswordEmailMutation({
    onCompleted: data => {
      setForgotPassword(
        FormUtil.resetFieldsIsValidHook(forgotPasswordFields, forgotPassword)
      );
      enqueueSnackbar(
        t(
          'we have send a reset password link to your email, please sign in to your email account and check'
        ),
        {
          autoHideDuration: 30000
        }
      );
      props.onLoginClick();
    },
    onError: error => {
      checkSendResetPasswordEmailField(error);
    }
  });

  function checkSendResetPasswordEmailField(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      forgotPasswordFields,
      forgotPassword
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      forgotPasswordFields,
      error,
      checkedEmptyState
    );

    setForgotPassword(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  const [forgotPassword, setForgotPassword] = useState<Fields>(
    FormUtil.generateFieldsState(forgotPasswordFields)
  );

  function onClickSendResetPasswordEmail() {
    if (checkSendResetPasswordEmailField()) {
      sendResetPasswordEmailMutation({
        variables: {
          email: forgotPassword.email.value
        }
      });
    }
  }

  let { onLoginClick } = props;

  return (
    <Grid container item xs={10}>
      <Grid item xs={12}>
        <Typography variant="h6" align={'center'} gutterBottom paragraph>
          {t('forgot password?')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align={'center'}>
          {t(
            'if you need help resetting your password, we can help by sending you a link to your email to reset it.'
          )}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name={'email'}
          type={'email'}
          error={!forgotPassword.email.is_valid}
          label={t('email')}
          value={forgotPassword.email.value}
          onChange={(e: { target: { value: any } }) => {
            setForgotPassword(
              update(forgotPassword, {
                email: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={forgotPassword.email.feedback}
          margin={'dense'}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        {isSendingResetPasswordEmailMutation ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size={'large'}
            className={classes.buttonResetPassword}
          >
            <CircularProgress
              size={20}
              className={classes.buttonResetPasswordProgress}
            />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size={'large'}
            className={classes.buttonResetPassword}
            onClick={onClickSendResetPasswordEmail}
          >
            {t('send reset password email')}
          </Button>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        container
        justify={'center'}
        className={classes.containerLogin}
      >
        <Typography variant="body1" display="inline">
          {t('already have an account?')}
        </Typography>
        <Typography
          variant="body1"
          className={classes.login}
          display="inline"
          onClick={onLoginClick}
        >
          {t('sign in')}
        </Typography>
      </Grid>
    </Grid>
  );
}
