import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import {
  StyledComponentProps,
  withStyles
} from '@material-ui/core/styles/index';
import ClearIcon from '@material-ui/icons/Clear';
import classnames from 'classnames';
import React from 'react';
import Image from './Image';

interface IProps {
  src: string;
  title?: string;
  titlePosition?: 'top' | 'bottom';
  remove?: () => void;
  disabled?: boolean;
  className: string;
}

class RemovableImage extends React.Component<
  IProps & StyledComponentProps,
  Readonly<any>
> {
  render() {
    let { classes } = this.props;
    classes = classes || {};
    return (
      <GridListTile
        classes={{
          tile: classes.tile
        }}
        className={classnames(classes.root, this.props.className)}
        component={'span'}
      >
        <Image
          src={this.props.src}
          title={this.props.title}
          className={classes.img}
        />
        {!this.props.disabled && (
          <GridListTileBar
            title={this.props.title}
            titlePosition={this.props.titlePosition || 'top'}
            actionIcon={
              <IconButton className={classes.icon} onClick={this.props.remove}>
                <ClearIcon />
              </IconButton>
            }
            actionPosition="right"
            className={classes.titleBar}
          />
        )}
      </GridListTile>
    );
  }
}

export default withStyles(theme => ({
  root: {},
  tile: {},
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  icon: {
    color: 'white'
  }
}))(RemovableImage);
