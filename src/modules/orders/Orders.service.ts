import { Injectable, Logger } from '@nestjs/common';
import * as OrderHandlers from 'src/graphql/handlers/orders';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  public async getDashboardDataById(id): Promise<object> {
    try {
      const response = await OrderHandlers.dashboardByIdHandler(id);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getAllShopOrdersData(): Promise<object> {
    try {
      const response = await OrderHandlers.allShopOrdersHandler();
      const shops = (response['edges'] || []).map((shop) => shop['node']);
      const shopOrders = { orders: [] };
      await Promise.all(
        shops.map(async (shop) => {
          const orders = shop['orders'];
          const shopName = shop['name'];
          const shopId = shop['id'];
          delete shop['name'];
          delete shop['id'];

          await Promise.all(
            orders.map(async (order) => {
              const orderDetails = await OrderHandlers.orderDetailsHandler(
                order['orderId'],
              );
              delete order.orderId;
              order['shopName'] = shopName;
              order['shopId'] = shopId;
              order['number'] = orderDetails['number'];
              order['created'] = orderDetails['created'];
              order['userEmail'] = orderDetails['userEmail'];
              order['totalAmount'] = 0;
              order['fulfillmentColour'] =
                order['fulfillmentStatus'] == 'UNFULFILLED' ? 'error' : '';
              order['fulfillmentColour'] =
                order['fulfillmentStatus'] == 'PARTIALLY FULFILLED'
                  ? 'info'
                  : order['fulfillmentColour'];
              order['fulfillmentColour'] =
                order['fulfillmentStatus'] == 'FULFILLED'
                  ? 'success'
                  : order['fulfillmentColour'];

              await Promise.all(
                order.orderBundles.map(async (orderBundle) => {
                  await Promise.all(
                    orderBundle.bundle.variants.map(async (variant) => {
                      order['totalAmount'] +=
                        parseFloat(variant.variant.pricing.price.gross.amount) *
                        parseInt(variant.quantity) *
                        parseInt(orderBundle.quantity);
                      order['currency'] =
                        variant.variant.pricing.price.gross.currency;
                    }),
                  );
                }),
              );

              await Promise.all(
                order['fulfillments'].map(async (fulfillment) => {
                  order['fulfillments']['totalAmount'] = 0;
                  await Promise.all(
                    fulfillment['fulfillmentBundles'].map(
                      async (fulfillmentBundle) => {
                        await Promise.all(
                          fulfillmentBundle.bundle.variants.map(
                            async (variant) => {
                              order['fulfillments']['totalAmount'] +=
                                parseFloat(
                                  variant.variant.pricing.price.gross.amount,
                                ) *
                                parseInt(variant.quantity) *
                                parseInt(fulfillmentBundle.quantity);
                            },
                          ),
                        );
                      },
                    ),
                  );
                }),
              );

              order['totalAmount'] += order['fulfillments']['totalAmount'] || 0;
              delete order['fulfillments'];
              delete order['orderBundles'];
              shopOrders.orders.push(order);
            }),
          );
        }),
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShopOrdersDataById(id): Promise<object> {
    try {
      const response = await OrderHandlers.shopOrdersByIdHandler(id);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShopOrderFulfillmentsDataById(id): Promise<object> {
    const orderFulfillments =
      await OrderHandlers.shopOrderFulfillmentsByIdHandler(id);
    const fulfillmentDetails =
      await OrderHandlers.shopOrderFulfillmentsDetailsHandler(
        orderFulfillments['orderId'],
      );
    orderFulfillments['number'] = fulfillmentDetails['number'];
    orderFulfillments['userEmail'] = fulfillmentDetails['userEmail'];
    orderFulfillments['shippingAddress'] =
      fulfillmentDetails['shippingAddress'];
    orderFulfillments['billingAddress'] = fulfillmentDetails['billingAddress'];
    orderFulfillments['customerNote'] = fulfillmentDetails['customerNote'];
    orderFulfillments['fulfillmentColour'] =
      orderFulfillments['fulfillmentStatus'] == 'UNFULFILLED' ? 'error' : '';
    orderFulfillments['fulfillmentColour'] =
      orderFulfillments['fulfillmentStatus'] == 'PARTIALLY FULFILLED'
        ? 'info'
        : orderFulfillments['fulfillmentColour'];
    orderFulfillments['fulfillmentColour'] =
      orderFulfillments['fulfillmentStatus'] == 'FULFILLED'
        ? 'success'
        : orderFulfillments['fulfillmentColour'];
    orderFulfillments['totalAmount'] = 0;

    await Promise.all(
      orderFulfillments['orderBundles'].map(async (orderBundle) => {
        orderBundle['fulfillmentStatus'] = 'UNFULFILLED';
        orderBundle['fulfillmentColour'] = 'error';
        orderBundle['totalAmount'] = 0;
        await Promise.all(
          orderBundle.bundle.variants.map(async (variant) => {
            orderBundle['totalAmount'] +=
              parseFloat(variant.variant.pricing.price.gross.amount) *
              parseInt(variant.quantity) *
              parseInt(orderBundle.quantity);
            orderFulfillments['totalAmount'] +=
              parseFloat(variant.variant.pricing.price.gross.amount) *
              parseInt(variant.quantity) *
              parseInt(orderBundle.quantity);
          }),
        );
      }),
    );

    await Promise.all(
      orderFulfillments['fulfillments'].map(async (fulfillment) => {
        fulfillment['totalAmount'] = 0;
        await Promise.all(
          fulfillment['fulfillmentBundles'].map(async (fulfillmentBundle) => {
            fulfillmentBundle['fulfillmentStatus'] = 'FULFILLED';
            fulfillmentBundle['fulfillmentColour'] = 'success';
            fulfillmentBundle['totalAmount'] = 0;
            await Promise.all(
              fulfillmentBundle.bundle.variants.map(async (variant) => {
                fulfillmentBundle['totalAmount'] +=
                  parseFloat(variant.variant.pricing.price.gross.amount) *
                  parseInt(variant.quantity) *
                  parseInt(fulfillmentBundle.quantity);
                fulfillment['totalAmount'] +=
                  parseFloat(variant.variant.pricing.price.gross.amount) *
                  parseInt(variant.quantity) *
                  parseInt(fulfillmentBundle.quantity);
              }),
            );
          }),
        );
      }),
    );

    delete orderFulfillments['orderId'];
    return orderFulfillments;
  }
}
