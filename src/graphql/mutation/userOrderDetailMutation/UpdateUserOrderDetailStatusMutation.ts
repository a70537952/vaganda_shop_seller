import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateUserOrderDetailStatusMutationVars {
  shop_id: String;
  userOrderDetailIds: String[];
  order_detail_status: String;
}

export function useUpdateUserOrderDetailStatusMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateUserOrderDetailStatusMutation: TData[] },
    UpdateUserOrderDetailStatusMutationVars
  >
) {
  return useMutation<
    { updateUserOrderDetailStatusMutation: TData[] },
    UpdateUserOrderDetailStatusMutationVars
  >(UpdateUserOrderDetailStatusMutation(fragment), options);
}

export function UpdateUserOrderDetailStatusMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UpdateUserOrderDetailStatusMutation(
      $shop_id: String
      $userOrderDetailIds: [String]!
      $order_detail_status: String!
    ) {
      updateUserOrderDetailStatusMutation(
        shop_id: $shop_id
        userOrderDetailIds: $userOrderDetailIds
        order_detail_status: $order_detail_status
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
