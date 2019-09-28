import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import update from "immutability-helper";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Helmet from "../components/seller/Helmet";
import LocaleMoment from "../components/LocaleMoment";
import ModalUpdateUserOrderDetail from "../components/seller/Modal/ModalUpdateUserOrderDetail";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import Typography from "@material-ui/core/Typography";
import Address from "../components/Address";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import USER_ORDER_DETAIL from "../constant/USER_ORDER_DETAIL";
import { userOrderDetailQuery } from "../graphql/query/UserOrderDetailQuery";
import { userOrderDetailFragments } from "../graphql/fragment/query/UserOrderDetailFragment";
import useToast from "../components/_hook/useToast";
import { IUserOrderDetailFragmentOrderDetail } from "../graphql/fragmentType/query/UserOrderDetailFragmentInterface";
import { useUpdateUserOrderDetailStatusMutation } from "../graphql/mutation/userOrderDetailMutation/UpdateUserOrderDetailStatusMutation";
import { updateUserOrderDetailStatusMutationFragments } from "../graphql/fragment/mutation/userOrderDetailMutation/UpdateUserOrderDetailStatusMutationFragment";
import { IUpdateUserOrderDetailStatusMutationFragmentOrderDetail } from "../graphql/fragmentType/mutation/userOrderDetailMutation/AddProductTypeToUserCartMutationFragmentInterface";


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    overflow: "auto"
  }
}));

