import { Test, TestingModule } from '@nestjs/testing';
import * as ShopHandlers from 'src/graphql/handlers/shop';
import { shopIntegrationMocks } from '../../../../../test/mock/shop';
import { MyVendorsService } from './MyVendors.service';

describe('My Vendors Service Integration test', () => {
  let service: MyVendorsService;
  const mocks = shopIntegrationMocks;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyVendorsService],
    }).compile();
    module.useLogger(false);

    service = module.get<MyVendorsService>(MyVendorsService);
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

  it('should return my vendors', async () => {
    jest
      .spyOn(ShopHandlers, 'getShopDetailsV2Handler')
      .mockImplementation(async () => mocks.mockShop);

    const myVendors = await service.getMyVendors('1');
    expect(myVendors).toEqual(mocks.expectedMyVendors);
    expect(myVendors).toBeDefined();
  });
});
