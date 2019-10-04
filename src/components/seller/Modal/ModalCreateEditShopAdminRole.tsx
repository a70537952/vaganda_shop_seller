import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import { shopAdminRoleFragments } from "../../../graphql/fragment/query/ShopAdminRoleFragment";
import { useTranslation } from "react-i18next";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { shopAdminRoleQuery, ShopAdminRoleVars } from "../../../graphql/query/ShopAdminRoleQuery";
import { IShopAdminRoleFragmentModalCreateEditShopAdminRole } from "../../../graphql/fragmentType/query/ShopAdminRoleFragmentInterface";
import { useCreateShopAdminRoleMutation } from "../../../graphql/mutation/shopAdminRoleMutation/CreateShopAdminRoleMutation";
import { useEditShopAdminRoleMutation } from "../../../graphql/mutation/shopAdminRoleMutation/EditShopAdminRoleMutation";
import useForm from "../../_hook/useForm";
import DialogConfirm from "../../_dialog/DialogConfirm";
import ButtonSubmit from "../../ButtonSubmit";
import { useShopAdminRolePermissionQuery } from "../../../graphql/query/customQuery/ShopAdminRolePermissionQuery";
import { shopAdminRolePermissionFragments } from "../../../graphql/fragment/query/customQuery/ShopAdminRolePermissionFragment";
import { IShopAdminRolePermissionFragmentDefaultFragment } from "../../../graphql/fragmentType/query/customQuery/ShopAdminRolePermissionFragmentInterface";
import LoadingSkeleton from "../../LoadingSkeleton";

