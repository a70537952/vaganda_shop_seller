import { makeStyles } from "@material-ui/core/styles/index";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Helmet from "../components/seller/Helmet";
import { AppContext } from "../contexts/Context";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import SellerReactTable from "../components/seller/SellerReactTable";
import Tooltip from "@material-ui/core/Tooltip";
import LocaleMoment from "../components/LocaleMoment";
import LinesEllipsis from "react-lines-ellipsis";
import StarRating from "../components/_rating/StarRating";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { sellerPath } from "../utils/RouteUtil";
import { userOrderDetailCommentQuery } from "../graphql/query/UserOrderDetailCommentQuery";
import { userOrderDetailQuery } from "../graphql/query/UserOrderDetailQuery";
import { userOrderDetailCommentFragments } from "../graphql/fragment/query/UserOrderDetailCommentFragment";
import { userOrderDetailFragments } from "../graphql/fragment/query/UserOrderDetailFragment";
import { IUserOrderDetailCommentFragmentDashboard } from "../graphql/fragmentType/query/UserOrderDetailCommentFragmentInterface";
import { IUserOrderDetailFragmentDashboard } from "../graphql/fragmentType/query/UserOrderDetailFragmentInterface";


const useStyles = makeStyles({
  card: {
    width: "100%",
    overflow: "auto"
  }
});

export default function Dashboard() {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();

  return <>
    <Helmet
      title={t("dashboard")}
      description={""}
      keywords={t("dashboard")}
      ogImage="/images/favicon-228.png"
    />
    <Grid container spacing={2}>
      {context.permission.includes("VIEW_SHOP_USER_ORDER_DETAIL") && (
        <Grid item xs={12} lg={6}>
          <Card className={classes.card}>
            <CardContent>
              <SellerReactTable
                title={t("latest order detail")}
                columns={[
                  {
                    id: "id",
                    Header: t("order detail id"),
                    accessor: (d: IUserOrderDetailFragmentDashboard) => d.id,
                    sortable: false
                  },
                  {
                    id: "product_title",
                    Header: t("product title") + " X " + t("quantity"),
                    sortable: false,
                    accessor: (d: IUserOrderDetailFragmentDashboard) =>
                      `${d.product_title} (${d.product_type_title}) X ${d.product_quantity}`
                  },
                  {
                    id: "order_detail_status",
                    Header: t("status"),
                    sortable: false,
                    accessor: (d: IUserOrderDetailFragmentDashboard) =>
                      t(
                        "global$$orderDetailStatus::" +
                        d.order_detail_status
                      )
                  },
                  {
                    id: "created_at",
                    Header: t("created at"),
                    accessor: (d: any) => d,
                    sortable: false,
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
                            <LocaleMoment showAll>
                              {value.created_at}
                            </LocaleMoment>
                          </div>
                        </Tooltip>
                      );
                    }
                  }
                ]}
                query={userOrderDetailQuery(
                  userOrderDetailFragments.Dashboard
                )}
                showPagination={false}
                variables={{
                  shop_id: context.shop.id,
                  sort_created_at: "desc"
                }}
                defaultPageSize={5}
              />
            </CardContent>
            <CardActions>
              <Grid container justify={"flex-end"}>
                <Button
                  size="small"
                  {...({
                    component: Link,
                    to: sellerPath("order")
                  } as any)}
                >
                  {t("view more")}
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      )}
      {context.permission.includes(
        "VIEW_SHOP_USER_ORDER_DETAIL_COMMENT"
      ) && (
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <SellerReactTable
                title={t("latest order comment")}
                columns={[
                  {
                    id: "user_order_detail.product_title",
                    Header: t("product title"),
                    sortable: false,
                    accessor: (d: IUserOrderDetailCommentFragmentDashboard) =>
                      d.user_order_detail.product_title
                  },
                  {
                    id: "comment",
                    Header: t("comment"),
                    sortable: false,
                    accessor: (d: IUserOrderDetailCommentFragmentDashboard) => d,
                    Cell: ({ value }: { value: IUserOrderDetailCommentFragmentDashboard }) => {
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
                    }
                  },
                  {
                    id: "star",
                    Header: t("star"),
                    sortable: false,
                    accessor: (d: IUserOrderDetailCommentFragmentDashboard) => (
                      <StarRating
                        size={"small"}
                        value={d.star}
                        readOnly
                      />
                    )
                  },
                  {
                    id: "created_at",
                    Header: t("created at"),
                    sortable: false,
                    accessor: (d: IUserOrderDetailCommentFragmentDashboard) => d,
                    Cell: ({ value }: { value: IUserOrderDetailCommentFragmentDashboard }) => {
                      return (
                        <Tooltip
                          title={
                            <LocaleMoment showAll showTime>
                              {value.created_at}
                            </LocaleMoment>
                          }
                        >
                          <div>
                            <LocaleMoment showAll>
                              {value.created_at}
                            </LocaleMoment>
                          </div>
                        </Tooltip>
                      );
                    }
                  }
                ]}
                query={userOrderDetailCommentQuery(
                  userOrderDetailCommentFragments.Dashboard
                )}
                showPagination={false}
                variables={{
                  shop_id: context.shop.id,
                  sort_created_at: "desc"
                }}
                defaultPageSize={5}
              />
            </CardContent>
            <CardActions>
              <Grid container justify={"flex-end"}>
                <Button
                  size="small"
                  {...({
                    component: Link,
                    to: sellerPath("orderComment")
                  } as any)}
                >
                  {t("view more")}
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      )}
    </Grid>
  </>;
}
