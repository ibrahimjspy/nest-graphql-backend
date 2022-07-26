import { Injectable } from '@nestjs/common';
import { dashboardByIdHandler } from 'src/graphql/handlers/orders/dashboardById';

@Injectable()
export class OrdersService {
  public getDashboardData(): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return dashboardByIdHandler();
  }
}
