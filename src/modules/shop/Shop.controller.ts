import { Controller, Get } from '@nestjs/common';
import { ShopService } from './Shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly appService: ShopService) {}
  // Returns landing page banner data
  @Get('/banner')
  findBanner(): string {
    return this.appService.getBannerData();
  }
}
