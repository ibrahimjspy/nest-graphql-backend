import { graphqlCall } from 'src/core/proxies/graphqlHandler';

import {
  userEmailByIdQuery,
  UserInformationQuery,
} from 'src/graphql/queries/account';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

export const userEmailByIdHandler = async (
  userId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlCall(userEmailByIdQuery(userId), token);

  if (!response['user']) {
    throw new RecordNotFound('User');
  }

  return response['user'];
};

export const GetUserDetailsHandler = async (Token: string): Promise<object> => {
  const response = await graphqlCall(UserInformationQuery(), Token, 'false');
  if (response.me === null) throw new RecordNotFound('User');

  return response.me;
};
