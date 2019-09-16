import React from 'react';
import HomeHelmet from '../../components/home/HomeHelmet';
import { AppContext } from '../../contexts/home/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { Mutation, Query } from 'react-apollo';
import ProductNotFound from '../../components/home/Product/ProductNotFound';
import Paper from '@material-ui/core/Paper';
import ReactImageMagnify from 'react-image-magnify';
import NukaCarousel from '../../components/NukaCarousel';
import Typography from '@material-ui/core/Typography';
import PRODUCT from '../../constant/PRODUCT';
import Button from '@material-ui/core/Button';
import ButtonImage from '../../components/ButtonImage';
import InputQuantity from '../../components/_input/InputQuantity';
import Tooltip from '@material-ui/core/Tooltip';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ProductList from '../../components/home/Product/ProductList';
import HelpIcon from '@material-ui/icons/Help';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Skeleton from '@material-ui/lab/Skeleton';
import ModalLoginRegister from '../../components/home/Modal/ModalLoginRegister';
import update from 'immutability-helper';
import { homePath } from '../../utils/RouteUtil';
import queryString from 'query-string';
import Image from '../../components/Image';
import UserOrderDetailCommentList from '../../components/home/UserOrderDetailComment/UserOrderDetailCommentList';
import ShopCard from '../../components/home/Shop/ShopCard';
import ShopStatistics from '../../components/home/Shop/ShopStatistics';

let t: any;

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  modal: {
    loginRegister: boolean;
  };
  productId: string;
  selectedImage: any;
  selectedProductType: any;
  quantity: number;
}

