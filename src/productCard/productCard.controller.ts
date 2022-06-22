import { Controller, Get } from '@nestjs/common';
import { ProductCardService } from './productCard.service';

@Controller('productCard')
export class ProductCardController {
  constructor(private readonly appService: ProductCardService) {}
  @Get()
  findAll(): Promise<object> {
    return this.appService.getProducts();
  }
}
