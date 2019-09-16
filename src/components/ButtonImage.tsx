import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import DoneIcon from '@material-ui/icons/Done';

interface IProps extends StyledComponentProps {
  classes: any;
  image: any;
  width?: string;
  height?: string;
  isSelected?: boolean;
  title?: string;
  onClick?: () => void;
}

class ButtonImage extends React.Component<IProps, Readonly<any>> {
  render() {
    let {
      classes,
      image,
      width,
      isSelected,
      onClick,
      title,
      height
    } = this.props;

    return (
      <ButtonBase
        title={title}
        focusRipple
        key={image.id}
        className={classes.image}
        focusVisibleClassName={classes.focusVisible}
        style={{
          width: width || '80px',
          height: height || '45px'
        }}
        onClick={onClick}
      >
        <span
          className={classes.imageSrc}
          style={{
            backgroundImage: `url('${image.image_small}')`
          }}
        />

        {isSelected && <span className={classes.imageBackdrop} />}
        <span className={classes.imageButton}>
          {isSelected && <DoneIcon className={classes.selectedIcon} />}
        </span>
      </ButtonBase>
    );
  }
}

export default withStyles(theme => ({
  image: {
    position: 'relative'
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
    borderRadius: '4px'
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: '4px',
    backgroundColor: theme.palette.common.black,
    opacity: 0.3,
    transition: theme.transitions.create('opacity')
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  selectedIcon: {
    color: theme.palette.primary.main,
    position: 'absolute',
    left: 'calc(50% - 16px)',
    transition: theme.transitions.create('opacity'),
    fontSize: '32px',
    borderColor: theme.palette.primary.main,
    borderStyle: 'solid',
    borderWidth: '3px',
    borderRadius: '50%'
  }
}))(ButtonImage);
