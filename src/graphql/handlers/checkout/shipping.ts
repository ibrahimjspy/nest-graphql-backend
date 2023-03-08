import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { checkoutPromoCodeAddMutation } from 'src/graphql/mutations/checkout/shipping/addShippingPromo';
import { getCheckoutShippingMethodsQuery } from 'src/graphql/queries/checkout/shipping/getShippingMethods';
import { getShippingVouchersQuery } from 'src/graphql/queries/checkout/shipping/vouchers';

export const getCheckoutShippingMethodsHandler = async (
  checkoutId: string,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      getCheckoutShippingMethodsQuery(checkoutId, isB2c),
      '',
      isB2c,
    ),
  );
  return response['checkout'];
};

export const getShippingVouchersHandler = async (token, isB2c = false) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getShippingVouchersQuery(), token, isB2c),
  );
  return response['vouchers'];
};

export const addCheckoutPromoCodeHandler = async (
  checkoutId: string,
  promoCode: string,
  token,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      checkoutPromoCodeAddMutation(checkoutId, promoCode),
      token,
      isB2c,
    ),
  );
  return response['checkoutAddPromoCode'];
};
