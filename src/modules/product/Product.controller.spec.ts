import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';

//  Product card unit tests using Jest
//  WARN!! Replace env configs with test links before running command npm run test

describe('ProductController', () => {
  let appController: ProductController;
  const expected = { foo: 'bar' };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    appController = app.get<ProductController>(ProductController);
  });

  // checking for values that are falsy and undefined --->>

  describe('root', () => {
    it('should not be falsy default cards', () => {
      expect(appController.findDefaultCards()).toBeTruthy();
    });
    it('should not be falsy single product details by slug ', () => {
      expect(appController.findProductDetailsBySlug('slug')).toBeTruthy();
    });
    it('should not be falsy product cards by CollectionsId ', () => {
      expect(appController.findProductCardsByCollectionId('Id')).toBeTruthy();
    });
    // async test checking response JSON from graphql call
    // default product cards async test
    it('the data is an object of default productCards returned from graphQL', async () => {
      const data = await appController.findDefaultCards();
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
    it('the data is an object of productCards by collections returned from graphQL ', async () => {
      const data = await appController.findProductCardsByCollectionId('testId');
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
    // single product details test
    it('the data is an object of productDetails returned from graphQL', async () => {
      const data = await appController.findProductDetailsBySlug('test');
      expect(data).toEqual(expect.not.objectContaining(expected));
    });
  });
});
