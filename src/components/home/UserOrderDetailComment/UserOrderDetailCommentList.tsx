import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Query } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserOrderDetailCommentCard from './UserOrderDetailCommentCard';
import LazyLoad from 'react-lazyload';
import Pagination from '../../Pagination';
import StarRating from '../../_rating/StarRating';
import { userOrderDetailCommentQuery } from '../../../graphql/query/UserOrderDetailCommentQuery';
import { userOrderDetailCommentFragments } from '../../../graphql/fragment/query/UserOrderDetailCommentFragment';

let t;

interface IProps {
  classes: any;
  variables?: any;
  gridProps?: any;
  hideSort?: boolean;
  disableLoadMore?: boolean;
  product_rating?: number;
  one_star_comment_count?: number;
  two_star_comment_count?: number;
  three_star_comment_count?: number;
  four_star_comment_count?: number;
  five_star_comment_count?: number;
}

interface IState {
  sort_created_at: 'desc' | 'asc' | '';
  where_star: 1 | 2 | 3 | 4 | 5 | '';
  withImage: boolean | '';
}

class UserOrderDetailCommentList extends React.Component<
  IProps & WithTranslation,
  IState
> {
  constructor(props: IProps & WithTranslation) {
    super(props);

    t = this.props.t;

    this.state = {
      sort_created_at: 'desc',
      where_star: '',
      withImage: ''
    };
  }

  clearFilter() {
    this.setState({
      sort_created_at: '',
      where_star: '',
      withImage: ''
    });
  }

  render() {
    let {
      classes,
      t,
      variables = {},
      gridProps,
      hideSort,
      disableLoadMore,
      product_rating,
      one_star_comment_count,
      two_star_comment_count,
      three_star_comment_count,
      four_star_comment_count,
      five_star_comment_count
    } = this.props;

    let variableKeys = Object.keys(variables);
    variableKeys.forEach((key: string) => {
      if (!variables[key]) delete variables[key];
    });
    if (!variableKeys.includes('limit')) {
      variables.limit = 10;
    }

    if (!variableKeys.includes('offset')) {
      variables.offset = 0;
    }

    if (this.state.where_star) variables.star = this.state.where_star;
    if (this.state.sort_created_at)
      variables.sort_created_at = this.state.sort_created_at;
    variables.withImage = this.state.withImage;

    gridProps = gridProps
      ? {
          xs: gridProps['xs'] || 12,
          sm: gridProps['sm'] || 12,
          md: gridProps['md'] || 12,
          lg: gridProps['lg'] || 12,
          xl: gridProps['xl'] || 12
        }
      : {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12
        };

    return (
      <Grid container item spacing={1}>
        {!hideSort && (
          <Grid container item xs={12}>
            <Paper
              square
              className={classes.userOrderDetailCommentActionContainer}
              elevation={0}
            >
              <Grid
                container
                item
                xs={12}
                alignItems="center"
                spacing={2}
                style={{ height: '100%' }}
              >
                <Grid container item xs={12} md={3} lg={2} justify={'center'}>
                  <Grid container item xs={12} spacing={1}>
                    {product_rating ? (
                      <>
                        <Grid
                          container
                          item
                          xs={12}
                          justify={'center'}
                          alignItems={'center'}
                        >
                          <Typography
                            component={'span'}
                            color={'primary'}
                            display="inline"
                            align={'center'}
                            variant="h4"
                          >
                            {product_rating} {t('star')}
                          </Typography>
                        </Grid>
                        <Grid container item xs={12} justify={'center'}>
                          <StarRating
                            size={'large'}
                            value={product_rating}
                            precision={0.1}
                            readOnly
                          />
                        </Grid>
                      </>
                    ) : (
                      <Typography variant="subtitle1" align={'center'}>
                        {t('sort by')}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid container item xs={12} md={9} lg={10} spacing={2}>
                  <Grid item>
                    <Button
                      variant={
                        this.state.sort_created_at === 'desc'
                          ? 'contained'
                          : 'outlined'
                      }
                      color={'primary'}
                      fullWidth
                      onClick={async (e: any) => {
                        if (this.state.sort_created_at !== 'desc') {
                          await this.clearFilter();
                          await this.setState({
                            sort_created_at: 'desc'
                          });
                        }
                      }}
                      className={classes.filterButton}
                    >
                      {t('latest')}
                    </Button>
                  </Grid>
                  {new Array(5)
                    .fill(0)
                    .map((element: number, index: number) => {
                      let star: any = index + 1;
                      let starCount = null;

                      if (star === 1 && one_star_comment_count) {
                        starCount = one_star_comment_count;
                      }
                      if (star === 2 && two_star_comment_count) {
                        starCount = two_star_comment_count;
                      }
                      if (star === 3 && three_star_comment_count) {
                        starCount = three_star_comment_count;
                      }
                      if (star === 4 && four_star_comment_count) {
                        starCount = four_star_comment_count;
                      }
                      if (star === 5 && five_star_comment_count) {
                        starCount = five_star_comment_count;
                      }

                      return (
                        <Grid item key={index}>
                          <Button
                            variant={
                              this.state.where_star === star
                                ? 'contained'
                                : 'outlined'
                            }
                            color={'primary'}
                            fullWidth
                            onClick={async (e: any) => {
                              if (!this.state.withImage) {
                                await this.clearFilter();
                                await this.setState({
                                  where_star: star
                                });
                              }
                            }}
                            className={classes.filterButton}
                          >
                            {star} {t('star')}&nbsp;
                            {starCount && <>({starCount})</>}
                          </Button>
                        </Grid>
                      );
                    })}

                  <Grid item>
                    <Button
                      variant={this.state.withImage ? 'contained' : 'outlined'}
                      color={'primary'}
                      fullWidth
                      onClick={async (e: any) => {
                        if (!this.state.withImage) {
                          await this.clearFilter();
                          await this.setState({
                            withImage: true
                          });
                        }
                      }}
                      className={classes.filterButton}
                    >
                      {t('with image')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
        <Grid container item xs={12}>
          <LazyLoad>
            <Query
              query={userOrderDetailCommentQuery(
                userOrderDetailCommentFragments.UserOrderDetailCommentList
              )}
              variables={{
                ...variables
              }}
              notifyOnNetworkStatusChange={true}
              fetchPolicy="network-only"
            >
              {({ loading, error, data, fetchMore }) => {
                if (error) return <>Error!</>;
                if (loading)
                  return (
                    <Grid container item xs={12} spacing={1}>
                      {new Array(2).fill(6).map((ele, index) => (
                        <Grid container item key={index} {...gridProps}>
                          <UserOrderDetailCommentCard loading />
                        </Grid>
                      ))}
                    </Grid>
                  );

                let userOrderDetailComments = data.userOrderDetailComment.items;
                let cursor = data.userOrderDetailComment.cursor;
                let pageSize = variables.limit;

                return (
                  <>
                    <Grid container item xs={12} spacing={1}>
                      {userOrderDetailComments.map(
                        (userOrderDetailComment: any) => (
                          <Grid
                            container
                            item
                            key={userOrderDetailComment.id}
                            {...gridProps}
                          >
                            <UserOrderDetailCommentCard
                              userOrderDetailComment={userOrderDetailComment}
                            />
                          </Grid>
                        )
                      )}
                      {userOrderDetailComments.length === 0 && (
                        <Grid container item justify="center">
                          <Typography variant="h6">
                            {t('no comment yet')}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                    <Grid container item xs={12} justify={'flex-end'}>
                      <Pagination
                        total={cursor.total}
                        rowsPerPage={pageSize}
                        changePage={(e, page) => {
                          fetchMore({
                            variables: {
                              offset: page * pageSize
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                              if (!fetchMoreResult) return prev;
                              prev.userOrderDetailComment.items =
                                fetchMoreResult.userOrderDetailComment.items;
                              prev.userOrderDetailComment.cursor =
                                fetchMoreResult.userOrderDetailComment.cursor;
                              return prev;
                            }
                          });
                        }}
                        page={cursor.currentPage}
                        rowsPerPageOptions={[pageSize]}
                      />
                    </Grid>
                  </>
                );
              }}
            </Query>
          </LazyLoad>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(theme => ({
  userOrderDetailCommentActionContainer: {
    width: '100%',
    backgroundColor: '#ebebeb',
    padding: '12px 24px'
  },
  filterButton: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))(withTranslation()(UserOrderDetailCommentList));
