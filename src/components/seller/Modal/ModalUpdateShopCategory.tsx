import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import { useTranslation } from "react-i18next";
import ShopCategorySelect from "../../_select/ShopCategorySelect";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { ShopSettingVars } from "../../../graphql/query/ShopSettingQuery";
import { useUpdateShopCategoryMutation } from "../../../graphql/mutation/shopMutation/UpdateShopCategoryMutation";
import { shopFragments } from "../../../graphql/fragment/query/ShopFragment";
import { shopQuery } from "../../../graphql/query/ShopQuery";
import { IShopFragmentModalUpdateShopCategory } from "../../../graphql/fragmentType/query/ShopFragmentInterface";
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

export default function ModalUpdateShopCategory(props: IProps) {
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
    shop_category_id: {
      value: "",
      emptyMessage: t("please select shop category")
    }
  });

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

  const [
    updateShopCategoryMutation,
    { loading: isUpdatingShopCategoryMutation }
  ] = useUpdateShopCategoryMutation<IShopFragmentModalUpdateShopCategory>(shopFragments.ModalUpdateShopCategory, {
    onCompleted: () => {
      toast.default(
        t("shop category successfully updated")
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkApolloError(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopCategory();
  }, [isOpen, shopId]);

  async function getShopCategory() {
    if (shopId && isOpen) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shop: WithPagination<IShopFragmentModalUpdateShopCategory> },
        ShopSettingVars>({
        query: shopQuery(shopFragments.ModalUpdateShopCategory),
        variables: { shop_id: shopId }
      });

      let shop = data.shop.items[0];
      setValue("shop_category_id", shop.shop_category_id);
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

  async function editShopCategory() {
    if (await validate()) {
      updateShopCategoryMutation({
        variables: {
          shop_id: shopId,
          shop_category_id: value.shop_category_id
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={t("cancel edit shop category")}
                   content={t("are you sure cancel edit shop category?")}
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
              <ShopCategorySelect
                label={t("shop category")}
                error={Boolean(error.shop_category_id)}
                helperText={error.shop_category_id}
                disabled={disable.shop_category_id}
                required
                value={value.shop_category_id}
                onChange={(value: unknown) => {
                  setValue("shop_category_id", value);
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
                  <ButtonSubmit onClick={editShopCategory}
                                variant="contained"
                                color="primary"
                                loading={isUpdatingShopCategoryMutation}
                                loadingLabel={t("updating...")}
                                label={t("update shop category")}/>
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