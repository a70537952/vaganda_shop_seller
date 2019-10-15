import Avatar from '@material-ui/core/Avatar';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Store from '@material-ui/icons/Store';
import classnames from 'classnames';
import React from 'react';
import {StyledComponentProps} from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';
import {homePath} from '../utils/RouteUtil';


interface IProps extends StyledComponentProps {
    shop: {
        id: string
        shop_info: {
            logo: string;
            logo_original?: string
            logo_small?: string;
            logo_medium?: string;
            logo_large?: string;
            logo_extra?: string;
        }
        [key: string] : any
    };
    className?: string;
    withLink?: boolean;
    imageSize?:
        | 'logo_original'
        | 'logo_small'
        | 'logo_medium'
        | 'logo_large'
        | 'logo_extra';
    size?: number;
}


export default function ShopLogo(props: IProps) {
    const {
        className, shop, withLink, imageSize, size
    } = props;
    let logoSize = size || 30;
    let style = {
        width: logoSize,
        height: logoSize
    };


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

    let imageKey = imageSize || 'logo_medium';

    return <React.Fragment>
        {shop ? (
            <React.Fragment>
                {shop.shop_info &&
                shop.shop_info.logo &&
                shop.shop_info[imageKey] ? (
                    <Avatar
                        src={shop.shop_info[imageKey]}
                        className={className} style={style}
                        {...shopLink}
                    />
                ) : (
                    <Avatar className={className} style={style} {...shopLink}>
                        {shop.name[0].toUpperCase()}
                    </Avatar>
                )}
            </React.Fragment>
        ) : (
            <React.Fragment>
                <Store className={className} style={style}/>
            </React.Fragment>
        )}
    </React.Fragment>;
}