import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './Orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}
  // Returns orders dashboard data for landing page
  @Get('/dashboardById/:id')
  findDashboard(@Param() params): Promise<object> {
    return this.appService.getDashboardDataById(params.id);
  }
  // Returns shop orders for orders page
  @Get('/shopOrdersById/:id')
  findShopOrders(@Param() params): Promise<object> {
    return this.appService.getShopOrdersDataById(params.id);
  }
  // Returns shop order fulfillments for order page
  @Get('/shopOrderFulfillmentsById/:id')
  findShopOrderFulfillments(@Param() params): Promise<object> {
    return this.appService.getShopOrderFulfillmentsDataById(params.id);
  }
}
