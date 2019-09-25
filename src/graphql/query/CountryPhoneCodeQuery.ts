import gql, {disableFragmentWarnings} from 'graphql-tag';
import {DocumentNode} from "graphql";
import {QueryHookOptions, useLazyQuery, useQuery} from "@apollo/react-hooks";

import {SortField} from "./Query";

disableFragmentWarnings();

export interface CountryPhoneCodeVars {
    
created_at?: String;
updated_at?: String;
id?: String;
name?: String;
country_code?: String;
phone_code?: String;
sort_created_at?: SortField;
sort_updated_at?: SortField;
sort_id?: SortField;
sort_name?: SortField;
sort_country_code?: SortField;
sort_phone_code?: SortField;
where_like_created_at?: String;
where_like_updated_at?: String;
where_like_id?: String;
where_like_name?: String;
where_like_country_code?: String;
where_like_phone_code?: String;
}

export function useCountryPhoneCodeLazyQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{ countryPhoneCode: TData[] }, CountryPhoneCodeVars>
) {
    return useLazyQuery<{countryPhoneCode: TData[]}, CountryPhoneCodeVars>(countryPhoneCodeQuery(fragment), options);
}

export function useCountryPhoneCodeQuery<TData = any>(fragment: DocumentNode, options?: QueryHookOptions<{countryPhoneCode: TData[]}, CountryPhoneCodeVars>) {
    return useQuery<{countryPhoneCode: TData[]}, CountryPhoneCodeVars>(countryPhoneCodeQuery(fragment), options);
}

export function countryPhoneCodeQuery(fragment: DocumentNode): DocumentNode {
    return gql`
    query CountryPhoneCode(
    
$created_at: String,
$updated_at: String,
$id: ID,
$name: String,
$country_code: String,
$phone_code: String,
$sort_created_at: String,
$sort_updated_at: String,
$sort_id: String,
$sort_name: String,
$sort_country_code: String,
$sort_phone_code: String,
$where_like_created_at: String,
$where_like_updated_at: String,
$where_like_id: String,
$where_like_name: String,
$where_like_country_code: String,
$where_like_phone_code: String,
    ) {
        countryPhoneCode(
        
created_at: $created_at,
updated_at: $updated_at,
id: $id,
name: $name,
country_code: $country_code,
phone_code: $phone_code,
sort_created_at: $sort_created_at,
sort_updated_at: $sort_updated_at,
sort_id: $sort_id,
sort_name: $sort_name,
sort_country_code: $sort_country_code,
sort_phone_code: $sort_phone_code,
where_like_created_at: $where_like_created_at,
where_like_updated_at: $where_like_updated_at,
where_like_id: $where_like_id,
where_like_name: $where_like_name,
where_like_country_code: $where_like_country_code,
where_like_phone_code: $where_like_phone_code,
        ){
            ...fragment
        }
    }
    ${fragment}
`;
}
