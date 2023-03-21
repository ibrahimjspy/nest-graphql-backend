import { promotionResponseType } from './Shipping.promotion.types';
import { preparePromotionResponse } from './Shipping.response';

describe('Shipping promotion response builder unit tests', () => {
  const checkoutData: promotionResponseType = {
    errors: [],
    checkout: {
      id: 'Q2hlY2tvdXQ6ZDc1ZWZlYjUtMzUyNi00NWE1LThiYzItYzUyYTM0NzY1NDc0',
      discount: {
        amount: 12,
      },
      shippingPrice: {
        gross: {
          amount: 20,
        },
      },
      subtotalPrice: {
        gross: {
          amount: 380,
        },
      },
      totalPrice: {
        gross: {
          amount: 400,
        },
      },
    },
  };
  it('testing whether checkout shipping promotion response is correctly getting parsed and transformed', async () => {
    const checkoutTransformedData = preparePromotionResponse(checkoutData);
    console.dir(checkoutTransformedData, { depth: null });
    expect(checkoutTransformedData).toBeDefined();
    expect(checkoutTransformedData).toStrictEqual({
      errors: [],
      checkout: {
        id: 'Q2hlY2tvdXQ6ZDc1ZWZlYjUtMzUyNi00NWE1LThiYzItYzUyYTM0NzY1NDc0',
        discount: { amount: 12 },
        shippingPrice: { gross: { amount: 20 } },
        subtotalPrice: { gross: { amount: 392 } },
        totalPrice: { gross: { amount: 400 } },
      },
    });
  });
});
