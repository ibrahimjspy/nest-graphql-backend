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
  findString(@Param() params): string {
    return `This action returns products relating to collection ${params.id}  with param id `;
  }
  // Returns single card data by <slug>
  @Get('/:slug')
  findProduct(@Param() params): string {
    return `This action returns product data relating to ${params.slug} with param slug `;
  }
}
