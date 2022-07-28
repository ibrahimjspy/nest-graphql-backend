/**
 * Returns graphql query depending on env file instructions
 * @params federation and mock are queries passed
 * @params partialMock is an  optional parameter used to support specific mock calls
 */
// eslint-disable-next-line prettier/prettier
export const graphqlQueryCheck = (federation, mock, partialMock?: string): string => {
  if (process.env.MOCK == 'true' || partialMock == 'true') {
    return mock;
  }
  if (process.env.MOCK == 'false' || partialMock == 'false') {
    return federation;
  }
};
//Todo change order of logic to be consistent with endpoint toggle
