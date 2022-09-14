import { Injectable } from '@nestjs/common';
import { dashboardByIdHandler } from 'src/graphql/handlers/orders';
import { shopOrdersByIdHandler } from 'src/graphql/handlers/orders';

@Injectable()
export class OrdersService {
  public getDashboardDataById(id): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return dashboardByIdHandler(id);
  }
  public getShopOrdersDataById(id): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // orchestrate multiple GraphQL call responses to get Shop Orders --->
    return shopOrdersByIdHandler(id);
  }
}
