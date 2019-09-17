import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import update from "immutability-helper";
import { withSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { Mutation } from "react-apollo";
import { WithTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import Helmet from "../components/seller/Helmet";
import LocaleMoment from "../components/LocaleMoment";
import ModalUpdateUserOrderDetail from "../components/seller/Modal/ModalUpdateUserOrderDetail";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import Typography from "@material-ui/core/Typography";
import Address from "../components/Address";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import USER_ORDER_DETAIL from "../constant/USER_ORDER_DETAIL";
import { userOrderDetailQuery } from "../graphql/query/UserOrderDetailQuery";
import { userOrderDetailFragments } from "../graphql/fragment/query/UserOrderDetailFragment";

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  modal: {
    editOrderDetail: boolean;
  };
  editingOrderDetail: any;
  tableKey: number;
}

class OrderDetail extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    this.state = {
      modal: {
        editOrderDetail: false
      },
      editingOrderDetail: null,
      tableKey: +new Date()
    };
  }

  toggleModalUpdateUserOrderDetail(orderDetail?: any) {
    this.setState(
      update(this.state, {
        modal: {
          editOrderDetail: { $set: !this.state.modal.editOrderDetail }
        },
        editingOrderDetail: { $set: orderDetail }
      })
    );
  }

  updateTableKey() {
    this.setState(
      update(this.state, {
        tableKey: { $set: +new Date() }
      })
    );
  }

  render() {
    const { classes, t } = this.props;

    let columns = [
      {
        id: 'id',
        Header: t('order detail id'),
        accessor: (d: any) => d.id,
        sortable: false,
        filterable: true
      },
      {
        id: 'product_title',
        Header: t('product title'),
        sortable: false,
        filterable: true,
        accessor: (d: any) => d.product_title
      },
      {
        id: 'product_type_title',
        Header: t('product type title'),
        sortable: false,
        filterable: true,
        accessor: (d: any) => d.product_type_title
      },
      {
        id: 'product_quantity',
        Header: t('quantity'),
        sortable: false,
        filterable: false,
        accessor: (d: any) => d.product_quantity
      },
      {
        id: 'shipping',
        Header: t('shipping'),
        sortable: false,
        filterable: false,
        accessor: (d: any) =>
          d.product_shipping_title +
          ` (${t('global$$countryKey::' + d.product_shipping_country)})`
      },
      {
        id: 'order_detail_status',
        Header: t('status'),
        sortable: false,
        filterable: true,
        accessor: (d: any) =>
          t('global$$orderDetailStatus::' + d.order_detail_status),
        filterType: 'select',
        filterComponent: (props: any) => {
          return (
            <Select {...props}>
              <MenuItem value={''}>{t('all')}</MenuItem>
              {Object.keys(USER_ORDER_DETAIL.ORDER_DETAIL_STATUS).map(
                (statusKey: string) => (
                  <MenuItem key={statusKey} value={statusKey}>
                    {t(
                      'global$$orderDetailStatus::' +
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
        id: 'created_at',
        Header: t('created at'),
        accessor: (d: any) => d,
        Cell: ({ value }: any) => {
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
        id: 'action',
        sortable: false,
        Header: t('action'),
        accessor: (d: any) => d,
        Cell: ({ value }: any) => {
          return (
            <>
              {(this.props.context.permission.includes(
                'UPDATE_SHOP_USER_ORDER_DETAIL'
              ) ||
                this.props.context.permission.includes(
                  'VIEW_SHOP_USER_ORDER_DETAIL'
                )) && (
                <Tooltip title={t('edit')}>
                  <Fab
                    size="small"
                    variant="round"
                    color="primary"
                    onClick={() => {
                      this.toggleModalUpdateUserOrderDetail(value);
                    }}
                  >
                    <EditIcon />
                  </Fab>
                </Tooltip>
              )}
            </>
          );
        }
      }
    ];
    let actionList: any[] = [];

    if (
      this.props.context.permission.includes('UPDATE_SHOP_USER_ORDER_DETAIL')
    ) {
      actionList.push({
        title: t('update status to paid'),
        component: (component: any) => {
          return (
            <Mutation
              key={'paid'}
              mutation={gql`
                mutation UpdateUserOrderDetailStatusMutation(
                  $shop_id: String!
                  $userOrderDetailIds: [String]!
                  $order_detail_status: String!
                ) {
                  updateUserOrderDetailStatusMutation(
                    shop_id: $shop_id
                    userOrderDetailIds: $userOrderDetailIds
                    order_detail_status: $order_detail_status
                  ) {
                    id
                    order_detail_status
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t(
                    '{{count}} selected successfully update status to {{status}}',
                    {
                      count: data.updateUserOrderDetailStatusMutation.length,
                      status: t('paid')
                    }
                  )
                );
              }}
            >
              {(
                updateUserOrderDetailStatusMutation,
                { data, loading, error }
              ) => {
                return React.createElement(component, {
                  onClick: (selectedData: any) => {
                    let invalidStatusData = selectedData.filter(
                      (orderDetail: any) =>
                        ![
                          USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                          USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                        ].includes(orderDetail.order_detail_status)
                    );

                    if (invalidStatusData.length) {
                      invalidStatusData.forEach((orderDetail: any) => {
                        this.props.enqueueSnackbar(
                          t('you cannot update order detail id {{id}} status', {
                            id: orderDetail.id
                          })
                        );
                      });
                      return false;
                    } else {
                      return updateUserOrderDetailStatusMutation({
                        variables: {
                          shop_id: this.props.context.shop.id,
                          userOrderDetailIds: selectedData.map(
                            (data: any) => data.id
                          ),
                          order_detail_status:
                            USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID
                        }
                      });
                    }
                  },
                  loading: loading
                });
              }}
            </Mutation>
          );
        }
      });

      actionList.push({
        title: t('update status to shipped'),
        component: (component: any) => {
          return (
            <Mutation
              key={'shipped'}
              mutation={gql`
                mutation UpdateUserOrderDetailStatusMutation(
                  $shop_id: String!
                  $userOrderDetailIds: [String]!
                  $order_detail_status: String!
                ) {
                  updateUserOrderDetailStatusMutation(
                    shop_id: $shop_id
                    userOrderDetailIds: $userOrderDetailIds
                    order_detail_status: $order_detail_status
                  ) {
                    id
                    order_detail_status
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t(
                    '{{count}} selected successfully update status to {{status}}',
                    {
                      count: data.updateUserOrderDetailStatusMutation.length,
                      status: t('shipped')
                    }
                  )
                );
              }}
            >
              {(
                updateUserOrderDetailStatusMutation,
                { data, loading, error }
              ) => {
                return React.createElement(component, {
                  onClick: (selectedData: any) => {
                    let invalidStatusData = selectedData.filter(
                      (orderDetail: any) =>
                        ![
                          USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                          USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                        ].includes(orderDetail.order_detail_status)
                    );

                    if (invalidStatusData.length) {
                      invalidStatusData.forEach((orderDetail: any) => {
                        this.props.enqueueSnackbar(
                          t('you cannot update order detail id {{id}} status', {
                            id: orderDetail.id
                          })
                        );
                      });
                      return false;
                    } else {
                      return updateUserOrderDetailStatusMutation({
                        variables: {
                          shop_id: this.props.context.shop.id,
                          userOrderDetailIds: selectedData.map(
                            (data: any) => data.id
                          ),
                          order_detail_status:
                            USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                        }
                      });
                    }
                  },
                  loading: loading
                });
              }}
            </Mutation>
          );
        }
      });
    }

    return (
      <AppContext.Consumer>
        {context => (
          <>
            <Helmet
              title={t('order detail')}
              description={''}
              keywords={t('order detail')}
              ogImage="/images/favicon-228.png"
            />

            <Paper className={classes.root} elevation={1}>
              <Grid container justify={'center'}>
                <ModalUpdateUserOrderDetail
                  orderDetailId={
                    this.state.editingOrderDetail
                      ? this.state.editingOrderDetail.id
                      : null
                  }
                  shopId={context.shop.id}
                  disabled={
                    !context.permission.includes(
                      'UPDATE_SHOP_USER_ORDER_DETAIL'
                    )
                  }
                  toggle={this.toggleModalUpdateUserOrderDetail.bind(this)}
                  isOpen={this.state.modal.editOrderDetail}
                  refetchData={this.updateTableKey.bind(this)}
                />

                <SellerReactTable
                  showCheckbox
                  showFilter
                  title={t('order detail')}
                  columns={columns}
                  query={userOrderDetailQuery(
                    userOrderDetailFragments.OrderDetail
                  )}
                  variables={{
                    shop_id: context.shop.id,
                    key: this.state.tableKey,
                    sort_created_at: 'desc'
                  }}
                  actionList={actionList}
                  SubComponent={({ original: data }: any) => {
                    return (
                      <Grid container spacing={1} justify="center">
                        <Grid container item justify="space-between" xs={10}>
                          <Typography variant="subtitle2" color="inherit">
                            {t('product final price')}:{' '}
                            {data.product_unit_price_currency}{' '}
                            {data.product_final_price} X {data.product_quantity}
                          </Typography>
                          <Typography variant="subtitle2" color="inherit">
                            {t('product total price')}:{' '}
                            {data.product_unit_price_currency}{' '}
                            {data.product_total_price}
                          </Typography>
                        </Grid>
                        <Grid container item justify="space-between" xs={10}>
                          <Typography variant="subtitle2" color="inherit">
                            {t('product shipping fee')}:{' '}
                            {data.product_shipping_currency}{' '}
                            {data.product_shipping_fee} X{' '}
                            {data.product_quantity}
                          </Typography>
                          <Typography variant="subtitle2" color="inherit">
                            {t('product total shipping fee')}:{' '}
                            {data.product_shipping_currency}{' '}
                            {data.product_total_shipping_fee}
                          </Typography>
                        </Grid>
                        <Grid container item justify="space-between" xs={10}>
                          <Typography variant="subtitle2" color="inherit">
                            {t('shipping track number')}:{' '}
                            {data.product_shipping_track_number || '-'}
                          </Typography>
                          <Typography variant="subtitle2" color="inherit">
                            {t('message')}: {data.message || '-'}
                          </Typography>
                        </Grid>
                        <Grid container item xs={10}>
                          <Typography
                            variant="subtitle2"
                            color="inherit"
                            display="inline"
                          >
                            {t('shipping address')}:&nbsp;
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
                            {t('remark')}: {data.remark || '-'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="inherit"
                            display="inline"
                          >
                            {t('is commented')}:{' '}
                            {data.is_commented ? t('yes') : t('no')}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  }}
                />
              </Grid>
            </Paper>
          </>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(3),
    overflow: 'auto'
  }
}))(withSnackbar(withTranslation()(withRouter(OrderDetail))));
