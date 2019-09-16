import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles/index";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import update from "immutability-helper";
import { withSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { Mutation, Query } from "react-apollo";
import { withRouter } from "react-router-dom";
import SellerHelmet from "../components/seller/SellerHelmet";
import LocaleMoment from "../components/LocaleMoment";
import ModalCreateEditProduct from "../components/seller/Modal/ModalCreateEditProduct";
import ReactTable from "../components/seller/ReactTable/ReactTable";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import { productQuery } from "../graphql/query/ProductQuery";
import { WithTranslation, withTranslation } from "react-i18next";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import ModalCreateEditShopProductCategory from "../components/seller/Modal/ModalCreateEditShopProductCategory";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CanceIcon from "@material-ui/icons/Cancel";
import Typography from "@material-ui/core/Typography";
import { homePath } from "../utils/RouteUtil";
import LaunchIcon from "@material-ui/icons/Launch";
import ImagesCarousel from "../components/ImagesCarousel";
import Image from "../components/Image";
import { productFragments } from "../graphql/fragment/query/ProductFragment";

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  modal: {
    createEditProduct: boolean;
    createEditShopProductCategory: boolean;
  };
  editingProduct: any;
  lightbox: any;
  tableKey: number;
  addToCategoryAnchorEl: any;
  addToCategory: Set<number>;
  removeFromCategoryAnchorEl: any;
  removeFromCategory: Set<number>;
}

