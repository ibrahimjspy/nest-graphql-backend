import { v4 as uuid4 } from 'uuid';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import * as CheckoutQueries from 'src/graphql/queries/checkout';
import * as CheckoutMutations from 'src/graphql/mutations/checkout';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

import {
  AddressDetailType,
  CheckoutBundleInputType,
  LineType,
} from 'src/graphql/handlers/checkout.type';
import { GQL_EDGES } from 'src/constants';

export const marketplaceCheckoutHandler = async (
  id: string,
  throwException = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.getMarketplaceCheckoutQuery(id)),
    throwException,
  );
  return response['marketplaceCheckout'];
};

export const marketplaceWithCategoriesCheckoutHandler = async (
  id: string,
  throwException = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.getMarketplaceCheckoutWithCategoriesQuery(id),
    ),
    throwException,
  );
  return response['marketplaceCheckout'];
};

export const createCheckoutHandler = async (
  email: string,
  checkoutLines: LineType[],
): Promise<object> => {
  const response = await graphqlCall(
    CheckoutMutations.createCheckoutMutation(email, checkoutLines),
  );
  return response['checkoutCreate'];
};

export const addBundlesHandler = async (
  checkoutId: string,
  userId: string,
  bundles: CheckoutBundleInputType[],
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.addCheckoutBundlesMutation(checkoutId, userId, bundles),
    ),
  );
  return response['addCheckoutBundles'];
};

export const addLinesHandler = async (
  checkoutId: string,
  checkoutLines,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesAddMutation(checkoutId, checkoutLines),
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

export const checkoutWithShippingInfoHandler = async (
  checkoutId: string,
): Promise<object> => {
  const response = await graphqlCall(
    CheckoutQueries.checkoutWithShippingInfoQuery(checkoutId),
  );
  return response['checkout'];
};

export const deleteLinesHandler = async (
  lineIds,
  saleorCheckoutId,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesDeleteMutation(saleorCheckoutId, lineIds),
    ),
  );
  return response['checkoutLinesDelete'];
};

export const deleteBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
  throwException = false,
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

export const updateLinesHandler = async (
  checkoutId: string,
  lines: Array<LineType>,
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
  addressDetails: AddressDetailType,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutShippingAddressUpdateMutation(
        checkoutId,
        addressDetails,
      ),
    ),
  );

  if (!response['checkoutShippingAddressUpdate']) {
    throw new RecordNotFound('Shipping address data');
  }

  return response['checkoutShippingAddressUpdate']['checkout'];
};

export const billingAddressUpdateHandler = async (
  checkoutId: string,
  addressDetails: AddressDetailType,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutBillingAddressUpdateMutation(
        checkoutId,
        addressDetails,
      ),
    ),
  );

  if (!response['checkoutBillingAddressUpdate']) {
    throw new RecordNotFound('Billing address data');
  }

  return response['checkoutBillingAddressUpdate']['checkout'];
};

export const shippingAndBillingAddressHandler = async (
  checkoutId: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.shippingAndBillingAddressQuery(checkoutId),
    ),
  );
  return response['checkout'];
};

export const addShippingMethodHandler = async (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
  throwException = false,
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

export const updateDeliveryMethodHandler = async (
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

export const createPaymentHandler = async (checkoutId: string, gatewayId) => {
  const token = uuid4();
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutPaymentCreateMutation(
        checkoutId,
        gatewayId,
        token,
      ),
    ),
  );
  return response['checkoutPaymentCreate'];
};

export const paymentGatewayHandler = async (checkoutId: string) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.availablePaymentGatewaysQuery(checkoutId),
    ),
  );
  return response['checkout']['availablePaymentGateways'];
};

export const completeCheckoutHandler = async (checkoutId: string) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutMutations.checkoutCompleteMutation(checkoutId)),
  );
  return response['checkoutComplete'];
};

export const getShippingZonesHandler = async () => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.shippingZonesQuery()),
  );
  return response['shippingZones'][GQL_EDGES];
};
