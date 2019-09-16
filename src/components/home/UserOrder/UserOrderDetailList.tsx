import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import Grid from '@material-ui/core/Grid';
import { Query } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import UserOrderDetailCard from './UserOrderDetailCard';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import { userOrderDetailQuery } from '../../../graphql/query/UserOrderDetailQuery';
import { userOrderDetailFragments } from '../../../graphql/fragment/query/UserOrderDetailFragment';

let t;

interface IProps {
  classes: any;
  variables?: any;
  gridProps?: any;
  hideSort?: boolean;
  disableLoadMore?: boolean;
}

interface IState {
  sort_created_at: 'desc' | 'asc' | '';
}

class UserOrderDetailList extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(props: IProps & RouteComponentProps & WithTranslation) {
    super(props);

    t = this.props.t;

    this.state = {
      sort_created_at: 'desc'
    };
  }

  render() {
    let {
      classes,
      t,
      variables = {},
      gridProps,
      hideSort,
      disableLoadMore
    } = this.props;

    let variableKeys = Object.keys(variables);
    variableKeys.forEach((key: string) => {
      if (!variables[key]) delete variables[key];
    });
    if (!variableKeys.includes('limit')) {
      variables.limit = 15;
    }

    if (!variableKeys.includes('offset')) {
      variables.offset = 0;
    }

    if (this.state.sort_created_at)
      variables.sort_created_at = this.state.sort_created_at;

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
      <>
        <Grid container item xs={12}>
          <Query
            query={userOrderDetailQuery(
              userOrderDetailFragments.UserOrderDetailList
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
                    {new Array(3).fill(6).map((ele, index) => (
                      <Grid container item key={index} {...gridProps}>
                        <UserOrderDetailCard loading />
                      </Grid>
                    ))}
                  </Grid>
                );

              let userOrderDetails = data.userOrderDetail.items;

              return (
                <InfiniteScroll
                  style={{ width: '100%' }}
                  pageStart={0}
                  initialLoad={false}
                  threshold={300}
                  loadMore={() => {
                    if (loading) return;
                    fetchMore({
                      variables: {
                        offset: data.userOrderDetail.items.length
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        prev.userOrderDetail.items = prev.userOrderDetail.items.concat(
                          fetchMoreResult.userOrderDetail.items
                        );
                        prev.userOrderDetail.cursor =
                          fetchMoreResult.userOrderDetail.cursor;
                        return prev;
                      }
                    });
                  }}
                  hasMore={
                    !disableLoadMore && data.userOrderDetail.cursor.hasPages
                  }
                  loader={<CircularProgress size={20} />}
                >
                  <Grid container item xs={12} spacing={1}>
                    {userOrderDetails.map((userOrderDetail: any) => (
                      <Grid
                        container
                        item
                        key={userOrderDetail.id}
                        {...gridProps}
                      >
                        <UserOrderDetailCard
                          userOrderDetail={userOrderDetail}
                        />
                      </Grid>
                    ))}
                    {userOrderDetails.length === 0 && (
                      <Grid container item justify="center">
                        <Typography variant="h6">
                          {t("we can't find any order.")}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </InfiniteScroll>
              );
            }}
          </Query>
        </Grid>
      </>
    );
  }
}

export default withStyles(theme => ({
  root: {}
}))(withTranslation()(withRouter(UserOrderDetailList)));
