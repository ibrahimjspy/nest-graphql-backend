import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './User.controller';
import { UserService } from './User.service';

// Shop unit tests using Jest

describe('Shop controller unit tests', () => {
  // Testing configurations
  let appController: UserController;
  const queryError = { status: 400 };
  const systemError = { status: 500 };
  const federationInternalError = { status: 405 };
  const testId = { id: 'UHJvZHVjdFR5cGU6Mw==' };
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
      expect(appController.findCheckoutDataById(testId)).toBeDefined();
    });

    it('shoppingCart validation test', () => {
      expect(appController.findShoppingCartDataById(testId)).toBeDefined();
    });

    // async tests for JSON data from either Mock service or backend services

    it('checkout async test', async () => {
      const data = await appController.findCheckoutDataById(testId);
      expect(data).toEqual(objectContainingCheck(queryError));
      expect(data).toEqual(objectContainingCheck(systemError));
      expect(data).toEqual(objectContainingCheck(federationInternalError));
      expect(data).not.toHaveProperty('graphql_error');
    });

    it('shoppingCart async test', async () => {
      const data = await appController.findShoppingCartDataById(testId);
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
