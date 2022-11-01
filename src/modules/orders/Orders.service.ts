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
import { GQL_EDGES_KEY } from 'src/constants';
import { ShopOrdersListDto, ShopOrdersFulfillmentsDto } from './dto';

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
      const shops = (response[GQL_EDGES_KEY] || []).map((shop) => shop['node']);
      const shopOrders: ShopOrdersListDto = { orders: [] };

      await Promise.all(
        (shops || []).map(async (shop) => {
          const orders = shop['orders'];

          await Promise.all(
            orders.map(async (order) => {
              const orderDetails = await OrderHandlers.orderDetailsHandler(
                order['orderId'],
              );
              const orderBundlesTotal = getTotalFromBundles(
                order['orderBundles'],
              );
              const fulfillmentsTotal = getFulfillmentTotal(
                order['fulfillments'],
              );
              const currency = getCurrency(order['orderBundles']);
              const { fulfillments, orderBundles, ...otherOrderAttributes } =
                order;
              shopOrders.orders.push({
                ...otherOrderAttributes,
                ...orderDetails,
                shopName: shop['name'],
                shopId: shop['id'],
                currency: currency,
                totalAmount:
                  Number(orderBundlesTotal.toFixed(2)) +
                    Number(fulfillmentsTotal.toFixed(2)) || 0,
              });
            }),
          );
        }),
      );
      return prepareSuccessResponse(shopOrders, '', 201);
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

    const response: ShopOrdersFulfillmentsDto = {
      ...fulfillmentDetails,
      totalAmount: Number(fulfillmentTotalAmount.toFixed(2)),
      orderBundles: orderFulfillmentBundles,
      fulfillments,
    };

    return response;
  }
}
