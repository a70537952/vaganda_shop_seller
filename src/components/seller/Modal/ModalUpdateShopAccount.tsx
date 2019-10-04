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
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateShopAccountMutation } from "../../../graphql/mutation/shopSettingMutation/UpdateShopAccountMutation";
import { shopSettingFragments } from "../../../graphql/fragment/query/ShopSettingFragment";
import { IShopSettingFragmentModalUpdateShopAccount } from "../../../graphql/fragmentType/query/ShopSettingFragmentInterface";
import { shopSettingQuery, ShopSettingVars } from "../../../graphql/query/ShopSettingQuery";
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

export default function ModalUpdateShopAccount(props: IProps) {
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
    account: {
      value: "",
      emptyMessage: t("please enter shop account")
    }
  });

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

  const [
    updateShopAccountMutation,
    { loading: isUpdatingShopAccountMutation }
  ] = useUpdateShopAccountMutation<IShopSettingFragmentModalUpdateShopAccount>(shopSettingFragments.ModalUpdateShopAccount, {
    onCompleted: () => {
      toast.default(
        t("shop account successfully updated")
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkApolloError(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopAccount();
  }, [isOpen, shopId]);

  async function getShopAccount() {
    if (shopId && isOpen) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopSetting: WithPagination<IShopSettingFragmentModalUpdateShopAccount> },
        ShopSettingVars>({
        query: shopSettingQuery(shopSettingFragments.ModalUpdateShopAccount),
        variables: { shop_id: shopId, title: "account" }
      });

      let shopSetting = data.shopSetting.items[0];
      setValue("account", shopSetting ? shopSetting.value : "");
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

  async function updateShopAccount() {
    if (await validate()) {
      updateShopAccountMutation({
        variables: {
          shop_id: shopId,
          account: value.account
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={t("cancel update shop account")}
                   content={t("are you sure cancel update shop account?")}
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
        spacing={1}
        className={classes.contentContainer}
      >
        {isDataLoaded ? (
          <>
            <Grid item>
              <Typography variant="subtitle1">
                {t(
                  "setting up a unique shop account allows users to easily find your shop."
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={disable.account}
                error={Boolean(error.account)}
                label={t("shop account")}
                value={value.account}
                onChange={(e) => {
                  setValue("account", e.target.value);
                }}
                helperText={error.account}
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
                  onClick={toggleCloseDialog}
                  color="primary"
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item>
                {context.permission.includes("UPDATE_SHOP_SETTING") && shopId && (
                  <ButtonSubmit onClick={updateShopAccount}
                                variant="contained"
                                color="primary"
                                loading={isUpdatingShopAccountMutation}
                                loadingLabel={t("updating...")}
                                label={t("update shop account")}/>
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
