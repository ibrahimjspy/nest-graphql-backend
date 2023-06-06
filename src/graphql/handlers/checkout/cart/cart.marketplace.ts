import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { addCheckoutBundlesV2Mutation } from 'src/graphql/mutations/checkout/cart/marketplace/addBundles';
import { replaceCheckoutBundleMutation } from 'src/graphql/mutations/checkout/cart/marketplace/replaceBundle';
import { deleteCheckoutBundlesMutation } from 'src/graphql/mutations/checkout/deleteCheckoutBundle';
import { getCartV2Query } from 'src/graphql/queries/checkout/cart/marketplace.cart';
import { ReplaceBundleDto } from 'src/modules/checkout/cart/dto/cart';
import { MarketplaceBundlesType } from 'src/modules/checkout/cart/services/marketplace/Cart.marketplace.types';
import { AddBundleDto } from 'src/modules/checkout/dto';

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

export const addCheckoutBundlesV2Handler = async (
  checkoutBundles: AddBundleDto,
  token: string,
): Promise<MarketplaceBundlesType> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(addCheckoutBundlesV2Mutation(checkoutBundles), token),
  );
  return response['addBundlesToCart'];
};

export const replaceCheckoutBundleHandler = async (
  replaceCheckoutBundleInput: ReplaceBundleDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      replaceCheckoutBundleMutation(replaceCheckoutBundleInput),
      token,
    ),
  );
  return response['updateCheckoutBundle'];
};
