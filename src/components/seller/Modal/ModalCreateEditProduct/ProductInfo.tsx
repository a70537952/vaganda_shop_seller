import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import update from "immutability-helper";
import ProductCategorySelect from "../../../_select/ProductCategorySelect";
import LengthHeightWidthSelect from "../../../_select/LengthHeightWidthSelect";
import WeightSelect from "../../../_select/WeightSelect";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import UploadImageMutation from "../../../UploadImageMutation";
import Button from "@material-ui/core/Button";
import RemovableImage from "../../../RemovableImage";
import Skeleton from "@material-ui/lab/Skeleton";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from '@material-ui/icons/Clear';
import { UseForm } from "../../../_hook/useForm";
import { useTranslation } from "react-i18next";
import useToast from "../../../_hook/useToast";
import { AppContext } from "../../../../contexts/Context";
import { makeStyles, Theme } from "@material-ui/core";
import FormUtil from "../../../../utils/FormUtil";

interface IProps {
  productInfoForm: UseForm;
  toggleCloseDialog: () => void;
  checkSectionInfoField: (error?: any) => Promise<boolean>;
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
export default function ProductInfo(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const { productInfoForm, toggleCloseDialog, checkSectionInfoField, setStep } = props;

  const {
    value, error, disable, setValue
  } = productInfoForm;

  let extraOptionsFields = [
    {
      field: "key",
      isCheckEmpty: true,
      emptyMessage: t("please enter option name")
    },
    {
      field: "value",
      isCheckEmpty: true,
      emptyMessage: t("please enter option value")
    }
  ];

  function uploadProductImageErrorHandler(error: any) {
    setValue("uploadingImageCount", value.uploadingImageCount - 1);
    let errorMessage = FormUtil.getValidationErrorByField("images.0", error);
    toast.error(errorMessage);
  }

  function removeUploadedProductImage(removeUploadedImage: any) {
    let removingIndex = value.uploadedImages.findIndex(
      (uploadedImage: any) => {
        return removeUploadedImage.id === uploadedImage.id;
      }
    );
    setValue("uploadedImages", update(value.uploadedImages, {
      $splice: [[removingIndex, 1]]
    }));
  }

  function uploadProductImage(images: any, uploadImageMutation: any) {
    if (images.length > 0) {
      setValue("uploadingImageCount", value.uploadingImageCount + images.length);
      Array.prototype.forEach.call(images, (image: any) => {
        uploadImageMutation({
          variables: {
            images: [image]
          }
        });
      });
    }
  }

  function uploadProductImageCompletedHandler(data: any) {
    let tempImageData = data.uploadImageMutation;
    setValue("uploadingImageCount", value.uploadingImageCount - tempImageData.length);
    setValue("uploadedImages", update(value.uploadedImages, {
      $push: [tempImageData[0]]
    }));
  }

  function addExtraOption() {
    setValue("extra_option", update(value.extra_option, {
      $push: [FormUtil.generateFieldsState(extraOptionsFields)]
    }));
  }

  function removeExtraOption(removingIndex: number) {
    setValue("extra_option", update(value.extra_option, {
      $splice: [[removingIndex, 1]]
    }));
  }

  return <>
    <Grid container item xs={12} sm={11} md={9} spacing={2}>
      <Grid item xs={6}>
        <TextField
          required
          error={Boolean(error.title)}
          label={t("product title")}
          value={value.title}
          onChange={e => {
            setValue("title", e.target.value);
          }}
          helperText={error.title}
          fullWidth
          disabled={disable.title}
        />
      </Grid>
      <Grid item xs={6}>
        <ProductCategorySelect
          fullWidth
          error={Boolean(error.product_category_id)}
          helperText={error.product_category_id}
          value={value.product_category_id}
          onChange={(value: unknown) => {
            setValue("product_category_id", value);
          }}
          disabled={disable.product_category_id}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          required
          margin="dense"
          error={Boolean(error.width)}
          label={t("product width")}
          value={value.width}
          onChange={(e: { target: { value: any } }) => {
            setValue("width", e.target.value);
          }}
          helperText={error.width}
          fullWidth
          disabled={disable.width}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <LengthHeightWidthSelect
          margin="dense"
          fullWidth
          label={t("width unit")}
          error={Boolean(error.width_unit)}
          helperText={error.width_unit}
          required
          value={value.width_unit}
          onChange={(value: unknown) => {
            setValue("width_unit", value);
          }}
          disabled={disable.width_unit}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          required
          margin="dense"
          error={Boolean(error.height)}
          label={t("product height")}
          value={value.height}
          onChange={(e) => {
            setValue("height", e.target.value);
          }}
          helperText={error.height}
          fullWidth
          disabled={disable.height}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <LengthHeightWidthSelect
          margin="dense"
          fullWidth
          label={t("height unit")}
          error={Boolean(error.height_unit)}
          helperText={error.height_unit}
          required
          value={value.height_unit}
          onChange={(value: unknown) => {
            setValue("height_unit", value);
          }}
          disabled={disable.height_unit}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          margin="dense"
          required
          error={Boolean(error.length)}
          label={t("product length")}
          value={value.length}
          onChange={(e) => {
            setValue("length", e.target.value);
          }}
          helperText={error.length}
          fullWidth
          disabled={disable.length}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <LengthHeightWidthSelect
          margin="dense"
          fullWidth
          label={t("length unit")}
          error={Boolean(error.length_unit)}
          helperText={error.length_unit}
          required
          value={value.length_unit}
          onChange={(value: unknown) => {
            setValue("length_unit", value);
          }}
          disabled={disable.length_unit}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          margin="dense"
          required
          error={Boolean(error.weight)}
          label={t("product weight")}
          value={value.weight}
          onChange={(e) => {
            setValue("weight", e.target.value);
          }}
          helperText={error.weight}
          fullWidth
          disabled={disable.weight}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <WeightSelect
          margin="dense"
          fullWidth
          label={t("weight unit")}
          error={Boolean(error.weight_unit)}
          helperText={error.weight_unit}
          required
          value={value.weight_unit}
          onChange={(value: unknown) => {
            setValue("weight_unit", value);
          }}
          disabled={disable.weight_unit}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl
          margin="dense"
          fullWidth
          error={Boolean(error.is_publish)}
        >
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.is_publish}
                  onChange={e => {
                    setValue("is_publish", e.target.checked);
                  }}
                  color="primary"
                />
              }
              label={t("publish product?")}
              disabled={disable.is_publish}
            />
          </FormGroup>
          {Boolean(error.is_publish) && (
            <FormHelperText>
              {error.is_publish}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      {context.permission.includes("UPDATE_PRODUCT") && (
        <Grid item xs={12}>
          <FormControl margin="normal">
            <UploadImageMutation
              onCompleted={uploadProductImageCompletedHandler}
              onError={uploadProductImageErrorHandler}
              uploadImage={uploadProductImage}
              multiple
              id={"uploadProductImage"}
              className={classes.inputUpload}
            />
            <label htmlFor="uploadProductImage">
              <Button
                size={"small"}
                variant="contained"
                color="primary"
                component={"span"}
              >
                {t("image")}
              </Button>
            </label>
            {Boolean(error.uploadedImages) && (
              <FormHelperText error>
                {error.uploadedImages}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      )}
      <Grid container item spacing={1} xs={12}>
        {value.uploadedImages.map(
          (uploadedImage: any) => (
            <Grid
              key={uploadedImage.id}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
            >
              <RemovableImage
                disabled={
                  !context.permission.includes(
                    "UPDATE_PRODUCT"
                  )
                }
                remove={() => removeUploadedProductImage(uploadedImage)}
                src={uploadedImage.image_large}
              />
            </Grid>
          )
        )}

        {new Array(value.uploadingImageCount)
          .fill(6)
          .map((ele) => {
            return (
              <Grid
                key={ele}
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
              >
                <Skeleton variant={"rect"} height={150}/>
              </Grid>
            );
          })}
      </Grid>
      {context.permission.includes("UPDATE_PRODUCT") && (
        <Grid item xs={12}>
          <FormControl
            margin="dense"
            fullWidth
            error={Boolean(error.extra_option)}
          >
            <FormGroup row>
              <Button
                size={"small"}
                variant="contained"
                color="primary"
                component={"span"}
                onClick={addExtraOption}
              >
                {t("add extra product properties")}
              </Button>
            </FormGroup>
            {Boolean(error.extra_option) && (
              <FormHelperText>
                {error.extra_option}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      )}
      {value.extra_option.map(
        (options: any, index: number) => (
          <Grid
            key={index}
            container
            item
            xs={12}
            sm={10}
            spacing={2}
          >
            <Grid item xs={5}>
              <TextField
                required
                label={t("option name")}
                value={options.key.value}
                onChange={(e: {
                  target: { value: any };
                }) => {
                  setValue("extra_option",
                    update(value.extra_option, {
                      [index]: {
                        key: {
                          value: {
                            $set: e.target.value
                          }
                        }
                      }
                    }));
                }}
                fullWidth
                error={!options.key.is_valid}
                helperText={options.key.feedback}
                disabled={options.key.disabled}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                required
                label={t("option value")}
                value={options.value.value}
                onChange={(e: {
                  target: { value: any };
                }) => {
                  setValue("extra_option",
                    update(value.extra_option, {
                      [index]: {
                        value: {
                          value: {
                            $set: e.target.value
                          }
                        }
                      }
                    }));
                }}
                fullWidth
                error={!options.value.is_valid}
                helperText={options.value.feedback}
                disabled={options.value.disabled}
              />
            </Grid>
            {!options.value.disabled &&
            !options.key.disabled && (
              <Grid item xs={2}>
                <IconButton
                  aria-label="Delete"
                  color="primary"
                  onClick={() => removeExtraOption(index)}
                >
                  <ClearIcon/>
                </IconButton>
              </Grid>
            )}
          </Grid>
        )
      )}
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
          onClick={async () => {
            if (await checkSectionInfoField())
              setStep("product description");
          }}
        >
          {t("next")}
        </Button>
      </Grid>
    </Grid>
  </>;
}