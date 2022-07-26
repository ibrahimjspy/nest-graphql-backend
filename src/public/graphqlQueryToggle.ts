export const graphqlQueryCheck = (federation, mock): string => {
  if (process.env.MOCK == 'false') {
    return federation;
  }
  if (process.env.MOCK == 'true') {
    return mock;
  }
};
