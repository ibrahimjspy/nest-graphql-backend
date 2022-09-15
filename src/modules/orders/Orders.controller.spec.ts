import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './Orders.controller';
import { OrdersService } from './Orders.service';

// Orders unit tests using Jest

describe('Orders controller unit tests', () => {
  // Testing configurations
  let appController: OrdersController;
  const queryError = { status: 400 };
  const systemError = { status: 500 };
  const federationInternalError = { status: 405 };
  const testUUID = { id: '3f0c01c1-3195-4025-b24f-3f50f4fb7e95' };
  const testId = { id: '1' };
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

    it('orders dashboard validation test', () => {
      expect(appController.findDashboard('test')).toBeDefined();
    });

    it('shop orders validation test', () => {
      expect(appController.findShopOrders(testId)).toBeDefined();
    });

    it('shop order fulfillments validation test', () => {
      expect(appController.findShopOrderFulfillments(testUUID)).toBeDefined();
    });

    // async tests for JSON data from either Mock service or backend services

    it('Orders dashboard async test', async () => {
      const data = await appController.findDashboard('test');
      expect(data).toEqual(objectContainingCheck(queryError));
      expect(data).toEqual(objectContainingCheck(systemError));
      expect(data).toEqual(objectContainingCheck(federationInternalError));
      expect(data).not.toHaveProperty('graphql_error');
    });

    it('Shop Orders async test', async () => {
      const data = await appController.findShopOrders(testId);
      expect(data).toEqual(objectContainingCheck(queryError));
      expect(data).toEqual(objectContainingCheck(systemError));
      expect(data).toEqual(objectContainingCheck(federationInternalError));
      expect(data).not.toHaveProperty('graphql_error');
    });

    it('Shop Order Fulfillments async test', async () => {
      const data = await appController.findShopOrderFulfillments(testUUID);
      expect(data).toEqual(objectContainingCheck(queryError));
      expect(data).toEqual(objectContainingCheck(systemError));
      expect(data).toEqual(objectContainingCheck(federationInternalError));
      expect(data).not.toHaveProperty('graphql_error');
    });
  });
});
export const objectContainingCheck = (errorCode: object) => {
  return expect.not.objectContaining(errorCode);
};
