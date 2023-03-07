import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

import {
  CheckoutBundleInputType,
  LineType,
} from 'src/graphql/handlers/checkout.type';
import { GQL_EDGES } from 'src/constants';
import { UpdateBundleStateDto } from 'src/modules/checkout/dto/add-bundle.dto';
import { getPaymentIntentQuery } from '../../queries/checkout/paymentIntent';
import { updateCheckoutBundleStateMutation } from '../../mutations/checkout/updateCheckoutBundleState';
import { createCheckoutMutation } from '../../mutations/checkout/createCheckout';
import { checkoutBillingAddressUpdateMutation } from '../../mutations/checkout/checkoutBillingAddressUpdate';
import { orderCreateFromCheckoutMutation } from '../../mutations/checkout/checkoutComplete';
import { checkoutDeliveryMethodUpdateMutation } from '../../mutations/checkout/checkoutDeliveryMethodUpdate';
import { checkoutShippingAddressUpdateMutation } from '../../mutations/checkout/checkoutShippingAddressUpdate';
import { disableUserCartSessionMutation } from '../../mutations/checkout/disableCheckoutSession';
import { updateCartBundlesCheckoutIdMutation } from '../../mutations/checkout/updateCartBundlesCheckoutId';
import { savePaymentInfoMutation } from '../../mutations/checkout/savePaymentInfo';
import { availablePaymentGatewaysQuery } from '../../queries/checkout/availablePaymentGateways';
import { bundleStatusQuery } from '../../queries/checkout/bundleStatus';
import { cartAmountQuery } from '../../queries/checkout/cartAmount';
import { checkoutWithShippingInfoQuery } from '../../queries/checkout/checkoutWithShippingInfo';
import { checkoutBundlesByIdQuery } from '../../queries/checkout/checkoutBundlesById';
import { getCheckoutBundleQuery } from '../../queries/checkout/getCheckoutBundle';
import { getMarketplaceCheckoutQuery } from '../../queries/checkout/marketplaceCheckout';
import { getMarketplaceCheckoutWithCategoriesQuery } from '../../queries/checkout/marketplaceCheckoutWithCategories';
import { shippingAndBillingAddressQuery } from '../../queries/checkout/shippingAndBillingAddress';
import { shippingZonesQuery } from '../../queries/checkout/shippingZones';
import { updateCheckoutBundleQuery } from '../../queries/checkout/updateCheckoutBundle';
import { addCheckoutBundleQuery } from '../../queries/checkout/addCheckoutBundles';
import { checkoutQuery } from 'src/graphql/queries/checkout/checkout';
import { AddressDto } from 'src/modules/checkout/shipping/dto/shippingAddress';

export const marketplaceCheckoutHandler = async (
  id: string,
  throwException = false,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getMarketplaceCheckoutQuery(id), token),
    throwException,
  );
  return response['marketplaceCheckout'];
};

export const getCheckoutBundlesHandler = async (
  userEmail: string,
  token: string,
  productDetails = true,
  throwException = true,
  isSelected = true,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      getCheckoutBundleQuery(userEmail, isSelected, productDetails),
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
    await graphqlCall(checkoutBundlesByIdQuery(checkoutId, isSelected), token),
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
    await graphqlCall(bundleStatusQuery(userEmail, bundlesIds), token),
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
      updateCheckoutBundleQuery(userEmail, checkoutBundles),
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
    await graphqlCall(addCheckoutBundleQuery(userEmail, bundles), token),
    false,
  );
  return response['addCheckoutBundles'];
};

export const marketplaceWithCategoriesCheckoutHandler = async (
  id: string,
  throwException = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getMarketplaceCheckoutWithCategoriesQuery(id)),
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
    graphqlCall(createCheckoutMutation(email, checkoutLines), token),
  );

  return response['checkoutCreate'];
};

export const checkoutWithShippingInfoHandler = async (
  checkoutId: string,
): Promise<object> => {
  const response = await graphqlCall(checkoutWithShippingInfoQuery(checkoutId));
  return response['checkout'];
};

export const shippingAddressUpdateHandler = async (
  checkoutId: string,
  addressDetails: AddressDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      checkoutShippingAddressUpdateMutation(checkoutId, addressDetails),
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
  addressDetails: AddressDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      checkoutBillingAddressUpdateMutation(checkoutId, addressDetails),
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
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shippingAndBillingAddressQuery(checkoutId)),
  );
  return response['checkout'];
};

export const updateDeliveryMethodHandler = async (
  checkoutId: string,
  selectedMethodId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      checkoutDeliveryMethodUpdateMutation(checkoutId, selectedMethodId),
      token,
    ),
  );
  return response['checkoutDeliveryMethodUpdate'];
};

export const paymentGatewayHandler = async (
  checkoutId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(availablePaymentGatewaysQuery(checkoutId), token),
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
    await graphqlCall(orderCreateFromCheckoutMutation(checkoutId), token),
  );

  return response['orderCreateFromCheckout'];
};

export const disableCheckoutSession = async (
  checkoutId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(disableUserCartSessionMutation(checkoutId), token),
  );

  return response['disableUserCartSession'];
};

export const getShippingZonesHandler = async (token: string) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shippingZonesQuery(), token),
  );
  return response['shippingZones'][GQL_EDGES];
};

export const updateCheckoutBundleState = async (
  action: string,
  updateBundleState: UpdateBundleStateDto,
  token,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      updateCheckoutBundleStateMutation(
        action,
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
      updateCartBundlesCheckoutIdMutation(userEmail, checkoutID),
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
    await graphqlCall(cartAmountQuery(checkoutId), token),
  );

  return response['getUserCartAmount'];
};

export const savePaymentInfoHandler = async ({
  token,
  checkoutId,
  userEmail,
  amount,
  paymentStatus,
  intentId,
}) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      savePaymentInfoMutation({
        checkoutId,
        userEmail,
        amount,
        paymentStatus,
        intentId,
      }),
      token,
    ),
  );

  return response;
};

export const getCheckoutHandler = async (
  checkoutId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlCall(checkoutQuery(checkoutId), token);
  if (!response['checkout']) {
    throw new RecordNotFound('Checkout');
  }
  return response['checkout'];
};
