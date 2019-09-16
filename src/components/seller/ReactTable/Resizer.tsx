import { withStyles } from "@material-ui/core/styles/index";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import React from "react";

class ReactTableResizer extends React.Component<any, any> {
  render() {
    const { classes, onMouseDown, onTouchStart } = this.props;

    return (
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className={classes.root}
      >
        <SettingsEthernetIcon className={classes.icon} />
      </div>
    );
  }
}

export default withStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    width: '36px',
    top: 0,
    bottom: 0,
    right: '-35px',
    cursor: 'col-resize'
  },
  icon: {
    fontSize: 10
  }
}))(ReactTableResizer);
