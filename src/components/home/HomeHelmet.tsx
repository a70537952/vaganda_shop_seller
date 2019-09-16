import React from 'react';
import Helmet, { IProps } from '../Helmet';
import { WithTranslation, withTranslation } from 'react-i18next';

class HomeHelmet extends React.Component<
  IProps & WithTranslation,
  Readonly<{}>
> {
  render() {
    let { t } = this.props;

    let title = this.props.title + ' - ' + t('vaganda shop');

    return <Helmet {...this.props} title={title} />;
  }
}

export default withTranslation()(HomeHelmet);
