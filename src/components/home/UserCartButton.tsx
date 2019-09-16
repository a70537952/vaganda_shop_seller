import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import Paper from '@material-ui/core/Paper';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { AppContext } from '../../contexts/home/Context';
import { homePath } from '../../utils/RouteUtil';
import Image from '../Image';
import ProductTitle from '../ProductTitle';

let t: any;

interface IProps {
  classes: any;
}

interface IState {
  cartPopoverAnchorEl: any;
}

class UserCartButton extends React.Component<
  IProps & WithSnackbarProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(
    props: IProps & WithSnackbarProps & RouteComponentProps & WithTranslation
  ) {
    super(props);

    t = this.props.t;

    this.state = {
      cartPopoverAnchorEl: null
    };
  }

  handleCartPopoverOpen(event?: any) {
    this.setState({
      cartPopoverAnchorEl: event
        ? event.currentTarget
        : this.state.cartPopoverAnchorEl
    });
  }

  handleCartPopoverClose() {
    this.setState({ cartPopoverAnchorEl: null });
  }

  removeProductTypeFromUserCartCompletedHandler(data: any) {
    this.props.enqueueSnackbar(t('product successfully remove from cart'));
  }

  removeProductTypeFromUserCartErrorHandler(error: any) {
    this.props.enqueueSnackbar(
      t('something went wrong. please refresh the page and try again.'),
      {
        variant: 'error'
      }
    );
  }

  removeProductTypeFromUserCart(
    removeProductTypeFromUserCartMutation: any,
    user_cart_id: any
  ) {
    removeProductTypeFromUserCartMutation({
      variables: {
        user_cart_ids: [user_cart_id]
      }
    });
  }

  render() {
    const { cartPopoverAnchorEl } = this.state;
    let { classes, t } = this.props;
    const isCartPopoverOpen = Boolean(this.state.cartPopoverAnchorEl);
    return (
      <AppContext.Consumer>
        {(context: any) => {
          if (!context.user) return null;

          return (
            <>
              <Button
                variant="text"
                aria-owns={isCartPopoverOpen ? 'cart-popover' : undefined}
                aria-haspopup="true"
                className={classes.cartButton}
                onMouseEnter={this.handleCartPopoverOpen.bind(this)}
                onMouseLeave={this.handleCartPopoverClose.bind(this)}
                {...({
                  component: Link,
                  to: homePath('userCart')
                } as any)}
              >
                <ShoppingCartIcon />
              </Button>
              <Popover
                id="cart-popover"
                className={classes.popoverCart}
                open={isCartPopoverOpen}
                anchorEl={cartPopoverAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                PaperProps={{
                  style: {
                    width: '480px'
                  }
                }}
                onMouseEnter={() => {
                  this.handleCartPopoverOpen();
                }}
                onClose={this.handleCartPopoverClose.bind(this)}
                disableRestoreFocus
              >
                <Paper elevation={0} className={classes.cartPaper}>
                  <Grid container spacing={1}>
                    <Grid container item xs={12}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        paragraph
                        style={{ textTransform: 'capitalize' }}
                      >
                        {t('recently added product')}
                      </Typography>
                    </Grid>
                    <Grid container item xs={12} spacing={1}>
                      <Query
                        query={gql`
                          query UserCart(
                            $user_id: String
                            $limit: Int
                            $sort_created_at: String
                          ) {
                            userCart(
                              user_id: $user_id
                              limit: $limit
                              sort_created_at: $sort_created_at
                            ) {
                              items {
                                id
                                user_id
                                product_type_id
                                quantity

                                product_type {
                                  id
                                  product_id
                                  title
                                  quantity
                                  currency
                                  final_price
                                  product_type_image {
                                    id
                                    product_type_id
                                    path
                                    image_small
                                    image_medium
                                    image_large
                                    image_original
                                  }

                                  product {
                                    id
                                    title
                                    product_image {
                                      id
                                      product_id
                                      path
                                      image_small
                                    }
                                  }
                                }
                              }
                            }
                          }
                        `}
                        variables={{
                          user_id: context.user.id,
                          limit: 5,
                          sort_created_at: 'desc'
                        }}
                        notifyOnNetworkStatusChange={true}
                        fetchPolicy="network-only"
                      >
                        {({ loading, error, data, refetch }) => {
                          if (error) return <>Error!</>;
                          if (loading)
                            return (
                              <Grid container justify={'center'}>
                                <CircularProgress size={35} />
                              </Grid>
                            );

                          let userCarts = data.userCart.items;

                          return (
                            <Grid container item xs={12} spacing={1}>
                              {userCarts.map((userCart: any) => (
                                <Grid
                                  container
                                  item
                                  key={userCart.id}
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Grid item xs={2}>
                                    <Link
                                      to={homePath('product', {
                                        productId:
                                          userCart.product_type.product.id
                                      })}
                                    >
                                      <Image
                                        alt={
                                          userCart.product_type.product.title
                                        }
                                        useLazyLoad
                                        src={
                                          userCart.product_type.product
                                            .product_image[0].image_small
                                        }
                                        style={{
                                          width: '100%',
                                          height: '54px'
                                        }}
                                      />
                                    </Link>
                                  </Grid>
                                  <Grid item container xs={10}>
                                    <Grid
                                      item
                                      container
                                      justify="space-between"
                                    >
                                      <Grid item>
                                        <ProductTitle
                                          variant="subtitle1"
                                          color={'inherit'}
                                          withLink
                                          product={
                                            userCart.product_type.product
                                          }
                                        />
                                      </Grid>
                                      <Grid item>
                                        <Typography
                                          variant="subtitle1"
                                          color="primary"
                                          {...({
                                            component: Link,
                                            to: homePath('product', {
                                              productId:
                                                userCart.product_type.product.id
                                            })
                                          } as any)}
                                        >
                                          {userCart.product_type.currency}{' '}
                                          {userCart.product_type.final_price}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      item
                                      container
                                      justify="space-between"
                                      alignItems="center"
                                    >
                                      <Grid item>
                                        <Typography
                                          variant="body2"
                                          color={'inherit'}
                                          {...({
                                            component: Link,
                                            to: homePath('product', {
                                              productId:
                                                userCart.product_type.product.id
                                            })
                                          } as any)}
                                        >
                                          {t('variation')}
                                          :&nbsp;
                                          {userCart.product_type.title}
                                          &nbsp; X &nbsp;
                                          {userCart.quantity}
                                        </Typography>
                                      </Grid>
                                      <Grid item>
                                        <Mutation
                                          mutation={gql`
                                            mutation RemoveProductTypeFromUserCartMutation(
                                              $user_cart_ids: [Int]!
                                            ) {
                                              removeProductTypeFromUserCartMutation(
                                                user_cart_ids: $user_cart_ids
                                              ) {
                                                id
                                              }
                                            }
                                          `}
                                          onCompleted={data => {
                                            this.removeProductTypeFromUserCartCompletedHandler.bind(
                                              this
                                            )(data);
                                            refetch();
                                          }}
                                          onError={error => {
                                            this.removeProductTypeFromUserCartErrorHandler.bind(
                                              this
                                            )(error);
                                          }}
                                        >
                                          {(
                                            removeProductTypeFromUserCartMutation,
                                            { data, loading, error }
                                          ) => {
                                            if (loading) {
                                              return (
                                                <Button
                                                  size="small"
                                                  variant="text"
                                                >
                                                  <CircularProgress size={15} />
                                                </Button>
                                              );
                                            }

                                            return (
                                              <Button
                                                size="small"
                                                variant="text"
                                                onClick={() => {
                                                  this.removeProductTypeFromUserCart(
                                                    removeProductTypeFromUserCartMutation,
                                                    userCart.id
                                                  );
                                                }}
                                              >
                                                {t('remove')}
                                              </Button>
                                            );
                                          }}
                                        </Mutation>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
                              {userCarts.length === 0 && (
                                <Grid container item xs={12} justify="center">
                                  <Typography
                                    variant="subtitle1"
                                    style={{ textTransform: 'capitalize' }}
                                  >
                                    {t('no products yet')}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          );
                        }}
                      </Query>
                    </Grid>
                    <Grid container item xs={12} justify={'flex-end'}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        {...({
                          component: Link,
                          to: homePath('userCart')
                        } as any)}
                      >
                        {t('view cart')}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Popover>
            </>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  cartButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff'
  },
  popoverCart: {
    //pointerEvents: 'none',
  },
  cartPaper: {
    padding: theme.spacing(1)
  }
}))(withSnackbar(withTranslation()(withRouter(UserCartButton))));
