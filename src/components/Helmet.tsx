import React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

export interface IProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogUrl?: string;
  ogType?: string;
  ogImage?: string;
}
export default function Helmet(props: IProps) {
    const {
        title,
        description,
        keywords,
        ogUrl,
        ogType,
        ogImage
    } = props;

    return <ReactHelmet defer={false}>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="og:site_name" content={''} />
        <meta name="og:description" content={description} />
        <meta name="og:title" content={title} />
        <meta property="description" content={description} />
        <meta property="og:site_name" content={''} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        {keywords && (
            <meta name="keywords" content={keywords} />
        )}
        {ogUrl && <meta name="og:url" content={ogUrl} />}
        {ogType && (
            <meta name="og:type" content={ogType} />
        )}
        {ogImage && (
            <meta name="og:image" content={ogImage} />
        )}
        {ogUrl && (
            <meta property="og:url" content={ogUrl} />
        )}
        {ogType && (
            <meta property="og:type" content={ogType} />
        )}
        {ogImage && (
            <meta property="og:image" content={ogImage} />
        )}
        {ogImage && (
            <meta property="og:image:width" content={'500'} />
        )}
        {ogImage && (
            <meta property="og:image:height" content={'300'} />
        )}
    </ReactHelmet>;
}
