import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Modal from "../../_modal/Modal";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import BraftEditor from "braft-editor";
import update from "immutability-helper";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import { productQuery, ProductVars } from "../../../graphql/query/ProductQuery";
import FormUtil from "../../../utils/FormUtil";
import DiscountUnitSelect from "../../_select/DiscountUnitSelect";
import LengthHeightWidthSelect from "../../_select/LengthHeightWidthSelect";
import ProductCategorySelect from "../../_select/ProductCategorySelect";
import RemovableImage from "../../RemovableImage";
import UploadImageMutation from "../../UploadImageMutation";
import WeightSelect from "../../_select/WeightSelect";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CountrySelect from "../../_select/CountrySelect";
import PRODUCT_SHIPPING from "../../../constant/PRODUCT_SHIPPING";
import axios from "../../../axios";
import { productFragments } from "../../../graphql/fragment/query/ProductFragment";
import { IProductFragmentModalCreateEditProduct } from "../../../graphql/fragmentType/query/ProductFragmentInterface";
import useToast from "../../_hook/useToast";
import { useCreateProductMutation } from "../../../graphql/mutation/productMutation/CreateProductMutation";
import { useEditProductMutation } from "../../../graphql/mutation/productMutation/EditProductMutation";
import { useApolloClient } from "@apollo/react-hooks";
import { WithPagination } from "../../../graphql/query/Query";

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
  let productShippingObj = {
    ...FormUtil.generateFieldsState(productShippingFields)
  };
  let productInfoFields = [
    {
      field: "title",
      value: "",
      validationField: "productInfoTitle",
      isCheckEmpty: true,
      emptyMessage: t("please enter product title")
    },
    {
      field: "product_category_id",
      value: "",
      validationField: "productInfoProductCategoryId",
      isCheckEmpty: true,
      emptyMessage: t("please select product category")
    },
    {
      field: "description",
      value: BraftEditor.createEditorState("")
    },
    {
      field: "extra_option",
      value: []
    },
    {
      field: "width",
      value: 0,
      validationField: "productInfoWidth",
      isCheckEmpty: true,
      emptyMessage: t("please enter product width")
    },
    {
      field: "width_unit",
      value: "cm",
      validationField: "productInfoWidthUnit",
      isCheckEmpty: true,
      emptyMessage: t("please select product width unit")
    },
    {
      field: "height",
      value: 0,
      validationField: "productInfoHeight",
      isCheckEmpty: true,
      emptyMessage: t("please enter product height")
    },
    {
      field: "height_unit",
      value: "cm",
      validationField: "productInfoHeightUnit",
      isCheckEmpty: true,
      emptyMessage: t("please select product height unit")
    },
    {
      field: "length",
      value: 0,
      validationField: "productInfoLength",
      isCheckEmpty: true,
      emptyMessage: t("please enter product length")
    },
    {
      field: "length_unit",
      value: "cm",
      validationField: "productInfoLengthUnit",
      isCheckEmpty: true,
      emptyMessage: t("please select product length unit")
    },
    {
      field: "weight",
      value: 0,
      validationField: "productInfoWeight",
      isCheckEmpty: true,
      emptyMessage: t("please enter product weight")
    },
    {
      field: "weight_unit",
      value: "kg",
      validationField: "productInfoWeightUnit",
      isCheckEmpty: true,
      emptyMessage: t("please select product weight unit")
    },
    {
      field: "is_publish",
      value: false,
      validationField: "productInfoIsPublish",
      isCheckEmpty: true,
      emptyMessage: t("please select product is publish")
    },
    {
      field: "uploadedImages",
      value: [],
      validationField: "productInfoImages",
      isCheckEmpty: true,
      emptyMessage: t("please upload at least 1 product image")
    }
  ];

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

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true );
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [productInfo, setProductInfo] = useState<any>({
    ...FormUtil.generateFieldsState(productInfoFields),
    uploadingImageCount: 0
  });
  const [productType, setProductType] = useState<any>([productTypeObj]);
  const [productShipping, setProductShipping] = useState<any>([productShippingObj]);
  const [productDescriptionImages, setProductDescriptionImages] = useState<any>([]);

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
      let isDisabled = props.disabled;
      setProductInfo(
        update(productInfo, {
          title: {
            value: { $set: product.title },
            disabled: { $set: isDisabled }
          },
          product_category_id: {
            value: { $set: product.product_category_id },
            disabled: { $set: isDisabled }
          },
          description: {
            value: {
              $set: BraftEditor.createEditorState(product.description)
            },
            disabled: { $set: isDisabled }
          },
          extra_option: {
            value: {
              $set: product.extra_option.map((extra_option: any) => ({
                ...FormUtil.parseField({
                  ...extraOptionsFields[0],
                  value: extra_option.key,
                  disabled: isDisabled
                }),
                ...FormUtil.parseField({
                  ...extraOptionsFields[1],
                  value: extra_option.value,
                  disabled: isDisabled
                })
              }))
            }
          },
          width: {
            value: { $set: product.width },
            disabled: { $set: isDisabled }
          },
          width_unit: {
            value: { $set: product.width_unit },
            disabled: { $set: isDisabled }
          },
          height: {
            value: { $set: product.height },
            disabled: { $set: isDisabled }
          },
          height_unit: {
            value: { $set: product.height_unit },
            disabled: { $set: isDisabled }
          },
          length: {
            value: { $set: product.length },
            disabled: { $set: isDisabled }
          },
          length_unit: {
            value: { $set: product.length_unit },
            disabled: { $set: isDisabled }
          },
          weight: {
            value: { $set: product.weight },
            disabled: { $set: isDisabled }
          },
          weight_unit: {
            value: { $set: product.weight_unit },
            disabled: { $set: isDisabled }
          },
          is_publish: {
            value: { $set: !!product.is_publish },
            disabled: { $set: isDisabled }
          },
          uploadedImages: { value: { $set: product.product_image } }
        })
      );

      setProductType(
        update(productType, {
          $set: product.product_type.map((product_type: any) => {
            return {
              id: product_type.id,
              title: {
                value: product_type.title,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              quantity: {
                value: product_type.quantity,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              cost: {
                value: product_type.cost,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              price: {
                value: product_type.price,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              discount: {
                value: product_type.discount,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              discount_unit: {
                value: product_type.discount_unit,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              uploadedImages: product_type.product_type_image,
              uploadingImageCount: 0
            };
          })
        })
      );

      setProductShipping(
        update(productShipping, {
          $set: product.product_shipping.map((product_shipping: any) => {
            return {
              id: product_shipping.id,
              shipping_method: {
                value: product_shipping.shipping_method,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              shipping_fee: {
                value: product_shipping.shipping_fee,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              shipping_country: {
                value: product_shipping.shipping_country,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              },
              is_disabled: {
                value: !!product_shipping.is_disabled,
                is_valid: true,
                feedback: "",
                disabled: isDisabled
              }
            };
          })
        })
      );
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
          title: productInfo.title.value
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
          title: productInfo.title.value
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

  function addExtraOption() {
    setProductInfo(
      update(productInfo, {
        extra_option: {
          value: {
            $push: [FormUtil.generateFieldsState(extraOptionsFields)]
          }
        }
      })
    );
  }

  function removeExtraOption(removingIndex: number) {
    setProductInfo(
      update(productInfo, {
        extra_option: { value: { $splice: [[removingIndex, 1]] } }
      })
    );
  }

  function addProductType() {
    setProductType(
      update(productType, {
        $push: [productTypeObj]
      })
    );
  }

  function removeProductType(removingIndex: number) {
    setProductType(
      update(productType, {
        $splice: [[removingIndex, 1]]
      })
    );
  }

  function addProductShipping() {
    setProductShipping(
      update(productShipping, {
        $push: [productShippingObj]
      })
    );
  }

  function removeProductShipping(removingIndex: number) {
    setProductShipping(
      update(productShipping, {
        $splice: [[removingIndex, 1]]
      })
    );
  }

  function uploadProductImage(images: any, uploadImageMutation: any) {
    if (images.length > 0) {
      setProductInfo((productInfo: any) =>
        update(productInfo, {
          uploadingImageCount: {
            $set: productInfo.uploadingImageCount + images.length
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

  function uploadProductImageCompletedHandler(data: any) {
    let tempImageData = data.uploadImageMutation;
    setProductInfo((productInfo: any) =>
      update(productInfo, {
        uploadingImageCount: {
          $set:
            productInfo.uploadingImageCount - tempImageData.length
        },
        uploadedImages: { value: { $push: [tempImageData[0]] } }
      })
    );
  }

  function uploadProductImageErrorHandler(error: any) {
    setProductInfo((productInfo: any) =>
      update(productInfo, {
        uploadingImageCount: {
          $set: productInfo.uploadingImageCount - 1
        }
      })
    );
    let errorMessage = FormUtil.getValidationErrorByField("images.0", error);
    toast.error(errorMessage);
  }

  function removeUploadedProductImage(removeUploadedImage: any) {
    let removingIndex = productInfo.uploadedImages.value.findIndex(
      (uploadedImage: any) => {
        return removeUploadedImage.id === uploadedImage.id;
      }
    );
    setProductInfo((productInfo: any) =>
      update(productInfo, {
        uploadedImages: { value: { $splice: [[removingIndex, 1]] } }
      })
    );
  }

  function uploadProductTypeImage(images: any, uploadImageMutation: any, props: any) {
    let index = props.index;
    if (images.length > 0) {
      setProductType((productType: any) =>
        update(productType, {
          [index]: {
            uploadedImages: { $set: [] },
            uploadingImageCount: {
              $set:
                productType[index].uploadingImageCount +
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
    setProductType((productType: any) =>
      update(productType, {
        [index]: {
          uploadingImageCount: {
            $set:
              productType[index].uploadingImageCount -
              tempImageData.length
          },
          uploadedImages: { $set: [tempImageData[0]] }
        }
      })
    );
  }

  function uploadProductTypeImageErrorHandler(error: any, props: any) {
    let index = props.index;
    setProductType((productType: any) =>
      update(productType, {
        [index]: {
          uploadingImageCount: {
            $set: productType[index].uploadingImageCount - 1
          }
        }
      })
    );
    let errorMessage = FormUtil.getValidationErrorByField("images.0", error);
    toast.error(errorMessage);
  }

  function removeUploadedProductTypeImage(removeUploadedImage: any, index: number) {
    let removingIndex = productType[index].uploadedImages.findIndex(
      (uploadedImage: any) => {
        return removeUploadedImage.id === uploadedImage.id;
      }
    );
    setProductType((productType: any) =>
      update(productType, {
        [index]: {
          uploadedImages: { $splice: [[removingIndex, 1]] }
        }
      })
    );
  }

  async function checkSectionInfoField(error?: any) {
    let isValid = true;
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      productInfoFields,
      productInfo
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      productInfoFields,
      error,
      checkedEmptyState
    );

    let updateObj: any = [];
    productInfo.extra_option.value.forEach(
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

    setProductInfo(
      update(checkedErrorState, {
        extra_option: {
          value: updateObj
        }
      })
    );

    isValid = emptyIsValid && validationIsValid && !(await isProductInfoImageUploading()) && isValid;
    if (!isValid) await setStep("product info");
    return isValid;
  }

  async function checkSectionTypeField(error?: any) {
    let isValid = true;
    let updateObj: any = [];

    if (productType.length === 0) {
      await toast.default(t("please add at least 1 product type"));
      return false;
    }

    productType.forEach((productType: any, index: number) => {
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

    setProductType(update(productType, updateObj));

    if (!isValid) await setStep("product type");

    return isValid;
  }

  async function checkSectionShippingField(error?: any) {
    let isValid = true;
    let updateObj: any = [];

    if (productShipping.length === 0) {
      await toast.default(
        t("please add at least 1 shipping method")
      );
      return false;
    }

    productShipping.forEach((productShipping: any, index: number) => {
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
      !productShipping.find(
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

    let defaultShippings = productShipping.filter(
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
      productShipping.forEach((productShipping: any, index: number) => {
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

    setProductShipping(update(productShipping, updateObj));

    if (!isValid) await setStep("product shipping");

    return isValid;

  }

  function isProductTypeImageUploading() {
    if (
      productType.find(
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
      (await checkSectionTypeField())
    ) {
      createProductMutation({
        variables: {
          shop_id: shopId,
          productInfoTitle: productInfo.title.value,
          productInfoProductCategoryId: productInfo
            .product_category_id.value,
          productInfoExtraOption: productInfo.extra_option.value.map(
            (extra_option: any) => ({
              key: extra_option.key.value,
              value: extra_option.value.value
            })
          ),
          productInfoWidth: productInfo.width.value,
          productInfoWidthUnit: productInfo.width_unit.value,
          productInfoHeight: productInfo.height.value,
          productInfoHeightUnit: productInfo.height_unit.value,
          productInfoLength: productInfo.length.value,
          productInfoLengthUnit: productInfo.length_unit.value,
          productInfoWeight: productInfo.weight.value,
          productInfoWeightUnit: productInfo.weight_unit.value,
          productInfoIsPublish: productInfo.is_publish.value,
          productInfoImages: productInfo.uploadedImages.value.map(
            (uploadedImage: any) => uploadedImage.path
          ),

          productInfoDescription: productInfo.description.value.toHTML(),
          productDescriptionImages: productDescriptionImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),
          productType: productType.map((productType: any) => {
            let obj: any = {};
            Object.keys(productType).forEach((field: any) => {
              obj[field] = productType[field].value;
            });
            obj.uploadedImages = productType.uploadedImages.map(
              (uploadedImage: any) => uploadedImage.path
            );
            return obj;
          }),
          productShipping: productShipping.map((productShipping: any) => {
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
      (await checkSectionTypeField())
    ) {
      editProductMutation({
        variables: {
          product_id: productId,
          shop_id: shopId,
          productInfoTitle: productInfo.title.value,
          productInfoProductCategoryId: productInfo
            .product_category_id.value,
          productInfoExtraOption: productInfo.extra_option.value.map(
            (extra_option: any) => ({
              key: extra_option.key.value,
              value: extra_option.value.value
            })
          ),
          productInfoWidth: productInfo.width.value,
          productInfoWidthUnit: productInfo.width_unit.value,
          productInfoHeight: productInfo.height.value,
          productInfoHeightUnit: productInfo.height_unit.value,
          productInfoLength: productInfo.length.value,
          productInfoLengthUnit: productInfo.length_unit.value,
          productInfoWeight: productInfo.weight.value,
          productInfoWeightUnit: productInfo.weight_unit.value,
          productInfoIsPublish: productInfo.is_publish.value,
          productInfoImages: productInfo.uploadedImages.value.map(
            (uploadedImage: any) => uploadedImage.path
          ),

          productInfoDescription: productInfo.description.value.toHTML(),
          productDescriptionImages: productDescriptionImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),
          productType: productType.map((productType: any) => {
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
          productShipping: productShipping.map((productShipping: any) => {
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

    setProductInfo((productInfo: any) => ({
      ...FormUtil.generateResetFieldsStateHook(productInfoFields, productInfo),
      uploadingImageCount: 0
    }));
    setProductType([productTypeObj]);
    setProductShipping([productShippingObj]);
  }

  function isProductInfoImageUploading() {
    if (productInfo.uploadingImageCount > 0) {
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

  return (
    <>
      <Dialog
        maxWidth="sm"
        open={isCloseDialogOpen}
        onClose={handleCancelCloseDialog}
      >
        <DialogTitle>
          {productId
            ? t("cancel edit product")
            : t("cancel add product")}
        </DialogTitle>
        <DialogContent>
          {productId
            ? t("are you sure cancel edit product?")
            : t("are you sure cancel add product?")}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelCloseDialog}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleOkCloseDialog}
            color="primary"
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
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
                <React.Fragment>
                  <Grid container item xs={12} sm={11} md={9} spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        error={!productInfo.title.is_valid}
                        label={t("product title")}
                        value={productInfo.title.value}
                        onChange={e => {
                          setProductInfo(
                            update(productInfo, {
                              title: { value: { $set: e.target.value } }
                            })
                          );
                        }}
                        helperText={productInfo.title.feedback}
                        fullWidth
                        disabled={productInfo.title.disabled}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ProductCategorySelect
                        fullWidth
                        error={
                          !productInfo.product_category_id
                            .is_valid
                        }
                        helperText={
                          productInfo.product_category_id
                            .feedback
                        }
                        value={
                          productInfo.product_category_id.value
                        }
                        onChange={(value: unknown) => {
                          setProductInfo(
                            update(productInfo, {
                              product_category_id: { value: { $set: value } }
                            })
                          );
                        }}
                        disabled={
                          productInfo.product_category_id
                            .disabled
                        }
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        type="number"
                        required
                        margin="dense"
                        error={!productInfo.width.is_valid}
                        label={t("product width")}
                        value={productInfo.width.value}
                        onChange={(e: { target: { value: any } }) => {
                          setProductInfo(
                            update(productInfo, {
                              width: { value: { $set: e.target.value } }
                            })
                          );
                        }}
                        helperText={productInfo.width.feedback}
                        fullWidth
                        disabled={productInfo.width.disabled}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <LengthHeightWidthSelect
                        margin="dense"
                        fullWidth
                        label={t("width unit")}
                        error={
                          !productInfo.width_unit.is_valid
                        }
                        helperText={
                          productInfo.width_unit.feedback
                        }
                        required
                        value={productInfo.width_unit.value}
                        onChange={(value: unknown) => {
                          setProductInfo(
                            update(productInfo, {
                              width_unit: { value: { $set: value } }
                            })
                          );
                        }}
                        disabled={
                          productInfo.width_unit.disabled
                        }
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        type="number"
                        required
                        margin="dense"
                        error={!productInfo.height.is_valid}
                        label={t("product height")}
                        value={productInfo.height.value}
                        onChange={(e: { target: { value: any } }) => {
                          setProductInfo(
                            update(productInfo, {
                              height: { value: { $set: e.target.value } }
                            })
                          );
                        }}
                        helperText={
                          productInfo.height.feedback
                        }
                        fullWidth
                        disabled={productInfo.height.disabled}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <LengthHeightWidthSelect
                        margin="dense"
                        fullWidth
                        label={t("height unit")}
                        error={
                          !productInfo.height_unit.is_valid
                        }
                        helperText={
                          productInfo.height_unit.feedback
                        }
                        required
                        value={productInfo.height_unit.value}
                        onChange={(value: unknown) => {
                          setProductInfo(
                            update(productInfo, {
                              height_unit: { value: { $set: value } }
                            })
                          );
                        }}
                        disabled={
                          productInfo.height_unit.disabled
                        }
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        type="number"
                        margin="dense"
                        required
                        error={!productInfo.length.is_valid}
                        label={t("product length")}
                        value={productInfo.length.value}
                        onChange={(e: { target: { value: any } }) => {
                          setProductInfo(
                            update(productInfo, {
                              length: { value: { $set: e.target.value } }
                            })
                          );
                        }}
                        helperText={
                          productInfo.length.feedback
                        }
                        fullWidth
                        disabled={productInfo.length.disabled}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <LengthHeightWidthSelect
                        margin="dense"
                        fullWidth
                        label={t("length unit")}
                        error={
                          !productInfo.length_unit.is_valid
                        }
                        helperText={
                          productInfo.length_unit.feedback
                        }
                        required
                        value={productInfo.length_unit.value}
                        onChange={(value: unknown) => {
                          setProductInfo(
                            update(productInfo, {
                              length_unit: { value: { $set: value } }
                            })
                          );
                        }}
                        disabled={
                          productInfo.length_unit.disabled
                        }
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        type="number"
                        margin="dense"
                        required
                        error={!productInfo.weight.is_valid}
                        label={t("product weight")}
                        value={productInfo.weight.value}
                        onChange={(e: { target: { value: any } }) => {
                          setProductInfo(
                            update(productInfo, {
                              weight: { value: { $set: e.target.value } }
                            })
                          );
                        }}
                        helperText={
                          productInfo.weight.feedback
                        }
                        fullWidth
                        disabled={productInfo.weight.disabled}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <WeightSelect
                        margin="dense"
                        fullWidth
                        label={t("weight unit")}
                        error={
                          !productInfo.weight_unit.is_valid
                        }
                        helperText={
                          productInfo.weight_unit.feedback
                        }
                        required
                        value={productInfo.weight_unit.value}
                        onChange={(value: unknown) => {
                          setProductInfo(
                            update(productInfo, {
                              weight_unit: { value: { $set: value } }
                            })
                          );
                        }}
                        disabled={
                          productInfo.weight_unit.disabled
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        margin="dense"
                        fullWidth
                        error={
                          !productInfo.is_publish.is_valid
                        }
                      >
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  productInfo.is_publish.value
                                }
                                onChange={e => {
                                  setProductInfo(
                                    update(productInfo, {
                                      is_publish: { value: { $set: e.target.checked } }
                                    })
                                  );
                                }}
                                color="primary"
                              />
                            }
                            label={t("publish product?")}
                            disabled={
                              productInfo.is_publish.disabled
                            }
                          />
                        </FormGroup>
                        {productInfo.is_publish.feedback && (
                          <FormHelperText>
                            {productInfo.is_publish.feedback}
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
                          {productInfo.uploadedImages
                            .feedback && (
                            <FormHelperText error>
                              {
                                productInfo.uploadedImages
                                  .feedback
                              }
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )}
                    <Grid container item spacing={1} xs={12}>
                      {productInfo.uploadedImages.value.map(
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

                      {new Array(
                        productInfo.uploadingImageCount
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
                          error={
                            !productInfo.extra_option.is_valid
                          }
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
                          {productInfo.extra_option
                            .feedback && (
                            <FormHelperText>
                              {
                                productInfo.extra_option
                                  .feedback
                              }
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )}
                    {productInfo.extra_option.value.map(
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
                                setProductInfo(
                                  update(productInfo, {
                                    extra_option: {
                                      value: {
                                        [index]: {
                                          key: {
                                            value: {
                                              $set: e.target.value
                                            }
                                          }
                                        }
                                      }
                                    }
                                  })
                                );
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
                                setProductInfo(
                                  update(productInfo, {
                                    extra_option: {
                                      value: {
                                        [index]: {
                                          value: {
                                            value: {
                                              $set: e.target.value
                                            }
                                          }
                                        }
                                      }
                                    }
                                  })
                                );
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
                </React.Fragment>
              )}

              {activeStep === 1 && (
                <React.Fragment>
                  <Grid container item xs={12} sm={11} md={9} spacing={2}>
                    <BraftEditor
                      language={"en"}
                      value={productInfo.description.value}
                      onChange={editorState => {
                        setProductInfo(
                          update(productInfo, {
                            description: {
                              value: { $set: editorState }
                            }
                          })
                        );
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

                              setProductDescriptionImages((productDescriptionImages: any) =>
                                update(productDescriptionImages, {
                                  $push: [data.data[0]]
                                })
                              );
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
                      readOnly={
                        productInfo.description.disabled
                      }
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
                </React.Fragment>
              )}

              {activeStep === 2 && (
                <React.Fragment>
                  <Grid container item xs={12} sm={11} md={9}>
                    <Grid item xs={12}>
                      {productType.map(
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
                                  onChange={(e: {
                                    target: { value: any };
                                  }) => {
                                    setProductType((productType: any) =>
                                      update(productType, {
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
                                  onChange={(e: {
                                    target: { value: any };
                                  }) => {
                                    setProductType((productType: any) =>
                                      update(productType, {
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
                                  onChange={(e: {
                                    target: { value: any };
                                  }) => {
                                    setProductType((productType: any) =>
                                      update(productType, {
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
                                  onChange={(e: {
                                    target: { value: any };
                                  }) => {
                                    setProductType((productType: any) =>
                                      update(productType, {
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
                                  onChange={(e: {
                                    target: { value: any };
                                  }) => {
                                    setProductType((productType: any) =>
                                      update(productType, {
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
                                  onChange={(value: any) => {
                                    setProductType((productType: any) =>
                                      update(productType, {
                                        [index]: {
                                          discount_unit: {
                                            value: {
                                              $set: value
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
                </React.Fragment>
              )}

              {activeStep === 3 && (
                <React.Fragment>
                  <Grid container item xs={12} sm={11} md={9}>
                    <Grid item xs={12}>
                      <Paper className={classes.paperProductShippingInfo}>
                        <Typography
                          variant="subtitle1"
                          className={
                            classes.typographyProductShippingInfo
                          }
                        >
                          {t(
                            "you can set shipping support country to default, to support global shipping"
                          )}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      {productShipping.map(
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
                                className={
                                  classes.removeProductTypeButton
                                }
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
                                  onChange={(e: {
                                    target: { value: any };
                                  }) => {
                                    setProductShipping((productShipping: any) =>
                                      update(productShipping, {
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
                                  helperText={
                                    productShippingItem.shipping_method
                                      .feedback
                                  }
                                  fullWidth
                                  disabled={
                                    productShippingItem.shipping_method
                                      .disabled
                                  }
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
                                  error={
                                    !productShippingItem.shipping_country
                                      .is_valid
                                  }
                                  helperText={
                                    productShippingItem.shipping_country
                                      .feedback
                                  }
                                  value={
                                    productShippingItem.shipping_country.value
                                  }
                                  onChange={(value: unknown) => {
                                    setProductShipping((productShipping: any) =>
                                      update(productShipping, {
                                        [index]: {
                                          shipping_country: {
                                            value: {
                                              $set: value
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
                                    setProductShipping((productShipping: any) =>
                                      update(productShipping, {
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
                                        setProductShipping((productShipping: any) =>
                                          update(productShipping, {
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
                      {context.permission.includes("CREATE_PRODUCT") && !productId && (
                        <>
                          {isCreatingProductMutation ?
                            <Button
                              disabled
                              variant="contained"
                              color="primary"
                            >
                              {t("creating...")}
                            </Button>
                            :
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                if (
                                  await checkSectionShippingField()
                                )
                                  createProduct();
                              }}
                            >
                              {t("create product")}
                            </Button>
                          }
                        </>
                      )}
                      {context.permission.includes("UPDATE_PRODUCT") && productId && (
                        <>
                          {isEditingProductMutation ?
                            <Button
                              disabled
                              variant="contained"
                              color="primary"
                            >
                              {t("editing...")}
                            </Button>
                            :
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                if (
                                  await checkSectionShippingField()
                                )
                                  editProduct();
                              }}
                            >
                              {t("edit product")}
                            </Button>
                          }
                        </>
                      )}
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </>
        ) : (
          <Grid container spacing={1}>
            {new Array(4).fill(6).map((ele, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <Skeleton variant={"rect"} height={50}/>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Modal>
    </>
  );
}