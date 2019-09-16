import { withStyles } from '@material-ui/core/styles/index';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import SellerHelmet from '../../components/seller/SellerHelmet';
import { AppContext } from '../../contexts/seller/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import Grid from '@material-ui/core/Grid';
import SellerReactTable from '../../components/seller/SellerReactTable';
import Tooltip from '@material-ui/core/Tooltip';
import LocaleMoment from '../../components/LocaleMoment';
import LinesEllipsis from 'react-lines-ellipsis';
import StarRating from '../../components/_rating/StarRating';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { sellerPath } from '../../utils/RouteUtil';
import { userOrderDetailCommentQuery } from '../../graphql/query/UserOrderDetailCommentQuery';
import { userOrderDetailQuery } from '../../graphql/query/UserOrderDetailQuery';
import { userOrderDetailCommentFragments } from '../../graphql/fragment/query/UserOrderDetailCommentFragment';
import { userOrderDetailFragments } from '../../graphql/fragment/query/UserOrderDetailFragment';

interface IProps {
  classes: any;
  context: any;
}

interface IState {}

class Dashboard extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, t } = this.props;

    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <SellerHelmet
              title={t('dashboard')}
              description={''}
              keywords={t('dashboard')}
              ogImage="/images/favicon-228.png"
            />
            <Grid container spacing={2}>
              {context.permission.includes('VIEW_SHOP_USER_ORDER_DETAIL') && (
                <Grid item xs={12} lg={6}>
                  <Card className={classes.card}>
                    <CardContent>
                      <SellerReactTable
                        title={t('latest order detail')}
                        columns={[
                          {
                            id: 'id',
                            Header: t('order detail id'),
                            accessor: (d: any) => d.id,
                            sortable: false
                          },
                          {
                            id: 'product_title',
                            Header: t('product title') + ' X ' + t('quantity'),
                            sortable: false,
                            accessor: (d: any) =>
                              `${d.product_title} (${d.product_type_title}) X ${d.product_quantity}`
                          },
                          {
                            id: 'order_detail_status',
                            Header: t('status'),
                            sortable: false,
                            accessor: (d: any) =>
                              t(
                                'global$$orderDetailStatus::' +
                                  d.order_detail_status
                              )
                          },
                          {
                            id: 'created_at',
                            Header: t('created at'),
                            accessor: (d: any) => d,
                            sortable: false,
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
                                    <LocaleMoment showAll>
                                      {value.created_at}
                                    </LocaleMoment>
                                  </div>
                                </Tooltip>
                              );
                            }
                          }
                        ]}
                        query={userOrderDetailQuery(
                          userOrderDetailFragments.Dashboard
                        )}
                        showPagination={false}
                        variables={{
                          shop_id: context.shop.id,
                          sort_created_at: 'desc'
                        }}
                        defaultPageSize={5}
                      />
                    </CardContent>
                    <CardActions>
                      <Grid container justify={'flex-end'}>
                        <Button
                          size="small"
                          {...({
                            component: Link,
                            to: sellerPath('order')
                          } as any)}
                        >
                          {t('view more')}
                        </Button>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              )}
              {context.permission.includes(
                'VIEW_SHOP_USER_ORDER_DETAIL_COMMENT'
              ) && (
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardContent>
                      <SellerReactTable
                        title={t('latest order comment')}
                        columns={[
                          {
                            id: 'user_order_detail.product_title',
                            Header: t('product title'),
                            sortable: false,
                            accessor: (d: any) =>
                              d.user_order_detail.product_title
                          },
                          {
                            id: 'comment',
                            Header: t('comment'),
                            sortable: false,
                            accessor: (d: any) => d,
                            Cell: ({ value }: any) => {
                              return (
                                <Tooltip title={value.comment}>
                                  <div>
                                    <LinesEllipsis
                                      text={value.comment}
                                      maxLine="2"
                                      ellipsis="..."
                                      trimRight
                                      basedOn="letters"
                                    />
                                  </div>
                                </Tooltip>
                              );
                            }
                          },
                          {
                            id: 'star',
                            Header: t('star'),
                            sortable: false,
                            accessor: (d: any) => (
                              <StarRating
                                size={'small'}
                                value={d.star}
                                readOnly
                              />
                            )
                          },
                          {
                            id: 'created_at',
                            Header: t('created at'),
                            sortable: false,
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
                                    <LocaleMoment showAll>
                                      {value.created_at}
                                    </LocaleMoment>
                                  </div>
                                </Tooltip>
                              );
                            }
                          }
                        ]}
                        query={userOrderDetailCommentQuery(
                          userOrderDetailCommentFragments.Dashboard
                        )}
                        showPagination={false}
                        variables={{
                          shop_id: context.shop.id,
                          sort_created_at: 'desc'
                        }}
                        defaultPageSize={5}
                      />
                    </CardContent>
                    <CardActions>
                      <Grid container justify={'flex-end'}>
                        <Button
                          size="small"
                          {...({
                            component: Link,
                            to: sellerPath('orderComment')
                          } as any)}
                        >
                          {t('view more')}
                        </Button>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              )}
            </Grid>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  card: {
    width: '100%',
    overflow: 'auto'
  }
}))(withSnackbar(withTranslation()(withRouter(Dashboard))));
