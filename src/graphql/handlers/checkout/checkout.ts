import { v4 as uuid4 } from 'uuid';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/public/graphqlHandler';
import * as CheckoutQueries from 'src/graphql/queries/checkout';
import * as CheckoutMutations from 'src/graphql/mutations/checkout';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

import {
  getLineItems,
  getDummyGateway,
  getTargetLineItems,
} from 'src/public/checkoutHelperFunctions';
import {
  AddressDetailTypes,
  BundleTypes,
  LineTypes,
} from 'src/graphql/handlers/checkout/Checkout.types';

export const marketplaceCheckoutHandler = async (
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
  bundlesForCart: Array<BundleTypes>,
): Promise<object> => {
  const lines = getLineItems(bundlesList, bundlesForCart);
  const response = await graphqlCall(
    CheckoutMutations.createCheckoutMutation(email, lines),
  );
  return response['checkoutCreate'];
};

export const addBundlesHandler = async (
  checkoutId: string,
  userId: string,
  bundles: Array<BundleTypes>,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.addCheckoutBundlesMutation(checkoutId, userId, bundles),
    ),
  );
  return response['addCheckoutBundles'];
};

export const addToCartHandler = async (
  checkoutId,
  bundlesList,
  bundlesForCart: Array<BundleTypes>,
): Promise<object> => {
  const lines = getLineItems(bundlesList, bundlesForCart);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesAddMutation(checkoutId, lines),
    ),
  );
  return response['checkoutLinesAdd'];
};

export const linesAddHandler = async (
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

export const linesDeleteHandler = async (
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

export const deleteBundleHandler = async (
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

export const linesUpdateHandler = async (
  checkoutId: string,
  lines: Array<LineTypes>,
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

export const addShippingMethodHandler = async (
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

export const deliveryMethodUpdateHandler = async (
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
  paymentGateways,
) => {
  const dummyGatewayId = getDummyGateway(paymentGateways);
  const token = uuid4();
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

export const paymentGatewayHandler = async (checkoutId: string) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(CheckoutQueries.availablePaymentGatewaysQuery(checkoutId)),
  );
  return response['checkout'];
};

export const completeCheckoutHandler = async (checkoutId: string) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(CheckoutMutations.checkoutCompleteMutation(checkoutId)),
  );
  return response['checkoutComplete'];
};
