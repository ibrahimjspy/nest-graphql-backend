import { v4 as uuidv4 } from 'uuid';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/public/graphqlHandler';
import * as CheckoutQueries from 'src/graphql/queries/checkout';
import * as UserQueries from 'src/graphql/queries/user';
import RecordNotFound from 'src/exceptions/recordNotFound';

import {
  getLineItems,
  getBundleIds,
  getDummyGateway,
  getTargetLineItems,
} from 'src/public/checkoutHelperFunctions';

export const bundlesListHandler = async (
  bundles: Array<{
    bundleId: string;
    quantity: number;
  }>,
): Promise<object> => {
  const bundleIds = getBundleIds(bundles);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.bundlesQuery(bundleIds)),
  );

  if (!response['bundles']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response;
};

export const getMarketplaceCheckoutHandler = async (
  id: string,
  throwException: boolean = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.getMarketplaceCheckoutQuery(id)),
    throwException,
  );
  return response['marketplaceCheckout'];
};

export const createCheckoutHandler = async (
  email: string,
  bundlesList,
  bundlesForCart: Array<{ quantity: number; bundleId: string }>,
): Promise<object> => {
  const lines = getLineItems(bundlesList, bundlesForCart);
  const response = await graphqlCall(
    CheckoutQueries.createCheckoutQuery(email, lines),
  );
  return response['checkoutCreate'];
};

export const addCheckoutBundlesHandler = async (
  checkoutId: string,
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.addCheckoutBundlesQuery(checkoutId, userId, bundles),
    ),
  );
  return response['addCheckoutBundles'];
};

export const addForCartHandler = async (
  checkoutId,
  bundlesList,
  bundlesForCart: Array<{ quantity: number; bundleId: string }>,
): Promise<object> => {
  const lines = getLineItems(bundlesList, bundlesForCart);
  return await graphqlCall(
    CheckoutQueries.checkoutLinesAddQuery(checkoutId, lines),
  );
};

export const checkoutLinesAddHandler = async (
  checkoutId,
  saleorCheckout,
  bundles,
  bundleIds: Array<string>,
): Promise<object> => {
  const targetLineItems = getTargetLineItems(
    saleorCheckout,
    bundles,
    bundleIds,
  );
  return await graphqlCall(
    CheckoutQueries.checkoutLinesAddQuery(checkoutId, targetLineItems),
  );
};

export const checkoutHandler = async (checkoutId: string): Promise<object> => {
  return await graphqlCall(CheckoutQueries.checkoutQuery(checkoutId));
};

export const checkoutLinesDeleteHandler = async (
  saleorCheckout,
  bundles,
  bundleIds,
): Promise<object> => {
  const lines = getTargetLineItems(saleorCheckout, bundles, bundleIds);
  const lineIds = (lines || []).map((l: any) => l?.id);
  return await graphqlCall(CheckoutQueries.checkoutLinesDeleteQuery(lineIds));
};

export const deleteCheckoutBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
): Promise<object> => {
  return await graphqlCall(
    CheckoutQueries.deleteCheckoutBundlesQuery(checkoutBundleIds, checkoutId),
  );
};

export const checkoutLinesUpdateHandler = async (
  checkoutId: string,
  lines: Array<{ variantId: string; quantity: number }>,
): Promise<object> => {
  return await graphqlCall(
    CheckoutQueries.checkoutLinesUpdateQuery(checkoutId, lines),
  );
};

export const shippingAddressHandler = async (
  checkoutId,
  addressDetails,
): Promise<object> => {
  return await graphqlCall(
    CheckoutQueries.shippingAddressQuery(checkoutId, addressDetails),
  );
};

export const billingAddressHandler = async (
  checkoutId,
  addressDetails,
): Promise<object> => {
  return await graphqlCall(
    CheckoutQueries.billingAddressQuery(checkoutId, addressDetails),
  );
};

export const shippingBillingAddress = async (
  checkoutId: string,
): Promise<object> => {
  return await graphqlCall(
    CheckoutQueries.shippingBillingAddressQuery(checkoutId),
  );
};

export const addCheckoutShippingMethodHandler = async (
  checkoutData,
  shopShippingMethodIds: Array<string>,
) => {
  const { checkoutId } = checkoutData?.marketplaceCheckout;
  return await graphqlCall(
    CheckoutQueries.addCheckoutShippingMethodsQuery(
      checkoutId,
      shopShippingMethodIds,
    ),
  );
};

export const checkoutDeliveryMethodUpdateHandler = async (checkoutData) => {
  const { checkoutId, selectedMethods } = checkoutData?.marketplaceCheckout;
  const deliveryMethodId = selectedMethods[0]?.method?.shippingMethodId;
  return await graphqlCall(
    CheckoutQueries.checkoutDeliveryMethodUpdateQuery(
      checkoutId,
      deliveryMethodId,
    ),
  );
};

export const createPaymentHandler = async (checkoutData, paymentGateways) => {
  const { checkoutId } = checkoutData?.marketplaceCheckout;
  const dummyGatewayId = getDummyGateway(paymentGateways);
  const token = uuidv4();
  return await graphqlCall(
    CheckoutQueries.checkoutPaymentCreateQuery(
      checkoutId,
      dummyGatewayId,
      token,
    ),
  );
};

export const getPaymentGatewaysHandler = async (checkoutData) => {
  const { checkoutId } = checkoutData?.marketplaceCheckout;
  return await graphqlCall(
    CheckoutQueries.availablePaymentGatewaysQuery(checkoutId),
  );
};

export const getUserHandler = async (userId: string) => {
  const response = await graphqlCall(UserQueries.userQuery(userId));
  return response['user'];
};

export const checkoutEmailUpdateHandler = async (checkoutData, userData) => {
  const { checkoutId } = checkoutData?.marketplaceCheckout;
  const { email } = userData.user;
  return await graphqlCall(
    UserQueries.checkoutEmailUpdateQuery(checkoutId, email),
  );
};

export const checkoutCompleteHandler = async (checkoutId: string) => {
  return await graphqlCall(CheckoutQueries.checkoutCompleteQuery(checkoutId));
};
