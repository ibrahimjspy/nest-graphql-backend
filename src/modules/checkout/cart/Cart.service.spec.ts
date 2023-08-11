import { Test, TestingModule } from '@nestjs/testing';
import * as SaleorCartHandlers from 'src/graphql/handlers/checkout/cart/cart.saleor';
import * as MarketplaceCartHandlers from 'src/graphql/handlers/checkout/checkout';
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
});
