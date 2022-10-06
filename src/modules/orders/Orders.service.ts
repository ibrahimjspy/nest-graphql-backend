import { Injectable, Logger } from '@nestjs/common';
import { dashboardByIdHandler, orderDetailsHandler } from 'src/graphql/handlers/orders';
import { allShopOrdersHandler } from 'src/graphql/handlers/orders';
import { shopOrdersByIdHandler } from 'src/graphql/handlers/orders';
import { shopOrderFulfillmentsByIdHandler } from 'src/graphql/handlers/orders';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  public getDashboardDataById(id): Promise<object> {
    return dashboardByIdHandler(id);
  }
  public async getAllShopOrdersData(): Promise<object> {
    const response = await allShopOrdersHandler();
    const shops = (response["edges"] || []).map((shop) => shop["node"])

    const shopOrders = {"orders": []}

    await Promise.all(
      shops.map(
        async (shop) => {
          const orders = shop["orders"]
          const shopName = shop["name"]
          const shopId = shop["id"]
          delete shop.name
          delete shop.id
          await Promise.all(
            orders.map(async (order) => {
              const orderDetails = await orderDetailsHandler(order["orderId"]);
              delete order.orderId
              order["shopName"] = shopName
              order["shopId"] = shopId
              order["number"] = orderDetails["number"]
              order["created"] = orderDetails["created"]
              order["userEmail"] = orderDetails["userEmail"]
              shopOrders.orders.push(order)
            })
          )
        }
      )
    )
    return shopOrders
  }
  public async getShopOrdersDataById(id): Promise<object> {
    return await shopOrdersByIdHandler(id);
  }
  public getShopOrderFulfillmentsDataById(id): Promise<object> {
    return shopOrderFulfillmentsByIdHandler(id);
  }
}
