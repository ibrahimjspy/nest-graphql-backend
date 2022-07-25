export const graphqlQueryCheck = (federation, mock) => {
  const run_mock_query = process.env.MOCK;
  if (run_mock_query == 'false') {
    return federation;
  } else {
    return mock;
  }
};
