import { Controller, Get, Param } from '@nestjs/common';
import { ProductCardService } from './productCard.service';

@Controller('productCard')
export class ProductCardController {
  constructor(private readonly appService: ProductCardService) {}
  // Returns default cards  <All>
  @Get()
  findAll(): Promise<object> {
    return this.appService.getProducts();
  }
  // Returns multiple cards relating to category <id>
  @Get('/byCollectionId/:id')
  findProductsByCollectionId(@Param() params): Promise<object> {
    return this.appService.getProductsByCollections(params.id);
  }
  // Returns single product details by <slug>
  @Get('details/:slug')
  findProductBySlug(@Param() params): Promise<object> {
    return this.appService.getProductById(params.slug);
  }
}
