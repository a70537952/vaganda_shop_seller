import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

interface IProps extends TypographyProps {
  classes: any;
  className?: string;
  address: any;
}

class Address extends React.Component<IProps, Readonly<any>> {
  render() {
    let {
      classes,
      className,
      color,
      gutterBottom,
      variant,
      address,
      component,
      display
    } = this.props;
    classes = classes || {};

    return (
      <Typography
        variant={variant}
        display={display}
        gutterBottom={gutterBottom}
        color={color}
        component={component}
        className={className}
      >
        {Boolean(address.address_1) && address.address_1 + ', '}
        {Boolean(address.address_2) && address.address_2 + ', '}
        {Boolean(address.address_3) && address.address_3 + ', '}
        {Boolean(address.city) && address.city + ', '}
        {Boolean(address.state) && address.state + ', '}
        {Boolean(address.postal_code) && address.postal_code + ', '}
        {Boolean(address.country) && address.country}
      </Typography>
    );
  }
}

export default withStyles(theme => ({}))(Address);
