import { Controller, Get } from '@nestjs/common';
import { ProductCardService } from './productCard.service';

@Controller('productCard')
export class ProductCardController {
  constructor(private readonly appService: ProductCardService) {}
  @Get()
  findAll(): Promise<object> {
    return this.appService.getProducts();
  }
  @Get('/byCollectionId/:id')
  findString(): string {
    return 'This action returns products relating to collection id  with param id ';
  }
  @Get('/collections')
  findCollections(): Promise<object> {
    return this.appService.getCollections();
  }
}
