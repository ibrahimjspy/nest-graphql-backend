import { graphqlCall } from 'src/core/proxies/graphqlHandler';

import {
  userEmailByIdQuery,
  userInformationQuery,
} from 'src/graphql/queries/account';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

export const userEmailByIdHandler = async (
  userId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlCall(userEmailByIdQuery(userId), token);
  if (!response['user']) throw new RecordNotFound('User');

  return response['user'];
};

export const getUserDetailsHandler = async (Token: string): Promise<object> => {
  const response = await graphqlCall(userInformationQuery(), Token);
  if (!response['me']) throw new RecordNotFound('User');

  return response['me'];
};
