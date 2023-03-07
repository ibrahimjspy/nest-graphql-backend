import { getPaymentIntentFromMetadata } from './Payment.utils';

describe('Payment utilities unit test', () => {
  it('testing whether payment intent id is correctly getting parsed from checkout metadata', async () => {
    const checkoutMetadata = [{ paymentIntentId: 'testIntentId' }];
    const paymentIntentId = getPaymentIntentFromMetadata(checkoutMetadata);
    console.log(paymentIntentId);
    expect(paymentIntentId).toBeDefined();
    expect(paymentIntentId).toStrictEqual('testIntentId');
  });
});
