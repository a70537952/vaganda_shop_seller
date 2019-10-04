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
import CountryPhoneCodeSelect from "../../_select/CountryPhoneCodeSelect";
import InputAdornment from "@material-ui/core/InputAdornment";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateShopContactInfoMutation } from "../../../graphql/mutation/shopContactInfoMutation/UpdateShopContactInfoMutation";
import { shopContactInfoQuery, ShopContactInfoVars } from "../../../graphql/query/ShopContactInfoQuery";
import { shopContactInfoFragments } from "../../../graphql/fragment/query/ShopContactInfoFragment";
import { IShopContactInfoFragmentModalUpdateShopContactInfo } from "../../../graphql/fragmentType/query/ShopContactInfoFragmentInterface";
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

export default function ModalUpdateShopContactInfo(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const client = useApolloClient();

  const {
    value, error, disable,
    setDisable, setValue,
    validate, checkApolloError, resetValue
  } = useForm({
    email: {
      value: "",
      emptyMessage: t("please enter shop email")
    },
    website: {
      value: ""
    },
    telephone_country_code: {
      value: ""
    },
    telephone: {
      value: ""
    },
    phone_country_code: {
      value: "",
      emptyMessage: t("please select phone country code")
    },
    phone: {
      value: "",
      emptyMessage: t("please enter shop phone")
    }
  });

  const {
    shopId,
    disabled,
    toggle,
    isOpen
  } = props;

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

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
      await checkApolloError(error);
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

      let shopContactInfoData = data.shopContactInfo.items[0];
      setValue("email", shopContactInfoData.email);
      setValue("website", shopContactInfoData.website);
      setValue("telephone_country_code", shopContactInfoData.telephone_country_code);
      setValue("telephone", shopContactInfoData.telephone);
      setValue("phone_country_code", shopContactInfoData.phone_country_code);
      setValue("phone", shopContactInfoData.phone);

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

  async function updateShopContactInfo() {
    if (await validate()) {
      updateShopContactInfoMutation({
        variables: {
          shop_id: shopId,
          email: value.email,
          website: value.website,
          telephone_country_code: value.telephone_country_code,
          telephone: value.telephone,
          phone_country_code: value.phone_country_code,
          phone: value.phone
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={t("cancel edit shop contact info")}
                   content={t("are you sure cancel edit shop contact info?")}
                   onConfirm={handleOkCloseDialog}/>
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
                disabled={disable.email}
                required
                error={Boolean(error.email)}
                label={t("shop email")}
                value={value.email}
                onChange={(e) => {
                  setValue("email", e.target.value);
                }}
                helperText={error.email}
                margin="normal"
                fullWidth
              />
              <TextField
                disabled={disable.website}
                error={Boolean(error.website)}
                label={t("shop website")}
                value={value.website}
                onChange={(e) => {
                  setValue("website", e.target.value);
                }}
                helperText={error.website}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CountryPhoneCodeSelect
                disabled={disable.telephone_country_code}
                label={t("shop telephone code")}
                error={Boolean(error.telephone_country_code)}
                helperText={error.telephone_country_code}
                value={value.telephone_country_code}
                onChange={(value: unknown) => {
                  setValue("telephone_country_code", value);
                }}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                disabled={disable.telephone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {value.telephone_country_code}
                    </InputAdornment>
                  )
                }}
                error={Boolean(error.telephone)}
                label={t("shop telephone")}
                value={value.telephone}
                onChange={(e) => {
                  setValue("telephone", e.target.value);
                }}
                helperText={error.telephone}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CountryPhoneCodeSelect
                disabled={disable.phone_country_code}
                required
                label={t("shop phone code")}
                error={Boolean(error.phone_country_code)}
                helperText={error.phone_country_code}
                value={value.phone_country_code}
                onChange={(value: unknown) => {
                  setValue("phone_country_code", value);
                }}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                disabled={disable.phone}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {value.phone_country_code}
                    </InputAdornment>
                  )
                }}
                error={Boolean(error.phone)}
                label={t("shop phone")}
                value={value.phone}
                onChange={(e) => {
                  setValue("phone", e.target.value);
                }}
                helperText={error.phone}
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
                  <ButtonSubmit onClick={updateShopContactInfo}
                                variant="contained"
                                color="primary"
                                loading={isUpdatingShopContactInfoMutation}
                                loadingLabel={t("updating...")}
                                label={t("update shop contact info")}/>
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
