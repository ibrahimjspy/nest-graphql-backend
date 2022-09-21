import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { v4 as uuidv4 } from 'uuid';
import * as CheckoutQueries from 'src/graphql/queries/checkout';
import * as UserQueries from 'src/graphql/queries/user';

import {
  getLineItems,
  getBundleIds,
  getTargetLineIds,
  getShippingMethods,
  getShippingMethodsWithUUID,
  getDummyGateway,
} from 'src/public/checkoutHelperFunctions';

export const bundlesListHandler = async (
  bundles: Array<{
    bundleId: string;
    quantity: number;
  }>,
): Promise<object> => {
  try {
    const bundleIds = getBundleIds(bundles);
    return await graphqlCall(CheckoutQueries.bundlesQuery(bundleIds));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getCheckoutHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(CheckoutQueries.getCheckoutQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createCheckoutHandler = async (
  bundlesList,
  bundlesForCart: Array<{ quantity: number; bundleId: string }>,
): Promise<object> => {
  try {
    const lines = getLineItems(bundlesList, bundlesForCart);
    return await graphqlCall(CheckoutQueries.createCheckoutQuery(lines));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addCheckoutBundlesHandler = async (
  checkoutId: string,
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
): Promise<object> => {
  try {
    return await graphqlCall(
      CheckoutQueries.addCheckoutBundlesQuery(checkoutId, userId, bundles),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addForCartHandler = async (
  checkoutId,
  bundlesList,
  bundlesForCart: Array<{ quantity: number; bundleId: string }>,
): Promise<object> => {
  try {
    const lines = getLineItems(bundlesList, bundlesForCart);
    return await graphqlCall(
      CheckoutQueries.checkoutLinesAddQuery(checkoutId, lines),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutLinesAddHandler = async (
  checkoutId,
  saleorCheckout,
  bundles,
  bundleIds: Array<string>,
): Promise<object> => {
  try {
    const targetLineItems = getTargetLineIds(
      saleorCheckout,
      bundles,
      bundleIds,
    );
    return await graphqlCall(
      CheckoutQueries.checkoutLinesAddQuery(checkoutId, targetLineItems),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutHandler = async (checkoutId: string): Promise<object> => {
  try {
    return await graphqlCall(CheckoutQueries.checkoutQuery(checkoutId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutLinesDeleteHandler = async (
  linedIds: Array<string>,
): Promise<object> => {
  try {
    return await graphqlCall(
      CheckoutQueries.checkoutLinesDeleteQuery(
        (linedIds || []).map((l: any) => l?.id),
      ),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const deleteCheckoutBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
): Promise<object> => {
  try {
    return await graphqlCall(
      CheckoutQueries.deleteCheckoutBundlesQuery(checkoutBundleIds, checkoutId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutLinesUpdateHandler = async (
  checkoutId: string,
  lines: Array<{ variantId: string; quantity: number }>,
): Promise<object> => {
  try {
    return await graphqlCall(
      CheckoutQueries.checkoutLinesUpdateQuery(checkoutId, lines),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const shippingAddressHandler = async (
  checkoutId,
  addressDetails,
): Promise<object> => {
  try {
    return await graphqlCall(
      CheckoutQueries.shippingAddressQuery(checkoutId, addressDetails),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const billingAddressHandler = async (
  checkoutId,
  addressDetails,
): Promise<object> => {
  try {
    return await graphqlCall(
      CheckoutQueries.billingAddressQuery(checkoutId, addressDetails),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const shippingBillingAddress = async (
  checkoutId: string,
): Promise<object> => {
  try {
    return await graphqlCall(
      CheckoutQueries.shippingBillingAddressQuery(checkoutId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getShippingMethodHandler = async (
  userId: string,
): Promise<object> => {
  try {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, selectedMethods, bundles } =
      checkoutData?.marketplaceCheckout || {};
    const saleorCheckout: any = await checkoutHandler(checkoutId);
    const methodsListFromShopService = getShippingMethods(bundles);
    const methodsListFromSaleor = getShippingMethodsWithUUID(
      saleorCheckout?.checkout?.shippingMethods,
      methodsListFromShopService,
      selectedMethods,
    );
    return methodsListFromSaleor;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addCheckoutShippingMethodHandler = async (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
) => {
  try {
    return await graphqlCall(
      CheckoutQueries.addCheckoutShippingMethodsQuery(
        checkoutId,
        shopShippingMethodIds,
      ),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutDeliveryMethodUpdateHandler = async (
  checkoutId: string,
  deliveryMethodId: string,
) => {
  try {
    return await graphqlCall(
      CheckoutQueries.checkoutDeliveryMethodUpdateQuery(
        checkoutId,
        deliveryMethodId,
      ),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createPaymentHandler = async (
  paymentGateways,
  checkoutId: string,
) => {
  try {
    const dummyGatewayId = getDummyGateway(paymentGateways);
    const token = uuidv4();
    return await graphqlCall(
      CheckoutQueries.checkoutPaymentCreateQuery(
        checkoutId,
        dummyGatewayId,
        token,
      ),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getPaymentGatewaysHandler = async (checkoutId: string) => {
  try {
    return await graphqlCall(
      CheckoutQueries.availablePaymentGatewaysQuery(checkoutId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getUserHandler = async (userId: string) => {
  try {
    return await graphqlCall(UserQueries.userQuery(userId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutEmailUpdateHandler = async (
  checkoutId: string,
  email: string,
) => {
  try {
    return await graphqlCall(
      UserQueries.checkoutEmailUpdateQuery(checkoutId, email),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const checkoutCompleteHandler = async (checkoutId: string) => {
  try {
    return await graphqlCall(CheckoutQueries.checkoutCompleteQuery(checkoutId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
