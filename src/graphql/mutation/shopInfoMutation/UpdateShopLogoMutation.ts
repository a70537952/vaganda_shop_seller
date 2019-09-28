import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface UpdateShopLogoMutationVars {
    
shop_id: String;
logo?: File;
}

export function useUpdateShopLogoMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ updateShopLogoMutation: TData }, UpdateShopLogoMutationVars>) {
    return useMutation<{ updateShopLogoMutation: TData }, UpdateShopLogoMutationVars>(UpdateShopLogoMutation(fragment), options);
}

export function UpdateShopLogoMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation UpdateShopLogoMutation
    (
$shop_id: String!,
$logo: Upload,
)
    {
            updateShopLogoMutation
            (
shop_id: $shop_id,
logo: $logo,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
