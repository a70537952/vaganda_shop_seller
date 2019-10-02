import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import update from "immutability-helper";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import UploadImageMutation from "../../../UploadImageMutation";
import Button from "@material-ui/core/Button";
import RemovableImage from "../../../RemovableImage";
import Skeleton from "@material-ui/lab/Skeleton";
import IconButton from "@material-ui/core/IconButton";
import { UseForm } from "../../../_hook/useForm";
import { useTranslation } from "react-i18next";
import useToast from "../../../_hook/useToast";
import { AppContext } from "../../../../contexts/Context";
import { makeStyles, Theme } from "@material-ui/core";
import FormUtil from "../../../../utils/FormUtil";
import Paper from "@material-ui/core/Paper";
import InputAdornment from "@material-ui/core/InputAdornment";
import DiscountUnitSelect from "../../../_select/DiscountUnitSelect";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

interface IProps {
  productTypeForm: UseForm;
  toggleCloseDialog: () => void;
  checkSectionTypeField: (error?: any) => Promise<boolean>;
  setStep: (step: "product info" | "product description" | "product type" | "product shipping") => void;
  productTypeObj: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  inputUpload: {
    display: "none"
  },
  stepButtonContainer: {
    marginTop: theme.spacing(2)
  },
  productTypePaper: {
    position: "relative",
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  removeProductTypeButton: {
    position: "absolute",
    right: 0,
    bottom: 0
  },
  productTypeImageButton: {
    marginRight: "10px"
  }
}));
export default function ProductType(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const { productTypeForm, toggleCloseDialog, checkSectionTypeField, setStep, productTypeObj } = props;

  const {
    value, setValue
  } = productTypeForm;

  function addProductType() {
    setValue("productType",
      update(value.productType, {
        $push: [productTypeObj]
      })
    );
  }

  function removeProductType(removingIndex: number) {
    setValue("productType",
      update(value.productType, {
        $splice: [[removingIndex, 1]]
      })
    );
  }

  function uploadProductTypeImage(images: any, uploadImageMutation: any, props: any) {
    let index = props.index;
    if (images.length > 0) {
      setValue("productType",
        update(value.productType, {
          [index]: {
            uploadedImages: { $set: [] },
            uploadingImageCount: {
              $set:
                value.productType[index].uploadingImageCount +
                images.length
            }
          }
        })
      );

      Array.prototype.forEach.call(images, (image: any) => {
        uploadImageMutation({
          variables: {
            images: [image]
          }
        });
      });
    }
  }

  function uploadProductTypeImageCompletedHandler(data: any, props: any) {
    let index = props.index;
    let tempImageData = data.uploadImageMutation;
    setValue("productType",
      update(value.productType, {
        [index]: {
          uploadingImageCount: {
            $set:
              value.productType[index].uploadingImageCount -
              tempImageData.length
          },
          uploadedImages: { $set: [tempImageData[0]] }
        }
      })
    );
  }

  function uploadProductTypeImageErrorHandler(error: any, props: any) {
    let index = props.index;
    setValue("productType",
      update(value.productType, {
        [index]: {
          uploadingImageCount: {
            $set: value.productType[index].uploadingImageCount - 1
          }
        }
      })
    );
    let errorMessage = FormUtil.getValidationErrorByField("images.0", error);
    toast.error(errorMessage);
  }

  function removeUploadedProductTypeImage(removeUploadedImage: any, index: number) {
    let removingIndex = value.productType[index].uploadedImages.findIndex(
      (uploadedImage: any) => {
        return removeUploadedImage.id === uploadedImage.id;
      }
    );

    setValue("productType",
      update(value.productType, {
        [index]: {
          uploadedImages: { $splice: [[removingIndex, 1]] }
        }
      })
    );
  }

  return <>
    <Grid container item xs={12} sm={11} md={9}>
      <Grid item xs={12}>
        {value.productType.map(
          (productTypeItem: any, index: number) => (
            <Paper
              key={index}
              className={classes.productTypePaper}
              elevation={1}
            >
              {context.permission.includes(
                "UPDATE_PRODUCT"
              ) && (
                <IconButton
                  className={
                    classes.removeProductTypeButton
                  }
                  aria-label="Delete"
                  color="primary"
                  onClick={() => {
                    removeProductType(index);
                  }}
                >
                  <DeleteIcon fontSize="small"/>
                </IconButton>
              )}
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    error={!productTypeItem.title.is_valid}
                    label={t("product type title")}
                    value={productTypeItem.title.value}
                    onChange={(e) => {
                      setValue("productType",
                        update(value.productType, {
                          [index]: {
                            title: {
                              value: {
                                $set: e.target.value
                              }
                            }
                          }
                        })
                      );
                    }}
                    helperText={productTypeItem.title.feedback}
                    fullWidth
                    disabled={productTypeItem.title.disabled}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    required
                    error={!productTypeItem.quantity.is_valid}
                    label={t("product type quantity")}
                    value={productTypeItem.quantity.value}
                    onChange={(e) => {
                      setValue("productType",
                        update(value.productType, {
                          [index]: {
                            quantity: {
                              value: {
                                $set: e.target.value
                              }
                            }
                          }
                        })
                      );
                    }}
                    helperText={
                      productTypeItem.quantity.feedback
                    }
                    fullWidth
                    disabled={productTypeItem.quantity.disabled}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    required
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {context.shopSetting.currency}
                        </InputAdornment>
                      )
                    }}
                    error={!productTypeItem.cost.is_valid}
                    label={t("product type cost")}
                    value={productTypeItem.cost.value}
                    onChange={(e) => {
                      setValue("productType",
                        update(value.productType, {
                          [index]: {
                            cost: {
                              value: {
                                $set: e.target.value
                              }
                            }
                          }
                        })
                      );
                    }}
                    helperText={productTypeItem.cost.feedback}
                    fullWidth
                    disabled={productTypeItem.cost.disabled}
                  />
                  <FormHelperText error={false}>
                    {t(
                      "product cost will use to calculate your profit and will not show to public"
                    )}
                  </FormHelperText>
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    required
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {context.shopSetting.currency}
                        </InputAdornment>
                      )
                    }}
                    error={!productTypeItem.price.is_valid}
                    label={t("product type price")}
                    value={productTypeItem.price.value}
                    onChange={(e) => {
                      setValue("productType",
                        update(value.productType, {
                          [index]: {
                            price: {
                              value: {
                                $set: e.target.value
                              }
                            }
                          }
                        })
                      );
                    }}
                    helperText={productTypeItem.price.feedback}
                    fullWidth
                    disabled={productTypeItem.price.disabled}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    type="number"
                    error={!productTypeItem.discount.is_valid}
                    label={t("product type discount")}
                    value={productTypeItem.discount.value}
                    onChange={(e) => {
                      setValue("productType",
                        update(value.productType, {
                          [index]: {
                            discount: {
                              value: {
                                $set: e.target.value
                              }
                            }
                          }
                        })
                      );
                    }}
                    helperText={
                      productTypeItem.discount.feedback
                    }
                    fullWidth
                    disabled={productTypeItem.discount.disabled}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <DiscountUnitSelect
                    fullWidth
                    label={t("discount unit")}
                    error={
                      !productTypeItem.discount_unit.is_valid
                    }
                    helperText={
                      productTypeItem.discount_unit.feedback
                    }
                    value={productTypeItem.discount_unit.value}
                    onChange={(newValue: any) => {
                      setValue("productType",
                        update(value.productType, {
                          [index]: {
                            discount_unit: {
                              value: {
                                $set: newValue
                              }
                            }
                          }
                        })
                      );
                    }}
                    disabled={
                      productTypeItem.discount_unit.disabled
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="inherit"
                  >
                    {t("final price")}:&nbsp;
                    {context.shopSetting.currency}&nbsp;
                    {(productTypeItem.discount_unit.value ===
                      "Price"
                        ? productTypeItem.price.value -
                        productTypeItem.discount.value
                        : productTypeItem.price.value -
                        (productTypeItem.price.value / 100) *
                        productTypeItem.discount.value
                    ).toFixed(2)}
                  </Typography>
                </Grid>
                {context.permission.includes(
                  "UPDATE_PRODUCT"
                ) && (
                  <Grid item xs={12}>
                    <FormControl margin="normal">
                      <UploadImageMutation
                        onCompleted={uploadProductTypeImageCompletedHandler}
                        onError={uploadProductTypeImageErrorHandler}
                        uploadImage={uploadProductTypeImage}
                        multiple={false}
                        index={index}
                        id={"uploadProductImage" + index}
                        className={classes.inputUpload}
                      />
                      <label
                        htmlFor={
                          "uploadProductImage" + index
                        }
                      >
                        <Button
                          size={"small"}
                          variant="contained"
                          className={
                            classes.productTypeImageButton
                          }
                          color="primary"
                          component={"span"}
                        >
                          {t("image")}
                        </Button>
                      </label>
                    </FormControl>
                  </Grid>
                )}
                <Grid container item spacing={1} xs={12}>
                  {productTypeItem.uploadedImages.map(
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
                          remove={() => removeUploadedProductTypeImage(uploadedImage, index)}
                          src={uploadedImage.image_large}
                        />
                      </Grid>
                    )
                  )}

                  {new Array(
                    productTypeItem.uploadingImageCount
                  )
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
                          <Skeleton
                            variant={"rect"}
                            height={130}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </Grid>
            </Paper>
          )
        )}
      </Grid>
      {context.permission.includes("UPDATE_PRODUCT") && (
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={addProductType}
          >
            <AddIcon/>
          </Button>
        </Grid>
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
          onClick={() => setStep("product description")}
        >
          {t("back")}
        </Button>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            if (await checkSectionTypeField())
              setStep("product shipping");
          }}
        >
          {t("next")}
        </Button>
      </Grid>
    </Grid>
  </>;
}