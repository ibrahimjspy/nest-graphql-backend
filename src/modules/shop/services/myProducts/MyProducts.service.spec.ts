import { Test, TestingModule } from '@nestjs/testing';
import * as ShopHandlers from 'src/graphql/handlers/shop';
import * as ProductHandlers from 'src/graphql/handlers/product';
import { shopIntegrationMocks } from '../../../../../test/mock/shop.js';
import { MyProductsService } from './MyProducts.service';

describe('My Products Service Integration test', () => {
  let service: MyProductsService;
  const mocks = shopIntegrationMocks;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyProductsService],
    }).compile();
    module.useLogger(false);

    service = module.get<MyProductsService>(MyProductsService);
  });

  it('get my products api', async () => {
    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => mocks.mockShop);
    jest
      .spyOn(ProductHandlers, 'getShopProductsHandler')
      .mockImplementation(async () => mocks.mockShopProducts);
    jest
      .spyOn(ProductHandlers, 'getMyProductsHandler')
      .mockImplementation(async () => mocks.mockMyProducts);

    const getMyProducts = await service.getMyProducts('123', { first: 12 });
    expect(getMyProducts).toEqual(mocks.expectedMyProductsResponse);
    expect(getMyProducts).toBeDefined();
  });

  it('should update my products', async () => {
    jest
      .spyOn(ProductHandlers, 'updateMyProductHandler')
      .mockImplementation(async () => {
        return { id: '2' };
      });
    jest
      .spyOn(ProductHandlers, 'deleteBulkMediaHandler')
      .mockImplementation(async () => {
        return { id: '3' };
      });

    const updateMyProduct = await service.updateMyProduct(
      {
        productId: '2',
        removeMediaIds: [],
        input: {
          name: 'test',
          description: '',
          category: '',
        },
      },
      '',
    );
    expect(updateMyProduct).toEqual({
      status: 200,
      data: { response: { id: '2' }, mediaUpdate: { id: '3' } },
    });
    expect(updateMyProduct).toBeDefined();
  });
});
