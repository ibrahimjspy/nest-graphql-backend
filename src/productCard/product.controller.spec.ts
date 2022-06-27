import { Test, TestingModule } from '@nestjs/testing';
import { ProductCardController } from './productCard.controller';
import { ProductCardService } from './productCard.service';

describe('CardController', () => {
  let appController: ProductCardController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductCardController],
      providers: [ProductCardService],
    }).compile();

    appController = app.get<ProductCardController>(ProductCardController);
  });

  describe('root', () => {
    it('should return "JSON', () => {
      expect(appController.findAll()).toBeDefined();
    });
    it('should not be falsy', () => {
      expect(appController.findAll()).toBeTruthy();
    });
  });
});