export default function OrderDetail() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const { toast } = useToast();

  const [tableKey, setTableKey] = useState<any>(+new Date());
  const [modal, setModal] = useState<{
    editOrderDetail: boolean
  }>({
    editOrderDetail: false
  });
  const [editingOrderDetail, setEditingOrderDetail] = useState<any>(null);

  function toggleModalUpdateUserOrderDetail(orderDetail?: any) {
    setEditingOrderDetail(orderDetail);
    setModal(
      update(modal, {
        editOrderDetail: { $set: !modal.editOrderDetail }
      })
    );
  }

  function updateTableKey() {
    setTableKey(+new Date());
  }

  let columns = [
    {
      id: "id",
      Header: t("order detail id"),
      accessor: (d: IUserOrderDetailFragmentOrderDetail) => d.id,
      sortable: false,
      filterable: true
    },
    {
      id: "product_title",
      Header: t("product title"),
      sortable: false,
      filterable: true,
      accessor: (d: IUserOrderDetailFragmentOrderDetail) => d.product_title
    },
    {
      id: "product_type_title",
      Header: t("product type title"),
      sortable: false,
      filterable: true,
      accessor: (d: IUserOrderDetailFragmentOrderDetail) => d.product_type_title
    },
    {
      id: "product_quantity",
      Header: t("quantity"),
      sortable: false,
      filterable: false,
      accessor: (d: IUserOrderDetailFragmentOrderDetail) => d.product_quantity
    },
    {
      id: "shipping",
      Header: t("shipping"),
      sortable: false,
      filterable: false,
      accessor: (d: IUserOrderDetailFragmentOrderDetail) =>
        d.product_shipping_title +
        ` (${t("global$$countryKey::" + d.product_shipping_country)})`
    },
    {
      id: "order_detail_status",
      Header: t("status"),
      sortable: false,
      filterable: true,
      accessor: (d: IUserOrderDetailFragmentOrderDetail) =>
        t("global$$orderDetailStatus::" + d.order_detail_status),
      filterType: "select",
      filterComponent: (props: any) => {
        return (
          <Select {...props}>
            <MenuItem value={""}>{t("all")}</MenuItem>
            {Object.keys(USER_ORDER_DETAIL.ORDER_DETAIL_STATUS).map(
              (statusKey: string) => (
                <MenuItem key={statusKey} value={statusKey}>
                  {t(
                    "global$$orderDetailStatus::" +
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS[statusKey]
                  )}
                </MenuItem>
              )
            )}
          </Select>
        );
      }
    },
    {
      id: "created_at",
      Header: t("created at"),
      accessor: (d: IUserOrderDetailFragmentOrderDetail) => d,
      Cell: ({ value }: { value: IUserOrderDetailFragmentOrderDetail }) => {
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
      accessor: (d: IUserOrderDetailFragmentOrderDetail) => d,
      Cell: ({ value }: { value: IUserOrderDetailFragmentOrderDetail }) => {
        return (
          <>
            {(context.permission.includes(
              "UPDATE_SHOP_USER_ORDER_DETAIL"
              ) ||
              context.permission.includes(
                "VIEW_SHOP_USER_ORDER_DETAIL"
              )) && (
              <Tooltip title={t("edit")}>
                <Fab
                  size="small"
                  variant="round"
                  color="primary"
                  onClick={() => {
                    toggleModalUpdateUserOrderDetail(value);
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
    updateUserOrderDetailStatusMutationToPaid,
    { loading: isUpdatingUserOrderDetailStatusMutationToPaid }
  ] = useUpdateUserOrderDetailStatusMutation<IUpdateUserOrderDetailStatusMutationFragmentOrderDetail>(updateUserOrderDetailStatusMutationFragments.OrderDetail, {
    onCompleted: (data) => {
      toast.default(
        t(
          "{{count}} selected successfully update status to {{status}}",
          {
            count: data.updateUserOrderDetailStatusMutation.length,
            status: t(
              "global$$orderDetailStatus::" +
              USER_ORDER_DETAIL.ORDER_DETAIL_STATUS[data.updateUserOrderDetailStatusMutation[0].order_detail_status]
            )
          }
        )
      );
    }
  });

  const [
    updateUserOrderDetailStatusMutationToShipped,
    { loading: isUpdatingUserOrderDetailStatusMutationToShipped }
  ] = useUpdateUserOrderDetailStatusMutation<IUpdateUserOrderDetailStatusMutationFragmentOrderDetail>(updateUserOrderDetailStatusMutationFragments.OrderDetail, {
    onCompleted: (data) => {
      toast.default(
        t(
          "{{count}} selected successfully update status to {{status}}",
          {
            count: data.updateUserOrderDetailStatusMutation.length,
            status: t(
              "global$$orderDetailStatus::" +
              USER_ORDER_DETAIL.ORDER_DETAIL_STATUS[data.updateUserOrderDetailStatusMutation[0].order_detail_status]
            )
          }
        )
      );
    }
  });

  if (context.permission.includes("UPDATE_SHOP_USER_ORDER_DETAIL")) {
    actionList.push({
      title: t("update status to paid"),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: (selectedData: IUserOrderDetailFragmentOrderDetail[]) => {
              let invalidStatusData = selectedData.filter(
                (orderDetail) =>
                  ![
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                  ].includes(orderDetail.order_detail_status)
              );

              if (invalidStatusData.length) {
                invalidStatusData.forEach((orderDetail) => {
                  toast.default(
                    t("you cannot update order detail id {{id}} status", {
                      id: orderDetail.id
                    })
                  );
                });
                return false;
              } else {
                return updateUserOrderDetailStatusMutationToPaid({
                  variables: {
                    shop_id: context.shop.id,
                    userOrderDetailIds: selectedData.map(
                      (data: IUserOrderDetailFragmentOrderDetail) => data.id
                    ),
                    order_detail_status:
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID
                  }
                });
              }
            },
            loading: isUpdatingUserOrderDetailStatusMutationToPaid
          })
        );
      }
    });

    actionList.push({
      title: t("update status to shipped"),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: (selectedData: IUserOrderDetailFragmentOrderDetail[]) => {
              let invalidStatusData = selectedData.filter(
                (orderDetail) =>
                  ![
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                  ].includes(orderDetail.order_detail_status)
              );

              if (invalidStatusData.length) {
                invalidStatusData.forEach((orderDetail) => {
                  toast.default(
                    t("you cannot update order detail id {{id}} status", {
                      id: orderDetail.id
                    })
                  );
                });
                return false;
              } else {
                return updateUserOrderDetailStatusMutationToShipped({
                  variables: {
                    shop_id: context.shop.id,
                    userOrderDetailIds: selectedData.map(
                      (data: IUserOrderDetailFragmentOrderDetail) => data.id
                    ),
                    order_detail_status:
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                  }
                });
              }
            },
            loading: isUpdatingUserOrderDetailStatusMutationToShipped
          })
        );
      }
    });
  }

  return <>
    <Helmet
      title={t("order detail")}
      description={""}
      keywords={t("order detail")}
      ogImage="/images/favicon-228.png"
    />
    <Paper className={classes.root} elevation={1}>
      <Grid container justify={"center"}>
        <ModalUpdateUserOrderDetail
          orderDetailId={
            editingOrderDetail
              ? editingOrderDetail.id
              : null
          }
          shopId={context.shop.id}
          disabled={
            !context.permission.includes(
              "UPDATE_SHOP_USER_ORDER_DETAIL"
            )
          }
          toggle={toggleModalUpdateUserOrderDetail}
          isOpen={modal.editOrderDetail}
          refetchData={updateTableKey}
        />

        <SellerReactTable
          showCheckbox
          showFilter
          title={t("order detail")}
          columns={columns}
          query={userOrderDetailQuery(
            userOrderDetailFragments.OrderDetail
          )}
          variables={{
            shop_id: context.shop.id,
            key: tableKey,
            sort_created_at: "desc"
          }}
          actionList={actionList}
          SubComponent={({ original: data }: { original: IUserOrderDetailFragmentOrderDetail }) => {
            return (
              <Grid container spacing={1} justify="center">
                <Grid container item justify="space-between" xs={10}>
                  <Typography variant="subtitle2" color="inherit">
                    {t("product final price")}:{" "}
                    {data.product_unit_price_currency}{" "}
                    {data.product_final_price} X {data.product_quantity}
                  </Typography>
                  <Typography variant="subtitle2" color="inherit">
                    {t("product total price")}:{" "}
                    {data.product_unit_price_currency}{" "}
                    {data.product_total_price}
                  </Typography>
                </Grid>
                <Grid container item justify="space-between" xs={10}>
                  <Typography variant="subtitle2" color="inherit">
                    {t("product shipping fee")}:{" "}
                    {data.product_shipping_currency}{" "}
                    {data.product_shipping_fee} X{" "}
                    {data.product_quantity}
                  </Typography>
                  <Typography variant="subtitle2" color="inherit">
                    {t("product total shipping fee")}:{" "}
                    {data.product_shipping_currency}{" "}
                    {data.product_total_shipping_fee}
                  </Typography>
                </Grid>
                <Grid container item justify="space-between" xs={10}>
                  <Typography variant="subtitle2" color="inherit">
                    {t("shipping track number")}:{" "}
                    {data.product_shipping_track_number || "-"}
                  </Typography>
                  <Typography variant="subtitle2" color="inherit">
                    {t("message")}: {data.message || "-"}
                  </Typography>
                </Grid>
                <Grid container item xs={10}>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    display="inline"
                  >
                    {t("shipping address")}:&nbsp;
                  </Typography>
                  <Address
                    display="inline"
                    variant="subtitle2"
                    address={data.order_address}
                  />
                </Grid>
                <Grid container item justify="space-between" xs={10}>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    display="inline"
                  >
                    {t("remark")}: {data.remark || "-"}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    display="inline"
                  >
                    {t("is commented")}:{" "}
                    {data.is_commented ? t("yes") : t("no")}
                  </Typography>
                </Grid>
              </Grid>
            );
          }}
        />
      </Grid>
    </Paper>
  </>;
}