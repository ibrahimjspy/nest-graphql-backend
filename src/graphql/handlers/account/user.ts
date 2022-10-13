import { graphqlCall } from 'src/public/graphqlHandler';

import { userEmailByIdQuery } from 'src/graphql/queries/account';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

export const userEmailByIdHandler = async (userId: string): Promise<object> => {
  const response = await graphqlCall(userEmailByIdQuery(userId));

  if (!response['user']) {
    throw new RecordNotFound('User');
  }

  return response['user'];
};
