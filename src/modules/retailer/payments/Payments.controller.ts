import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './Payments.service';
import { makeResponse } from 'src/core/utils/response';
import { ShopIdDto } from 'src/modules/orders/dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly appService: PaymentsService) {}

  @Get('sales/report')
  @ApiOperation({ summary: 'adds product to store' })
  async getSalesReport(
    @Res() res,
    @Param() param: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return await makeResponse(
      res,
      await this.appService.getSalesReport(param.shopId, Authorization),
    );
  }

  @Get('account/info')
  @ApiOperation({ summary: 'adds product to store' })
  async getAccountInfo(
    @Res() res,
    @Param() param: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return await makeResponse(
      res,
      await this.appService.getAccountInfo(param.shopId, Authorization),
    );
  }

  @Get('transaction/history')
  @ApiOperation({ summary: 'adds product to store' })
  async getTransactionHistory(
    @Res() res,
    @Param() param: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getTransactionHistory(param.shopId, Authorization),
    );
  }

  @Get('purchase/history')
  @ApiOperation({ summary: 'adds product to store' })
  async getPurchaseHistory(
    @Res() res,
    @Param() param: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getPurchaseHistory(param.shopId, Authorization),
    );
  }
}
