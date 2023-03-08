import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { preAuthTransactionMutation } from 'src/graphql/mutations/checkout/payment/authTransaction';
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

export const preAuthTransactionHandler = async (
  checkoutId: string,
  paymentIntentId: string,
  amount: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      preAuthTransactionMutation({ checkoutId, paymentIntentId, amount }),
      token,
    ),
  );
  return response['transactionCreate'];
};
