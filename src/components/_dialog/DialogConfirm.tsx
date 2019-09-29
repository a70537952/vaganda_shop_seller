import Grid from "@material-ui/core/Grid";
import React from "react";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onConfirm: () => void;
}


export default function DialogConfirm(props: IProps) {
  const { t } = useTranslation();
  const {open, onClose, title, content, onConfirm } = props;

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
        >
          {t("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
