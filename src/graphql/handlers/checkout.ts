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
import { UpdateBundleStateDto } from 'src/modules/checkout/dto/add-bundle.dto';
import { getPaymentIntentQuery } from '../queries/checkout/paymentIntent';

export const marketplaceCheckoutHandler = async (
  id: string,
  throwException = false,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.getMarketplaceCheckoutQuery(id), token),
    throwException,
  );
  return response['marketplaceCheckout'];
};

export const getCheckoutBundlesHandler = async (
  userEmail: string,
  token: string,
  throwException = true,
  isSelected = true,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.getCheckoutBundleQuery(userEmail, isSelected),
      token,
    ),
    throwException,
  );

  return response['checkoutBundles'];
};

export const getCheckoutBundlesByCheckoutIdHandler = async (
  checkoutId: string,
  token: string,
  isSelected,
  throwException = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.checkoutBundlesByIdQuery(checkoutId, isSelected),
      token,
    ),
    throwException,
  );

  return response['checkoutBundles'];
};

export const bundleStatusHandler = async (
  userEmail: string,
  bundlesIds,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.bundleStatusQuery(userEmail, bundlesIds),
      token,
    ),
    false,
  );

  return response['bundleStatus'];
};

export const updateCheckoutBundlesHandler = async (
  userEmail: string,
  checkoutBundles: any[],
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.updateCheckoutBundleQuery(userEmail, checkoutBundles),
      token,
    ),
    false,
  );

  return response['updateCheckoutBundles'];
};

export const addCheckoutBundlesHandler = async (
  userEmail: string,
  bundles: CheckoutBundleInputType[],
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.addCheckoutBundleQuery(userEmail, bundles),
      token,
    ),
    false,
  );
  return response['addCheckoutBundles'];
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
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    graphqlCall(
      CheckoutMutations.createCheckoutMutation(email, checkoutLines),
      token,
    ),
  );

  return response['checkoutCreate'];
};

export const checkoutWithShippingInfoHandler = async (
  checkoutId: string,
): Promise<object> => {
  const response = await graphqlCall(
    CheckoutQueries.checkoutWithShippingInfoQuery(checkoutId),
  );
  return response['checkout'];
};

export const deleteBundlesHandler = async (
  checkoutBundleIds: Array<string>,
  userEmail: string,
  throwException = false,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.deleteCheckoutBundlesMutation(
        checkoutBundleIds,
        userEmail,
      ),
      token,
    ),
    throwException,
  );
  return response['deleteCheckoutBundles'];
};

export const updateLinesHandler = async (
  checkoutId: string,
  lines: Array<LineType>,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesUpdateMutation(checkoutId, lines),
      token,
    ),
  );
  return response['checkoutLinesUpdate'];
};

export const shippingAddressUpdateHandler = async (
  checkoutId: string,
  addressDetails: AddressDetailType,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutShippingAddressUpdateMutation(
        checkoutId,
        addressDetails,
      ),
      token,
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
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutBillingAddressUpdateMutation(
        checkoutId,
        addressDetails,
      ),
      token,
    ),
  );

  if (!response['checkoutBillingAddressUpdate']) {
    throw new RecordNotFound('Billing address data');
  }

  return response['checkoutBillingAddressUpdate']['checkout'];
};

export const shippingAndBillingAddressHandler = async (
  checkoutId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.shippingAndBillingAddressQuery(checkoutId),
      token,
    ),
  );
  return response['checkout'];
};

export const addShippingMethodHandler = async (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
  throwException = false,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.addCheckoutShippingMethodsMutation(
        checkoutId,
        shopShippingMethodIds,
      ),
      token,
    ),
    throwException,
  );
  return response['addCheckoutShippingMethods'];
};

export const updateDeliveryMethodHandler = async (
  checkoutId: string,
  selectedMethodId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutDeliveryMethodUpdateMutation(
        checkoutId,
        selectedMethodId,
      ),
      token,
    ),
  );
  return response['checkoutDeliveryMethodUpdate'];
};

export const createPaymentHandler = async (
  checkoutId: string,
  gatewayId,
  token: string,
) => {
  const tokenUUID = uuid4();
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutPaymentCreateMutation(
        checkoutId,
        gatewayId,
        tokenUUID,
      ),
      token,
    ),
  );
  return response['checkoutPaymentCreate'];
};

export const paymentGatewayHandler = async (
  checkoutId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.availablePaymentGatewaysQuery(checkoutId),
      token,
    ),
  );
  return response['checkout']['availablePaymentGateways'];
};

export const getPaymentIntentHandler = async (
  checkoutId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getPaymentIntentQuery(checkoutId), token),
  );
  return response['getPaymentIntentAgainstUserCheckout'];
};

export const orderCreateFromCheckoutHandler = async (
  checkoutId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.orderCreateFromCheckoutMutation(checkoutId),
      token,
    ),
  );

  return response['orderCreateFromCheckout'];
};

export const disableCheckoutSession = async (
  checkoutId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.disableUserCartSessionMutation(checkoutId),
      token,
    ),
  );

  return response['disableUserCartSession'];
};

export const getShippingZonesHandler = async (token: string) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.shippingZonesQuery(), token),
  );
  return response['shippingZones'][GQL_EDGES];
};

export const updateCheckoutBundleState = async (
  updateBundleState: UpdateBundleStateDto,
  token,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.updateCheckoutBundleState(
        updateBundleState.action,
        updateBundleState.userEmail,
        updateBundleState.checkoutBundleIds,
      ),
      token,
    ),
  );
  return response;
};
export const updateCartBundlesCheckoutIdHandler = async (
  userEmail: string,
  token: string,
  checkoutID: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.updateCartBundlesCheckoutIdMutation(
        userEmail,
        checkoutID,
      ),
      token,
    ),
  );

  return response;
};

export const getTotalAmountByCheckoutIdHandler = async (
  token: string,
  checkoutId: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.cartAmountQuery(checkoutId), token),
  );

  return response['getUserCartAmount'];
};

export const savePaymentInfoHandler = async (
  token: string,
  checkoutId: string,
  userEmail: string,
  amount: number,
  paymentStatus: number,
  intentId: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.savePaymnetInfoMutation(
        checkoutId,
        userEmail,
        amount,
        paymentStatus,
        intentId,
      ),
      token,
    ),
  );

  return response;
};
