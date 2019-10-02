import React, { ReactNode, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import update from "immutability-helper";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { UseForm } from "../../../_hook/useForm";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../contexts/Context";
import { makeStyles, Theme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import CountrySelect from "../../../_select/CountrySelect";
import PRODUCT_SHIPPING from "../../../../constant/PRODUCT_SHIPPING";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

interface IProps {
  productShippingForm: UseForm;
  toggleCloseDialog: () => void;
  checkSectionShippingField: (error?: any) => Promise<boolean>;
  setStep: (step: "product info" | "product description" | "product type" | "product shipping") => void;
  submitButtonGroup: ReactNode;
  productShippingObj: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  inputUpload: {
    display: "none"
  },
  stepButtonContainer: {
    marginTop: theme.spacing(2)
  },
  paperProductShippingInfo: {
    width: "100%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  },
  typographyProductShippingInfo: {
    color: "#fff"
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
  }
}));
export default function ProductShipping(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const {
    productShippingForm, toggleCloseDialog, setStep, submitButtonGroup,
    productShippingObj
  } = props;


  const {
    value, setValue
  } = productShippingForm;

  function addProductShipping() {
    setValue("productShipping",
      update(value.productShipping, {
        $push: [productShippingObj]
      })
    );
  }

  function removeProductShipping(removingIndex: number) {
    setValue("productShipping",
      update(value.productShipping, {
        $splice: [[removingIndex, 1]]
      })
    );
  }


  return <>
    <Grid container item xs={12} sm={11} md={9}>
      <Grid item xs={12}>
        <Paper className={classes.paperProductShippingInfo}>
          <Typography
            variant="subtitle1"
            className={classes.typographyProductShippingInfo}>
            {t(
              "you can set shipping support country to default, to support global shipping"
            )}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        {value.productShipping.map(
          (productShippingItem: any, index: number) => (
            <Paper
              key={index}
              className={classes.productTypePaper}
              elevation={1}
            >
              {context.permission.includes(
                "UPDATE_PRODUCT"
              ) && (
                <IconButton
                  className={classes.removeProductTypeButton}
                  aria-label="Delete"
                  color="primary"
                  onClick={() => removeProductShipping(index)}
                >
                  <DeleteIcon fontSize="small"/>
                </IconButton>
              )}
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    error={
                      !productShippingItem.shipping_method
                        .is_valid
                    }
                    label={t("shipping method")}
                    value={
                      productShippingItem.shipping_method.value
                    }
                    onChange={(e) => {
                      setValue("productShipping",
                        update(value.productShipping, {
                          [index]: {
                            shipping_method: {
                              value: {
                                $set: e.target.value
                              }
                            }
                          }
                        })
                      );
                    }}
                    helperText={productShippingItem.shipping_method.feedback}
                    fullWidth
                    disabled={productShippingItem.shipping_method.disabled}
                  />
                  <FormHelperText>
                    {t(
                      "shipping method should be shipping company name"
                    )}
                  </FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <CountrySelect
                    required
                    label={t("shipping support country")}
                    error={!productShippingItem.shipping_country.is_valid}
                    helperText={productShippingItem.shipping_country.feedback}
                    value={
                      productShippingItem.shipping_country.value
                    }
                    onChange={(newValue: unknown) => {
                      setValue("productShipping",
                        update(value.productShipping, {
                          [index]: {
                            shipping_country: {
                              value: {
                                $set: newValue
                              }
                            }
                          }
                        })
                      );
                    }}
                    fullWidth
                    disabled={
                      productShippingItem.shipping_country
                        .disabled
                    }
                    extraOptions={[
                      {
                        value:
                        PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY,
                        label: t(
                          "global$$countryKey::" +
                          PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY
                        )
                      }
                    ]}
                  />
                </Grid>
                <Grid item xs={6}>
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
                    error={
                      !productShippingItem.shipping_fee.is_valid
                    }
                    label={t("shipping fee")}
                    value={
                      productShippingItem.shipping_fee.value
                    }
                    onChange={(e: {
                      target: { value: any };
                    }) => {
                      setValue("productShipping",
                        update(value.productShipping, {
                          [index]: {
                            shipping_fee: {
                              value: {
                                $set: e.target.value
                              }
                            }
                          }
                        })
                      );
                    }}
                    helperText={
                      productShippingItem.shipping_fee.feedback
                    }
                    fullWidth
                    disabled={
                      productShippingItem.shipping_fee.disabled
                    }
                  />
                  <FormHelperText error={false}>
                    {t(
                      "set shipping fee to 0 to provide free shipping service"
                    )}
                  </FormHelperText>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  alignItems="center"
                >
                  <FormControlLabel
                    control={
                      <Switch
                        color={"primary"}
                        disabled={
                          productShippingItem.is_disabled
                            .disabled
                        }
                        onChange={() => {
                          setValue("productShipping",
                            update(value.productShipping, {
                              [index]: {
                                is_disabled: {
                                  value: {
                                    $set: !productShippingItem.is_disabled.value
                                  }
                                }
                              }
                            })
                          );
                        }}
                        checked={
                          !productShippingItem.is_disabled.value
                        }
                      />
                    }
                    label={t("shipping method status")}
                  />
                  <FormHelperText
                    error={
                      !productShippingItem.is_disabled.is_valid
                    }
                  >
                    {productShippingItem.is_disabled.feedback}
                  </FormHelperText>
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
            onClick={addProductShipping}
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
          onClick={() => setStep("product type")}
        >
          {t("back")}
        </Button>
      </Grid>

      <Grid item>
        {submitButtonGroup}
      </Grid>
    </Grid>
  </>;
}