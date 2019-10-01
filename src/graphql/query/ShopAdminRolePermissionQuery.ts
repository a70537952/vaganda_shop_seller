import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";


disableFragmentWarnings();

export interface ShopAdminRolePermissionVars {
    
}

export function useShopAdminRolePermissionLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ shopAdminRolePermission: TData[] }, ShopAdminRolePermissionVars>
) {
    return useLazyQuery<{shopAdminRolePermission: TData[]}, ShopAdminRolePermissionVars>(shopAdminRolePermissionQuery(fragment), options);
}

export function useShopAdminRolePermissionQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{shopAdminRolePermission: TData[]}, ShopAdminRolePermissionVars>) {
    return useQuery<{shopAdminRolePermission: TData[]}, ShopAdminRolePermissionVars>(shopAdminRolePermissionQuery(fragment), options);
}

export function shopAdminRolePermissionQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query ShopAdminRolePermission
    
     {
        shopAdminRolePermission
        
        {
            ...fragment
        }
    }
    ${fragment}
`;
}
