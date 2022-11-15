import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './Orders.service';
import { makeResponse } from '../../core/utils/response';
import { OrderIdDto, ShopIdDto, UserIdDto } from './dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}
  // Returns orders dashboard data for landing page
  @Get('/history/:userId')
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
  @Get('/marketplace/all')
  async findAllShopOrders(@Res() res): Promise<object> {
    return makeResponse(res, await this.appService.getAllShopOrdersData());
  }
  // Returns shop orders for orders page
  @Get('/marketplace/shop/:shopId')
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
  @Get('/marketplace/shop/fulfillment/:orderId')
  async findShopOrderFulfillments(
    @Res() res,
    @Param() orderDto: OrderIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getShopOrderFulfillmentsDataById(orderDto.orderId),
    );
  }
  // Returns shop order activities
  @Get('/activity')
  async getOrderActivity(@Res() res): Promise<object> {
    return makeResponse(res, await this.appService.getOrderActivity());
  }

  // Returns shop order details
  @Get('/:orderId')
  async getOrderDetails(
    @Res() res,
    @Param() orderDto: OrderIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getOrderDetailsById(orderDto.orderId),
    );
  }

  // Returns shop orders list
  @Get('/list/:shopId')
  async getOrdersList(
    @Res() res,
    @Param() shopDto: ShopIdDto,
  ): Promise<object> {
    return makeResponse(
      res,
      await this.appService.getOrdersListByShopId(shopDto.shopId),
    );
  }
}
