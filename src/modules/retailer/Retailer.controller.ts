import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RetailerService } from './Retailer.service';
import { makeResponse } from '../../core/utils/response';

@ApiTags('retailer')
@Controller('retailer')
export class RetailerController {
  constructor(private readonly appService: RetailerService) {}

  @Get('orders/recent/:email')
  async getRecentOrdersData(@Res() res, @Param() params): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getRecentOrdersData(params?.email),
    );
  }
}
