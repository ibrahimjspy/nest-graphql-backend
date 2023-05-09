import { Test, TestingModule } from '@nestjs/testing';
import * as ShopHandlers from 'src/graphql/handlers/shop';
import * as Github from 'src/external/endpoints/provisionStorefront';

import { ShopService } from './Shop.service';
import { ShopType } from 'src/graphql/types/shop.type';

describe('Shop Service Integration test', () => {
  let service: ShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopService],
    }).compile();
    module.useLogger(false);

    service = module.get<ShopService>(ShopService);
  });

  it('should get all shops', async () => {
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
});
