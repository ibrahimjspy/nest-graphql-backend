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
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.getMarketplaceCheckoutQuery(id), header),
    throwException,
  );
  return response['marketplaceCheckout'];
};

export const createCheckoutHandler = async (
  email: string,
  checkoutLines: LineType[],
  header: string,
): Promise<object> => {
  const response = await graphqlCall(
    CheckoutMutations.createCheckoutMutation(email, checkoutLines),
    header,
  );
  return response['checkoutCreate'];
};

export const addBundlesHandler = async (
  checkoutId: string,
  userId: string,
  bundles: CheckoutBundleInputType[],
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.addCheckoutBundlesMutation(checkoutId, userId, bundles),
      header,
    ),
  );
  return response['addCheckoutBundles'];
};

export const addLinesHandler = async (
  checkoutId: string,
  checkoutLines,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesAddMutation(checkoutId, checkoutLines),
      header,
    ),
  );
  return response['checkoutLinesAdd'];
};

export const checkoutHandler = async (
  checkoutId: string,
  header: string,
): Promise<object> => {
  const response = await graphqlCall(
    CheckoutQueries.checkoutQuery(checkoutId),
    header,
  );
  if (!response['checkout']) {
    throw new RecordNotFound('Checkout');
  }
  return response['checkout'];
};

export const deleteLinesHandler = async (
  lineIds,
  saleorCheckoutId,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesDeleteMutation(saleorCheckoutId, lineIds),
      header,
    ),
  );
  return response['checkoutLinesDelete'];
};

export const deleteBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
  throwException = false,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.deleteCheckoutBundlesMutation(
        checkoutBundleIds,
        checkoutId,
      ),
      header,
    ),
    throwException,
  );
  return response['deleteCheckoutBundles'];
};

export const updateLinesHandler = async (
  checkoutId: string,
  lines: Array<LineType>,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesUpdateMutation(checkoutId, lines),
      header,
    ),
  );
  return response['checkoutLinesUpdate'];
};

export const shippingAddressUpdateHandler = async (
  checkoutId: string,
  addressDetails: AddressDetailType,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutShippingAddressUpdateMutation(
        checkoutId,
        addressDetails,
      ),
      header,
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
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutBillingAddressUpdateMutation(
        checkoutId,
        addressDetails,
      ),
      header,
    ),
  );

  if (!response['checkoutBillingAddressUpdate']) {
    throw new RecordNotFound('Billing address data');
  }

  return response['checkoutBillingAddressUpdate']['checkout'];
};

export const shippingAndBillingAddressHandler = async (
  checkoutId: string,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.shippingAndBillingAddressQuery(checkoutId),
      header,
    ),
  );
  return response['checkout'];
};

export const addShippingMethodHandler = async (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
  throwException = false,
  header: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.addCheckoutShippingMethodsMutation(
        checkoutId,
        shopShippingMethodIds,
      ),
      header,
    ),
    throwException,
  );
  return response['addCheckoutShippingMethods'];
};

export const updateDeliveryMethodHandler = async (
  checkoutId,
  selectedMethods,
  header: string,
) => {
  const deliveryMethodId = selectedMethods[0]['method']['shippingMethodId'];
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutDeliveryMethodUpdateMutation(
        checkoutId,
        deliveryMethodId,
      ),
      header,
    ),
  );
  return response['checkoutDeliveryMethodUpdate'];
};

export const createPaymentHandler = async (
  checkoutId: string,
  gatewayId,
  header: string,
) => {
  const token = uuid4();
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutPaymentCreateMutation(
        checkoutId,
        gatewayId,
        token,
      ),
      header,
    ),
  );
  return response['checkoutPaymentCreate'];
};

export const paymentGatewayHandler = async (
  checkoutId: string,
  header: string,
) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(
      CheckoutQueries.availablePaymentGatewaysQuery(checkoutId),
      header,
    ),
  );
  return response['checkout']['availablePaymentGateways'];
};

export const completeCheckoutHandler = async (
  checkoutId: string,
  header: string,
) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(CheckoutMutations.checkoutCompleteMutation(checkoutId), header),
  );
  return response['checkoutComplete'];
};

export const getShippingZonesHandler = async (header: string) => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(CheckoutQueries.shippingZonesQuery(), header),
  );
  return response['shippingZones'][GQL_EDGES];
};
