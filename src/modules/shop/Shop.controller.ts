import { Controller, Get } from '@nestjs/common';
import { ShopService } from './Shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly appService: ShopService) {}
  // Returns landing page banner data
  @Get('/carousel')
  findBanner(): Promise<object> {
    return this.appService.getCarouselData();
  }
}
