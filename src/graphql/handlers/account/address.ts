import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import * as AccountQueries from 'src/graphql/queries/account';
import * as AccountMutations from 'src/graphql/mutations/account';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { AddressType } from './address.type';

export const addressesByUserIdHandler = async (
  userId: string,
): Promise<AddressType[]> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(AccountQueries.userAddressesByIdQuery(userId)),
  );

  return response?.user?.addresses || [];
};

export const createAddressHandler = async (
  userId: string,
  address: AccountMutations.AddressInput,
): Promise<AddressType> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(AccountMutations.addressCreateMutation(userId, address)),
  );

  if (!response?.addressCreate?.address) throw new RecordNotFound('Address');
  return response?.addressCreate?.address;
};

export const deleteAddressHandler = async (
  addressId: string,
): Promise<void> => {
  await graphqlResultErrorHandler(
    await graphqlCall(AccountMutations.addressDeleteMutation(addressId)),
  );
};

export const setDefaultAddressHandler = async (
  userId: string,
  addressId: string,
): Promise<AddressType[]> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      AccountMutations.addressSetDefaultMutation(userId, addressId),
    ),
  );

  if (!response?.addressSetDefault?.user) throw new RecordNotFound('User');
  return response?.addressSetDefault?.user?.addresses || [];
};

export const updateAddressHandler = async (
  addressId: string,
  address: AccountMutations.AddressInput,
): Promise<AddressType> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      AccountMutations.addressUpdateMutation(addressId, address),
    ),
  );

  if (!response?.addressUpdate?.address) throw new RecordNotFound('Address');
  return response?.addressUpdate?.address;
};
