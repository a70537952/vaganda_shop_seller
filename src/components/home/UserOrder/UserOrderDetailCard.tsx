import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import ShopLogo from '../../ShopLogo';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import ShopName from '../../ShopName';
import Address from '../../Address';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import { WithTranslation, withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Image from '../../Image';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import USER_ORDER_DETAIL from '../../../constant/USER_ORDER_DETAIL';
import LocaleMoment from '../../LocaleMoment';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { AppContext } from '../../../contexts/home/Context';
import CircularProgress from '@material-ui/core/CircularProgress';
import update from 'immutability-helper';
import ModalAddUserOrderDetailComment from '../Modal/ModalAddUserOrderDetailComment';
import ImagesCarousel from '../../ImagesCarousel';
import StarRating from '../../_rating/StarRating';
import DefaultImage from '../../../image/default-image.jpg';

interface IProps extends StyledComponentProps {
  userOrderDetail?: any;
  className?: string;
  loading?: boolean;
  classes: any;
}

interface IState {
  lightbox: {
    isOpen: boolean;
    imgSrc: string;
    currentIndex: number;
  };
  modal: {
    addUserOrderDetailComment: boolean;
  };
}

class UserOrderDetailCard extends React.Component<
  IProps & WithSnackbarProps & WithTranslation,
  IState
> {
  constructor(props: IProps & WithTranslation & WithSnackbarProps) {
    super(props);
    this.state = {
      lightbox: {
        isOpen: false,
        imgSrc: '',
        currentIndex: 0
      },
      modal: {
        addUserOrderDetailComment: false
      }
    };
  }

  toggleModalAddUserOrderDetailComment() {
    this.setState(
      update(this.state, {
        modal: {
          addUserOrderDetailComment: {
            $set: !this.state.modal.addUserOrderDetailComment
          }
        }
      })
    );
  }

  render() {
    let { classes, className, userOrderDetail, loading, t } = this.props;

    let productImageUrl: string =
      userOrderDetail &&
      userOrderDetail.product &&
      userOrderDetail.product.product_image.length
        ? userOrderDetail.product.product_image[0].image_medium
        : DefaultImage;

    return (
      <AppContext.Consumer>
        {context => (
          <Paper className={classes.card} elevation={1}>
            <Grid container spacing={2}>
              {loading ? (
                <Grid item xs={12}>
                  <Skeleton variant={'rect'} height={70} width={400} />
                </Grid>
              ) : (
                <Grid
                  className={classes.header}
                  spacing={1}
                  container
                  item
                  xs={12}
                  alignItems={'center'}
                  justify="space-between"
                >
                  <Grid container item alignItems={'center'} xs={8}>
                    <ShopLogo
                      shop={userOrderDetail.shop}
                      className={classes.shopLogo}
                      imageSize={'logo_small'}
                    />
                    &nbsp;
                    <ShopName
                      shop={userOrderDetail.shop}
                      variant="subtitle1"
                      display="inline"
                      color={'inherit'}
                      className={classes.shopName}
                    />
                  </Grid>
                  <Grid container item xs={4} justify={'flex-end'}>
                    <Typography
                      variant="subtitle1"
                      display="inline"
                      component={'span'}
                      color={'primary'}
                    >
                      {t(
                        'global$$orderDetailStatus::' +
                          userOrderDetail.order_detail_status
                      )}
                    </Typography>
                  </Grid>
                  <Grid container item alignItems={'center'} xs={12}>
                    <Grid item>
                      <LocalShippingOutlinedIcon fontSize={'small'} />
                      &nbsp;
                    </Grid>
                    <Grid item xs={11}>
                      <Address
                        variant="subtitle1"
                        color={'inherit'}
                        component={'span'}
                        display="inline"
                        address={userOrderDetail.order_address}
                        className={classes.address}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {loading ? (
                <Grid item xs={12}>
                  <Skeleton variant={'rect'} height={100} width={500} />
                </Grid>
              ) : (
                <Grid container item xs={12}>
                  <Grid container item spacing={1} xs={8} md={10}>
                    <Grid item>
                      <Image
                        className={classes.productImage}
                        alt={userOrderDetail.product_title}
                        useLazyLoad
                        src={productImageUrl}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" display="inline">
                        {userOrderDetail.product_title}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('variation')}: {userOrderDetail.product_type_title}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('quantity')}: {userOrderDetail.product_quantity}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={4}
                    md={2}
                    justify={'flex-end'}
                    alignItems={'center'}
                  >
                    <Typography variant="subtitle1" display="inline">
                      {userOrderDetail.product_unit_price_currency}{' '}
                      {userOrderDetail.product_total_price}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {loading ? (
                <Grid container item justify={'flex-end'} xs={12}>
                  <Skeleton height={37} width={300} />
                </Grid>
              ) : (
                <Grid
                  container
                  item
                  xs={12}
                  justify={'flex-end'}
                  alignItems={'center'}
                >
                  <Typography variant="subtitle1" display="inline">
                    {t('order_total')}:&nbsp;
                  </Typography>
                  <Typography variant="h5" color={'primary'} display="inline">
                    {userOrderDetail.product_unit_price_currency}{' '}
                    {userOrderDetail.product_total_price}
                  </Typography>
                </Grid>
              )}
              {loading ? (
                <Grid item xs={12}>
                  <Skeleton variant={'rect'} height={20} />
                </Grid>
              ) : (
                <Grid container item xs={12} justify={'space-between'}>
                  {userOrderDetail.order_detail_status ===
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED && (
                    <>
                      <Grid item>
                        <Tooltip
                          title={t(
                            'if you do not confirm to receive the products. after this date, will assume you have received the product.'
                          )}
                          placement="bottom"
                        >
                          <Typography variant="subtitle1">
                            {t('received product by')}&nbsp;
                            <LocaleMoment showAll>
                              {userOrderDetail.auto_received_at}
                            </LocaleMoment>
                          </Typography>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Mutation
                          mutation={gql`
                            mutation UpdateUserOrderDetailStatusMutation(
                              $userOrderDetailIds: [String]!
                              $order_detail_status: String!
                            ) {
                              updateUserOrderDetailStatusMutation(
                                userOrderDetailIds: $userOrderDetailIds
                                order_detail_status: $order_detail_status
                              ) {
                                id
                                order_detail_status
                                received_at
                              }
                            }
                          `}
                          onCompleted={data => {
                            this.props.enqueueSnackbar(
                              t(
                                'you have confirm received your product {{title}}',
                                {
                                  title: `${userOrderDetail.product_title} (${userOrderDetail.product_type_title})`
                                }
                              )
                            );
                          }}
                        >
                          {(
                            updateUserOrderDetailStatusMutation,
                            { data, loading, error }
                          ) => {
                            if (loading) {
                              return (
                                <Button variant="contained" color="primary">
                                  <CircularProgress
                                    size={20}
                                    color={'inherit'}
                                  />
                                </Button>
                              );
                            }
                            return (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  updateUserOrderDetailStatusMutation({
                                    variables: {
                                      userOrderDetailIds: [userOrderDetail.id],
                                      order_detail_status:
                                        USER_ORDER_DETAIL.ORDER_DETAIL_STATUS
                                          .RECEIVED
                                    }
                                  });
                                }}
                              >
                                {t('product received')}
                              </Button>
                            );
                          }}
                        </Mutation>
                      </Grid>
                    </>
                  )}
                  {userOrderDetail.order_detail_status ===
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.RECEIVED && (
                    <>
                      <Grid item>
                        <Typography variant="subtitle1">
                          {t('received product by')}&nbsp;
                          <LocaleMoment showAll>
                            {userOrderDetail.received_at}
                          </LocaleMoment>
                        </Typography>
                      </Grid>
                      {userOrderDetail.is_commented === 0 && (
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.toggleModalAddUserOrderDetailComment.bind(
                              this
                            )}
                          >
                            {t('rate product')}
                          </Button>
                          <ModalAddUserOrderDetailComment
                            userOrderDetailId={userOrderDetail.id}
                            toggle={this.toggleModalAddUserOrderDetailComment.bind(
                              this
                            )}
                            isOpen={this.state.modal.addUserOrderDetailComment}
                          />
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              )}

              {userOrderDetail &&
                userOrderDetail.order_detail_status ===
                  USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.RECEIVED &&
                userOrderDetail.is_commented === 1 &&
                userOrderDetail.order_detail_comment && (
                  <Grid container item spacing={1}>
                    <Grid container item xs={12} alignItems={'center'}>
                      <Typography variant="subtitle1" display="inline">
                        {t('your comment')}&nbsp;
                      </Typography>
                      <StarRating
                        size={'medium'}
                        value={userOrderDetail.order_detail_comment.star}
                        readOnly
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        {userOrderDetail.order_detail_comment.comment}
                      </Typography>
                    </Grid>
                    {Boolean(
                      userOrderDetail.order_detail_comment
                        .user_order_detail_comment_image.length
                    ) && (
                      <Grid container item xs={12} spacing={1}>
                        <ImagesCarousel
                          currentIndex={this.state.lightbox.currentIndex}
                          onClose={() => {
                            this.setState(
                              update(this.state, {
                                lightbox: {
                                  isOpen: { $set: !this.state.lightbox.isOpen }
                                }
                              })
                            );
                          }}
                          views={userOrderDetail.order_detail_comment.user_order_detail_comment_image.map(
                            (commentImage: any) => ({
                              src: commentImage.image_original
                            })
                          )}
                          isOpen={this.state.lightbox.isOpen}
                        />
                        {userOrderDetail.order_detail_comment.user_order_detail_comment_image.map(
                          (commentImage: any, index: number) => (
                            <Grid key={commentImage.id} item>
                              <Image
                                src={commentImage.image_medium}
                                useLazyLoad
                                style={{ height: '65px' }}
                                alt={userOrderDetail.product_type_title}
                                onClick={() => {
                                  this.setState(
                                    update(this.state, {
                                      lightbox: {
                                        isOpen: {
                                          $set: !this.state.lightbox.isOpen
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
                )}
            </Grid>
          </Paper>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  card: {
    padding: theme.spacing(2),
    width: '100%',
    position: 'relative'
  },
  header: {
    borderBottom: '1px solid #eaeaea',
    paddingBottom: theme.spacing(2)
  },
  shopLogo: {},
  shopName: {
    fontWeight: 'bold'
  },
  address: {},
  productImage: {
    height: '100px',
    width: '140px'
  }
}))(withSnackbar(withTranslation()(UserOrderDetailCard)));
