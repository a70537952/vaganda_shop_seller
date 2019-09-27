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
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateShopAccountMutation } from "../../../graphql/mutation/shopSettingMutation/UpdateShopAccountMutation";
import { shopSettingFragments } from "../../../graphql/fragment/query/ShopSettingFragment";
import { IShopSettingFragmentModalUpdateShopAccount } from "../../../graphql/fragmentType/query/ShopSettingFragmentInterface";
import { shopSettingQuery, ShopSettingVars } from "../../../graphql/query/ShopSettingQuery";


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

  let shopAccountFields = [
    {
      field: "account",
      isCheckEmpty: true,
      emptyMessage: t("please enter shop account"),
      value: ""
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopAccount, setShopAccount] = useState<Fields>(FormUtil.generateFieldsState(shopAccountFields));

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
      await checkShopAccountForm(error);
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
      setShopAccount(
        update(shopAccount, {
          account: {
            value: { $set: shopSetting ? shopSetting.value : "" },
            disabled: { $set: disabled }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopAccount(shopAccount => FormUtil.generateResetFieldsStateHook(shopAccountFields, shopAccount));
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

  async function checkShopAccountForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopAccountFields,
      shopAccount
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopAccountFields,
      error,
      checkedEmptyState
    );

    setShopAccount(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function updateShopAccount() {
    if (await checkShopAccountForm()) {
      updateShopAccountMutation({
        variables: {
          shop_id: shopId,
          account: shopAccount.account.value
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
      <DialogTitle>{t("cancel update shop account")}</DialogTitle>
      <DialogContent>
        {t("are you sure cancel update shop account?")}
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
                disabled={shopAccount.account.disabled}
                error={!shopAccount.account.is_valid}
                label={t("shop account")}
                value={shopAccount.account.value}
                onChange={(e: any) => {
                  setShopAccount(
                    update(shopAccount, {
                      account: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAccount.account.feedback}
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
                  <>
                    {isUpdatingShopAccountMutation ?
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
                          if (await checkShopAccountForm())
                            updateShopAccount();
                        }}>
                        {t("update shop account")}
                      </Button>
                    }
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
                  <Skeleton variant={"rect"} height={50}/>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </Modal>
  </>;
}
