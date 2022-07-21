import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './Orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}
  // Returns orders dashboard data for landing page
  @Get('/dashboardById/:id')
  findDashboard(): Promise<object> {
    return this.appService.getDashboardData();
  }
}
