import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './Orders.controller';
import { OrdersService } from './Orders.service';
import {
  getOrderIdsFromShopData,
  getOrdersByShopId,
  getPendingOrders,
} from './Orders.utils';
import {
  expectedOrdersByShop,
  mockCheckoutBundles,
  mockOrderData,
} from '../../../test/mock/addOrderToShop';
import { filterReturnedOrderIds, hasNextPage } from 'src/graphql/utils/orders';

// Orders unit tests using Jest

describe('Orders controller unit tests', () => {
  // Testing configurations
  const orders = [{ status: 'FULFILLED' }, { status: 'UNFULFIllED' }];
  let appController: OrdersController;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    appController = app.get<OrdersController>(OrdersController);
  });

  // checking for values that are falsy and undefined --->>

  describe('root', () => {
    // Basic validation tests for categories controller
    it('get pending orders filter unit test', () => {
      expect(getPendingOrders(orders)).toBeDefined();
      expect(getPendingOrders(orders)).toStrictEqual([
        { status: 'UNFULFIllED' },
      ]);
    });

    it('add order to shop utility is working', async () => {
      const checkoutData = mockCheckoutBundles.data.marketplaceCheckout;
      const allOrdersByShopId = getOrdersByShopId(
        checkoutData,
        mockOrderData.order,
      );
      expect(allOrdersByShopId).toBeDefined();
      expect(allOrdersByShopId).toStrictEqual(expectedOrdersByShop);
    });

    it('hasNextPage for orders pagination based api is working', () => {
      const pageInfo = { hasNextPage: true, endCursor: 'test' };
      const data = hasNextPage(pageInfo);
      expect(data).toBeDefined();
      expect(data).toStrictEqual('test');
    });

    it('order ids are parsed correctly from shop data', () => {
      const shopData = {
        orders: [{ id: 'abd75875-2996-49cf-81ee-719bcb393941', orderId: '4' }],
      };
      const expectedOrderIds = ['4'];
      const orderIds = getOrderIdsFromShopData(shopData);
      expect(orderIds).toBeDefined();
      expect(orderIds).toStrictEqual(expectedOrderIds);
    });

    it('filterReturnedOrderIds is filtering order response fine', () => {
      const orders = [{ node: { id: 'test', status: 'RETURNED' } }];
      const data = filterReturnedOrderIds(orders);
      expect(data).toBeDefined();
      expect(data).toStrictEqual(['test']);
    });

    //   // async tests for JSON data from either Mock service or backend services
  });
});
export const objectContainingCheck = (errorCode: object) => {
  return expect.not.objectContaining(errorCode);
};
