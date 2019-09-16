import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles/index';
import SvgIcon from '@material-ui/core/SvgIcon';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import FormUtil, { Fields } from '../../../utils/FormUtil';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { useSignInUserMutation } from '../../../graphql/mutation/authMutation/SignInUserMutation';
import { useResendVerifyUserEmailMutation } from '../../../graphql/mutation/authMutation/ResendVerifyUserEmailMutation';
import { AppContext } from '../../../contexts/home/Context';
import { useFacebookSignInMutation } from '../../../graphql/mutation/authMutation/FacebookSignInMutation';
import { useCookies } from 'react-cookie';
import { getCookieKey, getCookieOption } from '../../../utils/CookieUtil';
import { resendVerifyUserEmailMutationFragments } from '../../../graphql/fragment/mutation/ResendVerifyUserEmailMutationFragment';
import { signInUserMutationFragments } from '../../../graphql/fragment/mutation/SignInUserMutationFragment';
import { facebookSignInMutationFragments } from '../../../graphql/fragment/mutation/FacebookSignInMutationFragment';

interface IProps {
  onForgotPasswordClick: () => void;
  onSignUpClick: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  forgotPassword: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginBottom: theme.spacing(1)
  },
  register: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginLeft: theme.spacing(1)
  },
  textOr: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  buttonFacebook: {
    backgroundColor: '#3b5999',
    '&:hover': {
      backgroundColor: '#3b5999'
    }
  },
  iconFacebook: {
    marginRight: theme.spacing(1)
  },
  containerRegister: {
    marginTop: theme.spacing(2)
  },
  buttonSignInProgress: {
    color: '#fff'
  }
}));

export default function FormSignIn(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [cookie, setCookie] = useCookies([]);
  let signInFields = [
    {
      field: 'email',
      isCheckEmpty: true,
      emptyMessage: t('please enter email')
    },
    {
      field: 'password',
      isCheckEmpty: true,
      emptyMessage: t('please enter password')
    }
  ];

  const [
    resendVerifyUserEmailMutation,
    { loading: isResendingVerifyUserEmailMutation }
  ] = useResendVerifyUserEmailMutation(
    resendVerifyUserEmailMutationFragments.DefaultFragment,
    {
      onCompleted: data => {
        enqueueSnackbar(t('we have send an verify email to your email'));
      }
    }
  );
  const [
    signInUserMutation,
    { loading: isSigningInUserMutation }
  ] = useSignInUserMutation(signInUserMutationFragments.DefaultFragment, {
    onCompleted: data => {
      setSignIn(FormUtil.resetFieldsIsValidHook(signInFields, signIn));
      onSignInCompleted(data.signInUserMutation);
    },
    onError: error => {
      checkSignInField(error);
    }
  });
  const [
    facebookSignInMutation,
    { loading: isFacebookSigningInMutation }
  ] = useFacebookSignInMutation(
    facebookSignInMutationFragments.DefaultFragment,
    {
      onCompleted: data => {
        onSignInCompleted(data.facebookSignInMutation);
      },
      onError: error => {
        checkSignInField(error);
      }
    }
  );

  function onSignInCompleted(data: any) {
    setCookie(getCookieKey('api_token'), data.api_token, getCookieOption());
    window.location.reload();
  }

  const [signIn, setSignIn] = useState<Fields>(
    FormUtil.generateFieldsState(signInFields)
  );
  const [showVerifyAccountMessage, setShowVerifyAccountMessage] = useState<
    boolean
  >(false);

  function onClickSignIn() {
    if (checkSignInField()) {
      signInUserMutation({
        variables: {
          email: signIn.email.value,
          password: signIn.password.value
        }
      });
    }
  }

  function checkSignInField(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(signInFields, signIn);

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      signInFields,
      error,
      checkedEmptyState
    );

    setShowVerifyAccountMessage(
      Boolean(FormUtil.getValidationErrorByField('account_verified', error))
    );
    setSignIn(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  let { onForgotPasswordClick, onSignUpClick } = props;

  return (
    <Grid container item xs={10}>
      <Grid item xs={12}>
        <Typography variant="h6" align={'center'}>
          {t('sign in')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name={'email'}
          error={!signIn.email.is_valid}
          label={t('email')}
          value={signIn.email.value}
          onChange={(e: { target: { value: any } }) => {
            setSignIn(
              update(signIn, {
                email: {
                  value: { $set: e.target.value }
                }
              })
            );
            setShowVerifyAccountMessage(false);
          }}
          helperText={signIn.email.feedback}
          margin={'dense'}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          error={!signIn.password.is_valid}
          label={t('password')}
          value={signIn.password.value}
          onChange={(e: { target: { value: any } }) => {
            setSignIn(
              update(signIn, {
                password: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={signIn.password.feedback}
          margin={'dense'}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          display={'block'}
          variant="caption"
          align={'right'}
          className={classes.forgotPassword}
          onClick={onForgotPasswordClick}
        >
          {t('forgot password?')}
        </Typography>
      </Grid>
      {showVerifyAccountMessage && (
        <Grid container item xs={12} alignItems={'center'}>
          <Typography display={'inline'} variant="body2" gutterBottom>
            {t(
              'you have not verified your account. to complete the process of verify your account, please log in to your email account and find the email we have sent you.'
            )}
            {isResendingVerifyUserEmailMutation ? (
              <Button color="default" disabled size={'small'}>
                {t('sending...')}
              </Button>
            ) : (
              <Button
                color="primary"
                size={'small'}
                onClick={() => {
                  resendVerifyUserEmailMutation({
                    variables: {
                      email: signIn.email.value
                    }
                  });
                }}
              >
                {t('click here to resend')}
              </Button>
            )}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12}>
        {isSigningInUserMutation ? (
          <Button variant="contained" color="primary" fullWidth size={'large'}>
            <CircularProgress
              size={20}
              className={classes.buttonSignInProgress}
            />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size={'large'}
            onClick={onClickSignIn}
          >
            {t('sign in')}
          </Button>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align={'center'} className={classes.textOr}>
          {t('or')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {isFacebookSigningInMutation ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.buttonFacebook}
            size={'large'}
          >
            <CircularProgress
              size={20}
              className={classes.buttonSignInProgress}
            />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.buttonFacebook}
            size={'large'}
            onClick={() => {
              const FB = window.FB;
              FB.login(
                function(response: any) {
                  if (response.authResponse) {
                    FB.api('/me', function(response: any) {
                      let { id, name, email } = response;
                      facebookSignInMutation({
                        variables: {
                          facebookID: id,
                          email: email,
                          name: name
                        }
                      });
                    });
                  }
                },
                { scope: 'email' }
              );
            }}
          >
            <SvgIcon className={classes.iconFacebook}>
              <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z" />
            </SvgIcon>
            {t('login with facebook')}
          </Button>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        container
        justify={'center'}
        className={classes.containerRegister}
      >
        <Typography variant="body1" display="inline">
          {t("don't have an account?")}
        </Typography>
        <Typography
          variant="body1"
          className={classes.register}
          display="inline"
          onClick={onSignUpClick}
        >
          {t('sign up')}
        </Typography>
      </Grid>
    </Grid>
  );
}
