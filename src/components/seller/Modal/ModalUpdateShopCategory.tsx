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
import ShopCategorySelect from '../../_select/ShopCategorySelect';
import FormHelperText from '@material-ui/core/FormHelperText';

let shopCategoryFields: any;
let t: any;

interface IProps {
  classes: any;
  shopId: string;
  disabled?: boolean;
  toggle: () => void;
  isOpen: boolean;
}

interface IState {
  isCloseDialogOpen: boolean;
  dataLoaded: boolean;
  shopCategory: any;
}

class ModalUpdateShopCategory extends React.Component<
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

    shopCategoryFields = [
      {
        field: 'shop_category_id',
        isCheckEmpty: true,
        emptyMessage: t('please select shop category'),
        value: ''
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      shopCategory: {
        ...FormUtil.generateFieldsState(shopCategoryFields)
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.isOpen === true && prevProps.isOpen !== this.props.isOpen) {
      await this.getShopCategory();
    }
  }

  async getShopCategory() {
    await this.setState(
      update(this.state, {
        dataLoaded: { $set: false }
      })
    );

    let { data } = await this.props.client.query({
      query: gql`
        query Shop($id: ID) {
          shop(id: $id) {
            items {
              id
              shop_category_id
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables: { id: this.props.shopId }
    });
    let isDisabled = this.props.disabled;

    let shop = data.shop.items[0];
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopCategory: {
          shop_category_id: {
            value: { $set: shop.shop_category_id },
            disabled: { $set: isDisabled }
          }
        }
      })
    );
  }

  resetStateData() {
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        shopCategory: {
          ...FormUtil.generateResetFieldsState(shopCategoryFields)
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

  async editShopCategoryCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(t('shop category successfully updated'));
    await this.handleOkCloseDialog();
  }

  async editShopCategoryErrorHandler(error: any) {
    await this.checkShopCategoryForm(error);
  }

  async checkShopCategoryForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopCategoryFields,
      this.state.shopCategory
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopCategoryFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopCategory: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopCategory: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async editShopCategory(editShopCategoryMutation: any) {
    if (await this.checkShopCategoryForm()) {
      editShopCategoryMutation({
        variables: {
          shop_id: this.props.shopId,
          shop_category_id: this.state.shopCategory.shop_category_id.value
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
              <DialogTitle>{t('cancel edit shop category')}</DialogTitle>
              <DialogContent>
                {t('are you sure cancel edit shop category?')}
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
                      <ShopCategorySelect
                        label={t('shop category')}
                        error={
                          !this.state.shopCategory.shop_category_id.is_valid
                        }
                        helperText={
                          this.state.shopCategory.shop_category_id.feedback
                        }
                        disabled={
                          this.state.shopCategory.shop_category_id.disabled
                        }
                        required
                        value={this.state.shopCategory.shop_category_id.value}
                        onChange={(value: unknown) => {
                          this.setState(
                            update(this.state, {
                              shopCategory: {
                                shop_category_id: { value: { $set: value } }
                              }
                            })
                          );
                        }}
                        fullWidth
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
                        {context.permission.includes('UPDATE_SHOP_SETTING') && (
                          <>
                            {this.props.shopId && (
                              <Mutation
                                mutation={gql`
                                  mutation UpdateShopCategoryMutation(
                                    $shop_id: String!
                                    $shop_category_id: String!
                                  ) {
                                    updateShopCategoryMutation(
                                      shop_id: $shop_id
                                      shop_category_id: $shop_category_id
                                    ) {
                                      id
                                      shop_category {
                                        id
                                      }
                                    }
                                  }
                                `}
                                onCompleted={data => {
                                  this.editShopCategoryCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.editShopCategoryErrorHandler.bind(this)(
                                    error
                                  );
                                }}
                              >
                                {(
                                  updateShopCategoryMutation,
                                  { data, loading, error }
                                ) => {
                                  if (loading) {
                                    return (
                                      <Button
                                        disabled
                                        variant="contained"
                                        color="primary"
                                      >
                                        {t('updating...')}
                                      </Button>
                                    );
                                  }

                                  return (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={async () => {
                                        if (await this.checkShopCategoryForm())
                                          this.editShopCategory(
                                            updateShopCategoryMutation
                                          );
                                      }}
                                    >
                                      {t('update shop category')}
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
    withTranslation()(withRouter(withApollo(ModalUpdateShopCategory)))
  )
);
