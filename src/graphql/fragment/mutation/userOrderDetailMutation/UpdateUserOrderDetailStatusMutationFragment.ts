import gql from "graphql-tag";

export let updateUserOrderDetailStatusMutationFragments: any = {
  OrderDetail: gql`
    fragment fragment on UserOrderDetail {
      id
      order_detail_status
    }
  `
};