class Product extends React.Component<
  IProps & WithSnackbarProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(
    props: IProps & WithSnackbarProps & RouteComponentProps & WithTranslation
  ) {
    super(props);

    t = this.props.t;

    this.state = {
      modal: {
        loginRegister: false
      },
      productId: '',
      selectedImage: null,
      selectedProductType: null,
      quantity: 1
    };
  }

  toggleModalLoginRegister() {
    this.setState(
      update(this.state, {
        modal: {
          loginRegister: { $set: !this.state.modal.loginRegister }
        }
      })
    );
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.match.params.productId !== state.productId) {
      let newState = state;
      newState.productId = props.match.params.productId;
      newState.selectedImage = null;
      newState.selectedProductType = null;
      newState.quantity = 1;

      return newState;
    }
    return null;
  }

  renderPrice(productTypes: any[]) {
    let { classes } = this.props;

    let sortProductType = productTypes.sort(
      (a: any, b: any) => a.final_price - b.final_price
    );
    let productType = sortProductType[0];
    let priceString = productType.currency + ' ' + productType.final_price;
    let isMultipleProductType = !!sortProductType[1];
    if (
      isMultipleProductType &&
      productType.final_price !==
        sortProductType[sortProductType.length - 1].final_price
    ) {
      // multiple product type
      priceString +=
        ' ~ ' +
        sortProductType[sortProductType.length - 1].currency +
        ' ' +
        sortProductType[sortProductType.length - 1].final_price;
      return (
        <Typography variant="h5" color="primary">
          {priceString}
        </Typography>
      );
    } else {
      if (productType.discount_amount > 0) {
        // has discount
        return (
          <>
            <Typography
              variant="subtitle1"
              display="inline"
              style={{ textDecoration: 'line-through', color: '#929292' }}
            >
              {productType.currency + ' ' + productType.price}
            </Typography>
            &nbsp;&nbsp;&nbsp;
            <Typography variant="h4" display="inline" color="primary">
              {priceString}
            </Typography>
            &nbsp;
            {productType.discount_unit === PRODUCT.DISCOUNT_UNIT.PERCENTAGE && (
              <Typography
                variant="body2"
                className={classes.discountPercentage}
              >
                {productType.discount}% {t('OFFER')}
              </Typography>
            )}
            {productType.discount_unit === PRODUCT.DISCOUNT_UNIT.PRICE && (
              <Typography
                variant="body2"
                className={classes.discountPercentage}
              >
                {productType.currency} {productType.discount_amount}{' '}
                {t('OFFER')}
              </Typography>
            )}
          </>
        );
      } else {
        return (
          <Typography variant="h5" color="primary">
            {priceString}
          </Typography>
        );
      }
    }
  }

  addProductTypeToUserCartCompletedHandler(data: any) {
    this.props.enqueueSnackbar(t('product successfully added to cart'));
  }

  addProductTypeToUserCartErrorHandler(error: any) {
    this.props.enqueueSnackbar(
      t('something went wrong. please refresh the page and try again.'),
      {
        variant: 'error'
      }
    );
  }

  addProductTypeToUserCart(addProductTypeToUserCartMutation: any) {
    if (this.props.context.user) {
      if (!this.state.selectedProductType) {
        this.props.enqueueSnackbar(t('please select product variation'));
      } else if (this.state.quantity <= 0) {
        this.props.enqueueSnackbar(t('please enter valid quantity'));
      } else {
        addProductTypeToUserCartMutation({
          variables: {
            product_type_id: this.state.selectedProductType.id,
            quantity: this.state.quantity
          }
        });
      }
    } else {
      this.toggleModalLoginRegister();
    }
  }

  onClickSelectProductType(product: any, productType: any) {
    let isSelected =
      this.state.selectedProductType &&
      this.state.selectedProductType.id === productType.id;
    let isOutOfStock = productType.quantity <= 0;

    let updateState: any = {};

    if (isSelected) {
      if (productType.product_type_image.length > 0) {
        updateState.selectedImage = product.product_image[0];
      }

      updateState.selectedProductType = null;
      updateState.quantity = 1;
    } else {
      if (productType.product_type_image.length > 0) {
        updateState.selectedImage = productType.product_type_image[0];
      }

      if (!isOutOfStock) {
        updateState.selectedProductType = productType;
        updateState.quantity = 1;
      }
    }

    this.setState(updateState);
  }

  render() {
    let { t, classes } = this.props;

    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <ModalLoginRegister
              toggle={this.toggleModalLoginRegister.bind(this)}
              isOpen={this.state.modal.loginRegister}
            />
            <Grid container item className={classes.root}>
              <Query
                query={gql`
                  query Product($id: ID) {
                    product(id: $id) {
                      items {
                        id
                        shop_id
                        title
                        product_category_id
                        description
                        extra_option {
                          key
                          value
                        }
                        width
                        width_unit
                        height
                        height_unit
                        length
                        length_unit
                        weight
                        weight_unit
                        is_publish
                        created_at
                        product_rating
                        one_star_comment_count
                        two_star_comment_count
                        three_star_comment_count
                        four_star_comment_count
                        five_star_comment_count

                        product_image {
                          id
                          product_id
                          path
                          image_small
                          image_medium
                          image_large
                          image_original
                          image_extra
                        }

                        product_category {
                          id
                          title
                        }

                        product_type {
                          id
                          product_id
                          title
                          quantity
                          cost
                          cost_currency
                          price
                          currency
                          discount
                          discount_unit
                          discounted_price
                          final_price
                          discount_amount
                          product_type_image {
                            id
                            product_type_id
                            path
                            image_small
                            image_medium
                            image_large
                            image_extra
                            image_original
                          }
                        }

                        shop {
                          id
                          name
                          product_count
                          created_at
                          shop_info {
                            id
                            logo
                            logo_medium
                            banner
                            banner_large
                          }
                          shop_setting {
                            id
                            title
                            value
                          }
                        }

                        shop_product_category_product {
                          id
                          shop_product_category_id
                          shop_product_category {
                            id
                            title
                          }
                        }
                      }
                    }
                  }
                `}
                variables={{
                  id: this.state.productId
                }}
                onCompleted={data => {
                  if (data.product.items.length) {
                    this.setState({
                      selectedImage: data.product.items[0].product_image[0]
                    });
                  }
                }}
                fetchPolicy="network-only"
              >
                {({ loading, error, data, fetchMore }) => {
                  if (error) return <>Error!</>;
                  if (!loading && !data.product.items.length) {
                    return <ProductNotFound />;
                  }

                  let product = loading ? null : data.product.items[0];
                  setTimeout(() => {
                    dispatchEvent(new Event('resize'));
                  }, 1500);

                  return (
                    <>
                      {!loading && (
                        <HomeHelmet
                          title={product.title}
                          description={product.description}
                          keywords={product.title}
                          ogImage={product.product_image[0].image_medium}
                        />
                      )}
                      <Grid container spacing={3}>
                        {!loading && !product.is_publish && (
                          <Grid container item xs={12}>
                            <Paper
                              square
                              className={classes.paperProductStatus}
                            >
                              <Grid
                                container
                                item
                                spacing={1}
                                xs={12}
                                alignItems="center"
                              >
                                <Typography
                                  variant="subtitle1"
                                  style={{ color: 'white' }}
                                >
                                  {t('this product is unpublished product')}
                                </Typography>
                                &nbsp;
                                <Tooltip
                                  title={t(
                                    'only shop admin with view product permission can view this product'
                                  )}
                                  placement="right"
                                >
                                  <HelpIcon
                                    style={{ color: '#fff' }}
                                    fontSize="small"
                                  />
                                </Tooltip>
                              </Grid>
                            </Paper>
                          </Grid>
                        )}
                        <Grid container item xs={12}>
                          <Paper square className={classes.paperContainer}>
                            <Grid container item spacing={1} xs={12}>
                              <Grid container item xs={12} md={6} lg={5}>
                                {loading ? (
                                  <Skeleton
                                    variant={'rect'}
                                    height={540}
                                    width={'100%'}
                                  />
                                ) : (
                                  <>
                                    <Grid
                                      container
                                      item
                                      alignItems="center"
                                      justify="center"
                                      className={classes.selectedImageContainer}
                                      style={{ backgroundColor: '#000' }}
                                    >
                                      <ReactImageMagnify
                                        {...{
                                          smallImage: {
                                            alt: product.title,
                                            isFluidWidth: true,
                                            src: this.state.selectedImage
                                              ? this.state.selectedImage
                                                  .image_extra
                                              : ''
                                          },
                                          largeImage: {
                                            alt: product.title,
                                            width: 1200,
                                            height: 1200,
                                            src: this.state.selectedImage
                                              ? this.state.selectedImage
                                                  .image_original
                                              : ''
                                          }
                                        }}
                                        enlargedImagePosition={'over'}
                                      />
                                    </Grid>
                                    <NukaCarousel
                                      slidesToShow={5}
                                      heightMode="first"
                                    >
                                      {product.product_image.map(
                                        (image: any, index: number) => (
                                          <Image
                                            useLazyLoad
                                            className={
                                              classes.productCarouselImage
                                            }
                                            key={image.id}
                                            src={image.image_small}
                                            onClick={() => {
                                              this.setState({
                                                selectedImage: image
                                              });
                                            }}
                                          />
                                        )
                                      )}
                                    </NukaCarousel>
                                  </>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6} lg={7}>
                                <Grid item xs={12}>
                                  {loading ? (
                                    <Skeleton height={50} width={300} />
                                  ) : (
                                    <Typography variant="h5" gutterBottom>
                                      {product.title}
                                    </Typography>
                                  )}
                                </Grid>
                                <Grid item xs={12}>
                                  <Paper
                                    square
                                    className={classes.paperProductPrice}
                                    elevation={0}
                                  >
                                    {loading ? (
                                      <Skeleton height={45} width={380} />
                                    ) : (
                                      <Grid container alignItems="center">
                                        {this.state.selectedProductType
                                          ? this.renderPrice([
                                              this.state.selectedProductType
                                            ])
                                          : this.renderPrice(
                                              product.product_type
                                            )}
                                      </Grid>
                                    )}
                                  </Paper>
                                </Grid>
                                <Grid
                                  container
                                  item
                                  xs={12}
                                  spacing={4}
                                  className={classes.containerProductOrder}
                                >
                                  {loading ? (
                                    <Grid
                                      container
                                      item
                                      xs={12}
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Skeleton height={60} width={320} />
                                    </Grid>
                                  ) : (
                                    <Grid
                                      container
                                      item
                                      xs={12}
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Grid
                                        container
                                        item
                                        xs={12}
                                        sm={2}
                                        md={3}
                                        lg={2}
                                      >
                                        <Typography variant="subtitle1">
                                          {t('variation')}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        container
                                        item
                                        xs={12}
                                        sm={10}
                                        md={9}
                                        lg={10}
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        {product.product_type.map(
                                          (productType: any) => {
                                            let isSelected =
                                              this.state.selectedProductType &&
                                              this.state.selectedProductType
                                                .id === productType.id;
                                            let isOutOfStock =
                                              productType.quantity <= 0;
                                            return (
                                              <Grid item key={productType.id}>
                                                <Tooltip
                                                  placement="top"
                                                  title={
                                                    isOutOfStock
                                                      ? t('out of stock')
                                                      : productType.title
                                                  }
                                                >
                                                  <div>
                                                    {!isOutOfStock &&
                                                    productType
                                                      .product_type_image
                                                      .length > 0 ? (
                                                      <ButtonImage
                                                        isSelected={isSelected}
                                                        onClick={this.onClickSelectProductType.bind(
                                                          this,
                                                          product,
                                                          productType
                                                        )}
                                                        image={
                                                          productType
                                                            .product_type_image[0]
                                                        }
                                                        width={'80px'}
                                                        height={'45px'}
                                                      />
                                                    ) : (
                                                      <Button
                                                        color={
                                                          isSelected
                                                            ? 'primary'
                                                            : 'default'
                                                        }
                                                        variant={
                                                          isSelected
                                                            ? 'contained'
                                                            : 'outlined'
                                                        }
                                                        size="large"
                                                        disabled={isOutOfStock}
                                                        onClick={this.onClickSelectProductType.bind(
                                                          this,
                                                          product,
                                                          productType
                                                        )}
                                                      >
                                                        {productType.title}
                                                      </Button>
                                                    )}
                                                  </div>
                                                </Tooltip>
                                              </Grid>
                                            );
                                          }
                                        )}
                                      </Grid>
                                    </Grid>
                                  )}
                                  {loading ? (
                                    <Grid
                                      container
                                      item
                                      xs={12}
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Skeleton height={55} width={380} />
                                    </Grid>
                                  ) : (
                                    <Grid
                                      container
                                      item
                                      xs={12}
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Grid
                                        container
                                        item
                                        xs={12}
                                        sm={2}
                                        md={3}
                                        lg={2}
                                      >
                                        <Typography variant="subtitle1">
                                          {t('quantity')}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        container
                                        item
                                        xs={12}
                                        sm={10}
                                        md={9}
                                        lg={10}
                                        spacing={2}
                                        alignItems="center"
                                      >
                                        <Grid item>
                                          <InputQuantity
                                            value={this.state.quantity}
                                            onChange={value => {
                                              this.setState({
                                                quantity: value
                                              });
                                            }}
                                            min={1}
                                            step={1}
                                            max={
                                              this.state.selectedProductType
                                                ? this.state.selectedProductType
                                                    .quantity
                                                : undefined
                                            }
                                          />
                                        </Grid>

                                        {this.state.selectedProductType && (
                                          <Grid item>
                                            <Typography
                                              variant="subtitle1"
                                              style={{
                                                textTransform: 'lowercase',
                                                color: '#888'
                                              }}
                                            >
                                              {
                                                this.state.selectedProductType
                                                  .quantity
                                              }{' '}
                                              {t('piece available')}
                                            </Typography>
                                          </Grid>
                                        )}
                                      </Grid>
                                    </Grid>
                                  )}
                                  {loading ? (
                                    <Grid
                                      container
                                      item
                                      xs={12}
                                      lg={8}
                                      spacing={2}
                                    >
                                      <Skeleton
                                        variant={'rect'}
                                        height={85}
                                        width={430}
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid
                                      container
                                      item
                                      xs={12}
                                      lg={8}
                                      alignItems={'center'}
                                      spacing={2}
                                    >
                                      <Grid item xs={6}>
                                        <Mutation
                                          mutation={gql`
                                            mutation AddProductTypeToUserCartMutation(
                                              $product_type_id: Int!
                                              $quantity: Int!
                                            ) {
                                              addProductTypeToUserCartMutation(
                                                product_type_id: $product_type_id
                                                quantity: $quantity
                                              ) {
                                                id
                                                user_id
                                                product_type_id
                                              }
                                            }
                                          `}
                                          onCompleted={data => {
                                            this.addProductTypeToUserCartCompletedHandler.bind(
                                              this
                                            )(data);
                                          }}
                                          onError={error => {
                                            this.addProductTypeToUserCartErrorHandler.bind(
                                              this
                                            )(error);
                                          }}
                                        >
                                          {(
                                            addProductTypeToUserCartMutation,
                                            { data, loading, error }
                                          ) => {
                                            if (loading) {
                                              return (
                                                <Button
                                                  size="large"
                                                  variant="outlined"
                                                  color="primary"
                                                  fullWidth
                                                  className={
                                                    classes.buttonAddToCartBuyNow
                                                  }
                                                >
                                                  <CircularProgress size={20} />
                                                </Button>
                                              );
                                            }

                                            return (
                                              <Button
                                                size="large"
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                className={
                                                  classes.buttonAddToCartBuyNow
                                                }
                                                onClick={() => {
                                                  this.addProductTypeToUserCart(
                                                    addProductTypeToUserCartMutation
                                                  );
                                                }}
                                              >
                                                <AddShoppingCartIcon fontSize="small" />
                                                &nbsp;
                                                {t('add to cart')}
                                              </Button>
                                            );
                                          }}
                                        </Mutation>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Mutation
                                          mutation={gql`
                                            mutation AddProductTypeToUserCartMutation(
                                              $product_type_id: Int!
                                              $quantity: Int!
                                            ) {
                                              addProductTypeToUserCartMutation(
                                                product_type_id: $product_type_id
                                                quantity: $quantity
                                              ) {
                                                id
                                                user_id
                                                product_type_id
                                              }
                                            }
                                          `}
                                          onCompleted={data => {
                                            this.addProductTypeToUserCartCompletedHandler.bind(
                                              this
                                            )(data);
                                            this.props.history.push({
                                              pathname: homePath('userCart'),
                                              search:
                                                '?' +
                                                queryString.stringify({
                                                  cartID:
                                                    data
                                                      .addProductTypeToUserCartMutation
                                                      .id
                                                })
                                            });
                                          }}
                                          onError={error => {
                                            this.addProductTypeToUserCartErrorHandler.bind(
                                              this
                                            )(error);
                                          }}
                                        >
                                          {(
                                            addProductTypeToUserCartMutation,
                                            { data, loading, error }
                                          ) => {
                                            if (loading) {
                                              return (
                                                <Button
                                                  size="large"
                                                  variant="contained"
                                                  color="primary"
                                                  fullWidth
                                                  className={
                                                    classes.buttonAddToCartBuyNow
                                                  }
                                                >
                                                  <CircularProgress
                                                    size={20}
                                                    color={'inherit'}
                                                  />
                                                </Button>
                                              );
                                            }

                                            return (
                                              <Button
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                className={
                                                  classes.buttonAddToCartBuyNow
                                                }
                                                onClick={() => {
                                                  this.addProductTypeToUserCart(
                                                    addProductTypeToUserCartMutation
                                                  );
                                                }}
                                              >
                                                {t('buy now')}
                                              </Button>
                                            );
                                          }}
                                        </Mutation>
                                      </Grid>
                                    </Grid>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        {!loading && (
                          <>
                            <Grid container item xs={12} spacing={1}>
                              <Grid container item xs={12} md={4}>
                                <ShopCard shop={product.shop} />
                              </Grid>
                              <Grid container item xs={12} md={8}>
                                <ShopStatistics shop={product.shop} />
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Paper square className={classes.paperContainer}>
                                <Grid container item xs={12}>
                                  <Paper
                                    square
                                    className={classes.paperTitle}
                                    elevation={0}
                                  >
                                    <Grid container alignItems="center">
                                      <Typography
                                        variant="h6"
                                        style={{ textTransform: 'capitalize' }}
                                      >
                                        {t('product specifications')}
                                      </Typography>
                                    </Grid>
                                  </Paper>
                                </Grid>
                                <Grid
                                  container
                                  item
                                  xs={12}
                                  spacing={2}
                                  className={
                                    classes.containerProductExtraOption
                                  }
                                >
                                  <Grid
                                    container
                                    item
                                    xs={12}
                                    sm={6}
                                    spacing={2}
                                  >
                                    <Grid container item xs={4} md={2}>
                                      <Typography variant="body1">
                                        {t('length')}
                                      </Typography>
                                    </Grid>
                                    <Grid container item xs={8} md={10}>
                                      <Typography
                                        variant="body1"
                                        className={
                                          classes.containerProductExtraOptionValue
                                        }
                                      >
                                        {product.length} {product.length_unit}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    item
                                    xs={12}
                                    sm={6}
                                    spacing={2}
                                  >
                                    <Grid container item xs={4} md={2}>
                                      <Typography variant="body1">
                                        {t('width')}
                                      </Typography>
                                    </Grid>
                                    <Grid container item xs={8} md={10}>
                                      <Typography
                                        variant="body1"
                                        className={
                                          classes.containerProductExtraOptionValue
                                        }
                                      >
                                        {product.width} {product.width_unit}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    item
                                    xs={12}
                                    sm={6}
                                    spacing={2}
                                  >
                                    <Grid container item xs={4} md={2}>
                                      <Typography variant="body1">
                                        {t('height')}
                                      </Typography>
                                    </Grid>
                                    <Grid container item xs={8} md={10}>
                                      <Typography
                                        variant="body1"
                                        className={
                                          classes.containerProductExtraOptionValue
                                        }
                                      >
                                        {product.height} {product.height_unit}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  {product.extra_option.map(
                                    (option: any, index: number) => (
                                      <Grid
                                        container
                                        item
                                        xs={12}
                                        md={6}
                                        key={index}
                                        spacing={2}
                                      >
                                        <Grid container item xs={4} md={2}>
                                          <Typography variant="body1">
                                            {option.key}
                                          </Typography>
                                        </Grid>
                                        <Grid container item xs={8} md={10}>
                                          <Typography
                                            variant="body1"
                                            className={
                                              classes.containerProductExtraOptionValue
                                            }
                                          >
                                            {option.value}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    )
                                  )}
                                </Grid>
                                <Grid container item xs={12}>
                                  <Paper
                                    square
                                    className={classes.paperTitle}
                                    elevation={0}
                                  >
                                    <Grid container alignItems="center">
                                      <Typography
                                        variant="h6"
                                        style={{ textTransform: 'capitalize' }}
                                      >
                                        {t('product description')}
                                      </Typography>
                                    </Grid>
                                  </Paper>
                                </Grid>
                                <Grid
                                  container
                                  item
                                  xs={12}
                                  className={
                                    classes.containerProductDescription
                                  }
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: product.description
                                    }}
                                  />
                                </Grid>
                              </Paper>
                            </Grid>
                            <Grid item xs={12}>
                              <Paper square className={classes.paperContainer}>
                                <Grid container spacing={1}>
                                  <Grid container item xs={12}>
                                    <Paper
                                      square
                                      className={classes.paperTitle}
                                      elevation={0}
                                    >
                                      <Grid container alignItems="center">
                                        <Typography
                                          variant="h6"
                                          style={{
                                            textTransform: 'capitalize'
                                          }}
                                        >
                                          {t('product comment')}
                                        </Typography>
                                      </Grid>
                                    </Paper>
                                  </Grid>
                                  <Grid container item xs={12}>
                                    <UserOrderDetailCommentList
                                      variables={{
                                        product_id: product.id,
                                        sort_created_at: 'desc'
                                      }}
                                      gridProps={{
                                        xs: 12,
                                        sm: 12,
                                        md: 12,
                                        lg: 12
                                      }}
                                      product_rating={product.product_rating}
                                      one_star_comment_count={
                                        product.one_star_comment_count
                                      }
                                      two_star_comment_count={
                                        product.two_star_comment_count
                                      }
                                      three_star_comment_count={
                                        product.three_star_comment_count
                                      }
                                      four_star_comment_count={
                                        product.four_star_comment_count
                                      }
                                      five_star_comment_count={
                                        product.five_star_comment_count
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Grid>
                            <Grid container item xs={12} spacing={1}>
                              <Grid container alignItems="center">
                                <Typography
                                  variant="h6"
                                  style={{ textTransform: 'capitalize' }}
                                >
                                  {t('product from the same shop')}
                                </Typography>
                              </Grid>
                              <ProductList
                                variables={{
                                  shop_id: product.shop_id,
                                  limit: 6,
                                  sort_created_at: 'desc',
                                  where_not_id: product.id
                                }}
                                gridProps={{
                                  xs: 12,
                                  sm: 6,
                                  md: 4,
                                  lg: 2
                                }}
                                hideSort
                                disableLoadMore
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </>
                  );
                }}
              </Query>
            </Grid>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {
    padding: '0 8px',
    [theme.breakpoints.up('sm')]: {
      padding: '8px 32px'
    }
  },
  paperContainer: {
    width: '100%',
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2)
    }
  },
  paperTitle: {
    width: '100%',
    backgroundColor: '#fafafa',
    padding: theme.spacing(2)
  },
  selectedImageContainer: {
    minHeight: '450px',
    marginBottom: theme.spacing(1)
  },
  paperProductPrice: {
    backgroundColor: '#fafafa',
    padding: theme.spacing(2)
  },
  discountPercentage: {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    padding: '2px 8px',
    marginLeft: '15px'
  },
  containerProductOrder: {
    padding: theme.spacing(2)
  },
  buttonAddToCartBuyNow: {
    textTransform: 'capitalize',
    padding: '16px 24px'
  },
  containerProductExtraOption: {
    padding: theme.spacing(3)
  },
  containerProductDescription: {
    padding: theme.spacing(2),
    '&>div': {
      width: '100%'
    },
    '& img': {
      width: '100%'
    }
  },
  containerProductExtraOptionValue: {
    fontWeight: 'bold'
  },
  paperProductStatus: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2)
  },
  productCarouselImage: {
    height: '88px',
    objectFit: 'cover'
  }
}))(withSnackbar(withTranslation()(withRouter(Product))));
