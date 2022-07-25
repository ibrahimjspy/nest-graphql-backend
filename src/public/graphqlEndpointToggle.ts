export const graphqlEndpoint = () => {
  if (process.env.MOCK == 'true') {
    return process.env.MOCK_GRAPHQL_ENDPOINT || TEST;
  }
  if (process.env.MOCK == 'false') {
    return process.env.GRAPHQL_ENDPOINT || TEST;
  }
};
const TEST = 'http://localhost:4000/';
