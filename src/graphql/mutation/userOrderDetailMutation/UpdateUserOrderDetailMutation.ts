import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateUserOrderDetailMutationVars {
  user_order_detail_id: String;
  shop_id: String;
  order_detail_status: String;
  product_shipping_track_number: String;
  remark: String;
}

export function useUpdateUserOrderDetailMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateUserOrderDetailMutation: TData },
    UpdateUserOrderDetailMutationVars
  >
) {
  return useMutation<
    { updateUserOrderDetailMutation: TData },
    UpdateUserOrderDetailMutationVars
  >(UpdateUserOrderDetailMutation(fragment), options);
}

export function UpdateUserOrderDetailMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UpdateUserOrderDetailMutation(
      $user_order_detail_id: String!
      $shop_id: String
      $order_detail_status: String
      $product_shipping_track_number: String
      $remark: String
    ) {
      updateUserOrderDetailMutation(
        user_order_detail_id: $user_order_detail_id
        shop_id: $shop_id
        order_detail_status: $order_detail_status
        product_shipping_track_number: $product_shipping_track_number
        remark: $remark
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
