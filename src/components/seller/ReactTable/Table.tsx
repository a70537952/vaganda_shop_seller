import Table from '@material-ui/core/Table';
import React from 'react';

export default class ReactTableTable extends React.Component<any, any> {
  render() {
    const { children, className, style } = this.props;

    return <Table style={style}>{children}</Table>;
  }
}
