import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { withTranslation } from 'react-i18next';

class ReactTableNoData extends React.Component<any, any> {
  render() {
    const { children, classes, loading, t } = this.props;
    if (loading) return null;
    return (
      <Paper className={classes.root} elevation={0}>
        {t('no data found')}
      </Paper>
    );
  }
}

export default withStyles(theme => ({
  root: {
    position: 'absolute',
    top: 'calc(50% - 10px)',
    left: 'calc(50% - 56px)'
  }
}))(withTranslation()(ReactTableNoData));
