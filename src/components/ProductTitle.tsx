import React from 'react';
import {StyledComponentProps} from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import {homePath} from '../utils/RouteUtil';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

interface IProps extends StyledComponentProps {
    product?: any;
    className?: string;
    loading?: boolean;
    color?: any;
    gutterBottom?: boolean;
    variant?: any;
    withLink?: boolean;
    display?: 'initial' | 'block' | 'inline';
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

export default function ProductTitle(props: IProps) {
    const {
        className,
        product,
        color,
        align,
        gutterBottom,
        variant,
        withLink,
        display
    } = props;

    let productLink: any = {
        ...((withLink && product && product.id
            ? {
                component: Link,
                to: homePath('product', {productId: product.id})
            }
            : {}) as any)
    };

    return <Typography
        variant={variant}
        className={classNames(className, {
            pointer: withLink
        })}
        gutterBottom={gutterBottom}
        color={color}
        align={align}
        display={display}
        {...productLink}
    >
        {product.title}
    </Typography>;
}
