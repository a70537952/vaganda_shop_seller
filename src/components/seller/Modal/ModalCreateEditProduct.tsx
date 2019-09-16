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
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import BraftEditor from "braft-editor";
import update from "immutability-helper";
import { withSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { Mutation, withApollo, WithApolloClient } from "react-apollo";
import { withRouter } from "react-router-dom";
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
import { WithTranslation, withTranslation } from "react-i18next";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CountrySelect from "../../_select/CountrySelect";
import PRODUCT_SHIPPING from "../../../constant/PRODUCT_SHIPPING";
import { WithPagination } from "../../../graphql/query/Query";
import axios from "../../../axios";
import { productFragments } from "../../../graphql/fragment/query/ProductFragment";
import { IProductFragmentModalCreateEditProduct } from "../../../graphql/fragment/interface/ProductFragmentInterface";

let productShippingFields: any;
let productTypeFields: any;
let productTypeObj: any;
let productShippingObj: any;
let productInfoFields: any;
let extraOptionsFields: any;
let t: any;

interface IProps {
  classes: any;
  productId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData: any;
  toggle: () => void;
  isOpen: boolean;
}

interface IState {
  steps: string[];
  activeStep: number;
  dataLoaded: boolean;
  isCloseDialogOpen: boolean;
  productInfo: any;
  productType: any[];
  productShipping: any[];
  productDescriptionImages: any[];
}

class ModalCreateEditProduct extends React.Component<
  IProps &
    RouteComponentProps &
    WithTranslation &
    WithSnackbarProps &
    WithApolloClient<IProps>,
  IState
> {
  constructor(
    props: IProps &
      RouteComponentProps &
      WithTranslation &
      WithSnackbarProps &
      WithApolloClient<IProps>
  ) {
    super(props);

    t = this.props.t;

    extraOptionsFields = [
      {
        field: 'key',
        isCheckEmpty: true,
        emptyMessage: t('please enter option name')
      },
      {
        field: 'value',
        isCheckEmpty: true,
        emptyMessage: t('please enter option value')
      }
    ];
    productShippingFields = [
      {
        field: 'shipping_method',
        isCheckEmpty: true,
        emptyMessage: t('please enter shipping method')
      },
      {
        field: 'shipping_fee',
        value: 0,
        isCheckEmpty: true,
        emptyMessage: t('please enter shipping fee')
      },
      {
        field: 'shipping_country',
        value: PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY,
        isCheckEmpty: true,
        emptyMessage: t('please select shipping support country')
      },
      {
        field: 'is_disabled',
        value: false,
        isCheckEmpty: true,
        emptyMessage: t('please select shipping method is disabled')
      }
    ];
    productTypeFields = [
      {
        field: 'title',
        isCheckEmpty: true,
        emptyMessage: t('please enter product type title')
      },
      {
        field: 'quantity',
        value: 0,
        isCheckEmpty: true,
        emptyMessage: t('please enter product type quantity')
      },
      {
        field: 'cost',
        value: 0,
        isCheckEmpty: true,
        emptyMessage: t('please enter product type cost')
      },
      {
        field: 'price',
        value: 0,
        isCheckEmpty: true,
        emptyMessage: t('please enter product type price')
      },
      {
        field: 'discount',
        value: 0,
        isCheckEmpty: true,
        emptyMessage: t('please enter product type discount')
      },
      {
        field: 'discount_unit',
        value: 'Price',
        isCheckEmpty: true,
        emptyMessage: t('please enter product type discount unit')
      }
    ];
    productTypeObj = {
      ...FormUtil.generateFieldsState(productTypeFields),
      uploadedImages: [],
      uploadingImageCount: 0
    };
    productShippingObj = {
      ...FormUtil.generateFieldsState(productShippingFields)
    };
    productInfoFields = [
      {
        field: 'title',
        value: '',
        validationField: 'productInfoTitle',
        isCheckEmpty: true,
        emptyMessage: t('please enter product title')
      },
      {
        field: 'product_category_id',
        value: '',
        validationField: 'productInfoProductCategoryId',
        isCheckEmpty: true,
        emptyMessage: t('please select product category')
      },
      {
        field: 'description',
        value: BraftEditor.createEditorState('')
      },
      {
        field: 'extra_option',
        value: []
      },
      {
        field: 'width',
        value: 0,
        validationField: 'productInfoWidth',
        isCheckEmpty: true,
        emptyMessage: t('please enter product width')
      },
      {
        field: 'width_unit',
        value: 'cm',
        validationField: 'productInfoWidthUnit',
        isCheckEmpty: true,
        emptyMessage: t('please select product width unit')
      },
      {
        field: 'height',
        value: 0,
        validationField: 'productInfoHeight',
        isCheckEmpty: true,
        emptyMessage: t('please enter product height')
      },
      {
        field: 'height_unit',
        value: 'cm',
        validationField: 'productInfoHeightUnit',
        isCheckEmpty: true,
        emptyMessage: t('please select product height unit')
      },
      {
        field: 'length',
        value: 0,
        validationField: 'productInfoLength',
        isCheckEmpty: true,
        emptyMessage: t('please enter product length')
      },
      {
        field: 'length_unit',
        value: 'cm',
        validationField: 'productInfoLengthUnit',
        isCheckEmpty: true,
        emptyMessage: t('please select product length unit')
      },
      {
        field: 'weight',
        value: 0,
        validationField: 'productInfoWeight',
        isCheckEmpty: true,
        emptyMessage: t('please enter product weight')
      },
      {
        field: 'weight_unit',
        value: 'kg',
        validationField: 'productInfoWeightUnit',
        isCheckEmpty: true,
        emptyMessage: t('please select product weight unit')
      },
      {
        field: 'is_publish',
        value: false,
        validationField: 'productInfoIsPublish',
        isCheckEmpty: true,
        emptyMessage: t('please select product is publish')
      },
      {
        field: 'uploadedImages',
        value: [],
        validationField: 'productInfoImages',
        isCheckEmpty: true,
        emptyMessage: t('please upload at least 1 product image')
      }
    ];
    this.state = {
      steps: [
        'product info',
        'product description',
        'product type',
        'product shipping'
      ],
      activeStep: 0,
      dataLoaded: true,
      isCloseDialogOpen: false,
      productInfo: {
        ...FormUtil.generateFieldsState(productInfoFields),
        uploadingImageCount: 0
      },
      productType: [productTypeObj],
      productShipping: [productShippingObj],
      productDescriptionImages: []
    };
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.productId && prevProps.productId !== this.props.productId) {
      await this.setState(
        update(this.state, {
          dataLoaded: { $set: false }
        })
      );

      let { data } = await this.props.client.query<
        { product: WithPagination<IProductFragmentModalCreateEditProduct> },
        ProductVars
      >({
        query: productQuery(productFragments.ModalCreateEditProduct),
        variables: {
          id: this.props.productId,
          shop_id: this.props.shopId
        }
      });

      let product = data.product.items[0];
      let isDisabled = this.props.disabled;

      this.setState(
        update(this.state, {
          dataLoaded: { $set: true },
          productInfo: {
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
          },
          productType: {
            $set: product.product_type.map((product_type: any) => {
              return {
                id: product_type.id,
                title: {
                  value: product_type.title,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                quantity: {
                  value: product_type.quantity,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                cost: {
                  value: product_type.cost,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                price: {
                  value: product_type.price,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                discount: {
                  value: product_type.discount,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                discount_unit: {
                  value: product_type.discount_unit,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                uploadedImages: product_type.product_type_image,
                uploadingImageCount: 0
              };
            })
          },
          productShipping: {
            $set: product.product_shipping.map((product_shipping: any) => {
              return {
                id: product_shipping.id,
                shipping_method: {
                  value: product_shipping.shipping_method,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                shipping_fee: {
                  value: product_shipping.shipping_fee,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                shipping_country: {
                  value: product_shipping.shipping_country,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                },
                is_disabled: {
                  value: !!product_shipping.is_disabled,
                  is_valid: true,
                  feedback: '',
                  disabled: isDisabled
                }
              };
            })
          }
        })
      );
    }
  }

  addExtraOption() {
    this.setState(
      update(this.state, {
        productInfo: {
          extra_option: {
            value: {
              $push: [FormUtil.generateFieldsState(extraOptionsFields)]
            }
          }
        }
      })
    );
  }

  removeExtraOption(removingIndex: number) {
    this.setState(
      update(this.state, {
        productInfo: {
          extra_option: { value: { $splice: [[removingIndex, 1]] } }
        }
      })
    );
  }

  addProductType() {
    this.setState(
      update(this.state, {
        productType: {
          $push: [productTypeObj]
        }
      })
    );
  }

  removeProductType(removingIndex: number) {
    this.setState(
      update(this.state, {
        productType: {
          $splice: [[removingIndex, 1]]
        }
      })
    );
  }

  addProductShipping() {
    this.setState(
      update(this.state, {
        productShipping: {
          $push: [productShippingObj]
        }
      })
    );
  }

  removeProductShipping(removingIndex: number) {
    this.setState(
      update(this.state, {
        productShipping: {
          $splice: [[removingIndex, 1]]
        }
      })
    );
  }

  uploadProductImage(images: any, uploadImageMutation: any) {
    if (images.length > 0) {
      this.setState(
        update(this.state, {
          productInfo: {
            uploadingImageCount: {
              $set: this.state.productInfo.uploadingImageCount + images.length
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

  uploadProductImageCompletedHandler(data: any) {
    let tempImageData = data.uploadImageMutation;
    this.setState(
      update(this.state, {
        productInfo: {
          uploadingImageCount: {
            $set:
              this.state.productInfo.uploadingImageCount - tempImageData.length
          },
          uploadedImages: { value: { $push: [tempImageData[0]] } }
        }
      })
    );
  }

  uploadProductImageErrorHandler(error: any) {
    this.setState(
      update(this.state, {
        productInfo: {
          uploadingImageCount: {
            $set: this.state.productInfo.uploadingImageCount - 1
          }
        }
      })
    );
    let errorMessage = FormUtil.getValidationErrorByField('images.0', error);
    this.props.enqueueSnackbar(errorMessage, {
      variant: 'error'
    });
  }

  removeUploadedProductImage(removeUploadedImage: any) {
    let removingIndex = this.state.productInfo.uploadedImages.value.findIndex(
      (uploadedImage: any) => {
        return removeUploadedImage.id === uploadedImage.id;
      }
    );
    this.setState(
      update(this.state, {
        productInfo: {
          uploadedImages: { value: { $splice: [[removingIndex, 1]] } }
        }
      })
    );
  }

  uploadProductTypeImage(images: any, uploadImageMutation: any, props: any) {
    let index = props.index;
    if (images.length > 0) {
      this.setState(
        update(this.state, {
          productType: {
            [index]: {
              uploadedImages: { $set: [] },
              uploadingImageCount: {
                $set:
                  this.state.productType[index].uploadingImageCount +
                  images.length
              }
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

  uploadProductTypeImageCompletedHandler(data: any, props: any) {
    let index = props.index;
    let tempImageData = data.uploadImageMutation;
    this.setState(
      update(this.state, {
        productType: {
          [index]: {
            uploadingImageCount: {
              $set:
                this.state.productType[index].uploadingImageCount -
                tempImageData.length
            },
            uploadedImages: { $set: [tempImageData[0]] }
          }
        }
      })
    );
  }

  uploadProductTypeImageErrorHandler(error: any, props: any) {
    let index = props.index;
    this.setState(
      update(this.state, {
        productType: {
          [index]: {
            uploadingImageCount: {
              $set: this.state.productType[index].uploadingImageCount - 1
            }
          }
        }
      })
    );
    let errorMessage = FormUtil.getValidationErrorByField('images.0', error);
    this.props.enqueueSnackbar(errorMessage, {
      variant: 'error'
    });
  }

  removeUploadedProductTypeImage(removeUploadedImage: any, index: number) {
    let removingIndex = this.state.productType[index].uploadedImages.findIndex(
      (uploadedImage: any) => {
        return removeUploadedImage.id === uploadedImage.id;
      }
    );
    this.setState(
      update(this.state, {
        productType: {
          [index]: {
            uploadedImages: { $splice: [[removingIndex, 1]] }
          }
        }
      })
    );
  }

  async createProductCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully created', {
        title: this.state.productInfo.title.value
      })
    );
    await this.handleOkCloseDialog();
    await this.props.refetchData();
  }

  async editProductCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(
      t('{{title}} successfully updated', {
        title: this.state.productInfo.title.value
      })
    );
    await this.handleOkCloseDialog();
    //await this.props.refetchData();
  }

  async createProductErrorHandler(error: any) {
    await this.checkSectionInfoField(error);
    await this.checkSectionTypeField(error);
    await this.checkSectionShippingField(error);
  }

  async checkSectionInfoField(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      productInfoFields,
      this.state.productInfo
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(productInfoFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        productInfo: {
          ...emptyErrorStateObj
        }
      })
    );
    isValid = emptyIsValid && isValid;

    let updateObj: any = [];
    this.state.productInfo.extra_option.value.forEach(
      (extra_option: any, index: number) => {
        let tempExtraOptionsFields = extraOptionsFields.map((field: any) => {
          field.validationField =
            'productInfoExtraOption.' + index + '.' + field.field;
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

    await this.setState(
      update(this.state, {
        productInfo: {
          extra_option: {
            value: updateObj
          }
        }
      })
    );

    if (error) {
      await this.setState(
        update(this.state, {
          productInfo: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    if (await this.isProductInfoImageUploading()) {
      isValid = false;
    }

    if (!isValid) await this.setStep('product info');

    return isValid;
  }

  async checkSectionTypeField(error?: any) {
    let isValid = true;
    let updateObj: any = [];

    if (this.state.productType.length === 0) {
      await this.props.enqueueSnackbar(t('please add at least 1 product type'));
      return false;
    }

    this.state.productType.forEach((productType, index) => {
      let tempProductTypeFields = productTypeFields.map((field: any) => {
        field.validationField = 'productType.' + index + '.' + field.field;
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

    if (await this.isProductTypeImageUploading()) {
      isValid = false;
    }

    await this.setState(
      update(this.state, {
        productType: updateObj
      })
    );

    if (!isValid) await this.setStep('product type');

    return isValid;
  }

  async checkSectionShippingField(error?: any) {
    let isValid = true;
    let updateObj: any = [];

    if (this.state.productShipping.length === 0) {
      await this.props.enqueueSnackbar(
        t('please add at least 1 shipping method')
      );
      return false;
    }

    this.state.productShipping.forEach((productShipping, index) => {
      let tempProductShippingFields = productShippingFields.map(
        (field: any) => {
          field.validationField =
            'productShipping.' + index + '.' + field.field;
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
      !this.state.productShipping.find(
        productShipping =>
          productShipping.shipping_country.value ===
          PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY
      )
    ) {
      updateObj[0].shipping_country = {
        feedback: {
          $set: t(
            'please add at least 1 shipping method that provide global shipping'
          )
        },
        is_valid: { $set: false }
      };

      isValid = false;
    }

    let defaultShippings = this.state.productShipping.filter(
      productShipping =>
        productShipping.shipping_country.value ===
        PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY
    );

    if (
      !error &&
      !defaultShippings.find(
        defaultShipping => !defaultShipping.is_disabled.value
      )
    ) {
      this.state.productShipping.forEach((productShipping, index) => {
        if (
          productShipping.shipping_country.value ===
          PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY
        ) {
          updateObj[index].is_disabled = {
            feedback: {
              $set: t('please enable at least 1 global shipping method')
            },
            is_valid: { $set: false }
          };
        }
      });

      isValid = false;
    }

    await this.setState(
      update(this.state, {
        productShipping: updateObj
      })
    );

    if (!isValid) await this.setStep('product shipping');

    return isValid;
  }

  isProductTypeImageUploading() {
    if (
      this.state.productType.find(
        productType => productType.uploadingImageCount > 0
      )
    ) {
      this.props.enqueueSnackbar(
        t('please wait until the upload image complete')
      );
      return true;
    }
    return false;
  }

  async createProduct(createProductMutation: any) {
    if (
      (await this.checkSectionInfoField()) &&
      (await this.checkSectionTypeField())
    ) {
      createProductMutation({
        variables: {
          shop_id: this.props.shopId,
          productInfoTitle: this.state.productInfo.title.value,
          productInfoProductCategoryId: this.state.productInfo
            .product_category_id.value,
          productInfoExtraOption: this.state.productInfo.extra_option.value.map(
            (extra_option: any) => ({
              key: extra_option.key.value,
              value: extra_option.value.value
            })
          ),
          productInfoWidth: this.state.productInfo.width.value,
          productInfoWidthUnit: this.state.productInfo.width_unit.value,
          productInfoHeight: this.state.productInfo.height.value,
          productInfoHeightUnit: this.state.productInfo.height_unit.value,
          productInfoLength: this.state.productInfo.length.value,
          productInfoLengthUnit: this.state.productInfo.length_unit.value,
          productInfoWeight: this.state.productInfo.weight.value,
          productInfoWeightUnit: this.state.productInfo.weight_unit.value,
          productInfoIsPublish: this.state.productInfo.is_publish.value,
          productInfoImages: this.state.productInfo.uploadedImages.value.map(
            (uploadedImage: any) => uploadedImage.path
          ),

          productInfoDescription: this.state.productInfo.description.value.toHTML(),
          productDescriptionImages: this.state.productDescriptionImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),
          productType: this.state.productType.map(productType => {
            let obj: any = {};
            Object.keys(productType).forEach((field: any) => {
              obj[field] = productType[field].value;
            });
            obj.uploadedImages = productType.uploadedImages.map(
              (uploadedImage: any) => uploadedImage.path
            );
            return obj;
          }),
          productShipping: this.state.productShipping.map(productShipping => {
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

  async editProduct(editProductMutation: any) {
    if (
      (await this.checkSectionInfoField()) &&
      (await this.checkSectionTypeField())
    ) {
      editProductMutation({
        variables: {
          product_id: this.props.productId,
          shop_id: this.props.shopId,
          productInfoTitle: this.state.productInfo.title.value,
          productInfoProductCategoryId: this.state.productInfo
            .product_category_id.value,
          productInfoExtraOption: this.state.productInfo.extra_option.value.map(
            (extra_option: any) => ({
              key: extra_option.key.value,
              value: extra_option.value.value
            })
          ),
          productInfoWidth: this.state.productInfo.width.value,
          productInfoWidthUnit: this.state.productInfo.width_unit.value,
          productInfoHeight: this.state.productInfo.height.value,
          productInfoHeightUnit: this.state.productInfo.height_unit.value,
          productInfoLength: this.state.productInfo.length.value,
          productInfoLengthUnit: this.state.productInfo.length_unit.value,
          productInfoWeight: this.state.productInfo.weight.value,
          productInfoWeightUnit: this.state.productInfo.weight_unit.value,
          productInfoIsPublish: this.state.productInfo.is_publish.value,
          productInfoImages: this.state.productInfo.uploadedImages.value.map(
            (uploadedImage: any) => uploadedImage.path
          ),

          productInfoDescription: this.state.productInfo.description.value.toHTML(),
          productDescriptionImages: this.state.productDescriptionImages.map(
            (uploadedImage: any) => uploadedImage.path
          ),
          productType: this.state.productType.map(productType => {
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
          productShipping: this.state.productShipping.map(productShipping => {
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

  resetStateData() {
    this.setState(
      update(this.state, {
        activeStep: { $set: 0 },
        productInfo: {
          ...FormUtil.generateResetFieldsState(productInfoFields),
          uploadingImageCount: { $set: 0 }
        },
        productType: { $set: [productTypeObj] },
        productShipping: { $set: [productShippingObj] }
      })
    );
  }

  isProductInfoImageUploading() {
    if (this.state.productInfo.uploadingImageCount > 0) {
      this.props.enqueueSnackbar(
        t('please wait until the upload image complete')
      );
      return true;
    }
    return false;
  }

  handleCancelCloseDialog() {
    this.resetStateData();
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
  }

  async handleOkCloseDialog() {
    await this.resetStateData();
    await this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
    await this.props.toggle();
  }

  toggleCloseDialog() {
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: true }
      })
    );
  }

  setStep(step: string) {
    this.setState(
      update(this.state, {
        activeStep: { $set: this.state.steps.indexOf(step) }
      })
    );
  }

  render() {
    const { classes, t } = this.props;
    const { activeStep, steps } = this.state;
    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Dialog
              maxWidth="sm"
              open={this.state.isCloseDialogOpen}
              onClose={this.handleCancelCloseDialog.bind(this)}
            >
              <DialogTitle>
                {this.props.productId
                  ? t('cancel edit product')
                  : t('cancel add product')}
              </DialogTitle>
              <DialogContent>
                {this.props.productId
                  ? t('are you sure cancel edit product?')
                  : t('are you sure cancel add product?')}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleCancelCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={this.handleOkCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('ok')}
                </Button>
              </DialogActions>
            </Dialog>
            <Modal
              disableAutoFocus
              open={this.props.isOpen}
              onClose={() => {
                this.toggleCloseDialog();
              }}
              maxWidth={'lg'}
              fullWidth
            >
              {this.state.dataLoaded ? (
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
                          onClick={this.setStep.bind(this, step)}
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
                              error={!this.state.productInfo.title.is_valid}
                              label={t('product title')}
                              value={this.state.productInfo.title.value}
                              onChange={e => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      title: { value: { $set: e.target.value } }
                                    }
                                  })
                                );
                              }}
                              helperText={this.state.productInfo.title.feedback}
                              fullWidth
                              disabled={this.state.productInfo.title.disabled}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ProductCategorySelect
                              fullWidth
                              error={
                                !this.state.productInfo.product_category_id
                                  .is_valid
                              }
                              helperText={
                                this.state.productInfo.product_category_id
                                  .feedback
                              }
                              value={
                                this.state.productInfo.product_category_id.value
                              }
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      product_category_id: {
                                        value: { $set: value }
                                      }
                                    }
                                  })
                                );
                              }}
                              disabled={
                                this.state.productInfo.product_category_id
                                  .disabled
                              }
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              type="number"
                              required
                              margin="dense"
                              error={!this.state.productInfo.width.is_valid}
                              label={t('product width')}
                              value={this.state.productInfo.width.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      width: { value: { $set: e.target.value } }
                                    }
                                  })
                                );
                              }}
                              helperText={this.state.productInfo.width.feedback}
                              fullWidth
                              disabled={this.state.productInfo.width.disabled}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <LengthHeightWidthSelect
                              margin="dense"
                              fullWidth
                              label={t('width unit')}
                              error={
                                !this.state.productInfo.width_unit.is_valid
                              }
                              helperText={
                                this.state.productInfo.width_unit.feedback
                              }
                              required
                              value={this.state.productInfo.width_unit.value}
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      width_unit: { value: { $set: value } }
                                    }
                                  })
                                );
                              }}
                              disabled={
                                this.state.productInfo.width_unit.disabled
                              }
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              type="number"
                              required
                              margin="dense"
                              error={!this.state.productInfo.height.is_valid}
                              label={t('product height')}
                              value={this.state.productInfo.height.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      height: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.productInfo.height.feedback
                              }
                              fullWidth
                              disabled={this.state.productInfo.height.disabled}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <LengthHeightWidthSelect
                              margin="dense"
                              fullWidth
                              label={t('height unit')}
                              error={
                                !this.state.productInfo.height_unit.is_valid
                              }
                              helperText={
                                this.state.productInfo.height_unit.feedback
                              }
                              required
                              value={this.state.productInfo.height_unit.value}
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      height_unit: { value: { $set: value } }
                                    }
                                  })
                                );
                              }}
                              disabled={
                                this.state.productInfo.height_unit.disabled
                              }
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              type="number"
                              margin="dense"
                              required
                              error={!this.state.productInfo.length.is_valid}
                              label={t('product length')}
                              value={this.state.productInfo.length.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      length: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.productInfo.length.feedback
                              }
                              fullWidth
                              disabled={this.state.productInfo.length.disabled}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <LengthHeightWidthSelect
                              margin="dense"
                              fullWidth
                              label={t('length unit')}
                              error={
                                !this.state.productInfo.length_unit.is_valid
                              }
                              helperText={
                                this.state.productInfo.length_unit.feedback
                              }
                              required
                              value={this.state.productInfo.length_unit.value}
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      length_unit: { value: { $set: value } }
                                    }
                                  })
                                );
                              }}
                              disabled={
                                this.state.productInfo.length_unit.disabled
                              }
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              type="number"
                              margin="dense"
                              required
                              error={!this.state.productInfo.weight.is_valid}
                              label={t('product weight')}
                              value={this.state.productInfo.weight.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      weight: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.productInfo.weight.feedback
                              }
                              fullWidth
                              disabled={this.state.productInfo.weight.disabled}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <WeightSelect
                              margin="dense"
                              fullWidth
                              label={t('weight unit')}
                              error={
                                !this.state.productInfo.weight_unit.is_valid
                              }
                              helperText={
                                this.state.productInfo.weight_unit.feedback
                              }
                              required
                              value={this.state.productInfo.weight_unit.value}
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    productInfo: {
                                      weight_unit: { value: { $set: value } }
                                    }
                                  })
                                );
                              }}
                              disabled={
                                this.state.productInfo.weight_unit.disabled
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl
                              margin="dense"
                              fullWidth
                              error={
                                !this.state.productInfo.is_publish.is_valid
                              }
                            >
                              <FormGroup row>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        this.state.productInfo.is_publish.value
                                      }
                                      onChange={e => {
                                        this.setState(
                                          update(this.state, {
                                            productInfo: {
                                              is_publish: {
                                                value: {
                                                  $set: e.target.checked
                                                }
                                              }
                                            }
                                          })
                                        );
                                      }}
                                      color="primary"
                                    />
                                  }
                                  label={t('publish product?')}
                                  disabled={
                                    this.state.productInfo.is_publish.disabled
                                  }
                                />
                              </FormGroup>
                              {this.state.productInfo.is_publish.feedback && (
                                <FormHelperText>
                                  {this.state.productInfo.is_publish.feedback}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          {context.permission.includes('UPDATE_PRODUCT') && (
                            <Grid item xs={12}>
                              <FormControl margin="normal">
                                <UploadImageMutation
                                  onCompleted={this.uploadProductImageCompletedHandler.bind(
                                    this
                                  )}
                                  onError={this.uploadProductImageErrorHandler.bind(
                                    this
                                  )}
                                  uploadImage={this.uploadProductImage.bind(
                                    this
                                  )}
                                  multiple
                                  id={'uploadProductImage'}
                                  className={classes.inputUpload}
                                />
                                <label htmlFor="uploadProductImage">
                                  <Button
                                    size={'small'}
                                    variant="contained"
                                    color="primary"
                                    component={'span'}
                                  >
                                    {t('image')}
                                  </Button>
                                </label>
                                {this.state.productInfo.uploadedImages
                                  .feedback && (
                                  <FormHelperText error>
                                    {
                                      this.state.productInfo.uploadedImages
                                        .feedback
                                    }
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                          )}
                          <Grid container item spacing={1} xs={12}>
                            {this.state.productInfo.uploadedImages.value.map(
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
                                    className={classes.productImage}
                                    disabled={
                                      !context.permission.includes(
                                        'UPDATE_PRODUCT'
                                      )
                                    }
                                    remove={this.removeUploadedProductImage.bind(
                                      this,
                                      uploadedImage
                                    )}
                                    src={uploadedImage.image_large}
                                  />
                                </Grid>
                              )
                            )}

                            {new Array(
                              this.state.productInfo.uploadingImageCount
                            )
                              .fill(6)
                              .map((ele, index) => {
                                return (
                                  <Grid
                                    key={ele}
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={4}
                                  >
                                    <Skeleton variant={'rect'} height={150} />
                                  </Grid>
                                );
                              })}
                          </Grid>
                          {context.permission.includes('UPDATE_PRODUCT') && (
                            <Grid item xs={12}>
                              <FormControl
                                margin="dense"
                                fullWidth
                                error={
                                  !this.state.productInfo.extra_option.is_valid
                                }
                              >
                                <FormGroup row>
                                  <Button
                                    size={'small'}
                                    variant="contained"
                                    color="primary"
                                    component={'span'}
                                    onClick={() => {
                                      this.addExtraOption();
                                    }}
                                  >
                                    {t('add extra product properties')}
                                  </Button>
                                </FormGroup>
                                {this.state.productInfo.extra_option
                                  .feedback && (
                                  <FormHelperText>
                                    {
                                      this.state.productInfo.extra_option
                                        .feedback
                                    }
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                          )}
                          {this.state.productInfo.extra_option.value.map(
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
                                    label={t('option name')}
                                    value={options.key.value}
                                    onChange={(e: {
                                      target: { value: any };
                                    }) => {
                                      this.setState(
                                        update(this.state, {
                                          productInfo: {
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
                                    label={t('option value')}
                                    value={options.value.value}
                                    onChange={(e: {
                                      target: { value: any };
                                    }) => {
                                      this.setState(
                                        update(this.state, {
                                          productInfo: {
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
                                        onClick={() => {
                                          this.removeExtraOption(index);
                                        }}
                                      >
                                        <ClearIcon />
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
                              onClick={this.toggleCloseDialog.bind(this)}
                              color="primary"
                            >
                              {t('cancel')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                if (await this.checkSectionInfoField())
                                  this.setStep('product description');
                              }}
                            >
                              {t('next')}
                            </Button>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    )}

                    {activeStep === 1 && (
                      <React.Fragment>
                        <Grid container item xs={12} sm={11} md={9} spacing={2}>
                          <BraftEditor
                            language={'en'}
                            value={this.state.productInfo.description.value}
                            onChange={editorState => {
                              this.setState(
                                update(this.state, {
                                  productInfo: {
                                    description: {
                                      value: { $set: editorState }
                                    }
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
                                fd.append('shop_id', context.shop.id);
                                fd.append('images[]', param.file);

                                axios
                                  .post('/product/description/image', fd, {
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

                                    this.setState(
                                      update(this.state, {
                                        productDescriptionImages: {
                                          $push: [data.data[0]]
                                        }
                                      })
                                    );
                                  })
                                  .catch((err: any) => {
                                    let errors = err.response.data.errors;
                                    Object.keys(errors).map(error => {
                                      this.props.enqueueSnackbar(
                                        errors[error][0],
                                        {
                                          variant: 'error'
                                        }
                                      );
                                    });

                                    param.error({
                                      msg: t('unable to upload')
                                    });
                                  });
                              },
                              accepts: {
                                image: 'image/png,image/jpeg',
                                video: false,
                                audio: false
                              }
                            }}
                            readOnly={
                              this.state.productInfo.description.disabled
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
                              onClick={this.toggleCloseDialog.bind(this)}
                              color="primary"
                            >
                              {t('cancel')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                this.setStep('product info');
                              }}
                            >
                              {t('back')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                this.setStep('product type');
                              }}
                            >
                              {t('next')}
                            </Button>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    )}

                    {activeStep === 2 && (
                      <React.Fragment>
                        <Grid container item xs={12} sm={11} md={9}>
                          <Grid item xs={12}>
                            {this.state.productType.map(
                              (productType, index) => (
                                <Paper
                                  key={index}
                                  className={classes.productTypePaper}
                                  elevation={1}
                                >
                                  {context.permission.includes(
                                    'UPDATE_PRODUCT'
                                  ) && (
                                    <IconButton
                                      className={
                                        classes.removeProductTypeButton
                                      }
                                      aria-label="Delete"
                                      color="primary"
                                      onClick={() => {
                                        this.removeProductType(index);
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <Grid item container spacing={2}>
                                    <Grid item xs={6}>
                                      <TextField
                                        required
                                        error={!productType.title.is_valid}
                                        label={t('product type title')}
                                        value={productType.title.value}
                                        onChange={(e: {
                                          target: { value: any };
                                        }) => {
                                          this.setState(
                                            update(this.state, {
                                              productType: {
                                                [index]: {
                                                  title: {
                                                    value: {
                                                      $set: e.target.value
                                                    }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        helperText={productType.title.feedback}
                                        fullWidth
                                        disabled={productType.title.disabled}
                                      />
                                    </Grid>
                                    <Grid item xs={6}>
                                      <TextField
                                        type="number"
                                        required
                                        error={!productType.quantity.is_valid}
                                        label={t('product type quantity')}
                                        value={productType.quantity.value}
                                        onChange={(e: {
                                          target: { value: any };
                                        }) => {
                                          this.setState(
                                            update(this.state, {
                                              productType: {
                                                [index]: {
                                                  quantity: {
                                                    value: {
                                                      $set: e.target.value
                                                    }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        helperText={
                                          productType.quantity.feedback
                                        }
                                        fullWidth
                                        disabled={productType.quantity.disabled}
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
                                        error={!productType.cost.is_valid}
                                        label={t('product type cost')}
                                        value={productType.cost.value}
                                        onChange={(e: {
                                          target: { value: any };
                                        }) => {
                                          this.setState(
                                            update(this.state, {
                                              productType: {
                                                [index]: {
                                                  cost: {
                                                    value: {
                                                      $set: e.target.value
                                                    }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        helperText={productType.cost.feedback}
                                        fullWidth
                                        disabled={productType.cost.disabled}
                                      />
                                      <FormHelperText error={false}>
                                        {t(
                                          'product cost will use to calculate your profit and will not show to public'
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
                                        error={!productType.price.is_valid}
                                        label={t('product type price')}
                                        value={productType.price.value}
                                        onChange={(e: {
                                          target: { value: any };
                                        }) => {
                                          this.setState(
                                            update(this.state, {
                                              productType: {
                                                [index]: {
                                                  price: {
                                                    value: {
                                                      $set: e.target.value
                                                    }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        helperText={productType.price.feedback}
                                        fullWidth
                                        disabled={productType.price.disabled}
                                      />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                      <TextField
                                        type="number"
                                        error={!productType.discount.is_valid}
                                        label={t('product type discount')}
                                        value={productType.discount.value}
                                        onChange={(e: {
                                          target: { value: any };
                                        }) => {
                                          this.setState(
                                            update(this.state, {
                                              productType: {
                                                [index]: {
                                                  discount: {
                                                    value: {
                                                      $set: e.target.value
                                                    }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        helperText={
                                          productType.discount.feedback
                                        }
                                        fullWidth
                                        disabled={productType.discount.disabled}
                                      />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                      <DiscountUnitSelect
                                        fullWidth
                                        label={t('discount unit')}
                                        error={
                                          !productType.discount_unit.is_valid
                                        }
                                        helperText={
                                          productType.discount_unit.feedback
                                        }
                                        value={productType.discount_unit.value}
                                        onChange={(value: any) => {
                                          this.setState(
                                            update(this.state, {
                                              productType: {
                                                [index]: {
                                                  discount_unit: {
                                                    value: { $set: value }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        disabled={
                                          productType.discount_unit.disabled
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography
                                        variant="body2"
                                        color="inherit"
                                      >
                                        {t('final price')}:&nbsp;
                                        {context.shopSetting.currency}&nbsp;
                                        {(productType.discount_unit.value ===
                                        'Price'
                                          ? productType.price.value -
                                            productType.discount.value
                                          : productType.price.value -
                                            (productType.price.value / 100) *
                                              productType.discount.value
                                        ).toFixed(2)}
                                      </Typography>
                                    </Grid>
                                    {context.permission.includes(
                                      'UPDATE_PRODUCT'
                                    ) && (
                                      <Grid item xs={12}>
                                        <FormControl margin="normal">
                                          <UploadImageMutation
                                            onCompleted={this.uploadProductTypeImageCompletedHandler.bind(
                                              this
                                            )}
                                            onError={this.uploadProductTypeImageErrorHandler.bind(
                                              this
                                            )}
                                            uploadImage={this.uploadProductTypeImage.bind(
                                              this
                                            )}
                                            multiple={false}
                                            index={index}
                                            id={'uploadProductImage' + index}
                                            className={classes.inputUpload}
                                          />
                                          <label
                                            htmlFor={
                                              'uploadProductImage' + index
                                            }
                                          >
                                            <Button
                                              size={'small'}
                                              variant="contained"
                                              className={
                                                classes.productTypeImageButton
                                              }
                                              color="primary"
                                              component={'span'}
                                            >
                                              {t('image')}
                                            </Button>
                                          </label>
                                        </FormControl>
                                      </Grid>
                                    )}
                                    <Grid container item spacing={1} xs={12}>
                                      {productType.uploadedImages.map(
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
                                                  'UPDATE_PRODUCT'
                                                )
                                              }
                                              className={classes.productImage}
                                              remove={this.removeUploadedProductTypeImage.bind(
                                                this,
                                                uploadedImage,
                                                index
                                              )}
                                              src={uploadedImage.image_large}
                                            />
                                          </Grid>
                                        )
                                      )}

                                      {new Array(
                                        productType.uploadingImageCount
                                      )
                                        .fill(6)
                                        .map((ele, index) => {
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
                                                variant={'rect'}
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
                          {context.permission.includes('UPDATE_PRODUCT') && (
                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  this.addProductType();
                                }}
                              >
                                <AddIcon />
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
                              onClick={this.toggleCloseDialog.bind(this)}
                              color="primary"
                            >
                              {t('cancel')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                this.setStep('product description');
                              }}
                            >
                              {t('back')}
                            </Button>
                          </Grid>

                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                if (await this.checkSectionTypeField())
                                  this.setStep('product shipping');
                              }}
                            >
                              {t('next')}
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
                                  'you can set shipping support country to default, to support global shipping'
                                )}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12}>
                            {this.state.productShipping.map(
                              (productShipping, index) => (
                                <Paper
                                  key={index}
                                  className={classes.productTypePaper}
                                  elevation={1}
                                >
                                  {context.permission.includes(
                                    'UPDATE_PRODUCT'
                                  ) && (
                                    <IconButton
                                      className={
                                        classes.removeProductTypeButton
                                      }
                                      aria-label="Delete"
                                      color="primary"
                                      onClick={() => {
                                        this.removeProductShipping(index);
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <Grid item container spacing={2}>
                                    <Grid item xs={6}>
                                      <TextField
                                        required
                                        error={
                                          !productShipping.shipping_method
                                            .is_valid
                                        }
                                        label={t('shipping method')}
                                        value={
                                          productShipping.shipping_method.value
                                        }
                                        onChange={(e: {
                                          target: { value: any };
                                        }) => {
                                          this.setState(
                                            update(this.state, {
                                              productShipping: {
                                                [index]: {
                                                  shipping_method: {
                                                    value: {
                                                      $set: e.target.value
                                                    }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        helperText={
                                          productShipping.shipping_method
                                            .feedback
                                        }
                                        fullWidth
                                        disabled={
                                          productShipping.shipping_method
                                            .disabled
                                        }
                                      />
                                      <FormHelperText>
                                        {t(
                                          'shipping method should be shipping company name'
                                        )}
                                      </FormHelperText>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <CountrySelect
                                        required
                                        label={t('shipping support country')}
                                        error={
                                          !productShipping.shipping_country
                                            .is_valid
                                        }
                                        helperText={
                                          productShipping.shipping_country
                                            .feedback
                                        }
                                        value={
                                          productShipping.shipping_country.value
                                        }
                                        onChange={(value: unknown) => {
                                          this.setState(
                                            update(this.state, {
                                              productShipping: {
                                                [index]: {
                                                  shipping_country: {
                                                    value: { $set: value }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        fullWidth
                                        disabled={
                                          productShipping.shipping_country
                                            .disabled
                                        }
                                        extraOptions={[
                                          {
                                            value:
                                              PRODUCT_SHIPPING.DEFAULT_SHIPPING_COUNTRY,
                                            label: t(
                                              'global$$countryKey::' +
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
                                          !productShipping.shipping_fee.is_valid
                                        }
                                        label={t('shipping fee')}
                                        value={
                                          productShipping.shipping_fee.value
                                        }
                                        onChange={(e: {
                                          target: { value: any };
                                        }) => {
                                          this.setState(
                                            update(this.state, {
                                              productShipping: {
                                                [index]: {
                                                  shipping_fee: {
                                                    value: {
                                                      $set: e.target.value
                                                    }
                                                  }
                                                }
                                              }
                                            })
                                          );
                                        }}
                                        helperText={
                                          productShipping.shipping_fee.feedback
                                        }
                                        fullWidth
                                        disabled={
                                          productShipping.shipping_fee.disabled
                                        }
                                      />
                                      <FormHelperText error={false}>
                                        {t(
                                          'set shipping fee to 0 to provide free shipping service'
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
                                            color={'primary'}
                                            disabled={
                                              productShipping.is_disabled
                                                .disabled
                                            }
                                            onChange={() => {
                                              this.setState(
                                                update(this.state, {
                                                  productShipping: {
                                                    [index]: {
                                                      is_disabled: {
                                                        value: {
                                                          $set: !productShipping
                                                            .is_disabled.value
                                                        }
                                                      }
                                                    }
                                                  }
                                                })
                                              );
                                            }}
                                            checked={
                                              !productShipping.is_disabled.value
                                            }
                                          />
                                        }
                                        label={t('shipping method status')}
                                      />
                                      <FormHelperText
                                        error={
                                          !productShipping.is_disabled.is_valid
                                        }
                                      >
                                        {productShipping.is_disabled.feedback}
                                      </FormHelperText>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              )
                            )}
                          </Grid>
                          {context.permission.includes('UPDATE_PRODUCT') && (
                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  this.addProductShipping();
                                }}
                              >
                                <AddIcon />
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
                              onClick={this.toggleCloseDialog.bind(this)}
                              color="primary"
                            >
                              {t('cancel')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                this.setStep('product type');
                              }}
                            >
                              {t('back')}
                            </Button>
                          </Grid>

                          <Grid item>
                            {context.permission.includes('CREATE_PRODUCT') && (
                              <>
                                {!this.props.productId && (
                                  <Mutation
                                    mutation={gql`
                                      mutation CreateProductMutation(
                                        $shop_id: String
                                        $productInfoTitle: String
                                        $productInfoProductCategoryId: String
                                        $productInfoExtraOption: [ExtraOptionInput]!
                                        $productInfoWidth: String
                                        $productInfoWidthUnit: String
                                        $productInfoHeight: String
                                        $productInfoHeightUnit: String
                                        $productInfoLength: String
                                        $productInfoLengthUnit: String
                                        $productInfoWeight: String
                                        $productInfoWeightUnit: String
                                        $productInfoIsPublish: Boolean
                                        $productInfoImages: [String]!
                                        $productInfoDescription: String
                                        $productType: [ProductTypeInput]!
                                        $productShipping: [ProductShippingInput]!
                                        $productDescriptionImages: [String]
                                      ) {
                                        createProductMutation(
                                          shop_id: $shop_id
                                          productInfoTitle: $productInfoTitle
                                          productInfoProductCategoryId: $productInfoProductCategoryId
                                          productInfoExtraOption: $productInfoExtraOption
                                          productInfoWidth: $productInfoWidth
                                          productInfoWidthUnit: $productInfoWidthUnit
                                          productInfoHeight: $productInfoHeight
                                          productInfoHeightUnit: $productInfoHeightUnit
                                          productInfoLength: $productInfoLength
                                          productInfoLengthUnit: $productInfoLengthUnit
                                          productInfoWeight: $productInfoWeight
                                          productInfoWeightUnit: $productInfoWeightUnit
                                          productInfoIsPublish: $productInfoIsPublish
                                          productInfoImages: $productInfoImages
                                          productInfoDescription: $productInfoDescription
                                          productType: $productType
                                          productShipping: $productShipping
                                          productDescriptionImages: $productDescriptionImages
                                        ) {
                                          ...fragment
                                        }
                                      }
                                      ${productFragments.ModalCreateEditProduct}
                                    `}
                                    onCompleted={data => {
                                      this.createProductCompletedHandler.bind(
                                        this
                                      )(data);
                                    }}
                                    onError={error => {
                                      this.createProductErrorHandler.bind(this)(
                                        error
                                      );
                                    }}
                                  >
                                    {(
                                      createProductMutation,
                                      { data, loading, error }
                                    ) => {
                                      if (loading) {
                                        return (
                                          <Button
                                            disabled
                                            variant="contained"
                                            color="primary"
                                          >
                                            {t('creating...')}
                                          </Button>
                                        );
                                      }

                                      return (
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={async () => {
                                            if (
                                              await this.checkSectionShippingField()
                                            )
                                              this.createProduct(
                                                createProductMutation
                                              );
                                          }}
                                        >
                                          {t('create product')}
                                        </Button>
                                      );
                                    }}
                                  </Mutation>
                                )}
                              </>
                            )}
                            {context.permission.includes('UPDATE_PRODUCT') && (
                              <>
                                {this.props.productId && (
                                  <Mutation
                                    mutation={gql`
                                      mutation EditProductMutation(
                                        $product_id: String
                                        $shop_id: String
                                        $productInfoTitle: String
                                        $productInfoProductCategoryId: String
                                        $productInfoExtraOption: [ExtraOptionInput]!
                                        $productInfoWidth: String
                                        $productInfoWidthUnit: String
                                        $productInfoHeight: String
                                        $productInfoHeightUnit: String
                                        $productInfoLength: String
                                        $productInfoLengthUnit: String
                                        $productInfoWeight: String
                                        $productInfoWeightUnit: String
                                        $productInfoIsPublish: Boolean
                                        $productInfoImages: [String]!
                                        $productInfoDescription: String
                                        $productType: [ProductTypeInput]!
                                        $productShipping: [ProductShippingInput]!
                                        $productDescriptionImages: [String]
                                      ) {
                                        editProductMutation(
                                          product_id: $product_id
                                          shop_id: $shop_id
                                          productInfoTitle: $productInfoTitle
                                          productInfoProductCategoryId: $productInfoProductCategoryId
                                          productInfoExtraOption: $productInfoExtraOption
                                          productInfoWidth: $productInfoWidth
                                          productInfoWidthUnit: $productInfoWidthUnit
                                          productInfoHeight: $productInfoHeight
                                          productInfoHeightUnit: $productInfoHeightUnit
                                          productInfoLength: $productInfoLength
                                          productInfoLengthUnit: $productInfoLengthUnit
                                          productInfoWeight: $productInfoWeight
                                          productInfoWeightUnit: $productInfoWeightUnit
                                          productInfoIsPublish: $productInfoIsPublish
                                          productInfoImages: $productInfoImages
                                          productInfoDescription: $productInfoDescription
                                          productType: $productType
                                          productShipping: $productShipping
                                          productDescriptionImages: $productDescriptionImages
                                        ) {
                                          ...fragment
                                        }
                                      }
                                      ${productFragments.ModalCreateEditProduct}
                                    `}
                                    onCompleted={data => {
                                      this.editProductCompletedHandler.bind(
                                        this
                                      )(data);
                                    }}
                                    onError={error => {
                                      this.createProductErrorHandler.bind(this)(
                                        error
                                      );
                                    }}
                                  >
                                    {(
                                      editProductMutation,
                                      { data, loading, error }
                                    ) => {
                                      if (loading) {
                                        return (
                                          <Button
                                            disabled
                                            variant="contained"
                                            color="primary"
                                          >
                                            {t('editing...')}
                                          </Button>
                                        );
                                      }

                                      return (
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={async () => {
                                            if (
                                              await this.checkSectionShippingField()
                                            )
                                              this.editProduct(
                                                editProductMutation
                                              );
                                          }}
                                        >
                                          {t('edit product')}
                                        </Button>
                                      );
                                    }}
                                  </Mutation>
                                )}
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
                        <Skeleton variant={'rect'} height={50} />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Modal>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  stepper: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  stepButtonContainer: {
    marginTop: theme.spacing(2)
  },
  inputUpload: {
    display: 'none'
  },
  productTypeImageButton: {
    marginRight: '10px'
  },
  productTypePaper: {
    position: 'relative',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  removeProductTypeButton: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  paperProductShippingInfo: {
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  },
  typographyProductShippingInfo: {
    color: '#fff'
  }
}))(
  withSnackbar(
    withTranslation()(withRouter(withApollo(ModalCreateEditProduct)))
  )
);
