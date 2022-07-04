import { Controller, Get, Param } from '@nestjs/common';
import { ProductCardService } from './productCard.service';

@Controller('productCard')
export class ProductCardController {
  constructor(private readonly appService: ProductCardService) {}
  @Get()
  findAll(): Promise<object> {
    return this.appService.getProducts();
  }
  @Get('/byCollectionId/:id')
  findString(@Param() params): string {
    return `This action returns products relating to collection ${params.id}  with param id `;
  }
}
