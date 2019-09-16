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
import { Mutation, withApollo, WithApolloClient } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import { AppContext } from '../../../contexts/Context';
import FormUtil from '../../../utils/FormUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import TextField from '@material-ui/core/TextField';
import { shopProductCategoryFragments } from '../../../graphql/fragment/query/ShopProductCategoryFragment';

let shopProductCategoryFields: any;
let t: any;

interface IProps {
  classes: any;
  shopProductCategoryId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData?: () => void;
  toggle: () => void;
  isOpen: boolean;
}

interface IState {
  isCloseDialogOpen: boolean;
  dataLoaded: boolean;
  shopProductCategory: any;
}

class ModalCreateEditShopProductCategory extends React.Component<
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

    shopProductCategoryFields = [
      {
        field: 'title',
        isCheckEmpty: true,
        emptyMessage: t('please enter title'),
        value: ''
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      shopProductCategory: {
        ...FormUtil.generateFieldsState(shopProductCategoryFields)
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      this.props.shopProductCategoryId &&
      prevProps.shopProductCategoryId !== this.props.shopProductCategoryId
    ) {
      await this.setState(
        update(this.state, {
          dataLoaded: { $set: false }
        })
      );

      let { data } = await this.props.client.query({
        query: gql`
          query ShopProductCategory($id: ID) {
            shopProductCategory(id: $id) {
              items {
                id
                title
              }
            }
          }
        `,
        variables: { id: this.props.shopProductCategoryId }
      });
      let isDisabled = this.props.disabled;

      let shopProductCategory = data.shopProductCategory.items[0];
      this.setState(
        update(this.state, {
          dataLoaded: { $set: true },
          shopProductCategory: {
            title: {
              value: { $set: shopProductCategory.title },
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
        shopProductCategory: {
          ...FormUtil.generateResetFieldsState(shopProductCategoryFields)
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

  async createShopProductCategoryCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully created', {
        title: this.state.shopProductCategory.title.value
      })
    );
    await this.handleOkCloseDialog();
    if (this.props.refetchData) await this.props.refetchData();
  }

  async editShopProductCategoryCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully updated', {
        title: this.state.shopProductCategory.title.value
      })
    );
    await this.handleOkCloseDialog();
  }

  async createShopProductCategoryErrorHandler(error: any) {
    await this.checkShopProductCategoryForm(error);
  }

  async editShopProductCategoryErrorHandler(error: any) {
    await this.checkShopProductCategoryForm(error);
  }

  async checkShopProductCategoryForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopProductCategoryFields,
      this.state.shopProductCategory
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopProductCategoryFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopProductCategory: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopProductCategory: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async createShopProductCategory(createShopProductCategoryMutation: any) {
    if (await this.checkShopProductCategoryForm()) {
      createShopProductCategoryMutation({
        variables: {
          shop_id: this.props.shopId,
          title: this.state.shopProductCategory.title.value
        }
      });
    }
  }

  async editShopProductCategory(editShopProductCategoryMutation: any) {
    if (await this.checkShopProductCategoryForm()) {
      editShopProductCategoryMutation({
        variables: {
          shop_product_category_id: this.props.shopProductCategoryId,
          shop_id: this.props.shopId,
          title: this.state.shopProductCategory.title.value
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
                {this.props.shopProductCategoryId
                  ? t('cancel edit shop product category')
                  : t('cancel add shop product category')}
              </DialogTitle>
              <DialogContent>
                {this.props.shopProductCategoryId
                  ? t('are you sure cancel edit shop product category?')
                  : t('are you sure cancel add shop product category?')}
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
              maxWidth={'sm'}
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
                        disabled={this.state.shopProductCategory.title.disabled}
                        required
                        error={!this.state.shopProductCategory.title.is_valid}
                        label={t('shop product category title')}
                        value={this.state.shopProductCategory.title.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              shopProductCategory: {
                                title: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={
                          this.state.shopProductCategory.title.feedback
                        }
                        fullWidth
                        margin={'normal'}
                      />
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
                          'CREATE_SHOP_PRODUCT_CATEGORY'
                        ) && (
                          <>
                            {!this.props.shopProductCategoryId && (
                              <Mutation
                                mutation={gql`
                                  mutation CreateShopProductCategoryMutation(
                                    $shop_id: String!
                                    $title: String!
                                  ) {
                                    createShopProductCategoryMutation(
                                      shop_id: $shop_id
                                      title: $title
                                    ) {
                                      ...fragment
                                    }
                                  }
                                  ${shopProductCategoryFragments.ModalCreateEditShopProductCategory}
                                `}
                                onCompleted={data => {
                                  this.createShopProductCategoryCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.createShopProductCategoryErrorHandler.bind(
                                    this
                                  )(error);
                                }}
                              >
                                {(
                                  createShopProductCategoryMutation,
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
                                        if (
                                          await this.checkShopProductCategoryForm()
                                        )
                                          this.createShopProductCategory(
                                            createShopProductCategoryMutation
                                          );
                                      }}
                                    >
                                      {t('create shop product category')}
                                    </Button>
                                  );
                                }}
                              </Mutation>
                            )}
                          </>
                        )}
                        {context.permission.includes(
                          'UPDATE_SHOP_PRODUCT_CATEGORY'
                        ) && (
                          <>
                            {this.props.shopProductCategoryId && (
                              <Mutation
                                mutation={gql`
                                  mutation EditShopProductCategoryMutation(
                                    $shop_id: String!
                                    $shop_product_category_id: String!
                                    $title: String!
                                  ) {
                                    editShopProductCategoryMutation(
                                      shop_id: $shop_id
                                      shop_product_category_id: $shop_product_category_id
                                      title: $title
                                    ) {
                                      ...fragment
                                    }
                                  }
                                  ${shopProductCategoryFragments.ModalCreateEditShopProductCategory}
                                `}
                                onCompleted={data => {
                                  this.editShopProductCategoryCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.editShopProductCategoryErrorHandler.bind(
                                    this
                                  )(error);
                                }}
                              >
                                {(
                                  editShopProductCategoryMutation,
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
                                          await this.checkShopProductCategoryForm()
                                        )
                                          this.editShopProductCategory(
                                            editShopProductCategoryMutation
                                          );
                                      }}
                                    >
                                      {t('edit shop product category')}
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
    withTranslation()(
      withRouter(withApollo(ModalCreateEditShopProductCategory))
    )
  )
);
