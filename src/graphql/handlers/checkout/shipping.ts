import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { checkoutPromoCodeAddMutation } from 'src/graphql/mutations/checkout/shipping/addShippingPromo';
import { checkoutPromoCodeRemoveMutation } from 'src/graphql/mutations/checkout/shipping/removeShippingPromo';
import { getCheckoutShippingMethodsQuery } from 'src/graphql/queries/checkout/shipping/getShippingMethods';
import { getShippingVouchersQuery } from 'src/graphql/queries/checkout/shipping/vouchers';

export const getCheckoutShippingMethodsHandler = async (
  checkoutId: string,
  token: string,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      getCheckoutShippingMethodsQuery(checkoutId, isB2c),
      token,
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

export const removeCheckoutPromoCodeHandler = async (
  checkoutId: string,
  promoCode: string,
  token,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      checkoutPromoCodeRemoveMutation(checkoutId, promoCode),
      token,
      isB2c,
    ),
  );
  return response['checkoutRemovePromoCode'];
};
