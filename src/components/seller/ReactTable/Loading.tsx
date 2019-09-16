import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles/index';
import React from 'react';

class ReactTableLoading extends React.Component<any, any> {
  render() {
    const { loading, loadingText, classes } = this.props;
    if (!loading) return null;
    return <CircularProgress className={classes.root} />;
  }
}

const widthHeight = 40;
export default withStyles(theme => ({
  root: {
    position: 'absolute',
    width: widthHeight,
    height: widthHeight,
    top: 'calc(50% - ' + widthHeight / 2 + 'px)',
    left: 'calc(50% - ' + widthHeight / 2 + 'px)'
  }
}))(ReactTableLoading);
