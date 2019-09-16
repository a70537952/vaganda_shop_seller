import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateShopContactInfoMutationVars {
  shop_id: String;
  email: String;
  website: String;
  telephone_country_code: String;
  telephone: String;
  phone_country_code: String;
  phone: String;
}

export function useUpdateShopContactInfoMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateShopContactInfoMutation: TData },
    UpdateShopContactInfoMutationVars
  >
) {
  return useMutation<
    { updateShopContactInfoMutation: TData },
    UpdateShopContactInfoMutationVars
  >(UpdateShopContactInfoMutation(fragment), options);
}

export function UpdateShopContactInfoMutation(
  fragment: DocumentNode
): DocumentNode {
  return gql`
    mutation UpdateShopContactInfoMutation(
      $shop_id: String!
      $email: String
      $website: String
      $telephone_country_code: String
      $telephone: String
      $phone_country_code: String
      $phone: String
    ) {
      updateShopContactInfoMutation(
        shop_id: $shop_id
        email: $email
        website: $website
        telephone_country_code: $telephone_country_code
        telephone: $telephone
        phone_country_code: $phone_country_code
        phone: $phone
      ) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
