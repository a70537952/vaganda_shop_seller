import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import update from "immutability-helper";
import Button from "@material-ui/core/Button";
import { UseForm } from "../../../_hook/useForm";
import { useTranslation } from "react-i18next";
import useToast from "../../../_hook/useToast";
import { AppContext } from "../../../../contexts/Context";
import { makeStyles, Theme } from "@material-ui/core";
import BraftEditor from "braft-editor";
import axios from "../../../../axios";

interface IProps {
  productDescriptionForm: UseForm;
  toggleCloseDialog: () => void;
  setStep: (step: "product info" | "product description" | "product type" | "product shipping") => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  inputUpload: {
    display: "none"
  },
  stepButtonContainer: {
    marginTop: theme.spacing(2)
  }
}));
export default function ProductDescription(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const { productDescriptionForm, toggleCloseDialog, setStep } = props;

  const {
    value, disable, setValue
  } = productDescriptionForm;


  return <>
    <Grid container item xs={12} sm={11} md={9} spacing={2}>
      <BraftEditor
        language={"en"}
        value={value.description}
        onChange={editorState => {
          setValue("description", editorState);
        }}
        media={{
          uploadFn: (param: any) => {
            if (!param.file) {
              return false;
            }
            const fd = new FormData();
            fd.append("shop_id", context.shop.id);
            fd.append("images[]", param.file);

            axios
              .post("/product/description/image", fd, {
                onUploadProgress: function(event: any) {
                  param.progress(
                    (event.loaded / event.total) * 100
                  );
                }
              })
              .then((data: any) => {
                param.success({
                  url: data.data[0].image_original
                });
                setValue("productDescriptionImages", update(value.productDescriptionImages, {
                  $push: [data.data[0]]
                }));
              })
              .catch((err: any) => {
                let errors = err.response.data.errors;
                Object.keys(errors).map(error => {
                  toast.error(errors[error][0]);
                });

                param.error({
                  msg: t("unable to upload")
                });
              });
          },
          accepts: {
            image: "image/png,image/jpeg",
            video: false,
            audio: false
          }
        }}
        readOnly={disable.description}
      />
    </Grid>
    <Grid
      container
      item
      justify="flex-end"
      xs={12}
      spacing={1}
      className={classes.stepButtonContainer}
    >
      <Grid item>
        <Button
          onClick={toggleCloseDialog}
          color="primary"
        >
          {t("cancel")}
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setStep("product info")}
        >
          {t("back")}
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setStep("product type")}
        >
          {t("next")}
        </Button>
      </Grid>
    </Grid>
  </>;
}