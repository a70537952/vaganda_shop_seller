import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink, from } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import NProgress from "nprogress";
import axios from "./axios";
import fragmentTypes from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes
});

const customFetch = (uri: string, options: any) => {
  let optionsBody = options.body;
  if (typeof optionsBody === 'string') {
    optionsBody = JSON.parse(optionsBody);
  }

  return axios.post(uri, optionsBody).then((data: any) => {
    if (Array.isArray(data.data)) {
      return new Response(JSON.stringify(data.data[0]));
    }
    return new Response(JSON.stringify(data.data));
  });
};
const link = createUploadLink({ fetch: customFetch });

const cache = new InMemoryCache({ fragmentMatcher });

const beforeMiddleware = new ApolloLink((operation: any, forward: any) => {
  NProgress.start();
  return forward(operation);
});

const afterMiddleware = new ApolloLink((operation: any, forward: any) => {
  NProgress.done();
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: from([beforeMiddleware, afterMiddleware.concat(link)]),
  cache
});

export default apolloClient;
