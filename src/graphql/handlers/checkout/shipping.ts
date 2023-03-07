import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { getCheckoutShippingMethodsQuery } from 'src/graphql/queries/checkout/shipping/getShippingMethods';

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
