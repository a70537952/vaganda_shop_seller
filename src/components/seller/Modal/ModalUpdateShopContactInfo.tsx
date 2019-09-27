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
import CountryPhoneCodeSelect from "../../_select/CountryPhoneCodeSelect";
import InputAdornment from "@material-ui/core/InputAdornment";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateShopContactInfoMutation } from "../../../graphql/mutation/shopMutation/UpdateShopContactInfoMutation";
import { shopContactInfoQuery, ShopContactInfoVars } from "../../../graphql/query/ShopContactInfoQuery";
import { shopContactInfoFragments } from "../../../graphql/fragment/query/ShopContactInfoFragment";
import { IShopContactInfoFragmentModalUpdateShopContactInfo } from "../../../graphql/fragmentType/query/ShopContactInfoFragmentInterface";

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

export default function ModalUpdateShopContactInfo(props: IProps) {
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

  let shopContactInfoFields = [
    {
      field: "email",
      isCheckEmpty: true,
      emptyMessage: t("please enter shop email"),
      value: ""
    },
    {
      field: "website",
      value: ""
    },
    {
      field: "telephone_country_code",
      value: ""
    },
    {
      field: "telephone",
      value: ""
    },
    {
      field: "phone_country_code",
      isCheckEmpty: true,
      emptyMessage: t("please select phone country code"),
      value: ""
    },
    {
      field: "phone",
      isCheckEmpty: true,
      emptyMessage: t("please enter shop phone"),
      value: ""
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopContactInfo, setShopContactInfo] = useState<Fields>(FormUtil.generateFieldsState(shopContactInfoFields));

  const [
    updateShopContactInfoMutation,
    { loading: isUpdatingShopContactInfoMutation }
  ] = useUpdateShopContactInfoMutation<IShopContactInfoFragmentModalUpdateShopContactInfo>(shopContactInfoFragments.ModalUpdateShopContactInfo, {
    onCompleted: () => {
      toast.default(
        t("shop contact info successfully updated")
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkShopContactInfoForm(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopContactInfo();
  }, [isOpen, shopId]);

  async function getShopContactInfo() {
    if (shopId && isOpen) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopContactInfo: WithPagination<IShopContactInfoFragmentModalUpdateShopContactInfo> },
        ShopContactInfoVars>({
        query: shopContactInfoQuery(shopContactInfoFragments.ModalUpdateShopContactInfo),
        variables: { shop_id: shopId }
      });

      let isDisabled = disabled;
      let shopContactInfoData = data.shopContactInfo.items[0];
      setShopContactInfo(
        update(shopContactInfo, {

          email: {
            value: { $set: shopContactInfoData.email || "" },
            disabled: { $set: isDisabled }
          },
          website: {
            value: { $set: shopContactInfoData.website || "" },
            disabled: { $set: isDisabled }
          },
          telephone_country_code: {
            value: { $set: shopContactInfoData.telephone_country_code || "" },
            disabled: { $set: isDisabled }
          },
          telephone: {
            value: { $set: shopContactInfoData.telephone || "" },
            disabled: { $set: isDisabled }
          },
          phone_country_code: {
            value: { $set: shopContactInfoData.phone_country_code || "" },
            disabled: { $set: isDisabled }
          },
          phone: {
            value: { $set: shopContactInfoData.phone || "" },
            disabled: { $set: isDisabled }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopContactInfo(shopContactInfo => FormUtil.generateResetFieldsStateHook(shopContactInfoFields, shopContactInfo));
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

  async function checkShopContactInfoForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopContactInfoFields,
      shopContactInfo
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopContactInfoFields,
      error,
      checkedEmptyState
    );

    setShopContactInfo(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function updateShopContactInfo() {
    if (await checkShopContactInfoForm()) {
      updateShopContactInfoMutation({
        variables: {
          shop_id: shopId,
          email: shopContactInfo.email.value,
          website: shopContactInfo.website.value,
          telephone_country_code: shopContactInfo
            .telephone_country_code.value,
          telephone: shopContactInfo.telephone.value,
          phone_country_code: shopContactInfo.phone_country_code
            .value,
          phone: shopContactInfo.phone.value
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
      <DialogTitle>{t("cancel edit shop contact info")}</DialogTitle>
      <DialogContent>
        {t("are you sure cancel edit shop contact info?")}
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
      maxWidth={"sm"}
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
              <TextField
                disabled={shopContactInfo.email.disabled}
                required
                error={!shopContactInfo.email.is_valid}
                label={t("shop email")}
                value={shopContactInfo.email.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopContactInfo(
                    update(shopContactInfo, {
                      email: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopContactInfo.email.feedback}
                margin="normal"
                fullWidth
              />
              <TextField
                disabled={shopContactInfo.website.disabled}
                error={!shopContactInfo.website.is_valid}
                label={t("shop website")}
                value={shopContactInfo.website.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopContactInfo(
                    update(shopContactInfo, {
                      website: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopContactInfo.website.feedback}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CountryPhoneCodeSelect
                disabled={
                  shopContactInfo.telephone_country_code
                    .disabled
                }
                label={t("shop telephone code")}
                error={
                  !shopContactInfo.telephone_country_code
                    .is_valid
                }
                helperText={
                  shopContactInfo.telephone_country_code
                    .feedback
                }
                value={
                  shopContactInfo.telephone_country_code
                    .value
                }
                onChange={(value: unknown) => {
                  setShopContactInfo(
                    update(shopContactInfo, {
                      telephone_country_code: {
                        value: { $set: value }
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
                disabled={shopContactInfo.telephone.disabled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {
                        shopContactInfo
                          .telephone_country_code.value
                      }
                    </InputAdornment>
                  )
                }}
                error={!shopContactInfo.telephone.is_valid}
                label={t("shop telephone")}
                value={shopContactInfo.telephone.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopContactInfo(
                    update(shopContactInfo, {
                      telephone: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={
                  shopContactInfo.telephone.feedback
                }
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CountryPhoneCodeSelect
                disabled={
                  shopContactInfo.phone_country_code.disabled
                }
                required
                label={t("shop phone code")}
                error={
                  !shopContactInfo.phone_country_code
                    .is_valid
                }
                helperText={
                  shopContactInfo.phone_country_code.feedback
                }
                value={
                  shopContactInfo.phone_country_code.value
                }
                onChange={(value: unknown) => {
                  setShopContactInfo(
                    update(shopContactInfo, {
                      phone_country_code: { value: { $set: value } }
                    })
                  );
                }}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                disabled={shopContactInfo.phone.disabled}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {
                        shopContactInfo.phone_country_code
                          .value
                      }
                    </InputAdornment>
                  )
                }}
                error={!shopContactInfo.phone.is_valid}
                label={t("shop phone")}
                value={shopContactInfo.phone.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopContactInfo(
                    update(shopContactInfo, {
                      phone: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopContactInfo.phone.feedback}
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
                  onClick={toggleCloseDialog}
                  color="primary"
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item>
                {context.permission.includes("UPDATE_SHOP_SETTING") && shopId && (
                  <>
                    {isUpdatingShopContactInfoMutation ?
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
                          if (
                            await checkShopContactInfoForm()
                          )
                            updateShopContactInfo();
                        }}
                      >
                        {t("update shop contact info")}
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
