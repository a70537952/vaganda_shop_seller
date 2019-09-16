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
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import SellerHelmet from '../components/seller/SellerHelmet';
import LocaleMoment from '../components/LocaleMoment';
import ModalCreateEditShopAdmin from '../components/seller/Modal/ModalCreateEditShopAdmin';
import SellerReactTable from '../components/seller/SellerReactTable';
import { AppContext } from '../contexts/Context';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import { shopAdminQuery } from '../graphql/query/ShopAdminQuery';
import { shopAdminFragments } from '../graphql/fragment/query/ShopAdminFragment';

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  modal: any;
  editingShopAdmin: any;
  tableKey: number;
}

class Admin extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    this.state = {
      modal: {
        createEditShopAdmin: false
      },
      editingShopAdmin: null,
      tableKey: +new Date()
    };
  }

  toggleModalCreateAdmin() {
    this.setState(
      update(this.state, {
        modal: {
          createEditShopAdmin: { $set: !this.state.modal.createEditShopAdmin }
        },
        editingShopAdmin: { $set: null }
      })
    );
  }

  toggleModalEditAdmin(product: any) {
    this.setState(
      update(this.state, {
        modal: {
          createEditShopAdmin: { $set: !this.state.modal.createEditShopAdmin }
        },
        editingShopAdmin: { $set: product }
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
        id: 'userName',
        Header: t('user'),
        accessor: (d: any) => d.user.name + ` (${d.user.username})`,
        sortable: false,
        filterable: true
      },
      {
        id: 'shop_admin_roleTitle',
        Header: t('shop admin role'),
        sortable: false,
        filterable: true,
        accessor: (d: any) => d.shop_admin_role.title
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
              {(this.props.context.permission.includes('UPDATE_SHOP_ADMIN') ||
                this.props.context.permission.includes('VIEW_SHOP_ADMIN')) && (
                <Tooltip title={t('edit')}>
                  <Fab
                    size="small"
                    variant="round"
                    color="primary"
                    onClick={() => {
                      this.toggleModalEditAdmin(value);
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

    if (this.props.context.permission.includes('DELETE_SHOP_ADMIN')) {
      actionList.push({
        title: t('delete'),
        component: (component: any) => {
          return (
            <Mutation
              key={'deleteShopAdminMutation'}
              mutation={gql`
                mutation DeleteShopAdminMutation(
                  $shop_id: String!
                  $shop_admin_ids: [String]!
                ) {
                  deleteShopAdminMutation(
                    shop_id: $shop_id
                    shop_admin_ids: $shop_admin_ids
                  ) {
                    id
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t('{{count}} selected successfully delete', {
                    count: data.deleteShopAdminMutation.length
                  })
                );
                this.updateTableKey();
              }}
            >
              {(deleteShopAdminMutation, { data, loading, error }) => {
                return React.createElement(component, {
                  onClick: async (selectedData: any) => {
                    let ownerRoleCount = selectedData.filter(
                      (data: any) => data.shop_admin_role.is_shop_owner_role
                    ).length;
                    if (ownerRoleCount !== selectedData.length) {
                      await deleteShopAdminMutation({
                        variables: {
                          shop_id: this.props.context.shop.id,
                          shop_admin_ids: selectedData.map(
                            (data: any) => data.id
                          )
                        }
                      });
                    }

                    if (ownerRoleCount) {
                      this.props.enqueueSnackbar(
                        t('you cant delete shop owner admin')
                      );
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
            <SellerHelmet
              title={t('shop admin')}
              description={''}
              keywords={t('shop admin')}
              ogImage="/images/favicon-228.png"
            />

            <Paper className={classes.root} elevation={1}>
              <Grid container justify={'center'}>
                {context.permission.includes('CREATE_SHOP_ADMIN') && (
                  <Grid container justify={'flex-end'}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={this.toggleModalCreateAdmin.bind(this)}
                    >
                      <AddIcon />
                      {t('add admin role')}
                    </Button>
                  </Grid>
                )}

                <ModalCreateEditShopAdmin
                  shopAdminId={
                    this.state.editingShopAdmin
                      ? this.state.editingShopAdmin.id
                      : null
                  }
                  shopId={context.shop.id}
                  disabled={!context.permission.includes('UPDATE_SHOP_ADMIN')}
                  toggle={this.toggleModalCreateAdmin.bind(this)}
                  isOpen={this.state.modal.createEditShopAdmin}
                  refetchData={this.updateTableKey.bind(this)}
                />

                <SellerReactTable
                  showCheckbox
                  showFilter
                  title={t('shop admin')}
                  columns={columns}
                  query={shopAdminQuery(shopAdminFragments.Admin)}
                  variables={{
                    shop_id: context.shop.id,
                    key: this.state.tableKey,
                    sort_created_at: 'desc'
                  }}
                  actionList={actionList}
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
}))(withSnackbar(withTranslation()(withRouter(Admin))));
