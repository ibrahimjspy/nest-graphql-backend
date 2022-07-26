export const graphqlQueryCheck = (federation, mock): string => {
  const run_mock_query: string = process.env.MOCK;
  if (run_mock_query == 'false') {
    return federation;
  } else {
    return mock;
  }
};
