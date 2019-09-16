import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateShopAddressMutationVars {
  shop_id: String;
  has_physical_shop: boolean;
  address_1: String;
  address_2: String;
  address_3: String;
  city: String;
  state: String;
  postal_code: String;
  country: String;
  latitude: String;
  longitude: String;
}

export function useUpdateShopAddressMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateShopAddressMutation: TData },
    UpdateShopAddressMutationVars
  >
) {
  return useMutation<
    { updateShopAddressMutation: TData },
    UpdateShopAddressMutationVars
  >(UpdateShopAddressMutation(fragment), options);
}

export function UpdateShopAddressMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UpdateShopAddressMutation(
      $shop_id: String!
      $has_physical_shop: Boolean
      $address_1: String
      $address_2: String
      $address_3: String
      $city: String
      $state: String
      $postal_code: String
      $country: String
      $latitude: String
      $longitude: String
    ) {
      updateShopAddressMutation(
        shop_id: $shop_id
        has_physical_shop: $has_physical_shop
        address_1: $address_1
        address_2: $address_2
        address_3: $address_3
        city: $city
        state: $state
        postal_code: $postal_code
        country: $country
        latitude: $latitude
        longitude: $longitude
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
