import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import Grid from '@material-ui/core/Grid';
import { Query } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ProductCard from './ProductCard';
import { productQuery, ProductVars } from '../../../graphql/query/ProductQuery';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import withWidth from '@material-ui/core/withWidth';
import { WithWidth } from '@material-ui/core/withWidth/withWidth';
import { WithPagination } from '../../../graphql/query/Query';
import { productFragments } from '../../../graphql/fragment/query/ProductFragment';
import { IProductFragmentProductList } from '../../../graphql/fragment/interface/ProductFragmentInterface';

let t;

interface IProps {
  classes: any;
  variables?: any;
  gridProps?: any;
  hideSort?: boolean;
  disableLoadMore?: boolean;
}

interface IState {
  sort_price: 'desc' | 'asc' | '';
  sort_created_at: 'desc' | 'asc' | '';
}

class ProductList extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithWidth,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithWidth
  ) {
    super(props);

    t = this.props.t;

    this.state = {
      sort_created_at: '',
      sort_price: ''
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

    if (this.state.sort_price) variables.sort_price = this.state.sort_price;
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
        {!hideSort && (
          <Grid container item xs={12}>
            <Paper
              square
              className={classes.productActionContainer}
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
                <Grid item xs={4} md={1}>
                  <Typography variant="subtitle1">{t('sort by')}</Typography>
                </Grid>
                <Grid item xs={4} md={2}>
                  <Button
                    variant="contained"
                    color={
                      this.state.sort_created_at === 'desc'
                        ? 'primary'
                        : 'default'
                    }
                    fullWidth
                    onClick={(e: any) => {
                      this.setState({
                        sort_created_at: 'desc'
                      });
                    }}
                  >
                    {t('latest')}
                  </Button>
                </Grid>
                <Grid item xs={4} md={3}>
                  <Select
                    fullWidth
                    displayEmpty
                    value={this.state.sort_price}
                    onChange={(e: any) => {
                      this.setState({
                        sort_price: e.target.value
                      });
                    }}
                    inputProps={{
                      name: 'price',
                      id: 'price'
                    }}
                  >
                    <MenuItem value="">
                      <em>{t('price')}</em>
                    </MenuItem>
                    <MenuItem value={'asc'}>{t('price: low to high')}</MenuItem>
                    <MenuItem value={'desc'}>
                      {t('price: high to low')}
                    </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
        <Grid container item xs={12}>
          <Query<
            { product: WithPagination<IProductFragmentProductList> },
            ProductVars
          >
            query={productQuery(productFragments.ProductList)}
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
                          <ProductCard loading />
                        </Grid>
                      ))}
                  </Grid>
                );

              if (!data) {
                return null;
              }

              let products: IProductFragmentProductList[] = data.product.items;

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
                        offset: data.product.items.length
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        prev.product.items = prev.product.items.concat(
                          fetchMoreResult.product.items
                        );
                        prev.product.cursor = fetchMoreResult.product.cursor;
                        return prev;
                      }
                    });
                  }}
                  hasMore={!disableLoadMore && data.product.cursor.hasPages}
                  loader={<CircularProgress size={20} />}
                >
                  <Grid container item xs={12} spacing={1}>
                    {products.map((product: any) => (
                      <Grid container item key={product.id} {...gridProps}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                    {products.length === 0 && (
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
    productActionContainer: {
      width: '100%',
      height: '60px',
      backgroundColor: '#ebebeb',
      padding: '12px 24px'
    }
  }))(withTranslation()(withRouter(ProductList)))
);
