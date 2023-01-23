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

export const getCheckoutbundlesHandler = async (
  userEmail: string,
  throwException = false,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutQueries.getCheckoutBundleQuery(userEmail), token),
    throwException,
  );
  return response['checkoutBundles'];
};

export const validateBundleIsExist = async (
  userEmail: string,
  bundlesIds,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutQueries.validatebundelIsExist(userEmail, bundlesIds),
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
  const response = await graphqlCall(
    CheckoutMutations.createCheckoutMutation(email, checkoutLines),
    token,
  );
  return response['checkoutCreate'];
};

export const addBundlesHandler = async (
  checkoutId: string,
  userId: string,
  bundles: CheckoutBundleInputType[],
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.addCheckoutBundlesMutation(checkoutId, userId, bundles),
      token,
    ),
  );
  return response['addCheckoutBundles'];
};

export const addLinesHandler = async (
  checkoutId: string,
  checkoutLines,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesAddMutation(checkoutId, checkoutLines),
      token,
    ),
  );
  return response['checkoutLinesAdd'];
};

export const checkoutHandler = async (
  checkoutId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlCall(
    CheckoutQueries.checkoutQuery(checkoutId),
    token,
  );
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
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.checkoutLinesDeleteMutation(saleorCheckoutId, lineIds),
      token,
    ),
  );
  return response['checkoutLinesDelete'];
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
  checkoutId,
  selectedMethods,
  token: string,
) => {
  if (selectedMethods && selectedMethods.length) {
    const deliveryMethodId = selectedMethods[0]['method']?.['shippingMethodId'];
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        CheckoutMutations.checkoutDeliveryMethodUpdateMutation(
          checkoutId,
          deliveryMethodId,
        ),
        token,
      ),
    );
    return response['checkoutDeliveryMethodUpdate'];
  }
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

export const completeCheckoutHandler = async (
  checkoutId: string,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(CheckoutMutations.checkoutCompleteMutation(checkoutId)),
  );
  return response['checkoutComplete'];
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
export const createCheckoutHandlerv2 = async (userEmail, token) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      CheckoutMutations.createCheckoutv2Mutation(userEmail),
      token,
    ),
  );

  return response;
};
