import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Modal from '../../_modal/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles/index';
import update from 'immutability-helper';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import {
  ApolloConsumer,
  Mutation,
  withApollo,
  WithApolloClient
} from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import { AppContext } from '../../../contexts/seller/Context';
import FormUtil from '../../../utils/FormUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import FormHelperText from '@material-ui/core/FormHelperText';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import UserAvatar from '../../../components/UserAvatar';
import ShopAdminRoleSelect from '../../_select/ShopAdminRoleSelect';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { shopAdminFragments } from '../../../graphql/fragment/query/ShopAdminFragment';

let shopAdminFields: any;
let t: any;

interface IProps {
  classes: any;
  shopAdminId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData: any;
  toggle: () => void;
  isOpen: boolean;
}

interface IState {
  isCloseDialogOpen: boolean;
  dataLoaded: boolean;
  shopAdmin: any;
  searchInputData: any;
}

class ModalCreateEditShopAdmin extends React.Component<
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

    shopAdminFields = [
      'shop_admin_role_title',
      'is_shop_owner_role',
      'selectedShopAdminRole',
      {
        field: 'user',
        value: null
      },
      {
        field: 'username',
        isCheckEmpty: true,
        emptyMessage: t('please enter username and select user'),
        value: '',
        validationField: 'user_id'
      },
      {
        field: 'shop_admin_role_id',
        isCheckEmpty: true,
        emptyMessage: t('please select shop admin role'),
        value: ''
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      shopAdmin: {
        ...FormUtil.generateFieldsState(shopAdminFields)
      },
      searchInputData: {
        suggestionSearch: []
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      this.props.shopAdminId &&
      prevProps.shopAdminId !== this.props.shopAdminId
    ) {
      await this.setState(
        update(this.state, {
          dataLoaded: { $set: false }
        })
      );

      let { data } = await this.props.client.query({
        query: gql`
          query ShopAdmin($id: ID) {
            shopAdmin(id: $id) {
              items {
                shop_id
                user_id
                user {
                  id
                  username
                }
                shop_admin_role_id
                shop_admin_role {
                  id
                  title
                  is_shop_owner_role
                  permission
                }
              }
            }
          }
        `,
        variables: { id: this.props.shopAdminId }
      });
      let isDisabled = this.props.disabled;

      let shopAdmin = data.shopAdmin.items[0];
      this.setState(
        update(this.state, {
          dataLoaded: { $set: true },
          shopAdmin: {
            shop_admin_role_title: {
              value: { $set: shopAdmin.shop_admin_role.title },
              disabled: { $set: isDisabled }
            },
            is_shop_owner_role: {
              value: { $set: shopAdmin.shop_admin_role.is_shop_owner_role },
              disabled: { $set: isDisabled }
            },
            username: {
              value: { $set: shopAdmin.user.username },
              disabled: { $set: isDisabled }
            },
            user: {
              value: { $set: shopAdmin.user },
              disabled: { $set: isDisabled }
            },
            shop_admin_role_id: {
              value: { $set: shopAdmin.shop_admin_role_id },
              disabled: { $set: isDisabled }
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
        shopAdmin: {
          ...FormUtil.generateResetFieldsState(shopAdminFields)
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

  async createShopAdminCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully created', {
        title: this.state.shopAdmin.username.value
      })
    );
    await this.handleOkCloseDialog();
    await this.props.refetchData();
  }

  async editShopAdminCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully updated', {
        title: this.state.shopAdmin.username.value
      })
    );
    await this.handleOkCloseDialog();
  }

  async createShopAdminErrorHandler(error: any) {
    await this.checkShopAdminForm(error);
  }

  async editShopAdminErrorHandler(error: any) {
    await this.checkShopAdminForm(error);
  }

  async checkShopAdminForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopAdminFields,
      this.state.shopAdmin
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopAdminFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopAdmin: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopAdmin: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async createShopAdmin(createShopAdminMutation: any) {
    if (await this.checkShopAdminForm()) {
      createShopAdminMutation({
        variables: {
          shop_id: this.props.shopId,
          user_id: this.state.shopAdmin.user.value.id,
          shop_admin_role_id: this.state.shopAdmin.shop_admin_role_id.value
        }
      });
    }
  }

  async editShopAdmin(editShopAdminMutation: any) {
    if (await this.checkShopAdminForm()) {
      editShopAdminMutation({
        variables: {
          shop_admin_id: this.props.shopAdminId,
          shop_id: this.props.shopId,
          user_id: this.state.shopAdmin.user.value.id,
          shop_admin_role_id: this.state.shopAdmin.shop_admin_role_id.value
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
                {this.props.shopAdminId
                  ? t('cancel edit admin')
                  : t('cancel add admin')}
              </DialogTitle>
              <DialogContent>
                {this.props.shopAdminId
                  ? t('are you sure cancel edit admin?')
                  : t('are you sure cancel add admin?')}
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
                      <ApolloConsumer>
                        {client => (
                          <Autosuggest
                            theme={{
                              suggestionsList: classes.suggestionsList,
                              suggestion: classes.suggestion
                            }}
                            suggestions={
                              this.state.searchInputData.suggestionSearch
                            }
                            renderInputComponent={(inputProps: any) => {
                              const {
                                classes,
                                inputRef = () => {},
                                ref,
                                ...other
                              } = inputProps;

                              return (
                                <>
                                  <TextField
                                    fullWidth
                                    InputProps={{
                                      inputRef: (node: any) => {
                                        ref(node);
                                        inputRef(node);
                                      },
                                      classes: {
                                        input: classes.input
                                      }
                                    }}
                                    {...other}
                                  />
                                  <FormHelperText>
                                    {t('username of user')}
                                  </FormHelperText>
                                </>
                              );
                            }}
                            onSuggestionsFetchRequested={({ value }: any) => {
                              client
                                .query({
                                  query: gql`
                                    query User(
                                      $where_like_username: String
                                      $limit: Int!
                                    ) {
                                      user(
                                        where_like_username: $where_like_username
                                        limit: $limit
                                      ) {
                                        items {
                                          id
                                          username
                                          name
                                          user_info {
                                            id
                                            gender
                                            avatar
                                          }
                                        }
                                      }
                                    }
                                  `,
                                  variables: {
                                    limit: 10,
                                    where_like_username: value
                                  }
                                })
                                .then((data: any) => {
                                  this.setState(
                                    update(this.state, {
                                      searchInputData: {
                                        suggestionSearch: {
                                          $set: data.data.user.items
                                        }
                                      }
                                    })
                                  );
                                });
                            }}
                            onSuggestionsClearRequested={() => {
                              // this.setState(update(this.state, {
                              //     searchInputData: {
                              //         suggestionSearch: {$set: []}
                              //     }
                              // }));
                            }}
                            inputProps={{
                              disabled:
                                !!this.state.shopAdmin.is_shop_owner_role
                                  .value ||
                                this.state.shopAdmin.username.disabled,
                              error: !this.state.shopAdmin.username.is_valid,
                              helperText: this.state.shopAdmin.username
                                .feedback,
                              classes,
                              placeholder: t(
                                'please enter username and select user'
                              ),
                              label: t('username'),
                              value: this.state.shopAdmin.username.value,
                              onChange: (e: any) => {
                                this.setState(
                                  update(this.state, {
                                    shopAdmin: {
                                      username: {
                                        value: { $set: e.target.value }
                                      },
                                      user: { value: { $set: null } }
                                    }
                                  })
                                );
                              },
                              onBlur: (e: any) => {
                                if (!this.state.shopAdmin.user.value) {
                                  this.setState(
                                    update(this.state, {
                                      shopAdmin: {
                                        username: { value: { $set: '' } }
                                      }
                                    })
                                  );
                                }
                              },
                              InputLabelProps: {
                                shrink: true
                              }
                            }}
                            getSuggestionValue={suggestion => suggestion}
                            renderSuggestion={(
                              suggestion,
                              { query, isHighlighted }
                            ) => {
                              const matches = match(suggestion.username, query);
                              const parts = parse(suggestion.username, matches);

                              return (
                                <MenuItem
                                  selected={isHighlighted}
                                  component="div"
                                >
                                  <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                      <UserAvatar user={suggestion} />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={suggestion.name}
                                      secondary={
                                        <>
                                          {parts.map(
                                            (part: any, index: number) =>
                                              part.highlight ? (
                                                <span
                                                  key={String(index)}
                                                  style={{ fontWeight: 500 }}
                                                >
                                                  {part.text}
                                                </span>
                                              ) : (
                                                <strong
                                                  key={String(index)}
                                                  style={{ fontWeight: 300 }}
                                                >
                                                  {part.text}
                                                </strong>
                                              )
                                          )}
                                        </>
                                      }
                                    />
                                  </ListItem>
                                </MenuItem>
                              );
                            }}
                            renderSuggestionsContainer={options => (
                              <Paper {...options.containerProps} square>
                                {options.children}
                              </Paper>
                            )}
                            onSuggestionSelected={(
                              event,
                              {
                                suggestion,
                                suggestionValue,
                                suggestionIndex,
                                sectionIndex,
                                method
                              }
                            ) => {
                              this.setState(
                                update(this.state, {
                                  shopAdmin: {
                                    username: {
                                      value: { $set: suggestion.username }
                                    },
                                    user: { value: { $set: suggestion } }
                                  }
                                })
                              );
                            }}
                          />
                        )}
                      </ApolloConsumer>
                      {!!this.state.shopAdmin.is_shop_owner_role.value && (
                        <Typography variant="overline" color={'primary'}>
                          {t(
                            'this is shop owner admin, you can not modify this shop admin'
                          )}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      {!!this.state.shopAdmin.is_shop_owner_role.value ? (
                        <>
                          <TextField
                            required
                            disabled
                            label={t('shop admin role')}
                            value={
                              this.state.shopAdmin.shop_admin_role_title.value
                            }
                            fullWidth
                          />
                          <Typography variant="overline" color={'primary'}>
                            {t(
                              'this is shop owner admin, you can not modify this shop admin'
                            )}
                          </Typography>
                        </>
                      ) : (
                        <ShopAdminRoleSelect
                          fullWidth
                          margin="normal"
                          label={t('shop admin role')}
                          error={
                            !this.state.shopAdmin.shop_admin_role_id.is_valid
                          }
                          helperText={
                            this.state.shopAdmin.shop_admin_role_id.feedback
                          }
                          disabled={
                            !!this.state.shopAdmin.is_shop_owner_role.value ||
                            this.state.shopAdmin.shop_admin_role_id.disabled
                          }
                          required
                          value={this.state.shopAdmin.shop_admin_role_id.value}
                          onChange={(
                            value: unknown,
                            selectedShopAdminRole: any
                          ) => {
                            this.setState(
                              update(this.state, {
                                shopAdmin: {
                                  shop_admin_role_id: {
                                    value: { $set: value }
                                  },
                                  selectedShopAdminRole: {
                                    value: { $set: selectedShopAdminRole }
                                  }
                                }
                              })
                            );
                          }}
                          variables={{
                            shop_id: context.shop.id,
                            is_shop_owner_role: 0
                          }}
                        />
                      )}
                    </Grid>
                    <Grid container item xs={12}>
                      {this.state.shopAdmin.selectedShopAdminRole.value &&
                        this.state.shopAdmin.selectedShopAdminRole.value
                          .permission && (
                          <>
                            <Grid item xs={12}>
                              <Typography variant="h6">
                                {t('permission')}
                              </Typography>
                            </Grid>
                            {this.state.shopAdmin.selectedShopAdminRole.value.permission.map(
                              (permission: string) => (
                                <Grid
                                  item
                                  xs={6}
                                  sm={4}
                                  md={3}
                                  key={permission}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={true}
                                        checked={true}
                                        value={permission}
                                        color="primary"
                                      />
                                    }
                                    label={t('permission$$' + permission)}
                                  />
                                </Grid>
                              )
                            )}
                          </>
                        )}
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
                        {!this.state.shopAdmin.is_shop_owner_role.value && (
                          <>
                            {context.permission.includes(
                              'CREATE_SHOP_ADMIN'
                            ) && (
                              <>
                                {!this.props.shopAdminId && (
                                  <Mutation
                                    mutation={gql`
                                      mutation CreateShopAdminMutation(
                                        $shop_id: String!
                                        $user_id: String!
                                        $shop_admin_role_id: String!
                                      ) {
                                        createShopAdminMutation(
                                          shop_id: $shop_id
                                          user_id: $user_id
                                          shop_admin_role_id: $shop_admin_role_id
                                        ) {
                                          ...fragment
                                        }
                                      }
                                      ${shopAdminFragments.ModalCreateEditShopAdmin}
                                    `}
                                    onCompleted={data => {
                                      this.createShopAdminCompletedHandler.bind(
                                        this
                                      )(data);
                                    }}
                                    onError={error => {
                                      this.createShopAdminErrorHandler.bind(
                                        this
                                      )(error);
                                    }}
                                  >
                                    {(
                                      createShopAdminMutation,
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
                                            if (await this.checkShopAdminForm())
                                              this.createShopAdmin(
                                                createShopAdminMutation
                                              );
                                          }}
                                        >
                                          {t('create shop admin')}
                                        </Button>
                                      );
                                    }}
                                  </Mutation>
                                )}
                              </>
                            )}
                            {context.permission.includes(
                              'UPDATE_SHOP_ADMIN'
                            ) && (
                              <>
                                {this.props.shopAdminId && (
                                  <Mutation
                                    mutation={gql`
                                      mutation EditShopAdminMutation(
                                        $shop_id: String!
                                        $shop_admin_id: String!
                                        $user_id: String!
                                        $shop_admin_role_id: String!
                                      ) {
                                        editShopAdminMutation(
                                          shop_id: $shop_id
                                          shop_admin_id: $shop_admin_id
                                          user_id: $user_id
                                          shop_admin_role_id: $shop_admin_role_id
                                        ) {
                                          ...fragment
                                        }
                                      }
                                      ${shopAdminFragments.ModalCreateEditShopAdmin}
                                    `}
                                    onCompleted={data => {
                                      this.editShopAdminCompletedHandler.bind(
                                        this
                                      )(data);
                                    }}
                                    onError={error => {
                                      this.editShopAdminErrorHandler.bind(this)(
                                        error
                                      );
                                    }}
                                  >
                                    {(
                                      editShopAdminMutation,
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
                                            if (await this.checkShopAdminForm())
                                              this.editShopAdmin(
                                                editShopAdminMutation
                                              );
                                          }}
                                        >
                                          {t('edit shop admin')}
                                        </Button>
                                      );
                                    }}
                                  </Mutation>
                                )}
                              </>
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
  actionButtonContainer: {
    marginTop: theme.spacing(2)
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  contentContainer: {
    margin: 0
  }
}))(
  withSnackbar(
    withTranslation()(withRouter(withApollo(ModalCreateEditShopAdmin)))
  )
);
