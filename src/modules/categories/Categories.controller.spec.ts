import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';

// Categories unit tests using Jest

describe('Categories controller unit tests', () => {
  // app mimics a test module application
  let appController: CategoriesController;
  const expected = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    appController = app.get<CategoriesController>(CategoriesController);
  });

  // checking for values that are falsy and undefined --->>

  describe('root', () => {
    // Basic validation tests for categories controller
    it('should return "JSON', () => {
      expect(appController.findMenuCategories()).toBeDefined();
    });
    it('should return "JSON collections ', () => {
      expect(appController.findProductCollections()).toBeDefined();
    });
    it('should not be falsy', () => {
      expect(appController.findMenuCategories()).toBeTruthy();
    });
    // async tests for JSON data from either Mock service or backend services
    // async tests for menu categories
    it('the data is an object of menu categories returned from graphQL', async () => {
      const data = await appController.findMenuCategories();
      console.log(data, 'menu categories data');
      expect(data).not.toEqual(expected);
    });
    // async tests for product collections and categories
    it('the data is an object of product collections returned from graphQL testttt', async () => {
      const data = await appController.findProductCollections();
      expect(data).not.toEqual(expected);
    });
    // to be equal test;
  });
});
