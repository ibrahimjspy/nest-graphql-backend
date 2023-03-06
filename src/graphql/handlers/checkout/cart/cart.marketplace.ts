import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { deleteCheckoutBundlesMutation } from 'src/graphql/mutations/checkout/deleteCheckoutBundle';

export const deleteCheckoutBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  userEmail: string,
  throwException = false,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      deleteCheckoutBundlesMutation(checkoutBundleIds, userEmail),
      token,
    ),
    throwException,
  );
  return response['deleteCheckoutBundles'];
};
