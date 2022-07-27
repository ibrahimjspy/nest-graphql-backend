export const graphqlQueryCheck = (federation, mock, partialMock?): string => {
  if (process.env.MOCK == 'true' || partialMock == 'true') {
    return mock;
  }
  if (process.env.MOCK == 'false' || partialMock == 'false') {
    return federation;
  }
};
//Todo change order of logic to be consistent with endpoint toggle
