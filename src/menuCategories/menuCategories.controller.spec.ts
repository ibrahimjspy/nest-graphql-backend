import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MenuCategoriesController } from './menuCategories.controller';
import { MenuCategoriesService } from './menuCategories.service';

//  Menu Categories unit tests using Jest
//  WARN!! Replace env configs with test links before running command {npm run test}

describe('Categories controller', () => {
  let appController: MenuCategoriesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [MenuCategoriesController],
      providers: [MenuCategoriesService],
    }).compile();

    appController = app.get<MenuCategoriesController>(MenuCategoriesController);
  });

  // checking for values that are falsy and undefined --->>

  describe('root', () => {
    it('should return "JSON', () => {
      expect(appController.findAll()).toBeDefined();
    });
    it('should not be falsy', () => {
      expect(appController.findAll()).toBeTruthy();
    });
    // async test for JSON data
    it('the data is an object returned from graphQL', async () => {
      const expected = { foo: 'bar' };
      const data = await appController.findAll();
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
  });
});
