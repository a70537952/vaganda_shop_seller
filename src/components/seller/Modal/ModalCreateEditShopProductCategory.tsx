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
import { shopProductCategoryFragments } from "../../../graphql/fragment/query/ShopProductCategoryFragment";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useCreateShopProductCategoryMutation } from "../../../graphql/mutation/shopProductCategoryMutation/CreateShopProductCategoryMutation";
import { IShopProductCategoryFragmentModalCreateEditShopProductCategory } from "../../../graphql/fragmentType/query/ShopProductCategoryFragmentInterface";
import { useEditShopProductCategoryMutation } from "../../../graphql/mutation/shopProductCategoryMutation/EditShopProductCategoryMutation";
import { shopProductCategoryQuery, ShopProductCategoryVars } from "../../../graphql/query/ShopProductCategoryQuery";
import useForm from "../../_hook/useForm";
import ButtonSubmit from "../../ButtonSubmit";
import DialogConfirm from "../../_dialog/DialogConfirm";
import LoadingSkeleton from "../../LoadingSkeleton";

interface IProps {
  shopProductCategoryId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData?: () => void;
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

export default function ModalCreateEditShopProductCategory(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    value, error, disable,
    setDisable, setValue,
    validate, checkApolloError, resetValue
  } = useForm({
    title: {
      value: "",
      emptyMessage: t("please enter title")
    }
  });

  const client = useApolloClient();
  const {
    shopProductCategoryId,
    shopId,
    disabled,
    refetchData,
    toggle,
    isOpen
  } = props;

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

  const [
    createShopProductCategoryMutation,
    { loading: isCreatingShopProductCategoryMutation }
  ] = useCreateShopProductCategoryMutation<IShopProductCategoryFragmentModalCreateEditShopProductCategory>(shopProductCategoryFragments.ModalCreateEditShopProductCategory, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully created", {
          title: value.title
        })
      );
      handleOkCloseDialog();
      if (refetchData) refetchData();
    },
    onError: (error) => {
      checkApolloError(error);
    }
  });

  const [
    editShopProductCategoryMutation,
    { loading: isEditingShopProductCategoryMutation }
  ] = useEditShopProductCategoryMutation<IShopProductCategoryFragmentModalCreateEditShopProductCategory>(shopProductCategoryFragments.ModalCreateEditShopProductCategory, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully updated", {
          title: value.title
        })
      );
      handleOkCloseDialog();
    },
    onError: (error) => {
      checkApolloError(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopProductCategory();
  }, [shopProductCategoryId, shopId]);

  async function getShopProductCategory() {
    if (shopProductCategoryId && shopId) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopProductCategory: WithPagination<IShopProductCategoryFragmentModalCreateEditShopProductCategory> },
        ShopProductCategoryVars>({
        query: shopProductCategoryQuery(shopProductCategoryFragments.ModalCreateEditShopProductCategory),
        variables: {
          id: shopProductCategoryId
        }
      });

      let shopProductCategoryData = data.shopProductCategory.items[0];

      setValue("title", shopProductCategoryData.title);
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
    await resetStateData();
    setIsCloseDialogOpen(false);
    await toggle();
  }

  function toggleCloseDialog() {
    setIsCloseDialogOpen(true);
  }

  async function createShopProductCategory() {
    if (await validate()) {
      createShopProductCategoryMutation({
        variables: {
          shop_id: shopId,
          title: value.title
        }
      });
    }
  }

  async function editShopProductCategory() {
    if (shopProductCategoryId && await validate()) {
      editShopProductCategoryMutation({
        variables: {
          shop_product_category_id: shopProductCategoryId,
          shop_id: shopId,
          title: value.title
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={shopProductCategoryId
                     ? t("cancel edit shop product category")
                     : t("cancel add shop product category")}
                   content={shopProductCategoryId
                     ? t("are you sure cancel edit shop product category?")
                     : t("are you sure cancel add shop product category?")}
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
                disabled={disable.title}
                required
                error={Boolean(error.title)}
                label={t("shop product category title")}
                value={value.title}
                onChange={(e: { target: { value: any } }) => {
                  setValue("title", e.target.value);
                }}
                helperText={error.title}
                fullWidth
                margin={"normal"}
                onBlur={() => validate("title")}
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
                {context.permission.includes(
                  "CREATE_SHOP_PRODUCT_CATEGORY"
                ) && !shopProductCategoryId && (
                  <ButtonSubmit onClick={createShopProductCategory}
                                variant="contained"
                                color="primary"
                                loading={isCreatingShopProductCategoryMutation}
                                loadingLabel={t("creating")}
                                label={t("create shop product category")}/>
                )}
                {context.permission.includes(
                  "UPDATE_SHOP_PRODUCT_CATEGORY"
                ) && shopProductCategoryId && (
                  <ButtonSubmit onClick={editShopProductCategory}
                                variant="contained"
                                color="primary"
                                loading={isEditingShopProductCategoryMutation}
                                loadingLabel={t("editing")}
                                label={t("edit shop product category")}/>
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