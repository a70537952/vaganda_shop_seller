import { makeStyles, Theme } from "@material-ui/core/styles/index";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Helmet from "../components/seller/Helmet";
import { AppContext } from "../contexts/Context";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Grid from "@material-ui/core/Grid";
import ShopLogo from "../components/ShopLogo";
import update from "immutability-helper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import ModalUpdateShopCategory from "../components/seller/Modal/ModalUpdateShopCategory";
import ModalUpdateShopInfo from "../components/seller/Modal/ModalUpdateShopInfo";
import ModalUpdateShopContactInfo from "../components/seller/Modal/ModalUpdateShopContactInfo";
import ModalUpdateShopAddress from "../components/seller/Modal/ModalUpdateShopAddress";
import ModalUpdateShopAccount from "../components/seller/Modal/ModalUpdateShopAccount";
import FormUtil from "../utils/FormUtil";
import classNames from "classnames";
import Image from "../components/Image";
import useToast from "../components/_hook/useToast";
import { useUpdateShopLogoMutation } from "../graphql/mutation/shopMutation/UpdateShopLogoMutation";
import { updateShopLogoMutationFragments } from "../graphql/fragment/mutation/shopMutation/UpdateShopLogoMutationFragment";
import { IUpdateShopLogoMutationFragmentSetting } from "../graphql/fragmentType/mutation/shopMutation/UpdateShopLogoMutationFragmentInterface";
import { useUpdateShopBannerMutation } from "../graphql/mutation/shopMutation/UpdateShopBannerMutation";
import { IUpdateShopBannerMutationFragmentSetting } from "../graphql/fragmentType/mutation/shopMutation/UpdateShopBannerMutationFragmentInterface";
import { updateShopBannerMutationFragments } from "../graphql/fragment/mutation/shopMutation/UpdateShopBannerMutationFragment";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: "100%"
  },
  inputUpload: {
    display: "none"
  },
  btnUpload: {
    margin: theme.spacing(1)
  },
  btnRemove: {
    margin: theme.spacing(1)
  },
  shopLogo: {
    width: "80px",
    height: "80px"
  },
  shopBanner: {
    width: "100%"
  }
}));

