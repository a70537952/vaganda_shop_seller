import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { withStyles } from "@material-ui/core/styles/index";
import update from "immutability-helper";
import { withSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { Mutation, withApollo, WithApolloClient } from "react-apollo";
import { withRouter } from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import FormUtil from "../../../utils/FormUtil";
import { WithTranslation, withTranslation } from "react-i18next";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import TextField from "@material-ui/core/TextField";
import UserOrderDetailStatusSelect from "../../_select/UserOrderDetailStatusSelect";
import FormHelperText from "@material-ui/core/FormHelperText";
import PRODUCT from "../../../constant/PRODUCT";
import Typography from "@material-ui/core/Typography";
import USER_ORDER_DETAIL from "../../../constant/USER_ORDER_DETAIL";
import ImagesCarousel from "../../ImagesCarousel";
import Image from "../../Image";
import StarRating from "../../_rating/StarRating";
import { userOrderDetailFragments } from "../../../graphql/fragment/query/UserOrderDetailFragment";

let orderDetailFields: any;
let t: any;

interface IProps {
  classes: any;
  orderDetailId: string;
  shopId: string;
  disabled?: boolean;
  refetchData?: () => void;
  toggle: () => void;
  isOpen: boolean;
}

interface IState {
  isCloseDialogOpen: boolean;
  dataLoaded: boolean;
  userOrderDetail: any;
  lightbox: {
    isOpen: boolean;
    imgSrc: string;
    currentIndex: number;
  };
}

class ModalUpdateUserOrderDetail extends React.Component<
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

    orderDetailFields = [
      {
        field: 'order_detail_status',
        isCheckEmpty: true,
        emptyMessage: t('please select order detail status'),
        value: ''
      },
      {
        field: 'product_shipping_track_number',
        value: ''
      },
      {
        field: 'remark',
        value: ''
      }
    ];
    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: true,
      userOrderDetail: {
        raw: {},
        ...FormUtil.generateFieldsState(orderDetailFields)
      },
      lightbox: {
        isOpen: false,
        imgSrc: '',
        currentIndex: 0
      }
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      this.props.orderDetailId &&
      prevProps.orderDetailId !== this.props.orderDetailId
    ) {
      await this.setState(
        update(this.state, {
          dataLoaded: { $set: false }
        })
      );

      let { data } = await this.props.client.query({
        query: gql`
          query UserOrderDetail($id: ID) {
            userOrderDetail(id: $id) {
              items {
                id
                order_id
                user_id
                shop_id
                product_id
                shop_name
                product_title
                product_type_title
                product_quantity
                product_cost_currency
                product_cost

                product_discount_unit
                product_discount
                product_unit_price_currency
                product_unit_price
                product_discount_amount
                product_discounted_price
                product_final_price

                product_total_price
                product_paid_unit_price_currency
                product_paid_unit_price
                product_paid_total_price

                product_shipping_title

                product_shipping_currency
                product_shipping_fee
                product_shipping_country
                product_total_shipping_fee
                product_paid_shipping_currency
                product_paid_shipping_fee
                product_paid_total_shipping_fee

                order_detail_status
                product_shipping_track_number
                message
                remark
                is_commented
                order_detail_comment {
                  id
                  comment
                  star
                  user_order_detail_comment_image {
                    id
                    path
                    image_medium
                    image_original
                  }
                }

                created_at
                updated_at
              }
            }
          }
        `,
        variables: { id: this.props.orderDetailId }
      });
      let isDisabled = this.props.disabled;

      let userOrderDetail = data.userOrderDetail.items[0];
      this.setState(
        update(this.state, {
          dataLoaded: { $set: true },
          userOrderDetail: {
            raw: { $set: userOrderDetail },
            order_detail_status: {
              value: { $set: userOrderDetail.order_detail_status },
              disabled: { $set: isDisabled }
            },
            product_shipping_track_number: {
              value: { $set: userOrderDetail.product_shipping_track_number },
              disabled: { $set: isDisabled }
            },
            remark: {
              value: { $set: userOrderDetail.remark },
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
        userOrderDetail: {
          raw: {},
          ...FormUtil.generateResetFieldsState(orderDetailFields)
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

  async updateUserOrderDetailCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('order ID {{id}} successfully updated', {
        id: this.props.orderDetailId
      })
    );
    await this.handleOkCloseDialog();
  }

  async updateUserOrderDetailErrorHandler(error: any) {
    await this.checkUserOrderDetailForm(error);
  }

  async checkUserOrderDetailForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      orderDetailFields,
      this.state.userOrderDetail
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(orderDetailFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        userOrderDetail: {
          ...emptyErrorStateObj
        }
      })
    );

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          userOrderDetail: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    return isValid;
  }

  async updateUserOrderDetail(updateUserOrderDetailMutation: any) {
    if (await this.checkUserOrderDetailForm()) {
      updateUserOrderDetailMutation({
        variables: {
          user_order_detail_id: this.props.orderDetailId,
          shop_id: this.props.shopId,
          order_detail_status: this.state.userOrderDetail.order_detail_status
            .value,
          product_shipping_track_number: this.state.userOrderDetail
            .product_shipping_track_number.value,
          remark: this.state.userOrderDetail.remark.value
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
              <DialogTitle>{t('cancel update order detail')}</DialogTitle>
              <DialogContent>
                {t('are you sure cancel update order detail?')}
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
                spacing={2}
                className={classes.contentContainer}
              >
                {this.state.dataLoaded ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('order detail id')}
                        value={this.state.userOrderDetail.raw.order_id}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <UserOrderDetailStatusSelect
                        fullWidth
                        label={t('order detail status')}
                        error={
                          !this.state.userOrderDetail.order_detail_status
                            .is_valid
                        }
                        helperText={
                          this.state.userOrderDetail.order_detail_status
                            .feedback
                        }
                        required
                        value={
                          this.state.userOrderDetail.order_detail_status.value
                        }
                        onChange={(value: unknown) => {
                          this.setState(
                            update(this.state, {
                              userOrderDetail: {
                                order_detail_status: { value: { $set: value } }
                              }
                            })
                          );
                        }}
                        only={[
                          USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                          USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                        ]}
                        disabled={
                          this.state.userOrderDetail.order_detail_status
                            .disabled ||
                          ![
                            USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                            USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                          ].includes(
                            this.state.userOrderDetail.order_detail_status.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="inherit">
                        {t('product info')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('product title')}
                        value={this.state.userOrderDetail.raw.product_title}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('product type')}
                        value={
                          this.state.userOrderDetail.raw.product_type_title
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('quantity')}
                        value={this.state.userOrderDetail.raw.product_quantity}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="inherit">
                        {t('price info')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('product cost')}
                        value={
                          this.state.userOrderDetail.raw.product_cost_currency +
                          ' ' +
                          this.state.userOrderDetail.raw.product_cost
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('product unit price')}
                        value={
                          this.state.userOrderDetail.raw
                            .product_unit_price_currency +
                          ' ' +
                          this.state.userOrderDetail.raw.product_unit_price
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('product discount')}
                        value={
                          this.state.userOrderDetail.raw
                            .product_discount_unit ===
                          PRODUCT.DISCOUNT_UNIT.PERCENTAGE
                            ? this.state.userOrderDetail.raw.product_discount +
                              '%'
                            : this.state.userOrderDetail.raw
                                .product_unit_price_currency +
                              ' ' +
                              this.state.userOrderDetail.raw.product_discount
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('product final price')}
                        value={
                          this.state.userOrderDetail.raw
                            .product_unit_price_currency +
                          ' ' +
                          this.state.userOrderDetail.raw.product_final_price
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={
                          t('product total price') +
                          `(${t('final price X quantity')})`
                        }
                        value={
                          this.state.userOrderDetail.raw
                            .product_unit_price_currency +
                          ' ' +
                          this.state.userOrderDetail.raw.product_total_price
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="inherit">
                        {t('shipping info')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('shipping')}
                        value={
                          this.state.userOrderDetail.raw.product_shipping_title
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('shipping country')}
                        value={
                          t(
                            'global$$countryKey::' +
                              this.state.userOrderDetail.raw
                                .product_shipping_country
                          ) as string
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={t('shipping fee')}
                        value={
                          this.state.userOrderDetail.raw
                            .product_shipping_currency +
                          ' ' +
                          this.state.userOrderDetail.raw.product_shipping_fee
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        label={
                          t('total shipping fee') +
                          `(${t('shipping fee X quantity')})`
                        }
                        value={
                          this.state.userOrderDetail.raw
                            .product_shipping_currency +
                          ' ' +
                          this.state.userOrderDetail.raw
                            .product_total_shipping_fee
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        disabled={
                          this.state.userOrderDetail
                            .product_shipping_track_number.disabled
                        }
                        error={
                          !this.state.userOrderDetail
                            .product_shipping_track_number.is_valid
                        }
                        label={t('shipping track number')}
                        value={
                          this.state.userOrderDetail
                            .product_shipping_track_number.value
                        }
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              userOrderDetail: {
                                product_shipping_track_number: {
                                  value: { $set: e.target.value }
                                }
                              }
                            })
                          );
                        }}
                        helperText={
                          this.state.userOrderDetail
                            .product_shipping_track_number.feedback
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="inherit">
                        {t('other info')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        disabled
                        label={t('message from buyer')}
                        value={this.state.userOrderDetail.raw.message}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        disabled={this.state.userOrderDetail.remark.disabled}
                        error={!this.state.userOrderDetail.remark.is_valid}
                        label={t('remark')}
                        value={this.state.userOrderDetail.remark.value}
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              userOrderDetail: {
                                remark: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={this.state.userOrderDetail.remark.feedback}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <FormHelperText error={false}>
                        {t(
                          'remark will only show to admin and will not show to public'
                        )}
                      </FormHelperText>
                    </Grid>
                    {Boolean(this.state.userOrderDetail.raw.is_commented) && (
                      <>
                        <Grid container item xs={12} alignItems={'center'}>
                          <Typography
                            variant="subtitle2"
                            color="inherit"
                            display="inline"
                          >
                            {t('buyer comment')}&nbsp;
                          </Typography>
                          <StarRating
                            size={'small'}
                            value={
                              this.state.userOrderDetail.raw
                                .order_detail_comment.star
                            }
                            readOnly
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label={t('comment')}
                            disabled
                            value={
                              this.state.userOrderDetail.raw
                                .order_detail_comment.comment
                            }
                            fullWidth
                            multiline
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {Boolean(
                            this.state.userOrderDetail.raw.order_detail_comment
                              .user_order_detail_comment_image.length
                          ) && (
                            <Grid container item xs={12} spacing={1}>
                              <ImagesCarousel
                                currentIndex={this.state.lightbox.currentIndex}
                                onClose={() => {
                                  this.setState(
                                    update(this.state, {
                                      lightbox: {
                                        isOpen: {
                                          $set: !this.state.lightbox.isOpen
                                        }
                                      }
                                    })
                                  );
                                }}
                                views={this.state.userOrderDetail.raw.order_detail_comment.user_order_detail_comment_image.map(
                                  (commentImage: any) => ({
                                    src: commentImage.image_original
                                  })
                                )}
                                isOpen={this.state.lightbox.isOpen}
                              />
                              {this.state.userOrderDetail.raw.order_detail_comment.user_order_detail_comment_image.map(
                                (commentImage: any, index: number) => (
                                  <Grid key={commentImage.id} item>
                                    <Image
                                      src={commentImage.image_medium}
                                      style={{ height: '65px' }}
                                      alt={
                                        this.state.userOrderDetail.raw
                                          .product_title
                                      }
                                      onClick={() => {
                                        this.setState(
                                          update(this.state, {
                                            lightbox: {
                                              isOpen: {
                                                $set: !this.state.lightbox
                                                  .isOpen
                                              },
                                              currentIndex: { $set: index }
                                            }
                                          })
                                        );
                                      }}
                                      className={'img pointer'}
                                    />
                                  </Grid>
                                )
                              )}
                            </Grid>
                          )}
                        </Grid>
                      </>
                    )}

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
                          'UPDATE_SHOP_USER_ORDER_DETAIL'
                        ) && (
                          <>
                            {this.props.orderDetailId && (
                              <Mutation
                                mutation={gql`
                                  mutation UpdateUserOrderDetailMutation(
                                    $user_order_detail_id: String!
                                    $shop_id: String
                                    $order_detail_status: String
                                    $product_shipping_track_number: String
                                    $remark: String
                                  ) {
                                    updateUserOrderDetailMutation(
                                      user_order_detail_id: $user_order_detail_id
                                      shop_id: $shop_id
                                      order_detail_status: $order_detail_status
                                      product_shipping_track_number: $product_shipping_track_number
                                      remark: $remark
                                    ) {
                                      ...fragment
                                    }
                                  }
                                  ${userOrderDetailFragments.ModalUpdateUserOrderDetail}
                                `}
                                onCompleted={data => {
                                  this.updateUserOrderDetailCompletedHandler.bind(
                                    this
                                  )(data);
                                }}
                                onError={error => {
                                  this.updateUserOrderDetailErrorHandler.bind(
                                    this
                                  )(error);
                                }}
                              >
                                {(
                                  updateUserOrderDetailMutation,
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
                                          await this.checkUserOrderDetailForm()
                                        )
                                          this.updateUserOrderDetail(
                                            updateUserOrderDetailMutation
                                          );
                                      }}
                                    >
                                      {t('update user order detail')}
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
    withTranslation()(withRouter(withApollo(ModalUpdateUserOrderDetail)))
  )
);
