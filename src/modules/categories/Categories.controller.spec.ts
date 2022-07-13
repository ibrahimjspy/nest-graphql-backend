import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MenuCategoriesController } from './Categories.controller';
import { CategoriesService } from './Categories.service';

//  Menu Categories unit tests using Jest
//  WARN!! Replace env configs with test links before running command {npm run test}

describe('Categories controller', () => {
  let appController: MenuCategoriesController;
  const expected = { foo: 'collection not f' };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [MenuCategoriesController],
      providers: [CategoriesService],
    }).compile();

    appController = app.get<MenuCategoriesController>(MenuCategoriesController);
  });

  // checking for values that are falsy and undefined --->>

  describe('root', () => {
    //Basic validation tests for categories controller
    it('should return "JSON', () => {
      expect(appController.findAll()).toBeDefined();
    });
    it('should return "JSON collections ', () => {
      expect(appController.findCollections()).toBeDefined();
    });
    it('should not be falsy', () => {
      expect(appController.findAll()).toBeTruthy();
    });
    // async test for JSON data
    it('the data is an object returned from graphQL', async () => {
      const data = await appController.findAll();
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
    //async tests for product collections and categories
    it('the data is an object returned from graphQL', async () => {
      const data = await appController.findCollections();
      expect(data).not.toEqual(expect.objectContaining(expected));
    });
  });
});
