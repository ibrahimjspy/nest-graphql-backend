import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  allShopOrdersHandler,
  dashboardByIdHandler,
  orderDetailsHandler,
  shopOrderFulfillmentsByIdHandler,
  shopOrdersByIdHandler,
  orderActivityHandler,
} from 'src/graphql/handlers/orders';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  public getDashboardDataById(id): Promise<object> {
    return dashboardByIdHandler(id);
  }
  public async getAllShopOrdersData(): Promise<object> {
    const response = await allShopOrdersHandler();
    const shops = (response['edges'] || []).map((shop) => shop['node']);

    await Promise.all(
      shops.map(async (shop) => {
        const orders = shop['orders'];
        await Promise.all(
          orders.map(async (order) => {
            const orderDetails = await orderDetailsHandler(order['orderId']);
            order['number'] = orderDetails['number'];
            order['created'] = orderDetails['created'];
            order['userEmail'] = orderDetails['userEmail'];
          }),
        );
      }),
    );

    return shops;
  }
  public async getShopOrdersDataById(id): Promise<object> {
    return await shopOrdersByIdHandler(id);
  }
  public getShopOrderFulfillmentsDataById(id): Promise<object> {
    return shopOrderFulfillmentsByIdHandler(id);
  }
  public async getOrderActivity(): Promise<object> {
    try {
      const response = await orderActivityHandler();
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
