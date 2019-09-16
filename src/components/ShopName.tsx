import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { homePath } from '../utils/RouteUtil';
import { Link } from 'react-router-dom';

interface IProps {
  shop?: any;
  classes: any;
  className?: string;
  loading?: boolean;
  color?: any;
  gutterBottom?: boolean;
  variant?: any;
  withLink?: boolean;
  display?: 'initial' | 'block' | 'inline';
}

class ShopName extends React.Component<IProps, Readonly<any>> {
  render() {
    let {
      classes,
      className,
      shop,
      color,
      gutterBottom,
      variant,
      withLink,
      display
    } = this.props;

    let shopLink: any = {
      ...(withLink && shop && shop.shop_setting
        ? {
            component: Link,
            to: homePath('shopHome', {
              account: shop.shop_setting.find(
                (setting: any) => setting.title === 'account'
              ).value
            })
          }
        : ({} as any))
    };

    return (
      <Typography
        variant={variant}
        gutterBottom={gutterBottom}
        color={color}
        display={display}
        className={className}
        {...shopLink}
      >
        {shop.name}
      </Typography>
    );
  }
}

export default withStyles(theme => ({}))(ShopName);
