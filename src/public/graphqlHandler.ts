import { request } from 'graphql-request';
import { graphqlEndpoint } from './graphqlEndpointToggle';
type GraphqlCall = (Query: string, Mock?: string) => Promise<object>;
/**
 * This is top level function which handles graphql requests , exceptions and logic
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @params Mock , it is an optional parameter to allow specific functions to call mock server while other
 * keep calling federation services
 * @note This function determines its endpoint logic through another public method graphqlHandler() which
 * is based on env files content .
 * @returns an object with data or graphql error
 */
export const graphqlCall: GraphqlCall = async (Query, Mock?) => {
  let Data = {};
  await request(graphqlEndpoint(Mock ? Mock : ''), Query)
    .then((data) => {
      Data = data;
    })
    .catch((err) => {
      err.type ? console.log('system error') : '';
      const error_response = { message: err?.response?.errors[0]?.message };
      console.log('graphql error', error_response);
      Data = { status: 400 };
    });
  return Data;
};
