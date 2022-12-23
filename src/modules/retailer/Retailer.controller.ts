import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RetailerService } from './Retailer.service';
import { makeResponse } from '../../core/utils/response';
import { RetailerDto } from './dto';

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

  @Get('job/title')
  async getRetailerJobTitle(): Promise<object> {
    return this.appService.getRetailerJobTitle();
  }

  @Post('email-availability')
  async getCheckRetailerEmail(@Body() body: RetailerDto): Promise<object> {
    return this.appService.getCheckRetailerEmail(body?.email);
  }
}
