import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles/index";
import Tooltip from "@material-ui/core/Tooltip";
import update from "immutability-helper";
import { withSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import SellerHelmet from "../components/seller/SellerHelmet";
import LocaleMoment from "../components/LocaleMoment";
import SellerReactTable from "../components/seller/SellerReactTable";
import { AppContext } from "../contexts/Context";
import { RouteComponentProps } from "react-router";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { userOrderDetailCommentQuery } from "../graphql/query/UserOrderDetailCommentQuery";
import LinesEllipsis from "react-lines-ellipsis";
import Image from "../components/Image";
import ImagesCarousel from "../components/ImagesCarousel";
import StarRating from "../components/_rating/StarRating";
import { userOrderDetailCommentFragments } from "../graphql/fragment/query/UserOrderDetailCommentFragment";

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  tableKey: number;
  lightbox: {
    isOpen: boolean;
    imgSrc: string;
    currentIndex: number;
  };
}

class OrderComment extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    this.state = {
      tableKey: +new Date(),
      lightbox: {
        isOpen: false,
        imgSrc: '',
        currentIndex: 0
      }
    };
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
        id: 'user_order_detail_id',
        Header: t('order detail id'),
        accessor: (d: any) => d.user_order_detail_id,
        sortable: false,
        filterable: true,
        width: 50
      },
      {
        id: 'user_order_detail.product_title',
        Header: t('product title'),
        sortable: false,
        filterable: false,
        accessor: (d: any) => d.user_order_detail.product_title
      },
      {
        id: 'user_order_detail.product_type_title',
        Header: t('product type title'),
        sortable: false,
        filterable: false,
        accessor: (d: any) => d.user_order_detail.product_type_title
      },
      {
        id: 'comment',
        Header: t('comment'),
        sortable: false,
        filterable: false,
        accessor: (d: any) => d,
        Cell: ({ value }: any) => {
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
        id: 'withImage',
        sortable: false,
        filterable: true,
        Header: t('image'),
        accessor: (d: any) => d,
        width: 200,
        Cell: ({ value }: any) => {
          if (Boolean(value.user_order_detail_comment_image.length)) {
            return (
              <>
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
                  views={value.user_order_detail_comment_image.map(
                    (commentImage: any) => ({
                      src: commentImage.image_original
                    })
                  )}
                  isOpen={this.state.lightbox.isOpen}
                />

                {value.user_order_detail_comment_image.map(
                  (commentImage: any, index: number) => (
                    <Image
                      key={commentImage.id}
                      src={commentImage.image_medium}
                      style={{ height: '25px' }}
                      alt={value.user_order_detail.product_title}
                      onClick={() => {
                        this.setState(
                          update(this.state, {
                            lightbox: {
                              isOpen: { $set: !this.state.lightbox.isOpen },
                              currentIndex: { $set: index }
                            }
                          })
                        );
                      }}
                      className={'img pointer'}
                    />
                  )
                )}
              </>
            );
          } else {
            return <span>{t('no image')}</span>;
          }
        },
        filterType: 'select',
        filterComponent: (props: any) => {
          return (
            <Select {...props}>
              <MenuItem value={''}>{t('all')}</MenuItem>
              <MenuItem value={true as any}>{t('with image')}</MenuItem>
            </Select>
          );
        },
        filterDirectly: true
      },
      {
        id: 'star',
        Header: t('star'),
        sortable: false,
        filterable: true,
        accessor: (d: any) => (
          <StarRating size={'small'} value={d.star} readOnly />
        ),
        filterType: 'select',
        filterComponent: (props: any) => {
          return (
            <Select {...props}>
              <MenuItem value={''}>{t('all')}</MenuItem>
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
      }
    ];
    let actionList: any[] = [];

    return (
      <AppContext.Consumer>
        {context => (
          <>
            <SellerHelmet
              title={t('order comment')}
              description={''}
              keywords={t('order comment')}
              ogImage="/images/favicon-228.png"
            />

            <Paper className={classes.root} elevation={1}>
              <Grid container justify={'center'}>
                <SellerReactTable
                  showCheckbox
                  showFilter
                  title={t('order comment')}
                  columns={columns}
                  query={userOrderDetailCommentQuery(
                    userOrderDetailCommentFragments.OrderComment
                  )}
                  variables={{
                    shop_id: context.shop.id,
                    key: this.state.tableKey,
                    sort_created_at: 'desc'
                  }}
                  actionList={actionList}
                />
              </Grid>
            </Paper>
          </>
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
  }
}))(withSnackbar(withTranslation()(withRouter(OrderComment))));
