import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';

//  Product controller unit tests using Jest

describe('ProductController', () => {
  // Testing configurations
  let appController: ProductController;
  const expected = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();
    appController = app.get<ProductController>(ProductController);
  });

  describe('root', () => {
    // checking whether calls are valid and don't fail on middleware side--->>

    it('default productCards validation test', () => {
      expect(appController.findDefaultCards()).toBeTruthy();
    });

    it('productDetails validation test', () => {
      expect(appController.findProductDetailsBySlug('slug')).toBeTruthy();
    });

    it('productCards by collections validation test', () => {
      expect(appController.findProductCardsByListId('Id')).toBeTruthy();
    });

    // async test checking response JSON from graphql call

    it('default productCards async test', async () => {
      const data = await appController.findDefaultCards();
      expect(data).not.toEqual(expected);
    });

    it('productCards by collections async test', async () => {
      const testId = { id: 'UHJvZHVjdFR5cGU6Mw==' };
      const data = await appController.findProductCardsByListId(testId);
      expect(data).not.toEqual(expected);
    });

    it('product details async test', async () => {
      const data = await appController.findProductDetailsBySlug('test');
      expect(data).not.toEqual(expected);
    });
  });
});
