import React from 'react';
import Typography from '@material-ui/core/Typography';
import {homePath} from '../utils/RouteUtil';
import {Link} from 'react-router-dom';

interface IProps {
    shop?: any;
    className?: string;
    loading?: boolean;
    color?: any;
    gutterBottom?: boolean;
    variant?: any;
    withLink?: boolean;
    display?: 'initial' | 'block' | 'inline';
}

export default function ShopName(props: IProps) {
    const {
        className,
        shop,
        color,
        gutterBottom,
        variant,
        withLink,
        display
    } = props;

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

    return <Typography
        variant={variant}
        gutterBottom={gutterBottom}
        color={color}
        display={display}
        className={className}
        {...shopLink}
    >
        {shop.name}
    </Typography>;
}
