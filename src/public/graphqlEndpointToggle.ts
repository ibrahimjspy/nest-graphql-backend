type GraphqlEndpoint = (specificMock?: string) => string;
/**
 * returns graphql Endpoint depending on env file
 * @params specificMock is an optional parameter to mock a handler specifically
 */
export const graphqlEndpoint: GraphqlEndpoint = (specificMock?) => {
  if (process.env.MOCK == 'true' || specificMock == 'true') {
    return process.env.MOCK_GRAPHQL_ENDPOINT;
  }
  if (process.env.MOCK == 'false' || specificMock == 'false') {
    return process.env.GRAPHQL_ENDPOINT;
  }
};
