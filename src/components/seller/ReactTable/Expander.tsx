import { withStyles } from '@material-ui/core/styles/index';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

class ReactTableExpander extends React.Component<any, any> {
  render() {
    const {
      expandable,
      expander,
      isExpanded,
      hasSubComponent,
      classes
    } = this.props;

    if (!expandable || !expander || !hasSubComponent) return null;

    return (
      <div className={classes.root}>
        {isExpanded && <ExpandMoreIcon />}
        {!isExpanded && <ChevronRightIcon />}
      </div>
    );
  }
}

export default withStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    alignItems: 'center',
    display: 'flex'
  }
}))(ReactTableExpander);
