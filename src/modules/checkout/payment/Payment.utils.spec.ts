import {
  getPaymentIntentFromMetadata,
  paymentIntentAmountValidate,
} from './Payment.utils';

describe('Payment utilities unit test', () => {
  it('testing whether payment intent id is correctly getting parsed from checkout metadata', async () => {
    const checkoutMetadata = [{ paymentIntentId: 'testIntentId' }];
    const paymentIntentId = getPaymentIntentFromMetadata(checkoutMetadata);
    console.log(paymentIntentId);
    expect(paymentIntentId).toBeDefined();
    expect(paymentIntentId).toStrictEqual('testIntentId');
  });

  it('testing whether payment intent amount is correctly getting compared with checkout amount', async () => {
    const checkoutAmount = 2013;
    const paymentIntentAmount = 2002;
    const isAmountNew = paymentIntentAmountValidate(
      checkoutAmount,
      paymentIntentAmount,
    );
    console.log(isAmountNew);
    expect(isAmountNew).toBeDefined();
    expect(isAmountNew).toStrictEqual(false);
  });
});
