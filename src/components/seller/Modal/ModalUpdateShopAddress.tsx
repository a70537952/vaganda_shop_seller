import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
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
import { useUpdateShopAddressMutation } from "../../../graphql/mutation/shopAddressMutation/UpdateShopAddressMutation";
import { shopAddressFragments } from "../../../graphql/fragment/query/ShopAddressFragment";
import { IShopAddressFragmentModalUpdateShopAddress } from "../../../graphql/fragmentType/query/ShopAddressFragmentInterface";
import { shopAddressQuery, ShopAddressVars } from "../../../graphql/query/ShopAddressQuery";
import useForm from "../../_hook/useForm";
import DialogConfirm from "../../_dialog/DialogConfirm";
import ButtonSubmit from "../../ButtonSubmit";
import LoadingSkeleton from "../../LoadingSkeleton";

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
  const {
    value, error, disable,
    setDisable, setValue,
    validate, checkApolloError, resetValue
  } = useForm({
    has_physical_shop: {
      value: false
    },
    address_1: {
      value: "",
      emptyMessage: t('please enter address')
    },
    address_2: {
      value: ""
    },
    address_3: {
      value: ""
    },
    city: {
      value: "",
      emptyMessage: t('please enter city')
    },
    state: {
      value: "",
      emptyMessage: t('please enter state')
    },
    postal_code: {
      value: "",
      emptyMessage: t('please enter postal code')
    },
    country: {
      value: "",
      emptyMessage: t('please enter country')
    },
    latitude: {
      value: "",
      emptyMessage: t('please place marker of your shop location')
    },
    longitude: {
      value: ""
    }
  });

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

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
      await checkApolloError(error);
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

      let shopAddressData = data.shopAddress.items[0];
      setValue("has_physical_shop", shopAddressData.shop.has_physical_shop);
      setValue("address_1", shopAddressData.address_1);
      setValue("address_2", shopAddressData.address_2);
      setValue("address_3", shopAddressData.address_3);
      setValue("city", shopAddressData.city);
      setValue("state", shopAddressData.state);
      setValue("postal_code", shopAddressData.postal_code);
      setValue("country", shopAddressData.country);
      setValue("latitude", shopAddressData.latitude);
      setValue("longitude", shopAddressData.longitude);
      setDisable("", disabled);
      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    resetValue();
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

  async function updateShopAddress() {
    if (!value.has_physical_shop || (value.has_physical_shop && await validate())) {
      updateShopAddressMutation({
        variables: {
          shop_id: shopId,
          has_physical_shop: value.has_physical_shop,
          address_1: value.address_1,
          address_2: value.address_2,
          address_3: value.address_3,
          city: value.city,
          state: value.state,
          postal_code: value.postal_code,
          country: value.country,
          latitude: value.latitude,
          longitude: value.longitude
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={t("cancel edit shop address")}
                   content={t("are you sure cancel edit address?")}
                   onConfirm={handleOkCloseDialog}/>
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
                error={Boolean(error.has_physical_shop)}
              >
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={disable.has_physical_shop}
                        checked={value.has_physical_shop}
                        onChange={e => {
                          setValue("has_physical_shop", e.target.checked);
                        }}
                        color="primary"
                      />
                    }
                    label={t("do you have physical shop?")}
                  />
                </FormGroup>
                {Boolean(error.has_physical_shop) && (
                  <FormHelperText>
                    {error.has_physical_shop}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required={value.has_physical_shop}
                error={Boolean(error.address_1)}
                label={t("address 1")}
                value={value.address_1}
                onChange={(e) => {
                  setValue("address_1", e.target.value);
                }}
                helperText={error.address_1}
                margin="normal"
                disabled={disable.address_1 || !value.has_physical_shop}
                fullWidth
              />
              <TextField
                error={Boolean(error.address_2)}
                label={t("address 2")}
                value={value.address_2}
                onChange={(e) => {
                  setValue("address_2", e.target.value);
                }}
                helperText={error.address_2}
                margin="normal"
                disabled={disable.address_2 || !value.has_physical_shop}
                fullWidth
              />
              <TextField
                error={Boolean(error.address_3)}
                label={t("address 3")}
                value={value.address_3}
                onChange={(e) => {
                  setValue("address_3", e.target.value);
                }}
                helperText={error.address_3}
                margin="normal"
                disabled={disable.address_3 || !value.has_physical_shop}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={Boolean(error.city)}
                required={value.has_physical_shop}
                label={t("city")}
                value={value.city}
                onChange={(e) => {
                  setValue("city", e.target.value);
                }}
                helperText={error.city}
                margin="normal"
                disabled={disable.city || !value.has_physical_shop}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={Boolean(error.state)}
                required={value.has_physical_shop}
                label={t("state")}
                value={value.state}
                onChange={(e) => {
                  setValue("state", e.target.value);
                }}
                helperText={error.state}
                margin="normal"
                disabled={disable.state || !value.has_physical_shop}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={Boolean(error.postal_code)}
                required={value.has_physical_shop}
                label={t("postal code")}
                value={value.postal_code}
                onChange={(e) => {
                  setValue("postal_code", e.target.value);
                }}
                helperText={error.postal_code}
                margin="normal"
                disabled={disable.postal_code || !value.has_physical_shop}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CountrySelect
                error={Boolean(error.country)}
                required={value.has_physical_shop}
                label={t("country")}
                helperText={error.country}
                value={value.country}
                onChange={(value) => {
                  setValue("country", value);
                }}
                margin="normal"
                fullWidth
                disabled={disable.country || !value.has_physical_shop}
              />
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={12}>
                {!disable.latitude &&
                !disable.longitude &&
                value.has_physical_shop && (
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

                          let latitude = value.latitude
                            ? value.latitude
                            : position &&
                            position.coords &&
                            position.coords.latitude
                              ? position.coords.latitude
                              : null;

                          let longitude = value.longitude
                            ? value.longitude
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

                                setValue("latitude", lat);
                                setValue("longitude", lng);
                              }}
                            >
                              {value.latitude !== "" &&
                              value.longitude !== "" && (
                                <GoogleMapMarker
                                  lat={value.latitude}
                                  lng={value.longitude}
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
                  {Boolean(error.latitude) && (
                    <FormHelperText error>
                      {error.latitude}
                    </FormHelperText>
                  )}
                  {Boolean(error.longitude) && (
                    <FormHelperText error>
                      {error.longitude}
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
                  <ButtonSubmit onClick={updateShopAddress}
                                variant="contained"
                                color="primary"
                                loading={isUpdatingShopAddressMutation}
                                loadingLabel={t("updating...")}
                                label={t("update shop address")}/>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <LoadingSkeleton/>
        )}
      </Grid>
    </Modal>
  </>;
}