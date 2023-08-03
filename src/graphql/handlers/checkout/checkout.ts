import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

import {
  CheckoutBundleInputType,
  LineType,
} from 'src/graphql/handlers/checkout.type';
import { UpdateBundleStateDto } from 'src/modules/checkout/dto/add-bundle.dto';
import { updateCheckoutBundleStateMutation } from '../../mutations/checkout/updateCheckoutBundleState';
import { createCheckoutMutation } from '../../mutations/checkout/createCheckout';
import { checkoutBillingAddressUpdateMutation } from '../../mutations/checkout/checkoutBillingAddressUpdate';
import { orderCreateFromCheckoutMutation } from '../../mutations/checkout/checkoutComplete';
import { checkoutDeliveryMethodUpdateMutation } from '../../mutations/checkout/checkoutDeliveryMethodUpdate';
import { checkoutShippingAddressUpdateMutation } from '../../mutations/checkout/checkoutShippingAddressUpdate';
import { disableUserCartSessionMutation } from '../../mutations/checkout/disableCheckoutSession';
import { updateCartBundlesCheckoutIdMutation } from '../../mutations/checkout/updateCartBundlesCheckoutId';
import { checkoutBundlesByIdQuery } from '../../queries/checkout/checkoutBundlesById';
import { getCheckoutBundleQuery } from '../../queries/checkout/getCheckoutBundle';
import { updateCheckoutBundleQuery } from '../../queries/checkout/updateCheckoutBundle';
import { addCheckoutBundleQuery } from '../../queries/checkout/addCheckoutBundles';
import { checkoutQuery } from 'src/graphql/queries/checkout/checkout';
import { AddressDto } from 'src/modules/checkout/shipping/dto/shippingAddress';
import { validateCheckoutQuery } from 'src/graphql/queries/checkout/validateCheckout';
import {
  CheckoutBundlesDto,
  FailedOrderInterface,
} from 'src/graphql/types/checkout.type';
import { getCheckoutMetadataQuery } from 'src/graphql/queries/checkout/metadata';
import { marketplaceCheckoutSummaryQuery } from 'src/graphql/queries/checkout/marketplaceCheckoutSummary';
import { saleorCheckoutSummaryQuery } from 'src/graphql/queries/checkout/saleorCheckoutSummary';
import { saveFailedOrderMutation } from 'src/graphql/mutations/checkout/placeOrder/failedOrder';
import {
  CheckoutSummaryInputEnum,
  OrderCreateInterface,
  SaleorCheckoutInterface,
} from 'src/modules/checkout/Checkout.utils.type';
import { UpdateMarketplaceCheckoutIdType } from 'src/modules/checkout/cart/Cart.types';

export const getCheckoutBundlesHandler = async ({
  userEmail,
  token,
  checkoutId,
  productDetails = true,
  throwException = true,
  isSelected = true,
}: CheckoutBundlesDto): Promise<object> => {
  let response = {};
  if (checkoutId) {
    response = await graphqlResultErrorHandler(
      await graphqlCall(
        checkoutBundlesByIdQuery(checkoutId, isSelected),
        token,
      ),
      throwException,
    );
    return response['checkoutBundles'];
  }
  response = await graphqlResultErrorHandler(
    await graphqlCall(
      getCheckoutBundleQuery(userEmail, isSelected, productDetails),
      token,
    ),
    throwException,
  );

  return response['checkoutBundles'];
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

export const orderCreateFromCheckoutHandler = async (
  checkoutId: string,
  token: string,
  disableCheckout = true,
): Promise<OrderCreateInterface> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      orderCreateFromCheckoutMutation(checkoutId, disableCheckout),
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
    await graphqlCall(disableUserCartSessionMutation(checkoutId), token),
  );

  return response['disableUserCartSession'];
};

export const updateCheckoutBundleState = async (
  action: boolean,
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
  updateMarketplaceCheckoutIdInput: UpdateMarketplaceCheckoutIdType[],
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      updateCartBundlesCheckoutIdMutation(
        userEmail,
        updateMarketplaceCheckoutIdInput,
      ),
      token,
    ),
  );

  return response;
};

export const getCheckoutHandler = async (
  checkoutId: string,
  token: string,
): Promise<SaleorCheckoutInterface> => {
  const response = await graphqlCall(checkoutQuery(checkoutId), token);
  if (!response['checkout']) {
    throw new RecordNotFound('Checkout');
  }
  return response['checkout'];
};

export const validateCheckoutHandler = async (
  checkoutId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(validateCheckoutQuery(checkoutId), token),
  );
  return response['validateCartAmounts'];
};

export const getCheckoutMetadataHandler = async (
  checkoutId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getCheckoutMetadataQuery(checkoutId), token),
  );
  return response['checkout'];
};

export const marketplaceCheckoutSummaryHandler = async (
  checkoutId: string,
  token: string,
  type: CheckoutSummaryInputEnum,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(marketplaceCheckoutSummaryQuery(checkoutId, type), token),
  );
  return response['checkoutBundles'];
};

export const saleorCheckoutSummaryHandler = async (
  checkoutId: string,
  token: string,
): Promise<SaleorCheckoutInterface> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(saleorCheckoutSummaryQuery(checkoutId), token),
  );
  return response['checkout'];
};

export const saveFailedOrderHandler = async (
  saveFailedOrderData: FailedOrderInterface,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(saveFailedOrderMutation(saveFailedOrderData), token),
  );
  return response['saveFailedOrder'];
};
