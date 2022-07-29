import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './User.controller';
import { UserService } from './User.service';

// Shop unit tests using Jest

describe('Shop controller unit tests', () => {
  // Testing configurations
  let appController: UserController;
  const expected = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    appController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    // checking whether calls are valid and don't fail on middleware side--->>

    it('checkout validation test', () => {
      expect(appController.findCheckoutData()).toBeDefined();
    });

    it('shoppingCart validation test', () => {
      expect(appController.findShoppingCartData()).toBeDefined();
    });

    // async tests for JSON data from either Mock service or backend services

    it('checkout async test', async () => {
      const data = await appController.findCheckoutData();
      expect(data).not.toEqual(expected);
    });

    it('shoppingCart async test', async () => {
      const data = await appController.findShoppingCartData();
      expect(data).not.toEqual(expected);
    });
  });
});
