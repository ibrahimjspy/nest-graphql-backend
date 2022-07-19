import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';

// Categories unit tests using Jest

describe('Categories controller unit tests', () => {
  // appController mimics a test module application
  let appController: CategoriesController;
  const expected = { foo: 'collection not found' };
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
      expect(appController.findAll()).toBeDefined();
    });
    it('should return "JSON collections ', () => {
      expect(appController.findCollections()).toBeDefined();
    });
    it('should not be falsy', () => {
      expect(appController.findAll()).toBeTruthy();
    });
    // async tests for JSON data from either Mock service or backend services
    // async tests for menu categories
    it('the data is an object of menu categories returned from graphQL', async () => {
      const data = await appController.findAll();
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
    // async tests for product collections and categories
    it('the data is an object of product collections returned from graphQL', async () => {
      const data = await appController.findCollections();
      expect(data).not.toEqual(expect.objectContaining(expected));
    });
  });
});
