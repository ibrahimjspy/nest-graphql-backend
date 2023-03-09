import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { checkoutLinesAddMutation } from 'src/graphql/mutations/checkout/cart/saleor/checkoutLinesAdd';
import { checkoutLinesUpdateMutation } from 'src/graphql/mutations/checkout/cart/saleor/checkoutLinesUpdate';
import { CheckoutLinesInterface } from 'src/modules/checkout/cart/services/saleor/Cart.saleor.types';
import { checkoutLinesDeleteMutation } from 'src/graphql/mutations/checkout/cart/saleor/checkoutLinesDelete';

export const addLinesHandler = async (
  checkoutId: string,
  lines: CheckoutLinesInterface,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(checkoutLinesAddMutation(checkoutId, lines), token),
  );
  return response['checkoutLinesAdd']['checkout'];
};

export const updateLinesHandler = async (
  checkoutId: string,
  lines: CheckoutLinesInterface,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(checkoutLinesUpdateMutation(checkoutId, lines), token),
  );
  return response['checkoutLinesUpdate'];
};

export const deleteLinesHandler = async (
  checkoutId,
  lineIds: string[],
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(checkoutLinesDeleteMutation(checkoutId, lineIds), token),
  );
  return response['checkoutLinesDelete'];
};
