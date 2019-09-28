import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import update from "immutability-helper";
import React, { useContext, useState } from "react";
import Helmet from "../components/seller/Helmet";
import LocaleMoment from "../components/LocaleMoment";
import ModalCreateEditProduct from "../components/seller/Modal/ModalCreateEditProduct";
import ReactTable from "../components/seller/ReactTable/ReactTable";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import { productQuery } from "../graphql/query/ProductQuery";
import { useTranslation } from "react-i18next";
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
import useToast from "../components/_hook/useToast";
import { useShopProductCategoryQuery } from "../graphql/query/ShopProductCategoryQuery";
import { IShopCategoryFragmentProduct } from "../graphql/fragmentType/query/ShopCategoryFragmentInterface";
import { useDeleteShopProductCategoryProductMutation } from "../graphql/mutation/shopProductCategoryProductMutation/DeleteShopProductCategoryProductMutation";
import { IDeleteShopProductCategoryProductMutationFragmentDefaultFragment } from "../graphql/fragmentType/mutation/shopProductCategoryProductMutation/DeleteShopProductCategoryProductMutationFragmentInterface";
import { useCreateShopProductCategoryProductMutation } from "../graphql/mutation/shopProductCategoryProductMutation/CreateShopProductCategoryProductMutation";
import { deleteShopProductCategoryProductMutationFragments } from "../graphql/fragment/mutation/shopProductCategoryProductMutation/DeleteShopProductCategoryProductMutationFragment";
import { createShopProductCategoryProductMutationFragments } from "../graphql/fragment/mutation/shopProductCategoryProductMutation/CreateShopProductCategoryProductMutationFragment";
import { ICreateShopProductCategoryProductMutationFragmentDefaultFragment } from "../graphql/fragmentType/mutation/shopProductCategoryProductMutation/CreateShopProductCategoryProductMutationFragmentInterface";
import { usePublishProductMutation } from "../graphql/mutation/productMutation/PublishProductMutation";
import { IPublishProductMutationFragmentProduct } from "../graphql/fragmentType/mutation/productMutation/PublishProductMutationFragmentInterface";
import { publishProductMutationFragments } from "../graphql/fragment/mutation/productMutation/PublishProductMutationFragment";
import { useUnpublishProductMutation } from "../graphql/mutation/productMutation/UnpublishProductMutation";
import { UnpublishProductMutationFragments } from "../graphql/fragment/mutation/productMutation/UnpublishProductMutationFragment";
import { IUnpublishProductMutationFragmentProduct } from "../graphql/fragmentType/mutation/productMutation/UnpublishProductMutationFragmentInterface";
import { useDeleteProductMutation } from "../graphql/mutation/productMutation/DeleteProductMutation";
import { deleteProductMutationFragments } from "../graphql/fragment/mutation/productMutation/DeleteProductMutationFragment";
import { IDeleteProductMutationFragmentDefaultFragment } from "../graphql/fragmentType/mutation/productMutation/DeleteProductMutationFragmentInterface";
import {
  IProductFragmentProduct,
  IProductFragmentProductIProductType
} from "../graphql/fragmentType/query/ProductFragmentInterface";
import { shopProductCategoryFragments } from "../graphql/fragment/query/ShopProductCategoryFragment";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    overflow: "auto"
  },
  productTitle: {
    alignItems: "center",
    display: "flex"
  }
}));

