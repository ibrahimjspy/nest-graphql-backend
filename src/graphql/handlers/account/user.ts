import { graphqlCall } from 'src/core/proxies/graphqlHandler';

import { userEmailByIdQuery } from 'src/graphql/queries/account';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

export const userEmailByIdHandler = async (
  userId: string,
  header: string,
): Promise<object> => {
  const response = await graphqlCall(userEmailByIdQuery(userId), header);

  if (!response['user']) {
    throw new RecordNotFound('User');
  }

  return response['user'];
};
