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

  it('should return combined data for bundle and product', async () => {
    jest
      .spyOn(ProductsHandlers, 'getProductDetailsHandler')
      .mockResolvedValue(mocks.singleProduct as any);
    jest
      .spyOn(ProductsHandlers, 'getBundlesHandler')
      .mockResolvedValue(mocks.bundles as any);

    // Call the method being tested
    const result = await service.getProductBundles({
      productId: '123',
    });

    // Assert the result
    expect(result).toBeDefined();
    expect(result.data.edges.length).toBe(1);

    // Assert the combined data for the first edge
    const firstEdge = result.data.edges[0];
    expect(firstEdge.node.id).toBe('bundle-1');
    expect(firstEdge.node.name).toBe('Bundle 1');
    expect(firstEdge.node.isOpenBundle).toBe(true);
    expect(firstEdge.node.description).toBe('Bundle Description');
    expect(firstEdge.node.slug).toBe('bundle-slug');

    // Assert the product variants within the bundle
    const productVariants = firstEdge.node.productVariants;
    expect(productVariants.length).toBe(1);
    const firstProductVariant = productVariants[0];
    expect(firstProductVariant.quantity).toBe(3);
    expect(firstProductVariant.productVariant.id).toBe('variant-1');
    expect(firstProductVariant.productVariant.sku).toBe('variant-1-sku');
  });
});
