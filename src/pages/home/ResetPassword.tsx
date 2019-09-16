import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { Mutation } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import HomeHelmet from '../../components/home/HomeHelmet';
import { AppContext } from '../../contexts/home/Context';
import FormUtil from './../../utils/FormUtil';
import FormHelperText from '@material-ui/core/FormHelperText';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import { homePath } from '../../utils/RouteUtil';

let resetPasswordFields: any;
let t: any;

interface IProps {
  classes: any;
}

interface IState {
  token: string | null;
  resetPassword: any;
  isResetPasswordCompleted: boolean;
}

class ResetPassword extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);

    t = this.props.t;

    resetPasswordFields = [
      {
        field: 'password',
        isCheckEmpty: true,
        emptyMessage: t('please enter password')
      },
      {
        field: 'confirmPassword',
        isCheckEmpty: true,
        emptyMessage: t('please enter confirm password')
      },
      { field: 'token' }
    ];

    this.state = {
      token: '',
      resetPassword: {
        ...FormUtil.generateFieldsState(resetPasswordFields)
      },
      isResetPasswordCompleted: false
    };
  }

  componentDidMount() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      this.setState(
        update(this.state, {
          token: { $set: urlParams.get('token') }
        })
      );
    }
  }

  resetPasswordCompletedHandler(data: any) {
    this.setState(
      update(this.state, {
        resetPassword: {
          ...FormUtil.resetFieldsIsValid(resetPasswordFields)
        },
        isResetPasswordCompleted: { $set: true }
      })
    );

    this.props.enqueueSnackbar(
      t(
        'you password has been reset successfully, you can sign in with your new password now',
        {
          autoHideDuration: 15000
        }
      )
    );
  }

  async resetPasswordErrorHandler(error: any) {
    await this.checkResetPasswordField(error);
  }

  async resetPassword(signUpUserMutation: any) {
    if (await this.checkResetPasswordField()) {
      signUpUserMutation({
        variables: {
          token: this.state.token,
          password: this.state.resetPassword.password.value
        }
      });
    }
  }

  async checkResetPasswordField(error?: any) {
    let isValid = true;

    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      resetPasswordFields,
      this.state.resetPassword
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(resetPasswordFields, error);

    await this.setState(
      update(this.state, {
        resetPassword: {
          ...emptyErrorStateObj
        }
      })
    );
    isValid = emptyIsValid && isValid;

    if (isValid) {
      isValid = (await this.isConfirmPasswordValid()) && isValid;
    }

    if (error) {
      await this.setState(
        update(this.state, {
          resetPassword: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  isConfirmPasswordValid() {
    if (
      this.state.resetPassword.password.value !==
      this.state.resetPassword.confirmPassword.value
    ) {
      this.setState(
        update(this.state, {
          resetPassword: {
            confirmPassword: {
              feedback: {
                $set: t('password does not match the confirm password')
              },
              is_valid: { $set: false }
            }
          }
        })
      );
      return false;
    }
    return true;
  }

  render() {
    const { classes, t } = this.props;

    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <HomeHelmet
              title={t('reset password')}
              description={'reset password'}
              keywords={t('reset password')}
              ogImage="/images/favicon-228.png"
            />
            <Grid container item direction="row" justify={'center'} xs={12}>
              <Grid container item xs={10} sm={8} md={6} lg={4}>
                <Grid item xs={12}>
                  <Typography variant="h6" align={'center'}>
                    {t('reset password')}
                  </Typography>
                </Grid>
                {!this.state.isResetPasswordCompleted && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body1" align={'center'}>
                        {t(
                          'please enter your new password to reset your account password'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="password"
                        error={!this.state.resetPassword.password.is_valid}
                        label={t('password')}
                        value={this.state.resetPassword.password.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              resetPassword: {
                                password: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.resetPassword.password.feedback}
                        margin={'dense'}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="password"
                        error={
                          !this.state.resetPassword.confirmPassword.is_valid
                        }
                        label={t('confirm password')}
                        value={this.state.resetPassword.confirmPassword.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              resetPassword: {
                                confirmPassword: {
                                  value: { $set: e.target.value }
                                }
                              }
                            })
                          );
                        }}
                        helperText={
                          this.state.resetPassword.confirmPassword.feedback
                        }
                        margin={'dense'}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {!this.state.resetPassword.token.is_valid && (
                        <FormHelperText error>
                          {this.state.resetPassword.token.feedback}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Mutation
                        mutation={gql`
                          mutation ResetUserPasswordMutation(
                            $token: String!
                            $password: String!
                          ) {
                            resetUserPasswordMutation(
                              token: $token
                              password: $password
                            ) {
                              id
                            }
                          }
                        `}
                        onCompleted={data => {
                          this.resetPasswordCompletedHandler.bind(this)(data);
                          context.getContext();
                        }}
                        onError={error => {
                          this.resetPasswordErrorHandler.bind(this)(error);
                        }}
                      >
                        {(
                          resetUserPasswordMutation,
                          { data, loading, error }
                        ) => {
                          if (loading) {
                            return (
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size={'large'}
                                className={classes.buttonResetPassword}
                              >
                                <CircularProgress
                                  size={20}
                                  className={
                                    classes.buttonResetPasswordProgress
                                  }
                                />
                              </Button>
                            );
                          }

                          return (
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              size={'large'}
                              className={classes.buttonResetPassword}
                              onClick={this.resetPassword.bind(
                                this,
                                resetUserPasswordMutation
                              )}
                            >
                              {t('reset password')}
                            </Button>
                          );
                        }}
                      </Mutation>
                    </Grid>
                  </>
                )}
                {this.state.isResetPasswordCompleted && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body1" align={'center'}>
                        {t(
                          'you password has been reset successfully, click the button below to return to home page'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size={'large'}
                        className={classes.buttonResetPassword}
                        {...({ component: Link, to: homePath('home') } as any)}
                      >
                        {t('back to home')}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  paper: {
    width: '100%',
    padding: theme.spacing(3)
  },
  buttonResetPassword: {
    marginTop: theme.spacing(2)
  },
  buttonResetPasswordProgress: {
    color: '#fff'
  }
}))(withSnackbar(withTranslation()(withRouter(ResetPassword))));
