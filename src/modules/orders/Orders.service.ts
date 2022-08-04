import { Injectable } from '@nestjs/common';
import { dashboardByIdHandler } from 'src/graphql/handlers/orders/orders';

@Injectable()
export class OrdersService {
  public getDashboardDataById(id): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return dashboardByIdHandler(id);
  }
}
