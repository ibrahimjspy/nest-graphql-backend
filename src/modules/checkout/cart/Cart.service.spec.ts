import { Test, TestingModule } from '@nestjs/testing';
import * as SaleorCartHandlers from 'src/graphql/handlers/checkout/cart/cart.saleor';
import * as MarketplaceCartHandlers from 'src/graphql/handlers/checkout/checkout';
import * as ProductHandlers from 'src/graphql/handlers/product';
import * as MarketplaceCheckoutHandler from 'src/graphql/handlers/checkout/cart/cart.marketplace';
import { CartService } from './Cart.service';
import { CartResponseService } from './services/Response.service';
import { CartValidationService } from './services/Validation.service';
import { MarketplaceCartService } from './services/marketplace/Cart.marketplace.service';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { CartRollbackService } from './services/Rollback.service';
import { SaleorCheckoutService } from '../services/Checkout.saleor';
import { ProductService } from 'src/modules/product/Product.service';
import SearchService from 'src/external/services/search';
// import { newOpenPackCreateMocks } from '../../../../test/mock/openBundles';

describe('Cart Service', () => {
  let service: CartService;
  let productService: ProductService;
  const mocks = {
    mockProductBundles: {
      data: {
        edges: [
          {
            node: {
              id: '19c88ba8-7429-45f7-87dd-a9999803d955',
              productVariants: [
                {
                  quantity: 2,
                  productVariant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzE1' },
                  attributes: [
                    { name: 'Color', value: 'BLUE' },
                    { name: 'Size', value: 'L' },
                  ],
                },
                {
                  quantity: 2,
                  productVariant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzEz' },
                  attributes: [
                    { name: 'Color', value: 'BLUE' },
                    { name: 'Size', value: 'M' },
                  ],
                },
                {
                  quantity: 2,
                  productVariant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzEx' },
                  attributes: [
                    { name: 'Color', value: 'BLUE' },
                    { name: 'Size', value: 'S' },
                  ],
                },
              ],
            },
          },
        ],
      },
      status: 200,
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        SaleorCartService,
        MarketplaceCartService,
        CartResponseService,
        CartValidationService,
        SaleorCheckoutService,
        CartRollbackService,
        ProductService,
        SearchService,
      ],
    }).compile();
    module.useLogger(false);

    service = module.get<CartService>(CartService);
    productService = module.get<ProductService>(ProductService);
  });

  // it('should add bundles to cart', async () => {
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'createCheckoutHandler')
  //     .mockImplementation(async () => {
  //       return { status: 'done' };
  //     });
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'addCheckoutBundlesHandler')
  //     .mockImplementation(async () => {
  //       return {
  //         checkoutBundles: [],
  //       } as UpdateMarketplaceCheckoutType;
  //     });
  //   jest
  //     .spyOn(productService, 'getProductBundles')
  //     .mockResolvedValue(mocks.mockProductBundles as any);
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'updateCartBundlesCheckoutIdHandler')
  //     .mockImplementation(async () => mocks.mockProductBundles);

  //   const addToCart = await service.addBundlesToCart(
  //     'testMail@gmail.com',
  //     [{ bundleId: '19c88ba8-7429-45f7-87dd-a9999803d955', quantity: 3 }],
  //     'token',
  //   );

  //   expect(addToCart).toEqual({
  //     status: 201,
  //     data: {
  //       saleor: { status: 'done' },
  //       marketplace: { checkoutBundles: [] },
  //     },
  //     message: 'bundles added to cart',
  //   });
  //   expect(addToCart).toBeDefined();
  // });

  // it('should not bundles to cart when bundles list get call failed in saleor', async () => {
  //   jest
  //     .spyOn(SaleorCartHandlers, 'addLinesHandler')
  //     .mockImplementation(async () => {
  //       return { status: 'done' };
  //     });
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'addCheckoutBundlesHandler')
  //     .mockImplementation(async () => {
  //       return { status: 'done' };
  //     });
  //   jest
  //     .spyOn(ProductHandlers, 'getBundlesHandler')
  //     .mockImplementation(async () => {
  //       throw new Error('no bundle exists');
  //     });

  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'updateCartBundlesCheckoutIdHandler')
  //     .mockImplementation(async () => mocks.mockProductBundles);

  //   jest
  //     .spyOn(MarketplaceCheckoutHandler, 'deleteCheckoutBundlesHandler')
  //     .mockImplementation(async () => {
  //       return { done: 'successfully rolled back' };
  //     });

  //   const addToCart = await service.addBundlesToCart(
  //     'testMail@gmail.com',
  //     [{ bundleId: '19c88ba8-7429-45f7-87dd-a9999803d955', quantity: 3 }],
  //     'token',
  //   );
  //   expect(addToCart.status).toBe(400);
  //   expect(addToCart.message).toBe('Adding bundle lines to Saleor failed');

  //   expect(addToCart).toBeDefined();
  // });

  // it('should not break when marketplace call is failed', async () => {
  //   jest
  //     .spyOn(SaleorCartHandlers, 'addLinesHandler')
  //     .mockImplementation(async () => {
  //       return { status: 'done' };
  //     });
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'addCheckoutBundlesHandler')
  //     .mockImplementation(async () => {
  //       throw new Error(' add to marketplace call failed');
  //     });
  //   jest
  //     .spyOn(productService, 'getProductBundles')
  //     .mockResolvedValue(mocks.mockProductBundles as any);

  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'updateCartBundlesCheckoutIdHandler')
  //     .mockImplementation(async () => mocks.mockProductBundles);

  //   jest
  //     .spyOn(SaleorCartHandlers, 'updateLinesHandler')
  //     .mockImplementation(async () => {
  //       return { done: 'successfully rolled back' };
  //     });

  //   const addToCart = await service.addBundlesToCart(
  //     'testMail@gmail.com',
  //     [{ bundleId: '19c88ba8-7429-45f7-87dd-a9999803d955', quantity: 3 }],
  //     'token',
  //   );

  //   expect(addToCart.status).toBe(400);
  //   expect(addToCart.message).toBe('Adding bundle to saleor failed');
  //   expect(addToCart).toBeDefined();
  // });

  it('should get cart without isSelected', async () => {
    jest
      .spyOn(MarketplaceCheckoutHandler, 'getCartV2Handler')
      .mockImplementation(async () => {
        return {
          checkoutId: null,
          validations: null,
          userEmail: null,
          totalPrice: null,
          shops: [],
        };
      });

    const cart = await service.getCartV2('checkoutId', null, 'token');
    expect(cart).toEqual({
      status: 200,
      data: {
        checkoutId: null,
        validations: null,
        userEmail: null,
        totalPrice: null,
        shops: [],
      },
    });
    expect(cart).toBeDefined();
  });

  it('should get cart with isSelected', async () => {
    jest
      .spyOn(MarketplaceCheckoutHandler, 'getCartV2Handler')
      .mockImplementation(async () => {
        return {
          checkoutId: null,
          validations: null,
          userEmail: null,
          totalPrice: null,
          shops: [],
        };
      });

    const cart = await service.getCartV2('checkoutId', true, 'token');
    expect(cart).toEqual({
      status: 200,
      data: {
        checkoutId: null,
        validations: null,
        userEmail: null,
        totalPrice: null,
        shops: [],
      },
    });
    expect(cart).toBeDefined();
  });

  it('should add bundles v2 to cart when there is checkout id', async () => {
    jest
      .spyOn(SaleorCartHandlers, 'addLinesHandler')
      .mockImplementation(async () => {
        return { id: 'checkout', status: 'done' };
      });
    jest
      .spyOn(MarketplaceCheckoutHandler, 'addCheckoutBundlesV2Handler')
      .mockImplementation(async () => {
        return { status: 'done' } as any;
      });
    jest
      .spyOn(productService, 'getProductBundles')
      .mockResolvedValue(mocks.mockProductBundles as any);

    jest
      .spyOn(MarketplaceCartHandlers, 'updateCartBundlesCheckoutIdHandler')
      .mockImplementation(async () => mocks.mockProductBundles);

    const addToCart = await service.addToCartV2(
      {
        userEmail: 'testMail@gmail.com',
        checkoutId: 'checkoutId',
        bundles: [
          { bundleId: '19c88ba8-7429-45f7-87dd-a9999803d955', quantity: 3 },
        ],
      },
      'token',
    );

    expect(addToCart).toEqual({
      status: 201,
      data: {
        saleor: { id: 'checkout', status: 'done' },
        marketplace: { status: 'done' },
      },
      message: 'bundles added to cart',
    });
    expect(addToCart).toBeDefined();
  });

  // it('should add open bundle to cart but create new bundle', async () => {
  //   const createNewOpenPackMocks = newOpenPackCreateMocks;
  //   jest
  //     .spyOn(ProductHandlers, 'createBundleHandler')
  //     .mockImplementation(async () => createNewOpenPackMocks.createBundle);
  //   jest
  //     .spyOn(productService, 'getProductBundles')
  //     .mockResolvedValue(createNewOpenPackMocks.bundles as any);
  //   jest
  //     .spyOn(SaleorCartHandlers, 'addLinesHandler')
  //     .mockImplementation(async () => createNewOpenPackMocks.addLines);
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'addCheckoutBundlesHandler')
  //     .mockImplementation(async () => createNewOpenPackMocks.marketplaceResult);
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'getCheckoutBundlesHandler')
  //     .mockImplementation(
  //       async () => createNewOpenPackMocks.marketplaceCheckout,
  //     );
  //   jest
  //     .spyOn(MarketplaceCartHandlers, 'updateCartBundlesCheckoutIdHandler')
  //     .mockImplementation(async () => mocks.mockProductBundles);

  //   const addToCart = await service.addOpenPackToCart(
  //     createNewOpenPackMocks.input,
  //     '',
  //   );
  //   expect(addToCart).toEqual(createNewOpenPackMocks.expectedResult);
  //   expect(addToCart).toBeDefined();
  // });

  it('should update open pack from cart', async () => {
    jest
      .spyOn(ProductHandlers, 'getBundleHandler')
      .mockImplementation(async () => {
        return {
          id: '62129625-7675-428a-a3ef-db82a7e72262',
          name: 'string',
          description: 'string',
          slug: 'string',
          productVariants: [
            {
              quantity: 5,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
                sku: '001-GRE-O-16796618463',
              },
            },
          ],
        };
      });
    jest
      .spyOn(MarketplaceCartHandlers, 'getCheckoutHandler')
      .mockImplementation(async () => {
        return {
          id: 'Q2hlY2tvdXQ6NjM4NzRkNjEtMTBlZC00N2E2LThlMzItMzlkMjNkOWI0NzJh',
          metadata: [],
          totalPrice: { gross: { amount: 80 } },
          shippingMethods: [],
          deliveryMethod: null,
          lines: [
            {
              id: 'Q2hlY2tvdXRMaW5lOjI5NmU2N2IyLTkxNTItNDY3Yy1hOTUzLTQ4NzY1NjgyODI5MQ==',
              quantity: 15,
              variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI2' },
            },
            {
              id: 'Q2hlY2tvdXRMaW5lOmY4NGU0ZTg5LWVlMWQtNDljYS04NGEyLWQ0YzI3Zjg1ZmJmNA==',
              quantity: 5,
              variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5' },
            },
          ],
        } as any;
      });
    jest
      .spyOn(ProductHandlers, 'updateBundleHandler')
      .mockImplementation(async () => {
        return {
          id: '62129625-7675-428a-a3ef-db82a7e72262',
          name: 'string',
          description: 'string',
          slug: 'string',
          productVariants: [],
        };
      });

    jest
      .spyOn(SaleorCartHandlers, 'updateLinesHandler')
      .mockImplementation(async () => {
        return {
          checkout: {
            id: '62129625-7675-428a-a3ef-db82a7e72262',
            name: 'string',
            description: 'string',
            slug: 'string',
            productVariants: [],
          },
        };
      });

    jest
      .spyOn(MarketplaceCartHandlers, 'getCheckoutBundlesHandler')
      .mockImplementation(async () => {
        return {
          checkout: {
            id: '62129625-7675-428a-a3ef-db82a7e72262',
            name: 'string',
            description: 'string',
            slug: 'string',
            productVariants: [],
          },
        };
      });

    const updateOpenPack = await service.updateOpenPack(
      {
        checkoutId:
          'Q2hlY2tvdXQ6NjM4NzRkNjEtMTBlZC00N2E2LThlMzItMzlkMjNkOWI0NzJh',
        bundleId: '62129625-7675-428a-a3ef-db82a7e72262',
        variants: [
          {
            oldVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTAzMTI5',
            quantity: 5,
          },
        ],
      },
      '',
      false,
    );

    expect(updateOpenPack).toEqual({
      data: {
        saleor: {
          id: '62129625-7675-428a-a3ef-db82a7e72262',
          name: 'string',
          description: 'string',
          slug: 'string',
          productVariants: [],
        },
        updateBundle: {
          id: '62129625-7675-428a-a3ef-db82a7e72262',
          name: 'string',
          description: 'string',
          slug: 'string',
          productVariants: [],
        },
        marketplace: {
          checkout: {
            id: '62129625-7675-428a-a3ef-db82a7e72262',
            name: 'string',
            description: 'string',
            slug: 'string',
            productVariants: [],
          },
        },
      },
      message: 'open pack updated',
      status: 201,
    });
    expect(updateOpenPack).toBeDefined();
  });
});
