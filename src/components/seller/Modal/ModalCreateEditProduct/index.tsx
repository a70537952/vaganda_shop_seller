import Grid from "@material-ui/core/Grid";
import Modal from "../../../_modal/Modal";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import BraftEditor from "braft-editor";
import update from "immutability-helper";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../../contexts/Context";
import { productQuery, ProductVars } from "../../../../graphql/query/ProductQuery";
import FormUtil from "../../../../utils/FormUtil";
import { useTranslation } from "react-i18next";
import PRODUCT_SHIPPING from "../../../../constant/PRODUCT_SHIPPING";
import { productFragments } from "../../../../graphql/fragment/query/ProductFragment";
import { IProductFragmentModalCreateEditProduct } from "../../../../graphql/fragmentType/query/ProductFragmentInterface";
import useToast from "../../../_hook/useToast";
import { useCreateProductMutation } from "../../../../graphql/mutation/productMutation/CreateProductMutation";
import { useEditProductMutation } from "../../../../graphql/mutation/productMutation/EditProductMutation";
import { useApolloClient } from "@apollo/react-hooks";
import { WithPagination } from "../../../../graphql/query/Query";
import useForm from "../../../_hook/useForm";
import DialogConfirm from "../../../_dialog/DialogConfirm";
import ButtonSubmit from "../../../ButtonSubmit";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductType from "./ProductType";
import ProductShipping from "./ProductShipping";
import LoadingSkeleton from "../../../LoadingSkeleton";

interface IProps {
  productId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData: any;
  toggle: () => void;
  isOpen: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  stepper: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  stepButtonContainer: {
    marginTop: theme.spacing(2)
  },
  inputUpload: {
    display: "none"
  },
  productTypeImageButton: {
    marginRight: "10px"
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
  paperProductShippingInfo: {
    width: "100%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  },
  typographyProductShippingInfo: {
    color: "#fff"
  }
}));

