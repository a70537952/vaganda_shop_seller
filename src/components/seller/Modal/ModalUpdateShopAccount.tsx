import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Modal from '../../_modal/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles/index';
import update from 'immutability-helper';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { Mutation, withApollo, WithApolloClient } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import { AppContext } from '../../../contexts/Context';
import FormUtil from '../../../utils/FormUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

let shopAccountFields: any;
let t: any;

interface IProps {
  classes: any;
  shopId: string;
  disabled?: boolean;
  toggle: () => void;
  isOpen: boolean;
}

interface IState {
  isCloseDialogOpen: boolean;
  dataLoaded: boolean;
  shopAccount: any;
}

class ModalUpdateShopAccount extends React.Component<
  IProps &
    RouteComponentProps &
    WithTranslation &
    WithSnackbarProps &
    WithApolloClient<IProps>,
  IState
> {
  constructor(
    props: IProps &
      RouteComponentProps &
      WithTranslation &
      WithSnackbarProps &
      WithApolloClient<IProps>
  ) {
    super(props);

    t = this.props.t;

    shopAccountFields = [
      {
        field: 'account',
        isCheckEmpty: true,
        emptyMessage: t('please enter shop account'),
        value: ''
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      shopAccount: {
        ...FormUtil.generateFieldsState(shopAccountFields)
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.isOpen === true && prevProps.isOpen !== this.props.isOpen) {
      await this.getShopAccount();
    }
  }

  async getShopAccount() {
    await this.setState(
      update(this.state, {
        dataLoaded: { $set: false }
      })
    );

    let { data } = await this.props.client.query({
      query: gql`
        query ShopSetting($shop_id: String, $title: String) {
          shopSetting(shop_id: $shop_id, title: $title) {
            items {
              id
              shop_id
              title
              value
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables: { shop_id: this.props.shopId, title: 'account' }
    });
    let isDisabled = this.props.disabled;

    let shopSetting = data.shopSetting.items[0];
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopAccount: {
          account: {
            value: { $set: shopSetting ? shopSetting.value : '' },
            disabled: { $set: isDisabled }
          }
        }
      })
    );
  }

  resetStateData() {
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopAccount: {
          ...FormUtil.generateResetFieldsState(shopAccountFields)
        }
      })
    );
  }

  handleCancelCloseDialog() {
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
  }

  async handleOkCloseDialog() {
    await this.resetStateData();
    await this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
    await this.props.toggle();
  }

  toggleCloseDialog() {
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: true }
      })
    );
  }

  async updateShopAccountCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(t('shop account successfully updated'));
    await this.handleOkCloseDialog();
  }

  async updateShopAccountErrorHandler(error: any) {
    await this.checkShopAccountForm(error);
  }

  async checkShopAccountForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopAccountFields,
      this.state.shopAccount
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopAccountFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopAccount: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopAccount: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async updateShopAccount(updateShopAccountMutation: any) {
    if (await this.checkShopAccountForm()) {
      updateShopAccountMutation({
        variables: {
          shop_id: this.props.shopId,
          account: this.state.shopAccount.account.value
        }
      });
    }
  }

  render() {
    const { classes, t } = this.props;
    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Dialog
              maxWidth="sm"
              open={this.state.isCloseDialogOpen}
              onClose={this.handleCancelCloseDialog.bind(this)}
            >
              <DialogTitle>{t('cancel update shop account')}</DialogTitle>
              <DialogContent>
                {t('are you sure cancel update shop account?')}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleCancelCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={this.handleOkCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('ok')}
                </Button>
              </DialogActions>
            </Dialog>
            <Modal
              disableAutoFocus
              open={this.props.isOpen}
              onClose={() => {
                this.toggleCloseDialog();
              }}
              maxWidth={'sm'}
              fullWidth
            >
              <Grid
                container
                direction="row"
                item
                xs={12}
                spacing={1}
                className={classes.contentContainer}
              >
                {this.state.dataLoaded ? (
                  <>
                    <Grid item>
                      <Typography variant="subtitle1">
                        {t(
                          'setting up a unique shop account allows users to easily find your shop.'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        disabled={this.state.shopAccount.account.disabled}
                        error={!this.state.shopAccount.account.is_valid}
                        label={t('shop account')}
                        value={this.state.shopAccount.account.value}
                        onChange={(e: any) => {
                          this.setState(
                            update(this.state, {
                              shopAccount: {
                                account: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAccount.account.feedback}
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">@</InputAdornment>
                          )
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      container
                      item
                      justify="flex-end"
                      xs={12}
                      spacing={1}
                      className={classes.actionButtonContainer}
                    >
                      <Grid item>
                        <Button
                          onClick={this.toggleCloseDialog.bind(this)}
                          color="primary"
                        >
                          {t('cancel')}
                        </Button>
                      </Grid>
                      <Grid item>
                        {context.permission.includes('UPDATE_SHOP_SETTING') && (
                          <>
                            {this.props.shopId && (
                              <Mutation
                                mutation={gql`
                                  mutation UpdateShopAccountMutation(
                                    $shop_id: String!
                                    $account: String
                                  ) {
                                    updateShopAccountMutation(
                                      shop_id: $shop_id
                                      account: $account
                                    ) {
                                      id
                                      shop_id
                                      title
                                      value
                                    }
                                  }
                                `}
                                onCompleted={data => {
                                  this.updateShopAccountCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.updateShopAccountErrorHandler.bind(this)(
                                    error
                                  );
                                }}
                              >
                                {(
                                  updateShopAccountMutation,
                                  { data, loading, error }
                                ) => {
                                  if (loading) {
                                    return (
                                      <Button
                                        disabled
                                        variant="contained"
                                        color="primary"
                                      >
                                        {t('updating...')}
                                      </Button>
                                    );
                                  }

                                  return (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={async () => {
                                        if (await this.checkShopAccountForm())
                                          this.updateShopAccount(
                                            updateShopAccountMutation
                                          );
                                      }}
                                    >
                                      {t('update shop account')}
                                    </Button>
                                  );
                                }}
                              </Mutation>
                            )}
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    {new Array(4).fill(6).map((ele, index) => {
                      return (
                        <Grid key={index} item xs={12}>
                          <Skeleton variant={'rect'} height={50} />
                        </Grid>
                      );
                    })}
                  </>
                )}
              </Grid>
            </Modal>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  contentContainer: {
    margin: 0
  },
  actionButtonContainer: {
    marginTop: theme.spacing(2)
  }
}))(
  withSnackbar(
    withTranslation()(withRouter(withApollo(ModalUpdateShopAccount)))
  )
);
