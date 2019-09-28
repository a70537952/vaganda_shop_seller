import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { makeStyles, Theme } from "@material-ui/core/styles/index";

import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import update from "immutability-helper";
import React, { useContext, useState } from "react";

import Helmet from "../components/seller/Helmet";
import LocaleMoment from "../components/LocaleMoment";
import ModalCreateEditShopAdminRole from "../components/seller/Modal/ModalCreateEditShopAdminRole";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import { shopAdminRoleQuery } from "../graphql/query/ShopAdminRoleQuery";
import { useTranslation } from "react-i18next";
import { shopAdminRoleFragments } from "../graphql/fragment/query/ShopAdminRoleFragment";
import useToast from "../components/_hook/useToast";
import { useDeleteShopAdminRoleMutation } from "../graphql/mutation/shopAdminRoleMutation/DeleteShopAdminRoleMutation";
import { IDeleteShopAdminRoleMutationFragmentDefaultFragment } from "../graphql/fragmentType/mutation/shopAdminRoleMutation/DeleteShopAdminRoleMutationFragmentInterface";
import { IShopAdminRoleFragmentAdminRole } from "../graphql/fragmentType/query/ShopAdminRoleFragmentInterface";
import { deleteShopAdminRoleMutationFragments } from "../graphql/fragment/mutation/shopAdminRoleMutation/DeleteShopAdminRoleMutationFragment";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    overflow: "auto"
  }
}));

export default function AdminRole() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const { toast } = useToast();

  const [tableKey, setTableKey] = useState<any>(+new Date());
  const [modal, setModal] = useState<{
    createEditShopAdminRole: boolean
  }>({
    createEditShopAdminRole: false
  });
  const [editingShopAdminRole, setEditingShopAdminRole] = useState<IShopAdminRoleFragmentAdminRole | undefined>(undefined);

  function toggleModalCreateEditAdminRole(shopAdminRole?: IShopAdminRoleFragmentAdminRole) {
    setEditingShopAdminRole(shopAdminRole);
    setModal(
      update(modal, {
        createEditShopAdminRole: { $set: !modal.createEditShopAdminRole }
      })
    );
  }

  function updateTableKey() {
    setTableKey(+new Date());
  }

  let columns = [
    {
      id: "title",
      Header: t("role title"),
      accessor: (d: IShopAdminRoleFragmentAdminRole) => d.title,
      filterable: true
    },
    {
      id: "permission",
      Header: t("permission"),
      sortable: false,
      accessor: (d: IShopAdminRoleFragmentAdminRole) => d.permission.length
    },
    {
      id: "is_shop_owner_role",
      Header: t("is shop owner role"),
      filterable: true,
      filterType: "select",
      filterComponent: (props: any) => {
        return (
          <Select {...props}>
            <MenuItem value={""}>{t("all")}</MenuItem>
            <MenuItem value={"0"}>{t("no")}</MenuItem>
            <MenuItem value={1}>{t("yes")}</MenuItem>
          </Select>
        );
      },
      accessor: (d: IShopAdminRoleFragmentAdminRole) => (d.is_shop_owner_role ? t("yes") : t("no"))
    },
    {
      id: "created_at",
      Header: t("created at"),
      accessor: (d: IShopAdminRoleFragmentAdminRole) => d,
      Cell: ({ value }: { value: IShopAdminRoleFragmentAdminRole }) => {
        return (
          <Tooltip
            title={
              <LocaleMoment showAll showTime>
                {value.created_at}
              </LocaleMoment>
            }
          >
            <div>
              <LocaleMoment showAll>{value.created_at}</LocaleMoment>
            </div>
          </Tooltip>
        );
      }
    },
    {
      id: "action",
      sortable: false,
      Header: t("action"),
      accessor: (d: IShopAdminRoleFragmentAdminRole) => d,
      Cell: ({ value }: { value: IShopAdminRoleFragmentAdminRole }) => {
        return (
          <>
            {(context.permission.includes(
              "UPDATE_SHOP_ADMIN_ROLE"
              ) ||
              context.permission.includes(
                "VIEW_SHOP_ADMIN_ROLE"
              )) && (
              <Tooltip title={t("edit")}>
                <Fab
                  size="small"
                  variant="round"
                  color="primary"
                  onClick={() => {
                    toggleModalCreateEditAdminRole(value);
                  }}
                >
                  <EditIcon/>
                </Fab>
              </Tooltip>
            )}
          </>
        );
      }
    }
  ];
  let actionList: any[] = [];

  const [
    deleteShopAdminRoleMutation,
    { loading: isDeletingShopAdminRoleMutation }
  ] = useDeleteShopAdminRoleMutation<IDeleteShopAdminRoleMutationFragmentDefaultFragment>(deleteShopAdminRoleMutationFragments.DefaultFragment, {
    onCompleted: (data) => {
      toast.default(
        t("{{count}} selected successfully delete", {
          count: data.deleteShopAdminRoleMutation.length
        })
      );
      updateTableKey();
    }
  });

  if (context.permission.includes("DELETE_SHOP_ADMIN_ROLE")) {
    actionList.push({
      title: t("delete"),
      confirmMessage: t(
        "delete show admin role will also delete related shop admin"
      ),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: async (selectedData: IShopAdminRoleFragmentAdminRole[]) => {
              let ownerRoleCount = selectedData.filter(
                (data) => data.is_shop_owner_role
              ).length;
              if (ownerRoleCount !== selectedData.length) {
                await deleteShopAdminRoleMutation({
                  variables: {
                    shop_id: context.shop.id,
                    shop_admin_role_ids: selectedData.map(
                      (data) => data.id
                    )
                  }
                });
              }

              if (ownerRoleCount) {
                toast.default(
                  t("you cant delete shop owner role")
                );
              }
            },
            loading: isDeletingShopAdminRoleMutation
          })
        );
      }
    });
  }

  return <>
    <Helmet
      title={t("shop admin role")}
      description={""}
      keywords={t("shop admin role")}
      ogImage="/images/favicon-228.png"
    />
    <Paper className={classes.root} elevation={1}>
      <Grid container justify={"center"}>
        {context.permission.includes("CREATE_SHOP_ADMIN_ROLE") && (
          <Grid container justify={"flex-end"}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => toggleModalCreateEditAdminRole()}
            >
              <AddIcon/>
              {t("add admin role")}
            </Button>
          </Grid>
        )}

        <ModalCreateEditShopAdminRole
          shopAdminRoleId={
            editingShopAdminRole
              ? editingShopAdminRole.id
              : undefined
          }
          shopId={context.shop.id}
          disabled={
            !context.permission.includes("UPDATE_SHOP_ADMIN_ROLE")
          }
          toggle={toggleModalCreateEditAdminRole}
          isOpen={modal.createEditShopAdminRole}
          refetchData={updateTableKey}
        />

        <SellerReactTable
          showCheckbox
          showFilter
          title={t("admin role")}
          columns={columns}
          query={shopAdminRoleQuery(
            shopAdminRoleFragments.AdminRole
          )}
          variables={{
            shop_id: context.shop.id,
            key: tableKey,
            sort_is_shop_owner_role: "desc"
          }}
          actionList={actionList}
        />
      </Grid>
    </Paper>
  </>;
}