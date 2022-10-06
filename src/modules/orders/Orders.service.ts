import { Injectable, Logger } from '@nestjs/common';
import { dashboardByIdHandler, orderDetailsHandler, shopOrderFulfillmentsDetailsHandler } from 'src/graphql/handlers/orders';
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
              order["totalAmount"] = 0
              order["fulfillmentColour"] = order["fulfillmentStatus"] == "UNFULFILLED" ? "red" : ""
              order["fulfillmentColour"] = order["fulfillmentStatus"] == "PARTIALLY FULFILLED" ? "blue" : order["fulfillmentColour"]
              order["fulfillmentColour"] = order["fulfillmentStatus"] == "FULFILLED" ? "green" : order["fulfillmentColour"]
              await Promise.all(
                order.orderBundles.map(
                  async (orderBundle) => {
                    await Promise.all(
                      orderBundle.bundle.variants.map(
                        async (variant) => {
                          order["totalAmount"] += (
                            parseFloat(variant.variant.pricing.price.gross.amount)
                            * parseInt(variant.quantity)
                            * parseInt(orderBundle.quantity)
                            )
                        }
                      )
                    )
                  }
                )
              )
              delete order.orderBundles
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
  public async getShopOrderFulfillmentsDataById(id): Promise<object> {
    const orderFulfillments = await shopOrderFulfillmentsByIdHandler(id);
    const fulfillmentDetails = await shopOrderFulfillmentsDetailsHandler(orderFulfillments["orderId"]);
    orderFulfillments["number"] = fulfillmentDetails["number"]
    orderFulfillments["userEmail"] = fulfillmentDetails["userEmail"]
    orderFulfillments["shippingAddress"] = fulfillmentDetails["shippingAddress"]
    orderFulfillments["billingAddress"] = fulfillmentDetails["billingAddress"]
    orderFulfillments["customerNote"] = fulfillmentDetails["customerNote"]
    orderFulfillments["fulfillmentColour"] = orderFulfillments["fulfillmentStatus"] == "UNFULFILLED" ? "red" : ""
    orderFulfillments["fulfillmentColour"] = orderFulfillments["fulfillmentStatus"] == "PARTIALLY FULFILLED" ? "blue" : orderFulfillments["fulfillmentColour"]
    orderFulfillments["fulfillmentColour"] = orderFulfillments["fulfillmentStatus"] == "FULFILLED" ? "green" : orderFulfillments["fulfillmentColour"]
    
    // await Promise.all(
    //   orderFulfillments["orderBundles"].map(
    //     async (orderBundle) => {
    //       await Promise.all(
    //         orderBundle.bundle.variants.map(
    //           async (variant) => {
    //             orderFulfillments["totalAmount"] += (
    //               parseFloat(variant.variant.pricing.price.gross.amount)
    //               * parseInt(variant.quantity)
    //               * parseInt(orderBundle.quantity)
    //               )
    //           }
    //         )
    //       )
    //     }
    //   )
    // )
    return orderFulfillments
  }
}
