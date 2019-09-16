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

export default class Helmet extends React.Component<IProps, Readonly<{}>> {
  render() {
    return (
      <ReactHelmet defer={false}>
        <title>{this.props.title}</title>
        <meta name="description" content={this.props.description} />
        <meta name="og:site_name" content={''} />
        <meta name="og:description" content={this.props.description} />
        <meta name="og:title" content={this.props.title} />
        <meta property="description" content={this.props.description} />
        <meta property="og:site_name" content={''} />
        <meta property="og:description" content={this.props.description} />
        <meta property="og:title" content={this.props.title} />
        {this.props.keywords && (
          <meta name="keywords" content={this.props.keywords} />
        )}
        {this.props.ogUrl && <meta name="og:url" content={this.props.ogUrl} />}
        {this.props.ogType && (
          <meta name="og:type" content={this.props.ogType} />
        )}
        {this.props.ogImage && (
          <meta name="og:image" content={this.props.ogImage} />
        )}
        {this.props.ogUrl && (
          <meta property="og:url" content={this.props.ogUrl} />
        )}
        {this.props.ogType && (
          <meta property="og:type" content={this.props.ogType} />
        )}
        {this.props.ogImage && (
          <meta property="og:image" content={this.props.ogImage} />
        )}
        {this.props.ogImage && (
          <meta property="og:image:width" content={'500'} />
        )}
        {this.props.ogImage && (
          <meta property="og:image:height" content={'300'} />
        )}
      </ReactHelmet>
    );
  }
}
