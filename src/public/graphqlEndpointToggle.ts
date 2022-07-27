export const graphqlEndpoint = (partialMock?): string => {
  if (process.env.MOCK == 'true' || partialMock == 'true') {
    return process.env.MOCK_GRAPHQL_ENDPOINT;
  }
  if (process.env.MOCK == 'false') {
    return process.env.GRAPHQL_ENDPOINT;
  }
};
