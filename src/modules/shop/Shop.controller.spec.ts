import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ShopController } from './Shop.controller';
import { ShopService } from './Shop.service';

// Shop unit tests using Jest

describe('Shop controller unit tests', () => {
  // Testing configurations
  let appController: ShopController;
  const expected = { status: 400 };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [ShopController],
      providers: [ShopService],
    }).compile();

    appController = app.get<ShopController>(ShopController);
  });

  describe('root', () => {
    // checking whether calls are valid and don't fail on middleware side--->>

    it('banner validation test', () => {
      expect(appController.findBanner()).toBeDefined();
    });

    // async tests for JSON data from either Mock service or backend services

    it('banner async test', async () => {
      const data = await appController.findBanner();
      expect(data).not.toEqual(expected);
    });
  });
});
