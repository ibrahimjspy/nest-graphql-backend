import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';

// Categories unit tests using Jest

describe('Categories controller unit tests', () => {
  // Testing configurations
  let appController: CategoriesController;
  const queryError = { status: 400 };
  const systemError = { status: 500 };
  const federationInternalError = { status: 405 };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    appController = app.get<CategoriesController>(CategoriesController);
  });

  describe('root', () => {
    // checking whether calls are valid and don't fail on middleware side--->>

    it('menuCategories validation test', () => {
      expect(appController.findMenuCategories()).toBeDefined();
    });

    it('productCollections validation test', () => {
      expect(appController.findProductCollections()).toBeDefined();
    });

    // async tests for JSON data from either Mock service or backend services

    it('menuCategories async test', async () => {
      const data = await appController.findMenuCategories();
      expect(data).toEqual(objectContainingCheck(queryError));
      expect(data).toEqual(objectContainingCheck(systemError));
      expect(data).toEqual(objectContainingCheck(federationInternalError));
      expect(data).not.toHaveProperty('graphql_error');
    });

    it('productCollections async test', async () => {
      const data = await appController.findProductCollections();
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
