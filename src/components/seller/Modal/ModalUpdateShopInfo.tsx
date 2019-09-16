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

let shopInfoFields: any;
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
  shopInfo: any;
}

class ModalUpdateShopInfo extends React.Component<
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

    shopInfoFields = [
      {
        field: 'summary',
        value: ''
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      shopInfo: {
        ...FormUtil.generateFieldsState(shopInfoFields)
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.isOpen === true && prevProps.isOpen !== this.props.isOpen) {
      await this.getShopInfo();
    }
  }

  async getShopInfo() {
    await this.setState(
      update(this.state, {
        dataLoaded: { $set: false }
      })
    );

    let { data } = await this.props.client.query({
      query: gql`
        query ShopInfo($shop_id: String) {
          shopInfo(shop_id: $shop_id) {
            items {
              id
              shop_id
              summary
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables: { shop_id: this.props.shopId }
    });
    let isDisabled = this.props.disabled;

    let shopInfo = data.shopInfo.items[0];
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopInfo: {
          summary: {
            value: { $set: shopInfo.summary },
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
        shopInfo: {
          ...FormUtil.generateResetFieldsState(shopInfoFields)
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

  async updateShopInfoCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(t('shop info successfully updated'));
    await this.handleOkCloseDialog();
  }

  async updateShopInfoErrorHandler(error: any) {
    await this.checkShopInfoForm(error);
  }

  async checkShopInfoForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(shopInfoFields, this.state.shopInfo);

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopInfoFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopInfo: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopInfo: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async updateShopInfo(updateShopInfoMutation: any) {
    if (await this.checkShopInfoForm()) {
      updateShopInfoMutation({
        variables: {
          shop_id: this.props.shopId,
          summary: this.state.shopInfo.summary.value
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
              <DialogTitle>{t('cancel edit shop info')}</DialogTitle>
              <DialogContent>
                {t('are you sure cancel edit shop info?')}
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
                    <Grid item xs={12}>
                      <TextField
                        disabled={this.state.shopInfo.summary.disabled}
                        error={!this.state.shopInfo.summary.is_valid}
                        label={t('shop summary')}
                        value={this.state.shopInfo.summary.value}
                        onChange={(e: any) => {
                          this.setState(
                            update(this.state, {
                              shopInfo: {
                                summary: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopInfo.summary.feedback}
                        margin="normal"
                        placeholder={t('describe your shop...')}
                        fullWidth
                        multiline
                        rows="3"
                        rowsMax="8"
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
                                  mutation UpdateShopInfoMutation(
                                    $shop_id: String!
                                    $summary: String
                                  ) {
                                    updateShopInfoMutation(
                                      shop_id: $shop_id
                                      summary: $summary
                                    ) {
                                      id
                                      shop_id
                                      summary
                                    }
                                  }
                                `}
                                onCompleted={data => {
                                  this.updateShopInfoCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.updateShopInfoErrorHandler.bind(this)(
                                    error
                                  );
                                }}
                              >
                                {(
                                  updateShopInfoMutation,
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
                                        if (await this.checkShopInfoForm())
                                          this.updateShopInfo(
                                            updateShopInfoMutation
                                          );
                                      }}
                                    >
                                      {t('update shop info')}
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
                  <React.Fragment>
                    {new Array(4).fill(6).map((ele, index) => {
                      return (
                        <Grid key={index} item xs={12}>
                          <Skeleton variant={'rect'} height={50} />
                        </Grid>
                      );
                    })}
                  </React.Fragment>
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
  withSnackbar(withTranslation()(withRouter(withApollo(ModalUpdateShopInfo))))
);
