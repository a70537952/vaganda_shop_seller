import React, {CSSProperties} from 'react';
import LazyLoad from 'react-lazyload';

export interface IProps {
    className?: string;
    alt?: string;
    src?: string;
    title?: string;
    style?: CSSProperties;
    onClick?: () => void;
    height?: number;
    useLazyLoad?: boolean;
}

export default function Image(props: IProps) {
    const {
        className,
        alt,
        src,
        title,
        style,
        onClick,
        height,
        useLazyLoad
    } = props;

    let img = (
        <img
            className={className}
            alt={alt}
            src={src}
            title={title}
            style={style}
            onClick={onClick}
        />
    );

    if (useLazyLoad) {
        return <LazyLoad height={height}>{img}</LazyLoad>;
    }
    return img;
}