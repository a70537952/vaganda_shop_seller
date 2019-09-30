import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import update from "immutability-helper";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import { useTranslation } from "react-i18next";
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
import useToast from "../../_hook/useToast";
import { WithPagination } from "../../../graphql/query/Query";
import { useUpdateUserOrderDetailMutation } from "../../../graphql/mutation/userOrderDetailMutation/UpdateUserOrderDetailMutation";
import { IUserOrderDetailFragmentModalUpdateUserOrderDetail } from "../../../graphql/fragmentType/query/UserOrderDetailFragmentInterface";
import { userOrderDetailQuery, UserOrderDetailVars } from "../../../graphql/query/UserOrderDetailQuery";
import useForm from "../../_hook/useForm";
import DialogConfirm from "../../_dialog/DialogConfirm";

interface IProps {
  orderDetailId: string;
  shopId: string;
  disabled?: boolean;
  refetchData?: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  contentContainer: {
    margin: 0
  },
  actionButtonContainer: {
    marginTop: theme.spacing(2)
  }
}));

export default function ModalUpdateUserOrderDetail(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const client = useApolloClient();
  const {
    value, error, disable,
    setDisable, setValue,
    validate, checkApolloError, resetValue
  } = useForm({
    order_detail_status: {
      value: "",
      emptyMessage: t("please select order detail status")
    },
    product_shipping_track_number: {
      value: ""
    },
    remark: {
      value: ""
    }
  });
  const {
    orderDetailId,
    shopId,
    disabled,
    toggle,
    isOpen
  } = props;

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [rawUserOrderDetail, setRawUserOrderDetail] = useState<IUserOrderDetailFragmentModalUpdateUserOrderDetail | null>(null);
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean,
    imgSrc: string,
    currentIndex: number
  }>({
    isOpen: false,
    imgSrc: "",
    currentIndex: 0
  });

  const [
    updateUserOrderDetailMutation,
    { loading: isUpdatingUserOrderDetailMutation }
  ] = useUpdateUserOrderDetailMutation<IUserOrderDetailFragmentModalUpdateUserOrderDetail>(userOrderDetailFragments.ModalUpdateUserOrderDetail, {
    onCompleted: () => {
      toast.default(
        t("order ID {{id}} successfully updated", {
          id: orderDetailId
        })
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkApolloError(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getUserOrderDetail();
  }, [isOpen, orderDetailId]);

  async function getUserOrderDetail() {
    if (orderDetailId && isOpen) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ userOrderDetail: WithPagination<IUserOrderDetailFragmentModalUpdateUserOrderDetail> },
        UserOrderDetailVars>({
        query: userOrderDetailQuery(userOrderDetailFragments.ModalUpdateUserOrderDetail),
        variables: { id: orderDetailId }
      });

      let userOrderDetailData = data.userOrderDetail.items[0];
      setValue("order_detail_status", userOrderDetailData.order_detail_status);
      setValue("product_shipping_track_number", userOrderDetailData.product_shipping_track_number);
      setValue("remark", userOrderDetailData.remark);
      setDisable("", disabled);
      setRawUserOrderDetail(userOrderDetailData);
      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setRawUserOrderDetail(null);
    resetValue();
  }

  function handleCancelCloseDialog() {
    setIsCloseDialogOpen(false);
  }

  async function handleOkCloseDialog() {
    resetStateData();
    setIsCloseDialogOpen(false);
    await toggle();
  }

  function toggleCloseDialog() {
    setIsCloseDialogOpen(true);
  }

  async function updateUserOrderDetail() {
    if (await validate()) {
      updateUserOrderDetailMutation({
        variables: {
          user_order_detail_id: orderDetailId,
          shop_id: shopId,
          order_detail_status: value.order_detail_status,
          product_shipping_track_number: value.product_shipping_track_number,
          remark: value.remark
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={t("cancel update order detail")}
                   content={t("are you sure cancel update order detail?")}
                   onConfirm={handleOkCloseDialog}/>
    <Modal
      disableAutoFocus
      open={isOpen}
      onClose={toggleCloseDialog}
      maxWidth={"md"}
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
        {isDataLoaded && rawUserOrderDetail ? (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("order detail id")}
                value={rawUserOrderDetail.order_id}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <UserOrderDetailStatusSelect
                fullWidth
                label={t("order detail status")}
                error={Boolean(error.order_detail_status)}
                helperText={error.order_detail_status}
                required
                value={value.order_detail_status}
                onChange={(value: unknown) => {
                  setValue("order_detail_status", value);
                }}
                only={[
                  USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                  USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                ]}
                disabled={
                  disable.order_detail_status ||
                  ![
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID,
                    USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                  ].includes(
                    value.order_detail_status
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="inherit">
                {t("product info")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("product title")}
                value={rawUserOrderDetail.product_title}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("product type")}
                value={rawUserOrderDetail.product_type_title}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("quantity")}
                value={rawUserOrderDetail.product_quantity}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="inherit">
                {t("price info")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("product cost")}
                value={
                  rawUserOrderDetail.product_cost_currency +
                  " " +
                  rawUserOrderDetail.product_cost
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("product unit price")}
                value={
                  rawUserOrderDetail.product_unit_price_currency +
                  " " +
                  rawUserOrderDetail.product_unit_price
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("product discount")}
                value={
                  rawUserOrderDetail
                    .product_discount_unit ===
                  PRODUCT.DISCOUNT_UNIT.PERCENTAGE
                    ? rawUserOrderDetail.product_discount +
                    "%"
                    : rawUserOrderDetail
                      .product_unit_price_currency +
                    " " +
                    rawUserOrderDetail.product_discount
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("product final price")}
                value={
                  rawUserOrderDetail
                    .product_unit_price_currency +
                  " " +
                  rawUserOrderDetail.product_final_price
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={
                  t("product total price") +
                  `(${t("final price X quantity")})`
                }
                value={
                  rawUserOrderDetail.product_unit_price_currency +
                  " " +
                  rawUserOrderDetail.product_total_price
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="inherit">
                {t("shipping info")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("shipping")}
                value={
                  rawUserOrderDetail.product_shipping_title
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("shipping country")}
                value={
                  t(
                    "global$$countryKey::" +
                    rawUserOrderDetail
                      .product_shipping_country
                  ) as string
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={t("shipping fee")}
                value={
                  rawUserOrderDetail
                    .product_shipping_currency +
                  " " +
                  rawUserOrderDetail.product_shipping_fee
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label={
                  t("total shipping fee") +
                  `(${t("shipping fee X quantity")})`
                }
                value={
                  rawUserOrderDetail
                    .product_shipping_currency +
                  " " +
                  rawUserOrderDetail
                    .product_total_shipping_fee
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={disable.product_shipping_track_number}
                error={Boolean(error.product_shipping_track_number)}
                label={t("shipping track number")}
                value={value.product_shipping_track_number}
                onChange={(e) => {
                  setValue("product_shipping_track_number", e.target.value);
                }}
                helperText={error.product_shipping_track_number}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="inherit">
                {t("other info")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                label={t("message from buyer")}
                value={rawUserOrderDetail.message}
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={disable.remark}
                error={Boolean(error.remark)}
                label={t("remark")}
                value={value.remark}
                onChange={(e) => {
                  setValue("remark", e.target.value);
                }}
                helperText={error.remark}
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
              <FormHelperText error={false}>
                {t(
                  "remark will only show to admin and will not show to public"
                )}
              </FormHelperText>
            </Grid>
            {Boolean(rawUserOrderDetail.is_commented) && (
              <>
                <Grid container item xs={12} alignItems={"center"}>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    display="inline"
                  >
                    {t("buyer comment")}&nbsp;
                  </Typography>
                  <StarRating
                    size={"small"}
                    value={rawUserOrderDetail.order_detail_comment.star}
                    readOnly
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("comment")}
                    disabled
                    value={rawUserOrderDetail.order_detail_comment.comment}
                    fullWidth
                    multiline
                  />
                </Grid>
                <Grid item xs={12}>
                  {Boolean(
                    rawUserOrderDetail.order_detail_comment
                      .user_order_detail_comment_image.length
                  ) && (
                    <Grid container item xs={12} spacing={1}>
                      <ImagesCarousel
                        currentIndex={lightbox.currentIndex}
                        onClose={() => {
                          setLightbox(
                            update(lightbox, {
                              isOpen: { $set: !lightbox.isOpen }
                            })
                          );
                        }}
                        views={rawUserOrderDetail.order_detail_comment.user_order_detail_comment_image.map(
                          (commentImage) => ({
                            src: commentImage.image_original
                          })
                        )}
                        isOpen={lightbox.isOpen}
                      />
                      {rawUserOrderDetail.order_detail_comment.user_order_detail_comment_image.map(
                        (commentImage, index: number) => (
                          <Grid key={commentImage.id} item>
                            <Image
                              src={commentImage.image_medium}
                              style={{ height: "65px" }}
                              alt={
                                rawUserOrderDetail
                                  .product_title
                              }
                              onClick={() => {
                                setLightbox(
                                  update(lightbox, {
                                    isOpen: {
                                      $set: !lightbox
                                        .isOpen
                                    },
                                    currentIndex: { $set: index }
                                  })
                                );
                              }}
                              className={"img pointer"}
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
                  onClick={toggleCloseDialog}
                  color="primary"
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item>
                {context.permission.includes(
                  "UPDATE_SHOP_USER_ORDER_DETAIL"
                ) && orderDetailId && (
                  <>
                    {isUpdatingUserOrderDetailMutation ?
                      <Button
                        disabled
                        variant="contained"
                        color="primary"
                      >
                        {t("editing...")}
                      </Button>
                      :
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={updateUserOrderDetail}
                      >
                        {t("update user order detail")}
                      </Button>
                    }
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
                  <Skeleton variant={"rect"} height={50}/>
                </Grid>
              );
            })}
          </React.Fragment>
        )}
      </Grid>
    </Modal>
  </>;
}