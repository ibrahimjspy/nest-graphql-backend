import { Test, TestingModule } from '@nestjs/testing';
import * as ShopHandlers from 'src/graphql/handlers/shop';
import * as ProductHandlers from 'src/graphql/handlers/product';

import * as Github from 'src/external/endpoints/provisionStorefront';

import { ShopService } from './Shop.service';
import { ShopType } from 'src/graphql/types/shop.type';
import { shopIntegrationMocks } from '../../../test/mock/shop';

describe('Shop Service Integration test', () => {
  let service: ShopService;
  const mocks = shopIntegrationMocks;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopService],
    }).compile();
    module.useLogger(false);

    service = module.get<ShopService>(ShopService);
  });

  it('should get shops data', async () => {
    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => {
        return { shop: 'test' };
      });

    const getShop = await service.getShopDetailsV2({ id: '123' });
    expect(getShop).toEqual({ status: 200, data: { shop: 'test' } });
    expect(getShop).toBeDefined();
  });

  it('provision storefront', async () => {
    jest
      .spyOn(ShopHandlers, 'createStoreHandler')
      .mockImplementation(async () => {
        return {
          id: 'test',
          name: 'leoMessi',
          email: 'leo@gmail.com',
          url: 'leomessi.sharove.co',
        } as ShopType;
      });

    jest
      .spyOn(ShopHandlers, 'addStoreToShopHandler')
      .mockImplementation(async () => {
        return {
          id: 'testb2b',
          name: 'leoMessi',
          email: 'leo@gmail.com',
        } as ShopType;
      });

    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => {
        return {
          id: 'testb2b',
          name: 'leoMessi',
          email: 'leo@gmail.com',
          url: 'leomessi.sharove.co',
        } as ShopType;
      });

    jest.spyOn(Github, 'provisionStoreFront').mockImplementation(async () => {
      return {
        status: 200,
      } as any;
    });

    const createStore = await service.createStore(
      '1000',
      {
        name: 'leoMessi',
        email: 'leo@gmail.com',
      },
      '',
    );
    expect(createStore).toEqual({
      status: 201,
      data: {
        id: 'test',
        name: 'leoMessi',
        email: 'leo@gmail.com',
        url: 'leomessi.sharove.co',
      },
      message: 'new storefront provisioned',
    });
    expect(createStore).toBeDefined();
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

  it('should update shops', async () => {
    jest
      .spyOn(ShopHandlers, 'updateStoreInfoHandler')
      .mockImplementation(async () => {
        return { shop: 'test', url: '123.com' };
      });

    const getShop = await service.updateStoreInfo('97', { url: '123.com' }, '');
    expect(getShop).toEqual({
      status: 200,
      data: { shop: 'test', url: '123.com' },
    });
    expect(getShop).toBeDefined();
  });

  it('should create shop', async () => {
    jest
      .spyOn(ShopHandlers, 'createStoreHandler')
      .mockImplementation(async () => {
        return { name: 'leoMessi', url: '123.com' } as any;
      });

    const createShop = await service.createMarketplaceShop(
      {
        name: 'leoMessi',
        email: 'leo@gmail.com',
      },
      '',
    );
    expect(createShop).toEqual({
      status: 201,
      data: { name: 'leoMessi', url: '123.com' },
    });
    expect(createShop).toBeDefined();
  });

  it('should return bulk shops', async () => {
    jest
      .spyOn(ShopHandlers, 'getAllShopsHandler')
      .mockImplementation(async () => {
        return { name: 'leoMessi', url: '123.com' } as any;
      });

    const getBulkShops = await service.getAllShops(1);
    expect(getBulkShops).toEqual({
      status: 200,
      data: { name: 'leoMessi', url: '123.com' },
    });
    expect(getBulkShops).toBeDefined();
  });

  it('should return my vendors', async () => {
    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => mocks.mockShop);

    const myVendors = await service.getMyVendors('1');
    expect(myVendors).toEqual(mocks.expectedMyVendors);
    expect(myVendors).toBeDefined();
  });

  it('should return no my vendors as there are none added by retailer in b2b shop', async () => {
    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => {
        return { fields: [] } as any;
      });

    const myVendors = await service.getMyVendors('1');
    expect(myVendors).toEqual({
      status: 201,
      data: [],
      message: 'no vendors exist against this retailer',
    });
    expect(myVendors).toBeDefined();
  });

  it('should add my vendor', async () => {
    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => mocks.mockShop);

    jest
      .spyOn(ShopHandlers, 'addVendorsToShopHandler')
      .mockImplementation(async () => mocks.mockShop);

    const addMyVendors = await service.addVendorsToShop('12', [12], '');
    expect(addMyVendors).toBeDefined();
  });

  it('should remove my vendor', async () => {
    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => mocks.mockShop);

    jest
      .spyOn(ShopHandlers, 'removeMyVendorsHandler')
      .mockImplementation(async () => mocks.mockShop);

    const removeMyVendors = await service.removeMyVendorsToShop('12', [12], '');
    expect(removeMyVendors).toBeDefined();
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
