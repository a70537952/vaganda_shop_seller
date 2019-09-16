import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { WithTranslation, withTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import { homePath } from '../../../utils/RouteUtil';
import Image from '../../Image';
import ProductTitle from '../../ProductTitle';

interface IProps extends StyledComponentProps {
  classes: any;
  product?: any;
  className?: string;
  loading?: boolean;
}

class ProductCard extends React.Component<
  IProps & WithTranslation,
  Readonly<any>
> {
  renderPrice() {
    let { classes, className, product } = this.props;

    let sortProductType = product.product_type.sort(
      (a: any, b: any) => a.final_price - b.final_price
    );
    let priceString =
      sortProductType[0].currency + ' ' + sortProductType[0].final_price;
    if (
      sortProductType[1] &&
      sortProductType[0].final_price !==
        sortProductType[sortProductType.length - 1].final_price
    ) {
      // multiple product type
      priceString +=
        ' ~ ' +
        sortProductType[sortProductType.length - 1].currency +
        ' ' +
        sortProductType[sortProductType.length - 1].final_price;
      return (
        <Typography
          variant="body2"
          color="primary"
          gutterBottom
          className={classes.price}
        >
          {priceString}
        </Typography>
      );
    } else {
      if (sortProductType[0].discount_amount > 0) {
        // has discount
        return (
          <>
            <Typography
              variant="body1"
              gutterBottom
              className={classes.price}
              style={{ textDecoration: 'line-through', color: '#929292' }}
            >
              {sortProductType[0].currency + ' ' + sortProductType[0].price}
            </Typography>
            &nbsp;
            <Typography
              variant="body1"
              color="primary"
              gutterBottom
              className={classes.price}
            >
              {priceString}
            </Typography>
            {/*{sortProductType[0].discount_unit === 'Percentage' &&*/}
            {/*<div>*/}
            {/*<Typography variant="body2" gutterBottom>*/}
            {/*-{sortProductType[0].discount}%*/}
            {/*</Typography>*/}
            {/*</div>*/}
            {/*}*/}
          </>
        );
      } else {
        return (
          <Typography
            variant="body1"
            color="primary"
            gutterBottom
            className={classes.price}
          >
            {priceString}
          </Typography>
        );
      }
    }
  }

  render() {
    let { classes, className, product, t, loading } = this.props;

    return (
      <Paper className={classes.productCard} elevation={1}>
        <Grid
          container
          item
          className={classes.productImageContainer}
          style={{ backgroundColor: loading ? 'inherit' : '#000' }}
        >
          {loading ? (
            <Skeleton variant={'rect'} height={200} width={'100%'} />
          ) : (
            <Link
              style={{ width: '100%' }}
              to={
                loading ? '#' : homePath('product', { productId: product.id })
              }
            >
              <Image
                className={classes.productImage}
                useLazyLoad
                alt={product.title}
                src={product.product_image[0].image_medium}
              />
            </Link>
          )}
        </Grid>
        <Grid container item className={classes.productContent} spacing={1}>
          <Grid container item xs={12}>
            {loading ? (
              <Skeleton height={20} width={150} />
            ) : (
              <ProductTitle
                variant="subtitle1"
                withLink
                color={'inherit'}
                product={product}
              />
            )}
          </Grid>
          <Grid container item xs={12}>
            {loading ? (
              <Skeleton height={20} width={100} />
            ) : (
              this.renderPrice()
            )}
          </Grid>
          {loading ? (
            <Grid container item>
              <Skeleton height={20} width={130} />
            </Grid>
          ) : (
            <>
              {product && !product.is_publish && (
                <Grid container item>
                  <Typography variant="body2" color="error" gutterBottom>
                    {t('unpublished product')}&nbsp;
                  </Typography>
                  <Tooltip
                    title={t(
                      'only shop admin with view product permission can view this product'
                    )}
                  >
                    <HelpIcon fontSize="small" color="primary" />
                  </Tooltip>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(theme => ({
  productImageContainer: {},
  productCard: {
    width: '100%',
    position: 'relative',
    paddingBottom: theme.spacing(1)
  },
  productImage: {
    width: '100%',
    objectFit: 'contain',
    minHeight: '200px'
  },
  productContent: {
    padding: '5px'
  }
}))(withTranslation()(ProductCard));
