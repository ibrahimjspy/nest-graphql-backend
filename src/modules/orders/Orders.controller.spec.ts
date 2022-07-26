import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './Orders.controller';
import { OrdersService } from './Orders.service';

// Orders unit tests using Jest

describe('Orders controller unit tests', () => {
  // app mimics a test module application
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
    it('should return "JSON', () => {
      expect(appController.findDashboard()).toBeDefined();
    });
    // async tests for JSON data from either Mock service or backend services
    // async test for user dashboard located at landing page
    it('the data is an object of userDashboard returned from graphQL', async () => {
      const data = await appController.findDashboard();
      expect(data).not.toEqual(expected);
    });
  });
});
