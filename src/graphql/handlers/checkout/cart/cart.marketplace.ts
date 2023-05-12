import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { deleteCheckoutBundlesMutation } from 'src/graphql/mutations/checkout/deleteCheckoutBundle';
import { getCartV2Query } from 'src/graphql/queries/checkout/cart/marketplace.cart';

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

export const getCartV2Handler = async (
  checkoutId: string,
  token: string,
  isSelected = null,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getCartV2Query(checkoutId, isSelected), token),
  );
  return response['getCart'];
};
