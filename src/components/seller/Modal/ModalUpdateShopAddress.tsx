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
import CountrySelect from "../../_select/CountrySelect";
import FormControl from "@material-ui/core/FormControl";
import GoogleMap from "../../../components/GoogleMap";
import Geolocation from "react-geolocation";
import GoogleMapMarker from "../../../components/GoogleMapMarker";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";

let shopAddressFields: any;
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
  shopAddress: any;
}

class ModalUpdateShopAddress extends React.Component<
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

    shopAddressFields = [
      {
        field: 'has_physical_shop',
        value: false
      },
      {
        field: 'address_1'
      },
      {
        field: 'address_2'
      },
      {
        field: 'address_3'
      },
      {
        field: 'city'
      },
      {
        field: 'state'
      },
      {
        field: 'postal_code'
      },
      {
        field: 'country'
      },
      {
        field: 'latitude'
      },
      {
        field: 'longitude'
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: false,
      shopAddress: {
        ...FormUtil.generateFieldsState(shopAddressFields)
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.isOpen && prevProps.isOpen !== this.props.isOpen) {
      await this.getShopAddress();
    }
  }

  async getShopAddress() {
    await this.setState(
      update(this.state, {
        dataLoaded: { $set: false }
      })
    );

    let { data } = await this.props.client.query({
      query: gql`
        query ShopAddress($shop_id: String) {
          shopAddress(shop_id: $shop_id) {
            items {
              id
              shop_id
              address_1
              address_2
              address_3
              city
              state
              postal_code
              country
              latitude
              longitude
              shop {
                id
                has_physical_shop
              }
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables: { shop_id: this.props.shopId }
    });
    let isDisabled = this.props.disabled;

    let shopAddress = data.shopAddress.items[0];
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopAddress: {
          has_physical_shop: {
            value: { $set: !!shopAddress.shop.has_physical_shop },
            disabled: { $set: isDisabled }
          },
          address_1: {
            value: { $set: shopAddress.address_1 || '' },
            disabled: { $set: isDisabled }
          },
          address_2: {
            value: { $set: shopAddress.address_2 || '' },
            disabled: { $set: isDisabled }
          },
          address_3: {
            value: { $set: shopAddress.address_3 || '' },
            disabled: { $set: isDisabled }
          },
          city: {
            value: { $set: shopAddress.city || '' },
            disabled: { $set: isDisabled }
          },
          state: {
            value: { $set: shopAddress.state || '' },
            disabled: { $set: isDisabled }
          },
          postal_code: {
            value: { $set: shopAddress.postal_code || '' },
            disabled: { $set: isDisabled }
          },
          country: {
            value: { $set: shopAddress.country || '' },
            disabled: { $set: isDisabled }
          },
          latitude: {
            value: { $set: shopAddress.latitude || '' },
            disabled: { $set: isDisabled }
          },
          longitude: {
            value: { $set: shopAddress.longitude || '' },
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
        shopAddress: {
          ...FormUtil.generateResetFieldsState(shopAddressFields)
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

  async updateShopAddressCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(t('shop address successfully updated'));
    await this.handleOkCloseDialog();
  }

  async updateShopAddressErrorHandler(error: any) {
    await this.checkShopAddressForm(error);
  }

  async checkShopAddressForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopAddressFields,
      this.state.shopAddress
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopAddressFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopAddress: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopAddress: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async updateShopAddress(updateShopAddressMutation: any) {
    if (await this.checkShopAddressForm()) {
      updateShopAddressMutation({
        variables: {
          shop_id: this.props.shopId,
          has_physical_shop: this.state.shopAddress.has_physical_shop.value,
          address_1: this.state.shopAddress.address_1.value,
          address_2: this.state.shopAddress.address_2.value,
          address_3: this.state.shopAddress.address_3.value,
          city: this.state.shopAddress.city.value,
          state: this.state.shopAddress.state.value,
          postal_code: this.state.shopAddress.postal_code.value,
          country: this.state.shopAddress.country.value,
          latitude: this.state.shopAddress.latitude.value,
          longitude: this.state.shopAddress.longitude.value
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
              <DialogTitle>{t('cancel edit shop address')}</DialogTitle>
              <DialogContent>
                {t('are you sure cancel edit address?')}
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
              maxWidth={'md'}
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
                      <FormControl
                        margin="none"
                        fullWidth
                        error={
                          !this.state.shopAddress.has_physical_shop.is_valid
                        }
                      >
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={
                                  this.state.shopAddress.has_physical_shop
                                    .disabled
                                }
                                checked={
                                  this.state.shopAddress.has_physical_shop.value
                                }
                                onChange={e => {
                                  this.setState(
                                    update(this.state, {
                                      shopAddress: {
                                        has_physical_shop: {
                                          value: { $set: e.target.checked }
                                        }
                                      }
                                    })
                                  );
                                }}
                                color="primary"
                              />
                            }
                            label={t('do you have physical shop?')}
                          />
                        </FormGroup>
                        {this.state.shopAddress.has_physical_shop.feedback && (
                          <FormHelperText>
                            {this.state.shopAddress.has_physical_shop.feedback}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required={
                          this.state.shopAddress.has_physical_shop.value
                        }
                        error={!this.state.shopAddress.address_1.is_valid}
                        label={t('address 1')}
                        value={this.state.shopAddress.address_1.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopAddress: {
                                address_1: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAddress.address_1.feedback}
                        margin="normal"
                        disabled={
                          this.state.shopAddress.address_1.disabled ||
                          !this.state.shopAddress.has_physical_shop.value
                        }
                        fullWidth
                      />
                      <TextField
                        error={!this.state.shopAddress.address_2.is_valid}
                        label={t('address 2')}
                        value={this.state.shopAddress.address_2.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopAddress: {
                                address_2: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAddress.address_2.feedback}
                        margin="normal"
                        disabled={
                          this.state.shopAddress.address_2.disabled ||
                          !this.state.shopAddress.has_physical_shop.value
                        }
                        fullWidth
                      />
                      <TextField
                        error={!this.state.shopAddress.address_3.is_valid}
                        label={t('address 3')}
                        value={this.state.shopAddress.address_3.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopAddress: {
                                address_3: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAddress.address_3.feedback}
                        margin="normal"
                        disabled={
                          this.state.shopAddress.address_3.disabled ||
                          !this.state.shopAddress.has_physical_shop.value
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required={
                          this.state.shopAddress.has_physical_shop.value
                        }
                        error={!this.state.shopAddress.city.is_valid}
                        label={t('city')}
                        value={this.state.shopAddress.city.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopAddress: {
                                city: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAddress.city.feedback}
                        margin="normal"
                        disabled={
                          this.state.shopAddress.city.disabled ||
                          !this.state.shopAddress.has_physical_shop.value
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required={
                          this.state.shopAddress.has_physical_shop.value
                        }
                        error={!this.state.shopAddress.state.is_valid}
                        label={t('state')}
                        value={this.state.shopAddress.state.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopAddress: {
                                state: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAddress.state.feedback}
                        margin="normal"
                        disabled={
                          this.state.shopAddress.state.disabled ||
                          !this.state.shopAddress.has_physical_shop.value
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required={
                          this.state.shopAddress.has_physical_shop.value
                        }
                        error={!this.state.shopAddress.postal_code.is_valid}
                        label={t('postal code')}
                        value={this.state.shopAddress.postal_code.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopAddress: {
                                postal_code: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAddress.postal_code.feedback}
                        margin="normal"
                        disabled={
                          this.state.shopAddress.postal_code.disabled ||
                          !this.state.shopAddress.has_physical_shop.value
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CountrySelect
                        required={
                          this.state.shopAddress.has_physical_shop.value
                        }
                        label={t('country')}
                        error={!this.state.shopAddress.country.is_valid}
                        helperText={this.state.shopAddress.country.feedback}
                        value={this.state.shopAddress.country.value}
                        onChange={(value: unknown) => {
                          this.setState(
                            update(this.state, {
                              shopAddress: {
                                country: { value: { $set: value } }
                              }
                            })
                          );
                        }}
                        margin="normal"
                        fullWidth
                        disabled={
                          this.state.shopAddress.country.disabled ||
                          !this.state.shopAddress.has_physical_shop.value
                        }
                      />
                    </Grid>
                    <Grid container item xs={12} spacing={3}>
                      <Grid item xs={12}>
                        {!this.state.shopAddress.latitude.disabled &&
                          !this.state.shopAddress.longitude.disabled &&
                          this.state.shopAddress.has_physical_shop.value && (
                            <FormControl margin="normal" fullWidth>
                              <div style={{ height: '400px', width: '100%' }}>
                                <Geolocation
                                  render={(geoData: any) => {
                                    let {
                                      fetchingPosition,
                                      position,
                                      error,
                                      getCurrentPosition
                                    } = geoData;

                                    let latitude = this.state.shopAddress
                                      .latitude.value
                                      ? this.state.shopAddress.latitude.value
                                      : position &&
                                        position.coords &&
                                        position.coords.latitude
                                      ? position.coords.latitude
                                      : null;

                                    let longitude = this.state.shopAddress
                                      .longitude.value
                                      ? this.state.shopAddress.longitude.value
                                      : position &&
                                        position.coords &&
                                        position.coords.longitude
                                      ? position.coords.longitude
                                      : null;

                                    return (
                                      <GoogleMap
                                        latitude={latitude}
                                        longitude={longitude}
                                        onClick={(data: any) => {
                                          let { x, y, lat, lng, event } = data;

                                          this.setState(
                                            update(this.state, {
                                              shopAddress: {
                                                latitude: {
                                                  value: { $set: lat }
                                                },
                                                longitude: {
                                                  value: { $set: lng }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                      >
                                        {this.state.shopAddress.latitude
                                          .value !== '' &&
                                          this.state.shopAddress.longitude
                                            .value !== '' && (
                                            <GoogleMapMarker
                                              lat={
                                                this.state.shopAddress.latitude
                                                  .value
                                              }
                                              lng={
                                                this.state.shopAddress.longitude
                                                  .value
                                              }
                                            />
                                          )}
                                      </GoogleMap>
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          )}
                        <div>
                          {this.state.shopAddress.latitude.is_valid === false &&
                            this.state.shopAddress.latitude.feedback !== '' && (
                              <FormHelperText error>
                                {this.state.shopAddress.latitude.feedback}
                              </FormHelperText>
                            )}
                          {this.state.shopAddress.longitude.is_valid ===
                            false &&
                            this.state.shopAddress.longitude.feedback !==
                              '' && (
                              <FormHelperText error>
                                {this.state.shopAddress.longitude.feedback}
                              </FormHelperText>
                            )}
                        </div>
                      </Grid>
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
                                  mutation UpdateShopAddressMutation(
                                    $shop_id: String!
                                    $has_physical_shop: Boolean
                                    $address_1: String
                                    $address_2: String
                                    $address_3: String
                                    $city: String
                                    $state: String
                                    $postal_code: String
                                    $country: String
                                    $latitude: String
                                    $longitude: String
                                  ) {
                                    updateShopAddressMutation(
                                      shop_id: $shop_id
                                      has_physical_shop: $has_physical_shop
                                      address_1: $address_1
                                      address_2: $address_2
                                      address_3: $address_3
                                      city: $city
                                      state: $state
                                      postal_code: $postal_code
                                      country: $country
                                      latitude: $latitude
                                      longitude: $longitude
                                    ) {
                                      id
                                      shop_id
                                      address_1
                                      address_2
                                      address_3
                                      city
                                      state
                                      postal_code
                                      country
                                      latitude
                                      longitude
                                    }
                                  }
                                `}
                                onCompleted={data => {
                                  this.updateShopAddressCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.updateShopAddressErrorHandler.bind(this)(
                                    error
                                  );
                                }}
                              >
                                {(
                                  updateShopAddressMutation,
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
                                        if (await this.checkShopAddressForm())
                                          this.updateShopAddress(
                                            updateShopAddressMutation
                                          );
                                      }}
                                    >
                                      {t('update shop address')}
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
    withTranslation()(withRouter(withApollo(ModalUpdateShopAddress)))
  )
);
