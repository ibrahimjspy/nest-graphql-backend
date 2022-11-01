import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './Orders.service';
import { makeResponse } from '../../core/utils/response';
import { UserIdDto, ShopIdDto, OrderIdDto } from './dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}
  // Returns orders dashboard data for landing page
  @Get('/dashboardById/:userId')
  async findDashboard(
    @Res() res,
    @Param() userDto: UserIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getDashboardDataById(userDto?.userId),
    );
  }
  // Returns all shop orders for orders page
  @Get('/b2b/all')
  async findAllShopOrders(@Res() res): Promise<object> {
    return makeResponse(res, await this.appService.getAllShopOrdersData());
  }
  // Returns shop orders for orders page
  @Get('/b2b/shop/:shopId')
  async findShopOrders(
    @Res() res,
    @Param() shopDto: ShopIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopOrdersDataById(shopDto.shopId),
    );
  }
  // Returns shop order fulfillments for order page
  @Get('/b2b/shop/fulfillment/:orderId')
  async findShopOrderFulfillments(
    @Res() res,
    @Param() orderDto: OrderIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopOrderFulfillmentsDataById(orderDto.orderId),
    );
  }
}
