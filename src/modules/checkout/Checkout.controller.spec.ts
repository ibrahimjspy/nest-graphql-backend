import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CheckoutController } from './Checkout.controller';
import { CheckoutService } from './Checkout.service';
import { CreateLineItemsForSaleor } from './Checkout.utils';
import { mockCheckoutBundle } from '../../../test/mock/CheckoutBundle';
// Shop unit tests using Jest

describe('Shop controller unit tests', () => {
  // Testing configurations
  let controller: CheckoutController;
  const queryError = { status: 400 };
  const systemError = { status: 500 };
  const federationInternalError = { status: 405 };
  const userId = 'VXNlcjo0';
  const testAddToCartPayload = {
    userId: 'VXNlcjo1',
    bundles: [
      { bundleId: 'ee99fd27-9699-4d28-8367-4aea66848cc8', quantity: 1 },
      { bundleId: '535b7e96-71f6-4ab6-9c72-8ddb2e627bb5', quantity: 1 },
    ],
  };
  const testDeleteFromCartPayload = {
    userId: 'VXNlcjo1',
    checkoutBundleIds: ['8212dcd8-e6a9-4811-b913-5d08a9a6065e'],
  };
  const testUpdateInCartPayload = {
    userId: 'VXNlcjo1',
    bundles: [
      { bundleId: '535b7e96-71f6-4ab6-9c72-8ddb2e627bb5', quantity: 20 },
    ],
  };
  const testSelectShopPayload = {
    userId: 'VXNlcjo1',
    bundleIds: ['535b7e96-71f6-4ab6-9c72-8ddb2e627bb5'],
  };
  const testAddressPayload = {
    checkoutId: 'Q2hlY2tvdXQ6ZDc0ZGM5ZmQtZDY2Mi00NGM4LTk2MmYtMTc3M2E1ZTZlNzkx',
    addressDetails: {
      country: 'US',
      countryArea: 'FL',
      firstName: 'Umair',
      lastName: 'Bashir',
      streetAddress1: 'Model Town B',
      streetAddress2: 'Street 11',
      phone: '',
      companyName: 'Aiworks.ai',
      postalCode: '32118',
      city: 'Bahawalpur',
    },
  };
  const testCheckoutId = {
    params: 'Q2hlY2tvdXQ6ZDc0ZGM5ZmQtZDY2Mi00NGM4LTk2MmYtMTc3M2E1ZTZlNzkx',
  };
  const testSelectShippingMethod = {
    userId: 'VXNlcjo1',
    shippingIds: ['a783191f-6d0e-437c-8435-fa714c341d8f'],
  };
  const CheckoutBundle = mockCheckoutBundle;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [CheckoutController],
      providers: [CheckoutService],
    }).compile();

    controller = app.get<CheckoutController>(CheckoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('root', () => {
    // Basic validation tests
    it('get line items', () => {
      expect(CreateLineItemsForSaleor(CheckoutBundle)).toBeDefined();
    });
  });

  // describe('root', () => {
  // checking whether calls are valid and don't fail on middleware side--->>
  // it('shoppingCart validation test', () => {
  //   expect(
  //     controller.getShoppingCartData({}, { params: userId }),
  //   ).toBeDefined();
  // });
  // it('shoppingCart async test', async () => {
  //   const data = await controller.getShoppingCartData(
  //     {},
  //     { params: userId },
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('add to cart validation test', () => {
  //   expect(
  //     controller.addBundlesToCart({}, testAddToCartPayload),
  //   ).toBeDefined();
  // });
  // it('add to cart async test', async () => {
  //   const data = await controller.addBundlesToCart(
  //     {},
  //     testAddToCartPayload,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('delete from cart validation test', () => {
  //   expect(
  //     controller.deleteBundleFromCart({}, testDeleteFromCartPayload),
  //   ).toBeDefined();
  // });
  // it('delete from cart async test', async () => {
  //   const data = await controller.deleteBundleFromCart(
  //     {},
  //     testDeleteFromCartPayload,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('update in cart validation test', () => {
  //   expect(
  //     controller.updateCartBundle({}, testUpdateInCartPayload),
  //   ).toBeDefined();
  // });
  // it('update in cart async test', async () => {
  //   const data = await controller.updateCartBundle(
  //     {},
  //     testUpdateInCartPayload,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('select shop from cart validation test', () => {
  //   expect(
  //     controller.selectThisShop({}, testSelectShopPayload),
  //   ).toBeDefined();
  // });
  // it('select shop from cart async test', async () => {
  //   const data = await controller.selectThisShop(
  //     {},
  //     testSelectShopPayload,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('unselect shop from cart validation test', () => {
  //   expect(
  //     controller.unSelectThisShop({}, testSelectShopPayload),
  //   ).toBeDefined();
  // });
  // it('unselect shop from cart async test', async () => {
  //   const data = await controller.unSelectThisShop(
  //     {},
  //     testSelectShopPayload,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('add shiping address validation test', () => {
  //   expect(
  //     controller.addShippingAddress({}, testAddressPayload),
  //   ).toBeDefined();
  // });
  // it('add shiping address async test', async () => {
  //   const data = await controller.addShippingAddress(
  //     {},
  //     testAddressPayload,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('add billing address validation test', () => {
  //   expect(
  //     controller.addBillingAddress({}, testAddressPayload),
  //   ).toBeDefined();
  // });
  // it('add billing address async test', async () => {
  //   const data = await controller.addBillingAddress(
  //     {},
  //     testAddressPayload,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('get shipping & billing address validation test', () => {
  //   expect(
  //     controller.getShippingBillingAddress({}, testCheckoutId),
  //   ).toBeDefined();
  // });
  // it('get shipping & billing address async test', async () => {
  //   const data = await controller.getShippingBillingAddress(
  //     {},
  //     testCheckoutId,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('get shipping method validation test', () => {
  //   expect(
  //     controller.getShippingMethods({}, { params: userId }),
  //   ).toBeDefined();
  // });
  // it('get shipping method async test', async () => {
  //   const data = await controller.getShippingMethods(
  //     {},
  //     { params: userId },
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('select shipping method validation test', () => {
  //   expect(
  //     controller.selectShippingMethods({}, { params: userId }),
  //   ).toBeDefined();
  // });
  // it('select shipping method async test', async () => {
  //   const data = await controller.selectShippingMethods(
  //     {},
  //     testSelectShippingMethod,
  //   );
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('create payment validation test', () => {
  //   expect(controller.createPayment({}, { userId })).toBeDefined();
  // });
  // it('create payment async test', async () => {
  //   const data = await controller.createPayment({}, userId);
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // it('checkout complete validation test', () => {
  //   expect(controller.checkoutComplete({}, userId)).toBeDefined();
  // });
  // it('checkout complete async test', async () => {
  //   const data = await controller.checkoutComplete({}, userId);
  //   expect(data).toEqual(objectContainingCheck(queryError));
  //   expect(data).toEqual(objectContainingCheck(systemError));
  //   expect(data).toEqual(objectContainingCheck(federationInternalError));
  //   expect(data).not.toHaveProperty('graphql_error');
  // });
  // });
});

export const objectContainingCheck = (errorCode: object) => {
  return expect.not.objectContaining(errorCode);
};
