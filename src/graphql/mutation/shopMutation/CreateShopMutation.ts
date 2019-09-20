import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import {MutationHookOptions, useMutation} from "@apollo/react-hooks";


interface CreateShopMutationVars {
    
shopSetupName?: String;
shopSetupShopCategory?: String;
shopSetupShopCurrency?: String;
shopSetupHasPhysicalShop?: boolean;
shopInfoSummary?: String;
shopInfoLogo?: String;
shopInfoBanner?: String;
shopAddressAddress1?: String;
shopAddressAddress2?: String;
shopAddressAddress3?: String;
shopAddressCity?: String;
shopAddressState?: String;
shopAddressPostalCode?: String;
shopAddressCountry?: String;
shopAddressLatitude?: String;
shopAddressLongitude?: String;
shopContactEmail?: String;
shopContactWebsite?: String;
shopContactTelephoneCountryCode?: String;
shopContactTelephone?: String;
shopContactPhoneCountryCode?: String;
shopContactPhone?: String;
}

export function useCreateShopMutation<TData = any>(fragment: DocumentNode, options?: MutationHookOptions<{ createShopMutation: TData }, CreateShopMutationVars>) {
    return useMutation<{ createShopMutation: TData }, CreateShopMutationVars>(CreateShopMutation(fragment), options);
}

export function CreateShopMutation(fragment: DocumentNode): DocumentNode {
    return gql`
    mutation CreateShopMutation
    (
$shopSetupName: String,
$shopSetupShopCategory: String,
$shopSetupShopCurrency: String,
$shopSetupHasPhysicalShop: Boolean,
$shopInfoSummary: String,
$shopInfoLogo: String,
$shopInfoBanner: String,
$shopAddressAddress1: String,
$shopAddressAddress2: String,
$shopAddressAddress3: String,
$shopAddressCity: String,
$shopAddressState: String,
$shopAddressPostalCode: String,
$shopAddressCountry: String,
$shopAddressLatitude: String,
$shopAddressLongitude: String,
$shopContactEmail: String,
$shopContactWebsite: String,
$shopContactTelephoneCountryCode: String,
$shopContactTelephone: String,
$shopContactPhoneCountryCode: String,
$shopContactPhone: String,
)
    {
            createShopMutation
            (
shopSetupName: $shopSetupName,
shopSetupShopCategory: $shopSetupShopCategory,
shopSetupShopCurrency: $shopSetupShopCurrency,
shopSetupHasPhysicalShop: $shopSetupHasPhysicalShop,
shopInfoSummary: $shopInfoSummary,
shopInfoLogo: $shopInfoLogo,
shopInfoBanner: $shopInfoBanner,
shopAddressAddress1: $shopAddressAddress1,
shopAddressAddress2: $shopAddressAddress2,
shopAddressAddress3: $shopAddressAddress3,
shopAddressCity: $shopAddressCity,
shopAddressState: $shopAddressState,
shopAddressPostalCode: $shopAddressPostalCode,
shopAddressCountry: $shopAddressCountry,
shopAddressLatitude: $shopAddressLatitude,
shopAddressLongitude: $shopAddressLongitude,
shopContactEmail: $shopContactEmail,
shopContactWebsite: $shopContactWebsite,
shopContactTelephoneCountryCode: $shopContactTelephoneCountryCode,
shopContactTelephone: $shopContactTelephone,
shopContactPhoneCountryCode: $shopContactPhoneCountryCode,
shopContactPhone: $shopContactPhone,
)
            {
             ...fragment
           }
        }
    ${fragment}
`;
}
