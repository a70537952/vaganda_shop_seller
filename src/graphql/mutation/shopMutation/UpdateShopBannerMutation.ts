import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

interface UpdateShopBannerMutationVars {
  shop_id: String;
  banner: File;
}

export function useUpdateShopBannerMutation<TData = any>(
  fragment: DocumentNode,
  options?: MutationHookOptions<
    { updateShopBannerMutation: TData },
    UpdateShopBannerMutationVars
  >
) {
  return useMutation<
    { updateShopBannerMutation: TData },
    UpdateShopBannerMutationVars
  >(UpdateShopBannerMutation(fragment), options);
}

export function UpdateShopBannerMutation(fragment: DocumentNode): DocumentNode {
  return gql`
    mutation UpdateShopBannerMutation($shop_id: String!, $banner: Upload) {
      updateShopBannerMutation(shop_id: $shop_id, banner: $banner) {
        ...fragment
      }
    }
    ${fragment}
  `;
}
