import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles/index';

import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import update from 'immutability-helper';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import SellerHelmet from '../../components/seller/SellerHelmet';
import LocaleMoment from '../../components/LocaleMoment';
import ModalCreateEditShopAdminRole from '../../components/seller/Modal/ModalCreateEditShopAdminRole';
import SellerReactTable from '../../components/seller/SellerReactTable';
import { AppContext } from '../../contexts/seller/Context';
import { shopAdminRoleQuery } from '../../graphql/query/ShopAdminRoleQuery';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import { shopAdminRoleFragments } from '../../graphql/fragment/query/ShopAdminRoleFragment';

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  modal: any;
  editingShopAdminRole: any | null;
  tableKey: number;
}

class AdminRole extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    this.state = {
      modal: {
        createEditShopAdminRole: false
      },
      editingShopAdminRole: null,
      tableKey: +new Date()
    };
  }

  toggleModalCreateAdminRole() {
    this.setState(
      update(this.state, {
        modal: {
          createEditShopAdminRole: {
            $set: !this.state.modal.createEditShopAdminRole
          }
        },
        editingShopAdminRole: { $set: null }
      })
    );
  }

  toggleModalEditAdminRole(product: any) {
    this.setState(
      update(this.state, {
        modal: {
          createEditShopAdminRole: {
            $set: !this.state.modal.createEditShopAdminRole
          }
        },
        editingShopAdminRole: { $set: product }
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
        Header: t('role title'),
        accessor: (d: any) => d.title,
        filterable: true
      },
      {
        id: 'permission',
        Header: t('permission'),
        sortable: false,
        accessor: (d: any) => d.permission.length
      },
      {
        id: 'is_shop_owner_role',
        Header: t('is shop owner role'),
        filterable: true,
        filterType: 'select',
        filterComponent: (props: any) => {
          return (
            <Select {...props}>
              <MenuItem value={''}>{t('all')}</MenuItem>
              <MenuItem value={'0'}>{t('no')}</MenuItem>
              <MenuItem value={1}>{t('yes')}</MenuItem>
            </Select>
          );
        },
        accessor: (d: any) => (d.is_shop_owner_role ? t('yes') : t('no'))
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
                'UPDATE_SHOP_ADMIN_ROLE'
              ) ||
                this.props.context.permission.includes(
                  'VIEW_SHOP_ADMIN_ROLE'
                )) && (
                <Tooltip title={t('edit')}>
                  <Fab
                    size="small"
                    variant="round"
                    color="primary"
                    onClick={() => {
                      this.toggleModalEditAdminRole(value);
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

    if (this.props.context.permission.includes('DELETE_SHOP_ADMIN_ROLE')) {
      actionList.push({
        title: t('delete'),
        confirmMessage: t(
          'delete show admin role will also delete related shop admin'
        ),
        component: (component: any) => {
          return (
            <Mutation
              key={'deleteShopAdminRoleMutation'}
              mutation={gql`
                mutation DeleteShopAdminRoleMutation(
                  $shop_id: String!
                  $shop_admin_role_ids: [String]!
                ) {
                  deleteShopAdminRoleMutation(
                    shop_id: $shop_id
                    shop_admin_role_ids: $shop_admin_role_ids
                  ) {
                    id
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t('{{count}} selected successfully delete', {
                    count: data.deleteShopAdminRoleMutation.length
                  })
                );
                this.updateTableKey();
              }}
            >
              {(deleteShopAdminRoleMutation, { data, loading, error }) => {
                return React.createElement(component, {
                  onClick: async (selectedData: any) => {
                    let ownerRoleCount = selectedData.filter(
                      (data: any) => data.is_shop_owner_role
                    ).length;
                    if (ownerRoleCount !== selectedData.length) {
                      await deleteShopAdminRoleMutation({
                        variables: {
                          shop_id: this.props.context.shop.id,
                          shop_admin_role_ids: selectedData.map(
                            (data: any) => data.id
                          )
                        }
                      });
                    }

                    if (ownerRoleCount) {
                      this.props.enqueueSnackbar(
                        t('you cant delete shop owner role')
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
          <React.Fragment>
            <SellerHelmet
              title={t('shop admin role')}
              description={''}
              keywords={t('shop admin role')}
              ogImage="/images/favicon-228.png"
            />

            <Paper className={classes.root} elevation={1}>
              <Grid container justify={'center'}>
                {context.permission.includes('CREATE_SHOP_ADMIN_ROLE') && (
                  <Grid container justify={'flex-end'}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={this.toggleModalCreateAdminRole.bind(this)}
                    >
                      <AddIcon />
                      {t('add admin role')}
                    </Button>
                  </Grid>
                )}

                <ModalCreateEditShopAdminRole
                  shopAdminRoleId={
                    this.state.editingShopAdminRole
                      ? this.state.editingShopAdminRole.id
                      : null
                  }
                  shopId={context.shop.id}
                  disabled={
                    !context.permission.includes('UPDATE_SHOP_ADMIN_ROLE')
                  }
                  toggle={this.toggleModalCreateAdminRole.bind(this)}
                  isOpen={this.state.modal.createEditShopAdminRole}
                  refetchData={this.updateTableKey.bind(this)}
                />

                <SellerReactTable
                  showCheckbox
                  showFilter
                  title={t('admin role')}
                  columns={columns}
                  query={shopAdminRoleQuery(
                    shopAdminRoleFragments.SellerAdminRole
                  )}
                  variables={{
                    shop_id: context.shop.id,
                    key: this.state.tableKey,
                    sort_is_shop_owner_role: 'desc'
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
  }
}))(withSnackbar(withTranslation()(withRouter(AdminRole))));
