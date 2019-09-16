import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import FormUtil, { Fields } from '../../../utils/FormUtil';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { useSignUpUserMutation } from '../../../graphql/mutation/authMutation/SignUpUserMutation';
import { userQuery } from '../../../graphql/query/UserQuery';
import { WithPagination } from '../../../graphql/query/Query';
import { IUserFragmentFormSignUp } from '../../../graphql/fragment/interface/UserFragmentInterface';
import { userFragments } from '../../../graphql/fragment/query/UserFragment';
import { signUpUserMutationFragments } from '../../../graphql/fragment/mutation/SignUpUserMutationFragment';

interface IProps {
  onLoginClick: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  login: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginLeft: theme.spacing(1)
  },
  buttonSignUp: {
    marginTop: theme.spacing(2)
  },
  containerLogin: {
    marginTop: theme.spacing(2)
  },
  buttonSignUpProgress: {
    color: '#fff'
  }
}));

export default function FormSignUp(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const client = useApolloClient();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let signUpFields = [
    {
      field: 'username',
      isCheckEmpty: true,
      emptyMessage: t('please enter username')
    },
    {
      field: 'email',
      isCheckEmpty: true,
      emptyMessage: t('please enter email')
    },
    {
      field: 'password',
      isCheckEmpty: true,
      emptyMessage: t('please enter password')
    },
    {
      field: 'confirmPassword',
      isCheckEmpty: true,
      emptyMessage: t('please enter confirm password')
    }
  ];

  const [
    signUpUserMutation,
    { loading: isSigningUpUserMutation }
  ] = useSignUpUserMutation(signUpUserMutationFragments.DefaultFragment, {
    onCompleted: data => {
      setSignUp(signUp =>
        FormUtil.resetFieldsIsValidHook(signUpFields, signUp)
      );
      enqueueSnackbar(
        t(
          'we have send verification email to your email address. please look for the verification email in your inbox and click the link in that email.'
        ),
        {
          autoHideDuration: 30000
        }
      );
      onLoginClick();
    },
    onError: error => {
      checkSignUpField(error);
    }
  });

  const [signUp, setSignUp] = useState<Fields>(
    FormUtil.generateFieldsState(signUpFields)
  );

  async function onClickSignUp() {
    if (await checkSignUpField()) {
      signUpUserMutation({
        variables: {
          username: signUp.username.value,
          email: signUp.email.value,
          password: signUp.password.value
        }
      });
    }
  }

  async function checkSignUpField(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(signUpFields, signUp);

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      signUpFields,
      error,
      checkedEmptyState
    );

    setSignUp(checkedErrorState);

    let isInfoValid = true;
    if (emptyIsValid && validationIsValid) {
      isInfoValid =
        (await isUsernameValid()) &&
        (await isEmailValid()) &&
        (await isConfirmPasswordValid());
    }

    return emptyIsValid && validationIsValid && isInfoValid;
  }

  function isUsernameValid() {
    if (signUp.username.value !== '') {
      return client
        .query<{ user: WithPagination<IUserFragmentFormSignUp> }>({
          query: userQuery(userFragments.FormSignUp),
          variables: { username: signUp.username.value }
        })
        .then(({ data }) => {
          let isUsernameValid = !(data.user.items.length > 0);

          setSignUp(signUp =>
            update(signUp, {
              username: {
                feedback: {
                  $set: isUsernameValid ? '' : t('this username already exists')
                },
                is_valid: { $set: isUsernameValid }
              }
            })
          );

          return isUsernameValid;
        });
    }
    return false;
  }

  function isEmailValid() {
    if (signUp.email.value !== '') {
      return client
        .query<{ user: WithPagination<IUserFragmentFormSignUp> }>({
          query: userQuery(userFragments.FormSignUp),
          variables: { email: signUp.email.value }
        })
        .then(({ data }) => {
          let isEmailValid = !(data.user.items.length > 0);

          setSignUp(signUp =>
            update(signUp, {
              email: {
                feedback: {
                  $set: isEmailValid ? '' : t('this email already exists')
                },
                is_valid: { $set: isEmailValid }
              }
            })
          );

          return isEmailValid;
        });
    }
    return false;
  }

  function isConfirmPasswordValid() {
    if (signUp.password.value !== signUp.confirmPassword.value) {
      setSignUp(signUp =>
        update(signUp, {
          confirmPassword: {
            feedback: {
              $set: t('password does not match the confirm password')
            },
            is_valid: { $set: false }
          }
        })
      );
      return false;
    }
    return true;
  }

  let { onLoginClick } = props;

  return (
    <Grid container item xs={10}>
      <Grid item xs={12}>
        <Typography variant="h6" align={'center'}>
          {t('sign up')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name={'username'}
          error={!signUp.username.is_valid}
          label={t('username')}
          value={signUp.username.value}
          onChange={(e: { target: { value: any } }) => {
            setSignUp(
              update(signUp, {
                username: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={signUp.username.feedback}
          margin={'dense'}
          fullWidth
          onBlur={isUsernameValid}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name={'email'}
          type={'email'}
          error={!signUp.email.is_valid}
          label={t('email')}
          value={signUp.email.value}
          onChange={(e: { target: { value: any } }) => {
            setSignUp(
              update(signUp, {
                email: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          onBlur={isEmailValid}
          helperText={signUp.email.feedback}
          margin={'dense'}
          fullWidth
        />
        <FormHelperText error={false}>
          {t(
            'your email will receive notification and used to reset you password when you forgot your account password'
          )}
        </FormHelperText>
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          error={!signUp.password.is_valid}
          label={t('password')}
          value={signUp.password.value}
          onChange={(e: { target: { value: any } }) => {
            setSignUp(
              update(signUp, {
                password: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={signUp.password.feedback}
          margin={'dense'}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          error={!signUp.confirmPassword.is_valid}
          label={t('confirm password')}
          value={signUp.confirmPassword.value}
          onChange={(e: { target: { value: any } }) => {
            setSignUp(
              update(signUp, {
                confirmPassword: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={signUp.confirmPassword.feedback}
          margin={'dense'}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        {isSigningUpUserMutation ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size={'large'}
            className={classes.buttonSignUp}
          >
            <CircularProgress
              size={20}
              className={classes.buttonSignUpProgress}
            />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size={'large'}
            className={classes.buttonSignUp}
            onClick={onClickSignUp}
          >
            {t('sign up')}
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
