import { graphqlCall } from 'src/core/proxies/graphqlHandler';
import { userAddressesByIdQuery } from 'src/graphql/queries/account';
import {
  AddressCreateInputType,
  addressCreateMutation,
} from 'src/graphql/mutations/account';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

export const addressByUserIdHandler = async (
  userId: string,
): Promise<object> => {
  const response = await graphqlCall(userAddressesByIdQuery(userId));

  if (!response['user']) {
    throw new RecordNotFound('User');
  }

  return response['user'];
};

export const addressCreate = async (
  userId: string,
  address: AddressCreateInputType,
): Promise<object> => {
  const response = await graphqlCall(addressCreateMutation(userId, address));

  return response['addressCreate'];
};
