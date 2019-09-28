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
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateShopInfoMutation } from "../../../graphql/mutation/shopInfoMutation/UpdateShopInfoMutation";
import { shopInfoFragments } from "../../../graphql/fragment/query/ShopInfoFragment";
import { shopContactInfoQuery, ShopContactInfoVars } from "../../../graphql/query/ShopContactInfoQuery";
import { IShopInfoFragmentModalUpdateShopInfo } from "../../../graphql/fragmentType/query/ShopInfoFragmentInterface";
import { shopInfoQuery } from "../../../graphql/query/ShopInfoQuery";

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

export default function ModalUpdateShopInfo(props: IProps) {
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

  let shopInfoFields = [
    {
      field: "summary",
      value: ""
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopInfo, setShopInfo] = useState<Fields>(FormUtil.generateFieldsState(shopInfoFields));

  const [
    updateShopInfoMutation,
    { loading: isUpdatingShopInfoMutation }
  ] = useUpdateShopInfoMutation<IShopInfoFragmentModalUpdateShopInfo>(shopInfoFragments.ModalUpdateShopInfo, {
    onCompleted: () => {
      toast.default(
        t("shop info successfully updated")
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkShopInfoForm(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopInfo();
  }, [isOpen, shopId]);

  async function getShopInfo() {
    if (shopId && isOpen) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopInfo: WithPagination<IShopInfoFragmentModalUpdateShopInfo> },
        ShopContactInfoVars>({
        query: shopInfoQuery(shopInfoFragments.ModalUpdateShopInfo),
        variables: { shop_id: shopId }
      });

      let shopInfoData = data.shopInfo.items[0];
      setShopInfo(
        update(shopInfo, {
          summary: {
            value: { $set: shopInfoData.summary },
            disabled: { $set: disabled }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopInfo(shopInfo => FormUtil.generateResetFieldsStateHook(shopInfoFields, shopInfo));
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

  async function checkShopInfoForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopInfoFields,
      shopInfo
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopInfoFields,
      error,
      checkedEmptyState
    );

    setShopInfo(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function updateShopInfo() {
    if (await checkShopInfoForm()) {
      updateShopInfoMutation({
        variables: {
          shop_id: shopId,
          summary: shopInfo.summary.value
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
      <DialogTitle>{t("cancel edit shop info")}</DialogTitle>
      <DialogContent>
        {t("are you sure cancel edit shop info?")}
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
            <Grid item xs={12}>
              <TextField
                disabled={shopInfo.summary.disabled}
                error={!shopInfo.summary.is_valid}
                label={t("shop summary")}
                value={shopInfo.summary.value}
                onChange={(e: any) => {
                  setShopInfo(
                    update(shopInfo, {
                      summary: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopInfo.summary.feedback}
                margin="normal"
                placeholder={t("describe your shop...")}
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
                  onClick={toggleCloseDialog}
                  color="primary"
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item>
                {context.permission.includes("UPDATE_SHOP_SETTING") && shopId && (
                  <>
                    {isUpdatingShopInfoMutation ?
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
                          if (await checkShopInfoForm())
                            updateShopInfo();
                        }}
                      >
                        {t("update shop info")}
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