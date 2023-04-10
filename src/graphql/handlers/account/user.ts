import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';

import {
  userEmailByIdQuery,
  userInformationQuery,
} from 'src/graphql/queries/account';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { UserInputDTO } from 'src/modules/account/user/dto/user.dto';
import { updateUserInfoMutation } from 'src/graphql/mutations/account/userInfoUpdate';
import { getCheckoutIdFromMarketplaceQuery } from 'src/graphql/queries/account/getCheckoutIdFromMarketplace';

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

export const updateUserInfoHandler = async (
  userInput: UserInputDTO,
  token: string,
  isb2c = false,
): Promise<any> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(updateUserInfoMutation(userInput, isb2c), token, isb2c),
  );
  return response['accountUpdate'];
};

export const getCheckoutIdFromMarketplaceHandler = async (
  userEmail: string,
): Promise<object> => {
  const response = await graphqlCall(
    getCheckoutIdFromMarketplaceQuery(userEmail),
  );
  return response['checkoutBundles']['checkoutId'];
};
