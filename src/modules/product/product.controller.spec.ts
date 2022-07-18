import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ProductCardController } from './product.controller';
import { ProductCardService } from './product.service';

//  Product card unit tests using Jest
//  WARN!! Replace env configs with test links before running command npm run test

describe('CardController', () => {
  let appController: ProductCardController;
  const expected = { foo: 'bar' };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [ProductCardController],
      providers: [ProductCardService],
    }).compile();

    appController = app.get<ProductCardController>(ProductCardController);
  });

  // checking for values that are falsy and undefined --->>

  describe('root', () => {
    it('should return "JSON', () => {
      expect(appController.findAll()).toBeDefined();
    });
    it('should not be falsy', () => {
      expect(appController.findAll()).toBeTruthy();
    });
    it('should not be falsy single product by slug ', () => {
      expect(appController.findProductBySlug('slug')).toBeTruthy();
    });
    it('should not be falsy single product Collections ', () => {
      expect(appController.findProductsByCollectionId('Id')).toBeTruthy();
    });
    // async test checking response JSON from graphql call
    it('the data is an object returned from graphQL', async () => {
      const data = await appController.findAll();
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
    it('the data is an object returned from graphQL ', async () => {
      const data = await appController.findProductsByCollectionId('testId');
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
    // single product details test
    it('the data is an object returned from graphQL', async () => {
      const data = await appController.findProductBySlug('test');
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
  });
});
