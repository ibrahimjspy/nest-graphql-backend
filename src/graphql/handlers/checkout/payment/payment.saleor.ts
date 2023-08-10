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
  paymentMethodId: string,
  token: string,
  paymentIntentId?: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        storePaymentIntentMutation(
          checkoutId,
          paymentMethodId,
          paymentIntentId,
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