export default function Setting() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const { toast } = useToast();

  const [modal, setModal] = useState<{
    updateShopCategory: boolean,
    updateShopInfo: boolean,
    updateShopContactInfo: boolean,
    updateShopAddress: boolean,
    updateShopAccount: boolean
  }>({
    updateShopCategory: false,
    updateShopInfo: false,
    updateShopContactInfo: false,
    updateShopAddress: false,
    updateShopAccount: false
  });

  const [
    updateShopLogoMutation,
    { loading: isUpdatingShopLogoMutation }
  ] = useUpdateShopLogoMutation<IUpdateShopLogoMutationFragmentSetting>(updateShopLogoMutationFragments.Setting, {
    onCompleted: () => {
      toast.default(t("shop logo successfully updated"));
      context.getContext();
    },
    onError: (error) => {
      let errorMessage = FormUtil.getValidationErrorByField("logo", error);
      toast.error(errorMessage);
    }
  });

  const [
    updateShopBannerMutation,
    { loading: isUpdatingShopBannerMutation }
  ] = useUpdateShopBannerMutation<IUpdateShopBannerMutationFragmentSetting>(updateShopBannerMutationFragments.Setting, {
    onCompleted: () => {
      toast.default(t("shop banner successfully updated"));
      context.getContext();
    },
    onError: (error) => {
      let errorMessage = FormUtil.getValidationErrorByField("banner", error);
      toast.error(errorMessage);
    }
  });

  function toggleModalUpdateShopCategory() {
    setModal(
      update(modal, {
        updateShopCategory: { $set: !modal.updateShopCategory }
      })
    );
  }

  function toggleModalUpdateShopInfo() {
    setModal(
      update(modal, {
        updateShopInfo: { $set: !modal.updateShopInfo }
      })
    );
  }

  function toggleModalUpdateShopContactInfo() {
    setModal(
      update(modal, {
        updateShopContactInfo: { $set: !modal.updateShopContactInfo }
      })
    );
  }

  function toggleModalUpdateShopAddress() {
    setModal(
      update(modal, {
        updateShopAddress: { $set: !modal.updateShopAddress }
      })
    );
  }

  function toggleModalUpdateShopAccount() {
    setModal(
      update(modal, {
        updateShopAccount: { $set: !modal.updateShopAccount }
      })
    );
  }

  return <>
    <Helmet
      title={t("setting")}
      description={""}
      keywords={t("setting")}
      ogImage="/images/favicon-228.png"
    />
    <Grid container spacing={3}>
      <Query
        query={gql`
                  query Shop($id: ID) {
                    shop(id: $id) {
                      items {
                        id
                        shop_category_id
                        name
                        has_physical_shop
                        shop_category {
                          id
                          title
                        }
                        shop_info {
                          id
                          shop_id
                          summary
                          logo
                          logo_medium
                          banner
                          banner_large
                        }
                        shop_contact_info {
                          id
                          email
                          website
                          telephone_country_code
                          telephone
                          phone_country_code
                          phone
                          is_phone_verified
                        }
                        shop_address {
                          id
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
                        shop_setting {
                          id
                          title
                          value
                        }
                      }
                    }
                  }
                `}
        variables={{
          id: context.shop.id
        }}
      >
        {({ loading, error, data }) => {
          if (error) return <>Error!</>;
          if (loading)
            return (
              <Grid container justify={"center"}>
                <CircularProgress/>
              </Grid>
            );
          let shop =
            data.shop && data.shop.items && data.shop.items[0]
              ? data.shop.items[0]
              : null;
          let shopSetting = shop.shop_setting.reduce(
            (result: any, item: any) => {
              result[item.title] = item.value;
              return result;
            },
            {}
          );
          if (!shop) return null;
          return (
            <React.Fragment>
              <Grid container item xs={12} sm={6} md={4} lg={3} xl={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop name")}
                    </Typography>
                    <Typography variant="h5">{shop.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={4} lg={4} xl={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop category")}
                    </Typography>
                    <Typography variant="h5" gutterBottom paragraph>
                      {t(
                        "global$$shopCategory::" +
                        shop.shop_category.title
                      )}
                    </Typography>
                    <Grid container justify={"flex-end"}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={toggleModalUpdateShopCategory}
                      >
                        {t("update")}
                      </Button>
                    </Grid>
                    <ModalUpdateShopCategory
                      disabled={
                        !context.permission.includes(
                          "UPDATE_SHOP_SETTING"
                        )
                      }
                      shopId={context.shop.id}
                      toggle={toggleModalUpdateShopCategory}
                      isOpen={modal.updateShopCategory}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={4} lg={4} xl={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop currency")}
                    </Typography>
                    <Typography variant="h5">
                      {shopSetting.currency}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={6} lg={4} xl={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop account")}
                    </Typography>
                    <Typography variant="h6">
                      {"@" + shopSetting.account || "-"}
                    </Typography>
                    <Grid container justify={"flex-end"}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={toggleModalUpdateShopAccount}
                      >
                        {t("update")}
                      </Button>
                    </Grid>
                    <ModalUpdateShopAccount
                      disabled={
                        !context.permission.includes(
                          "UPDATE_SHOP_SETTING"
                        )
                      }
                      shopId={context.shop.id}
                      toggle={toggleModalUpdateShopAccount}
                      isOpen={modal.updateShopAccount}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={6} lg={4} xl={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop info")}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop summary")}
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {shop.shop_info.summary || "-"}
                    </Typography>
                    <Grid container justify={"flex-end"}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={toggleModalUpdateShopInfo}
                      >
                        {t("update")}
                      </Button>
                    </Grid>
                    <ModalUpdateShopInfo
                      disabled={
                        !context.permission.includes(
                          "UPDATE_SHOP_SETTING"
                        )
                      }
                      shopId={context.shop.id}
                      toggle={toggleModalUpdateShopInfo}
                      isOpen={modal.updateShopInfo}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={6} lg={4} xl={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop logo")}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <ShopLogo
                        shop={shop}
                        className={classes.shopLogo}
                      />
                    </Typography>
                    <Grid container justify={"flex-end"}>
                      {isUpdatingShopLogoMutation ?
                        <Button
                          disabled
                          variant="contained"
                          color="primary"
                        >
                          {t("updating...")}
                        </Button>
                        :
                        <>
                          <input
                            multiple={false}
                            onChange={e => {
                              let files = e.target.files;
                              if (files) {
                                updateShopLogoMutation({
                                  variables: {
                                    shop_id: context.shop.id,
                                    logo: files[0]
                                  }
                                });
                              }
                              e.target.value = "";
                            }}
                            id="updateShopLogo"
                            accept="image/*"
                            type="file"
                            className={classes.inputUpload}
                          />

                          <label
                            className="label-upload"
                            htmlFor="updateShopLogo"
                          >
                            <Button
                              className={classes.btnUpload}
                              size="small"
                              variant="contained"
                              component="span"
                              color="primary"
                            >
                              {t("upload logo")}
                            </Button>
                          </label>
                          {shop.shop_info && shop.shop_info.logo && (
                            <Button
                              className={classes.btnRemove}
                              size="small"
                              variant="contained"
                              component="span"
                              color="primary"
                              onClick={() => {
                                updateShopLogoMutation({
                                  variables: {
                                    shop_id: context.shop.id,
                                    logo: undefined
                                  }
                                });
                              }}
                            >
                              {t("remove logo")}
                            </Button>
                          )}
                        </>
                      }
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={6} lg={4} xl={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop banner")}
                    </Typography>
                    <Typography variant="h5">
                      <Image
                        src={shop.shop_info.banner_large}
                        useLazyLoad
                        alt={"shop banner"}
                        className={classNames(
                          "img pointer",
                          classes.shopBanner
                        )}
                      />
                    </Typography>
                    <Grid container justify={"flex-end"}>
                      {isUpdatingShopBannerMutation ?
                        <Button
                          disabled
                          variant="contained"
                          color="primary"
                        >
                          {t("updating...")}
                        </Button>
                        :
                        <>
                          <input
                            multiple={false}
                            onChange={e => {
                              let files = e.target.files;
                              if (files) {
                                updateShopBannerMutation({
                                  variables: {
                                    shop_id: context.shop.id,
                                    banner: files[0]
                                  }
                                });
                              }
                              e.target.value = "";
                            }}
                            id="updateShopBanner"
                            accept="image/*"
                            type="file"
                            className={classes.inputUpload}
                          />

                          <label
                            className="label-upload"
                            htmlFor="updateShopBanner"
                          >
                            <Button
                              className={classes.btnUpload}
                              size="small"
                              variant="contained"
                              component="span"
                              color="primary"
                            >
                              {t("upload banner")}
                            </Button>
                          </label>
                          {shop.shop_info && shop.shop_info.banner && (
                            <Button
                              className={classes.btnRemove}
                              size="small"
                              variant="contained"
                              component="span"
                              color="primary"
                              onClick={() => {
                                updateShopBannerMutation({
                                  variables: {
                                    shop_id: context.shop.id,
                                    banner: undefined
                                  }
                                });
                              }}
                            >
                              {t("remove banner")}
                            </Button>
                          )}
                        </>
                      }
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={6} lg={4} xl={4}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop contact info")}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop email")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_contact_info.email || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop website")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_contact_info.website || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop telephone")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_contact_info.telephone_country_code
                        ? shop.shop_contact_info
                          .telephone_country_code +
                        " " +
                        shop.shop_contact_info.telephone
                        : "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop phone")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_contact_info.phone_country_code
                        ? shop.shop_contact_info.phone_country_code +
                        " " +
                        shop.shop_contact_info.phone
                        : "-"}
                    </Typography>
                    <Grid container justify={"flex-end"}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={toggleModalUpdateShopContactInfo}
                      >
                        {t("update")}
                      </Button>
                    </Grid>
                    <ModalUpdateShopContactInfo
                      disabled={
                        !context.permission.includes(
                          "UPDATE_SHOP_SETTING"
                        )
                      }
                      shopId={context.shop.id}
                      toggle={toggleModalUpdateShopContactInfo}
                      isOpen={modal.updateShopContactInfo}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} sm={6} md={6} lg={4} xl={4}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("shop address")}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop address 1")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_address.address_1 || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop address 2")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_address.address_2 || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop address 3")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_address.address_3 || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop city")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_address.city || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop state")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_address.state || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop postal code")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_address.postal_code || "-"}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("shop country")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {shop.shop_address.country
                        ? t(
                          "global$$countryKey::" +
                          shop.shop_address.country
                        )
                        : "-"}
                    </Typography>
                    <Grid container justify={"flex-end"}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={toggleModalUpdateShopAddress}
                      >
                        {t("update")}
                      </Button>
                    </Grid>
                    <ModalUpdateShopAddress
                      disabled={
                        !context.permission.includes(
                          "UPDATE_SHOP_SETTING"
                        )
                      }
                      shopId={context.shop.id}
                      toggle={toggleModalUpdateShopAddress}
                      isOpen={modal.updateShopAddress}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </React.Fragment>
          );
        }}
      </Query>
    </Grid>
  </>;
}