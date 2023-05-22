import { Test, TestingModule } from '@nestjs/testing';
import * as ProductsHandlers from 'src/graphql/handlers/product';
import * as Mapping from 'src/external/endpoints/b2cMapping';

import { ProductService } from './Product.service';
import { productIntegrationMocks } from '../../../test/mock/product';

describe('Product Service', () => {
  let service: ProductService;
  const mocks = productIntegrationMocks;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();
    module.useLogger(false);

    service = module.get<ProductService>(ProductService);
  });

  it('should get all products', async () => {
    jest
      .spyOn(ProductsHandlers, 'productsHandler')
      .mockImplementation(async () => mocks.productsGet);

    const getProducts = await service.getProducts({ first: 10 });
    expect(getProducts).toEqual(mocks.expectedProducts);
    expect(getProducts).toBeDefined();
  });

  it('should get all products by shop', async () => {
    jest
      .spyOn(ProductsHandlers, 'productsHandler')
      .mockImplementation(async () => mocks.productsGet);

    jest
      .spyOn(ProductsHandlers, 'getShopProductsHandler')
      .mockImplementation(async () => mocks.shopProducts);

    const getProducts = await service.getShopProducts({
      first: 10,
      storeId: '12',
    });
    expect(getProducts).toEqual(mocks.shopProductsExpectedResponse);
    expect(getProducts).toBeDefined();
  });

  it('should catch error by shop if error by marketplace service', async () => {
    jest
      .spyOn(ProductsHandlers, 'productsHandler')
      .mockImplementation(async () => mocks.productsGet);

    jest
      .spyOn(ProductsHandlers, 'getShopProductsHandler')
      .mockImplementation(async () => {
        throw new Error('shop failed');
      });

    const getProducts = await service.getShopProducts({
      first: 10,
      storeId: '12',
    });
    expect(getProducts).toEqual({
      status: 400,
      message: 'Something went wrong.',
    });
    expect(getProducts).toBeDefined();
  });

  it('get products with retailer id mapping, checking whether the product is pushed to store or not', async () => {
    jest
      .spyOn(ProductsHandlers, 'productsHandler')
      .mockImplementation(async () => mocks.productsGet);

    jest
      .spyOn(Mapping, 'getB2cProductMapping')
      .mockImplementation(async () => mocks.mockElasticSearchMappingData);

    const getProducts = await service.getProducts({
      first: 10,
      retailerId: '12',
    });
    expect(getProducts).toEqual(mocks.productsWithMappings);
    expect(getProducts).toBeDefined();
  });

  it('product details call is working end to end', async () => {
    jest
      .spyOn(ProductsHandlers, 'getProductDetailsHandler')
      .mockImplementation(async () => {
        return { details: 'test' };
      });

    const productDetails = await service.getProductDetails({
      productId: 'test',
    });
    expect(productDetails).toEqual({ status: 200, data: { details: 'test' } });
    expect(productDetails).toBeDefined();
  });

  it('product bundles call is working end to end', async () => {
    jest
      .spyOn(ProductsHandlers, 'getBundlesHandler')
      .mockImplementation(async () => {
        return { details: 'test bundle' } as any;
      });

    const productDetails = await service.getProductBundles({
      productId: 'test',
    });
    expect(productDetails).toEqual({
      status: 200,
      data: { details: 'test bundle' },
    });
    expect(productDetails).toBeDefined();
  });
});
