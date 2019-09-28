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
import Helmet from "../components/seller/Helmet";
import LocaleMoment from "../components/LocaleMoment";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import { useTranslation } from "react-i18next";
import ModalCreateEditShopProductCategory from "../components/seller/Modal/ModalCreateEditShopProductCategory";
import { shopProductCategoryQuery } from "../graphql/query/ShopProductCategoryQuery";
import { shopProductCategoryFragments } from "../graphql/fragment/query/ShopProductCategoryFragment";
import useToast from "../components/_hook/useToast";
import { useDeleteShopProductCategoryMutation } from "../graphql/mutation/shopProductCategoryMutation/DeleteShopProductCategoryMutation";
import { IDeleteShopProductCategoryMutationFragmentDefaultFragment } from "../graphql/fragmentType/mutation/shopProductCategoryMutation/DeleteShopProductCategoryMutationFragmentInterface";
import { deleteShopProductCategoryMutationFragments } from "../graphql/fragment/mutation/DeleteShopProductCategoryMutationFragment";
import { IShopProductCategoryFragmentProductCategory } from "../graphql/fragmentType/query/ShopProductCategoryFragmentInterface";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    overflow: "auto"
  }
}));

export default function ProductCategory() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const { toast } = useToast();

  const [tableKey, setTableKey] = useState<any>(+new Date());
  const [modal, setModal] = useState<{
    createEditShopProductCategory: boolean
  }>({
    createEditShopProductCategory: false
  });
  const [editingShopProductCategory, setEditingShopProductCategory] = useState<any>(null);

  function toggleModalProductCategory(productCategory?: any) {
    setEditingShopProductCategory(productCategory);
    setModal(
      update(modal, {
        createEditShopProductCategory: { $set: !modal.createEditShopProductCategory }
      })
    );
  }

  function updateTableKey() {
    setTableKey(+new Date());
  }

  let columns = [
    {
      id: "title",
      Header: t("title"),
      accessor: (d: IShopProductCategoryFragmentProductCategory) => d.title,
      sortable: true,
      filterable: true
    },
    {
      id: "product_count",
      Header: t("product count"),
      sortable: true,
      accessor: (d: IShopProductCategoryFragmentProductCategory) => d.product_count
    },
    {
      id: "created_at",
      Header: t("created at"),
      accessor: (d: IShopProductCategoryFragmentProductCategory) => d,
      Cell: ({ value }: { value: IShopProductCategoryFragmentProductCategory }) => {
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
      accessor: (d: IShopProductCategoryFragmentProductCategory) => d,
      Cell: ({ value }: { value: IShopProductCategoryFragmentProductCategory }) => {
        return (
          <>
            {(context.permission.includes(
              "UPDATE_SHOP_PRODUCT_CATEGORY"
              ) ||
              context.permission.includes(
                "VIEW_SHOP_PRODUCT_CATEGORY"
              )) && (
              <Tooltip title={t("edit")}>
                <Fab
                  size="small"
                  variant="round"
                  color="primary"
                  onClick={() => {
                    toggleModalProductCategory(value);
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
    deleteShopProductCategoryMutation,
    { loading: isDeletingShopProductCategoryMutation }
  ] = useDeleteShopProductCategoryMutation<IDeleteShopProductCategoryMutationFragmentDefaultFragment>(deleteShopProductCategoryMutationFragments.DefaultFragment, {
    onCompleted: (data) => {
      toast.default(
        t("{{count}} selected successfully delete", {
          count: data.deleteShopProductCategoryMutation.length
        })
      );
      updateTableKey();
    }
  });

  if (
    context.permission.includes("DELETE_SHOP_PRODUCT_CATEGORY")
  ) {
    actionList.push({
      title: t("delete"),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: async (selectedData: IShopProductCategoryFragmentProductCategory[]) => {
              await deleteShopProductCategoryMutation({
                variables: {
                  shop_id: context.shop.id,
                  shop_product_category_ids: selectedData.map(
                    (data: any) => data.id
                  )
                }
              });
            },
            loading: isDeletingShopProductCategoryMutation
          })
        );
      }
    });
  }

  return <>
    <Helmet
      title={t("product category")}
      description={""}
      keywords={t("product category")}
      ogImage="/images/favicon-228.png"
    />
    <Paper className={classes.root} elevation={1}>
      <Grid container justify={"center"}>
        {context.permission.includes(
          "CREATE_SHOP_PRODUCT_CATEGORY"
        ) && (
          <Grid container justify={"flex-end"}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={toggleModalProductCategory}
            >
              <AddIcon/>
              {t("add product category")}
            </Button>
          </Grid>
        )}

        <ModalCreateEditShopProductCategory
          shopProductCategoryId={
            editingShopProductCategory
              ? editingShopProductCategory.id
              : null
          }
          shopId={context.shop.id}
          disabled={
            !context.permission.includes("UPDATE_SHOP_PRODUCT_CATEGORY")
          }
          toggle={toggleModalProductCategory}
          isOpen={modal.createEditShopProductCategory}
          refetchData={updateTableKey}
        />

        <SellerReactTable
          showCheckbox
          showFilter
          title={t("shop product category")}
          columns={columns}
          query={shopProductCategoryQuery(
            shopProductCategoryFragments.ProductCategory
          )}
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