import React from 'react';
import Typography, {TypographyProps} from '@material-ui/core/Typography';

interface IProps extends TypographyProps {
    className?: string;
    address: {
        address_1: string;
        address_2: string;
        address_3: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
}

export default function Address(props: IProps) {
    const {
        className,
        color,
        gutterBottom,
        variant,
        address,
        component,
        display
    } = props;


    return <Typography
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
    </Typography>;
}