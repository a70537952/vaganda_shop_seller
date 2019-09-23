import queryString from 'query-string';

import { useContext } from 'react';

import {
  // @ts-ignore
  __RouterContext as RouterContext,
  RouteComponentProps
} from 'react-router-dom';

export default function useRouter<Params = any>() {
  const context: RouteComponentProps<Params> = useContext(RouterContext);
  let queryParams = queryString.parse(context.location.search);
  let params = context.match.params;

  return {
    ...context,
    ...{
      queryParams,
      params
    }
  };
}
