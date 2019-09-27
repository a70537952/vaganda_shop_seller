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
import { shopProductCategoryFragments } from "../../../graphql/fragment/query/ShopProductCategoryFragment";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useCreateShopProductCategoryMutation } from "../../../graphql/mutation/shopProductCategoryMutation/CreateShopProductCategoryMutation";
import { IShopProductCategoryFragmentModalCreateEditShopProductCategory } from "../../../graphql/fragmentType/query/ShopProductCategoryFragmentInterface";
import { useEditShopProductCategoryMutation } from "../../../graphql/mutation/shopProductCategoryMutation/EditShopProductCategoryMutation";
import { shopProductCategoryQuery, ShopProductCategoryVars } from "../../../graphql/query/ShopProductCategoryQuery";

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
  const client = useApolloClient();
  const {
    shopProductCategoryId,
    shopId,
    disabled,
    refetchData,
    toggle,
    isOpen
  } = props;

  let shopProductCategoryFields = [
    {
      field: "title",
      isCheckEmpty: true,
      emptyMessage: t("please enter title"),
      value: ""
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopProductCategory, setShopProductCategory] = useState<Fields>(FormUtil.generateFieldsState(shopProductCategoryFields));

  const [
    createShopProductCategoryMutation,
    { loading: isCreatingShopProductCategoryMutation }
  ] = useCreateShopProductCategoryMutation<IShopProductCategoryFragmentModalCreateEditShopProductCategory>(shopProductCategoryFragments.ModalCreateEditShopProductCategory, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully created", {
          title: shopProductCategory.title.value
        })
      );
      handleOkCloseDialog();
      if (refetchData) refetchData();
    },
    onError: async (error) => {
      await checkShopProductCategoryForm(error);
    }
  });

  const [
    editShopProductCategoryMutation,
    { loading: isEditingShopProductCategoryMutation }
  ] = useEditShopProductCategoryMutation<IShopProductCategoryFragmentModalCreateEditShopProductCategory>(shopProductCategoryFragments.ModalCreateEditShopProductCategory, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully updated", {
          title: shopProductCategory.title.value
        })
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkShopProductCategoryForm(error);
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
      setShopProductCategory(
        update(shopProductCategory, {
          title: {
            value: { $set: shopProductCategoryData.title },
            disabled: { $set: disabled }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopProductCategory(shopProductCategory => FormUtil.generateResetFieldsStateHook(shopProductCategoryFields, shopProductCategory));
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

  async function checkShopProductCategoryForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopProductCategoryFields,
      shopProductCategory
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopProductCategoryFields,
      error,
      checkedEmptyState
    );

    setShopProductCategory(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function createShopProductCategory() {
    if (await checkShopProductCategoryForm()) {
      createShopProductCategoryMutation({
        variables: {
          shop_id: shopId,
          title: shopProductCategory.title.value
        }
      });
    }
  }

  async function editShopProductCategory() {
    if (shopProductCategoryId && await checkShopProductCategoryForm()) {
      editShopProductCategoryMutation({
        variables: {
          shop_product_category_id: shopProductCategoryId,
          shop_id: shopId,
          title: shopProductCategory.title.value
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
      <DialogTitle>
        {shopProductCategoryId
          ? t("cancel edit shop product category")
          : t("cancel add shop product category")}
      </DialogTitle>
      <DialogContent>
        {shopProductCategoryId
          ? t("are you sure cancel edit shop product category?")
          : t("are you sure cancel add shop product category?")}
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
      onClose={() => {
        toggleCloseDialog();
      }}
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
                disabled={shopProductCategory.title.disabled}
                required
                error={!shopProductCategory.title.is_valid}
                label={t("shop product category title")}
                value={shopProductCategory.title.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopProductCategory(
                    update(shopProductCategory, {
                      title: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={
                  shopProductCategory.title.feedback
                }
                fullWidth
                margin={"normal"}
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
                  <>
                    {isCreatingShopProductCategoryMutation ?
                      <Button
                        disabled
                        variant="contained"
                        color="primary"
                      >
                        {t("creating...")}
                      </Button>
                      :
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          if (await checkShopProductCategoryForm())
                            createShopProductCategory();
                        }}
                      >
                        {t("create shop product category")}
                      </Button>
                    }
                  </>
                )}
                {context.permission.includes(
                  "UPDATE_SHOP_PRODUCT_CATEGORY"
                ) && shopProductCategoryId && (
                  <>
                    {isEditingShopProductCategoryMutation ?
                      <Button
                        disabled
                        variant="contained"
                        color="primary"
                      >
                        {t("editing...")}
                      </Button>
                      :
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          if (await checkShopProductCategoryForm())
                            editShopProductCategory();
                        }}
                      >
                        {t("edit shop product category")}
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