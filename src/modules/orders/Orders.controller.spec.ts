import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './Orders.controller';
import { OrdersService } from './Orders.service';

// Orders unit tests using Jest

describe('Orders controller unit tests', () => {
  // Testing configurations
  let appController: OrdersController;
  const expected = {};
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

    // async tests for JSON data from either Mock service or backend services

    it('Orders dashboard async test', async () => {
      const data = await appController.findDashboard('test');
      expect(data).not.toEqual(expected);
    });
  });
});
