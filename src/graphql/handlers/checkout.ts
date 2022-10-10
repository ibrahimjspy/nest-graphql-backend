import { v4 as uuidv4 } from 'uuid';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/public/graphqlHandler';
import * as CheckoutQueries from 'src/graphql/queries/checkout';
import * as CheckoutMutations from 'src/graphql/mutations/checkout';
import * as UserQueries from 'src/graphql/queries/user';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

import {
  getLineItems,
  getBundleIds,
  getDummyGateway,
  getTargetLineItems,
} from 'src/public/checkoutHelperFunctions';
import { AddressDetailTypes } from 'src/core/types/Checkout.types';

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
    CheckoutMutations.createCheckoutMutation(email, lines),
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
      CheckoutMutations.addCheckoutBundlesMutation(checkoutId, userId, bundles),
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
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesAddMutation(checkoutId, lines),
    ),
  );
  return response['checkoutLinesAdd'];
};

export const checkoutLinesAddHandler = async (
  checkoutId: string,
  checkoutLines,
  bundles,
  bundleIds: Array<string>,
): Promise<object> => {
  const targetLineItems = getTargetLineItems(checkoutLines, bundles, bundleIds);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesAddMutation(checkoutId, targetLineItems),
    ),
  );
  return response['checkoutLinesAdd'];
};

export const checkoutHandler = async (checkoutId: string): Promise<object> => {
  const response = await graphqlCall(CheckoutQueries.checkoutQuery(checkoutId));

  if (!response['checkout']) {
    throw new RecordNotFound('Checkout');
  }

  return response['checkout'];
};

export const checkoutLinesDeleteHandler = async (
  checkoutLines,
  bundles,
  saleorCheckoutId,
  bundleIds,
): Promise<object> => {
  const lines = getTargetLineItems(checkoutLines, bundles, bundleIds);
  const lineIds = (lines || []).map((l: any) => l?.id || l?.variantId);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesDeleteMutation(saleorCheckoutId, lineIds),
    ),
  );
  return response['checkoutLinesDelete'];
};

export const deleteCheckoutBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
  throwException: boolean = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.deleteCheckoutBundlesMutation(
        checkoutBundleIds,
        checkoutId,
      ),
    ),
    throwException,
  );
  return response['deleteCheckoutBundles'];
};

export const checkoutLinesUpdateHandler = async (
  checkoutId: string,
  lines: Array<{ variantId: string; quantity: number }>,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesUpdateMutation(checkoutId, lines),
    ),
  );
  return response['checkoutLinesUpdate'];
};

export const shippingAddressUpdateHandler = async (
  checkoutId: string,
  addressDetails: AddressDetailTypes,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.shippingAddressMutation(checkoutId, addressDetails),
    ),
  );
  return response['checkoutShippingAddressUpdate']['checkout'];
};

export const billingAddressUpdateHandler = async (
  checkoutId: string,
  addressDetails: AddressDetailTypes,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.billingAddressMutation(checkoutId, addressDetails),
    ),
  );
  return response['checkoutBillingAddressUpdate']['checkout'];
};

export const shippingBillingAddress = async (
  checkoutId: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.shippingBillingAddressQuery(checkoutId)),
  );
  return response['checkout'];
};

export const addCheckoutShippingMethodHandler = async (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
  throwException: boolean = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.addCheckoutShippingMethodsMutation(
        checkoutId,
        shopShippingMethodIds,
      ),
    ),
    throwException,
  );
  return response['addCheckoutShippingMethods'];
};

export const checkoutDeliveryMethodUpdateHandler = async (
  checkoutId,
  selectedMethods,
) => {
  const deliveryMethodId = selectedMethods[0]['method']['shippingMethodId'];
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutDeliveryMethodUpdateMutation(
        checkoutId,
        deliveryMethodId,
      ),
    ),
  );
  return response['checkoutDeliveryMethodUpdate'];
};

export const createPaymentHandler = async (
  checkoutId: string,
  availablePaymentGateways,
) => {
  const dummyGatewayId = getDummyGateway(availablePaymentGateways);
  const token = uuidv4();
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutPaymentCreateMutation(
        checkoutId,
        dummyGatewayId,
        token,
      ),
    ),
  );
  return response['checkoutPaymentCreate'];
};

export const getPaymentGatewaysHandler = async (checkoutId: string) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(CheckoutQueries.availablePaymentGatewaysQuery(checkoutId)),
  );
  return response['checkout'];
};

export const getUserHandler = async (userId: string) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(UserQueries.userQuery(userId)),
  );
  return response['user'];
};

export const checkoutCompleteHandler = async (checkoutId: string) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(CheckoutMutations.checkoutCompleteMutation(checkoutId)),
  );
  return response['checkoutComplete'];
};