export default function ModalCreateEditProduct(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const client = useApolloClient();
  let { productId, shopId, disabled, refetchData, toggle, isOpen } = props;

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
  let productShippingFields = [
    {
      field: "shipping_method",
      isCheckEmpty: true,
      emptyMessage: t("please enter shipping method")
    },
    {
      field: "shipping_fee",
      value: 0,
      isCheckEmpty: true,
      emptyMessage: t("please enter shipping fee")
    },
    {
      field: "shipping_country",
      value: PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY,
      isCheckEmpty: true,
      emptyMessage: t("please select shipping support country")
    },
    {
      field: "is_disabled",
      value: false,
      isCheckEmpty: true,
      emptyMessage: t("please select shipping method is disabled")
    }
  ];
  let productShippingObj = FormUtil.generateFieldsState(productShippingFields);
  let productTypeFields = [
    {
      field: "title",
      isCheckEmpty: true,
      emptyMessage: t("please enter product type title")
    },
    {
      field: "quantity",
      value: 0,
      isCheckEmpty: true,
      emptyMessage: t("please enter product type quantity")
    },
    {
      field: "cost",
      value: 0,
      isCheckEmpty: true,
      emptyMessage: t("please enter product type cost")
    },
    {
      field: "price",
      value: 0,
      isCheckEmpty: true,
      emptyMessage: t("please enter product type price")
    },
    {
      field: "discount",
      value: 0,
      isCheckEmpty: true,
      emptyMessage: t("please enter product type discount")
    },
    {
      field: "discount_unit",
      value: "Price",
      isCheckEmpty: true,
      emptyMessage: t("please enter product type discount unit")
    }
  ];
  let productTypeObj = {
    ...FormUtil.generateFieldsState(productTypeFields),
    uploadedImages: [],
    uploadingImageCount: 0
  };

  const productInfoForm = useForm({
    title: {
      value: "",
      validationField: "productInfoTitle",
      emptyMessage: t("please enter product title")
    },
    product_category_id: {
      value: "",
      validationField: "productInfoProductCategoryId",
      emptyMessage: t("please select product category")
    },
    extra_option: {
      value: []
    },
    width: {
      value: 0,
      validationField: "productInfoWidth",
      emptyMessage: t("please enter product width")
    },
    width_unit: {
      value: "cm",
      validationField: "productInfoWidthUnit",
      emptyMessage: t("please select product width unit")
    },
    height: {
      value: 0,
      validationField: "productInfoHeight",
      emptyMessage: t("please enter product height")
    },
    height_unit: {
      value: "cm",
      validationField: "productInfoHeightUnit",
      emptyMessage: t("please select product height unit")
    },
    length: {
      value: 0,
      validationField: "productInfoLength",
      emptyMessage: t("please enter product length")
    },
    length_unit: {
      value: "cm",
      validationField: "productInfoLengthUnit",
      emptyMessage: t("please select product length unit")
    },
    weight: {
      value: 0,
      validationField: "productInfoWeight",
      emptyMessage: t("please enter product weight")
    },
    weight_unit: {
      value: "kg",
      validationField: "productInfoWeightUnit",
      emptyMessage: t("please select product weight unit")
    },
    is_publish: {
      value: false,
      validationField: "productInfoIsPublish",
      emptyMessage: t("please select product is publish")
    },
    uploadedImages: {
      value: [],
      validationField: "productInfoImages",
      emptyMessage: t("please upload at least 1 product image")
    },
    uploadingImageCount: {
      value: 0
    }
  });

  const productDescriptionForm = useForm({
    description: {
      value: BraftEditor.createEditorState("")
    },
    productDescriptionImages: {
      value: []
    }
  });

  const productTypeForm = useForm({
    productType: {
      value: [productTypeObj]
    }
  });

  const productShippingForm = useForm({
    productShipping: {
      value: [productShippingObj]
    }
  });

  const [steps, setSteps] = useState<[
    "product info",
    "product description",
    "product type",
    "product shipping"
    ]>([
    "product info",
    "product description",
    "product type",
    "product shipping"
  ]);

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    resetStateData();
    getProduct();
  }, [productId, shopId]);

  async function getProduct() {
    if (productId && shopId) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ product: WithPagination<IProductFragmentModalCreateEditProduct> },
        ProductVars>({
        query: productQuery(productFragments.ModalCreateEditProduct),
        variables: {
          id: productId,
          shop_id: shopId
        }
      });

      let product = data.product.items[0];
      productInfoForm.setValue("title", product.title);
      productInfoForm.setValue("product_category_id", product.product_category_id);
      productInfoForm.setValue("extra_option", product.extra_option.map((extra_option: any) => ({
        ...FormUtil.parseField({
          ...extraOptionsFields[0],
          value: extra_option.key,
          disabled: disabled
        }),
        ...FormUtil.parseField({
          ...extraOptionsFields[1],
          value: extra_option.value,
          disabled: disabled
        })
      })));
      productInfoForm.setValue("width", product.width);
      productInfoForm.setValue("width_unit", product.width_unit);
      productInfoForm.setValue("height", product.height);
      productInfoForm.setValue("height_unit", product.height_unit);
      productInfoForm.setValue("length", product.length);
      productInfoForm.setValue("length_unit", product.length_unit);
      productInfoForm.setValue("weight", product.weight);
      productInfoForm.setValue("weight_unit", product.weight_unit);
      productInfoForm.setValue("is_publish", Boolean(product.is_publish));
      productInfoForm.setValue("uploadedImages", product.product_image);
      productInfoForm.setDisable("", disabled);

      productDescriptionForm.setValue("description", BraftEditor.createEditorState(product.description));
      productDescriptionForm.setDisable("", disabled);


      productTypeForm.setValue("productType", product.product_type.map((product_type: any) => {
        return {
          id: product_type.id,
          title: {
            value: product_type.title,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          quantity: {
            value: product_type.quantity,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          cost: {
            value: product_type.cost,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          price: {
            value: product_type.price,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          discount: {
            value: product_type.discount,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          discount_unit: {
            value: product_type.discount_unit,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          uploadedImages: product_type.product_type_image,
          uploadingImageCount: 0
        };
      }));

      productShippingForm.setValue("productShipping", product.product_shipping.map((product_shipping: any) => {
        return {
          id: product_shipping.id,
          shipping_method: {
            value: product_shipping.shipping_method,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          shipping_fee: {
            value: product_shipping.shipping_fee,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          shipping_country: {
            value: product_shipping.shipping_country,
            is_valid: true,
            feedback: "",
            disabled: disabled
          },
          is_disabled: {
            value: !!product_shipping.is_disabled,
            is_valid: true,
            feedback: "",
            disabled: disabled
          }
        };
      }));

      setIsDataLoaded(true);
    }
  }

  const [
    createProductMutation,
    { loading: isCreatingProductMutation }
  ] = useCreateProductMutation<IProductFragmentModalCreateEditProduct>(productFragments.ModalCreateEditProduct, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully created", {
          title: productInfoForm.value.title
        })
      );
      handleOkCloseDialog();
      refetchData();
    },
    onError: async (error) => {
      await checkSectionInfoField(error);
      await checkSectionTypeField(error);
      await checkSectionShippingField(error);
    }
  });

  const [
    editProductMutation,
    { loading: isEditingProductMutation }
  ] = useEditProductMutation<IProductFragmentModalCreateEditProduct>(productFragments.ModalCreateEditProduct, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully updated", {
          title: productInfoForm.value.title
        })
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkSectionInfoField(error);
      await checkSectionTypeField(error);
      await checkSectionShippingField(error);
    }
  });

  async function checkSectionInfoField(error?: any) {
    let isValid = productInfoForm.validate();
    if (error) {
      productInfoForm.checkApolloError(error);
    }

    let updateObj: any = [];
    productInfoForm.value.extra_option.forEach(
      (extra_option: any, index: number) => {
        let tempExtraOptionsFields = extraOptionsFields.map((field: any) => {
          field.validationField =
            "productInfoExtraOption." + index + "." + field.field;
          return field;
        });

        updateObj.push({});
        let {
          errorStateObj: emptyErrorStateObj,
          isValid: emptyIsValid
        } = FormUtil.generateFieldsEmptyError(extraOptionsFields, extra_option);

        let {
          errorStateObj: validationErrorStateObj,
          isValid: validationIsValid
        } = FormUtil.validationErrorHandler(tempExtraOptionsFields, error);

        updateObj[index] = { ...emptyErrorStateObj };
        isValid = emptyIsValid && isValid;

        if (error) {
          updateObj[index] = { ...validationErrorStateObj };
          isValid = validationIsValid && isValid;
        }
      }
    );

    productInfoForm.setValue("extra_option",
      update(productInfoForm.value.extra_option, updateObj));

    isValid = !(await isProductInfoImageUploading()) && isValid;
    if (!isValid) await setStep("product info");
    return isValid;
  }

  async function checkSectionTypeField(error?: any) {
    let isValid = true;
    let updateObj: any = [];

    if (productTypeForm.value.productType.length === 0) {
      await toast.default(t("please add at least 1 product type"));
      return false;
    }

    productTypeForm.value.productType.forEach((productType: any, index: number) => {
      let tempProductTypeFields = productTypeFields.map((field: any) => {
        field.validationField = "productType." + index + "." + field.field;
        return field;
      });

      updateObj.push({});
      let {
        errorStateObj: emptyErrorStateObj,
        isValid: emptyIsValid
      } = FormUtil.generateFieldsEmptyError(productTypeFields, productType);

      let {
        errorStateObj: validationErrorStateObj,
        isValid: validationIsValid
      } = FormUtil.validationErrorHandler(tempProductTypeFields, error);

      updateObj[index] = { ...emptyErrorStateObj };
      isValid = emptyIsValid && isValid;

      if (error) {
        updateObj[index] = { ...validationErrorStateObj };
        isValid = validationIsValid && isValid;
      }
    });

    if (await isProductTypeImageUploading()) {
      isValid = false;
    }
    productTypeForm.setValue("productType", update(productTypeForm.value.productType, updateObj));

    if (!isValid) await setStep("product type");

    return isValid;
  }

  async function checkSectionShippingField(error?: any) {
    let isValid = true;
    let updateObj: any = [];

    if (productShippingForm.value.productShipping.length === 0) {
      await toast.default(
        t("please add at least 1 shipping method")
      );
      return false;
    }

    productShippingForm.value.productShipping.forEach((productShipping: any, index: number) => {
      let tempProductShippingFields = productShippingFields.map(
        (field: any) => {
          field.validationField =
            "productShipping." + index + "." + field.field;
          return field;
        }
      );

      updateObj.push({});
      let {
        errorStateObj: emptyErrorStateObj,
        isValid: emptyIsValid
      } = FormUtil.generateFieldsEmptyError(
        productShippingFields,
        productShipping
      );

      let {
        errorStateObj: validationErrorStateObj,
        isValid: validationIsValid
      } = FormUtil.validationErrorHandler(tempProductShippingFields, error);

      updateObj[index] = { ...emptyErrorStateObj };
      isValid = emptyIsValid && isValid;

      if (error) {
        updateObj[index] = { ...validationErrorStateObj };
        isValid = validationIsValid && isValid;
      }
    });
    if (
      !error &&
      !productShippingForm.value.productShipping.find(
        (productShipping: any) =>
          productShipping.shipping_country.value ===
          PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY
      )
    ) {
      updateObj[0].shipping_country = {
        feedback: {
          $set: t(
            "please add at least 1 shipping method that provide global shipping"
          )
        },
        is_valid: { $set: false }
      };

      isValid = false;
    }

    let defaultShippings = productShippingForm.value.productShipping.filter(
      (productShipping: any) =>
        productShipping.shipping_country.value ===
        PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY
    );

    if (
      !error &&
      !defaultShippings.find(
        (defaultShipping: any) => !defaultShipping.is_disabled.value
      )
    ) {
      productShippingForm.value.productShipping.forEach((productShipping: any, index: number) => {
        if (
          productShipping.shipping_country.value ===
          PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY
        ) {
          updateObj[index].is_disabled = {
            feedback: {
              $set: t("please enable at least 1 global shipping method")
            },
            is_valid: { $set: false }
          };
        }
      });

      isValid = false;
    }

    productShippingForm.setValue("productShipping", update(productShippingForm.value.productShipping, updateObj));

    if (!isValid) await setStep("product shipping");

    return isValid;

  }

  function isProductTypeImageUploading() {
    if (
      productTypeForm.value.productType.find(
        (productType: any) => productType.uploadingImageCount > 0
      )
    ) {
      toast.default(t("please wait until the upload image complete"));
      return true;
    }
    return false;
  }

  async function createProduct() {
    if (
      (await checkSectionInfoField()) &&
      (await checkSectionTypeField()) &&
      (await checkSectionShippingField())
    ) {
      createProductMutation({
        variables: {
          shop_id: shopId,
          productInfoTitle: productInfoForm.value.title,
          productInfoProductCategoryId: productInfoForm.value.product_category_id,
          productInfoExtraOption: productInfoForm.value.extra_option.map(
            (extra_option: any) => ({
              key: extra_option.key.value,
              value: extra_option.value.value
            })
          ),
          productInfoWidth: productInfoForm.value.width,
          productInfoWidthUnit: productInfoForm.value.width_unit,
          productInfoHeight: productInfoForm.value.height,
          productInfoHeightUnit: productInfoForm.value.height_unit,
          productInfoLength: productInfoForm.value.length,
          productInfoLengthUnit: productInfoForm.value.length_unit,
          productInfoWeight: productInfoForm.value.weight,
          productInfoWeightUnit: productInfoForm.value.weight_unit,
          productInfoIsPublish: productInfoForm.value.is_publish,
          productInfoImages: productInfoForm.value.uploadedImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),

          productInfoDescription: productDescriptionForm.value.description.toHTML(),
          productDescriptionImages: productDescriptionForm.value.productDescriptionImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),
          productType: productTypeForm.value.productType.map((productType: any) => {
            let obj: any = {};
            Object.keys(productType).forEach((field: any) => {
              obj[field] = productType[field].value;
            });
            obj.uploadedImages = productType.uploadedImages.map(
              (uploadedImage: any) => uploadedImage.path
            );
            return obj;
          }),
          productShipping: productShippingForm.value.productShipping.map((productShipping: any) => {
            let obj: any = {};
            Object.keys(productShipping).forEach((field: any) => {
              obj[field] = productShipping[field].value;
            });
            return obj;
          })
        }
      });
    }
  }

  async function editProduct() {
    if (
      (await checkSectionInfoField()) &&
      (await checkSectionTypeField()) &&
      (await checkSectionShippingField())
    ) {
      editProductMutation({
        variables: {
          product_id: productId,
          shop_id: shopId,
          productInfoTitle: productInfoForm.value.title,
          productInfoProductCategoryId: productInfoForm.value.product_category_id,
          productInfoExtraOption: productInfoForm.value.extra_option.map(
            (extra_option: any) => ({
              key: extra_option.key.value,
              value: extra_option.value.value
            })
          ),
          productInfoWidth: productInfoForm.value.width,
          productInfoWidthUnit: productInfoForm.value.width_unit,
          productInfoHeight: productInfoForm.value.height,
          productInfoHeightUnit: productInfoForm.value.height_unit,
          productInfoLength: productInfoForm.value.length,
          productInfoLengthUnit: productInfoForm.value.length_unit,
          productInfoWeight: productInfoForm.value.weight,
          productInfoWeightUnit: productInfoForm.value.weight_unit,
          productInfoIsPublish: productInfoForm.value.is_publish,
          productInfoImages: productInfoForm.value.uploadedImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),

          productInfoDescription: productDescriptionForm.value.description.toHTML(),
          productDescriptionImages: productDescriptionForm.value.productDescriptionImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),
          productType: productTypeForm.value.productType.map((productType: any) => {
            let obj: any = {};
            Object.keys(productType).forEach((field: any) => {
              obj[field] = productType[field].value;
            });
            obj.id = productType.id;
            obj.uploadedImages = productType.uploadedImages.map(
              (uploadedImage: any) => uploadedImage.path
            );
            return obj;
          }),
          productShipping: productShippingForm.value.productShipping.map((productShipping: any) => {
            let obj: any = {};
            Object.keys(productShipping).forEach((field: any) => {
              obj[field] = productShipping[field].value;
            });
            obj.id = productShipping.id;
            return obj;
          })
        }
      });
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setActiveStep(0);
    productInfoForm.resetValue();
    productDescriptionForm.resetValue();
    productTypeForm.resetValue();
    productShippingForm.resetValue();
  }

  function isProductInfoImageUploading() {
    if (productInfoForm.value.uploadingImageCount > 0) {
      toast.default(t("please wait until the upload image complete"));
      return true;
    }
    return false;
  }

  function handleCancelCloseDialog() {
    setIsCloseDialogOpen(false);
  }

  async function handleOkCloseDialog() {
    await resetStateData();
    setIsCloseDialogOpen(false);
    await toggle();
  }

  function toggleCloseDialog() {
    setIsCloseDialogOpen(true);
  }

  function setStep(step: "product info" | "product description" | "product type" | "product shipping") {
    setActiveStep(steps.indexOf(step));
  }

  let submitButtonGroup = <>
    {context.permission.includes("CREATE_PRODUCT") && !productId && (
      <ButtonSubmit onClick={createProduct}
                    variant="contained"
                    color="primary"
                    loading={isCreatingProductMutation}
                    loadingLabel={t("creating...")}
                    label={t("create product")}/>
    )}
    {context.permission.includes("UPDATE_PRODUCT") && productId && (
      <ButtonSubmit onClick={editProduct}
                    variant="contained"
                    color="primary"
                    loading={isEditingProductMutation}
                    loadingLabel={t("editing...")}
                    label={t("edit product")}/>
    )}
  </>;

  return (
    <>
      <DialogConfirm open={isCloseDialogOpen}
                     onClose={handleCancelCloseDialog}
                     title={productId
                       ? t("cancel edit product")
                       : t("cancel add product")}
                     content={productId
                       ? t("are you sure cancel edit product?")
                       : t("are you sure cancel add product?")}
                     onConfirm={handleOkCloseDialog}/>
      <Modal
        disableAutoFocus
        open={isOpen}
        onClose={toggleCloseDialog}
        maxWidth={"lg"}
        fullWidth
      >
        {isDataLoaded ? (
          <>
            <Stepper
              className={classes.stepper}
              alternativeLabel
              nonLinear
              activeStep={activeStep}
            >
              {steps.map((step, index) => (
                <Step key={step}>
                  <StepButton
                    onClick={() => setStep(step)}
                    completed={activeStep > index}
                  >
                    {t(step)}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <Grid container direction="row" justify="center">
              {activeStep === 0 && (
                <ProductInfo productInfoForm={productInfoForm}
                             toggleCloseDialog={toggleCloseDialog}
                             checkSectionInfoField={checkSectionInfoField}
                             setStep={setStep}/>
              )}

              {activeStep === 1 && (
                <ProductDescription productDescriptionForm={productDescriptionForm}
                                    toggleCloseDialog={toggleCloseDialog}
                                    setStep={setStep}/>
              )}

              {activeStep === 2 && (
                <ProductType productTypeForm={productTypeForm}
                             toggleCloseDialog={toggleCloseDialog}
                             checkSectionTypeField={checkSectionTypeField}
                             setStep={setStep}
                             productTypeObj={productTypeObj}
                />
              )}

              {activeStep === 3 && (
                <ProductShipping productShippingForm={productShippingForm}
                                 toggleCloseDialog={toggleCloseDialog}
                                 checkSectionShippingField={checkSectionShippingField}
                                 setStep={setStep}
                                 submitButtonGroup={submitButtonGroup}
                                 productShippingObj={productShippingObj}/>
              )}
            </Grid>
          </>
        ) : (
          <LoadingSkeleton/>
        )}
      </Modal>
    </>
  );
}