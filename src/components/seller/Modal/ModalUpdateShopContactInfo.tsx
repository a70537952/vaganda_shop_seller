import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { withStyles } from "@material-ui/core/styles/index";
import update from "immutability-helper";
import { withSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { Mutation, withApollo, WithApolloClient } from "react-apollo";
import { withRouter } from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import FormUtil from "../../../utils/FormUtil";
import { WithTranslation, withTranslation } from "react-i18next";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import TextField from "@material-ui/core/TextField";
import CountryPhoneCodeSelect from "../../_select/CountryPhoneCodeSelect";
import InputAdornment from "@material-ui/core/InputAdornment";

let shopContactInfoFields: any;
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
  shopContactInfo: any;
}

class ModalUpdateShopContactInfo extends React.Component<
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

    shopContactInfoFields = [
      {
        field: 'email',
        isCheckEmpty: true,
        emptyMessage: t('please enter shop email'),
        value: ''
      },
      {
        field: 'website',
        value: ''
      },
      {
        field: 'telephone_country_code',
        value: ''
      },
      {
        field: 'telephone',
        value: ''
      },
      {
        field: 'phone_country_code',
        isCheckEmpty: true,
        emptyMessage: t('please select phone country code'),
        value: ''
      },
      {
        field: 'phone',
        isCheckEmpty: true,
        emptyMessage: t('please enter shop phone'),
        value: ''
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      shopContactInfo: {
        ...FormUtil.generateFieldsState(shopContactInfoFields)
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.isOpen === true && prevProps.isOpen !== this.props.isOpen) {
      await this.getShopContactInfo();
    }
  }

  async getShopContactInfo() {
    await this.setState(
      update(this.state, {
        dataLoaded: { $set: false }
      })
    );

    let { data } = await this.props.client.query({
      query: gql`
        query ShopContactInfo($shop_id: String) {
          shopContactInfo(shop_id: $shop_id) {
            items {
              id
              shop_id
              email
              website
              telephone_country_code
              telephone
              phone_country_code
              phone
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables: { shop_id: this.props.shopId }
    });
    let isDisabled = this.props.disabled;

    let shopContactInfo = data.shopContactInfo.items[0];
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopContactInfo: {
          email: {
            value: { $set: shopContactInfo.email || '' },
            disabled: { $set: isDisabled }
          },
          website: {
            value: { $set: shopContactInfo.website || '' },
            disabled: { $set: isDisabled }
          },
          telephone_country_code: {
            value: { $set: shopContactInfo.telephone_country_code || '' },
            disabled: { $set: isDisabled }
          },
          telephone: {
            value: { $set: shopContactInfo.telephone || '' },
            disabled: { $set: isDisabled }
          },
          phone_country_code: {
            value: { $set: shopContactInfo.phone_country_code || '' },
            disabled: { $set: isDisabled }
          },
          phone: {
            value: { $set: shopContactInfo.phone || '' },
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
        shopContactInfo: {
          ...FormUtil.generateResetFieldsState(shopContactInfoFields)
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

  async updateShopContactInfoCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('shop contact info successfully updated')
    );
    await this.handleOkCloseDialog();
  }

  async updateShopContactInfoErrorHandler(error: any) {
    await this.checkShopContactInfoForm(error);
  }

  async checkShopContactInfoForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopContactInfoFields,
      this.state.shopContactInfo
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopContactInfoFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopContactInfo: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopContactInfo: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async updateShopContactInfo(updateShopContactInfoMutation: any) {
    if (await this.checkShopContactInfoForm()) {
      updateShopContactInfoMutation({
        variables: {
          shop_id: this.props.shopId,
          email: this.state.shopContactInfo.email.value,
          website: this.state.shopContactInfo.website.value,
          telephone_country_code: this.state.shopContactInfo
            .telephone_country_code.value,
          telephone: this.state.shopContactInfo.telephone.value,
          phone_country_code: this.state.shopContactInfo.phone_country_code
            .value,
          phone: this.state.shopContactInfo.phone.value
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
              <DialogTitle>{t('cancel edit shop contact info')}</DialogTitle>
              <DialogContent>
                {t('are you sure cancel edit shop contact info?')}
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
                spacing={3}
                className={classes.contentContainer}
              >
                {this.state.dataLoaded ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        disabled={this.state.shopContactInfo.email.disabled}
                        required
                        error={!this.state.shopContactInfo.email.is_valid}
                        label={t('shop email')}
                        value={this.state.shopContactInfo.email.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopContactInfo: {
                                email: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopContactInfo.email.feedback}
                        margin="normal"
                        fullWidth
                      />
                      <TextField
                        disabled={this.state.shopContactInfo.website.disabled}
                        error={!this.state.shopContactInfo.website.is_valid}
                        label={t('shop website')}
                        value={this.state.shopContactInfo.website.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopContactInfo: {
                                website: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopContactInfo.website.feedback}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <CountryPhoneCodeSelect
                        disabled={
                          this.state.shopContactInfo.telephone_country_code
                            .disabled
                        }
                        label={t('shop telephone code')}
                        error={
                          !this.state.shopContactInfo.telephone_country_code
                            .is_valid
                        }
                        helperText={
                          this.state.shopContactInfo.telephone_country_code
                            .feedback
                        }
                        value={
                          this.state.shopContactInfo.telephone_country_code
                            .value
                        }
                        onChange={(value: unknown) => {
                          this.setState(
                            update(this.state, {
                              shopContactInfo: {
                                telephone_country_code: {
                                  value: { $set: value }
                                }
                              }
                            })
                          );
                        }}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        disabled={this.state.shopContactInfo.telephone.disabled}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {
                                this.state.shopContactInfo
                                  .telephone_country_code.value
                              }
                            </InputAdornment>
                          )
                        }}
                        error={!this.state.shopContactInfo.telephone.is_valid}
                        label={t('shop telephone')}
                        value={this.state.shopContactInfo.telephone.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopContactInfo: {
                                telephone: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={
                          this.state.shopContactInfo.telephone.feedback
                        }
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <CountryPhoneCodeSelect
                        disabled={
                          this.state.shopContactInfo.phone_country_code.disabled
                        }
                        required
                        label={t('shop phone code')}
                        error={
                          !this.state.shopContactInfo.phone_country_code
                            .is_valid
                        }
                        helperText={
                          this.state.shopContactInfo.phone_country_code.feedback
                        }
                        value={
                          this.state.shopContactInfo.phone_country_code.value
                        }
                        onChange={(value: unknown) => {
                          this.setState(
                            update(this.state, {
                              shopContactInfo: {
                                phone_country_code: { value: { $set: value } }
                              }
                            })
                          );
                        }}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        disabled={this.state.shopContactInfo.phone.disabled}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {
                                this.state.shopContactInfo.phone_country_code
                                  .value
                              }
                            </InputAdornment>
                          )
                        }}
                        error={!this.state.shopContactInfo.phone.is_valid}
                        label={t('shop phone')}
                        value={this.state.shopContactInfo.phone.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopContactInfo: {
                                phone: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopContactInfo.phone.feedback}
                        margin="normal"
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
                                  mutation UpdateShopContactInfoMutation(
                                    $shop_id: String!
                                    $email: String
                                    $website: String
                                    $telephone_country_code: String
                                    $telephone: String
                                    $phone_country_code: String
                                    $phone: String
                                  ) {
                                    updateShopContactInfoMutation(
                                      shop_id: $shop_id
                                      email: $email
                                      website: $website
                                      telephone_country_code: $telephone_country_code
                                      telephone: $telephone
                                      phone_country_code: $phone_country_code
                                      phone: $phone
                                    ) {
                                      id
                                      shop_id
                                      email
                                      website
                                      telephone_country_code
                                      telephone
                                      phone_country_code
                                      phone
                                    }
                                  }
                                `}
                                onCompleted={data => {
                                  this.updateShopContactInfoCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.updateShopContactInfoErrorHandler.bind(
                                    this
                                  )(error);
                                }}
                              >
                                {(
                                  updateShopContactInfoMutation,
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
                                        if (
                                          await this.checkShopContactInfoForm()
                                        )
                                          this.updateShopContactInfo(
                                            updateShopContactInfoMutation
                                          );
                                      }}
                                    >
                                      {t('update shop contact info')}
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
  withSnackbar(
    withTranslation()(withRouter(withApollo(ModalUpdateShopContactInfo)))
  )
);
