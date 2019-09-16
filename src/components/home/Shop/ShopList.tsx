import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import Grid from '@material-ui/core/Grid';
import { Query } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import ShopCard from './ShopCard';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import withWidth from '@material-ui/core/withWidth';
import { WithWidth } from '@material-ui/core/withWidth/withWidth';
import { shopQuery } from '../../../graphql/query/ShopQuery';
import { shopFragments } from '../../../graphql/fragment/query/ShopFragment';

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

class ShopList extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithWidth,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithWidth
  ) {
    super(props);

    t = this.props.t;

    this.state = {
      sort_created_at: ''
    };
  }

  render() {
    let {
      classes,
      t,
      variables = {},
      gridProps,
      width,
      hideSort,
      disableLoadMore
    } = this.props;

    let variableKeys = Object.keys(variables);
    variableKeys.forEach((key: string) => {
      if (!variables[key]) delete variables[key];
    });
    if (!variableKeys.includes('limit')) {
      variables.limit = 30;
    }

    if (!variableKeys.includes('offset')) {
      variables.offset = 0;
    }

    if (this.state.sort_created_at)
      variables.sort_created_at = this.state.sort_created_at;

    gridProps = gridProps
      ? {
          xs: gridProps['xs'] || 12,
          sm: gridProps['sm'] || 6,
          md: gridProps['md'] || 4,
          lg: gridProps['lg'] || 2,
          xl: gridProps['xl'] || 2
        }
      : {
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2,
          xl: 2
        };

    return (
      <>
        <Grid container item xs={12}>
          <Query
            query={shopQuery(shopFragments.ShopList)}
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
                    {new Array(gridProps ? 12 / gridProps[width] : 6)
                      .fill(6)
                      .map((ele, index) => (
                        <Grid container item key={index} {...gridProps}>
                          <ShopCard loading />
                        </Grid>
                      ))}
                  </Grid>
                );

              let shops = data.shop.items;

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
                        offset: data.shop.items.length
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        prev.shop.items = prev.shop.items.concat(
                          fetchMoreResult.shop.items
                        );
                        prev.shop.cursor = fetchMoreResult.shop.cursor;
                        return prev;
                      }
                    });
                  }}
                  hasMore={!disableLoadMore && data.shop.cursor.hasPages}
                  loader={<CircularProgress size={20} />}
                >
                  <Grid container item xs={12} spacing={1}>
                    {shops.map((shop: any) => (
                      <Grid container item key={shop.id} {...gridProps}>
                        <ShopCard shop={shop} />
                      </Grid>
                    ))}
                    {shops.length === 0 && (
                      <Grid container item justify="center">
                        <Typography variant="h6">
                          {t("we can't find the product you're looking for.")}
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

export default withWidth()(
  withStyles(theme => ({
    root: {}
  }))(withTranslation()(withRouter(ShopList)))
);
