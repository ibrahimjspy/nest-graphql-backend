import { Controller, Get, Param } from '@nestjs/common';
import { ProductCardService } from './product.service';

@Controller('product')
export class ProductCardController {
  constructor(private readonly appService: ProductCardService) {}
  // Returns default cards data  <All>
  @Get('/cards')
  findAll(): Promise<object> {
    return this.appService.getProducts();
  }
  // Returns cards data relating to category <id>
  @Get('/cardsByCollectionId/:id')
  findProductsByCollectionId(@Param() params): Promise<object> {
    return this.appService.getProductsByCollections(params.id);
  }
  // Returns single product details by <slug>
  @Get('details/:slug')
  findProductBySlug(@Param() params): Promise<object> {
    return this.appService.getProductById(params.slug);
  }
}
