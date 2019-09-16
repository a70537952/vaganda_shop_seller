import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles/index';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import update from 'immutability-helper';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import SellerHelmet from '../components/seller/SellerHelmet';
import LocaleMoment from '../components/LocaleMoment';
import SellerReactTable from '../components/seller/SellerReactTable';
import { AppContext } from '../contexts/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import ModalCreateEditShopProductCategory from '../components/seller/Modal/ModalCreateEditShopProductCategory';
import { shopProductCategoryQuery } from '../graphql/query/ShopProductCategoryQuery';
import { shopProductCategoryFragments } from '../graphql/fragment/query/ShopProductCategoryFragment';

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  modal: {
    createEditShopProductCategory: boolean;
  };
  editingShopProductCategory: any;
  tableKey: number;
}

class ProductCategory extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    this.state = {
      modal: {
        createEditShopProductCategory: false
      },
      editingShopProductCategory: null,
      tableKey: +new Date()
    };
  }

  toggleModalProductCategory(product: any = null) {
    this.setState(
      update(this.state, {
        modal: {
          createEditShopProductCategory: {
            $set: !this.state.modal.createEditShopProductCategory
          }
        },
        editingShopProductCategory: { $set: product }
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
        id: 'title',
        Header: t('title'),
        accessor: (d: any) => d.title,
        sortable: true,
        filterable: true
      },
      {
        id: 'product_count',
        Header: t('product count'),
        sortable: true,
        accessor: (d: any) => d.product_count
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
                'UPDATE_SHOP_PRODUCT_CATEGORY'
              ) ||
                this.props.context.permission.includes(
                  'VIEW_SHOP_PRODUCT_CATEGORY'
                )) && (
                <Tooltip title={t('edit')}>
                  <Fab
                    size="small"
                    variant="round"
                    color="primary"
                    onClick={() => {
                      this.toggleModalProductCategory(value);
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
      this.props.context.permission.includes('DELETE_SHOP_PRODUCT_CATEGORY')
    ) {
      actionList.push({
        title: t('delete'),
        component: (component: any) => {
          return (
            <Mutation
              key={'deleteShopProductCategoryMutation'}
              mutation={gql`
                mutation DeleteShopProductCategoryMutation(
                  $shop_id: String!
                  $shop_product_category_ids: [String]!
                ) {
                  deleteShopProductCategoryMutation(
                    shop_id: $shop_id
                    shop_product_category_ids: $shop_product_category_ids
                  ) {
                    id
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t('{{count}} selected successfully delete', {
                    count: data.deleteShopProductCategoryMutation.length
                  })
                );
                this.updateTableKey();
              }}
            >
              {(
                deleteShopProductCategoryMutation,
                { data, loading, error }
              ) => {
                return React.createElement(component, {
                  onClick: async (selectedData: any) => {
                    await deleteShopProductCategoryMutation({
                      variables: {
                        shop_id: this.props.context.shop.id,
                        shop_product_category_ids: selectedData.map(
                          (data: any) => data.id
                        )
                      }
                    });
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
          <React.Fragment>
            <SellerHelmet
              title={t('product category')}
              description={''}
              keywords={t('product category')}
              ogImage="/images/favicon-228.png"
            />

            <Paper className={classes.root} elevation={1}>
              <Grid container justify={'center'}>
                {context.permission.includes(
                  'CREATE_SHOP_PRODUCT_CATEGORY'
                ) && (
                  <Grid container justify={'flex-end'}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={this.toggleModalProductCategory.bind(this)}
                    >
                      <AddIcon />
                      {t('add product category')}
                    </Button>
                  </Grid>
                )}

                <ModalCreateEditShopProductCategory
                  shopProductCategoryId={
                    this.state.editingShopProductCategory
                      ? this.state.editingShopProductCategory.id
                      : null
                  }
                  shopId={context.shop.id}
                  disabled={
                    !context.permission.includes('UPDATE_SHOP_PRODUCT_CATEGORY')
                  }
                  toggle={this.toggleModalProductCategory.bind(this)}
                  isOpen={this.state.modal.createEditShopProductCategory}
                  refetchData={this.updateTableKey.bind(this)}
                />

                <SellerReactTable
                  showCheckbox
                  showFilter
                  title={t('shop product category')}
                  columns={columns}
                  query={shopProductCategoryQuery(
                    shopProductCategoryFragments.ProductCategory
                  )}
                  variables={{
                    shop_id: context.shop.id,
                    key: this.state.tableKey,
                    sort_created_at: 'desc'
                  }}
                  actionList={actionList}
                />
              </Grid>
            </Paper>
          </React.Fragment>
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
  },
  progress: {}
}))(withSnackbar(withTranslation()(withRouter(ProductCategory))));
