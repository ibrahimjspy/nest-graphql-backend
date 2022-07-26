import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ShopController } from './Shop.controller';
import { ShopService } from './Shop.service';

// Shop unit tests using Jest

describe('Shop controller unit tests', () => {
  // app mimics a test module application
  let appController: ShopController;
  const expected = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [ShopController],
      providers: [ShopService],
    }).compile();

    appController = app.get<ShopController>(ShopController);
  });

  // checking for values that are falsy and undefined --->>

  describe('root', () => {
    // Basic validation tests for categories controller
    it('should return "JSON', () => {
      expect(appController.findBanner()).toBeDefined();
    });
    // async tests for JSON data from either Mock service or backend services
    it('the data is an object of banner details returned from graphQL', async () => {
      const data = await appController.findBanner();
      expect(data).not.toEqual(expected);
    });
  });
});
