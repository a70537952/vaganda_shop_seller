import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";

import ExtraOptionInput from "../../input/ExtraOptionInput";
import ProductTypeInput from "../../input/ProductTypeInput";
import ProductShippingInput from "../../input/ProductShippingInput";

interface EditProductMutationVars {
    
product_id: String;
shop_id: String;
productInfoTitle: String;
productInfoProductCategoryId: String;
productInfoExtraOption: ExtraOptionInput[];
productInfoWidth: String;
productInfoWidthUnit: String;
productInfoHeight: String;
productInfoHeightUnit: String;
productInfoLength: String;
productInfoLengthUnit: String;
productInfoWeight: String;
productInfoWeightUnit: String;
productInfoIsPublish: boolean;
productInfoImages: String[];
productInfoDescription: String;
productType: ProductTypeInput[];
productShipping: ProductShippingInput[];
productDescriptionImages: String[];
}

export function useEditProductMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ editProductMutation: TData }, EditProductMutationVars>) {
    return useMutation<{ editProductMutation: TData }, EditProductMutationVars>(EditProductMutation(fragment), options);
}

export function EditProductMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation EditProductMutation
    (
$product_id: String,
$shop_id: String,
$productInfoTitle: String,
$productInfoProductCategoryId: String,
$productInfoExtraOption: [ExtraOptionInput]!,
$productInfoWidth: String,
$productInfoWidthUnit: String,
$productInfoHeight: String,
$productInfoHeightUnit: String,
$productInfoLength: String,
$productInfoLengthUnit: String,
$productInfoWeight: String,
$productInfoWeightUnit: String,
$productInfoIsPublish: Boolean,
$productInfoImages: [String]!,
$productInfoDescription: String,
$productType: [ProductTypeInput]!,
$productShipping: [ProductShippingInput]!,
$productDescriptionImages: [String],
)
    {
            editProductMutation
            (
product_id: $product_id,
shop_id: $shop_id,
productInfoTitle: $productInfoTitle,
productInfoProductCategoryId: $productInfoProductCategoryId,
productInfoExtraOption: $productInfoExtraOption,
productInfoWidth: $productInfoWidth,
productInfoWidthUnit: $productInfoWidthUnit,
productInfoHeight: $productInfoHeight,
productInfoHeightUnit: $productInfoHeightUnit,
productInfoLength: $productInfoLength,
productInfoLengthUnit: $productInfoLengthUnit,
productInfoWeight: $productInfoWeight,
productInfoWeightUnit: $productInfoWeightUnit,
productInfoIsPublish: $productInfoIsPublish,
productInfoImages: $productInfoImages,
productInfoDescription: $productInfoDescription,
productType: $productType,
productShipping: $productShipping,
productDescriptionImages: $productDescriptionImages,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
