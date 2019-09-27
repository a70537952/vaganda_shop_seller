import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import update from "immutability-helper";
import React, { useContext, useEffect, useState } from "react";
import { Query, useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import { shopAdminRoleFragments } from "../../../graphql/fragment/query/ShopAdminRoleFragment";
import FormUtil, { Fields } from "../../../utils/FormUtil";
import { useTranslation } from "react-i18next";
import gql from "graphql-tag";
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { ShopAdminVars } from "../../../graphql/query/ShopAdminQuery";
import { shopAdminRoleQuery } from "../../../graphql/query/ShopAdminRoleQuery";
import { IShopAdminRoleFragmentModalCreateEditShopAdminRole } from "../../../graphql/fragmentType/query/ShopAdminRoleFragmentInterface";
import { useCreateShopAdminRoleMutation } from "../../../graphql/mutation/shopAdminRoleMutation/CreateShopAdminRoleMutation";
import { useEditShopAdminRoleMutation } from "../../../graphql/mutation/shopAdminRoleMutation/EditShopAdminRoleMutation";

interface IProps {
  shopAdminRoleId: string;
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

  let shopAdminRoleFields = [
    {
      field: "title",
      isCheckEmpty: true,
      emptyMessage: t("please enter title"),
      value: ""
    },
    {
      field: "permission",
      value: new Set()
    },
    {
      field: "is_shop_owner_role"
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopAdminRole, setShopAdminRole] = useState<Fields>(FormUtil.generateFieldsState(shopAdminRoleFields));

  const [
    createShopAdminRoleMutation,
    { loading: isCreatingShopAdminRoleMutation }
  ] = useCreateShopAdminRoleMutation<IShopAdminRoleFragmentModalCreateEditShopAdminRole>(shopAdminRoleFragments.ModalCreateEditShopAdminRole, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully created", {
          title: shopAdminRole.title.value
        })
      );
      handleOkCloseDialog();
      refetchData();
    },
    onError: async (error) => {
      await checkShopAdminRoleForm(error);
    }
  });

  const [
    editShopAdminRoleMutation,
    { loading: isEditingShopAdminRoleMutation }
  ] = useEditShopAdminRoleMutation<IShopAdminRoleFragmentModalCreateEditShopAdminRole>(shopAdminRoleFragments.ModalCreateEditShopAdminRole, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully updated", {
          title: shopAdminRole.title.value
        })
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkShopAdminRoleForm(error);
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
        ShopAdminVars>({
        query: shopAdminRoleQuery(shopAdminRoleFragments.ModalCreateEditShopAdminRole),
        variables: {
          id: shopAdminRoleId
        }
      });

      let shopAdminRoleData = data.shopAdminRole.items[0];
      let isDisabled = disabled;

      setShopAdminRole(
        update(shopAdminRole, {
          title: {
            value: { $set: shopAdminRoleData.title },
            disabled: { $set: isDisabled }
          },
          permission: {
            value: { $set: new Set(shopAdminRoleData.permission) },
            disabled: { $set: isDisabled }
          },
          is_shop_owner_role: {
            value: { $set: shopAdminRoleData.is_shop_owner_role }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopAdminRole(shopAdminRole => FormUtil.generateResetFieldsStateHook(shopAdminRoleFields, shopAdminRole));
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

  function handlePermissionOnChange(value: string) {
    let permission = new Set(Array.from(shopAdminRole.permission.value));

    if (permission.has(value)) {
      permission.delete(value);
    } else {
      permission = permission.add(value);
    }

    setShopAdminRole(
      update(shopAdminRole, {
        permission: {
          value: { $set: permission }
        }
      })
    );
  }

  async function checkShopAdminRoleForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopAdminRoleFields,
      shopAdminRole
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopAdminRoleFields,
      error,
      checkedEmptyState
    );

    setShopAdminRole(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function createShopAdminRole() {
    if (await checkShopAdminRoleForm()) {
      createShopAdminRoleMutation({
        variables: {
          shop_id: shopId,
          title: shopAdminRole.title.value,
          permission: Array.from(shopAdminRole.permission.value)
        }
      });
    }
  }

  async function editShopAdminRole() {
    if (shopAdminRoleId && await checkShopAdminRoleForm()) {
      editShopAdminRoleMutation({
        variables: {
          shop_id: shopId,
          shop_admin_role_id: shopAdminRoleId,
          title: shopAdminRole.title.value,
          permission: Array.from(shopAdminRole.permission.value)
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
        {shopAdminRoleId
          ? t("cancel edit admin role")
          : t("cancel add admin role")}
      </DialogTitle>
      <DialogContent>
        {shopAdminRoleId
          ? t("are you sure cancel edit admin role?")
          : t("are you sure cancel add admin role?")}
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
                disabled={
                  !!shopAdminRole.is_shop_owner_role.value ||
                  shopAdminRole.title.disabled
                }
                required
                error={!shopAdminRole.title.is_valid}
                label={t("admin role title")}
                placeholder={t("admin role title")}
                InputLabelProps={{
                  shrink: true
                }}
                value={shopAdminRole.title.value}
                onChange={(e: { target: { value: any } }) => {
                  setShopAdminRole(
                    update(shopAdminRole, {
                      title: { value: { $set: e.target.value } }
                    })
                  );
                }}
                helperText={shopAdminRole.title.feedback}
                fullWidth
                margin={"normal"}
              />
              {!!shopAdminRole.is_shop_owner_role.value && (
                <Typography variant="overline" color={"primary"}>
                  {t(
                    "this is shop owner admin role, you can not modify this role"
                  )}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">{t("permission")}</Typography>
              {!!shopAdminRole.is_shop_owner_role.value && (
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
                <Query
                  query={gql`
                            query ShopAdminRolePermission {
                              shopAdminRolePermission {
                                permission
                              }
                            }
                          `}
                >
                  {({ loading, error, data }) => {
                    if (loading)
                      return (
                        <React.Fragment>
                          {new Array(4).fill(6).map((ele, index) => {
                            return (
                              <Grid key={index} item xs={12}>
                                <Skeleton
                                  variant={"rect"}
                                  height={50}
                                />
                              </Grid>
                            );
                          })}
                        </React.Fragment>
                      );
                    if (error) return <>Error!</>;
                    let permission = data.shopAdminRolePermission
                      ? data.shopAdminRolePermission.permission
                      : [];
                    permission = JSON.parse(permission);
                    return (
                      <React.Fragment>
                        {Object.keys(permission).map(section => (
                          <React.Fragment key={section}>
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle1"
                                display="inline"
                              >
                                {t("permission$$" + section)}
                              </Typography>
                              <Checkbox
                                disabled={
                                  !!shopAdminRole
                                    .is_shop_owner_role.value ||
                                  shopAdminRole.permission
                                    .disabled
                                }
                                checked={
                                  new Set(
                                    Array.from(
                                      shopAdminRole
                                        .permission.value
                                    ).filter((sectionPermission: any) =>
                                      permission[section].includes(
                                        sectionPermission
                                      )
                                    )
                                  ).size === permission[section].length
                                }
                                onChange={(event, checked) => {
                                  let newPermissions;
                                  if (checked) {
                                    newPermissions = [
                                      ...Array.from(
                                        shopAdminRole
                                          .permission.value
                                      ),
                                      ...permission[section]
                                    ];
                                  } else {
                                    newPermissions = Array.from(
                                      shopAdminRole
                                        .permission.value
                                    ).filter(
                                      (sectionPermission: any) =>
                                        !permission[section].includes(
                                          sectionPermission
                                        )
                                    );
                                  }

                                  setShopAdminRole(
                                    update(shopAdminRole, {
                                      permission: { value: { $set: new Set(newPermissions) } }
                                    })
                                  );
                                }}
                                color="primary"
                              />
                            </Grid>
                            {permission[section].map(
                              (sectionPermission: string) => (
                                <Grid
                                  item
                                  xs={6}
                                  sm={4}
                                  md={3}
                                  key={sectionPermission}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={
                                          !!shopAdminRole
                                            .is_shop_owner_role.value ||
                                          shopAdminRole
                                            .permission.disabled
                                        }
                                        checked={shopAdminRole.permission.value.has(
                                          sectionPermission
                                        )}
                                        onChange={() => handlePermissionOnChange(sectionPermission)}
                                        value={sectionPermission}
                                        color="primary"
                                      />
                                    }
                                    label={t(
                                      "permission$$" + sectionPermission
                                    )}
                                  />
                                </Grid>
                              )
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    );
                  }}
                </Query>
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
                  <>
                    {isCreatingShopAdminRoleMutation ?
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
                          if (await checkShopAdminRoleForm())
                            createShopAdminRole();
                        }}
                      >
                        {t("create shop admin role")}
                      </Button>
                    }
                  </>
                )}
                {context.permission.includes("UPDATE_SHOP_ADMIN_ROLE")
                && shopAdminRoleId
                && !shopAdminRole.is_shop_owner_role.value && (
                  <>
                    {isEditingShopAdminRoleMutation ?
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
                          if (
                            await checkShopAdminRoleForm()
                          )
                            editShopAdminRole();
                        }}
                      >
                        {t("edit shop admin role")}
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