import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import Tooltip from "@material-ui/core/Tooltip";
import update from "immutability-helper";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Helmet from "../components/seller/Helmet";
import LocaleMoment from "../components/LocaleMoment";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { userOrderDetailCommentQuery } from "../graphql/query/UserOrderDetailCommentQuery";
import LinesEllipsis from "react-lines-ellipsis";
import Image from "../components/Image";
import ImagesCarousel from "../components/ImagesCarousel";
import StarRating from "../components/_rating/StarRating";
import { userOrderDetailCommentFragments } from "../graphql/fragment/query/UserOrderDetailCommentFragment";
import { IUserOrderDetailCommentFragmentOrderComment } from "../graphql/fragmentType/query/UserOrderDetailCommentFragmentInterface";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    overflow: "auto"
  }
}));

export default function OrderComment() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const [tableKey, setTableKey] = useState<any>(+new Date());
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean,
    imgSrc: string,
    currentIndex: number
  }>({
    isOpen: false,
    imgSrc: "",
    currentIndex: 0
  });

  function updateTableKey() {
    setTableKey(+new Date());
  }

  let columns = [
    {
      id: "user_order_detail_id",
      Header: t("order detail id"),
      accessor: (d: IUserOrderDetailCommentFragmentOrderComment) => d.user_order_detail_id,
      sortable: false,
      filterable: true,
      width: 50
    },
    {
      id: "user_order_detail.product_title",
      Header: t("product title"),
      sortable: false,
      filterable: false,
      accessor: (d: IUserOrderDetailCommentFragmentOrderComment) => d.user_order_detail.product_title
    },
    {
      id: "user_order_detail.product_type_title",
      Header: t("product type title"),
      sortable: false,
      filterable: false,
      accessor: (d: IUserOrderDetailCommentFragmentOrderComment) => d.user_order_detail.product_type_title
    },
    {
      id: "comment",
      Header: t("comment"),
      sortable: false,
      filterable: false,
      accessor: (d: any) => d,
      Cell: ({ value }: { value: IUserOrderDetailCommentFragmentOrderComment}) => {
        return (
          <Tooltip title={value.comment}>
            <div>
              <LinesEllipsis
                text={value.comment}
                maxLine="2"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
          </Tooltip>
        );
      },
      width: 200
    },
    {
      id: "withImage",
      sortable: false,
      filterable: true,
      Header: t("image"),
      accessor: (d: IUserOrderDetailCommentFragmentOrderComment) => d,
      width: 200,
      Cell: ({ value }: { value: IUserOrderDetailCommentFragmentOrderComment}) => {
        if (Boolean(value.user_order_detail_comment_image.length)) {
          return (
            <>
              <ImagesCarousel
                currentIndex={lightbox.currentIndex}
                onClose={() => {
                  setLightbox(
                    update(lightbox, {
                      isOpen: { $set: !lightbox.isOpen }
                    })
                  );
                }}
                views={value.user_order_detail_comment_image.map(
                  (commentImage) => ({
                    src: commentImage.image_original
                  })
                )}
                isOpen={lightbox.isOpen}
              />

              {value.user_order_detail_comment_image.map(
                (commentImage, index: number) => (
                  <Image
                    key={commentImage.id}
                    src={commentImage.image_medium}
                    style={{ height: "25px" }}
                    alt={value.user_order_detail.product_title}
                    onClick={() => {
                      setLightbox(
                        update(lightbox, {
                          isOpen: { $set: !lightbox.isOpen },
                          currentIndex: { $set: index }
                        })
                      );
                    }}
                    className={"img pointer"}
                  />
                )
              )}
            </>
          );
        } else {
          return <span>{t("no image")}</span>;
        }
      },
      filterType: "select",
      filterComponent: (props: any) => {
        return (
          <Select {...props}>
            <MenuItem value={""}>{t("all")}</MenuItem>
            <MenuItem value={true as any}>{t("with image")}</MenuItem>
          </Select>
        );
      },
      filterDirectly: true
    },
    {
      id: "star",
      Header: t("star"),
      sortable: false,
      filterable: true,
      accessor: (d: IUserOrderDetailCommentFragmentOrderComment) => (
        <StarRating size={"small"} value={d.star} readOnly/>
      ),
      filterType: "select",
      filterComponent: (props: any) => {
        return (
          <Select {...props}>
            <MenuItem value={""}>{t("all")}</MenuItem>
            {new Array(5).fill(6).map((data: string, index: number) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        );
      },
      width: 130
    },
    {
      id: "created_at",
      Header: t("created at"),
      accessor: (d: IUserOrderDetailCommentFragmentOrderComment) => d,
      Cell: ({ value }: { value: IUserOrderDetailCommentFragmentOrderComment}) => {
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
    }
  ];
  let actionList: any[] = [];

  return <>
    <Helmet
      title={t("order comment")}
      description={""}
      keywords={t("order comment")}
      ogImage="/images/favicon-228.png"
    />
    <Paper className={classes.root} elevation={1}>
      <Grid container justify={"center"}>
        <SellerReactTable
          showCheckbox
          showFilter
          title={t("order comment")}
          columns={columns}
          query={userOrderDetailCommentQuery(
            userOrderDetailCommentFragments.OrderComment
          )}
          variables={{
            shop_id: context.shop.id,
            key: tableKey,
            sort_created_at: "desc"
          }}
          actionList={actionList}
        />
      </Grid>
    </Paper>
  </>;
}