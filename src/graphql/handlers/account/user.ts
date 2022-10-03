import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlCall } from 'src/public/graphqlHandler';
import { userQuery } from '../../queries/user';

export const userByIdHandler = async (userId: string): Promise<object> => {
  const response = await graphqlCall(userQuery(userId));

  if (!response['user']) {
    throw new RecordNotFound('User');
  }

  return response['user'];
};

