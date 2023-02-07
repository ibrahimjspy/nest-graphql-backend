import { B2C_ENABLED } from 'src/constants';

type GraphqlQuery = (
  b2bQuery: string,
  b2cQuery: string,
  partialB2c?: string | boolean,
) => string;
/**
 * Returns graphql query depending on env file instructions
 * @params b2bQuery , linking with b2b backend
 * @params b2cQuery , linking with b2c backend
 * @params partialB2c , it is an  optional parameter used to specifically instruct which query to use
 */
export const graphqlQueryCheck: GraphqlQuery = (
  b2bQuery,
  b2cQuery,
  specificB2c?,
) => {
  if (B2C_ENABLED == 'true' || specificB2c == true) {
    return b2cQuery;
  }
  if (B2C_ENABLED == 'false') {
    return b2bQuery;
  }
};
