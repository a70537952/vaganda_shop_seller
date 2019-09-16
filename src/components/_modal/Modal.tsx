import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/styles";

interface IProps extends DialogProps {
  children: any;
  onClose: () => void;
}

const useStyles = makeStyles({
  closeButton: {
    right: 0,
    position: 'absolute',
    top: 0
  }
});

export default function Modal(props: IProps) {
  const classes = useStyles();

  const {
    closeAfterTransition,
    disableBackdropClick,
    disableAutoFocus,
    fullWidth,
    maxWidth,
    open,
    onClose,
    children,
    className
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableBackdropClick={disableBackdropClick}
      closeAfterTransition={closeAfterTransition}
      disableAutoFocus={disableAutoFocus}
      className={className}
    >
      {onClose && (
        <IconButton onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      )}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
