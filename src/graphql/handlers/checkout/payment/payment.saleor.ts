import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { storePaymentIntentMutation } from 'src/graphql/mutations/checkout/payment/storePaymentIntent';

export const storePaymentIntentHandler = async (
  checkoutId: string,
  paymentIntentId: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      storePaymentIntentMutation(checkoutId, paymentIntentId),
      token,
    ),
  );
  return response['updateMetadata'];
};