export default function Product() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const { toast } = useToast();

  const [tableKey, setTableKey] = useState<any>(+new Date());
  const [modal, setModal] = useState<{
    createEditProduct: boolean,
    createEditShopProductCategory: boolean
  }>({
    createEditProduct: false,
    createEditShopProductCategory: false
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean,
    imgSrc: string
  }>({
    isOpen: false,
    imgSrc: ""
  });

  const [addToCategoryAnchorEl, setAddToCategoryAnchorEl] = useState<any>(null);
  const [addToCategory, setAddToCategory] = useState<Set<string>>(new Set());
  const [removeFromCategoryAnchorEl, setRemoveFromCategoryAnchorEl] = useState<any>(null);
  const [removeFromCategory, setRemoveFromCategory] = useState<Set<string>>(new Set());

  function toggleModalProduct(product?: any) {
    setEditingProduct(product);
    setModal(
      update(modal, {
        createEditProduct: { $set: !modal.createEditProduct }
      })
    );
  }

  function toggleModalProductCategory() {
    setModal(
      update(modal, {
        createEditShopProductCategory: { $set: !modal.createEditShopProductCategory }
      })
    );
  }

  function updateTableKey() {
    setTableKey(+new Date());
  }

  const { data: shopProductCategoryData, refetch: refetchShopProductCategory } = useShopProductCategoryQuery<IShopCategoryFragmentProduct>(
    shopProductCategoryFragments.Product,
    {
      variables: { shop_id: context.shop.id }
    }
  );

  let shopProductCategories: IShopCategoryFragmentProduct[] = [];

  if (shopProductCategoryData) {
    shopProductCategories = shopProductCategoryData.shopProductCategory.items;
  }

  let columns = [
    {
      id: "title",
      Header: t("product title"),
      accessor: (d: IProductFragmentProduct) => d,
      filterable: true,
      Cell: ({ value }: { value: IProductFragmentProduct }) => {
        return (
          <Grid container item alignItems={"center"}>
            <Tooltip title={t("view on shop")}>
              <Typography
                variant="body2"
                color="secondary"
                className={classes.productTitle}
                {...({
                  component: "a",
                  href:
                    "//" +
                    process.env.REACT_APP_DOMAIN +
                    homePath("product", { productId: value.id }),
                  target: "_blank"
                } as any)}
              >
                {value.title}
                <LaunchIcon style={{ fontSize: "13px", color: "#f44336" }}/>
              </Typography>
            </Tooltip>
            &nbsp;
            <Tooltip
              title={value.is_publish ? t("published") : t("unpublished")}
            >
              {value.is_publish ? (
                <CheckCircleIcon
                  style={{ fontSize: "13px", color: "#2196f3" }}
                />
              ) : (
                <CanceIcon style={{ fontSize: "13px", color: "#f44336" }}/>
              )}
            </Tooltip>
          </Grid>
        );
      }
    },
    {
      id: "product_category",
      Header: t("product category"),
      filterable: true,
      sortable: false,
      accessor: (d: IProductFragmentProduct) => d,
      Cell: ({ value }: { value: IProductFragmentProduct }) => {
        return (
          <Grid container item alignItems={"center"}>
            {t("global$$productCategory::" + value.product_category.title)}
            {value.shop_product_category_product &&
            value.shop_product_category_product.length > 0 && (
              <Tooltip
                title={
                  <>
                    <Typography color="inherit">
                      {t("added to shop product category")}
                    </Typography>
                    {value.shop_product_category_product.map(
                      (category_product: any) => (
                        <React.Fragment
                          key={category_product.shop_product_category.id}
                        >
                          {category_product.shop_product_category.title}
                          <br/>
                        </React.Fragment>
                      )
                    )}
                  </>
                }
              >
                <PlaylistAddCheckIcon
                  style={{ fontSize: "18px" }}
                  color="primary"
                />
              </Tooltip>
            )}
          </Grid>
        );
      }
    },
    {
      id: "product_image",
      sortable: false,
      Header: t("product image"),
      accessor: (d: IProductFragmentProduct) => d,
      Cell: ({ value }: { value: IProductFragmentProduct }) => {
        if (value.product_image && value.product_image[0]) {
          return (
            <Image
              src={value.product_image[0].image_medium}
              style={{ height: "65px" }}
              useLazyLoad
              alt={value.title}
              onClick={() => {
                setLightbox(
                  update(lightbox, {
                    isOpen: { $set: !lightbox.isOpen },
                    imgSrc: { $set: value.product_image[0].image_original }
                  })
                );
              }}
              className={"img pointer"}
            />
          );
        } else {
          return <span>{t("no image")}</span>;
        }
      }
    },
    {
      id: "price",
      Header: t("price"),
      accessor: (d: IProductFragmentProduct) => {
        let sortProductType = d.product_type.sort(
          (a: any, b: any) => a.price - b.price
        );
        let priceString =
          sortProductType[0].currency + " " + sortProductType[0].price;
        if (sortProductType[1]) {
          priceString +=
            " ~ " +
            sortProductType[sortProductType.length - 1].currency +
            " " +
            sortProductType[sortProductType.length - 1].price;
        }
        return priceString;
      }
    },
    {
      id: "is_publish",
      Header: t("is publish"),
      hide: true,
      filterable: true,
      filterType: "select",
      filterComponent: (props: any) => {
        return (
          <Select {...props}>
            <MenuItem value={""}>{t("all")}</MenuItem>
            <MenuItem value={"0"}>{t("unpublished")}</MenuItem>
            <MenuItem value={1}>{t("published")}</MenuItem>
          </Select>
        );
      },
      accessor: (d: IProductFragmentProduct) => (d.is_publish ? t("published") : t("unpublished"))
    },
    {
      id: "shop_product_category_id",
      Header: t("shop product category"),
      hide: true,
      filterable: true,
      filterType: "select",
      filterByWhere: true,
      filterComponent: (props: any) => {
        return (
          <Select {...props}>
            <MenuItem value={""}>{t("all")}</MenuItem>
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
      }
    },
    {
      id: "created_at",
      Header: t("created at"),
      accessor: (d: IProductFragmentProduct) => d,
      Cell: ({ value }: { value: IProductFragmentProduct }) => {
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
      id: "action",
      sortable: false,
      Header: t("action"),
      accessor: (d: IProductFragmentProduct) => d,
      width: 160,
      Cell: ({ value }: { value: IProductFragmentProduct }) => {
        return (
          <React.Fragment>
            {(context.permission.includes("UPDATE_PRODUCT") ||
              context.permission.includes("VIEW_PRODUCT")) && (
              <Tooltip title={t("edit")}>
                <Fab
                  size="small"
                  variant="round"
                  color="primary"
                  onClick={() => {
                    toggleModalProduct(value);
                  }}
                >
                  <EditIcon/>
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
      id: "title",
      Header: t("product type title"),
      accessor: (d: IProductFragmentProductIProductType) => d.title
    },
    {
      id: "quantity",
      Header: t("quantity"),
      accessor: (d: IProductFragmentProductIProductType) => d.quantity,
      width: 50
    },
    {
      id: "price",
      Header: t("price"),
      accessor: (d: IProductFragmentProductIProductType) => d.currency + " " + d.price
    },
    {
      id: "discount",
      Header: t("discount"),
      accessor: (d: IProductFragmentProductIProductType) =>
        d.discount_unit === "Percentage"
          ? d.discount + "% (" + d.currency + " " + d.discount_amount + ")"
          : d.currency + " " + d.discount_amount
    },
    {
      id: "final_price",
      Header: t("final price"),
      accessor: (d: IProductFragmentProductIProductType) => d.currency + " " + d.final_price
    },
    {
      id: "product_type_image",
      sortable: false,
      Header: t("product type image"),
      accessor: (d: IProductFragmentProductIProductType) => d,
      Cell: ({ value }: { value: IProductFragmentProductIProductType }) => {
        if (value.product_type_image && value.product_type_image[0]) {
          return (
            <Image
              src={value.product_type_image[0].image_medium}
              style={{ height: "65px" }}
              useLazyLoad
              alt={value.title}
              onClick={() => {
                setLightbox(
                  update(lightbox, {
                    isOpen: { $set: !lightbox.isOpen },
                    imgSrc: {
                      $set: value.product_type_image[0].image_original
                    }
                  })
                );
              }}
              className={"img pointer"}
            />
          );
        } else {
          return <span>{t("no image")}</span>;
        }
      }
    }
  ];

  let actionList: any[] = [];

  const [
    deleteShopProductCategoryProductMutation,
    { loading: isDeletingShopProductCategoryProductMutation }
  ] = useDeleteShopProductCategoryProductMutation<IDeleteShopProductCategoryProductMutationFragmentDefaultFragment>(deleteShopProductCategoryProductMutationFragments.DefaultFragment, {
    onCompleted: (data) => {
      toast.default(
        t(
          "{{count}} selected successfully deleted from {{categoryCount}} category",
          {
            count:
            data.deleteShopProductCategoryProductMutation
              .length,
            categoryCount: removeFromCategory.size
          }
        )
      );
      setRemoveFromCategoryAnchorEl(null);
      setRemoveFromCategory(new Set());
      updateTableKey();
    }
  });


  const [
    createShopProductCategoryProductMutation,
    { loading: isCreatingShopProductCategoryProductMutation }
  ] = useCreateShopProductCategoryProductMutation<ICreateShopProductCategoryProductMutationFragmentDefaultFragment>(createShopProductCategoryProductMutationFragments.DefaultFragment, {
    onCompleted: (data) => {
      toast.default(
        t(
          "{{count}} selected successfully added to {{categoryCount}} category",
          {
            count:
            data.createShopProductCategoryProductMutation
              .length,
            categoryCount: addToCategory.size
          }
        )
      );
      setAddToCategoryAnchorEl(null);
      setAddToCategory(new Set());
      updateTableKey();
    }
  });

  const [
    publishProductMutation,
    { loading: isPublishingProductMutation }
  ] = usePublishProductMutation<IPublishProductMutationFragmentProduct>(publishProductMutationFragments.Product, {
    onCompleted: (data) => {
      toast.default(
        t("{{count}} selected successfully publish", {
          count: data.publishProductMutation.length
        })
      );
    }
  });

  const [
    unpublishProductMutation,
    { loading: isUnpublishingProductMutation }
  ] = useUnpublishProductMutation<IUnpublishProductMutationFragmentProduct>(UnpublishProductMutationFragments.Product, {
    onCompleted: (data) => {
      toast.default(
        t("{{count}} selected successfully unpublish", {
          count: data.unpublishProductMutation.length
        })
      );
    }
  });

  const [
    deleteProductMutation,
    { loading: isDeletingProductMutation }
  ] = useDeleteProductMutation<IDeleteProductMutationFragmentDefaultFragment>(deleteProductMutationFragments.DefaultFragment, {
    onCompleted: (data) => {
      toast.default(
        t("{{count}} selected successfully delete", {
          count: data.deleteProductMutation.length
        })
      );
      updateTableKey();
    }
  });

  if (
    context.permission.includes(
      "DELETE_SHOP_PRODUCT_CATEGORY_PRODUCT"
    )
  ) {
    actionList.push({
      customComponent: (selectedData: any) => (
        <>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            aria-owns={
              removeFromCategoryAnchorEl
                ? "remove-category-menu"
                : undefined
            }
            aria-haspopup="true"
            onClick={event => {
              setRemoveFromCategoryAnchorEl(event.currentTarget);
            }}
          >
            {t("remove from shop product category")}
          </Button>
          <Menu
            id="remove-category-menu"
            anchorEl={removeFromCategoryAnchorEl}
            open={Boolean(removeFromCategoryAnchorEl)}
            onClose={() => {
              setRemoveFromCategoryAnchorEl(null);
              setRemoveFromCategory(new Set());
            }}
          >
            <List disablePadding>
              {shopProductCategories.map(
                (shopProductCategory: any) => (
                  <ListItem
                    button
                    key={shopProductCategory.id}
                    onClick={() => {
                      let newRemoveFromCategory = new Set(Array.from(removeFromCategory));
                      if (newRemoveFromCategory.has(shopProductCategory.id)) {
                        newRemoveFromCategory.delete(shopProductCategory.id);
                      } else {
                        newRemoveFromCategory.add(shopProductCategory.id);
                      }
                      setRemoveFromCategory(newRemoveFromCategory);
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={removeFromCategory.has(shopProductCategory.id)}
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
              <Divider/>
              <ListItem>
                {isDeletingShopProductCategoryProductMutation ? (
                  <Button
                    fullWidth
                    disabled
                    variant="contained"
                    color="primary"
                  >
                    {t("removing...")}
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
                            shop_id: context.shop.id,
                            product_ids: selectedData.map(
                              (data: any) => data.id
                            ),
                            shop_product_category_ids: Array.from(removeFromCategory)
                          }
                        }
                      );
                    }}
                  >
                    {t("remove")}
                  </Button>
                )}
              </ListItem>
            </List>
          </Menu>
        </>
      )
    });
  }

  if (context.permission.includes("CREATE_SHOP_PRODUCT_CATEGORY_PRODUCT")) {
    actionList.push({
      customComponent: (selectedData: any) => (
        <>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            aria-owns={
              addToCategoryAnchorEl
                ? "category-menu"
                : undefined
            }
            aria-haspopup="true"
            onClick={event => {
              setAddToCategoryAnchorEl(event.currentTarget);
            }}
          >
            {t("add to shop product category")}
          </Button>
          <Menu
            id="category-menu"
            anchorEl={addToCategoryAnchorEl}
            open={Boolean(addToCategoryAnchorEl)}
            onClose={() => {
              setAddToCategoryAnchorEl(null);
              setAddToCategory(new Set());
            }}
          >
            <List disablePadding>
              {shopProductCategories.map(
                (shopProductCategory: any) => (
                  <ListItem
                    button
                    key={shopProductCategory.id}
                    onClick={() => {
                      let newAddToCategory = new Set(Array.from(addToCategory));

                      if (newAddToCategory.has(shopProductCategory.id)) {
                        newAddToCategory.delete(shopProductCategory.id);
                      } else {
                        newAddToCategory.add(shopProductCategory.id);
                      }
                      setAddToCategory(newAddToCategory);
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={addToCategory.has(shopProductCategory.id)}
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
              {context.permission.includes(
                "CREATE_SHOP_PRODUCT_CATEGORY"
              ) && (
                <>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={toggleModalProductCategory}
                    >
                      <AddIcon/>
                      {t("add shop product category")}
                    </Button>
                  </ListItem>
                  <ModalCreateEditShopProductCategory
                    shopId={context.shop.id}
                    disabled={
                      !context.permission.includes("CREATE_SHOP_PRODUCT_CATEGORY")
                    }
                    toggle={() => {
                      toggleModalProductCategory();
                      refetchShopProductCategory();
                    }}
                    isOpen={modal.createEditShopProductCategory}
                  />
                </>
              )}
              <Divider/>
              <ListItem>
                {isCreatingShopProductCategoryProductMutation ? (
                  <Button
                    fullWidth
                    disabled
                    variant="contained"
                    color="primary"
                  >
                    {t("saving...")}
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
                            shop_id: context.shop.id,
                            product_ids: selectedData.map(
                              (data: any) => data.id
                            ),
                            shop_product_category_ids: Array.from(addToCategory)
                          }
                        }
                      );
                    }}
                  >
                    {t("save")}
                  </Button>
                )}
              </ListItem>
            </List>
          </Menu>
        </>
      )
    });
  }

  if (context.permission.includes("UPDATE_PRODUCT")) {
    actionList.push({
      title: t("publish"),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: (selectedData: any) => {
              return publishProductMutation({
                variables: {
                  shop_id: context.shop.id,
                  productIds: selectedData.map((data: any) => data.id)
                }
              });
            },
            loading: isPublishingProductMutation
          })
        );
      }
    });
    actionList.push({
      title: t("unpublish"),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: (selectedData: any) => {
              return unpublishProductMutation({
                variables: {
                  shop_id: context.shop.id,
                  productIds: selectedData.map((data: any) => data.id)
                }
              });
            },
            loading: isUnpublishingProductMutation
          })
        );
      }
    });
  }

  if (context.permission.includes("DELETE_PRODUCT")) {
    actionList.push({
      title: t("delete"),
      component: (component: any) => {
        return (
          React.createElement(component, {
            onClick: (selectedData: any) => {
              return deleteProductMutation({
                variables: {
                  shop_id: context.shop.id,
                  productIds: selectedData.map((data: any) => data.id)
                }
              });
            },
            loading: isDeletingProductMutation
          })
        );
      }
    });
  }

  return <>
    <Helmet
      title={t("product")}
      description={""}
      keywords={t("product")}
      ogImage="/images/favicon-228.png"
    />
    <ImagesCarousel
      onClose={() => {
        setLightbox(
          update(lightbox, {
            isOpen: { $set: !lightbox.isOpen }
          })
        );
      }}
      views={[{ src: lightbox.imgSrc }]}
      isOpen={lightbox.isOpen}
    />
    <Paper className={classes.root} elevation={1}>
      <Grid container justify={"center"}>
        {context.permission.includes("CREATE_PRODUCT") && (
          <Grid container justify={"flex-end"}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={toggleModalProduct}
            >
              <AddIcon/>
              {t("add product")}
            </Button>
          </Grid>
        )}
        <ModalCreateEditProduct
          productId={
            editingProduct
              ? editingProduct.id
              : null
          }
          shopId={context.shop.id}
          disabled={!context.permission.includes("UPDATE_PRODUCT")}
          toggle={toggleModalProduct}
          isOpen={modal.createEditProduct}
          refetchData={updateTableKey}
        />

        <SellerReactTable
          showCheckbox
          showFilter
          title={t("product")}
          columns={columns}
          query={productQuery(productFragments.Product)}
          variables={{
            shop_id: context.shop.id,
            key: tableKey,
            sort_created_at: "desc"
          }}
          actionList={actionList}
          SubComponent={({ original }: { original: IProductFragmentProduct }) => {
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
  </>;
}
