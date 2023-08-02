import { Logger } from '@nestjs/common';
import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { preAuthTransactionMutation } from 'src/graphql/mutations/checkout/payment/authTransaction';
import { storePaymentIntentMutation } from 'src/graphql/mutations/checkout/payment/storePaymentIntent';

export const storePaymentIntentHandler = async (
  checkoutId: string,
  paymentIntentId: string,
  paymentMethodId: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        storePaymentIntentMutation(
          checkoutId,
          paymentIntentId,
          paymentMethodId,
        ),
        token,
      ),
    );
    return response['updateMetadata'];
  } catch (error) {
    Logger.log(error);
  }
};

export const preAuthTransactionHandler = async (
  checkoutId: string,
  paymentIntentId: string,
  amount: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        preAuthTransactionMutation({ checkoutId, paymentIntentId, amount }),
        token,
      ),
    );
    return response['transactionCreate'];
  } catch (err) {
    Logger.error(err);
    return graphqlExceptionHandler(err);
  }
};
