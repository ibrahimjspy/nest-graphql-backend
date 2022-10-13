import { graphqlCall } from 'src/core/proxies/graphqlHandler';
import { addressCreateInputType } from '../../mutations/account';

import { addressCreateMutation } from '../../mutations/account';

export const addressCreate = async (
  userId: string,
  address: addressCreateInputType,
): Promise<object> => {
  const response = await graphqlCall(addressCreateMutation(userId, address));

  return response['addressCreate'];
};
