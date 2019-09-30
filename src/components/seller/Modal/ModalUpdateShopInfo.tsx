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
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateShopInfoMutation } from "../../../graphql/mutation/shopInfoMutation/UpdateShopInfoMutation";
import { shopInfoFragments } from "../../../graphql/fragment/query/ShopInfoFragment";
import { ShopContactInfoVars } from "../../../graphql/query/ShopContactInfoQuery";
import { IShopInfoFragmentModalUpdateShopInfo } from "../../../graphql/fragmentType/query/ShopInfoFragmentInterface";
import { shopInfoQuery } from "../../../graphql/query/ShopInfoQuery";
import useForm from "../../_hook/useForm";
import DialogConfirm from "../../_dialog/DialogConfirm";
import ButtonSubmit from "../../ButtonSubmit";

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
    value, error, disable,
    setDisable, setValue,
    validate, checkApolloError, resetValue
  } = useForm({
    summary: {
      value: ""
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
      await checkApolloError(error);
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
      setValue("summary", shopInfoData.summary);
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

  async function updateShopInfo() {
    if (await validate()) {
      updateShopInfoMutation({
        variables: {
          shop_id: shopId,
          summary: value.summary
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={t("cancel edit shop info")}
                   content={t("are you sure cancel edit shop info?")}
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
            <Grid item xs={12}>
              <TextField
                disabled={disable.summary}
                error={Boolean(error.summary)}
                label={t("shop summary")}
                value={value.summary}
                onChange={(e) => {
                  setValue("summary", e.target.value);
                }}
                helperText={error.summary}
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
                  <ButtonSubmit onClick={updateShopInfo}
                                variant="contained"
                                color="primary"
                                loading={isUpdatingShopInfoMutation}
                                loadingLabel={t("updating...")}
                                label={t("update shop info")}/>
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