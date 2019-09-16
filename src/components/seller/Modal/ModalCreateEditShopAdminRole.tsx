import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Modal from '../../_modal/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { Mutation, Query, withApollo, WithApolloClient } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import { AppContext } from '../../../contexts/seller/Context';
import { shopAdminRoleFragments } from '../../../graphql/fragment/query/ShopAdminRoleFragment';
import FormUtil from '../../../utils/FormUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';

let shopAdminRoleFields: any;
let t: any;

interface IProps {
  classes: any;
  shopAdminRoleId: string;
  shopId: string;
  disabled?: boolean;
  refetchData: any;
  toggle: () => void;
  isOpen: boolean;
}

interface IState {
  isCloseDialogOpen: boolean;
  dataLoaded: boolean;
  shopAdminRole: any;
}

class ModalCreateEditShopAdminRole extends React.Component<
  IProps &
    RouteComponentProps &
    WithTranslation &
    WithSnackbarProps &
    WithApolloClient<IProps>,
  IState
> {
  constructor(
    props: IProps &
      RouteComponentProps &
      WithTranslation &
      WithSnackbarProps &
      WithApolloClient<IProps>
  ) {
    super(props);

    t = this.props.t;

    shopAdminRoleFields = [
      {
        field: 'title',
        isCheckEmpty: true,
        emptyMessage: t('please enter title'),
        value: ''
      },
      {
        field: 'permission',
        value: new Set()
      },
      {
        field: 'is_shop_owner_role'
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      shopAdminRole: {
        ...FormUtil.generateFieldsState(shopAdminRoleFields)
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      this.props.shopAdminRoleId &&
      prevProps.shopAdminRoleId !== this.props.shopAdminRoleId
    ) {
      await this.setState(
        update(this.state, {
          dataLoaded: { $set: false }
        })
      );

      let { data } = await this.props.client.query({
        query: gql`
          query ShopAdminRole($id: ID) {
            shopAdminRole(id: $id) {
              items {
                id
                title
                permission
                is_shop_owner_role
              }
            }
          }
        `,
        variables: { id: this.props.shopAdminRoleId }
      });
      let isDisabled = this.props.disabled;

      let shopAdminRole = data.shopAdminRole.items[0];
      this.setState(
        update(this.state, {
          dataLoaded: { $set: true },
          shopAdminRole: {
            title: {
              value: { $set: shopAdminRole.title },
              disabled: { $set: isDisabled }
            },
            permission: {
              value: { $set: new Set(shopAdminRole.permission) },
              disabled: { $set: isDisabled }
            },
            is_shop_owner_role: {
              value: { $set: shopAdminRole.is_shop_owner_role }
            }
          }
        })
      );
    }
  }

  resetStateData() {
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopAdminRole: {
          ...FormUtil.generateResetFieldsState(shopAdminRoleFields)
        }
      })
    );
  }

  handleCancelCloseDialog() {
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
  }

  async handleOkCloseDialog() {
    await this.resetStateData();
    await this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
    await this.props.toggle();
  }

  toggleCloseDialog() {
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: true }
      })
    );
  }

  handlePermissionOnChange(value: string) {
    if (this.state.shopAdminRole.permission.value.has(value)) {
      this.state.shopAdminRole.permission.value.delete(value);
      this.setState(
        update(this.state, {
          shopAdminRole: {
            permission: {
              value: { $set: this.state.shopAdminRole.permission.value }
            }
          }
        })
      );
    } else {
      this.setState(
        update(this.state, {
          shopAdminRole: {
            permission: {
              value: {
                $set: this.state.shopAdminRole.permission.value.add(value)
              }
            }
          }
        })
      );
    }
  }

  async createShopAdminRoleCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully created', {
        title: this.state.shopAdminRole.title.value
      })
    );
    await this.handleOkCloseDialog();
    await this.props.refetchData();
  }

  async editShopAdminRoleCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully updated', {
        title: this.state.shopAdminRole.title.value
      })
    );
    await this.handleOkCloseDialog();
    //await this.props.refetchProduct();
  }

  async createShopAdminRoleErrorHandler(error: any) {
    await this.checkShopAdminRoleForm(error);
  }

  async editShopAdminRoleErrorHandler(error: any) {
    await this.checkShopAdminRoleForm(error);
  }

  async checkShopAdminRoleForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopAdminRoleFields,
      this.state.shopAdminRole
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopAdminRoleFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopAdminRole: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopAdminRole: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async createShopAdminRole(createShopAdminRoleMutation: any) {
    if (await this.checkShopAdminRoleForm()) {
      createShopAdminRoleMutation({
        variables: {
          shop_id: this.props.shopId,
          title: this.state.shopAdminRole.title.value,
          permission: this.state.shopAdminRole.permission.value
        }
      });
    }
  }

  async editShopAdminRole(editShopAdminRoleMutation: any) {
    if (await this.checkShopAdminRoleForm()) {
      editShopAdminRoleMutation({
        variables: {
          shop_id: this.props.shopId,
          shop_admin_role_id: this.props.shopAdminRoleId,
          title: this.state.shopAdminRole.title.value,
          permission: this.state.shopAdminRole.permission.value
        }
      });
    }
  }

  render() {
    const { classes, t } = this.props;

    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Dialog
              maxWidth="sm"
              open={this.state.isCloseDialogOpen}
              onClose={this.handleCancelCloseDialog.bind(this)}
            >
              <DialogTitle>
                {this.props.shopAdminRoleId
                  ? t('cancel edit admin role')
                  : t('cancel add admin role')}
              </DialogTitle>
              <DialogContent>
                {this.props.shopAdminRoleId
                  ? t('are you sure cancel edit admin role?')
                  : t('are you sure cancel add admin role?')}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleCancelCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={this.handleOkCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('ok')}
                </Button>
              </DialogActions>
            </Dialog>
            <Modal
              disableAutoFocus
              open={this.props.isOpen}
              onClose={() => {
                this.toggleCloseDialog();
              }}
              maxWidth={'md'}
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
                {this.state.dataLoaded ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        disabled={
                          !!this.state.shopAdminRole.is_shop_owner_role.value ||
                          this.state.shopAdminRole.title.disabled
                        }
                        required
                        error={!this.state.shopAdminRole.title.is_valid}
                        label={t('admin role title')}
                        placeholder={t('admin role title')}
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={this.state.shopAdminRole.title.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopAdminRole: {
                                title: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.shopAdminRole.title.feedback}
                        fullWidth
                        margin={'normal'}
                      />
                      {!!this.state.shopAdminRole.is_shop_owner_role.value && (
                        <Typography variant="overline" color={'primary'}>
                          {t(
                            'this is shop owner admin role, you can not modify this role'
                          )}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">{t('permission')}</Typography>
                      {!!this.state.shopAdminRole.is_shop_owner_role.value && (
                        <Typography
                          variant="overline"
                          color={'primary'}
                          paragraph
                        >
                          {t(
                            'this is shop owner admin role, you can not modify this role, this role will automatically have all permission'
                          )}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item container justify={'center'} xs={12}>
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
                                          variant={'rect'}
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
                                        {t('permission$$' + section)}
                                      </Typography>
                                      <Checkbox
                                        disabled={
                                          !!this.state.shopAdminRole
                                            .is_shop_owner_role.value ||
                                          this.state.shopAdminRole.permission
                                            .disabled
                                        }
                                        checked={
                                          new Set(
                                            Array.from(
                                              this.state.shopAdminRole
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
                                                this.state.shopAdminRole
                                                  .permission.value
                                              ),
                                              ...permission[section]
                                            ];
                                          } else {
                                            newPermissions = Array.from(
                                              this.state.shopAdminRole
                                                .permission.value
                                            ).filter(
                                              (sectionPermission: any) =>
                                                !permission[section].includes(
                                                  sectionPermission
                                                )
                                            );
                                          }

                                          this.setState(
                                            update(this.state, {
                                              shopAdminRole: {
                                                permission: {
                                                  value: {
                                                    $set: new Set(
                                                      newPermissions
                                                    )
                                                  }
                                                }
                                              }
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
                                                  !!this.state.shopAdminRole
                                                    .is_shop_owner_role.value ||
                                                  this.state.shopAdminRole
                                                    .permission.disabled
                                                }
                                                checked={this.state.shopAdminRole.permission.value.has(
                                                  sectionPermission
                                                )}
                                                onChange={this.handlePermissionOnChange.bind(
                                                  this,
                                                  sectionPermission
                                                )}
                                                value={sectionPermission}
                                                color="primary"
                                              />
                                            }
                                            label={t(
                                              'permission$$' + sectionPermission
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
                          onClick={this.toggleCloseDialog.bind(this)}
                          color="primary"
                        >
                          {t('cancel')}
                        </Button>
                      </Grid>

                      <Grid item>
                        {context.permission.includes(
                          'CREATE_SHOP_ADMIN_ROLE'
                        ) && (
                          <>
                            {!this.props.shopAdminRoleId && (
                              <Mutation
                                mutation={gql`
                                  mutation CreateShopAdminRoleMutation(
                                    $shop_id: String!
                                    $title: String!
                                    $permission: [String]!
                                  ) {
                                    createShopAdminRoleMutation(
                                      shop_id: $shop_id
                                      title: $title
                                      permission: $permission
                                    ) {
                                      ...fragment
                                    }
                                  }
                                  ${shopAdminRoleFragments.SellerAdminRole}
                                `}
                                onCompleted={data => {
                                  this.createShopAdminRoleCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.createShopAdminRoleErrorHandler.bind(
                                    this
                                  )(error);
                                }}
                              >
                                {(
                                  createShopAdminRoleMutation,
                                  { data, loading, error }
                                ) => {
                                  if (loading) {
                                    return (
                                      <Button
                                        disabled
                                        variant="contained"
                                        color="primary"
                                      >
                                        {t('creating...')}
                                      </Button>
                                    );
                                  }

                                  return (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={async () => {
                                        if (await this.checkShopAdminRoleForm())
                                          this.createShopAdminRole(
                                            createShopAdminRoleMutation
                                          );
                                      }}
                                    >
                                      {t('create shop admin role')}
                                    </Button>
                                  );
                                }}
                              </Mutation>
                            )}
                          </>
                        )}
                        {context.permission.includes(
                          'UPDATE_SHOP_ADMIN_ROLE'
                        ) && (
                          <>
                            {this.props.shopAdminRoleId &&
                              !this.state.shopAdminRole.is_shop_owner_role
                                .value && (
                                <Mutation
                                  mutation={gql`
                                    mutation EditShopAdminRoleMutation(
                                      $shop_id: String!
                                      $shop_admin_role_id: String!
                                      $title: String!
                                      $permission: [String]!
                                    ) {
                                      editShopAdminRoleMutation(
                                        shop_id: $shop_id
                                        shop_admin_role_id: $shop_admin_role_id
                                        title: $title
                                        permission: $permission
                                      ) {
                                        ...fragment
                                      }
                                    }
                                    ${shopAdminRoleFragments.SellerAdminRole}
                                  `}
                                  onCompleted={data => {
                                    this.editShopAdminRoleCompletedHandler.bind(
                                      this
                                    )(data);
                                  }}
                                  onError={error => {
                                    this.editShopAdminRoleErrorHandler.bind(
                                      this
                                    )(error);
                                  }}
                                >
                                  {(
                                    editShopAdminRoleMutation,
                                    { data, loading, error }
                                  ) => {
                                    if (loading) {
                                      return (
                                        <Button
                                          disabled
                                          variant="contained"
                                          color="primary"
                                        >
                                          {t('editing...')}
                                        </Button>
                                      );
                                    }

                                    return (
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={async () => {
                                          if (
                                            await this.checkShopAdminRoleForm()
                                          )
                                            this.editShopAdminRole(
                                              editShopAdminRoleMutation
                                            );
                                        }}
                                      >
                                        {t('edit shop admin role')}
                                      </Button>
                                    );
                                  }}
                                </Mutation>
                              )}
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
                          <Skeleton variant={'rect'} height={50} />
                        </Grid>
                      );
                    })}
                  </React.Fragment>
                )}
              </Grid>
            </Modal>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  contentContainer: {
    margin: 0
  },
  actionButtonContainer: {
    marginTop: theme.spacing(2)
  }
}))(
  withSnackbar(
    withTranslation()(withRouter(withApollo(ModalCreateEditShopAdminRole)))
  )
);
