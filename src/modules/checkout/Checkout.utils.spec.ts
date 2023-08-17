import {
  addPreAuthInCheckoutResponse,
  isFreeShippingOrder,
  toCents,
} from './Checkout.utils';

describe('Checkout utility tests', () => {
  it('is get cents utility working properly', () => {
    const response = toCents(900);
    expect(response).toBeDefined();
    expect(response).toStrictEqual(90000);
    expect(response).toBeTruthy();
  });

  it('preauth is correctly getting added in checkout response', () => {
    const checkoutResponse = {} as any;
    addPreAuthInCheckoutResponse(200, checkoutResponse);
    expect(checkoutResponse).toBeDefined();
    expect(checkoutResponse).toStrictEqual({
      preAuth: { gross: { amount: 200 } },
    });
    expect(checkoutResponse).toBeTruthy();
  });

  it('should return true for userOrderCount of 0', () => {
    const result = isFreeShippingOrder(0);
    expect(result).toBe(true);
  });

  it('should return false for non-zero userOrderCount', () => {
    const result = isFreeShippingOrder(3);
    expect(result).toBe(false);
  });
});
