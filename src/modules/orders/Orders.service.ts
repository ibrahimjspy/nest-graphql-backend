import { Injectable } from '@nestjs/common';
import { dashboardByIdHandler } from '../../graphql/handlers/orders/dashboardByID';

@Injectable()
export class OrdersService {
  public getDashboardData(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return dashboardByIdHandler();
  }
}
