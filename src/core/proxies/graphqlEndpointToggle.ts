import { B2B_ENDPOINT, B2C_ENABlED, B2C_ENDPOINT } from 'src/constants';

type GraphqlEndpoint = (specificB2c?: string | boolean) => string;
/**
 * returns graphql Endpoint depending on env file
 * @params specificB2c is an optional parameter to direct a handler specifically
 */
export const graphqlEndpoint: GraphqlEndpoint = (specificB2c?) => {
  if (B2C_ENABlED == 'true' || specificB2c == true) {
    return B2C_ENDPOINT;
  }
  if (B2C_ENABlED == 'false' || specificB2c == false) {
    return B2B_ENDPOINT;
  }
};
