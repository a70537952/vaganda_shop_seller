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
import ShopCategorySelect from "../../_select/ShopCategorySelect";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { ShopSettingVars } from "../../../graphql/query/ShopSettingQuery";
import { useUpdateShopCategoryMutation } from "../../../graphql/mutation/shopMutation/UpdateShopCategoryMutation";
import { shopFragments } from "../../../graphql/fragment/query/ShopFragment";
import { shopQuery } from "../../../graphql/query/ShopQuery";
import { IShopFragmentModalUpdateShopCategory } from "../../../graphql/fragmentType/query/ShopFragmentInterface";

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

  let shopCategoryFields = [
    {
      field: "shop_category_id",
      isCheckEmpty: true,
      emptyMessage: t("please select shop category"),
      value: ""
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopCategory, setShopCategory] = useState<Fields>(FormUtil.generateFieldsState(shopCategoryFields));

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
      await checkShopCategoryForm(error);
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
      setShopCategory(
        update(shopCategory, {
          shop_category_id: {
            value: { $set: shop.shop_category_id },
            disabled: { $set: disabled }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopCategory(shopCategory => FormUtil.generateResetFieldsStateHook(shopCategoryFields, shopCategory));
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

  async function checkShopCategoryForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopCategoryFields,
      shopCategory
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopCategoryFields,
      error,
      checkedEmptyState
    );

    setShopCategory(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function editShopCategory() {
    if (await checkShopCategoryForm()) {
      updateShopCategoryMutation({
        variables: {
          shop_id: shopId,
          shop_category_id: shopCategory.shop_category_id.value
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
      <DialogTitle>{t("cancel edit shop category")}</DialogTitle>
      <DialogContent>
        {t("are you sure cancel edit shop category?")}
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
              <ShopCategorySelect
                label={t("shop category")}
                error={
                  !shopCategory.shop_category_id.is_valid
                }
                helperText={
                  shopCategory.shop_category_id.feedback
                }
                disabled={
                  shopCategory.shop_category_id.disabled
                }
                required
                value={shopCategory.shop_category_id.value}
                onChange={(value: unknown) => {
                  setShopCategory(
                    update(shopCategory, {
                      shop_category_id: { value: { $set: value } }
                    })
                  );
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
                    {isUpdatingShopCategoryMutation ?
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
                          if (await checkShopCategoryForm())
                            editShopCategory();
                        }}
                      >
                        {t("update shop category")}
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