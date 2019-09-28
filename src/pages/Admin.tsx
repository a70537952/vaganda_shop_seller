import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import update from "immutability-helper";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Helmet from "../components/seller/Helmet";
import LocaleMoment from "../components/LocaleMoment";
import ModalCreateEditShopAdmin from "../components/seller/Modal/ModalCreateEditShopAdmin";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import { shopAdminQuery } from "../graphql/query/ShopAdminQuery";
import { shopAdminFragments } from "../graphql/fragment/query/ShopAdminFragment";
import useToast from "../components/_hook/useToast";
import { useDeleteShopAdminMutation } from "../graphql/mutation/shopAdminMutation/DeleteShopAdminMutation";
import { IDeleteShopAdminMutationFragmentDefaultFragment } from "../graphql/fragmentType/mutation/shopAdminMutation/DeleteShopAdminMutationFragmentInterface";
import { deleteShopAdminMutationFragments } from "../graphql/fragment/mutation/shopAdminMutation/DeleteShopAdminMutationFragment";
import { IShopAdminFragmentAdmin } from "../graphql/fragmentType/query/ShopAdminFragmentInterface";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    overflow: "auto"
  }
}));

export default function Admin() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const { toast } = useToast();

  const [tableKey, setTableKey] = useState<any>(+new Date());
  const [modal, setModal] = useState<{
    createEditShopAdmin: boolean
  }>({
    createEditShopAdmin: false
  });
  const [editingShopAdmin, setEditingShopAdmin] = useState<IShopAdminFragmentAdmin | undefined>(undefined);

  function toggleModalCreateEditAdmin(shopAdmin?: IShopAdminFragmentAdmin) {
    setEditingShopAdmin(shopAdmin);
    setModal(
      update(modal, {
        createEditShopAdmin: { $set: !modal.createEditShopAdmin }
      })
    );
  }

  function updateTableKey() {
    setTableKey(+new Date());
  }

  let columns = [
    {
      id: "userName",
      Header: t("user"),
      accessor: (d: IShopAdminFragmentAdmin) => d.user.name + ` (${d.user.username})`,
      sortable: false,
      filterable: true
    },
    {
      id: "shop_admin_roleTitle",
      Header: t("shop admin role"),
      sortable: false,
      filterable: true,
      accessor: (d: IShopAdminFragmentAdmin) => d.shop_admin_role.title
    },
    {
      id: "created_at",
      Header: t("created at"),
      accessor: (d: IShopAdminFragmentAdmin) => d,
      Cell: ({ value }: { value: IShopAdminFragmentAdmin}) => {
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
      accessor: (d: IShopAdminFragmentAdmin) => d,
      Cell: ({ value }: { value: IShopAdminFragmentAdmin}) => {
        return (
          <>
            {(context.permission.includes("UPDATE_SHOP_ADMIN") ||
              context.permission.includes("VIEW_SHOP_ADMIN")) && (
              <Tooltip title={t("edit")}>
                <Fab
                  size="small"
                  variant="round"
                  color="primary"
                  onClick={() => {
                    toggleModalCreateEditAdmin(value);
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
    deleteShopAdminMutation,
    { loading: isDeletingShopAdminMutation }
  ] = useDeleteShopAdminMutation<IDeleteShopAdminMutationFragmentDefaultFragment>(deleteShopAdminMutationFragments.DefaultFragment, {
    onCompleted: (data) => {
      toast.default(
        t("{{count}} selected successfully delete", {
          count: data.deleteShopAdminMutation.length
        })
      );
      updateTableKey();
    }
  });

  if (context.permission.includes("DELETE_SHOP_ADMIN")) {
    actionList.push({
      title: t("delete"),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: async (selectedData: IShopAdminFragmentAdmin[]) => {
              let ownerRoleCount = selectedData.filter(
                (data) => data.shop_admin_role.is_shop_owner_role
              ).length;
              if (ownerRoleCount !== selectedData.length) {
                await deleteShopAdminMutation({
                  variables: {
                    shop_id: context.shop.id,
                    shop_admin_ids: selectedData.map(
                      (data) => data.id
                    )
                  }
                });
              }

              if (ownerRoleCount) {
                toast.default(
                  t("you cant delete shop owner admin")
                );
              }
            },
            loading: isDeletingShopAdminMutation
          })
        );
      }
    });
  }

  return <>
    <Helmet
      title={t("shop admin")}
      description={""}
      keywords={t("shop admin")}
      ogImage="/images/favicon-228.png"
    />
    <Paper className={classes.root} elevation={1}>
      <Grid container justify={"center"}>
        {context.permission.includes("CREATE_SHOP_ADMIN") && (
          <Grid container justify={"flex-end"}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => toggleModalCreateEditAdmin()}
            >
              <AddIcon/>
              {t("add admin role")}
            </Button>
          </Grid>
        )}

        <ModalCreateEditShopAdmin
          shopAdminId={
            editingShopAdmin
              ? editingShopAdmin.id
              : undefined
          }
          shopId={context.shop.id}
          disabled={!context.permission.includes("UPDATE_SHOP_ADMIN")}
          toggle={toggleModalCreateEditAdmin}
          isOpen={modal.createEditShopAdmin}
          refetchData={updateTableKey}
        />

        <SellerReactTable
          showCheckbox
          showFilter
          title={t("shop admin")}
          columns={columns}
          query={shopAdminQuery(shopAdminFragments.Admin)}
          variables={{
            shop_id: context.shop.id,
            key: tableKey,
            sort_created_at: "desc"
          }}
          actionList={actionList}
        />
      </Grid>
    </Paper>
  </>;
}