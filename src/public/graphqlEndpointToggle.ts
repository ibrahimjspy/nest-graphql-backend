export const graphqlEndpoint = () => {
  if (process.env.MOCK == 'true') {
    return process.env.MOCK_GRAPHQL_ENDPOINT;
  }
  if (process.env.MOCK == 'false') {
    return process.env.GRAPHQL_ENDPOINT;
  }
};
