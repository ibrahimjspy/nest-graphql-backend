import { Controller, Get, Headers, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './Payments.service';
import { makeResponse } from 'src/core/utils/response';
import { dateDto, shopIdDto } from 'src/modules/retailer/dto';

@ApiTags('payments')
@Controller()
export class PaymentsController {
  constructor(private readonly appService: PaymentsService) {}

  @Get('api/v1/payments/sales/:shopId')
  @ApiOperation({ summary: 'returns sales report against shop' })
  async getSalesReport(
    @Res() res,
    @Param() param: shopIdDto,
    @Query() date: dateDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return await makeResponse(
      res,
      await this.appService.getSalesReport(
        param.shopId,
        date.fromDate,
        date.toDate,
        Authorization,
      ),
    );
  }

  @Get('api/v1/payments/transactions/:shopId')
  @ApiOperation({ summary: 'returns transaction history against shop' })
  async getTransactionHistory(
    @Res() res,
    @Param() param: shopIdDto,
    @Query() date: dateDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getTransactionHistory(
        param.shopId,
        date.fromDate,
        date.toDate,
        Authorization,
      ),
    );
  }

  @Get('api/v1/payments/purchases/:shopId')
  @ApiOperation({ summary: 'returns purchase history against shop' })
  async getPurchaseHistory(
    @Res() res,
    @Param() param: shopIdDto,
    @Query() date: dateDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getPurchaseHistory(
        param.shopId,
        date.fromDate,
        date.toDate,
        Authorization,
      ),
    );
  }
}
