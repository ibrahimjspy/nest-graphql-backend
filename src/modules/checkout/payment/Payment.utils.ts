import { toCents } from '../Checkout.utils';

/**
 * @description returns paymentIntentId from checkout metadata
 */
export const getPaymentIntentFromMetadata = (checkoutMetadata) => {
  let paymentIntentId: string;
  (checkoutMetadata || []).map((metadata) => {
    if (metadata.key == 'paymentIntentId') {
      paymentIntentId = metadata.value;
    }
  });
  return paymentIntentId;
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
