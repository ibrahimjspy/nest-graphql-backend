import { Controller, Get, Param, Res, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './Orders.service';
import { makeResponse } from '../../core/utils/response';
import { OrderIdDto, ShopIdDto, UserIdDto } from './dto';
import { OrderSummaryDto } from './dto/common.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}
  // Returns orders dashboard data for landing page
  @Get('/history/:userId')
  async findDashboard(
    @Res() res,
    @Param() userDto: UserIdDto,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getDashboardDataById(userDto?.userId, headers),
    );
  }
  // Returns all shop orders for orders page
  @Get('/marketplace/all')
  async findAllShopOrders(@Res() res, @Headers() headers): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getAllShopOrdersData(headers.Authorization),
    );
  }
  // Returns shop orders for orders page
  @Get('/marketplace/shop/:shopId')
  async findShopOrders(
    @Res() res,
    @Param() shopDto: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopOrdersDataById(shopDto.shopId, headers),
    );
  }
  // Returns shop order fulfillments for order page
  @Get('/marketplace/shop/fulfillment/:orderId')
  async findShopOrderFulfillments(
    @Res() res,
    @Param() orderDto: OrderIdDto,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopOrderFulfillmentsDataById(
        orderDto.orderId,
        headers.Authorization,
      ),
    );
  }
  // Returns shop order activities
  @Get('/activity')
  async getOrderActivity(@Res() res, @Headers() headers): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getOrderActivity(headers.Authorization),
    );
  }

  // Returns shop order details
  @Get('/detail/:orderId')
  async getOrderDetails(
    @Res() res,
    @Param() orderDto: OrderIdDto,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getOrderDetailsById(
        orderDto.orderId,
        headers.Authorization,
      ),
    );
  }

  // Returns shop orders list
  @Get('/list/:shopId')
  async getOrdersList(
    @Res() res,
    @Param() shopDto: ShopIdDto,
    @Headers() headers,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getOrdersListByShopId(
        shopDto.shopId,
        headers.Authorization,
      ),
    );
  }

  // Returns all pending shop orders for orders list page
  @Get('/marketplace/all/pending')
  async findAllPendingOrders(@Res() res, @Headers() headers): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getAllPendingOrders(headers.Authorization),
    );
  }

  // Returns orders summary ()
  @Get('/summary/:reportingPeriod?')
  async findOrdersSummary(
    @Res() res,
    @Param() orderSummaryDto: OrderSummaryDto,
    @Headers() headers,
  ): Promise<object> {
    const Authorization: string = headers.authorization;
    return makeResponse(
      res,
      await this.appService.getOrdersSummary(
        orderSummaryDto.reportingPeriod,
        Authorization,
      ),
    );
  }
}
