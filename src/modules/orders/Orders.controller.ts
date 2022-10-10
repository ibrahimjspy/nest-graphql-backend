import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './Orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}
  // Returns orders dashboard data for landing page
  @Get('/dashboardById/:id')
  findDashboard(@Param() params): Promise<object> {
    return this.appService.getDashboardDataById(params?.id);
  }
  // Returns all shop orders for orders page
  @Get('/allShopOrders')
  async findAllShopOrders(): Promise<object> {
    return await this.appService.getAllShopOrdersData();
  }
  // Returns shop orders for orders page
  @Get('/shopOrdersById/:id')
  async findShopOrders(@Param() params): Promise<object> {
    return await this.appService.getShopOrdersDataById(params.id);
  }
  // Returns shop order fulfillments for order page
  @Get('/shopOrderFulfillmentsById/:id')
  findShopOrderFulfillments(@Param() params): Promise<object> {
    return this.appService.getShopOrderFulfillmentsDataById(params.id);
  }
}
