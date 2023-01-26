type GraphqlQuery = (
  federationQuery: string,
  mockQuery: string,
  partialMock?: string | boolean,
) => string;
/**
 * Returns graphql query depending on env file instructions
 * @params federationQuery , linking with real backend services.
 * @params mockQuery , linking with mock server .
 * @params partialMock , it is an  optional parameter used to support specific mock calls
 */
export const graphqlQueryCheck: GraphqlQuery = (
  federationQuery,
  mockQuery,
  partialMock?,
) => {
  if (process.env.MOCK == 'true' || partialMock == 'true') {
    return mockQuery;
  }
  if (process.env.MOCK == 'false' || partialMock == 'false') {
    return federationQuery;
  }
};
