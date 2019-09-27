import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import update from "immutability-helper";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import FormUtil, { Fields } from "../../../utils/FormUtil";
import { useTranslation } from "react-i18next";
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
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateShopAddressMutation } from "../../../graphql/mutation/shopMutation/UpdateShopAddressMutation";
import { shopAddressFragments } from "../../../graphql/fragment/query/ShopAddressFragment";
import { IShopAddressFragmentModalUpdateShopAddress } from "../../../graphql/fragmentType/query/ShopAddressFragmentInterface";
import { shopAddressQuery, ShopAddressVars } from "../../../graphql/query/ShopAddressQuery";

interface IProps {
  shopId: string;
  disabled?: boolean;
  toggle: () => void;
  isOpen: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  contentContainer: {
    margin: 0
  },
  actionButtonContainer: {
    marginTop: theme.spacing(2)
  }
}));

export default function ModalUpdateShopAddress(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const client = useApolloClient();
  const {
    shopId,
    disabled,
    toggle,
    isOpen
  } = props;

  let shopAddressFields = [
    {
      field: "has_physical_shop",
      value: false
    },
    {
      field: "address_1"
    },
    {
      field: "address_2"
    },
    {
      field: "address_3"
    },
    {
      field: "city"
    },
    {
      field: "state"
    },
    {
      field: "postal_code"
    },
    {
      field: "country"
    },
    {
      field: "latitude"
    },
    {
      field: "longitude"
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopAddress, setShopAddress] = useState<Fields>(FormUtil.generateFieldsState(shopAddressFields));

  const [
    updateShopAddressMutation,
    { loading: isUpdatingShopAddressMutation }
  ] = useUpdateShopAddressMutation<IShopAddressFragmentModalUpdateShopAddress>(shopAddressFragments.ModalUpdateShopAddress, {
    onCompleted: () => {
      toast.default(
        t("shop address successfully updated")
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkShopAddressForm(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopAddress();
  }, [isOpen, shopId]);

  async function getShopAddress() {
    if (shopId && isOpen) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopAddress: WithPagination<IShopAddressFragmentModalUpdateShopAddress> },
        ShopAddressVars>({
        query: shopAddressQuery(shopAddressFragments.ModalUpdateShopAddress),
        variables: { shop_id: shopId }
      });

      let isDisabled = disabled;
      let shopAddressData = data.shopAddress.items[0];
      setShopAddress(
        update(shopAddress, {
          has_physical_shop: {
            value: { $set: !!shopAddressData.shop.has_physical_shop },
            disabled: { $set: isDisabled }
          },
          address_1: {
            value: { $set: shopAddressData.address_1 || "" },
            disabled: { $set: isDisabled }
          },
          address_2: {
            value: { $set: shopAddressData.address_2 || "" },
            disabled: { $set: isDisabled }
          },
          address_3: {
            value: { $set: shopAddressData.address_3 || "" },
            disabled: { $set: isDisabled }
          },
          city: {
            value: { $set: shopAddressData.city || "" },
            disabled: { $set: isDisabled }
          },
          state: {
            value: { $set: shopAddressData.state || "" },
            disabled: { $set: isDisabled }
          },
          postal_code: {
            value: { $set: shopAddressData.postal_code || "" },
            disabled: { $set: isDisabled }
          },
          country: {
            value: { $set: shopAddressData.country || "" },
            disabled: { $set: isDisabled }
          },
          latitude: {
            value: { $set: shopAddressData.latitude || "" },
            disabled: { $set: isDisabled }
          },
          longitude: {
            value: { $set: shopAddressData.longitude || "" },
            disabled: { $set: isDisabled }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopAddress(shopAddress => FormUtil.generateResetFieldsStateHook(shopAddressFields, shopAddress));
  }

  function handleCancelCloseDialog() {
    setIsCloseDialogOpen(false);
  }

  async function handleOkCloseDialog() {
    resetStateData();
    setIsCloseDialogOpen(false);
    await toggle();
  }

  function toggleCloseDialog() {
    setIsCloseDialogOpen(true);
  }

  async function checkShopAddressForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopAddressFields,
      shopAddress
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopAddressFields,
      error,
      checkedEmptyState
    );

    setShopAddress(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function updateShopAddress() {
    if (await checkShopAddressForm()) {
      updateShopAddressMutation({
        variables: {
          shop_id: shopId,
          has_physical_shop: shopAddress.has_physical_shop.value,
          address_1: shopAddress.address_1.value,
          address_2: shopAddress.address_2.value,
          address_3: shopAddress.address_3.value,
          city: shopAddress.city.value,
          state: shopAddress.state.value,
          postal_code: shopAddress.postal_code.value,
          country: shopAddress.country.value,
          latitude: shopAddress.latitude.value,
          longitude: shopAddress.longitude.value
        }
      });
    }
  }

  return <>
    <Dialog
      maxWidth="sm"
      open={isCloseDialogOpen}
      onClose={handleCancelCloseDialog}
    >
      <DialogTitle>{t("cancel edit shop address")}</DialogTitle>
      <DialogContent>
        {t("are you sure cancel edit address?")}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancelCloseDialog}
          color="primary"
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleOkCloseDialog}
          color="primary"
        >
          {t("ok")}
        </Button>
      </DialogActions>
    </Dialog>
    <Modal
      disableAutoFocus
      open={isOpen}
      onClose={toggleCloseDialog}
      maxWidth={"md"}
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
        {isDataLoaded ? (
          <>
            <Grid item xs={12}>
              <FormControl
                margin="none"
                fullWidth
                error={
                  !shopAddress.has_physical_shop.is_valid
                }
              >
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={
                          shopAddress.has_physical_shop
                            .disabled
                        }
                        checked={
                          shopAddress.has_physical_shop.value
                        }
                        onChange={e => {
                          setShopAddress(
                            update(shopAddress, {
                              has_physical_shop: {
                                value: { $set: e.target.checked }
                              }
                            })
                          );
                        }}
                        color="primary"
                      />
                    }
                    label={t("do you have physical shop?")}
                  />
                </FormGroup>
                {shopAddress.has_physical_shop.feedback && (
                  <FormHelperText>
                    {shopAddress.has_physical_shop.feedback}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required={
                  shopAddress.has_physical_shop.value
                }
                error={!shopAddress.address_1.is_valid}
                label={t("address 1")}
                value={shopAddress.address_1.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopAddress(
                    update(shopAddress, {
                      address_1: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAddress.address_1.feedback}
                margin="normal"
                disabled={
                  shopAddress.address_1.disabled ||
                  !shopAddress.has_physical_shop.value
                }
                fullWidth
              />
              <TextField
                error={!shopAddress.address_2.is_valid}
                label={t("address 2")}
                value={shopAddress.address_2.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopAddress(
                    update(shopAddress, {
                      address_2: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAddress.address_2.feedback}
                margin="normal"
                disabled={
                  shopAddress.address_2.disabled ||
                  !shopAddress.has_physical_shop.value
                }
                fullWidth
              />
              <TextField
                error={!shopAddress.address_3.is_valid}
                label={t("address 3")}
                value={shopAddress.address_3.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopAddress(
                    update(shopAddress, {
                      address_3: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAddress.address_3.feedback}
                margin="normal"
                disabled={
                  shopAddress.address_3.disabled ||
                  !shopAddress.has_physical_shop.value
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required={
                  shopAddress.has_physical_shop.value
                }
                error={!shopAddress.city.is_valid}
                label={t("city")}
                value={shopAddress.city.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopAddress(
                    update(shopAddress, {
                      city: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAddress.city.feedback}
                margin="normal"
                disabled={
                  shopAddress.city.disabled ||
                  !shopAddress.has_physical_shop.value
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required={
                  shopAddress.has_physical_shop.value
                }
                error={!shopAddress.state.is_valid}
                label={t("state")}
                value={shopAddress.state.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopAddress(
                    update(shopAddress, {
                      state: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAddress.state.feedback}
                margin="normal"
                disabled={
                  shopAddress.state.disabled ||
                  !shopAddress.has_physical_shop.value
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required={
                  shopAddress.has_physical_shop.value
                }
                error={!shopAddress.postal_code.is_valid}
                label={t("postal code")}
                value={shopAddress.postal_code.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopAddress(
                    update(shopAddress, {
                      postal_code: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAddress.postal_code.feedback}
                margin="normal"
                disabled={
                  shopAddress.postal_code.disabled ||
                  !shopAddress.has_physical_shop.value
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CountrySelect
                required={
                  shopAddress.has_physical_shop.value
                }
                label={t("country")}
                error={!shopAddress.country.is_valid}
                helperText={shopAddress.country.feedback}
                value={shopAddress.country.value}
                onChange={(value: unknown) => {
                  setShopAddress(
                    update(shopAddress, {
                      country: { value: { $set: value } }
                    })
                  );
                }}
                margin="normal"
                fullWidth
                disabled={
                  shopAddress.country.disabled ||
                  !shopAddress.has_physical_shop.value
                }
              />
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={12}>
                {!shopAddress.latitude.disabled &&
                !shopAddress.longitude.disabled &&
                shopAddress.has_physical_shop.value && (
                  <FormControl margin="normal" fullWidth>
                    <div style={{ height: "400px", width: "100%" }}>
                      <Geolocation
                        render={(geoData: any) => {
                          let {
                            fetchingPosition,
                            position,
                            error,
                            getCurrentPosition
                          } = geoData;

                          let latitude = shopAddress
                            .latitude.value
                            ? shopAddress.latitude.value
                            : position &&
                            position.coords &&
                            position.coords.latitude
                              ? position.coords.latitude
                              : null;

                          let longitude = shopAddress
                            .longitude.value
                            ? shopAddress.longitude.value
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

                                setShopAddress(
                                  update(shopAddress, {
                                    latitude: {
                                      value: { $set: lat }
                                    },
                                    longitude: {
                                      value: { $set: lng }
                                    }
                                  })
                                );
                              }}
                            >
                              {shopAddress.latitude
                                .value !== "" &&
                              shopAddress.longitude
                                .value !== "" && (
                                <GoogleMapMarker
                                  lat={
                                    shopAddress.latitude
                                      .value
                                  }
                                  lng={
                                    shopAddress.longitude
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
                  {shopAddress.latitude.is_valid === false &&
                  shopAddress.latitude.feedback !== "" && (
                    <FormHelperText error>
                      {shopAddress.latitude.feedback}
                    </FormHelperText>
                  )}
                  {shopAddress.longitude.is_valid ===
                  false &&
                  shopAddress.longitude.feedback !==
                  "" && (
                    <FormHelperText error>
                      {shopAddress.longitude.feedback}
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
                  onClick={toggleCloseDialog}
                  color="primary"
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item>
                {context.permission.includes("UPDATE_SHOP_SETTING") && shopId && (
                  <>
                    {isUpdatingShopAddressMutation ?
                      <Button
                        disabled
                        variant="contained"
                        color="primary"
                      >
                        {t("updating...")}
                      </Button>
                      :
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          if (await checkShopAddressForm())
                            updateShopAddress();
                        }}
                      >
                        {t("update shop address")}
                      </Button>
                    }
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
                  <Skeleton variant={"rect"} height={50}/>
                </Grid>
              );
            })}
          </React.Fragment>
        )}
      </Grid>
    </Modal>
  </>;
}