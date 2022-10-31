import { Injectable, Logger } from '@nestjs/common';
import * as OrderHandlers from 'src/graphql/handlers/orders';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  getCurrency,
  getTotalFromBundles,
  getFulfillmentTotal,
  addStatusAndTotalToBundles,
  getFulFillmentsWithStatusAndBundlesTotal,
} from './Orders.utils';
import { FulfillmentStatusEnum } from 'src/graphql/enums/orders';
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
        shops.forEach((shop) => {
          const orders = shop['orders'];

          Promise.all(
            orders.forEach(async (order) => {
              const orderDetails = await OrderHandlers.orderDetailsHandler(
                order['orderId'],
              );
              const orderBundlesTotal = getTotalFromBundles(
                order['orderBundles'],
              );
              const fulfillmentsTotal = getFulfillmentTotal(
                order['fulfillments'],
              );

              delete order['fulfillments'];
              delete order['orderBundles'];
              shopOrders.orders.push({
                ...order,
                shopName: shop['name'],
                shopId: shop['id'],
                currency: getCurrency(order['orderBundles']),
                totalAmount: orderBundlesTotal + fulfillmentsTotal || 0,
                ...orderDetails,
              });
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
    let orderFulfillments =
      await OrderHandlers.shopOrderFulfillmentsByIdHandler(id);

    const fulfillmentDetails =
      await OrderHandlers.shopOrderFulfillmentsDetailsHandler(
        orderFulfillments['orderId'],
      );

    const orderFulfillmentBundles = addStatusAndTotalToBundles(
      orderFulfillments['orderBundles'],
      FulfillmentStatusEnum.UNFULFILLED,
    );
    const fulfillments = getFulFillmentsWithStatusAndBundlesTotal(
      orderFulfillments['fulfillments'],
      FulfillmentStatusEnum.FULFILLED,
    );
    const fulfillmentTotalAmount = getTotalFromBundles(
      orderFulfillments['orderBundles'],
    );

    orderFulfillments = {
      ...fulfillmentDetails,
      totalAmount: fulfillmentTotalAmount,
      orderBundles: orderFulfillmentBundles,
      fulfillments,
    };

    return orderFulfillments;
  }
}