class Product extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    this.state = {
      modal: {
        createEditProduct: false,
        createEditShopProductCategory: false
      },
      editingProduct: null,
      lightbox: {
        isOpen: false,
        imgSrc: ''
      },
      tableKey: +new Date(),
      addToCategoryAnchorEl: null,
      addToCategory: new Set(),
      removeFromCategoryAnchorEl: null,
      removeFromCategory: new Set()
    };
  }

  toggleModalProductCategory(product: any = null) {
    this.setState(
      update(this.state, {
        modal: {
          createEditShopProductCategory: {
            $set: !this.state.modal.createEditShopProductCategory
          }
        }
      })
    );
  }

  toggleModalCreateProduct() {
    this.setState(
      update(this.state, {
        modal: {
          createEditProduct: { $set: !this.state.modal.createEditProduct }
        },
        editingProduct: { $set: null }
      })
    );
  }

  toggleModalEditProduct(product: any) {
    this.setState(
      update(this.state, {
        modal: {
          createEditProduct: { $set: !this.state.modal.createEditProduct }
        },
        editingProduct: { $set: product }
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
        Header: t('product title'),
        accessor: (d: any) => d,
        filterable: true,
        Cell: ({ value }: any) => {
          return (
            <Grid container item alignItems={'center'}>
              <Tooltip title={t('view on shop')}>
                <Typography
                  variant="body2"
                  color="secondary"
                  className={classes.productTitle}
                  {...({
                    component: 'a',
                    href:
                      '//' +
                      process.env.REACT_APP_DOMAIN +
                      homePath('product', { productId: value.id }),
                    target: '_blank'
                  } as any)}
                >
                  {value.title}
                  <LaunchIcon style={{ fontSize: '13px', color: '#f44336' }} />
                </Typography>
              </Tooltip>
              &nbsp;
              <Tooltip
                title={value.is_publish ? t('published') : t('unpublished')}
              >
                {value.is_publish ? (
                  <CheckCircleIcon
                    style={{ fontSize: '13px', color: '#2196f3' }}
                  />
                ) : (
                  <CanceIcon style={{ fontSize: '13px', color: '#f44336' }} />
                )}
              </Tooltip>
            </Grid>
          );
        }
      },
      {
        id: 'product_category',
        Header: t('product category'),
        filterable: true,
        sortable: false,
        accessor: (d: any) => d,
        Cell: ({ value }: any) => {
          return (
            <Grid container item alignItems={'center'}>
              {t('global$$productCategory::' + value.product_category.title)}
              {value.shop_product_category_product &&
                value.shop_product_category_product.length > 0 && (
                  <Tooltip
                    title={
                      <>
                        <Typography color="inherit">
                          {t('added to shop product category')}
                        </Typography>
                        {value.shop_product_category_product.map(
                          (category_product: any) => (
                            <React.Fragment
                              key={category_product.shop_product_category.id}
                            >
                              {category_product.shop_product_category.title}
                              <br />
                            </React.Fragment>
                          )
                        )}
                      </>
                    }
                  >
                    <PlaylistAddCheckIcon
                      style={{ fontSize: '18px' }}
                      color="primary"
                    />
                  </Tooltip>
                )}
            </Grid>
          );
        }
      },
      {
        id: 'product_image',
        sortable: false,
        Header: t('product image'),
        accessor: (d: any) => d,
        Cell: ({ value }: any) => {
          if (value.product_image && value.product_image[0]) {
            return (
              <Image
                src={value.product_image[0].image_medium}
                style={{ height: '65px' }}
                useLazyLoad
                alt={value.title}
                onClick={() => {
                  this.setState(
                    update(this.state, {
                      lightbox: {
                        isOpen: { $set: !this.state.lightbox.isOpen },
                        imgSrc: { $set: value.product_image[0].image_original }
                      }
                    })
                  );
                }}
                className={'img pointer'}
              />
            );
          } else {
            return <span>{t('no image')}</span>;
          }
        }
      },
      {
        id: 'price',
        Header: t('price'),
        accessor: (d: any) => {
          let sortProductType = d.product_type.sort(
            (a: any, b: any) => a.price - b.price
          );
          let priceString =
            sortProductType[0].currency + ' ' + sortProductType[0].price;
          if (sortProductType[1]) {
            priceString +=
              ' ~ ' +
              sortProductType[sortProductType.length - 1].currency +
              ' ' +
              sortProductType[sortProductType.length - 1].price;
          }
          return priceString;
        }
      },
      {
        id: 'is_publish',
        Header: t('is publish'),
        hide: true,
        filterable: true,
        filterType: 'select',
        filterComponent: (props: any) => {
          return (
            <Select {...props}>
              <MenuItem value={''}>{t('all')}</MenuItem>
              <MenuItem value={'0'}>{t('unpublished')}</MenuItem>
              <MenuItem value={1}>{t('published')}</MenuItem>
            </Select>
          );
        },
        accessor: (d: any) => (d.is_publish ? t('published') : t('unpublished'))
      },
      {
        id: 'shop_product_category_id',
        Header: t('shop product category'),
        hide: true,
        filterable: true,
        filterType: 'select',
        filterByWhere: true,
        filterComponent: (props: any) => {
          return (
            <Query
              query={gql`
                query ShopProductCategory($shop_id: String) {
                  shopProductCategory(shop_id: $shop_id) {
                    items {
                      id
                      shop_id
                      title
                    }
                  }
                }
              `}
              variables={{
                shop_id: this.props.context.shop.id
              }}
            >
              {({ loading, error, data, refetch }) => {
                if (error) return <>Error!</>;
                if (loading) return null;
                let shopProductCategories = data.shopProductCategory.items;

                return (
                  <Select {...props}>
                    <MenuItem value={''}>{t('all')}</MenuItem>
                    {shopProductCategories.map((shopProductCategory: any) => (
                      <MenuItem
                        value={shopProductCategory.id}
                        key={shopProductCategory.id}
                      >
                        {shopProductCategory.title}
                      </MenuItem>
                    ))}
                  </Select>
                );
              }}
            </Query>
          );
        }
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
        width: 160,
        Cell: ({ value }: any) => {
          return (
            <React.Fragment>
              {(this.props.context.permission.includes('UPDATE_PRODUCT') ||
                this.props.context.permission.includes('VIEW_PRODUCT')) && (
                <Tooltip title={t('edit')}>
                  <Fab
                    size="small"
                    variant="round"
                    color="primary"
                    onClick={() => {
                      this.toggleModalEditProduct(value);
                    }}
                  >
                    <EditIcon />
                  </Fab>
                </Tooltip>
              )}
            </React.Fragment>
          );
        }
      }
    ];

    let productTypeColumns = [
      {
        id: 'title',
        Header: t('product type title'),
        accessor: (d: any) => d.title
      },
      {
        id: 'quantity',
        Header: t('quantity'),
        accessor: (d: any) => d.quantity,
        width: 50
      },
      {
        id: 'price',
        Header: t('price'),
        accessor: (d: any) => d.currency + ' ' + d.price
      },
      {
        id: 'discount',
        Header: t('discount'),
        accessor: (d: any) =>
          d.discount_unit === 'Percentage'
            ? d.discount + '% (' + d.currency + ' ' + d.discount_amount + ')'
            : d.currency + ' ' + d.discount_amount
      },
      {
        id: 'final_price',
        Header: t('final price'),
        accessor: (d: any) => d.currency + ' ' + d.final_price
      },
      {
        id: 'product_type_image',
        sortable: false,
        Header: t('product type image'),
        accessor: (d: any) => d,
        Cell: ({ value }: any) => {
          if (value.product_type_image && value.product_type_image[0]) {
            return (
              <Image
                src={value.product_type_image[0].image_medium}
                style={{ height: '65px' }}
                useLazyLoad
                alt={value.title}
                onClick={() => {
                  this.setState(
                    update(this.state, {
                      lightbox: {
                        isOpen: { $set: !this.state.lightbox.isOpen },
                        imgSrc: {
                          $set: value.product_type_image[0].image_original
                        }
                      }
                    })
                  );
                }}
                className={'img pointer'}
              />
            );
          } else {
            return <span>{t('no image')}</span>;
          }
        }
      }
    ];

    let actionList: any[] = [];

    if (
      this.props.context.permission.includes(
        'DELETE_SHOP_PRODUCT_CATEGORY_PRODUCT'
      )
    ) {
      actionList.push({
        customComponent: (selectedData: any) => (
          <Query
            query={gql`
              query ShopProductCategory($shop_id: String) {
                shopProductCategory(shop_id: $shop_id) {
                  items {
                    id
                    shop_id
                    title
                  }
                }
              }
            `}
            variables={{
              shop_id: this.props.context.shop.id
            }}
          >
            {({ loading, error, data, refetch }) => {
              if (error) return <>Error!</>;
              if (loading) return null;
              let shopProductCategories = data.shopProductCategory.items;

              return (
                <Mutation
                  mutation={gql`
                    mutation DeleteShopProductCategoryProductMutation(
                      $shop_id: String!
                      $shop_product_category_ids: [String]!
                      $product_ids: [String]!
                    ) {
                      deleteShopProductCategoryProductMutation(
                        shop_id: $shop_id
                        shop_product_category_ids: $shop_product_category_ids
                        product_ids: $product_ids
                      ) {
                        id
                      }
                    }
                  `}
                  onCompleted={async data => {
                    this.props.enqueueSnackbar(
                      t(
                        '{{count}} selected successfully deleted from {{categoryCount}} category',
                        {
                          count:
                            data.deleteShopProductCategoryProductMutation
                              .length,
                          categoryCount: this.state.removeFromCategory.size
                        }
                      )
                    );
                    await this.setState({
                      removeFromCategoryAnchorEl: null,
                      removeFromCategory: new Set()
                    });
                    this.updateTableKey();
                  }}
                >
                  {(
                    deleteShopProductCategoryProductMutation,
                    { data, loading, error }
                  ) => {
                    return (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          aria-owns={
                            this.state.removeFromCategoryAnchorEl
                              ? 'remove-category-menu'
                              : undefined
                          }
                          aria-haspopup="true"
                          onClick={event => {
                            this.setState({
                              removeFromCategoryAnchorEl: event.currentTarget
                            });
                          }}
                        >
                          {t('remove from shop product category')}
                        </Button>
                        <Menu
                          id="remove-category-menu"
                          anchorEl={this.state.removeFromCategoryAnchorEl}
                          open={Boolean(this.state.removeFromCategoryAnchorEl)}
                          onClose={() => {
                            this.setState({
                              removeFromCategoryAnchorEl: null,
                              removeFromCategory: new Set()
                            });
                          }}
                        >
                          <List disablePadding>
                            {shopProductCategories.map(
                              (shopProductCategory: any) => (
                                <ListItem
                                  button
                                  key={shopProductCategory.id}
                                  onClick={() => {
                                    if (
                                      this.state.removeFromCategory.has(
                                        shopProductCategory.id
                                      )
                                    ) {
                                      let removeFromCategory = this.state
                                        .removeFromCategory;
                                      removeFromCategory.delete(
                                        shopProductCategory.id
                                      );
                                      this.setState({
                                        removeFromCategory: removeFromCategory
                                      });
                                    } else {
                                      this.setState({
                                        removeFromCategory: this.state.removeFromCategory.add(
                                          shopProductCategory.id
                                        )
                                      });
                                    }
                                  }}
                                >
                                  <Checkbox
                                    color="primary"
                                    checked={this.state.removeFromCategory.has(
                                      shopProductCategory.id
                                    )}
                                    tabIndex={-1}
                                    disableRipple
                                    value={shopProductCategory.id}
                                  />
                                  <ListItemText
                                    primary={shopProductCategory.title}
                                  />
                                </ListItem>
                              )
                            )}
                            <Divider />
                            <ListItem>
                              {loading ? (
                                <Button
                                  fullWidth
                                  disabled
                                  variant="contained"
                                  color="primary"
                                >
                                  {t('removing...')}
                                </Button>
                              ) : (
                                <Button
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    return deleteShopProductCategoryProductMutation(
                                      {
                                        variables: {
                                          shop_id: this.props.context.shop.id,
                                          product_ids: selectedData.map(
                                            (data: any) => data.id
                                          ),
                                          shop_product_category_ids: Array.from(
                                            this.state.removeFromCategory
                                          )
                                        }
                                      }
                                    );
                                  }}
                                >
                                  {t('remove')}
                                </Button>
                              )}
                            </ListItem>
                          </List>
                        </Menu>
                      </>
                    );
                  }}
                </Mutation>
              );
            }}
          </Query>
        )
      });
    }

    if (
      this.props.context.permission.includes(
        'CREATE_SHOP_PRODUCT_CATEGORY_PRODUCT'
      )
    ) {
      actionList.push({
        customComponent: (selectedData: any) => (
          <Query
            query={gql`
              query ShopProductCategory($shop_id: String) {
                shopProductCategory(shop_id: $shop_id) {
                  items {
                    id
                    shop_id
                    title
                  }
                }
              }
            `}
            variables={{
              shop_id: this.props.context.shop.id
            }}
          >
            {({ loading, error, data, refetch }) => {
              if (error) return <>Error!</>;
              if (loading) return null;
              let shopProductCategories = data.shopProductCategory.items;

              return (
                <Mutation
                  mutation={gql`
                    mutation CreateShopProductCategoryProductMutation(
                      $shop_id: String!
                      $shop_product_category_ids: [String]!
                      $product_ids: [String]!
                    ) {
                      createShopProductCategoryProductMutation(
                        shop_id: $shop_id
                        shop_product_category_ids: $shop_product_category_ids
                        product_ids: $product_ids
                      ) {
                        id
                      }
                    }
                  `}
                  onCompleted={async data => {
                    this.props.enqueueSnackbar(
                      t(
                        '{{count}} selected successfully added to {{categoryCount}} category',
                        {
                          count:
                            data.createShopProductCategoryProductMutation
                              .length,
                          categoryCount: this.state.addToCategory.size
                        }
                      )
                    );
                    await this.setState({
                      addToCategoryAnchorEl: null,
                      addToCategory: new Set()
                    });
                    this.updateTableKey();
                  }}
                >
                  {(
                    createShopProductCategoryProductMutation,
                    { data, loading, error }
                  ) => {
                    return (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          aria-owns={
                            this.state.addToCategoryAnchorEl
                              ? 'category-menu'
                              : undefined
                          }
                          aria-haspopup="true"
                          onClick={event => {
                            this.setState({
                              addToCategoryAnchorEl: event.currentTarget
                            });
                          }}
                        >
                          {t('add to shop product category')}
                        </Button>
                        <Menu
                          id="category-menu"
                          anchorEl={this.state.addToCategoryAnchorEl}
                          open={Boolean(this.state.addToCategoryAnchorEl)}
                          onClose={() => {
                            this.setState({
                              addToCategoryAnchorEl: null,
                              addToCategory: new Set()
                            });
                          }}
                        >
                          <List disablePadding>
                            {shopProductCategories.map(
                              (shopProductCategory: any) => (
                                <ListItem
                                  button
                                  key={shopProductCategory.id}
                                  onClick={() => {
                                    if (
                                      this.state.addToCategory.has(
                                        shopProductCategory.id
                                      )
                                    ) {
                                      let addToCategory = this.state
                                        .addToCategory;
                                      addToCategory.delete(
                                        shopProductCategory.id
                                      );
                                      this.setState({
                                        addToCategory: addToCategory
                                      });
                                    } else {
                                      this.setState({
                                        addToCategory: this.state.addToCategory.add(
                                          shopProductCategory.id
                                        )
                                      });
                                    }
                                  }}
                                >
                                  <Checkbox
                                    color="primary"
                                    checked={this.state.addToCategory.has(
                                      shopProductCategory.id
                                    )}
                                    tabIndex={-1}
                                    disableRipple
                                    value={shopProductCategory.id}
                                  />
                                  <ListItemText
                                    primary={shopProductCategory.title}
                                  />
                                </ListItem>
                              )
                            )}
                            {this.props.context.permission.includes(
                              'CREATE_SHOP_PRODUCT_CATEGORY'
                            ) && (
                              <>
                                <ListItem>
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={this.toggleModalProductCategory.bind(
                                      this
                                    )}
                                  >
                                    <AddIcon />
                                    {t('add shop product category')}
                                  </Button>
                                </ListItem>
                                <ModalCreateEditShopProductCategory
                                  shopId={this.props.context.shop.id}
                                  disabled={
                                    !this.props.context.permission.includes(
                                      'CREATE_SHOP_PRODUCT_CATEGORY'
                                    )
                                  }
                                  toggle={() => {
                                    this.toggleModalProductCategory();
                                    refetch();
                                  }}
                                  isOpen={
                                    this.state.modal
                                      .createEditShopProductCategory
                                  }
                                />
                              </>
                            )}
                            <Divider />
                            <ListItem>
                              {loading ? (
                                <Button
                                  fullWidth
                                  disabled
                                  variant="contained"
                                  color="primary"
                                >
                                  {t('saving...')}
                                </Button>
                              ) : (
                                <Button
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    return createShopProductCategoryProductMutation(
                                      {
                                        variables: {
                                          shop_id: this.props.context.shop.id,
                                          product_ids: selectedData.map(
                                            (data: any) => data.id
                                          ),
                                          shop_product_category_ids: Array.from(
                                            this.state.addToCategory
                                          )
                                        }
                                      }
                                    );
                                  }}
                                >
                                  {t('save')}
                                </Button>
                              )}
                            </ListItem>
                          </List>
                        </Menu>
                      </>
                    );
                  }}
                </Mutation>
              );
            }}
          </Query>
        )
      });
    }

    if (this.props.context.permission.includes('UPDATE_PRODUCT')) {
      actionList.push({
        title: t('publish'),
        component: (component: any) => {
          return (
            <Mutation
              key={'component'}
              mutation={gql`
                mutation PublishProductMutation(
                  $shop_id: String!
                  $productIds: [String]!
                ) {
                  publishProductMutation(
                    shop_id: $shop_id
                    productIds: $productIds
                  ) {
                    id
                    is_publish
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t('{{count}} selected successfully publish', {
                    count: data.publishProductMutation.length
                  })
                );
              }}
            >
              {(publishProductMutation, { data, loading, error }) => {
                return React.createElement(component, {
                  onClick: (selectedData: any) => {
                    return publishProductMutation({
                      variables: {
                        shop_id: this.props.context.shop.id,
                        productIds: selectedData.map((data: any) => data.id)
                      }
                    });
                  },
                  loading: loading
                });
              }}
            </Mutation>
          );
        }
      });
      actionList.push({
        title: t('unpublish'),
        component: (component: any) => {
          return (
            <Mutation
              key={'unpublishProductMutation'}
              mutation={gql`
                mutation UnpublishProductMutation(
                  $shop_id: String!
                  $productIds: [String]!
                ) {
                  unpublishProductMutation(
                    shop_id: $shop_id
                    productIds: $productIds
                  ) {
                    id
                    is_publish
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t('{{count}} selected successfully unpublish', {
                    count: data.unpublishProductMutation.length
                  })
                );
              }}
            >
              {(unpublishProductMutation, { data, loading, error }) => {
                return React.createElement(component, {
                  onClick: (selectedData: any) => {
                    return unpublishProductMutation({
                      variables: {
                        shop_id: this.props.context.shop.id,
                        productIds: selectedData.map((data: any) => data.id)
                      }
                    });
                  },
                  loading: loading
                });
              }}
            </Mutation>
          );
        }
      });
    }

    if (this.props.context.permission.includes('DELETE_PRODUCT')) {
      actionList.push({
        title: t('delete'),
        component: (component: any) => {
          return (
            <Mutation
              key={'deleteProductMutation'}
              mutation={gql`
                mutation DeleteProductMutation(
                  $shop_id: String!
                  $productIds: [String]!
                ) {
                  deleteProductMutation(
                    shop_id: $shop_id
                    productIds: $productIds
                  ) {
                    id
                  }
                }
              `}
              onCompleted={data => {
                this.props.enqueueSnackbar(
                  t('{{count}} selected successfully delete', {
                    count: data.deleteProductMutation.length
                  })
                );
                this.updateTableKey();
              }}
            >
              {(deleteProductMutation, { data, loading, error }) => {
                return React.createElement(component, {
                  onClick: (selectedData: any) => {
                    return deleteProductMutation({
                      variables: {
                        shop_id: this.props.context.shop.id,
                        productIds: selectedData.map((data: any) => data.id)
                      }
                    });
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
              title={t('product')}
              description={''}
              keywords={t('product')}
              ogImage="/images/favicon-228.png"
            />
            <ImagesCarousel
              onClose={() => {
                this.setState(
                  update(this.state, {
                    lightbox: { isOpen: { $set: !this.state.lightbox.isOpen } }
                  })
                );
              }}
              views={[{ src: this.state.lightbox.imgSrc }]}
              isOpen={this.state.lightbox.isOpen}
            />
            <Paper className={classes.root} elevation={1}>
              <Grid container justify={'center'}>
                {context.permission.includes('CREATE_PRODUCT') && (
                  <Grid container justify={'flex-end'}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={this.toggleModalCreateProduct.bind(this)}
                    >
                      <AddIcon />
                      {t('add product')}
                    </Button>
                  </Grid>
                )}
                <ModalCreateEditProduct
                  productId={
                    this.state.editingProduct
                      ? this.state.editingProduct.id
                      : null
                  }
                  shopId={context.shop.id}
                  disabled={!context.permission.includes('UPDATE_PRODUCT')}
                  toggle={this.toggleModalCreateProduct.bind(this)}
                  isOpen={this.state.modal.createEditProduct}
                  refetchData={this.updateTableKey.bind(this)}
                />

                <SellerReactTable
                  showCheckbox
                  showFilter
                  title={t('product')}
                  columns={columns}
                  query={productQuery(productFragments.Product)}
                  variables={{
                    shop_id: context.shop.id,
                    key: this.state.tableKey,
                    sort_created_at: 'desc'
                  }}
                  actionList={actionList}
                  SubComponent={({ original }: any) => {
                    return (
                      <ReactTable
                        data={original.product_type}
                        columns={productTypeColumns}
                        defaultPageSize={100}
                        showPagination={false}
                      />
                    );
                  }}
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
  },
  productTitle: {
    alignItems: 'center',
    display: 'flex'
  },
  progress: {}
}))(withSnackbar(withTranslation()(withRouter(Product))));
