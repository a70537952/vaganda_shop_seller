import React, { CSSProperties } from 'react';
import LazyLoad from 'react-lazyload';
import { withStyles } from '@material-ui/core';

export interface IProps {
  classes: any;
  className?: string;
  alt?: string;
  src?: string;
  title?: string;
  style?: CSSProperties;
  onClick?: () => void;
  height?: number;
  useLazyLoad?: boolean;
}

class Image extends React.Component<IProps, Readonly<{}>> {
  render() {
    let {
      classes,
      className,
      alt,
      src,
      title,
      style,
      onClick,
      height,
      useLazyLoad
    } = this.props;

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
}

export default withStyles(theme => ({}))(Image);
