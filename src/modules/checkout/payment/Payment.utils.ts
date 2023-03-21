import { toCents } from '../Checkout.utils';

/**
 * @description returns paymentIntentId and payment method id from checkout metadata
 */
export const getPaymentDataFromMetadata = (checkoutMetadata) => {
  let paymentIntentId: string;
  let paymentMethodId: string;
  (checkoutMetadata || []).map((metadata) => {
    if (metadata.key == 'paymentIntentId') {
      paymentIntentId = metadata.value;
    }
    if (metadata.key == 'paymentMethodId') {
      paymentMethodId = metadata.value;
    }
  });
  return { paymentIntentId, paymentMethodId };
};

/**
 * @description - this validates if payment intent amount is equal to amount in saleor
 */
export const paymentIntentAmountValidate = (
  checkoutAmount,
  paymentIntentAmount,
) => {
  if (toCents(checkoutAmount) == paymentIntentAmount) {
    return true;
  }
  return false;
};