interface IProps {
  shopAdminRoleId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData: any;
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

export default function ModalCreateEditShopAdminRole(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const client = useApolloClient();
  const {
    shopAdminRoleId,
    shopId,
    disabled,
    refetchData,
    toggle,
    isOpen
  } = props;
  const {
    value, error, disable,
    setDisable, setValue,
    validate, checkApolloError, resetValue
  } = useForm({
    title: {
      value: "",
      emptyMessage: t("please enter title")
    },
    permission: {
      value: new Set()
    },
    is_shop_owner_role: {
      value: ""
    }
  });

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

  const { data, loading } = useShopAdminRolePermissionQuery<IShopAdminRolePermissionFragmentDefaultFragment>(shopAdminRolePermissionFragments.DefaultFragment);

  let shopAdminRolePermissions: IShopAdminRolePermissionFragmentDefaultFragment[] = [];
  let permissionSectionOrder = [
    'SHOP_ORDER_DETAIL',
    'SHOP_USER_ORDER_DETAIL_COMMENT',
    'PRODUCT',
    'SHOP_PRODUCT_CATEGORY',
    'SHOP_PRODUCT_CATEGORY_PRODUCT',
    'SHOP_ADMIN',
    'SHOP_ADMIN_ROLE',
    'SHOP_NOTIFICATION_SETTING',
    'SHOP_SETTING'
  ];
  if (data) {
    shopAdminRolePermissions = data.shopAdminRolePermission;

    shopAdminRolePermissions.sort((a, b) => {
      return permissionSectionOrder.indexOf(a.permissionSection) -
        permissionSectionOrder.indexOf(b.permissionSection)
    });
  }

  const [
    createShopAdminRoleMutation,
    { loading: isCreatingShopAdminRoleMutation }
  ] = useCreateShopAdminRoleMutation<IShopAdminRoleFragmentModalCreateEditShopAdminRole>(shopAdminRoleFragments.ModalCreateEditShopAdminRole, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully created", {
          title: value.title
        })
      );
      handleOkCloseDialog();
      refetchData();
    },
    onError: async (error) => {
      await checkApolloError(error);
    }
  });

  const [
    editShopAdminRoleMutation,
    { loading: isEditingShopAdminRoleMutation }
  ] = useEditShopAdminRoleMutation<IShopAdminRoleFragmentModalCreateEditShopAdminRole>(shopAdminRoleFragments.ModalCreateEditShopAdminRole, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully updated", {
          title: value.title
        })
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkApolloError(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopAdminRole();
  }, [shopAdminRoleId, shopId]);

  async function getShopAdminRole() {
    if (shopAdminRoleId && shopId) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopAdminRole: WithPagination<IShopAdminRoleFragmentModalCreateEditShopAdminRole> },
        ShopAdminRoleVars>({
        query: shopAdminRoleQuery(shopAdminRoleFragments.ModalCreateEditShopAdminRole),
        variables: {
          id: shopAdminRoleId
        }
      });

      let shopAdminRoleData = data.shopAdminRole.items[0];

      setValue("title", shopAdminRoleData.title);
      setValue("permission", new Set(shopAdminRoleData.permission));
      setValue("is_shop_owner_role", shopAdminRoleData.is_shop_owner_role);
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

  function handlePermissionOnChange(permission: string) {
    let permissionSet = new Set(Array.from(value.permission));

    if (permissionSet.has(permission)) {
      permissionSet.delete(permission);
    } else {
      permissionSet.add(permission);
    }

    setValue("permission", permissionSet);
  }

  async function createShopAdminRole() {
    if (await validate()) {
      createShopAdminRoleMutation({
        variables: {
          shop_id: shopId,
          title: value.title,
          permission: Array.from(value.permission)
        }
      });
    }
  }

  async function editShopAdminRole() {
    if (shopAdminRoleId && await validate()) {
      editShopAdminRoleMutation({
        variables: {
          shop_id: shopId,
          shop_admin_role_id: shopAdminRoleId,
          title: value.title,
          permission: Array.from(value.permission)
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={shopAdminRoleId
                     ? t("cancel edit admin role")
                     : t("cancel add admin role")}
                   content={shopAdminRoleId
                     ? t("are you sure cancel edit admin role?")
                     : t("are you sure cancel add admin role?")}
                   onConfirm={handleOkCloseDialog}/>
    <Modal
      disableAutoFocus
      open={isOpen}
      onClose={toggleCloseDialog}
      maxWidth={"md"}
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
                disabled={value.is_shop_owner_role || disable.title}
                required
                error={Boolean(error.title)}
                label={t("admin role title")}
                placeholder={t("admin role title")}
                InputLabelProps={{
                  shrink: true
                }}
                value={value.title}
                onChange={(e) => {
                  setValue("title", e.target.value);
                }}
                helperText={error.title}
                fullWidth
                margin={"normal"}
              />
              {Boolean(value.is_shop_owner_role) && (
                <Typography variant="overline" color={"primary"}>
                  {t(
                    "this is shop owner admin role, you can not modify this role"
                  )}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">{t("permission")}</Typography>
              {Boolean(value.is_shop_owner_role) && (
                <Typography
                  variant="overline"
                  color={"primary"}
                  paragraph
                >
                  {t(
                    "this is shop owner admin role, you can not modify this role, this role will automatically have all permission"
                  )}
                </Typography>
              )}
            </Grid>
            <Grid item container justify={"center"} xs={12}>
              <Grid container item spacing={1} xs={11}>
                {loading ?
                  <LoadingSkeleton/>
                :
                <>
                  {shopAdminRolePermissions.map(shopAdminRolePermission => {
                    let section = shopAdminRolePermission.permissionSection;
                    let sectionPermissions = shopAdminRolePermission.permission;
                    return (
                      <React.Fragment key={section}>
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle1"
                            display="inline"
                          >
                            {t("permission$$" + section)}
                          </Typography>
                          <Checkbox
                            disabled={value.is_shop_owner_role || disable.permission}
                            checked={
                              new Set(
                                Array.from(value.permission)
                                  .filter((permission) =>
                                    sectionPermissions.includes(permission as string)
                                  )
                              ).size === sectionPermissions.length
                            }
                            onChange={(event, checked) => {
                              let newPermissions;
                              if (checked) {
                                newPermissions = [
                                  ...Array.from(value.permission),
                                  ...sectionPermissions
                                ];
                              } else {
                                newPermissions = Array.from(value.permission).filter(
                                  (permission) =>
                                    !sectionPermissions.includes(permission as string)
                                );
                              }
                              setValue("permission", new Set(newPermissions));
                            }}
                            color="primary"
                          />
                        </Grid>
                        {sectionPermissions.map(
                          (permission) => (
                            <Grid
                              item
                              xs={6}
                              sm={4}
                              md={3}
                              key={permission}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    disabled={value.is_shop_owner_role || disable.permission}
                                    checked={value.permission.has(permission)}
                                    onChange={() => handlePermissionOnChange(permission)}
                                    value={permission}
                                    color="primary"
                                  />
                                }
                                label={t(
                                  "permission$$" + permission
                                )}
                              />
                            </Grid>
                          )
                        )}
                      </React.Fragment>
                    );
                  })}
                </>
                }
              </Grid>
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
                  "CREATE_SHOP_ADMIN_ROLE"
                ) && !shopAdminRoleId && (
                  <ButtonSubmit onClick={createShopAdminRole}
                                variant="contained"
                                color="primary"
                                loading={isCreatingShopAdminRoleMutation}
                                loadingLabel={t("creating...")}
                                label={t("create shop admin role")}/>
                )}
                {context.permission.includes("UPDATE_SHOP_ADMIN_ROLE")
                && shopAdminRoleId
                && !value.is_shop_owner_role && (
                  <ButtonSubmit onClick={editShopAdminRole}
                                variant="contained"
                                color="primary"
                                loading={isEditingShopAdminRoleMutation}
                                loadingLabel={t("editing...")}
                                label={t("edit shop admin role")}/>
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