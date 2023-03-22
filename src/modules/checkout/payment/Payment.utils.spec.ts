import {
  getPaymentDataFromMetadata,
  paymentIntentAmountValidate,
} from './Payment.utils';

describe('Payment utilities unit test', () => {
  it('testing whether payment intent id is correctly getting parsed from checkout metadata', async () => {
    const checkoutMetadata = [
      { key: 'paymentMethodId', value: 'testMethodId' },
      { key: 'paymentIntentId', value: 'testIntentId' },
    ];
    const paymentIntentId = getPaymentDataFromMetadata(checkoutMetadata);
    console.log(paymentIntentId);
    expect(paymentIntentId).toBeDefined();
    expect(paymentIntentId).toStrictEqual({
      paymentIntentId: 'testIntentId',
      paymentMethodId: 'testMethodId',
    });
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
